<template>
  <div class="container">
    <Vheader name="确认订单"></Vheader>

    <div class="ticket-cont">
      <div style="margin: 50px auto 5px; text-align: center; font-size: 6.4vw;">{{order.filmName}}</div>
      <div style="margin: 5px auto 30px; text-align: center; font-size: 3.2vw; color: #818181">
        <p>{{order.showTime | dateFormat}}（时长{{order.duration / 60}}分钟）</p>
        <p>{{order.cinemaName}} {{order.cinemaHallName}}</p>
        <p>{{order.rowCol}}</p>
        <p>￥{{order.orderAmount | priceFormat}}</p>
        <p>{{order.phone}}</p>
      </div>

      <h1 style="margin: 50px 10px 5px; font-size: 4.8vw;">购票须知</h1>
      <div style="margin: 5px 10px 30px; font-size: 3.2vw; color: #818181">
        <p>1.请确认场次和时间无误，购买成功后将不予退换；</p>
        <p>2.由于设备故障等不可抗力因素，存在少量场次取消的情况，会进行退票退款；</p>
        <p>3.由于影院系统不稳定等因素，存在出票失败的情况，会进行退款。</p>
      </div>
    </div>

    <!-- 确认支付 -->
    <div
      class="choice-ok gradation"
      style="position: fixed; width: 100%; bottom: 0;"
      @click="confirmPayment"
    >确认支付</div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "confirmCinemaOrder",
  components: {
    Vheader
  },
  data() {
    return {
      // 订单号
      orderId: this.$route.params.orderId,
      // 订单
      order: {
        filmName: ""
      }
    };
  },
  created() {
    // 获取订单
    this.getOrder();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 获取订单
    getOrder() {
      let vm = this;
      vm.$http
        .get("/panda-cinema-api/v1/getOrder/" + vm.orderId)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.order = response.data.result;

            // 订单支付信息
            let orderPay = {
              business: vm.$init.channelCategory.WAP_CINEMA.code,
              businessName: vm.$init.channelCategory.WAP_CINEMA.msg,
              orderId: vm.order.id,
              overTime: vm.order.overTime,
              orderAmount: vm.order.orderAmount,
              amount: vm.order.orderAmount / vm.order.quantity
            };
            window.localStorage.setItem(
              "clickOrderPay",
              JSON.stringify(orderPay)
            );
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 确认支付
    confirmPayment() {
      let vm = this;

      let redirectUrl = encodeURIComponent(vm.$init.channel.payAuthUrl);
      let accessToken = vm.$init.login.accessToken;
      vm.$cookies.set(
        "payBackData",
        JSON.stringify({
          user: vm.$init.login.user,
          accessToken: accessToken
        })
      );

      window.location.href =
        vm.$init.channel.apiUrl +
        "/panda-payment-api/v1/goPayChannel/" +
        accessToken +
        "/" +
        vm.$init.channel.id +
        "/" +
        vm.$init.channelCategory.WAP_CINEMA.code +
        "?redirectUrl=" +
        redirectUrl;
    }
  },
  filters: {
    // 时间格式化
    dateFormat(val) {
      if (val) {
        let add0 = m => {
          return m < 10 ? "0" + m : m;
        };
        var time = new Date(val * 1000);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return (
          y +
          "-" +
          add0(m) +
          "-" +
          add0(d) +
          " " +
          add0(h) +
          ":" +
          add0(mm) +
          ":" +
          add0(s)
        );
      } else {
        return "";
      }
    },

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
  color: #666;
  padding: 20px 0;
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