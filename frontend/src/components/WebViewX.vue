<template>
  <el-container v-if="data.isActive">
    <el-main>
      <webview :ref="data.id" :id="data.id" style="height: 100%" :src="srcMap[data.type]"
        :partition="'persist:' + data.id" nodeintegration :preload="preload"
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36">
      </webview>
    </el-main>
    <el-aside class="webview-aside" width="350px">
      <el-tabs tab-position="right" style="height: 100%" v-model="tabValue" :before-leave="beforeLeave">
        <el-tab-pane label="伸缩"  name="伸缩">
          <template #label>
            <span>
              <el-icon>
                <Expand />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="快捷回复"  name="快捷回复">
          <template #label>
            <span>
              <el-icon><Position /></el-icon>
            </span>
          </template>
          <QuickReply :data="data" @reply="reply"></QuickReply>
        </el-tab-pane>
        <el-tab-pane label="翻译"  name="翻译">
          <template #label>
            <span>
              <el-icon><Connection /></el-icon>
            </span>
          </template>
          <TranslateSetting :data="translateInfo" @change="translateSettingChange" ></TranslateSetting>
        </el-tab-pane>
        <el-tab-pane label="代理"  name="代理">
          <template #label>
            <span>
              <el-icon><Orange /></el-icon>
            </span>
          </template>
          <ProxySetting :data="proxyInfo" @change="proxySettingChange" ></ProxySetting>
        </el-tab-pane>
        <el-tab-pane label="用户" name="用户">
          <template #label>
            <span>
              <el-icon><User /></el-icon>
            </span>
          </template>
          <UserInfo ref="userInfo" :data="data" @changeFriendInfo="changeFriendInfo" ></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="刷新" name="刷新">
          <template #label>
            <span @click="reload">
              <el-icon><RefreshRight /></el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="关闭" name="关闭">
          <template #label>
            <span @click="close">
              <el-icon><CircleClose /></el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>

<script>
import QuickReply from './chat/QuickReply.vue';
import TranslateSetting from './chat/TranslateSetting.vue';
import ProxySetting from './chat/ProxySetting.vue';
import UserInfo from './chat/UserInfo.vue'
const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
const path = require('path');
const Ps = require('ee-core/ps');
export default {
  name: "webviewx",
  props: ["data"],
  emits: ['changeRecord', 'online', 'changeMessageNum', 'changeUserName','closeApp'],
  components: { QuickReply, TranslateSetting, ProxySetting,  UserInfo },
  data() {
    return {
      tabValue:"翻译",
      preload: "file://" + path.join(Ps.getHomeDir(), `${this.data.type}.js`),
      srcMap: {
        Whatsapp: "https://web.whatsapp.com",
        Telegram: "https://web.telegram.org",
      },
      view: null,
      translateInfo:{
        channel: 'deepl',
        message: {
          open: true,
          source:"en-US",
          target:"zh"
        },
        inputContent:{
          open: true,
          source:"zh",
          target:"en-US"
        }
      },
      proxyInfo:{
        message: {
          openproxy: false,
          proxy:"",
          address:"",
          port:"",
          openpwd:false,
          username:"",
          pwd:"",
        }
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    beforeLeave(activeName, oldActiveName){
      if(activeName == '伸缩' || activeName=='刷新'){
        return false
      }

      return true
    },
    close(){
      this.$emit('closeApp', this.data)
    },
    reload(){
      this.view?.reload()
    },
    reply(data, text) {
      this.view?.send('quickReply', text);
    },
    async init() {
      if(this.data.translateInfo){
        this.translateInfo = this.data.translateInfo
      }else{
        // 使用公共配置
        let info = await ipc.invoke("controller.config.getTranslate")
        console.log(info)
        let type = this.data.type
        let its = info.apps.filter(item=>{
          if(item.type == type){
            return true
          }
          return false
        })

        if(its.length){
          console.log("修改翻译设置")
          let data = its[0]
          this.translateInfo = {
            channel: info.channel,
            message: {
              open: info.autoTranslate,
              source: data.target,
              target: data.receive
            },
            inputContent:{
              open: info.autoTranslate,
              source: data.receive,
              target: data.receive
            }
          }
        }

      }
      if(this.data.proxyInfo){
        this.proxyInfo = this.data.proxyInfo
      }

      this.$nextTick(() => {
        let view = this.$refs[this.data.id];
        this.inject(view);
      });
    },
    inject(view) {
      this.view = view
      this.injectHandler(view);
    },
    injectHandler(view) {
      view.addEventListener("dom-ready", () => {
        // this.view = view
        view.openDevTools();
        view.addEventListener('ipc-message', (event) => {
          let eventData = JSON.parse(event.channel);
          if (eventData.type == 'changeRecord') {
            // 修改记录值
            this.$emit("changeRecord", { id: this.data.id, "record": eventData.data, type: this.data.type });
          }
          if (eventData.type == 'online') {
            this.$emit('online', { id: this.data.id, type: this.data.type });
          }
          if (eventData.type == 'changeMessageNum') {
            this.$emit('changeMessageNum', { id: this.data.id, type: this.data.type, data: eventData.data });
          }

          if (eventData.type == 'changeUserName') {
            this.$emit('changeUserName', { id: this.data.id, type: this.data.type, name:eventData.data.title, data: eventData.data });
          }

          if(eventData.type == 'changeFriendInfo') {
            this.$refs.userInfo.openChange(eventData.data)
          }

          if(eventData.type == 'runJs'){
            this.view?.executeJavaScript(eventData.data, true)
          }

          if(eventData.type == 'insertText'){
            console.log("输入文本！！")
            this.view?.delete()
            this.view?.insertText(eventData.data)
          }

        });

        // 定时设置
        setTimeout(() => {
          this.translateChange()
          this.initFriend()
        }, 1000);
      });
    },
    translateSettingChange(data){
      this.translateInfo = data
      // 修改app翻译信息
      ipc.invoke("controller.app.changeTranslate", JSON.parse(JSON.stringify({
        id: this.data.id,
        translateInfo: data
      }))).then(res=>{
        this.translateChange()
      })
    },
    translateChange(){
      this.view?.send('translateInfoChange', JSON.stringify(this.translateInfo));
    },
    proxySettingChange(data){
      this.proxyInfo = data
      // 修改app代理信息
      ipc.invoke("controller.app.changeProxyInfo", JSON.parse(JSON.stringify({
        id: this.data.id,
        proxyInfo: data
      }))).then(res=>{
        this.proxyeChange()
      })
    },
    proxyeChange(){
      this.view?.send('proxySettingChange', JSON.stringify(this.proxyInfo));
    },
    changeFriendInfo(data){
      console.log('保存联系人', data)
      let app = {
        id: this.data.id,
        friendInfo: data 
      }
      this.view?.send('changeFriendInfo', JSON.stringify(app));
      // this.data.friendInfo[data.id] = data
    },
    initFriend(){
      if(this.data.friendInfo){
        this.view?.send('friendInfoChange', JSON.stringify(this.data.friendInfo));
      }
    }
  }
};
</script>
<style scoped>
.el-main {
  padding: 0;
}

.vebview-aside {
  max-width: 250px;
}
</style>
