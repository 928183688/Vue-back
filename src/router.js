import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/users/Users.vue'
import Roles from '@/views/roles/Roles.vue'
import Rights from '@/views/roles/Rights.vue'
import Goods from '@/views/goods/Goods.vue'
import List from '@/views/goods/List.vue'
import Add from '@/views/goods/Add.vue'
import Params from '@/views/goods/Params.vue'
import Categories from '@/views/goods/Categories.vue'
import Orders from '@/views/list/Orders.vue'
import Reports from '@/views/reports/Reports.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 登录路由
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    // 登录重定向
    {
      path: '/',
      redirect: '/login'
    },
    // 后台页面
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'Users',
          path: 'users',
          component: Users
        },
        {
          name: 'Roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'Rights',
          path: 'rights',
          component: Rights
        },
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'List' },
          children: [
            {
              name: 'List',
              path: 'list',
              component: List
            },
            {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        },
        {
          name: 'Params',
          path: 'params',
          component: Params
        },
        {
          name: 'Orders',
          path: 'orders',
          component: Orders
        },
        {
          name: 'Categories',
          path: 'categories',
          component: Categories
        },
        {
          name: 'Reports',
          path: 'reports',
          component: Reports
        }
      ]
    }

  ]
})
// 导航守卫
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('Login_token')
  if (token || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

export default router
