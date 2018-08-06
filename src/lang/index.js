// 这个文件用来设置语言

import Vue from 'vue'
// 设置语言的插件
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui 英文
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui 中文
// 引入设置好的语言信息
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

// 语言配置
const messages = {
  en: {
    // 信息
    ...enLocale,
    // 语言
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

// 设置语言
const i18n = new VueI18n({
  // 通过cookie来判断使用的语言，如果没有，使用英文
  // options: en or zh
  locale: Cookies.get('language') || 'en',
  // 语言配置
  messages
})

export default i18n
