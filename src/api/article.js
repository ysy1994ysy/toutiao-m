// 加载文章列表数据
import request from '@/utils/request'

export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
