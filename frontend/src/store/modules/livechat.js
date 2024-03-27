import emitter from '@/utils/bus'

let connectPromise
const retryLimit = 20
const retryDelay = 5000
const heartBeatInterval = 10 * 1000
let retryCount = 0
let timer
export const StateTypeConst = {
  UN_CONNECT: 'unConnect',
  NORMAL:'normal',
  CONNECTING:'connecting',
  NET_ERROR:'netError'
}
export const StateTypeConstStr = {
  unConnect: '未连接',
  normal:'正常',
  connecting:'重连中',
  netError:'网络错误'
}
export default {
  state: {
    ws: null,
    state: null,
    isClosed: false,
    newCustomerList: [],
    switchHint: {},
    newCustomerStatus: false,
    newMsgStatus: false,
    newSwitch: false,
    //0 未连接 1已连接 3连接中 4连接失败
    connectState: StateTypeConst.UN_CONNECT
  },
  mutations: {
    setConnectState(state, payload) {
      state.connectState = payload
    },
    setWS(state, payload) {
      state.ws = payload
    },
    setState(state, payload) {
      state.state = payload
    },
    setIsClosed(state, payload) {
      state.isClosed = payload
    },
    addNewCustomer(state, payload) {
      state.newCustomerList.push(payload)
    },
    removeNewCustomer(state, payload) {
      const index = state.newCustomerList.findIndex((v) => v === payload)
      if (index > -1) {
        state.newCustomerList.splice(index, 1)
      }
    },
    setSwitchHint(state, payload) {
      state.switchHint[payload.id] = payload.data
    },
    setNewCustomerStatus(state, payload) {
      state.newCustomerStatus = payload
    },
    setNewMsgStatus(state, payload) {
      state.newMsgStatus = payload
    },
    setNewSwitch(state, payload) {
      state.newSwitch = payload
    },
  },
  actions: {
    initWSConnect({ commit, dispatch, state }, url, reset) {
      if (reset || !connectPromise) {
        // dispatch('closeWSConnect')
        commit('setIsClosed', false)
        commit('setConnectState',StateTypeConst.CONNECTING)
        connectPromise = new Promise((resolve) => {
          // const url = `https://127.0.0.1/ws`
          const ws = new WebSocket(url)
          commit('setWS', ws)
          commit('setState', ws.readyState)
          commit('setConnectState',StateTypeConst.CONNECTING)
          ws.addEventListener('open', () => {
            console.log("websocket=>open===",ws.readyState)
            retryCount = 0
            commit('setState', ws.readyState)
            commit('setConnectState',StateTypeConst.NORMAL)
            // bus.config.globalProperties.$emit('ws-opened')
            emitter.emit('ws-open', 'open')
            // 发送心跳检测
            timer = setInterval(() => {
              console.log("发送心跳检测")
              ws.send(JSON.stringify({ heartBeat: 0 }))
            }, heartBeatInterval)
            resolve()
          })
          ws.addEventListener('close', (e) => {
            console.log("websocket=>close===e",e,'==',ws.readyState)
            commit('setState', ws.readyState)
            clearInterval(timer)
            commit('setConnectState',StateTypeConst.NET_ERROR)
            if (!state.isClosed && retryCount < retryLimit) {
              commit('setConnectState',StateTypeConst.CONNECTING)
              retryCount++
              setTimeout(() => {
                console.log("reconnect===",ws.readyState)
                dispatch('initWSConnect', true)
              }, retryDelay)
            }
          })
          ws.addEventListener('error', (e) => {
            commit('setConnectState',StateTypeConst.NET_ERROR)
            console.log("websocket=>error===e",e,'==',ws.readyState)
            commit('setState', ws.readyState)
            clearInterval(timer)
            console.error(e)
          })
          ws.addEventListener('message', (e) => {
            console.log("websocket=>message==",e.data)
            if (e.data) {
              try {
                const data = JSON.parse(e.data)
                // bus.config.globalProperties.$emit('ws-message', data)
                emitter.emit('ws-message', data)
                // 对应页面收到ws消息
                // mounted() {
                //   bus.config.globalProperties.$on('ws-message', data => {
                //   }
                // }
                //页面获取状态
                // computed: {
                //   ...mapState({
                //     ws: state => state.livechat.ws,
                //   }),
                //页面调用方法
                // methods: {
                //   ...mapActions(['initWSConnect']),
              } catch (e) {
                console.error(e)
              }
            }
          })
        })
      }
      return connectPromise
    },
    closeWSConnect({ commit, state }, auto) {
      commit('setIsClosed', true)
      if (state.ws) {
        state.ws.close()
        connectPromise = null
        commit('setWS', null)
        commit('setConnectState',StateTypeConst.UN_CONNECT)
      }
    },
  },
}
