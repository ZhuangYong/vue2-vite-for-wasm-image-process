

// 封装 axios 
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://127.0.0.1:8000/'   // localhost  0.0.0.0   myexp （公网IP)
axios.defaults.baseURL = baseURL;     // 基本路径   和 反向代理不能共存 
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let Load = null
export function ShowLoading(msg = "加载中...") {
  Load && Load.close()
  Load = ElLoading.service({
    lock: true,
    text: msg,
    background: 'rgba(0, 0, 0, 0.7)',
  })
}

export function ShowError(msg = "未知错误") {
  Load && Load.close()
  ElMessage.closeAll()
  ElMessage.error(msg)

}

export function ShowSuccess(msg = "成功") {
  Load && Load.close()
  ElMessage.closeAll()
  ElMessage.success(msg)
}


// Interceptors 拦截器  (ajax 请求成功或者请求响应做一些业务逻辑  弹框提示  数据提示  )

// Add a request interceptor  请求的拦截器  request
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发送之前做一些事情  (唤起Loading)

  // 每次请求把token 发送给后端 
  const token = sessionStorage.getItem("authToken")
  if (token) {
    config.headers.token = token;
  }
  ShowLoading()
  return config;
}, function (error) {
  // 请求失败 
  ShowError('请求失败')
  return Promise.reject(error);
});


// Add a response interceptor  响应的拦截器 response
axios.interceptors.response.use(function (response) {
  // 响应成功 提示
  // code = 200 成功
  if (response.data.code == 200) {
    // 成功
    ShowSuccess(response.data.msg)
  } else {
    // code !=200 失败
    if (response.data.code === 3001) {
      sessionStorage.removeItem('authToken')
      router.replace('/login')
    }

    // 失败
    ShowError(response.data.msg)

  }
  return response;

}, function (error) {
  // 响应失败 跨域 504 404 
  ShowError('响应失败')
  return Promise.reject(error);
});


// GET
export const get = function (url, params, headers) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: "GET",
      params,   // ?id=2116
      headers   // 请求头 
    })
      .then(res => {
        resolve(res.data) // 成功回调  res.data axios 保证在 data 
      })
      .catch(err => {
        reject(err)
      })
  })
}
// POST
export const post = function (url, data, params, headers) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: "POST",
      data,      // post 请求提交的数据 
      params,   // ?id=2116
      headers   // 请求头 
    })
      .then(res => {
        resolve(res.data) // 成功回调  res.data axios 保证在 data 
      })
      .catch(err => {
        reject(err)
      })
  })
}
// 暂时用不到  
// PATCH 
export const Patch = function (url, data, params, headers) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: "PATCH",
      data,  //  修改的数据  
      params,   // ?id=2116
      headers   // 请求头 
    })
      .then(res => {
        resolve(res.data) // 成功回调  res.data axios 保证在 data 
      })
      .catch(err => {
        reject(err)
      })
  })
}
// DELETE 
export const Delete = function (url, data, params, headers) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: "DELETE",
      // data,  // 
      // params,   // ?id=2116
      // headers   // 请求头 
    })
      .then(res => {
        resolve(res.data) // 成功回调  res.data axios 保证在 data 
      })
      .catch(err => {
        reject(err)
      })
  })
}


export {
  axios,
  baseURL
}