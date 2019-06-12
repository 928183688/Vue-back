import axios from './axios'

export const getAllGoodList = (obj) => {
  return axios({
    method: 'get',
    url: 'goods',
    params: obj
  })
}
export const addGoodList = (data) => {
  return axios({
    method: 'post',
    url: 'goods',
    data
  })
}
