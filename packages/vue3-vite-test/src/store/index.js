import { createStore } from 'vuex'
import { getuserinfo } from '@/api';

const store = createStore({
  state: {
    userInfo: null
  },
  mutations: {
    getuserinfo(state, payload) {
      state.userInfo = payload;
    }
  },
  actions: {
    async getUserInfoAsync({ commit }, payload) {
      let res = await getuserinfo()
      commit("getuserinfo", res.result)
    }
  },
  getters: {

  },
  modules: {

  }
})

export default store;