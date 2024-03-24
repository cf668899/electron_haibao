<template>
  <div class="common-layout" @click="lockMonitor" v-show="!isLock">
    <el-container>
      <el-aside
        style="height: 100%; background-color: rgb(253, 253, 253)"
        :class="isReduceLeft ? 'boxLeftReduce' : 'boxLeftNoReduce'"
      >
        <div class="menu-box">
          <div class="menus">
            <el-menu default-active="Whatsapp" class="el-menu-vertical-demo">
              <!-- wwhatsapp -->
              <el-sub-menu
                :index="appItem.name"
                v-for="(appItem, index) in leftList"
                :key="index"
                :class="getItemClassName(appItem) ? 'itemNoMuch' : ''"
              >
                <template #title>
                  <div @click="toAppManager(appItem.name)" class="leftItemBox">
                    <img :src="appItem.image" class="iconImage" />
                    <span
                      :class="clickMenu == appItem.name ? 'menuTitle' : ''"
                      >{{ appItem.name }}</span
                    >
                  </div>
                </template>
                <el-menu-item
                  v-show="item.isActive"
                  :key="item.id"
                  :class="item.id == id ? 'active-bg' : ''"
                  @click="toApp(item)"
                  v-for="(item, index) in appList[appItem.name]"
                  :index="item.id"
                >
                  <template #title>
                    <div
                      :class="item.online ? 'online online-box' : 'online-box'"
                    ></div>
                    <el-icon>
                      <User v-if="!item.avatar" />
                      <el-avatar
                        v-if="item.avatar"
                        :size="20"
                        :src="item.avatar"
                      />
                    </el-icon>

                    <div class="userinfo">
                      <!-- <div>{{ }}</div> -->
                      <el-badge
                        :value="item.messageNum"
                        :hidden="item.messageNum ? false : true"
                      >
                        <div v-if="item.record" class="username">
                          <div class="usernameTop">{{ item.record }}</div>
                          <div class="usernameBottom">
                            {{
                              settingData.text === '1' ? item.name : item.remark
                            }}
                          </div>
                        </div>
                        <div v-else-if="item.name">
                          {{
                            appItem.name +
                            ' ' +
                            (appList[appItem.name].length - index)
                          }}
                        </div>
                      </el-badge>
                    </div>
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu
                index="quickReply"
                @click="moreSetting('quickReply')"
                style="border-top: 1px solid rgb(232, 232, 232)"
                key="quickReply"
                class="itemNoMuch"
              >
                <template #title>
                  <img src="@/assets/quickReply.png" class="iconImage" />
                  <span :class="clickMenu == 'quickReply' ? 'menuTitle' : ''"
                    >快捷回复</span
                  >
                </template>
              </el-sub-menu>
              <el-sub-menu
                index="setting"
                @click="moreSetting('setting')"
                key="setting"
                class="itemNoMuch"
              >
                <template #title>
                  <img src="@/assets/moreSetting.png" class="iconImage" />
                  <span :class="clickMenu == 'setting' ? 'menuTitle' : ''"
                    >更多设置</span
                  >
                </template>
              </el-sub-menu>
            </el-menu>
          </div>
          <div class="operator-box">
            <div class="logout">
              <div class="ysBoxF" v-if="!isReduceLeft" @click="loginOut">
                <div class="ysBox">
                  <img class="ys" src="@/assets/yaos.png" />
                  <div class="ysBoxCenter">
                    <div class="ysBoxCenterTop">邀请码</div>
                    <div class="ysToken">{{ token }}</div>
                  </div>
                  <el-icon size="20">
                    <SwitchButton />
                  </el-icon>
                </div>
              </div>
              <!-- <el-button
                type="warning"
                class="quiteButton"
                style="width: 80%"

                >退出</el-button
              > -->
              <div>
                <el-icon
                  @click="arrowLeft"
                  :class="
                    isReduceLeft
                      ? 'arrowLeftTransformCommon arrowLeftTransform'
                      : 'arrowLeftTransformCommon'
                  "
                >
                  <ArrowLeft />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <AppList
          v-if="pageType === 'manager'"
          :app-type="appType"
          :list="appList[appType] ? appList[appType] : []"
          :appNum="appNum"
          :appLimit="appLimit"
          @addApp="addApp"
          @startApp="startApp"
          @closeApp="closeApp"
          @showApp="showApp"
          @delApp="delApp"
        >
        </AppList>
        <WebViewX
          v-show="pageType === 'app' && item.isShow"
          :data="item"
          v-for="(item, index) in apps"
          @changeRecord="changeRecord"
          @online="online"
          @changeMessageNum="changeMessageNum"
          @changeUserName="changeUserName"
          @closeApp="closeApp"
          :key="index"
        ></WebViewX>
        <MoreSetting
          v-if="pageType == 'setting'"
          :appTypes="appTypes"
          @updateAppTypes="updateAppTypes"
          :appList="appList"
        ></MoreSetting>
        <quick-replay v-if="pageType == 'quickReply'" />
      </el-main>
    </el-container>
  </div>

  <!-- 锁屏 -->
  <div v-show="isLock" class="common-layout">
    <LockView @unLock="unLock" @loginOut="loginOut"></LockView>
  </div>
