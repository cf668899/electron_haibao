<template>
  <div class="common-layout">
    <el-container>
      <el-aside
        style="width: 200px; height: 100%; background-color: rgb(253, 253, 253)"
      >
        <div class="menu-box">
          <div class="menus">
            <el-menu default-active="Whatsapp" class="el-menu-vertical-demo">
              <!-- wwhatsapp -->
              <el-sub-menu :index="appType" v-for="appType in appTypes">
                <template #title>
                  <el-icon>
                    <ChatDotRound />
                  </el-icon>
                  <span @click="toAppManager(appType)">{{ appType }}</span>
                </template>
                <el-menu-item
                  v-show="item.isActive"
                  :class="item.id == id ? 'active-bg' : ''"
                  @click="toApp(item)"
                  v-for="(item, index) in applist[appType]"
                  :index="item.id"
                >
                  <template #title>
                    <div
                      :class="item.online ? 'online online-box' : 'online-box'"
                    ></div>
                    <el-icon>
                      <User />
                    </el-icon>

                    <div class="userinfo">
                      <!-- <div>{{ }}</div> -->
                      <el-badge :value="item.messageNum" :hidden="item.messageNum?false:true" >
                        <div class="username">
                          {{
                            item.name
                              ? item.name
                              : item.record
                                ? item.record
                                : appType +
                                  " " +
                                  (applist[appType].length - index)
                          }}
                        </div>
                    </el-badge>

                    </div>
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item index="more" @click="moreSetting()" style="border-top: 1px solid #409eff;" >
                  <el-icon><setting /></el-icon>
                  <span>更多操作</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div class="operator-box">
            <div class="logout">
              <el-button type="warning" style="width: 80%;">退出</el-button>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <AppList
          v-show="pageType == 'manager'"
          :app-type="appType"
          :list="applist[appType] ? applist[appType] : []"
          @addApp="addApp"
          @startApp="startApp"
          @closeApp="closeApp"
          @showApp="showApp"
          @delApp="delApp"
        >
        </AppList>
        <WebViewX
          v-show="pageType == 'app' && item.isShow"
          :data="item"
          v-for="item in apps"
          @changeRecord="changeRecord"
          @online="online"
          @changeMessageNum="changeMessageNum"
        ></WebViewX>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import AppList from "@/components/AppList.vue";
import WebViewX from "@/components/WebViewX.vue";
const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
export default {
  components: {
    AppList,
    WebViewX,
  },
  data() {
    return {
      test: "",
      id: "",
      applist: {
        Whatsapp: [],
      },
      appType: "Whatsapp",
      pageType: "manager",
      apps: [],
      appTypes: ["Whatsapp", "Telegram"],
      srcMap: {
        Whatsapp: "https://web.whatsapp.com/",
        Telegram: "https://web.telegram.org/",
      },
    };
  },
  created() {
    this.listApp();
  },
  methods: {
    moreSetting(){
      this.pageType = "setting";
      this.appType = type;
    },
    toAppManager(type) {
      this.pageType = "manager";
      this.appType = type;
    },
    toApp(data) {
      this.id = data.id;
      this.pageType = "app";
      for (let item of this.apps) {
        if (data.id == item.id) {
          item.isShow = true;
          continue;
        }
        item.isShow = false;
      }
    },

    addApp(data) {
      console.log("add app");
      ipc.invoke("controller.app.add", data).then((res) => {
        // 查询数据
        // this.listApp();
        if(res.id){
          this.applist[data.type].unshift(res)
        }
      });
    },
    startApp(data) {
      // 保存preload
      ipc.invoke("controller.app.savePreload", JSON.parse(JSON.stringify(data))).then(res=>{
        console.log(res)
      })
      this.id = data.id;
      let app = null

      for (let item of this.apps) {
        item.isShow = false;
        if(item.id == data.id){
          app = item;
          item.isShow = true
          item.isActive = true
        }
      }

      if(!app){
        data.isShow = true
        data.isActive = true
        this.apps.push(data);
      }
      
      let list = this.applist[data.type];
      for (let item of list) {
        if (data.id == item.id) {
          item.isActive = true
          item.isShow = true;
          app = item
          continue;
        }
      }

      this.pageType = "app";
    },
    showApp(data) {
      this.id = data.id;
      for (let item of this.apps) {
        if (data.id == item.id) {
          item.isShow = true;
          continue;
        } else {
          item.isShow = false;
        }
      }
      this.pageType = "app";
    },
    closeApp(data) {
      for (let item of this.apps) {
        if (item.id == data.id) {
          item.isActive = false
          item.online = false
        }else{
          item.isShow = false
        }
      }

      let list = this.applist[data.type];
      for (let item of list) {
        if (data.id == item.id) {
          item.isActive = false;
          item.isShow = false;
          item.online = false
        }
      }
    },
    delApp(data) {
      ipc
        .invoke("controller.app.del", JSON.parse(JSON.stringify(data)))
        .then((res) => {
          let list = this.applist[data.type];
          let newList = [];
          for (let item of list) {
            if (data.id == item.id) {
              continue;
            }

            newList.push(item);
          }

          this.applist[data.type] = newList;
        });
    },
    changeRecord(data){
      ipc.invoke("controller.app.changeRecord", data).then(res=>{
        for (let item of this.apps) {
          if (data.id == item.id) {
            item.record = data.record
            item.online= true
          }
        }

        let list = this.applist[data.type];
        for (let item of list) {
            if (data.id == item.id) {
              item.record = data.record;
              item.online= true
            }
        }

      })
    },
    online(data){
        for (let item of this.apps) {
          if (data.id == item.id) {
            item.online = true
          }
        }

        let list = this.applist[data.type];
        for (let item of list) {
            if (data.id == item.id) {
              item.online = true
            }
        }

        // this.$forceUpdate()
    },
    changeMessageNum(data){
      let list = this.applist[data.type];
        for (let item of list) {
            if (data.id == item.id) {
              item.messageNum = data.data
            }
        }
    },
    listApp() {
      ipc.invoke("controller.app.list").then((data) => {
        data.sort((a, b) => {
          return b.sort - a.sort;
        });
        const groupedBy = {};

        for (const item of data) {
          if (groupedBy[item.type]) {
            groupedBy[item.type].push(item);
          } else {
            groupedBy[item.type] = [item];
          }
        }
        this.applist = groupedBy;
      });
    },
  },
};
</script>
<style scoped>
.el-main {
  padding: 0px;
}

.common-layout {
  height: 100%;
  background-color: rgb(248, 246, 245);
}

.el-container {
  height: 100%;
}

.menu-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.userinfo {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}


.username {
  width: 90px;
  color: rgb(146, 151, 157);
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 溢出部分显示省略号 */
}

.online-box {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: rgb(99, 101, 103);
}
.online {
  background-color: #409eff;
}

.active-bg {
  background-color: aliceblue;
}
.operator-box{
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 1000;
  background-color: aliceblue;
  height: 100px;
}

.token-box {
  margin: 0 auto;
  width: 80%;
  text-align: center;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 溢出部分显示省略号 */
}

.logout{
  background-color: #ffff;
  height: 100px;
  width: 100%;
  line-height: 100px;
  position: absolute;
  bottom: 0;
}
</style>
