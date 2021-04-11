// 封装axios 请求模块
import axios from 'axios'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // url根路径
})

export default request
