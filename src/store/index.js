import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
  // 用户登录时的token转化为json格式,设置token
  //   user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
  // 设置服务器响应回来的token，把返回的token转化为对象，再把token保存在localStorage中
    setUser (state, user) {
      state.user = user
      // window.localStorage.setItem('TOKEN_KEY', JSON.stringify(user))
      setItem('TOKEN_KEY', user)
    }
  },
  actions: {
  },
  modules: {
  }
})
