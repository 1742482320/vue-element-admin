import Vue from 'vue'
import store from './store'

// you can set only in production env show the error-log
// if (process.env.NODE_ENV === 'production') {

// 错误信息处理函数
Vue.config.errorHandler = function(err, vm, info, a) {
  // Don't ask me why I use Vue.nextTick, it just a hack.
  // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
  // 在修改数据之后立即使用这个方法
  Vue.nextTick(() => {
    store.dispatch('addErrorLog', {
      err,
      vm,
      info,
      url: window.location.href
    })
    console.error(err, info)
  })
}
