<template>
  <div class="login">
    <!-- logo -->
    <figure class="logo">
      <img src="../../assets/logo.png" />
    </figure>

    <div class="cont">
      <div class="form-cont">
        <div class="form-grop">
          <label class="form-lable"></label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            class="form-input"
            type="number"
            v-model.trim="phoneCode.phone"
            placeholder="请输入手机号"
          />
          <div class="form-more">
            <van-icon name="close" v-show="phoneCode.phone" @click="phoneCode.phone = ''" />
          </div>
        </div>

        <div class="flex-cont">
          <div class="form-grop flex-left">
            <label class="form-lable"></label>
            <input
              style="width:100px;"
              @blur="iptBlur"
              @focus="iptFocus"
              class="form-input"
              type="number"
              v-model.trim="phoneCode.imgValue"
              placeholder="请输入图片验证码"
            />
            <div class="form-more">
              <van-icon name="close" v-show="phoneCode.imgValue" @click="phoneCode.imgValue = ''" />
            </div>
          </div>
          <div class="flex-right">
            <figure class="form-codeimg" @click="getImageCode">
              <img :src="phoneCode.imgUrl" />
            </figure>
          </div>
        </div>

        <div class="form-grop">
          <label class="form-lable"></label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            class="form-input"
            type="text"
            v-model.trim="phoneCode.phoneValue"
            placeholder="请输入手机验证码"
          />
          <div class="form-more">
            <span class="on" v-show="phoneCode.countDown == 60" @click="getPhoneCode">获取手机验证码</span>
            <span class="on" v-show="phoneCode.countDown < 60">{{phoneCode.countDown}}秒</span>
          </div>
        </div>
      </div>

      <div class="form-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPhoneCode",
  data() {
    return {
      // 手机验证码
      phoneCode: {
        // 验证码图片地址
        imgUrl: "",
        // 图片验证码ID
        imgId: "",
        // 图片验证码值
        imgValue: "",
        // 手机
        phone: "",
        // 手机验证码值
        phoneValue: "",
        // 手机验证码倒计时
        countDown: 60
      }
    };
  },
  created() {
    // 获得图片验证码
    this.getImageCode();
  },
  methods: {
    // 获得图片验证码
    getImageCode() {
      var vm = this;
      vm.phoneCode.imageCode = "";
      vm.phoneCode.imgId =
        new Date().valueOf() + "" + Math.ceil(Math.random() * 10000);
      vm.$http
        .get("/v1/getImageCode/" + vm.phoneCode.imgId)
        .then(function(response) {
          vm.phoneCode.imgUrl = "data:image/png;base64," + response.data.result;
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 获得手机验证码
    getPhoneCode() {
      let vm = this;
      if (vm.isPhone(vm.phoneCode.phone + "")) {
        if (vm.phoneCode.phone + "" == "") {
          vm.$toast("请输入手机号！");
          return false;
        } else if (!vm.isPhone(vm.phoneCode.phone + "")) {
          vm.$toast("输入的手机号不符合系统要求！");
          return false;
        } else if (vm.phoneCode.imgValue == "") {
          vm.$toast("请输入图片验证码！");
          return false;
        }

        let post = {
          imageCodeId: vm.phoneCode.imgId,
          imageCode: vm.phoneCode.imgValue,
          phone: vm.phoneCode.phone
        };
        vm.$http
          .post("/v1/getPhoneCode", post)
          .then(function(response) {
            if (response.data.code == "1000") {
              vm.countDown();
            } else {
              vm.$toast(response.data.msg);
            }
          })
          .catch(function(error) {
            vm.$toast("请求超时，请稍后再试！");
          });
      } else if (vm.phoneCode.phone + "" == "") {
        vm.$toast("请输入手机号！");
      } else {
        vm.$toast("输入的手机号不符合系统要求！");
      }
    },

    // 登录
    login() {
      let vm = this;
      if (vm.phoneCode.phone + "" == "") {
        vm.$toast("请输入手机号！");
        return false;
      } else if (!vm.isPhone(vm.phoneCode.phone + "")) {
        vm.$toast("输入的手机号不符合系统要求！");
        return false;
      } else if (vm.phoneCode.phoneValue == "") {
        vm.$toast("请输入手机验证码！");
        return false;
      }

      let post = {
        loginMethod: 1,
        username: vm.phoneCode.phone,
        password: "",
        authCode: vm.phoneCode.phoneValue
      };
      vm.$http
        .post("/v1/login", post)
        .then(function(response) {
          if (response.data.code == "1000") {
            // 赋值登录标识
            vm.$init.login.accessToken = response.data.result.accessToken;
            // 赋值登录用户
            vm.$init.login.user = response.data.result.cacheUser;
            // 赋值登录渠道
            vm.$init.login.channel = response.data.result.cacheChannel;

            // 设置cookie
            vm.$cookies.set(
              "DATA_LOGIN",
              JSON.stringify(vm.$init.login),
              1000 * 60 * 60 * 2
            );

            // 跳转到首页
            vm.$router.push(vm.$init.channel.indexUrl);
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          console.error(error);
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 倒计时
    countDown() {
      let vm = this;
      vm.phoneCode.countDown = 59;
      function numDown() {
        if (vm.phoneCode.countDown > 1) {
          vm.phoneCode.countDown = vm.phoneCode.countDown - 1;
        } else {
          vm.phoneCode.countDown = 60;
          window.clearInterval(int);
          return false;
        }
      }
      var int = setInterval(numDown, 1000);
    },

    // 验证手机
    isPhone(val) {
      let regular = /^[1][0-9]{10}$/;
      if (!regular.test(val)) {
        return false;
      } else {
        return true;
      }
    },

    // focus
    iptFocus() {
      this.errorMessage = "";
      this.inFocus = true;
    },
    // blur
    iptBlur() {
      let this_ = this;
      this_.inFocus = false;
      setTimeout(function() {
        if (this_.inFocus == false) {
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          this_.checkWxScroll();
        }
      }, 200);
    },
    checkWxScroll() {
      var ua = navigator.userAgent.toLowerCase();
      var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (ua.match(/MicroMessenger/i) == "micromessenger" && !!u) {
        //在iphone 微信中
        this.temporaryRepair();
      }
    },
    temporaryRepair() {
      var currentPosition;
      var timer;
      //页面滚动距离
      var speed = 1;
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        //页面向上滚动
        window.scrollTo(0, 0);
        clearInterval(timer);
      }, 1);
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
