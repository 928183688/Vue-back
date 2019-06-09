import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/users/Users.vue'
import Roles from '@/views/roles/Roles.vue'
import Rights from '@/views/roles/Rights.vue'
import Goods from '@/views/shop/Goods.vue'
import Params from '@/views/shop/Params.vue'
import Categories from '@/views/shop/Categories.vue'
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
          component: Goods
        },
        {
          name: 'Params',
          path: 'params',
          component: Params
        },
        {
          name: 'Categories',
          path: 'categories',
          component: Categories
        }
      ]
    }

  ]
})
// 导航守卫
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('Login_token')
  if (token) {
    next()
  } else {
    if (to.path !== '/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})

export default router
