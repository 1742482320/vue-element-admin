// 引入普通路由和异步路由对象
import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 是否路由需要权限
  if (route.meta && route.meta.roles) {
    // 路由中的权限是否与当前用户匹配
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  // 不带权限的路由
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 异步路由
 * @param roles 用户信息
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  // filter过滤器
  const accessedRouters = asyncRouterMap.filter(route => {
    // 是否符合路由需要的权限
    if (hasPermission(roles, route)) {
      // 如果有子元素
      if (route.children && route.children.length) {
        // 判断子元素中是否存在需要权限的路由
        route.children = filterAsyncRouter(route.children, roles)
      }
      // 正常显示
      return true
    }
    // 不符合不加入路由表
    return false
  })
  // 返回符合权限的路由表
  return accessedRouters
}

// 路由store
const permission = {
  state: {
    // 路由状态
    // 普通路由
    routers: constantRouterMap,
    // 添加的路由
    addRouters: []
  },
  mutations: {
    // 添加路由方法
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      // 把添加的路由添加到路由状态中
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, data) {
      // 异步加载
      return new Promise(resolve => {
        // 获取用户信息
        const { roles } = data
        let accessedRouters
        // 如果是管理员就添加异步路由，管理员权限是最大的，不用判断权限
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          // 如果不是管理员，就需要判断路由是否符合用户权限
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        // 设置路由，把异步路由添加到路由表中
        commit('SET_ROUTERS', accessedRouters)
        // 成功
        resolve()
      })
    }
  }
}

export default permission
