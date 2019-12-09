<template>
  <div class="gotop">
    <i class="iconfont" @click="goTop">&#xe615;</i>
  </div>
</template>

<style scoped>
.gotop{
  position: fixed;
  bottom: 195px;
  right: 20px;
  z-index: 90;
  color: rgba(0, 0, 0, 0.1);
}
.gotop .iconfont{
  font-size: 66px;
}
</style>

<script>
export default {
  props: ['vlass'],
  data() {
    return {
      className: this.vlass ? this.vlass : 'container'
    }
  },
  methods: {
    // 回到顶部
    goTop () {
      document.querySelector('.' + this.className).scrollTop = 0
    }
  }
}
</script>