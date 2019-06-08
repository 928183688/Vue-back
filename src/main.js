import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入饿了么组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
Vue.use(ElementUI)
// 部署 开发和上线
Vue.config.productionTip = false

new Vue({
  // 注入路由
  router,
  render: h => h(App)
}).$mount('#app')
