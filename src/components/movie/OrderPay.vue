<template>
  <div class="container">
    <!-- 支付提示开始 -->
    <div class="pay-tips" v-if="ticket.dataStatus == 1">支付剩余时间：{{timer}}</div>
    <div class="pay-tips" v-if="ticket.dataStatus != 1">{{ticket.dataStatus | statusToStr}}</div>
    <!-- 支付提示结束 -->

    <!-- 票信息开始 -->
    <div class="ticket-cont">
      <h3 class="ticket-name">{{ticket.filmName}}</h3>
      <div class="ticket-cinema-name">{{ticket.cinemaName}}</div>
      <div class="ticket-cinema-name">
        {{ticket.cinemaHallName}}
        {{ticket.showTime | dateFormat}}
      </div>
      <div class="ticket-time">
        <span class="ticket-magin" v-for="(item, index) in seats" :key="index">{{item}}</span>
      </div>
      <div class="ticket-phone">手机号：{{ticket.phone}}</div>
      <!-- 选择支付方式开始 -->
      <div class="ticket-cont" v-if="ticket.dataStatus == 1">
        <h3>选择支付方式</h3>
        <van-cell-group>
          <template v-for="item in listPayChannel">
            <van-cell
              v-if="item.payChannelCategory == 3"
              @click="goOnceCard(item)"
              :title="item.name"
              :value="checkPayCard.payChannel == item.id ? '抵扣:'+ deductible : ''"
              icon="card"
              is-link
              :key="'ck'+item.id"
            />
            <van-cell
              v-if="item.payChannelCategory == 1"
              @click="goCashCard(item)"
              :title="item.name"
              :value="checkPayCard.payChannel == item.id ? '抵扣:'+ deductible : ''"
              icon="debit-pay"
              is-link
              :key="'xjk'+item.id"
            />
            <van-cell
              v-if="item.payChannelCategory == 8"
              @click="checkPayChannel = item.id"
              :title="item.name"
              icon="wechat"
              :key="'wx'+item.id"
            >
              <van-icon
                slot="right-icon"
                name="checked"
                class="van-cell__right-icon"
                v-show="checkPayChannel == item.id"
              />
              <van-icon
                slot="right-icon"
                name="check"
                class="van-cell__right-icon"
                v-show="checkPayChannel != item.id"
              />
            </van-cell>
            <van-cell
              v-if="item.payChannelCategory == 11"
              @click="checkPayChannel = item.id"
              :title="item.name"
              icon="debit-pay"
              :key="'yc'+item.id"
            >
              <van-icon
                slot="right-icon"
                name="checked"
                class="van-cell__right-icon"
                v-show="checkPayChannel == item.id"
              />
              <van-icon
                slot="right-icon"
                name="check"
                class="van-cell__right-icon"
                v-show="checkPayChannel != item.id"
              />
            </van-cell>
          </template>
        </van-cell-group>
      </div>
      <!-- 选择支付方式结束 -->
    </div>
    <!-- 票信息结束 -->

    <!-- 支付按钮开始 -->
    <div class="ticket-ctrl">
      <div class="ticket-ctrl-left">
        <em>待支付：</em>
        ￥{{toBePaid}}
      </div>
      <div
        class="ticket-ctrl-right"
        @click="goWechat"
        v-if="ticket.dataStatus == 1 && toBePaid > 0 && payChannel.indexOf(8) >= 0 && (! $route.query.wechat)"
        v-show="timer != '00:00'"
      >获取微信授权</div>
      <div
        class="ticket-ctrl-right"
        @click="payOk"
        v-if="ticket.dataStatus == 1 && (toBePaid == 0 || payChannel.indexOf(8) < 0 || $route.query.wechat)"
        v-show="timer != '00:00'"
      >确认支付</div>
    </div>
    <!-- 支付按钮结束 -->
  </div>
</template>

