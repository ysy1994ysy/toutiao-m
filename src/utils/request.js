// 封装axios 请求模块
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // url根路径
})

// 请求拦截器
// 由于后面都是有权限的接口，所以，在这里我们利用axios拦截器配置Authorization
request.interceptors.request.use(function(config) {
  // console.log(config)
  // config：本次请求的配置对象,config里面有一个headers属性
  const { user } = store.state
  // console.log(user)
  // 判断是否登录以及用户有没有token,如果都有则给config.headers添加Authorization属性
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 如果错误，把错误的消息return出去
  return Promise.reject(error)
})
// 响应拦截器
export default request
