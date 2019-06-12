// 引入axios
import axios from 'axios'
// 设置全局的axios默认值
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 创建axios实例
const myaxios = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})
// 添加请求拦截器
myaxios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 获取token
  var token = localStorage.getItem('Login_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 暴露myaxios
export default myaxios
