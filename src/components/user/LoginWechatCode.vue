<template>
  <div class="login">
    <!-- logo -->
    <figure class="logo">
      <img src="../../assets/logo.png" />
    </figure>

    <div class="cont">
      <div class="form-btn" @click="wechatLogin">微信授权登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginWechatCode",
  data() {
    return {};
  },
  created() {
    this.$store.commit("ctrlLoader", true);
    // 微信登录
    this.wechatLogin();
  },
  methods: {
    // 微信登录
    wechatLogin() {
      this.$store.commit("ctrlLoader", false);
      let redirectUrl = encodeURIComponent(
        this.$init.channel.itemUrl + this.$init.channel.indexUrl
      );
      window.location.href =
        this.$init.channel.apiUrl +
        "/panda-common-gateway/v1/wechatLogin?channelId=" +
        this.$init.channel.id +
        "&redirectUrl=" +
        redirectUrl;
    }
  }
};
</script>

<style scoped>
.login {
  padding-top: 130px;
  position: relative;
}
.logo {
  display: block;
  width: 360px;
  margin: 0 auto;
}
.logo img {
  display: block;
  width: 100%;
}
.cont {
  padding: 75px;
}
.form-grop {
  display: flex;
  border-bottom: 1px solid #ff5162;
  font-size: 28px;
  line-height: 66px;
  margin-bottom: 42px;
}
.form-input {
  flex: 10;
  border: none;
  outline: none;
  font-size: 28px;
  line-height: 66px;
  height: 66px;
  box-sizing: border-box;
}
.van-icon {
  display: inline-block;
  padding: 0 5px;
}
.form-btn {
  color: #fff;
  line-height: 80px;
  font-size: 28px;
  text-align: center;
  border-radius: 40px;
  background-color: #ff5162;
}
.form-cont {
  padding-bottom: 30px;
}
.form-link {
  line-height: 80px;
  padding-top: 30px;
  color: #818181;
}
.form-link a {
  color: #818181;
  font-size: 28px;
}
.form-link-left {
  float: left;
}
.form-link-right {
  float: right;
}
.out {
  position: absolute;
  font-size: 32px;
  color: #818181;
  top: 30px;
  left: 30px;
}
.flex-cont {
  display: flex;
}
.flex-left {
  flex: 10;
}
.flex-right {
  padding-left: 40px;
}
.form-codeimg {
  height: 66px;
  width: 200px;
  border: 1px solid #ff5162;
  box-sizing: border-box;
}
.form-codeimg img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
