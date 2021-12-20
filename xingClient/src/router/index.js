import Vue from 'vue'
import VueRouter from 'vue-router'
import write from '../views/Home.vue'
import Index from '../views/index.vue'
import login from '../views/login.vue'
import manage from '../views/manage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: '登录',
    component: login,
    hidden: true
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    hidden: true,
    children: [
      {
        path: '/index/write',
        name: '新闻编写',
        component: write
      }, {
        path: '/index/manage',
        name: '管理',
        component: manage
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next()是一个函数 next()表示放行 next('/login')表示要强制跳转的页面
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  if (tokenStr && to.path === '/index') return next('/index/write')
  if (tokenStr && to.path === '/') return next('/index/write')
  if (tokenStr && to.path !== '/' && to.path !== '/index' && to.path !== '/index/write' && to.path !== '/index/manage') return next('/index/write')
  next()
})
export default router
