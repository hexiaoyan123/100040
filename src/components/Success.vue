<template>
  <div class="container">
    <div class="base-info success">
      <figure class="img" :class="{'just':just }">
        <img src="../assets/success.png" alt />
      </figure>
      <h2>操作成功</h2>
    </div>
    <div class="base-btn-cont">
      <router-link to="/movie/home">
        <span class="base-btn">返回首页</span>
      </router-link>
    </div>
    <div class="base-more">
      <p>您的操作已成功，如有问题请拨打</p>
      <a @click="goTel">
        <h3>
          客服电话：
          <span>{{this.$init.channel.serviceTel}}</span>
        </h3>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Success",
  data() {
    return {
      just: false
    };
  },
  mounted() {
    let vm = this;
    setTimeout(function() {
      vm.just = true;
    }, 100);
  },
  methods: {
    // 拨打电话
    goTel() {
      window.location.href = "tel:" + this.$init.channel.serviceTel;
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
}
header {
  color: #ffffff;
  font-size: 28px;
  line-height: 85px;
  background-color: #ff5162;
}
.base-info {
  padding-top: 170px;
}
.base-info .img {
  display: block;
  margin: 0 auto;
  height: 170px;
  transform: rotateY(180deg);
  transition: all 0.6s;
}
.base-info .img img {
  display: inline-block;
  height: 100%;
}
.base-info .just {
  transform: rotateY(0deg);
}
.success h2 {
  font-size: 50px;
  color: #2dbc83;
  line-height: 126px;
}
.base-btn {
  display: inline-block;
  width: 160px;
  line-height: 60px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  font-size: 26px;
  color: #a8a8a8;
}
.base-more {
  color: #bababa;
}
.base-more p {
  font-size: 24px;
  line-height: 36px;
  color: #bababa;
}
.base-more h3 {
  font-size: 28px;
  line-height: 54px;
  color: #bababa;
}
.base-btn-cont {
  padding: 170px 0;
}
</style>
