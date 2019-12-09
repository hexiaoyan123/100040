<template>
  <div class="container">
    <Vheader name="订单详情"></Vheader>
    <div class="move-item">
      <div class="move-item-in clearfix">
        <div class="move-item-cinema" @click="clickCinemaDetails">
          <span>{{item.cinemaName}}</span>
          <span class="type-span">
            <i class="move-item-cinema-icon"></i>
          </span>
        </div>
        <div>
          <figure class="move-item-img">
            <img :src="item.film.poster" />
          </figure>
          <div class="move-item-r">
            <h4 class="unoverflow">{{item.filmName}}</h4>
            <p class="unoverflow">
              <span class="move-type">{{item.showType | showVersionFormat}}</span>
            </p>
            <p class="unoverflow">{{item.film.actor}}</p>
            <p class="unoverflow" style="color: #C0C0C0;">{{item.showTime | dateFormat}}</p>
            <p class="unoverflow" style="color: #C0C0C0;">{{item.cinemaHallName}} {{item.rowCol}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="move-item">
      <div class="move-item-in clearfix item-info">
        <p>
          取票码
          <span class="red" style="font-size: 15px;">{{item.voucher}}</span>
        </p>
        <p>
          订单号
          <span>{{item.id}}</span>
        </p>
        <p>
          购票时间
          <span>{{item.createTime | dateFormat}}</span>
        </p>
        <p>
          手机号码
          <span>{{item.phone}}</span>
        </p>
        <p>
          订单金额
          <span class="red">
            <small>￥</small>
            <span class="priceSpan" v-html="priceFormat(item.orderAmount)"></span>
          </span>
        </p>
      </div>
    </div>
    <div class="move-item">
      <div class="move-item-in clearfix item-address">
        <div style="width: calc(100% - 60px);">
          <p style="font-size: 14px;">{{item.cinemaName}}</p>
          <p class="address-p">
            <span>{{item.cinema.cinemaAddress}}</span>
          </p>
        </div>
        <div class="phone-item" @click="toPhone(item.cinema.cinemaPhone)">
          <i></i>
        </div>
      </div>
    </div>
    <div class="c-cont" v-show="item.dataStatus == 1 || item.dataStatus == 4">
      <!-- <span v-show="item.dataStatus == 1" class="btn yiquxiao">已取消</span>
      <span v-show="item.dataStatus == 1" class="btn quxiao">取消订单</span>-->
      <span class="btn" @click="goPay" v-show="item.dataStatus == 1">立即支付</span>
    </div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  components: {
    Vheader
  },
  name: "OrderDetails",
  data() {
    return {
      item: {}
    };
  },
  created() {
    // 订单
    let localOrder = JSON.parse(window.localStorage.getItem("clickOrder"));
    if (localOrder) {
      this.item = localOrder;
    } else {
      this.$router.back(-1);
    }
  },
  methods: {
    toPhone(phone) {
      window.location.href = "tel://" + phone;
    },

    // 点击影院详情
    clickCinemaDetails() {
      window.localStorage.setItem(
        "clickCinema",
        JSON.stringify(this.item.cinema)
      );
      this.$router.push({
        path: "/movie/cinemaDetails",
        query: {
          cinema: {}
        }
      });
    },

    // 价格格式化
    priceFormat(value) {
      if (value) {
        var moneyValue = (Number(value) / 100).toFixed(2).split(".");
        return "<big>" + moneyValue[0] + "</big>." + moneyValue[1];
      } else if (value === 0) {
        return "0";
      } else {
        return "";
      }
    },

    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 去支付
    goPay() {
      // this.$router.push("/movie/orderPay/" + this.order.id);
      this.$router.push("/movie/confirmCinemaOrder/" + this.item.id);
    },

    // 倒计时
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
    // 状态格式化
    dataStatusFormat(val) {
      if (val == 1) {
        return "待付款";
      } else if (val == 2) {
        return "待出票";
      } else if (val == 3) {
        return "已出票";
      } else if (val == 4) {
        return "已取消";
      } else if (val == 5) {
        return "已失败";
      } else {
        return "";
      }
    },

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
        return add0(m) + "-" + add0(d) + " " + add0(h) + ":" + add0(mm);
      } else {
        return "";
      }
    },

    // 场次类型格式化
    showVersionFormat(val) {
      var list = [
        {
          val: 1,
          label: "2D"
        },
        {
          val: 2,
          label: "3D"
        },
        {
          val: 3,
          label: "4D"
        },
        {
          val: 4,
          label: "IMAX2D"
        },
        {
          val: 5,
          label: "IMAX3D"
        },
        {
          val: 6,
          label: "IMAX4D"
        },
        {
          val: 7,
          label: "中国巨幕2D"
        },
        {
          val: 8,
          label: "中国巨幕3D"
        },
        {
          val: 9,
          label: "中国巨幕4D"
        }
      ];
      var str = "";
      list.forEach((e, i) => {
        if (e.val == val) {
          str = e.label;
        }
      });
      return str;
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 85px;
}

