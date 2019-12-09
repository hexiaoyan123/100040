<template>
  <div class="container card-my-list">
    <Vheader name="我的卡券"></Vheader>

    <div class="card">
      <div class="card-add" @click="goPath('/payment/bindingCard')">
        <van-icon name="add-o" class="on" />
        <span>添加卡券</span>
      </div>

      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in list" :key="index" @click="goInfo(item)">
          <div class="card-item-top">{{item.voucherCategory | voucherCategoryFormat}}</div>
          <div class="card-item-bottom">
            <div class="card-item-bottom-logo">
              <img src="../../assets/card/bank.png" alt />
            </div>
            <div class="card-item-bottom-text">
              {{item.voucher}}
              <p style="margin-top: 7px;">
                <span style="font-size: 12px;position: relative;">
                  卡信息查询
                  <img
                    src="../../assets/card/jiantou.png"
                    width="14px"
                    style="position: absolute; top: 0px; margin-left: 5px;"
                  />
                </span>
              </p>
            </div>

            <figure class="code-eq" @click.stop="openEq(item)">
              <img src="../../assets/card/code.png" alt />
            </figure>
            <span class="code-title">二维码付款</span>
          </div>
          <div class="card-item-left"></div>
          <div class="card-item-right"></div>
        </li>
      </ul>

      <!-- 二维码弹窗开始 -->
      <div class="modo-out" v-show="modo.show" @click="modo.show = false">
        <div class="modo-in">
          <figure class="modo-close">
            <img src="../../assets/close.png" alt />
          </figure>
          <h4 class="modo-eq-name">请使用pos扫描二维码</h4>
          <figure class="modo-eq-img">
            <img :src="modo.img" alt />
          </figure>
          <div class="modo-group">
            <label>卡号：</label>
            <div class="modo-cont">{{modo.voucher}}</div>
          </div>
          <div class="modo-group">
            <label>密码：</label>
            <div class="modo-cont" v-show="pwdView">
              {{modo.pwd}}
              <span class="modo-cont-view" @click.stop="pwdView = false">
                <van-icon class="card-item-ctrl-password" name="password-view" />
              </span>
            </div>
            <div class="modo-cont" v-show="! pwdView">
              &#8901;&#8901;&#8901;&#8901;&#8901;&#8901;
              <span
                class="modo-cont-view"
                @click.stop="pwdView = true"
              >
                <van-icon class="card-item-ctrl-password" name="password-not-view" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 二维码弹窗结束 -->

      <div class="noCardContent" v-if="!list || list.length === 0">
        <ul>
          <li>
            <i>
              <img src="@/assets/noThing/kajuan.png" width="100%" />
            </i>
          </li>
          <li>
            <span>您还没有绑定卡卷！</span>
          </li>
          <li>
            <i>
              <img
                src="@/assets/noThing/kj-button.png"
                @click="goPath('/payment/bindingCard')"
                width="100%"
              />
            </i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "MyCard",
  components: {
    Vheader
  },
  data() {
    return {
      list: [],
      //   inited: false,
      modo: {
        show: false,
        img: "",
        voucher: "",
        id: "",
        pwd: ""
      },
      pwdView: false
    };
  },
  created() {
    this.pageUserVoucher();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },

    // 获取我的卡券
    pageUserVoucher() {
      let vm = this;
      let postData = {
        pageNo: 1,
        pageSize: 100
      };
      vm.$http
        .post("/panda-payment-api/v1/pageUserVoucher", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.list = response.data.result;
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 查看卡券信息
    goInfo(val) {
      this.$router.push("/payment/cardInfo?actionType=del&voucherId=" + val.id);
    },

    // 查看二维码
    openEq(obj) {
      this.modo.show = true;
      this.modo.id = obj.id;
      this.modo.voucher = obj.voucher;
      this.getUserVoucherPassword();
      this.getUserVoucherQRCode();
    },

    // 获取图片
    getUserVoucherQRCode() {
      let vm = this;
      vm.$http
        .get("/panda-payment-api/v1/getUserVoucherQRCode/" + vm.modo.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.modo.img = "data:image/png;base64," + response.data.result;
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 获取卡密码
    getUserVoucherPassword() {
      let vm = this;
      vm.$http
        .get("/panda-payment-api/v1/getUserVoucherPassword/" + vm.modo.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.modo.pwd = response.data.result;
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    }
  },
  filters: {
    // 凭证类型格式化
    voucherCategoryFormat(val) {
      if (val === 1) {
        return "现金卡";
      } else if (val === 2) {
        return "点卡";
      } else if (val === 3) {
        return "次卡";
      } else if (val === 4) {
        return "通兑票";
      } else if (val === 5) {
        return "现金券";
      } else if (val === 6) {
        return "兑换券";
      } else if (val === 7) {
        return "点券";
      } else {
        return "";
      }
    }
  }
};
</script>

<style scoped>
/* 头 */
header {
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background-color: #ff5162;
  z-index: 101;
}

.card-my-list {
  padding-top: 105px;
  background-color: #f8f8f8;
}

.class-back {
  position: absolute;
  width: 80px;
  height: 80px;
  line-height: 92px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
  color: #fff;
}

.watermark {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 70px 0;
}

.watermark-logo {
  width: 138px;
  margin: 0 auto;
}

.watermark-logo img {
  display: block;
  width: 100%;
}

.card-add {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  padding: 0 35px;
}

.card-add span {
  color: #bababa;
  font-size: 28px;
  line-height: 76px;
}

.card-list {
  padding: 35px;
}

.card-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  z-index: 20;
}

.card-item-top {
  height: 90px;
  font-size: 28px;
  line-height: 90px;
  padding: 0 40px;
  color: #fff;
  position: relative;
  background: #ff5162;
  /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(left top, #5fa0f9, #ff5162);
  /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(bottom right, #5fa0f9, #ff5162);
  /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(bottom right, #5fa0f9, #ff5162);
  /* For Firefox 3.6 to 15 */
  background: linear-gradient(to bottom right, #5fa0f9, #ff5162);
  /* Standard syntax */
}

.card-item-bottom {
  height: 186px;
  background-color: #fff;
  color: #4d4d4d;
  text-align: left;
  font-size: 32px;
  padding: 0 42px;
  position: relative;
}

.code-eq {
  position: absolute;
  top: 56px;
  right: 42px;
  height: 74px;
  width: 74px;
}

.code-eq img {
  display: block;
  width: 100%;
}

.code-title {
  position: absolute;
  top: 130px;
  right: 34px;
  font-size: 15px;
  line-height: 34px;
  color: #808080;
  width: 90px;
  text-align: center;
}
/* 弹窗二维码 */

.modo-out {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.modo-in {
  position: absolute;
  width: 470px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 80px 50px;
  left: 50%;
  top: 50%;
  margin-left: -235px;
  border-radius: 12px;
  margin-top: -400px;
}

.modo-eq-name {
  font-size: 26px;
  color: #d6d6d6;
  text-align: center;
  line-height: 60px;
}

.modo-eq-img {
  width: 286px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.modo-eq-img img {
  display: block;
  width: 100%;
}

.modo-group {
  font-size: 30px;
  color: #d6d6d6;
  line-height: 48px;
  display: flex;
}

.modo-group label {
  width: 90px;
}

.modo-cont {
  flex: 10;
  color: #808080;
}

.card-item-left,
.card-item-right {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 75px;
  border-radius: 50%;
  background-color: #f8f8f8;
}

.card-item-left {
  left: -15px;
}

.card-item-right {
  right: -15px;
}

.card-item-ctrl {
  position: absolute;
  top: 0px;
  right: 20px;
}

.card-item-ctrl-btn {
  display: inline-block;
  border: 1px solid #fff;
  padding: 0 20px;
  border-radius: 6px;
  line-height: 60px;
  height: 60px;
  margin-left: 20px;
}

.modo-close {
  width: 30px;
  position: absolute;
  right: 22px;
  top: 30px;
}

.modo-close img {
  display: block;
  width: 100%;
}

.modo-cont-view {
  float: right;
}

.card-item-bottom-logo {
  float: left;
  width: 138px;
  padding-top: 50px;
  margin-right: 50px;
}

.card-item-bottom-logo img {
  display: block;
  width: 100%;
}

.card-item-bottom-text {
  float: left;
  padding-top: 50px;
}

.noCardContent ul {
  margin-top: 80px;
}

.noCardContent ul li {
  text-align: center;
}

.noCardContent ul li:nth-child(1) i {
  display: inline-block;
  width: 160px;
  height: 160px;
}

.noCardContent ul li:nth-child(2) {
  margin-top: 10px;
}

.noCardContent ul li:nth-child(2) span {
  font-size: 30px;
  color: #969696;
}

.noCardContent ul li:nth-child(3) {
  margin-top: 30px;
}

.noCardContent ul li:nth-child(3) i {
  display: inline-block;
  width: 240px;
}
</style>