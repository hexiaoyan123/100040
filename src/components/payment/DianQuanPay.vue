<template>
  <div class="container address-list">
    <Vheader name="选择凭证"></Vheader>

    <div class="card">
      <div class="card-add" @click="isAddVoucher = true">
        <i class="iconfont on">&#xe602;</i>
        <span>添加点券</span>
      </div>

      <ul class="card-list">
        <li
          class="card-item"
          :class="{'card-item-on': selectedVoucher.voucherIdList.indexOf(item.voucher) >= 0, 'uncheck': currentDate > item.expDate}"
          v-for="item in userVoucherList"
          :key="item.voucher"
          @click="checkVoucher(item)"
        >
          <div class="card-item-top"></div>
          <div class="card-item-cont">
            <dl>
              <dt>券号</dt>
              <dd>{{item.voucher}}</dd>
            </dl>
            <dl>
              <dt>类型</dt>
              <dd>{{item.payTypeName}}</dd>
            </dl>
            <dl>
              <dt>有效期</dt>
              <dd>{{item.expDate}}</dd>
            </dl>
            <dl>
              <dt>余额</dt>
              <dd class="on">{{item.balance}}点</dd>
            </dl>
          </div>
          <div class="uncheck-label">已过期</div>
          <div class="card-jiao">
            <van-icon name="success" />
          </div>
        </li>
      </ul>
    </div>

    <!-- 操作凭证 -->
    <div class="card-footer">
      <div class="card-footer-left">
        <span v-show="selectedVoucher.voucherIdList.length <= 0">请选择点券，完成订单支付</span>

        <span
          class="card-un"
          v-show="selectedVoucher.voucherIdList.length > 0 && selectedVoucher.totalAmount < orderPay.orderAmount"
        >还需支付：￥{{orderPay.orderAmount - selectedVoucher.totalAmount | priceFormat}}</span>

        <span
          class="on"
          v-show="selectedVoucher.voucherIdList.length > 0 && selectedVoucher.totalAmount >= orderPay.orderAmount"
        >已足额支付：￥{{orderPay.orderAmount | priceFormat}}</span>
      </div>
      <div
        class="card-footer-right"
        v-show="selectedVoucher.hybridPay && selectedVoucher.voucherIdList.length > 0 && selectedVoucher.totalAmount < orderPay.orderAmount"
        @click="confirmPayment(11)"
      >微信补差支付</div>
      <div
        class="card-footer-right"
        v-show="selectedVoucher.voucherIdList.length > 0 && selectedVoucher.totalAmount >= orderPay.orderAmount"
        @click="confirmPayment(10)"
      >确认支付</div>
    </div>

    <!-- 添加凭证 -->
    <div class="card-modo" v-show="isAddVoucher" @click="isAddVoucher = false">
      <div class="card-modo-in" @click.stop="1">
        <h3 class="card-modo-name">添加点券</h3>

        <ul class="card-modo-form">
          <li class="card-modo-item">
            <div class="card-modo-item-lable">券号：</div>
            <input @blur="iptBlur" @focus="iptFocus" type="text" v-model="voucherForm.voucher" />
            <div class="card-modo-item-ctrl"></div>
          </li>

          <li class="card-modo-item">
            <div class="card-modo-item-lable">密码：</div>
            <input
              @blur="iptBlur"
              @focus="iptFocus"
              type="password"
              v-model="voucherForm.voucherPassword"
            />
            <div class="card-modo-item-ctrl"></div>
          </li>
        </ul>
        <div class="form-modo-btn" @click="confirmBinding">确认绑定</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "ciKaPay",
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
      // 用户凭证
      userVoucherList: [],
      // 选中的凭证
      selectedVoucher: {
        // 凭证
        voucherList: [],
        // 凭证编号
        voucherIdList: [],
        // 总值
        totalAmount: 0,
        // 支持混合支付
        hybridPay: true
      },

      // 添加凭证弹窗
      isAddVoucher: false,
      // 添加凭证
      voucherForm: {
        voucher: "",
        voucherPassword: ""
      }
    };
  },
  created() {
    // 订单支付信息
    let clickOrderPay = JSON.parse(
      window.localStorage.getItem("clickOrderPay")
    );
    if (clickOrderPay) {
      this.orderPay = clickOrderPay;

      // 获取凭证
      this.listUserVoucher(this.orderPay);
    } else {
      this.goBack();
    }

    // 选中的支付渠道
    let clickPayChannel = JSON.parse(
      window.localStorage.getItem("clickPayChannel")
    );
    if (clickPayChannel) {
      this.selectedPayChannel = clickPayChannel;
    } else {
      this.goBack();
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 获取我的凭证
    listUserVoucher(val) {
      let vm = this;
      vm.$http
        .get(
          "/panda-payment-api/v1/listUserVoucher/7/" +
            val.business +
            "/" +
            val.orderId
        )
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              vm.userVoucherList = response.data.result;
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 选中凭证
    checkVoucher(val) {
      let vm = this;

      // 验证凭证有效期
      if (val.expDate < vm.currentDate) {
        vm.$toast("此凭证已过有效期！");
        return;
      }
      // 验证BIN
      if (
        !vm.selectedPayChannel.params ||
        "" == vm.selectedPayChannel.params ||
        vm.selectedPayChannel.params.indexOf(val.voucher.substring(0, 2)) == -1
      ) {
        vm.$toast("当前渠道不支持此凭证！");
        return;
      }

      if (vm.selectedVoucher.voucherIdList.indexOf(val.voucher) >= 0) {
        // 取消选中
        let voucherList = [];
        let voucherIdList = [];
        vm.selectedVoucher.voucherList.forEach((e, i) => {
          if (e.voucher != val.voucher) {
            voucherList.push(e);
            voucherIdList.push(e.voucher);
          }
        });
        vm.selectedVoucher.voucherList = voucherList;
        vm.selectedVoucher.voucherIdList = voucherIdList;
        // 计算价格
        let totalAmount = 0;
        vm.selectedVoucher.voucherList.forEach((e, i) => {
          totalAmount += vm.$base.numMulti(Number(e.balance), 100);
        });
        vm.selectedVoucher.totalAmount = totalAmount;
      } else {
        // 验证金额
        if (vm.selectedVoucher.totalAmount >= vm.orderPay.orderAmount) {
          vm.$toast("已已足额支付！");
          return;
        }
        // 增加选中
        vm.selectedVoucher.voucherList.push(val);
        vm.selectedVoucher.voucherIdList.push(val.voucher);
        // 计算价格
        let totalAmount = 0;
        vm.selectedVoucher.voucherList.forEach((e, i) => {
          totalAmount += vm.$base.numMulti(Number(e.balance), 100);
        });
        vm.selectedVoucher.totalAmount = totalAmount;
      }

      // 是否支持混合支付
      vm.selectedVoucher.hybridPay = val.hybridPay != 1 ? false : true;
    },

    // 确认支付
    confirmPayment(val) {
      let vm = this;

      // 验证凭证
      if (
        vm.selectedVoucher.voucherIdList.length <= 0 ||
        vm.selectedVoucher.totalAmount <= 0
      ) {
        vm.$toast("请选择凭证！");
        return;
      }

      // 选中的凭证累计总金额
      let voucherTotalPrice = 0;
      // 选中的凭证号字符串（格式：卡号_支付金额 或 卡号_次数,卡号_次数）
      let voucher = "";
      vm.selectedVoucher.voucherList.forEach((e, i) => {
        if (voucher != "") {
          voucher += ",";
        }
        let voucherPrice = vm.$base.numMulti(Number(e.balance), 100);
        voucherTotalPrice += voucherPrice;
        voucher += e.voucher + "_" + voucherPrice;
      });

      // 请求支付订单对象
      let paymentOrder = {
        // 订单ID
        orderId: vm.orderPay.orderId,
        //  支付方式（
        //  1：中影现金卡支付；
        //  2：中影点券支付（按照真实价值计算）；
        //  3：微信支付；
        //  4：中影现金卡微信补差支付；
        //  5：中影点券（按照真实价值计算）微信补差支付；
        //  6：0元支付；
        //  7：中影点券支付（一点最多结算一张影票）；
        //  8：中影点券（一点最多结算一张影票）微信补差支付；
        //  9：中国邮政储蓄银行支付；
        //  10：中影点券支付；
        //  11：中影点券微信补差支付；
        //  ）
        paymentMethod: val,
        // 凭证（格式：券号_支付金额 或 券号_点数,券号_点数）
        voucher: voucher,
        // 金额（单位：分，微信支付时和微信补差时使用）
        wechatPayPrice: vm.orderPay.orderAmount - vm.selectedVoucher.totalAmount
      };

      console.info(paymentOrder);

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
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 确认绑定
    confirmBinding() {
      let vm = this;

      if (!vm.voucherForm.voucher) {
        vm.$toast("请输入券号！");
        return;
      }
      if (!vm.voucherForm.voucherPassword) {
        vm.$toast("请输入密码！");
        return;
      }

      vm.$http
        .post("/panda-payment-api/v1/saveUserVoucher", vm.voucherForm)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.$toast("绑定成功！");

            // 清除赋值
            vm.voucherForm = {
              voucher: "",
              voucherPassword: ""
            };

            // 关闭弹窗
            vm.isAddVoucher = false;

            // 获取凭证
            vm.listUserVoucher(vm.orderPay);
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // focus
    iptFocus() {
      this.errorMessage = "";
      this.inFocus = true;
    },
    // blur
    iptBlur() {
      let vm = this;
      vm.inFocus = false;
      setTimeout(function() {
        if (vm.inFocus == false) {
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          vm.checkWxScroll();
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
      var currentPosition, timer;
      // 页面滚动距离
      var speed = 1;
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        // 页面向上滚动
        window.scrollTo(0, 0);
        clearInterval(timer);
      }, 1);
    }
  },
  filters: {
    // 金额格式化
    priceFormat(val) {
      if (val) {
        return (val / 100).toFixed(2);
      } else if (val === 0) {
        return 0;
      } else {
        return "";
      }
    }
  },
  computed: {
    // 当前日期
    currentDate() {
      let add0 = m => {
        return m < 10 ? "0" + m : m;
      };
      var time = new Date();
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + add0(m) + "-" + add0(d);
    }
  }
};
</script>

<style scoped>
.uncheck .card-item-top {
  background: #f8f8f8;
}
.uncheck .card-item-cont {
  background: #f8f8f8;
}
.uncheck-label {
  position: absolute;
  right: 20px;
  top: 100px;
  font-weight: 700;
  font-size: 46px;
  transform: rotate(-30deg);
  display: none;
}
.uncheck .uncheck-label {
  display: block;
}
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
.address-list {
  padding-top: 100px;
  padding-bottom: 90px;
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
}
.card-item-on .card-jiao {
  display: block;
}
.card-item-top {
  height: 16px;
  line-height: 16px;
  color: #fff;
  position: relative;
  background: #ff5162; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    left top,
    #5fa0f9,
    #ff5162
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(
    bottom right,
    #5fa0f9,
    #ff5162
  ); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    bottom right,
    #5fa0f9,
    #ff5162
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(
    to bottom right,
    #5fa0f9,
    #ff5162
  ); /* Standard syntax */
}
.card-item-cont {
  background-color: #fff;
  padding: 10px 20px;
}
.card-item-cont dl {
  display: flex;
  font-size: 24px;
  line-height: 50px;
}
.card-item-cont dt {
  width: 100px;
  color: #999;
}
.card-item-cont dd {
  flex: 10;
}

.card-add .iconfont {
  font-size: 28px;
  line-height: 76px;
}
.card-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  background-color: #fff;
  display: flex;
  font-size: 24px;
}
.card-footer-left {
  flex: 10;
  padding: 0 20px;
}
.card-footer-right {
  width: 200px;
  text-align: center;
  background-color: #ff5162;
  color: #fff;
}

/* 凭证模态框 */
.card-modo {
  box-sizing: border-box;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: 20px;
}
.card-modo-in {
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
}

/* 輸入框 */
.card-modo-item {
  display: flex;
  font-size: 24px;
  color: #818181;
  line-height: 75px;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}
.card-modo-item input {
  display: block;
  height: 75px;
  border: none;
  font-size: 28px;
  line-height: 75px;
  outline: none;
  flex: 10;
  padding: 0 10px;
  min-width: 10px;
}
.card-modo-item-ctrl {
  position: relative;
}
.card-modo-code {
  display: block;
  height: 75px;
  width: 160px;
  border-radius: 6px;
  margin-right: 70px;
}
.card-modo-item-ctrl .iconfont {
  position: absolute;
  display: inline-block;
  top: 0;
  right: 0;
  height: 75px;
  line-height: 75px;
  width: 70px;
  text-align: center;
  font-size: 48px;
}
.form-modo-btn {
  width: 600px;
  margin: 20px auto;
  line-height: 80px;
  border-radius: 40px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  background-color: #ff5162;
}
.card-modo-item-ctrl-password {
  display: inline-block;
  line-height: 75px;
  width: 75px;
  text-align: right;
}
.card-modo-name {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  line-height: 80px;
  margin: 0 20px;
  border-bottom: 4px solid #ff5162;
}
.card-jiao {
  display: none;
  height: 0;
  width: 0;
  position: absolute;
  border: 30px solid transparent;
  bottom: 0;
  right: 0;
  border-right-color: #ff5162;
  border-bottom-color: #ff5162;
  color: #fff;
}
.card-un {
  color: rgb(241, 155, 56);
}
.opacity-5 {
  opacity: 0.5;
}
.card-item-on .nums-crtl {
  display: flex;
}
.nums-crtl {
  position: absolute;
  bottom: 40px;
  right: 80px;
  display: flex;
  width: 240px;
  border: 1px solid #eee;
  line-height: 80px;
  border-radius: 30px;
  overflow: hidden;
  display: none;
}
.nums-crtl-reduce {
  width: 80px;
  text-align: center;
  border-right: 1px solid #dfdfdf;
  font-size: 32px;
}
.nums-crtl-add {
  width: 80px;
  text-align: center;
  border-left: 1px solid #dfdfdf;
  font-size: 36px;
}
.nums-crtl-form {
  flex: 10;
  text-align: center;
}

.tishi {
  background-color: #f1cf64;
  color: #fff;
  padding: 0 20px;
  line-height: 60px;
  text-align: center;
  font-size: 27px;
}
</style>