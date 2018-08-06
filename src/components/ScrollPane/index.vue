<!-- 标签视图的滑动窗格 -->

<template>
  <!-- @wheel.prevent="handleScroll" 绑定滚动事件 -->
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <!-- 设置左定位负值 -->
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 自定义内边距
const padding = 15 // tag's padding

export default {
  name: 'scrollPane',
  data() {
    return {
      // 左定位值
      left: 0
    }
  },
  methods: {
    // 滚轮回调函数
    handleScroll(e) {
      // 获取垂直滚动量
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      // 获取滚动主体dom
      const $container = this.$refs.scrollContainer
      // 滚动主体的宽度
      const $containerWidth = $container.offsetWidth
      // 获取滚动盒子dom
      const $wrapper = this.$refs.scrollWrapper
      // 滚动盒子的宽度
      const $wrapperWidth = $wrapper.offsetWidth

      // 通过滚动量来左定位
      if (eventDelta > 0) {
        // 通过Math.min来把滚动量转换成数字
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        // 滚动主体盒子减内边距小于滚动盒子，说明滚动盒子已经超出主体盒子了
        if ($containerWidth - padding < $wrapperWidth) {
          // 左定位的负值比滚动盒子减主体盒子加内边距的负值大
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            // 设置左定位的负值
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        // 滚动盒子小于主体盒子，左定位设为0
        } else {
          this.left = 0
        }
      }
    },
    // 移动视图标签
    moveToTarget($target) {
      // 获取滚动主体dom
      const $container = this.$refs.scrollContainer
      // 滚动主体的宽度
      const $containerWidth = $container.offsetWidth
      // 视图标签左边的距离窗口的距离
      const $targetLeft = $target.offsetLeft
      // 视图标签的宽度
      const $targetWidth = $target.offsetWidth

      // 视图标签的左边距小于当前滚动盒子的左定位，就是说滚动盒子最左边的视图标签显示到一半
      if ($targetLeft < -this.left) {
        // 重新定位
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
      // 滚动盒子最右边的视图标签显示到一半
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
  }
}
</style>
