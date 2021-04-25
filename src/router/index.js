import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // 使用import函数防止加载的包过大，而导致加载速度过慢，所以我们使用箭头函数
    // @指的是src的文件夹，从而可以不使用../防止路径的错误
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  // 搜索模块的路由
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  // 文章详情的路由
  {
    // 动态路由
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props路由传参,将路由参数articleId映射到组件中
  }
]

const router = new VueRouter({
  routes
})

export default router
