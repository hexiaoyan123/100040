<template>
<div class="header-back-cont gradation">
  <header>
    {{name}}
    <div class="class-back" @click="goBack">
      <i class="iconfont">&#xe60d;</i>
    </div>
  </header>
</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['name', 'backUrl'],
  methods: {
    // 返回
    goBack () {
      if(this.backUrl){
        this.$router.push('backUrl')
      }else{
        this.$router.back(-1);
      }
    }
  }
}
</script>

<style scoped>
.header-back-cont{
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  background-color: #ff5162;
  z-index: 1000;
  border: none;
  height: 84px;
  overflow: hidden;
  padding: 0 100px;
}
.header-back header{
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.class-back{
  position: absolute;
  width: 84px;
  height: 84px;
  line-height: 84px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
  color: #fff;
}
.class-back .iconfont{
  font-size: 28px;
}
</style>