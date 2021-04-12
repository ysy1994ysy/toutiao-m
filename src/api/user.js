// 用户请求模块
// 导入用户请求的根路径
import request from '@/utils/request'

//  用户登录模块
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: data
  })
}
// 封装发送验证码请求的根路径
// 每个手机号每分钟只能发送一个验证码
export const sendSms = mobile => {
  console.log(mobile)
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