<script>
export default {
  name: "MoviePay",
  components: {},
  data() {
    return {
      ticket: {},
      seats: [], // 座位
      timer: "00:00", // 倒计时时间
      listPayChannel: [], // 支付渠道列表
      checkPayCard: {
        money: 0
      }, // 选中的卡券
      orderAmount: 0, // 订单总额

      payChannelObj: {}, // 支付对象
      payChannel: [], // 支付类型集合
      checkPayChannel: "", // 选中补差支付方式
      payChannelCategory: 0, // 支付渠道类型
      // 支付类型判断
      paymentMethodList: [
        {
          // 现金卡支付
          channel: "1",
          str: "1"
        },
        {
          // 次卡支付
          channel: "3",
          str: "2"
        },
        {
          // 微信支付
          channel: "8",
          str: "3"
        },
        {
          // 现金卡微信补差支付
          channel: "1,8",
          str: "4"
        },
        {
          // 次卡微信补差支付
          channel: "3,8",
          str: "5"
        },
        {
          // 中国邮政储蓄银行支付
          channel: "11",
          str: "9"
        }
      ],
      deductible: 0, // 抵扣金额(元)
      toBePaid: 0, // 待支付金额(元)
      wxData: {}, // 微信支付信息
      wechatOk: this.$route.query.wechat ? true : false
    };
  },
  created() {
    // 获取选中卡券信息
    if (this.$cookies.get("checkPayCard")) {
      let checkPayCard = JSON.parse(this.$cookies.get("checkPayCard"));
      if (checkPayCard.order == this.$route.params.id) {
        this.checkPayCard = checkPayCard;
      }
    }
    this.$store.commit("ctrlLoader", true);
    this.getListPayChannel();
    this.getOrder();

    // 验证微信支付
    // if(! this.$route.query.wechat){
    //   this.goWechat()
    // }
  },
  methods: {
    // 计算金额
    amountCalculation() {
      if (this.checkPayCard.money) {
        this.deductible = (this.checkPayCard.money / 100).toFixed(2);
        this.toBePaid = (
          (this.ticket.orderAmount - this.checkPayCard.money) /
          100
        ).toFixed(2);
      } else {
        this.deductible = 0;
        this.toBePaid = (this.ticket.orderAmount / 100).toFixed(2);
      }
    },
    // 支付
    payOk() {
      let vm = this;

      let paymentMethod = ""; // 支付类型

      if (this.ticket.dataStatus != 1) {
        vm.$toast("订单不可支付");
        return;
      }

      let nextStater = true;

      // 验证微信补差
      if (
        vm.payChannel.indexOf(8) >= 0 &&
        vm.checkPayCard.money - 0 < parseInt(vm.orderAmount - 0) * 100
      ) {
        if (!vm.$route.query.wechat) {
          nextStater = false;
          vm.goWechat();
          return;
        }
        if (!vm.checkPayCard.order) {
          // 单一微信支付
          vm.paymentMethodList.forEach((e, i) => {
            if (e.channel == "8") {
              paymentMethod = e.str;
            }
          });
        } else {
          // 微信补差支付
          vm.paymentMethodList.forEach((e, i) => {
            if (
              e.channel.indexOf(vm.checkPayCard.payType + "") >= 0 &&
              e.channel.indexOf("8") >= 0
            ) {
              paymentMethod = e.str;
            }
          });
        }
      } else if (vm.payChannel.indexOf(11) >= 0) {
        // 中国邮政储蓄银行支付
        paymentMethod = 9;
      } else {
        // 不补差情况
        if (!vm.checkPayCard.order) {
          vm.$toast("请选择支付方式");
          return;
        }
        // 支付类型赋值
        vm.paymentMethodList.forEach((e, i) => {
          if (e.channel == vm.checkPayCard.payType) {
            paymentMethod = e.str;
          }
        });
      }

      // 下一步
      if (!nextStater) {
        return;
      }
      // 乘法函数
      function numMulti(num1, num2) {
        var baseNum = 0;
        try {
          baseNum += num1.toString().split(".")[1].length;
        } catch (e) {}
        try {
          baseNum += num2.toString().split(".")[1].length;
        } catch (e) {}
        return (
          (Number(num1.toString().replace(".", "")) *
            Number(num2.toString().replace(".", ""))) /
          Math.pow(10, baseNum)
        );
      }
      // 上传参数
      let postData = {
        paymentMethod: paymentMethod,
        orderId: this.$route.params.id,
        voucher: vm.checkPayCard.voucher ? vm.checkPayCard.voucher : "", // 卡号
        wechatPayPrice: numMulti(Number(vm.toBePaid), 100)
      };
      this.$http
        .post("/panda-cinema-api/v1/payment", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              // 中国邮政储蓄银行
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
    },
    // 次卡支付
    goOnceCard(payChannel) {
      window.localStorage.setItem(
        "payChannel",
        JSON.stringify({
          id: payChannel.id,
          params: payChannel.params
        })
      );
      this.$router.push({
        path: "/orderPayOnceCard/" + this.$route.params.id,
        query: {
          payChannel: payChannel.id,
          money: this.ticket.orderAmount,
          nums: this.ticket.quantity,
          full: this.payChannel.indexOf(8) >= 0 ? 1 : 0
        }
      });
    },
    // 现金卡支付
    goCashCard(payChannel) {
      window.localStorage.setItem(
        "payChannel",
        JSON.stringify({
          id: payChannel.id,
          params: payChannel.params
        })
      );
      this.$router.push({
        path: "/orderPayCashCard/" + this.$route.params.id,
        query: {
          payChannel: payChannel.id,
          money: this.ticket.orderAmount,
          full: this.payChannel.indexOf(8) >= 0 ? 1 : 0
        }
      });
    },
    // goWechatPay(payChannel) {
    //   let vm = this;
    //   vm.checkPayChannel = payChannel.id;
    //   vm.payChannelCategory = payChannel.payChannelCategory;
    // },
    // goPsbc(payChannel) {
    //   let vm = this;
    //   vm.checkPayChannel = payChannel.id;
    //   vm.payChannelCategory = payChannel.payChannelCategory;
    // },
    // 获取微信授权
    goWechat() {
      // TODO 重新刷新Token
      let vm = this;
      vm.$http
        .get("/v1/refreshToken/" + vm.$init.refreshToken)
        .then(response => {
          if (response.data.code == "1000") {
            vm.$init.login.user = response.data.result.cacheUser;
            vm.$init.login.accessToken = response.data.result.accessToken;

            let urlStr = window.location.href;
            let backUrl = encodeURIComponent(urlStr + "?wechat=true");
            let nowToken = this.$init.login.accessToken; // this.$cookies.get('sccessToken');
            window.localStorage.setItem(
              "payBackData",
              JSON.stringify({
                user: this.$init.login.user,
                accessToken: this.$init.login.accessToken
              })
            );
            // 获取权限链接
            window.location.href =
              this.$init.channel.apiUrl +
              "/panda-payment-api/wap/wechat/authorize?accessToken=" +
              nowToken +
              "&state=" +
              backUrl;
          }
        });
    },
    wxPlay() {
      let vm = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: vm.wxData.appId, //公众号名称，由商户传入
          timeStamp: vm.wxData.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: vm.wxData.nonceStr, //随机串
          package: vm.wxData.package,
          signType: "MD5", //微信签名方式：
          paySign: vm.wxData.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            vm.$router.push("/success");
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            vm.$router.push("/fail");
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            vm.$router.push("/fail");
          }
        }
      );
    },
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },
    // 获取订单信息
    getOrder() {
      let vm = this;
      this.$http
        .get("/panda-cinema-api/v1/getOrder/" + this.$route.params.id)
        .then(function(response) {
          vm.$store.commit("ctrlLoader", false);
          if (response.data.code == "1000") {
            vm.ticket = response.data.result;
            vm.seats = response.data.result.rowCol.split(",");
            vm.resetTime(response.data.result.overTime);
            vm.orderAmount = (vm.ticket.orderAmount / 100).toFixed(2);
            vm.amountCalculation(); // 计算金额
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 获取支付渠道
    getListPayChannel() {
      let vm = this;
      this.$http
        .get("/panda-cinema-api/v1/listPayChannel")
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.listPayChannel = response.data.result;
            if (response.data.result) {
              let payChannelObj = {};
              response.data.result.forEach((e, i) => {
                vm.payChannel.push(e.payChannelCategory);
                // if (vm.checkPayChannel == "" && e.payChannelCategory == 8) {
                //   vm.checkPayChannel = e.id;
                // }
                // 中国邮政储蓄银行支付
                if (vm.checkPayChannel == "" && e.payChannelCategory == 11) {
                  vm.checkPayChannel = e.id;
                }
                payChannelObj["p" + e.payChannelCategory] = e;
              });
              vm.payChannelObj = payChannelObj;
            }
            console.log(vm.listPayChannel);
            // vm.getOrder()
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 倒计时插件
    resetTime(time) {
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
      var timer = null;
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

          vm.timer = m + ":" + s;
        } else {
          vm.timer = "00:00";
          clearInterval(timer);
        }
      }

      timer = setInterval(countDown, 1000);
    }
  },
  filters: {
    // 金钱格式化
    moneyFormat(value) {
      if (value) {
        return (value / 100).toFixed(2);
      } else if (value === 0) {
        return 0;
      } else {
        return "";
      }
    },
    // 时间格式化
    dateFormat(shijianchuo) {
      function add0(m) {
        return m < 10 ? "0" + m : m;
      }
      var time = new Date(shijianchuo * 1000);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + add0(m) + "-" + add0(d) + " " + add0(h) + ":" + add0(mm);
    },
    // 状态转字符串
    statusToStr(value) {
      if (value == 1) {
        return "待付款";
      } else if (value == 2) {
        return "待出票";
      } else if (value == 3) {
        return "已出票";
      } else if (value == 4) {
        return "已取消";
      } else if (value == 5) {
        return "已失败";
      } else {
        return "";
      }
    },
    // 放映类型
    showTypeToStr(value) {
      if (value == 1) {
        return "2D";
      } else if (value == 2) {
        return "3D";
      } else if (value == 3) {
        return "MAX2D";
      } else if (value == 4) {
        return "MAX3D";
      } else if (value == 6) {
        return "DMAX";
      } else {
        return "";
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
