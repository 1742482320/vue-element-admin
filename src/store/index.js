import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

// 创建一个store
const store = new Vuex.Store({
  // 模块化加载
  modules: {
    // 页面store 侧边栏和设置语言
    app,
    // 错误store
    errorLog,
    // 路由store
    permission,
    tagsView,
    // 用户相关store
    user
  },
  // 获取状态
  getters
})

export default store
