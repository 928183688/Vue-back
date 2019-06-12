import axios from './axios.js'
// get方式请求
export const getAllRightList = (type) => {
  return axios.get(`rights/${type}`)
}

// 左侧菜单权限
export const getAllmenus = () => {
  return axios.get(`menus`)
}
