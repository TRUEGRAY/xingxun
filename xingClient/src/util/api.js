import axios from 'axios'
// import { Message } from 'element-ui'

// // 响应拦截器
// axios.interceptors.response.use(success => {
//   // 业务逻辑
//   if (success.status && success.status === 200) {
//     if (success.data.code === 500 || success.data === 403 || success.data.code === 401) {
//       Message.error({ message: success.data.message })
//       return
//     }
//     if (success.data.message) {
//       Message.success({ message: success.data.message })
//     }
//   }
//   return success.data
// }, error => {
//   if (error.response.code === 504 || error.response.code === 404) {
//     Message.error({ message: '找不到资源' })
//   } else {
//     if (error.message.data.message) {
//       Message.error({ message: error.message.data.message })
//     } else {
//       Message.error({ message: '找不到资源' })
//     }
//   }
//   return 0
// })

const base = ''

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  })
}

export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: url
  })
}
