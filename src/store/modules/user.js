// 引入三个登录相关的方法
import { loginByUsername, logout, getUserInfo } from '@/api/login'
// 引入三个权限相关的方法
import { getToken, setToken, removeToken } from '@/utils/auth'

// user store
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    // 权限
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  // 设置用户信息
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  // Action 类似于 mutation 可以包含任意异步操作
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      // 获取用户名，并且把其中的空格去掉
      const username = userInfo.username.trim()
      // 返回一个Promise实例 resolve-成功 reject-失败
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => { // 回调
          // 回调中的数据
          const data = response.data
          // 设置store中的权限
          commit('SET_TOKEN', data.token)
          // 把权限设置到cookie中，permission中使用cookie判断权限
          setToken(response.data.token)
          // 成功回调
          resolve()
        // 失败回调
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      // 异步请求
      return new Promise((resolve, reject) => {
        // 获取用户信息
        getUserInfo(state.token).then(response => { // 回调
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          // 回调中的用户信息
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            // 设置用户信息
            commit('SET_ROLES', data.roles)
          // 错误
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          // 设置用户信息
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        // 错误
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
