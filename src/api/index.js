// 引入axios
import axios from 'axios'
// 设置全局的axios默认值
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
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

// 调用登录后台数据
export const login = (obj) => {
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}

// 调用用户列表数据
export const getUserList = (list) => {
  return axios.get('users', { params: list })
    .then((result) => {
      return result.data
    })
}

// 编辑用户提交
export const editUserListById = (obj) => {
  return axios.put(`users/${obj.id}`, obj)
    .then((result) => {
      return result.data
    })
}

// 删除单个用户
export const delUserListById = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      return result.data
    })
}

// 修改用户状态
export const changeStateById = (id, type) => {
  return axios.put(`users/${id}/state/${type}`)
    .then((result) => {
      return result.data
    })
}

// 获取角色列表
export const getRoleName = () => {
  return axios.get(`roles`)
    .then((result) => {
      return result.data
    })
}

// 分配用户列表
export const grantRole = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid })
    .then((result) => {
      return result.data
    })
}

// 添加用户
export const addUserList = (obj) => {
  return axios.post(`users`, obj)
    .then((result) => {
      return result.data
    })
}
