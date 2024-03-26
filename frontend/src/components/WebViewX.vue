<template>
  <el-container v-if="data.isActive">
    <el-main class="mainClass">
      <el-progress v-if="percentage<100" :stroke-width="4" :show-text="false" :percentage="percentage" />
      <div v-else class="progressXDiv"/>
      <webview
        :ref="data.id"
        :id="data.id"
        style="flex:1;"
        :src="srcMap[data.type].url"
        :partition="'persist:' + data.id"
        nodeintegration
        :preload="preload"
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      >
      </webview>
    </el-main>
    <el-aside :class="expansion ? 'viebview-aside' : 'viebview-aside-mini'">
      <el-tabs
        tab-position="right"
        style="height: 100%"
        v-model="tabValue"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="伸缩" name="伸缩">
          <template #label>
            <span @click="expansionChange">
              <el-icon>
                <Expand />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="快捷回复" name="快捷回复">
          <template #label>
            <span @click="openMenu">
              <el-icon>
                <Position/>
              </el-icon>
            </span>
          </template>
          <QuickReply :data="data" @reply="reply" :tabValue="tabValue"></QuickReply>
        </el-tab-pane>
        <el-tab-pane label="翻译" name="翻译">
          <template #label>
            <span @click="openMenu">
              <el-icon>
                <Connection />
              </el-icon>
            </span>
          </template>
          <TranslateSetting
            :data="translateInfo"
            @change="translateSettingChange"
          ></TranslateSetting>
        </el-tab-pane>
        <el-tab-pane label="代理" name="代理">
          <template #label>
            <span @click="openMenu">
              <el-icon>
                <Orange />
              </el-icon>
            </span>
          </template>
          <ProxySetting
            :id="data.id"
            :data="proxyInfo"
            @change="proxySettingChange"
          ></ProxySetting>
        </el-tab-pane>
        <el-tab-pane label="用户" name="用户">
          <template #label>
            <span @click="openMenu">
              <el-icon>
                <User />
              </el-icon>
            </span>
          </template>
          <UserInfo
            ref="userInfo"
            :data="data"
            @changeFriendInfo="changeFriendInfo"
          ></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="刷新" name="刷新">
          <template #label>
            <span @click="reload">
              <el-icon>
                <RefreshRight />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="关闭" name="关闭">
          <template #label>
            <span @click="close">
              <el-icon>
                <CircleClose />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>

<script>
import QuickReply from "./chat/QuickReply.vue";
import TranslateSetting from "./chat/TranslateSetting.vue";
import ProxySetting from "./chat/ProxySetting.vue";
import UserInfo from "./chat/UserInfo.vue";
import { accountSave } from "@/api/admin";
import { appMap } from "@/constant/app.js"
const { ipcRenderer: ipc } =
  (window.require && window.require("electron")) || window.electron || {};
