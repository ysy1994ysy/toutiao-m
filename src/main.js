import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载amfe-flexible模块
import 'amfe-flexible'
// 导入vant组件库
import Vant from 'vant'
import './styles/index.less'
import 'vant/lib/index.css'

// 在Vue实例上瓜子啊Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
