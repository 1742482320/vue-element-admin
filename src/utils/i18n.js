// translate router.meta.title, be used in breadcrumb sidebar tagsview
// 翻译标题
export function generateTitle(title) {
  // 语言文件中路由中对应的键
  const hasKey = this.$te('route.' + title)
  // 语言文件中路由中对应的值
  const translatedTitle = this.$t('route.' + title) // $t :this method from vue-i18n, inject in @/lang/index.js
  // 键存在
  if (hasKey) {
    // 返回值
    return translatedTitle
  }
  // 否则直接返回传入的标题，表示语言文件中没有相应的翻译
  return title
}