const path = require("path");
const Ps = require("ee-core/ps");
import { ElMessage } from "element-plus";
import emitter from '@/utils/bus'
export default {
  name: "webviewx",
  props: ["data"],
  emits: [
    "changeRecord",
    "online",
    "changeMessageNum",
    "changeUserName",
    "closeApp",
  ],
  components: { QuickReply, TranslateSetting, ProxySetting, UserInfo },
  data() {
    return {
      tabValue: '翻译',
      preload: 'file://' + path.join(Ps.getHomeDir(), `${this.data.type}.js`),
      srcMap: appMap,
      view: null,
      translateInfo: {
        channel: "deepl",
        message: {
          open: true,
          source: "en-US",
          target: "zh",
        },
        inputContent: {
          open: true,
          source: "zh",
          target: "en-US",
        },
      },
      isReload: false,
      proxyInfo: {
        open: false,
        type: "HTTP",
        host: "",
        port: "",
        auth: false,
        user: "",
        password: "",
        cookieOpen: false,
      },
      expansion: true,
      percentage: 0
    };
  },
  watch: {
    // 直接监听props中的对象属性
    "data.isActive": {
      handler(newValue, oldValue) {
        console.log(oldValue, newValue);
        if (newValue) {
          this.init();
        }
      },
    },
  },
  created() {
    this.init()
    emitter.on('soft-setting', (data) => {
      this.view?.send("setTransformClassChange");
    })
  },
  methods: {
    openMenu() {
      this.expansion = true;
    },
    expansionChange() {
      this.expansion = !this.expansion;
    },
    beforeLeave(activeName, oldActiveName) {
      if (activeName == "伸缩" || activeName == "刷新") {
        return false;
      }

      return true;
    },
    close() {
      this.$emit("closeApp", this.data);
    },
    reload() {
      this.isReload = true;
      this.view?.reload();
    },
    reply(data, text) {
      this.view?.send("quickReply", text);
    },
    async init() {
      this.initData()
      this.$nextTick(() => {
        let view = this.$refs[this.data.id]
        this.inject(view)
      })
    },
    async initData(){
      //TODO 把最新的数据拉回来？
      let app = await ipc.invoke("controller.app.getAppById", this.data.id)
      console.log(app)
      if (app.translateInfo) {
        this.translateInfo = app.translateInfo;
      } else {
        // 使用公共配置
        let info = await ipc.invoke("controller.config.getTranslate");
        console.log(info);
        let type = this.data.type;
        let its = info.apps.filter((item) => {
          if (item.type == type) {
            return true;
          }
          return false;
        });

        if (its.length) {
          console.log("修改翻译设置");
          let data = its[0];
          this.translateInfo = {
            channel: info.channel,
            message: {
              open: info.autoTranslate,
              source: data.target,
              target: data.receive,
            },
            inputContent: {
              open: info.autoTranslate,
              source: data.receive,
              target: data.receive,
            },
          };
        }
      }
      if (app.proxyInfo) {
        this.proxyInfo = app.proxyInfo;
      } else {
        // 公共配置
        ipc.invoke("controller.config.getProxy").then((res) => {
          if (res) {
            this.proxyInfo = res;
          }
        });
      }
      if(app.friendInfo){
        this.data.friendInfo = app.friendInfo
      }
    },
    inject(view) {
      this.injectHandler(view)
    },
    injectHandler(view) {
      view.addEventListener('did-start-loading', () => {
        this.proxyeChange();
        console.log('did-start-loading 20%')
        this.percentage = 20
      });
      view.addEventListener('load-commit', ()=>{
        console.log('load-commit 40%')
        this.percentage = 40
      })

      view.addEventListener('did-frame-finish-load', ()=>{
        console.log('did-frame-finish-load 60%')
        this.percentage = 60
      })

      view.addEventListener('did-finish-load', ()=>{
        console.log('did-finish-load 80%')
        this.percentage = 80
      })

      view.addEventListener('did-stop-loading', () => {
        // 隐藏加载进度条
        console.log('加载完成 100%')
        this.percentage = 100
      });
      view.addEventListener("dom-ready", () => {
        if (!this.isReload) {
          this.view = view;
          this.proxyeChange();
          view.openDevTools();
          view.addEventListener("ipc-message", async (event) => {
            let eventData = JSON.parse(event.channel);
            if (eventData.type == "el-message") {
              ElMessage(eventData.data);
              return;
            }
            if (eventData.type == "changeRecord") {
              // 修改记录值
              this.$emit("changeRecord", {
                id: this.data.id,
                record: eventData.data,
                type: this.data.type,
              });
            }
            if (eventData.type == "online") {
              this.$emit("online", { id: this.data.id, type: this.data.type });
              // 上线
              let app = await ipc.invoke(
                "controller.app.getAppById",
                this.data.id
              );
              app.netInfo.status = "1";
              if (app.netInfo) {
                let account = await accountSave(app.netInfo);
                console.log(account);
                if (account.id) {
                  // app.netInfo = account
                  ipc.invoke("controller.app.update", app);
                }
              }
            }
            if (eventData.type == "changeMessageNum") {
              this.$emit("changeMessageNum", {
                id: this.data.id,
                type: this.data.type,
                data: eventData.data,
              });
            }

            if (eventData.type == "changeUserName") {
              this.$emit("changeUserName", {
                id: this.data.id,
                type: this.data.type,
                name: eventData.data.title,
                avatar: eventData.data.avatar,
                data: eventData.data,
              });
              let app = await ipc.invoke(
                "controller.app.getAppById",
                this.data.id
              );
              if (app.netInfo) {
                app.netInfo.nickname = eventData.data.title;
                app.netInfo.account = eventData.data.title;
                app.netInfo.avatar = eventData.data.avatar;
                if (eventData.data.contactsCount) {
                  app.contactsCount = eventData.data.contactsCount;
                }
                let account = await accountSave(app.netInfo);
                if (account.id) {
                  // app.netInfo = account
                  ipc.invoke("controller.app.update", app);
                }
              }
            }

            if (eventData.type == "changeFriendInfo") {
              this.$refs.userInfo.openChange(eventData.data);
            }

            if (eventData.type == "runJs") {
              this.view?.executeJavaScript(eventData.data, true);
            }

            if (eventData.type == "insertText") {
              console.log("输入文本！！");
              this.view?.delete();
              this.view?.insertText(eventData.data);
            }
          });
        }

        this.initData()
        this.isReload = false;
        // 定时设置
        setTimeout(() => {
          this.translateChange();
          this.initFriend();
        }, 1000);
      });
    },
    translateSettingChange(data) {
      this.translateInfo = data;
      // 修改app翻译信息
      ipc
        .invoke(
          "controller.app.changeTranslate",
          JSON.parse(
            JSON.stringify({
              id: this.data.id,
              translateInfo: data,
            })
          )
        )
        .then((res) => {
          this.translateChange();
        });
    },
    translateChange() {
      this.view?.send(
        "translateInfoChange",
        JSON.stringify(this.translateInfo)
      );
    },
    proxySettingChange(data) {
      this.proxyInfo = data;
      // 修改app代理信息
      ipc
        .invoke(
          "controller.app.changeProxyInfo",
          JSON.parse(
            JSON.stringify({
              id: this.data.id,
              proxyInfo: data,
            })
          )
        )
        .then((res) => {
          this.proxyeChange();
          this.reload()
        });
    },
    proxyeChange() {
      if (this.view) {
        console.log("修改代理");
        ipc.invoke(
          "controller.app.settingProxy",
          JSON.parse(
            JSON.stringify({
              id: "persist:" + this.data.id,
              proxyInfo: this.proxyInfo,
            })
          )
        );
      }
    },
    changeFriendInfo(data) {
      console.log("保存联系人", data);
      let app = {
        id: this.data.id,
        friendInfo: data,
      };
      this.view?.send("changeFriendInfo", JSON.stringify(app));
    },
    initFriend() {
      if (this.data.friendInfo) {
        this.view?.send(
          "friendInfoChange",
          JSON.stringify(this.data.friendInfo)
        );
      }
    },
  },
};
</script>
<style scoped>
.el-main {
  padding: 0;
}

.viebview-aside {
  width: 350px;
  transition: width 0.5s; /* 过渡动画效果 */
  border-right: solid 1px var(--el-menu-border-color) !important;
  overflow-x: hidden;
  border-left: solid 1px rgb(237, 230, 230);
  background-color: #ffff;
}
.viebview-aside-mini {
  width: 50px !important;
  transition: width 0.3s; /* 过渡动画效果 */
  border-right: solid 1px var(--el-menu-border-color) !important;
  overflow-x: hidden;
}
.mainClass{
  display: flex;
  flex-direction:column;
  padding: 0px 4px 4px 4px;
  background-color: rgb(232,232,232);
}
.progressXDiv{
  height: 4px;
  width: 4px;
  background-color: rgb(232,232,232);
}
</style>
