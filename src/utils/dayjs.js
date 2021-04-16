// 导入dayjs的包
import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文的语言包
import 'dayjs/locale/zh-cn'
// 导入处理相对时间的包
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置处理相对时间的插件
dayjs.extend(relativeTime)
// 配置使用中文语言包
dayjs.locale('zh-cn')
// 全局过滤器，处理此昂对时间
Vue.filter('relativeTime', value => {
  // dayjs().from(dayjs('1990')) // 2 years ago
  // dayjs().from(dayjs(), true) // 2 years
  // dayjs().fromNow()
  // dayjs().to(dayjs())
  // dayjs().toNow()
  return dayjs().to(dayjs(value))
})
