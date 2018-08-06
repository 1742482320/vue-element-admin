// 引入路由
import router from './router'
// 引入store
import store from './store'

import { Message } from 'element-ui'

// 引入进度条插件
import NProgress from 'nprogress' // progress bar
// 样式
import 'nprogress/nprogress.css'// progress bar style

// 获取cookie里的权限
import { getToken } from '@/utils/auth' // getToken from cookie

// 进度条配置 禁用进度环
NProgress.configure({ showSpinner: false })// NProgress Configuration

/**
 * 权限判断的函数
 * @param {*} roles：aaaa
 * @param {*} permissionRoles：aaa
 */
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// 可以直接访问的地址，白名单
const whiteList = ['/login', '/authredirect']// no redirect whitelist

/**
 * 导航守卫
 * router.beforeEach 注册一个全局前置守卫
 * @param {*} to    即将要进入的目标 路由对象
 * @param {*} from  当前导航正要离开的路由
 * @param {*} next  next(): 进行管道中的下一个钩子
 *                  next(false): 中断当前的导航
 *                  next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址
 */
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start() // start progress bar
  // 判断权限
  if (getToken()) { // determine if there has token
    // 如果在有权限的情况下请求登录页，直接跳转到主页
    if (to.path === '/login') {
      // 跳转主页
      next({ path: '/' })
      // 结束进度条
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 如果在有权限的情况下roles对象为空，表示第一次登录，还没有获取用户信息
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // 设置用户信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // 获取用户信息
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          // 根据用户信息生成路由表
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        // 出错
        }).catch((err) => {
          // 登出
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else { // 没有权限 Cookies.get(TokenKey) 为空，重定向到登录页
    // 如果即将进入的路由地址存在白名单内，直接进入
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      // 结束进度条
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

// 路由跳转之后判断执行，结束进度条
router.afterEach(() => {
  // 结束进度条
  NProgress.done() // finish progress bar
})
