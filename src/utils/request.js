// 封装axios 请求模块
import axios from 'axios'
import store from '@/store'
// 导入处理大数字的包
import jsonBig from 'json-bigint'
import router from '../router'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求url根路径
  // data:后端返回的数据,即json格式的字符串,axios会使用json.parse(data),自动的将其转化为json格式的对象
  // 大数字问题:由于我们请求文章详情时,传递过来的id不在-2的53次方和2的53次方之间,所以导致JavaScript解析的时候,id发生了变化
  // 大数字问题解决方法: 把后台返回的数据转化成字符串,而必免大数字超出安全指数范围的问题
  // jsonBig.parse()&jsonBig.stringify() 与json.parse()&json.stringify()类似
  // 由于大数字的导致错误,我们要自己使用jsonBig解析后端返回的json格式的字符串
  // jsonBig可以处理超出JavaScript安全证书范围的问题,jsonBig.parse()
  // 结果大数字问题
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
// 处理tokken过期,利用refresh_token更新token
request.interceptors.response.use(function (response) {
  // 响应成功,进入第一个函数
  return response
}, async function (err) {
  // 响应失败,进入第二个函数
  console.dir(err)
  // 如果响应错误,则会进入该函数中,并且响应的状态码是401
  // 判断是否有响应,并且响应的状态码是否是401
  // 从vuex容器中拿到用户的信息
  const user = store.state.user
  if (err.response && err.response.status === 401) {
    //  如果用户没有登录或者没有携带refresh_token,跳转到登录页面,让用户登录
    if (!user || !user.refresh_token) {
      return router.push('/login')
    }
  }
  // 如果用户登录了,并且有refresh_token,则请求获取新的token
  try {
    // 调用刷新token的接口
    const res = await axios({
      method: 'PUT',
      url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
      headers: {
        Authorization: `Bearer ${user.refresh_token}`
      }
    })

    // 如果刷新成功,则把新的token更新到vuex容器中
    console.log('更新token成功', res)
    store.commit('setUser', {
      token: res.data.data.token, // vuex容器中,得到的最新的token
      refresh_token: user.refresh_token // 还原原来的refresh_token
    })
  } catch (error) {
    // 如果获取失败,直接跳转到登录页面
    console.log('请求刷新token失败', error)
    return router.push('/login')
  }
  return Promise.reject(err)
})
export default request
