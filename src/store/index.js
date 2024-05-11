import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: {
    hiddenMenu: false,
    token: null,
    loginType: 'username'
  },
  mutations: {
    changeMenuState(state) {
      state.hiddenMenu = !state.hiddenMenu;
    },
    changeToken(state, token) {
      state.token = 'Bearer ' + token;
    },
    changeLoginType(state, loginType) {
      state.loginType = loginType;
    },
  },
  plugins: [vuexLocal.plugin]
})

export default store
