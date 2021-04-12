import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vant组件库
import Vant from 'vant'
// 加载全局样式
import './styles/index.less'
// 加载vant全局样式
import 'vant/lib/index.css'

// 加载amfe-flexible模块，动态设置rem基准值
import 'amfe-flexible'

// 在Vue实例上挂载Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
