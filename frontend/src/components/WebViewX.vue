<template>
  <el-container v-if="data.isActive">
    <el-main>
      <webview :ref="data.id" :id="data.id" style="height: 100%" :src="srcMap[data.type]"
        :partition="'persist:' + data.id" nodeintegration :preload="preload"
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36">
      </webview>
    </el-main>
    <el-aside class="webview-aside" width="250px">
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
        <el-tab-pane label="设置"  name="设置">
          <template #label>
            <span>
              <el-icon>
                <Setting />
              </el-icon>
            </span>
          </template>
          <QuickReply :data="data" @reply="reply"></QuickReply>
        </el-tab-pane>
        <el-tab-pane label="翻译"  name="翻译">
          <template #label>
            <span>
              <el-icon>
                <Help />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="代理" name="代理">
          <template #label>
            <span>
              <el-icon>
                <Aim />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="用户" name="用户">
          <template #label>
            <span>
              <el-icon><User /></el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="刷新" name="刷新">
          <template #label>
            <span @click="reload">
              <el-icon><RefreshRight /></el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>

<script>
import QuickReply from './QuickReply.vue';
const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
const path = require('path');
const Ps = require('ee-core/ps');
export default {
  name: "webviewx",
  props: ["data"],
  emits: ['changeRecord', 'online', 'changeMessageNum'],
  components: { QuickReply },
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
          source:"EN",
          target:"ZH"
        },
        inputContent:{
          open: true,
          source:"ZH",
          target:"EN"
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
    reload(){
      this.view?.reload()
    },
    reply(data, text) {
      this.view?.send('quickReply', text);
    },
    init() {
      this.$nextTick(() => {
        let view = this.$refs[this.data.id];
        this.inject(view);
      });
    },
    inject(view) {
      this.injectHandler(view);
    },
    injectHandler(view) {
      view.addEventListener("dom-ready", () => {
        this.view = view
        view.openDevTools();
        view.addEventListener('ipc-message', (event) => {
          console.log(event);
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
        });

        // 定时设置
        setTimeout(() => {
          this.translateChange()
        }, 2000);
      });
    },
    translateChange(){
      this.view?.send('translateInfoChange', JSON.stringify(this.translateInfo));
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