.move-list {
  background-color: #ffffff;
  padding-top: 6px;
}

.move-item {
  padding: 6px 26px 20px 26px;
  margin-bottom: 10px;
  margin-top: 20px;
}

.move-item-in {
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.move-item-r {
  width: calc(100% - 220px);
  float: right;
  padding-top: 8px;
  color: #8a8a8a;
  position: relative;
}

.move-item-img {
  float: left;
  display: block;
  width: 200px;
  height: 240px;
  border-radius: 10px;
  border: 1px solid #eee;
  overflow: hidden;
  position: relative;
}

.move-item-img img {
  width: 100%;
  height: 100%;
}

.move-item-r h4 {
  font-size: 28px;
  line-height: 38px;
  font-weight: 500;
  /* height: 120px; */
  padding-bottom: 10px;
  color: #4d4d4d;
  padding-left: 5px;
}

.move-item-lable {
  font-size: 24px;
  line-height: 38px;
}

.move-item-r p {
  font-size: 24px;
  line-height: 38px;
  /* margin-top: 16px; */
  width: 100%;
}

.move-item-r p .score {
  font-size: 32px;
  color: #ff8e21;
}

.move-item-btn {
  position: absolute;
  display: block;
  line-height: 60px;
  padding: 0 30px;
  border-radius: 40px;
  color: #ff5364;
  border: 1px solid #ffaec1;
  right: 0;
  top: 100px;
  font-size: 24px;
}

.move-item-btn.ready {
  color: #ff9e48;
  border: 1px solid #ffcb95;
}

.move-type {
  font-size: 18px;
  color: #ffffff;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  border-radius: 5px;
  padding: 7px 20px 3px 20px;
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #fd4471);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #fd4471);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #fd4471);
  margin-right: 5px;
  position: relative;
}

.move-type-p {
  padding-left: 40px;
}

.move-type-c {
  background-color: #f1f1f1;
  position: absolute;
  line-height: 34px;
  padding: 0px 5px;
  height: 100%;
  border: #f1f1f1;
  color: #a4a4a4;
  top: 0px;
  left: 0px;
  border-radius: 5px 0 0 5px;
}

.many-left {
  color: #ff5162;
  float: right;
}

.move-item-cinema {
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f3f3;
  margin-bottom: 10px;
  position: relative;
}

.move-item-cinema .type-span {
  float: right;
}

.type-span .move-item-cinema-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../assets/movie/to.png);
  background-size: 100% 100%;
  position: absolute;
  top: 7px;
  right: 10px;
}

.red {
  color: #ff5162 !important;
}

.item-info p {
  line-height: 60px;
  color: #8d8d8d;
}

.item-info p span {
  float: right;
  color: #c0c0c0;
}

.item-address > div {
  float: left;
}

.item-address p {
  margin-bottom: 5px;
}

.item-address .address-p {
  color: #c0c0c0;
  padding-right: 20px;
}

.item-address .address-p span:first-child {
  display: inline-block;
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-address .address-p .juli {
  width: 40%;
  position: relative;
  display: inline-block;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-address .address-p .juli i {
  display: inline-block;
  width: 20px;
  height: 25px;
  background-image: url(../../assets/movie/zuobiao.png);
  background-size: 100% 100%;
  position: absolute;
  top: 0px;
  right: 80px;
}

.phone-item {
  width: 100px;
  height: 70px;
  margin-top: 5px;
  border-left: 1px solid #f1f1f1;
  text-align: center;
  position: relative;
}

.phone-item i {
  width: 40px;
  height: 40px;
  display: inline-block;
  background-image: url(../../assets/movie/phone.png);
  background-size: 100% 100%;
  position: absolute;
  top: 15px;
}
.c-cont {
  position: fixed;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 24px 20px 0 20px;
  height: 100px;
  text-align: right;
  border-top: 1px solid #f8f8f8;
}
.btn {
  display: inline-block;
  font-size: 24px;
  line-height: 50px;
  height: 50px;
  width: 140px;
  border: 1px solid #ff5162;
  color: #ff5162;
  text-align: center;
  border-radius: 25px;
  margin-left: 20px;
}

.quxiao.quxiao {
  border: 1px solid #d1d1d1;
  color: #000000;
}
.yiquxiao {
  border: 1px solid #d1d1d1;
  color: #d1d1d1;
}
</style>
