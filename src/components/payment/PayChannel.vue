<template>
  <div class="container">
    <Vheader name="选中支付方式"></Vheader>

    <div class="ticket-cont">
      <div style="margin: 50px auto 5px; text-align: center; font-size: 3.2vw; color: #818181"></div>
      <div
        style="margin: 0 auto; text-align: center; font-size: 6.4vw;"
      >￥{{orderPay.orderAmount | priceFormat}}</div>
      <div
        style="margin: 5px auto 30px; text-align: center; font-size: 3.2vw; color: #818181"
      >{{orderPay.orderId}} {{orderPay.businessName}}订单</div>

      <!-- 选择支付方式 -->
      <div class="ticket-cont ticket-cont_tit">
        <van-cell-group>
          <template v-for="item in payChannelList">
            <van-cell :title="item.name" :key="item.id" @click="selectedPayChannel = item">
              <van-icon
                :class="{'iocn-weixin': item.name == '微信支付','iocn-cika':item.name == '次卡','iocn-dianjuan':item.name == '点券',
                'iocn-xianjinjuan':item.name == '现金券支付','iocn-xianjinka':item.name == '现金卡','iocn-yinlian':item.name == '银联支付','iocn-zhifubao':item.name == '支付宝支付'}"
              />
              <van-icon
                slot="right-icon"
                name="check"
                class="van-cell__right-icon"
                v-show="selectedPayChannel.id != item.id"
              />
              <van-icon
                slot="right-icon"
                name="checked"
                class="van-cell__right-icon"
                v-show="selectedPayChannel.id == item.id"
              />
            </van-cell>
          </template>
        </van-cell-group>
      </div>
      <!-- 倒计时 -->
      <div class="count">
        <img
          src="../../assets/xb/time.png"
          height="20"
          width="20"
          alt
          style=" margin-top: 8px;
    margin-left: 13px;"
        />
        <div style="float: right;">
          <p>支付剩余时间</p>
          <p>{{remainingPaymentTime}}</p>
        </div>
      </div>
    </div>

    <!-- 确认支付 -->
    <div
      class="choice-ok gradation"
      style="position: fixed; width: 100%; bottom: 0;"
      v-if="'00:00' != remainingPaymentTime"
      @click="confirmPayment"
    >确认支付</div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "payChannel",
  components: {
    Vheader
  },
  data() {
    return {
      // 订单支付信息
      orderPay: {
        business: "",
        businessName: "",
        orderId: "",
        overTime: "",
        orderAmount: "",
        amount: ""
      },
      // 选中的支付渠道
      selectedPayChannel: {
        id: "",
        channelCategory: "",
        payChannelCategory: "",
        name: "",
        params: ""
      },
      // 支付渠道
      payChannelList: [],
      // 剩余支付时间
      remainingPaymentTime: "00:00"
    };
  },
  created() {
    // 订单支付信息
    let clickOrderPay = JSON.parse(
      window.localStorage.getItem("clickOrderPay")
    );
    if (clickOrderPay) {
      this.orderPay = clickOrderPay;

      // 支付剩余时间
      this.countDown(this.orderPay.overTime);

      // 获取支付渠道
      this.listPayChannel(this.orderPay.business);
    } else {
      this.goBack();
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 获取支付渠道
    listPayChannel(val) {
      let vm = this;
      vm.$http
        .get("/panda-payment-api/v1/listPayChannel/" + val)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.payChannelList = response.data.result;
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 倒计时
    countDown(time) {
      let vm = this;
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var end = time * 1000;
      if (end <= now) {
        return false;
      }
      //时间差
      var leftTime = end - now;
      var remainingPaymentTime = null;
      // 倒计时函数
      function countDown() {
        leftTime -= 1000;
        //定义变量 d,h,m,s保存倒计时的时间
        var d, h, m, s;
        if (leftTime >= 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
          m = Math.floor((leftTime / 1000 / 60) % 60);
          s = Math.floor((leftTime / 1000) % 60);

          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }

          vm.remainingPaymentTime = m + ":" + s;
        } else {
          vm.remainingPaymentTime = "00:00";
          clearInterval(remainingPaymentTime);
        }
      }

      remainingPaymentTime = setInterval(countDown, 1000);
    },

    // 确认支付
    confirmPayment() {
      let vm = this;
      if ("" != vm.selectedPayChannel.payChannelCategory) {
        // 选中的支付渠道
        window.localStorage.setItem(
          "clickPayChannel",
          JSON.stringify(vm.selectedPayChannel)
        );

        // 现金卡支付
        if ("1" == vm.selectedPayChannel.payChannelCategory) {
          vm.$router.push("/payment/xianJinKaPay");
        }
        // 次卡支付
        else if ("3" == vm.selectedPayChannel.payChannelCategory) {
          vm.$router.push("/payment/ciKaPay");
        }
        // 点券支付
        else if ("7" == vm.selectedPayChannel.payChannelCategory) {
          vm.$router.push("/payment/dianQuanPay");
        }
        // 微信支付
        else if ("8" == vm.selectedPayChannel.payChannelCategory) {
          vm.wechatPayment();
        }
        // 中国邮政储蓄银行
        else if ("11" == vm.selectedPayChannel.payChannelCategory) {
          vm.psbcPayment();
        }
      }
    },

    // 微信支付
    wechatPayment() {
      let vm = this;

      // 请求支付订单对象
      let paymentOrder = {
        // 订单ID
        orderId: vm.orderPay.orderId,
        //  支付方式（
        //  1：中影现金卡支付；
        //  2：中影次卡支付（按照真实价值计算）；
        //  3：微信支付；
        //  4：中影现金卡微信补差支付；
        //  5：中影次卡（按照真实价值计算）微信补差支付；
        //  6：0元支付；
        //  7：中影次卡支付（一次最多结算一张影票）；
        //  8：中影次卡（一次最多结算一张影票）微信补差支付；
        //  9：中国邮政储蓄银行支付；
        //  10：中影点券支付；
        //  11：中影点券微信补差支付；
        //  ）
        paymentMethod: 3,
        // 凭证（格式：卡号_支付金额 或 卡号_次数,卡号_次数）
        voucher: "",
        // 金额（单位：分，微信支付时和微信补差时使用）
        wechatPayPrice: vm.orderPay.orderAmount
      };

      vm.$http
        .post("/panda-cinema-api/v1/payment", paymentOrder)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              let item = response.data.result;
              WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                  // 公众号名称，由商户传入
                  appId: item.appId,
                  // 时间戳，自1970年以来的秒数
                  timeStamp: item.timeStamp,
                  // 随机串
                  nonceStr: item.nonceStr,
                  package: item.package,
                  // 微信签名方式
                  signType: "MD5",
                  // 微信签名
                  paySign: item.paySign
                },
                function(res) {
                  if ("get_brand_wcpay_request:ok" == res.err_msg) {
                    vm.$router.push("/success");
                  } else if ("get_brand_wcpay_request:fail" == res.err_msg) {
                    vm.$router.push("/fail");
                  } else if ("get_brand_wcpay_request:cancel" == res.err_msg) {
                    vm.$router.push("/fail");
                  }
                }
              );
            } else {
              vm.$router.push("/success");
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          alert(error);
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 中国邮政储蓄银行支付
    psbcPayment() {
      let vm = this;

      // 请求支付订单对象
      let paymentOrder = {
        // 订单ID
        orderId: vm.orderPay.orderId,
        //  支付方式（
        //  1：中影现金卡支付；
        //  2：中影次卡支付（按照真实价值计算）；
        //  3：微信支付；
        //  4：中影现金卡微信补差支付；
        //  5：中影次卡（按照真实价值计算）微信补差支付；
        //  6：0元支付；
        //  7：中影次卡支付（一次最多结算一张影票）；
        //  8：中影次卡（一次最多结算一张影票）微信补差支付；
        //  9：中国邮政储蓄银行支付；
        //  10：中影点券支付；
        //  11：中影点券微信补差支付；
        //  ）
        paymentMethod: 9,
        // 凭证（格式：卡号_支付金额 或 卡号_次数,卡号_次数）
        voucher: "",
        // 金额（单位：分，微信支付时和微信补差时使用）
        wechatPayPrice: vm.orderPay.orderAmount
      };

      vm.$http
        .post("/panda-cinema-api/v1/payment", paymentOrder)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              document.write(response.data.result);
            } else {
              vm.$router.push("/success");
            }
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
    // 金钱格式化
    priceFormat(val) {
      if (val) {
        return (val / 100).toFixed(2);
      } else if (val === 0) {
        return 0.0;
      } else {
        return 0.0;
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  padding-bottom: 90px;
}
.top img {
  display: block;
  width: 100%;
}

header {
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #c06;
  color: #fff;
  text-align: center;
  display: flex;
  font-size: 28px;
  z-index: 101;
}
.header-back {
  width: 70px;
  text-align: center;
}
.header-cont {
  flex: 10;
}
.header-more {
  width: 75px;
  text-align: center;
}
header .iconfont {
  font-size: 28px;
}
/* 支付提示 */
.pay-tips {
  font-size: 24px;
  color: #fff;
  text-align: center;
  background-color: #f1cf64;
  line-height: 70px;
}
/* 票信息 */
.ticket-cont {
  color: #ff446e;
  padding: 20px 0;
}
.ticket-cont_tit {
  padding: 20px 15px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.van-cell:not(:last-child):after {
  border-bottom-width: 0px;
}
.van-hairline:after {
  border: none;
}
.van-hairline--top-bottom:after {
  border: none;
}
.ticket-name {
  font-size: 48px;
  font-weight: 700;
  padding: 0 20px;
  color: #666;
  line-height: 80px;
}
.ticket-cinema-name {
  font-size: 27px;
  padding: 0 20px;
  line-height: 44px;
}
.ticket-time {
  font-size: 27px;
  line-height: 40px;
  padding: 0 20px 20px 20px;
}
.ticket-seats {
  padding: 40px 20px;
  position: relative;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.ticket-seat {
  display: inline-block;
  line-height: 50px;
  font-size: 24px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid #c06;
  color: #c06;
  margin-right: 20px;
}
.ticket-seats-many {
  color: #ff9000;
  font-size: 36px;
  position: absolute;
  right: 20px;
  line-height: 52px;
  font-weight: 700;
}
.newmaney {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 20px;
  text-align: right;
  color: #ff9000;
  font-size: 36px;
  font-weight: 700;
  line-height: 96px;
}
.newmaney em {
  font-size: 26px;
}
.ticket-phone {
  font-size: 28px;
  padding: 0 20px;
  line-height: 100px;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  position: relative;
}
.ticket-select {
  padding: 20px 0;
}
.ticket-select li {
  line-height: 66px;
  padding: 0 20px;
  font-size: 28px;
  position: relative;
}
.ticket-btn {
  margin: 0 20px;
  line-height: 85px;
  border-radius: 6px;
  color: #fff;
  background-color: #c06;
  text-align: center;
  font-size: 32px;
}
.ticket-select-check {
  position: absolute;
  line-height: 66px;
  right: 20px;
  top: 0;
}
.ticket-select-checkd {
  position: absolute;
  line-height: 66px;
  right: 20px;
  top: 0;
  display: none;
  color: #c06;
}
.ticket-select-on {
  background-color: #f6f6f6;
}
.ticket-select-on .ticket-select-check {
  display: none;
}
.ticket-select-on .ticket-select-checkd {
  display: block;
}
.ticket-cont h3 {
  font-size: 36px;
  line-height: 60px;
  padding: 10px 20px;
  background-color: #fff;
}

.ticket-ctrl {
  width: 100%;
  display: flex;
  line-height: 90px;
  font-size: 28px;
  overflow: hidden;
  border-top: 1px solid #eee;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
}
.ticket-ctrl-left {
  flex: 10;
  color: #c06;
  font-weight: 700;
  padding: 0 20px;
}
.ticket-ctrl-left em {
  font-size: 24px;
  color: #c1c1c1;
}
.ticket-ctrl-right {
  width: 300px;
  text-align: center;
  color: #fff;
  background-color: #c06;
  font-size: 28px;
}
.ticket-magin {
  margin-right: 20px;
}
.describe {
  padding: 20px;
  font-size: 36px;
  /* line-height: 60px; */
  color: #c06;
}
.count {
  margin-top: 50px;
  position: absolute;
  right: 0;
  width: 250px;
  height: 75px;
  color: #fff;
  padding: 3px;
  /* background-image: url(../../assets/szbg.png);
  background-size: 100% 100%; */
  border-top-left-radius: 40%;
  border-bottom-left-radius: 40%;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#ff8e62),
    to(#fd4471)
  );
}
.count p {
  margin-top: 3px;
}
</style>

<style>
.van-popup--right {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
.van-icon-alipay {
  color: #00bbee;
}
.van-icon-wechat {
  color: #609700;
}
.van-icon-card {
  color: #c06;
}
.van-icon-debit-pay {
  color: #c06;
}
.van-cell__value {
  overflow: none;
  text-align: left;
  vertical-align: middle;
  position: absolute;
  top: 14px;
}
.van-cell__title {
  padding-left: 25px;
}
.van-cell__right-icon {
  font-size: 14px;
}
.van-icon-checked {
  color: #c06;
}
</style>

<style>
.choice-ok {
  color: #fff;
  line-height: 90px;
  text-align: center;
  background-color: #ff5162;
  font-size: 28px;
}
</style>