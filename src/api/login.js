// 三个登录相关的方法

// 引入请求配置文件
import request from '@/utils/request'

// 登录
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    // data是作为请求主体发送的数据
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    // 路由参数
    params: { token }
  })
}

