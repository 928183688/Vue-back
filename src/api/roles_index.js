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

// 删除角色指定权限
export const deleteRoleName = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`)
}

// 添加角色
export const addRoleNameList = (obj) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: obj
  })
}

// 删除角色
export const deleteRoleNameById = (id) => {
  return axios.delete(`roles/${id}`)
}

// 编辑角色
export const editRoleNameList = (id, obj) => {
  return axios({
    method: 'put',
    url: `roles/${id}`,
    data: obj
  })
}
