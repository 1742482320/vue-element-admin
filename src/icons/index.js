// 这个文件注册一个全部范围的组件
// 引入svg下的所有图标，添加到generateIconsView里的state里的iconsMap中

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件
import generateIconsView from '@/views/svg-icons/generateIconsView.js'// just for @/views/icons , you can delete it

// 在全部范围内注册这个组件
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)

/**
 * require.context() 创建自己的（模块）上下文
 * 传 3 个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
 * webpack 会在构建的时候解析代码中的 require.context()
 */
// 搜索svg目录下的所有svg文件
const req = require.context('./svg', false, /\.svg$/)
// 引入能匹配正则表达式的文件
const iconMap = requireAll(req)

// 添加到generateIconsView里的state里的iconsMap中
generateIconsView.generate(iconMap) // just for @/views/icons , you can delete it
