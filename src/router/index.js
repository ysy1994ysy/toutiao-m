import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  // 使用import函数防止加载的包过大，而导致加载速度过慢，所以我们使用箭头函数
  // @指的是src的文件夹，从而可以不使用../防止路径的错误
  component: () => import('@/views/login')
}]

const router = new VueRouter({
  routes
})

export default router
