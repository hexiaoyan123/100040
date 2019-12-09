<template>
  <div>
    <div class="move-item">
      <div class="move-item-in clearfix">
        <div class="move-item-cinema" @click="clickCinemaDetails">
          <span>
            {{item.cinemaName}}
            <i class="move-item-cinema-icon"></i>
          </span>
          <span class="type-span">{{item.dataStatus | dataStatusFormat}}</span>
        </div>
        <div @click="goOrderDetails">
          <figure class="move-item-img">
            <img :src="item.film.poster" />
          </figure>
          <div class="move-item-r">
            <h4 class="unoverflow">
              {{item.filmName}}
              <span
                style="color: #C0C0C0;margin-left: 5px;font-size: 14px;"
              >{{item.quantity}}张&nbsp;选座票</span>
            </h4>
            <p class="unoverflow">
              <span class="move-type">{{item.showType | showVersionFormat}}</span>
            </p>
            <p class="unoverflow">{{item.film.actor}}</p>
            <p class="unoverflow">{{item.showTime | dateFormat}}</p>
            <p class="unoverflow">
              {{item.cinemaHallName}} {{item.rowCol}}
              <span class="many-left">
                <small>￥</small>
                <span class="priceSpan" v-html="priceFormat(item.orderAmount)"></span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderMovieListItem",
  props: ["obj"],
  data() {
    return {
      timer: "00:00", // 倒计时时间
      show: true
    };
  },
  methods: {
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

    // 查看订单
    goOrderDetails() {
      window.localStorage.setItem("clickOrder", JSON.stringify(this.item));
      this.$router.push("/movie/orderDetails");
    },

    // // 去支付
    // goPlay() {
    //   // this.$router.push("/movie/orderPay/" + this.item.id);
    //   this.$router.push("/movie/confirmCinemaOrder/" + this.item.id);
    // },

    // 刷新列表
    refresh() {
      this.$emit("refreshList", true);
    },

    // 取消订单
    cancelOrder() {
      let vm = this;
      this.$http
        .get("/panda-cinema-api/v1/cancelOrder/" + this.info.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            vm.refresh();
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 立即支付
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
  computed: {
    item() {
      if (this.obj) {
        this.resetTime(this.obj.overTime);
        return this.obj;
      } else {
        return {};
      }
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
.move-list {
  background-color: #ffffff;
  padding-top: 6px;
}

.move-item {
  padding: 6px 26px 20px 26px;
  margin-bottom: 10px;
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
  color: #ff8e23;
}
.move-item-cinema .move-item-cinema-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../assets/movie/to.png);
  background-size: 100% 100%;
  position: absolute;
  top: 7px;
  margin-left: 10px;
}
</style>