import Vue from 'vue'
import Vuex from 'vuex'
// 导入存储和获取token的函数
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息（token等数据）
    // 用户登录时的token转化为json格式,设置token
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // data.data是一个obj对象，这个obj对象中保存着token和refresh_token两个属性
    // 登录成功之后，this.$store.commit调用函数将token保存在容器中，以便用户再次登录时有验证
    // 这两个属性的值均为字符串，token用于用户验证的令牌，
    // 而refresh_token刷新的令牌，用于访问令牌过期之后重新获取新的访问令牌，使用refresh_token解决token过期
    // token有效期为2小时，refresh_token有效期为14天
    user: getItem(TOKEN_KEY)
  },
  mutations: {
  // 设置服务器响应回来的token，把返回的token转化为对象，再把token保存在localStorage中
  // data为传递过来的参数，data中是token和refresh_token
    setUser (state, data) {
      // console.log(data)
      state.user = data
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
