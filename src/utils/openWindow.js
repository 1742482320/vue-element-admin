/**
 *Created by jiachenpan on 16/11/29.
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */

//  打开一个新的窗口设置路径 标题 大小 位置
export default function openWindow(url, title, w, h) {
  // 浏览器左上角在屏幕中的坐标
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top
  // 浏览器窗口显示区域的宽度高度
  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  // 打开一个新的浏览器窗口
  // 工具栏=no 地址字段=no 目录按钮=no 状态栏=no 菜单栏=no 滚动条=no 可调节尺寸=yes 浏览器窗口的大小和位置
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // 获取键盘焦点
  if (window.focus) {
    newWindow.focus()
  }
}

