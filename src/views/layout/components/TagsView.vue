<!-- 路由视图 -->

<template>
  <div class="tags-view-container">

    <!-- 获取scrollPane，滑动主体和滚动盒子 -->
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>

      <!-- 视图标签 -->
      <!-- 遍历已访问视图集合 -->
      <!-- 判断视图路由是否是当前页面路由 -->
      <!-- @contextmenu.prevent.native="openMenu(tag,$event) 右键的点击事件，不知道有什么用，唯一的作用就是在按钮上按右键无效 -->
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{generateTitle(tag.title)}} 
        <!-- 关闭正在查看的视图标签 -->
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>

    </scroll-pane>

    <ul class='contextmenu'>
      <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
  </div>
</template>

<script>
// 滑动主体和滚动盒子组件
import ScrollPane from '@/components/ScrollPane'
// 翻译标题
import { generateTitle } from '@/utils/i18n'

export default {
  components: { ScrollPane },
  data() {
    return {
      // 默认是不访问状态
      visible: false,
      top: 0,
      left: 0,
      // 正在查看的标签
      selectedTag: {}
    }
  },
  computed: {
    // 已访问的视图集合
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    // 监听路由
    $route() {
      // 路由变化执行添加视图标签方法，执行移动视图标签方法
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  // 在钩子函数中添加视图标签
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateTitle, // generateTitle by vue-i18n
    // 生成路由
    generateRoute() {
      // 路由是否有名字
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    // 判断是否是当前路由
    isActive(route) {
      return route.path === this.$route.path
    },
    // 根据路由添加视图标签
    addViewTags() {
      // 获取路由
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      // 添加路由到store 中的已访问视图集合
      this.$store.dispatch('addVisitedViews', route)
    },
    // 移动视图标签
    moveToCurrentTag() {
      // 获取视图标签
      const tags = this.$refs.tag
      // 修改dom元素后
      this.$nextTick(() => {
        // 遍历dom
        for (const tag of tags) {
          // 视图标签中的路由是否和当前路由相同
          if (tag.to.path === this.$route.path) {
            // tag.$el当前标签对象
            // 移动视图标签
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    // 关闭正在查看的视图标签
    closeSelectedTag(view) {
      // 从已访问的视图标签中把对应视图删除
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        // 如果删除的标签是正在访问的状态的话
        if (this.isActive(view)) {
          // 最后一个访问视图
          const latestView = views.slice(-1)[0]
          if (latestView) {
            // 添加到路由
            this.$router.push(latestView)
          // 如果没有就跳转到主页
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    // 把所有访问视图清除
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      // 跳转首页
      this.$router.push('/')
    },
    // 右键点击的回调不知道有什么用
    openMenu(tag, e) {
      // 访问状态
      this.visible = true
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      // 定位
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY
    },
    // 关闭视图
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
