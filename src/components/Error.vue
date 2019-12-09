<template>
  <div class="container">
    <!-- <header>系统异常</header> -->
    <div class="base-info">
      <figure class="img">
        <img src="../assets/error.png" alt />
      </figure>
    </div>
    <div class="base-btn-cont">
      <div class="base-btn-cont">
        <!-- <router-link to="/index"> -->
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
  </div>
</template>

<script>
export default {
  name: "Error",
  data() {
    return {};
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
  height: 230px;
  width: 350px;
}
.base-info .img img {
  width: 100%;
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