</template>
<script>
import AppList from '@/components/AppList.vue'
import WebViewX from '@/components/WebViewX.vue'
import WhatsappIcon from '@/assets/whatsapp.png'
import TelegramIcon from '@/assets/Telegram.png'
import MoreSetting from '@/components/MoreSetting.vue'
import { mapState } from 'vuex'
import LockView from '@/components/LockView.vue'
import { ElMessage } from 'element-plus'
import { logout, accountSave, removeAccount, getOnlineCount } from '@/api/admin'
import { baseWsUrl } from '@/constant/request'
import { appMap } from '@/constant/app'
const UtilsHelper = require('ee-core/utils/helper')
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
import emitter from '@/utils/bus'
import QuickReplay from '@/components/QuickReplay.vue'
import _ from 'lodash'
export default {
  components: {
    AppList,
    WebViewX,
    MoreSetting,
    LockView,
    QuickReplay,
  },
  data() {
    return {
      isReduceLeft: false,
      test: '',
      id: '',
      appList: {
        Whatsapp: [],
        Telegram: [],
      },
      appType: 'Whatsapp',
      pageType: 'manager',
      apps: [],
      appNum: 0,
      appLimit: 5,
      appTypes: [
        {
          name: 'Whatsapp',
          image: WhatsappIcon,
          used: true,
          show: false,
        },
        {
          name: 'Telegram',
          image: TelegramIcon,
          used: true,
          show: false,
        },
      ],
      clickMenu: '',
      token: '',
      lastActive: Date.now(),
      isLock: false,
      settingData: {},
      finishOut: true,
    }
  },
  computed: {
    leftList() {
      console.log('appList==', this.userData)
      return this.appTypes.filter((i) => i.used && i.show)
    },
    ...mapState({
      userData: (state) => state.user.userData,
    }),
  },
  created() {
    this.clickMenu = this.appTypes[0].name
    this.listApp()
    ipc.invoke('controller.login.getLoginData', {}).then((res) => {
      if (res && res.token) {
        this.token = res.token
      }
    })
    emitter.on('soft-setting', (data) => {
      this.getSettingData()
    })
    this.initOline()
    this.initLockSetInterval()
    this.initWs()
    this.reSetPermissionList()
  },
  methods: {
    async getSettingData() {
      const res = await ipc.invoke('controller.app.getCommonStorage', {
        key: 'SoftSetting',
      })
      if (res) {
        this.settingData = JSON.parse(res)
      }
    },
    async initOline() {
      const loginInfo = await ipc.invoke('controller.config.getConfig', 'login')
      let res = await getOnlineCount({
        inviteCode: loginInfo.token,
      })
      this.appNum = res.onlineCount
      this.appLimit = res.totalCount
    },
    initLockSetInterval() {
      ipc.invoke('controller.config.getConfig', 'lock').then((res) => {
        if (res) {
          if (res.lockTime > 0) {
            if (global.intervalGlobal) {
              clearInterval(global.intervalGlobal)
              global.intervalGlobal = null
            }
            global.intervalGlobal = setInterval(() => {
              let now = Date.now()
              if (now - this.lastActive > res.lockTime * 1000 * 60) {
                this.isLock = true
              }
            }, 1000)
          }
        }
      })
    },
    unLock(password, success) {
      ipc.invoke('controller.config.getConfig', 'lock').then((res) => {
        if (res) {
          if (!res.password || res.password == password) {
            this.isLock = false
            this.lastActive = Date.now()
            success && success()
          } else {
            ElMessage.error('密码错误！！')
          }
        } else {
          this.isLock = false
          this.lastActive = Date.now()
        }
      })
    },
    lockMonitor() {
      this.lastActive = Date.now()
      this.initLockSetInterval()
    },
    selectMenu(index) {
      console.log(index)
    },
    getItemClassName(appItem) {
      if (
        !(
          this.appList[appItem.name] &&
          this.appList[appItem.name].length > 0 &&
          this.appList[appItem.name].find((i) => i && i.isActive)
        )
      ) {
        return true
      }
      return false
    },
    arrowLeft() {
      this.isReduceLeft = !this.isReduceLeft
    },
    moreSetting(type) {
      this.pageType = type
      this.appType = type
      this.clickMenu = type
    },
    toAppManager(type) {
      this.pageType = 'manager'
      this.appType = type
      this.clickMenu = type
    },
    toApp(data) {
      this.id = data.id
      for (let item of this.apps) {
        if (data.id == item.id) {
          item.isShow = true
          continue
        }
        item.isShow = false
      }

      this.pageType = 'app'
    },

    async addApp(data) {
      // TODO 调用新增接口
      const loginInfo = await ipc.invoke('controller.config.getConfig', 'login')
      const machineId = await ipc.invoke('controller.app.getMachineId', {})
      data.id = UtilsHelper.getRandomString()
      let accountRes = await accountSave({
        inviteCode: loginInfo.token,
        deviceId: machineId,
        platformId: appMap[data.type].id,
        clientSessionId: data.id,
        account: '-',
      })
      console.log(accountRes)
      data['netInfo'] = accountRes
      let res = await ipc.invoke('controller.app.add', data)
      if (res.id) {
        if (this.appList[data.type]) {
          this.appList[data.type].unshift(res)
        } else {
          this.appList[data.type] = [res]
        }
      }
    },
    startApp(data) {
      // 保存preload
      if (this.appLimit <= this.appNum) {
        ElMessage({
          message: '会话已达上限',
          type: 'warning',
        })
        return
      }
      ipc
        .invoke('controller.app.savePreload', JSON.parse(JSON.stringify(data)))
        .then((res) => {
          console.log(res)
        })
      this.id = data.id
      let app = null

      for (let item of this.apps) {
        item.isShow = false
        if (item.id == data.id) {
          app = item
          item.isShow = true
          item.isActive = true
        }
      }

      if (!app) {
        data.isShow = true
        data.isActive = true
        this.apps.push(data)
      }

      let list = this.appList[data.type]
      for (let item of list) {
        if (data.id == item.id) {
          item.isActive = true
          item.isShow = true
          app = item
          continue
        }
      }

      this.pageType = 'app'
    },
    showApp(data) {
      this.id = data.id
      for (let item of this.apps) {
        if (data.id == item.id) {
          item.isShow = true
          continue
        } else {
          item.isShow = false
        }
      }
      this.pageType = 'app'
    },
    async closeApp(data) {
      let app = await ipc.invoke('controller.app.getAppById', data.id)
      if (app.netInfo) {
        app.netInfo.status = '2'
        let account = await accountSave(app.netInfo)
        if (account.id) {
          ipc.invoke('controller.app.update', app)
        }
      }

      for (let item of this.apps) {
        if (item.id == data.id) {
          item.isActive = false
          item.online = false
        } else {
          item.isShow = false
        }
      }

      let list = this.appList[data.type]
      for (let item of list) {
        if (data.id == item.id) {
          item.isActive = false
          item.isShow = false
          item.online = false
        }
      }

      this.pageType = 'manager'
    },
    async delApp(data) {
      let app = await ipc.invoke('controller.app.getAppById', data.id)
      if (app.netInfo) {
        // 删除
        removeAccount(app.netInfo)
      }

      let res = await ipc.invoke(
        'controller.app.del',
        JSON.parse(JSON.stringify(data))
      )
      let list = this.appList[data.type]
      let newList = []
      for (let item of list) {
        if (data.id == item.id) {
          continue
        }

        newList.push(item)
      }

      this.appList[data.type] = newList
    },
    changeRecord(data) {
      ipc.invoke('controller.app.changeRecord', data).then((res) => {
        for (let item of this.apps) {
          if (data.id == item.id) {
            item.record = data.record
            item.online = true
          }
        }

        let list = this.appList[data.type]
        for (let item of list) {
          if (data.id == item.id) {
            item.record = data.record
            item.online = true
          }
        }

        this.$forceUpdate()
      })
    },
    changeUserName(data) {
      ipc.invoke('controller.app.changeUserName', data).then((res) => {
        console.log('更新用户名', data)
        for (let item of this.apps) {
          if (data.id == item.id) {
            item.name = data.name
            item.avatar = data.avatar
            item.online = true
          }
        }

        let list = this.appList[data.type]
        for (let item of list) {
          if (data.id == item.id) {
            item.name = data.name
            item.online = true
          }
        }
      })
    },
    online(data) {
      for (let item of this.apps) {
        if (data.id == item.id) {
          item.online = true
        }
      }

      let list = this.appList[data.type]
      for (let item of list) {
        if (data.id == item.id) {
          item.online = true
        }
      }
    },
    changeMessageNum(data) {
      let list = this.appList[data.type]
      for (let item of list) {
        if (data.id == item.id) {
          item.messageNum = data.data
        }
      }

      console.log('统计数量')
      // TODO统计下所有消息
      for (let item of this.apps) {
        console.log(item)
      }
    },
    listApp() {
      ipc.invoke('controller.app.list').then((data) => {
        data.sort((a, b) => {
          return b.sort - a.sort
        })
        const groupedBy = {}

        for (const item of data) {
          if (groupedBy[item.type]) {
            groupedBy[item.type].push(item)
          } else {
            groupedBy[item.type] = [item]
          }
        }
        this.appList = groupedBy
      })
    },
    async loginOut(force = false) {
      if (!this.finishOut) {
        return
      }
      this.finishOut = false
      try {
        if (force) {
          this.apps = []
        } else {
          // 判断是否还有窗口没关闭
          for (let item of this.apps) {
            if (item.isActive == true) {
              ElMessage({
                message: '请先关闭所有运行中的会话窗口',
                type: 'warning',
              })
              return
            }
          }
        }
        const machineId = await ipc.invoke('controller.app.getMachineId', {})
        const loginInfo = await ipc.invoke(
          'controller.config.getConfig',
          'login'
        )
        if (loginInfo && !force) {
          await logout({
            inviteCode: loginInfo.token,
            deviceId: machineId,
          })
        }
        ipc.invoke('controller.login.loginOut')
        this.$router.back()
        this.finishOut = true
      } catch (e) {
        this.finishOut = true
      }
    },
    async initWs() {
      let machineId = await ipc.invoke('controller.app.getMachineId', {})
      let url = baseWsUrl + machineId
      emitter.on('ws-open', (data) => {
        console.log('ws-open', data)
      })

      emitter.on('ws-message', (data) => {
        console.log('message', data)
        if (data.topic == 'getSessionCount') {
          this.appNum = data.msgContent.onlineCount
          this.appLimit = data.msgContent.totalCount
          let newData = _.cloneDeep(this.userData)
          newData.invite = { ...newData.invite, ...data.msgContent }
          this.$store.commit('setUserData', newData)
          this.reSetPermissionList()
        } else if (data.topic === 'clientLogout') {
          this.loginOut(true)
        }
      })
      this.$store.dispatch('initWSConnect', url)
    },
    updateAppTypes(appTypes) {
      this.appTypes = appTypes
    },
    reSetPermissionList() {
      try {
        for (let item of this.appTypes) {
          if (item.name === 'Telegram') {
            item.show = this.userData.invite.telegram !== '1' ? false : true
          } else if (item.name === 'Whatsapp') {
            item.show = this.userData.invite.whatsapp !== '1' ? false : true
          }
        }
      } catch (e) {
        console.log('error==reSetPermissionList==', e)
      }
    },
  },
}
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
  display: flex;
  flex-direction: column;
}

