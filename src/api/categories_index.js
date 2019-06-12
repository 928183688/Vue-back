// 引入axios
import axios from './axios'
// 商品列表
export const getAllcategories = (type) => {
  return axios.get('categories', { params: type })
}
// 添加分类
export const addGoodList = (obj) => {
  return axios({
    method: 'post',
    url: 'categories',
    data: obj
  })
}
