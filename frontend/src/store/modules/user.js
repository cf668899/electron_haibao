export default {
  state: {
    userData: null,
  },
  mutations: {
    setUserData(state, payload) {
      state.userData = payload
    },
    clearUserData(state, payload) {
      state.userData = {}
    },
  },
  actions: {
    clearUserData({ commit, dispatch, state }) {
      commit('clearUserData')
    },
  },
}
