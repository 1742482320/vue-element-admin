// 打包的入口文件

import Vue from 'vue'

// 引入重写的css
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// 引入整个 Element 组件库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 整个网站的样式
import '@/styles/index.scss' // global css

// 页面
import App from './App'
// 路由
import router from './router'
// 引入store
import store from './store'

// 引入设置语言文件
import i18n from './lang' // Internationalization
// 引入图标
import './icons' // icon
// 引入错误日志
import './errorLog'// error log
// 权限判断和生成路由
import './permission' // permission control
// 生成随机数据，拦截 Ajax 请求
import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  // 设置路由
  router,
  // 设置store
  store,
  // 设置语言
  i18n,
  // 渲染到页面
  render: h => h(App)
})
