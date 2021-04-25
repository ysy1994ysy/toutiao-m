// 封装axios 请求模块
import axios from 'axios'
import store from '@/store'
// 导入处理大数字的包
import jsonBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求url根路径
  // data:后端返回的数据,即json格式的字符串,axios会使用json.parse(data),自动的将其转化为json格式的对象
  // 大数字问题:由于我们请求文章详情时,传递过来的id不在-2的53次方和2的53次方之间,所以导致JavaScript解析的时候,id发生了变化
  // 大数字问题解决方法: 把后台返回的数据转化成字符串,而必免大数字超出安全指数范围的问题
  // jsonBig.parse()&jsonBig.stringify() 与json.parse()&json.stringify()类似
  // 由于大数字的导致错误,我们要自己使用jsonBig解析后端返回的json格式的字符串
  // jsonBig可以处理超出JavaScript安全证书范围的问题,jsonBig.parse()
  transformResponse: [function (data) {
    try {
      // 将后端返回的数据通过jsonBig.parse(),转化为对象
      // 如果后台返回的数字超出安全范围了,我们就将后端返回的数字转化为字符串,(这里在调用接口的api中对象和字符串拼接会默认会调用对象的toString方法将对象转化为字符串),否则我们需要使用jsonBig.stringify()方法将其转化为字符串,并且以对象的形式展示出来
      return jsonBig.parse(data)
    } catch (err) {
      return data
    }
  }]
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
