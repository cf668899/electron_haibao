import emitter from '@/utils/bus'

let connectPromise
const retryLimit = 200
const retryDelay = 2000
const heartBeatInterval = 5 * 1000
let retryCount = 0
let timer
let heartSendTime = -1;
let heartReceiveTime = -1;
export const StateTypeConst = {
  UN_CONNECT: 'unConnect',
  NORMAL:'normal',
  CONNECTING:'connecting',
  NET_ERROR:'netError'
}
export const StateTypeConstStr = {
  unConnect: '网络未连接',
  normal:'网络正常',
  connecting:'网络重连中',
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
    initWSConnect({ commit, dispatch, state }, obj) {
      const {url,reset=false} = obj
      console.log('==retryCount==',retryCount)
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
          const reConnectFunction = () =>{
            commit('setState', ws.readyState)
            clearInterval(timer)
            commit('setConnectState',StateTypeConst.NET_ERROR)
            if (!state.isClosed && retryCount < retryLimit) {
              commit('setConnectState',StateTypeConst.CONNECTING)
              retryCount++
              setTimeout(() => {
                dispatch('initWSConnect',{url,reset:true})
              }, retryDelay)
            }else{
              commit('setConnectState',StateTypeConst.NET_ERROR)
            }
          }
          ws.addEventListener('open', () => {
            console.log("websocket=>open===",ws.readyState)
            retryCount = 0
            heartReceiveTime = -1
            commit('setState', ws.readyState)
            commit('setConnectState',StateTypeConst.NORMAL)
            // bus.config.globalProperties.$emit('ws-opened')
            emitter.emit('ws-open', 'open')
            // 发送心跳检测
            timer = setInterval(() => {
              ws.send('heartbeat')
              heartSendTime = (new Date).getTime()
              if(heartReceiveTime == -1){
                heartReceiveTime  = heartSendTime
              }
              // console.log("发送心跳检测==",heartSendTime,'==',heartReceiveTime,'==',(heartSendTime - heartReceiveTime)/1000,'==',((heartBeatInterval/1000) *1.5))
              if(((heartSendTime - heartReceiveTime)/1000)>=((heartBeatInterval/1000) *1.5)){
                // console.log("异常连接==")
                commit('setConnectState',StateTypeConst.CONNECTING)
                reConnectFunction()
              }else{
                // console.log("正常连接==")
              }
            }, heartBeatInterval)
            resolve()
          })
          
          ws.addEventListener('close', (e) => {
            console.log("websocket=>close===e",e,'==',ws.readyState)
            reConnectFunction()
          })
          ws.addEventListener('error', (e) => {
            commit('setConnectState',StateTypeConst.NET_ERROR)
            console.log("websocket=>error===e",e,'==',ws.readyState)
            commit('setState', ws.readyState)
            clearInterval(timer)
            console.error(e)
          })
          ws.addEventListener('message', (e) => {
            commit('setConnectState',StateTypeConst.NORMAL)
            heartReceiveTime = (new Date).getTime()
            if (e.data) {
              console.log("websocket=>message==",e.data)
              try {
                const data = JSON.parse(e.data)
                emitter.emit('ws-message', data)
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
