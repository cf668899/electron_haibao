import emitter from '@/utils/bus'

let connectPromise
const retryLimit = 20
const retryDelay = 5000
const heartBeatInterval = 60 * 1000
let retryCount = 0
let timer
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
  },
  mutations: {
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
        connectPromise = new Promise((resolve) => {
          // const url = `https://127.0.0.1/ws`
          const ws = new WebSocket(url)
          commit('setWS', ws)
          commit('setState', ws.readyState)
          ws.addEventListener('open', () => {
            retryCount = 0
            commit('setState', ws.readyState)
            // bus.config.globalProperties.$emit('ws-opened')
            emitter.emit('ws-open', 'open')
            // 发送心跳检测
            timer = setInterval(() => {
              ws.send(JSON.stringify({ heartBeat: 0 }))
            }, heartBeatInterval)
            resolve()
          })
          ws.addEventListener('close', (e) => {
            commit('setState', ws.readyState)
            clearInterval(timer)
            if (!state.isClosed && retryCount < retryLimit) {
              retryCount++
              setTimeout(() => {
                dispatch('initWSConnect', true)
              }, retryDelay)
            }
          })
          ws.addEventListener('error', (e) => {
            commit('setState', ws.readyState)
            clearInterval(timer)
            console.error(e)
          })
          ws.addEventListener('message', (e) => {
            console.log("message==",e.data)
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
      }
    },
  },
}