.menus {
  flex: 1;
}

.userinfo {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.username {
  width: 90px;
  color: rgb(146, 151, 157);
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 溢出部分显示省略号 */
}
.usernameTop {
  color: black;
  text-align: left;
  font-weight: 500;
}
.usernameBottom {
  text-align: left;
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

.operator-box {
  width: 100%;
  z-index: 1000;
  background-color: aliceblue;
}

.token-box {
  margin: 0 auto;
  width: 80%;
  text-align: center;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 溢出部分显示省略号 */
}

.logout {
  background-color: #ffff;
  width: 100%;
  padding-bottom: 10px;
}

.quiteButton {
  margin-bottom: 10px;
}

::v-deep(.el-menu) {
  border-right: none !important;
}

::v-deep(.el-sub-menu__title *) {
  vertical-align: middle;
}

::v-deep(.el-menu-item.is-active) {
  color: var(--el-text-color-primary);
  font-size: var(--el-menu-item-font-size);
}

.boxLeftReduce {
  transition: width 0.5s;
  /* 过渡动画效果 */
  width: 85px;
  border-right: solid 1px var(--el-menu-border-color) !important;
  overflow-x: hidden;
}

.boxLeftNoReduce {
  transition: width 0.5s;
  /* 过渡动画效果 */
  width: 250px;
  border-right: solid 1px var(--el-menu-border-color) !important;
  overflow-x: hidden;
}

::v-deep(.boxLeftReduce .el-sub-menu__title span) {
  display: none;
}

::v-deep(.boxLeftReduce .el-menu-item span) {
  display: none;
}

::v-deep(.boxLeftReduce .el-sub-menu .el-sub-menu__icon-arrow) {
  display: none;
}

::v-deep(.itemNoMuch .el-sub-menu__icon-arrow) {
  display: none !important;
}

.arrowLeftTransform {
  transform: rotate(180deg);
}

.iconImage {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.menuTitle {
  color: #409eff;
}

::v-deep(.el-sub-menu) {
  user-select: none;
}

.ysBoxF {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgb(232, 232, 232);
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.ysBox {
  width: 80%;
  display: flex;
  padding: 8px 10px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  background-color: rgb(240, 240, 240);
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.ysBoxS {
  display: flex;
  padding: 8px 10px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  background-color: rgb(240, 240, 240);
  border-radius: 10px;
  margin-bottom: 10px;
}

.ys {
  width: 30px;
  height: 30px;
}

.ysBoxCenter {
  font-size: 12px;
  margin-left: 10px;
  margin-right: 10px;
  text-align: left;
  flex: 1;
}

.ysToken {
  word-wrap: break-word;
  max-width: 200px;
}

.arrowLeftTransformCommon {
  padding: 5px;
  cursor: pointer;
}
.leftItemBox {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
}
.username div {
  height: 20px !important;
  line-height: 20px;
}
</style>
<style></style>
