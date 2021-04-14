// 用户请求模块
// 导入用户请求的根路径
import request from '@/utils/request'
// 导入vuex容器中的数据
// import store from '@/store'
//  用户登录模块
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: data
  })
}
// 封装发送验证码请求
// 每个手机号每分钟只能发送一个验证码
export const sendSms = mobile => {
  // console.log(mobile)
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
// 请求获取用户自己信息的数据，这是有权限的接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
