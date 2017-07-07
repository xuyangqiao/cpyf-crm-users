import axios from 'axios'
import config from './api-config'
import qs from 'qs'
import Vue from 'vue'

// import { cookie } from 'vux'

// axios.defaults.baseURL = '/index.php'
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  Vue.$vux.loading.hide()
  return response
}, error => {
  // 把错误信息扶正, 后面就不需要写 catch了
  return Promise.resolve(error.response)
})

// 验证请求状态
function checkStatus (response) {
  if (response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -400,
      message: response.statusText,
      data: ''
    }
  }
}

// 验证返回code
function checkCode (res) {
  if (res.data.code !== 200) {
    console.log('请求失败')
  }
  return res
}

// post请求
export default {
  post (url, data) {
    return axios({
      method: 'post',
      url: url,
      data: qs.stringify(data),
      timeout: config.timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url: url,
      params,
      timeout: config.timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  }
}
