import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import home from '../views/home'
import welcome from '../views/home/welcome'
import users from '../views/home/users'
import goods from '../views/home/goods'
import categories from '../views/home/goods/categories'
import orders from '../views/home/orders'
import rights from '../views/home/rights'
import roles from '../views/home/rights/Roles'
import reports from '../views/home/reports'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/Home',
      component: home,
      // 重定向
      redirect: '/home/welcome',
      // 子路由
      children: [
        {
          path: '/home/welcome',
          component: welcome
        }, {
          path: '/users',
          component: users
        }, {
          path: '/goods',
          component: goods
        }, {
          path: '/categories',
          component: categories
        }, {
          path: '/orders',
          component: orders
        }, {
          path: '/rights',
          component: rights
        }, {
          path: '/roles',
          component: roles
        }, {
          path: '/reports',
          component: reports
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转
  // next 是一个函数 表示放行
  if (to.path === '/login') return next()
  const tokens = window.sessionStorage.getItem('token')
  if (!tokens) return next('/login')
  next()
})

export default router
