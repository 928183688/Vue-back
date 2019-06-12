// 引入axios
import axios from './axios'
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

// 角色授权
export const grantRoleName = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
