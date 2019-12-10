<template>
  <div class="container">
    <Vheader :name="cinema.cinemaName"></Vheader>

    <!-- 电影名称开始 -->
    <div class="ca-list">
      <div class="cs-item">
        <h4>{{show.filmName}}</h4>
        <p>{{show.showStartTime | timeFormat}} {{show.language}} {{show.showVersion}}</p>
      </div>
    </div>
    <!-- 电影名称结束 -->

    <!-- 座位标识开始 -->
    <div class="st-id">
      <div class="st-id-in">
        <div class="st-id-lable">
          <span class="ignore-seat seat-1"></span>
          <label class="ignore-label">可选</label>
        </div>
        <div class="st-id-lable">
          <span class="ignore-seat seat-2"></span>
          <label class="ignore-label">已选</label>
        </div>
        <div class="st-id-lable">
          <span class="ignore-seat seat-3"></span>
          <label class="ignore-label">已售</label>
        </div>
        <div class="st-id-lable">
          <span class="ignore-seat seat-4"></span>
          <label class="ignore-label">情侣</label>
        </div>
      </div>
    </div>
    <!-- 座位标识结束 -->

    <!-- 座位选择开始 -->
    <div class="seats-wrapper-out-cont">
      <!-- 没有座位开始 -->
      <div class="noseats" v-show="noSeatList">
        <div class="cs-item" style="text-align: center;">
          <h4>本场次排期有误，请选择其他场次！</h4>
        </div>
      </div>
      <!-- 没有座位结束 -->

      <!-- 排号开始 -->
      <div class="seats-bor" :style="{'zoom': zoom}">
        <div class="seats-bor-item" v-for="val in rowList" :key="val">
          <span
            class="ignore-bor-item"
            :style="{'font-size': (14/zoom > 26 ? 26 : 14/zoom )+ 'px'}"
            v-if="val"
          >{{val}}</span>
        </div>
      </div>
      <!-- 排号结束 -->

      <div class="seats-wrapper-out" style="height: 100%;" ref="seatsOut" @scroll="ySetaScoll">
        <!-- 座位开始 -->
        <div class="seats-wrapper" v-finger:pinch="pinch" :style="{'zoom': zoom}">
          <!-- 中心线 -->
          <!-- <div class="seats-wrapper-center-line"></div> -->

          <div class="seats-screen" :style="{'zoom': zoom}">
            <div
              class="seats-screen-in"
              :style="{'margin-left': marginLeft+'px'}"
            >{{show.hallName}}荧幕</div>
          </div>
          <!-- <div style="height: 75px;">
            <span class="ymzy">银幕中央</span>
          </div>-->

          <div
            class="row"
            style="position: relative"
            v-for="value in dynamicSeatList"
            :key="value.id"
          >
            <a v-for="val in value.seatList" :key="val.id">
              <!-- 可选1 -->
              <span
                class="ignore-seat seat-1"
                :style="{'top': (val.xTop * 30) + 'px', 'left': (val.yLeft * 30) + 'px'}"
                v-if="val.id && val.dataStatus == 1"
                v-show="seatList.indexOf(val) < 0"
                @click="clickSeat(value, val)"
              ></span>
              <!-- 已选 -->
              <span
                class="ignore-seat seat-2"
                :style="{'top': (val.xTop * 30) + 'px', 'left': (val.yLeft * 30) + 'px'}"
                v-if="val.id && val.dataStatus == 1"
                v-show="seatList.indexOf(val) >= 0"
                @click="clickSeat(value, val)"
              ></span>
              <!-- 已售 -->
              <span
                class="ignore-seat seat-3"
                :style="{'top': (val.xTop * 30) + 'px', 'left': (val.yLeft * 30) + 'px'}"
                v-if="val.id && val.dataStatus == 2"
              ></span>
              <!-- 情侣左 -->
              <span
                class="ignore-seat seat-4"
                :style="{'top': (val.xTop * 30) + 'px', 'left': (val.yLeft * 30) + 'px'}"
                v-if="val.id && val.dataStatus == 3"
                @click="clickSeat(value, val)"
              ></span>
              <!-- 情侣右 -->
              <span
                class="ignore-seat seat-4"
                :style="{'top': (val.xTop * 30) + 'px', 'left': (val.yLeft * 30) + 'px'}"
                v-if="val.id && val.dataStatus == 4"
                @click="clickSeat(value, val)"
              ></span>
            </a>
          </div>
        </div>
        <!-- 座位结束 -->
      </div>
    </div>
    <!-- 座位选择结束 -->

    <div class="yixuan" v-if="seatList.length > 0">
      <div>
        <span style="margin-left: 5px; color: #808080;">已选座位</span>
        <el-popover placement="top-start" width="300" trigger="click">
          <div class="yiyuan-zhuyi-content">
            <p>
              票价：
              <span
                style="color: #FF5566;"
                v-html="'<price>¥</price>' + priceFormat(show.salesPrice * seatList.length)"
              ></span>
            </p>
            <p>1.{{cinema.cinemaName}}每次购票最多可选择{{show.buyNumLimit}}个座位；</p>
            <p>2.请确认场次和时间无误，购买成功后将不予退换；</p>
            <p>3.由于设备故障等不可抗力因素，存在少量场次取消的情况，会进行退票退款；</p>
            <p>4.由于影院系统不稳定等因素，存在出票失败的情况，会进行退款。</p>
          </div>
          <span class="yiyuan-zhuyi" slot="reference">
            <i class="yiyuan-zhuyi-icon"></i>
            温馨提示
          </span>
        </el-popover>
      </div>
      <div
        class="yixuan-con"
        style="display: inline-block; position: relative;"
        v-for="val in seatList"
        :key="'seat' + val.id"
      >
        <span class="yixuan-item">
          {{val.name}}
          <i class="yixuan-cha" @click="clickSeat(null, val, 'del')">
            <i></i>
          </i>
        </span>
      </div>
    </div>

    <!-- 提交开始 -->
    <div class="updata-cont">
      <div class="updata-right no-select" v-if="seatList.length < 1">请先选座</div>
      <div
        class="updata-right"
        v-if="seatList.length > 0"
        @click="checkPhone"
        v-html="'<price>¥</price>' + priceFormat(show.salesPrice * seatList.length) + '&nbsp;&nbsp;确认下单'"
      ></div>
    </div>
    <!-- 提交结束 -->

    <!-- 绑定手机号开始 -->
    <van-popup class="phone-popup" close-icon="close" position="bottom" v-model="phoneForm">
      <div>
        <p class="title">
          温馨提示
          <i class="iocn-close" @click="phoneForm = false"></i>
        </p>
        <p>请认真确认手机号，此手机号用于接收电影取票码。</p>
        <form class="search-block" action="javascript:void 0">
          <input
            class="bind-phone-input"
            type="number"
            v-model="phone"
            @keyup.13="tapToSearch"
            @blur="fixScroll"
          />
        </form>
      </div>
      <div class="botton" @click="submitOrder">确认手机号</div>
    </van-popup>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "MovieSeat",
  components: {
    Vheader
  },
  data() {
    return {
      // 缩放事件
      zoom: 0.8,
      minZoom: 0.7, // 最小缩放
      lastZoom: 1,
      borTop: 0, // 向上便宜距离
      // 影院
      cinema: {},
      // 场次
      show: {},
      // 动态座位
      dynamicSeatList: [],
      // 行号
      rowList: [],

      // 没有座位
      noSeatList: false,

      // 选中座位
      seatList: [],

      // 手机号表单
      phoneForm: false,

      // 手机号
      phone: "",
      marginLeft: ""
    };
  },
  created() {
    // 影院
    let localCinema = JSON.parse(window.localStorage.getItem("clickCinema"));
    if (localCinema) {
      this.cinema = localCinema;
    } else {
      this.$router.back(-1);
    }

    // 场次
    let localShow = JSON.parse(window.localStorage.getItem("clickShow"));
    if (localShow) {
      this.show = localShow;
    } else {
      this.$router.back(-1);
    }
  },
  mounted() {
    // 获取座位图
    this.listdynamicSeatList();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 获取座位图
    listdynamicSeatList() {
      let vm = this;
      this.$http
        .get("/panda-cinema-api/v2/listDynamicSeat/" + vm.show.id)
        .then(function(response) {
          if (response.data.code == "1000" && response.data.result) {
            vm.dynamicSeatList = response.data.result;
            // 行号
            vm.dynamicSeatList.forEach((e, i) => {
              e.rowList.forEach((v, j) => {
                vm.rowList.push(v);
              });
            });
            let arr = vm.dynamicSeatList[0].seatList;
            let newArr = [];
            let tempArr = [];
            let newArr1 = [];
            for (let i = 0; i < arr.length; i++) {
              newArr = arr.filter(item => item.row === i.toString());
              if (newArr.length != 0) {
                tempArr.push(newArr);
              }
            }
            //console.log(JSON.stringify(tempArr[0].length * 30)); //拿到第一行的数量计算中心距离
            let sumWidth = (tempArr[0].length * 30) / 2;
            let outWidth = document.querySelector(".seats-screen-in")
              .offsetWidth;
            let marginwidth = sumWidth - outWidth / 2;
            // outWidth.style.marginLeft = "marginwidth+'px'"; marginLeft是中间的小屏幕和左边的距离 是用（总宽度减去中间小提示的宽度）除2
            vm.marginLeft = marginwidth;
            // //缩放 到可视区域

            let sumWidth1 = tempArr[0].length * 30;
            let sunDivWidth = document.querySelector(".seats-wrapper-out")
              .offsetWidth;
            if (sumWidth1 <= 400) {
              vm.zoom = 0.9;
            } else {
              vm.zoom = sunDivWidth / sumWidth1;
            }
          } else {
            vm.noSeatList = true;
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 选择座位
    clickSeat(value, val, action) {
      //console.info(JSON.stringify(val));

      let vm = this;
      // 删除标识
      let delFlag = false;
      // 添加标识
      let addFlag = true;

      if ("del" == action) {
        delFlag = true;
      } else {
        if (1 == val.dataStatus) {
          vm.seatList.find(function(e) {
            if (val.id == e.id) {
              addFlag = false;
            }
          });

          // 添加
          if (addFlag) {
            if (vm.seatList.length < vm.show.buyNumLimit) {
              val.sectionId = value.id;
              vm.seatList.push(val);
            } else {
              vm.$toast(
                "每次购票最多只能选择" + vm.show.buyNumLimit + "个座位！"
              );
            }
          } else {
            delFlag = true;
          }
        }
      }

      // 删除
      if (delFlag) {
        let arr = [];
        vm.seatList.forEach((e, i) => {
          if (val.id != e.id) {
            arr.push(e);
          }
        });
        vm.seatList = arr;
      }
    },

    // 价格格式化（“分”转换为“元”）
    priceFormat(val) {
      if (val) {
        var price = (val / 100).toFixed(2).split(".");
        return "<big>" + price[0] + "</big>." + price[1];
      } else if (val === 0) {
        return "0";
      } else {
        return "";
      }
    },

    // 验证手机号
    checkPhone() {
      let vm = this;
      if (vm.seatList.length < 1) {
        vm.$toast("请选择座位！");
        return false;
      }
      if (vm.seatList.length > vm.show.buyNumLimit) {
        vm.$toast("每次购票最多只能选择" + vm.show.buyNumLimit + "个座位！");
        return false;
      }
      vm.phoneForm = true;
    },

    // 提交订单
    submitOrder() {
      let vm = this;
      if (vm.seatList.length < 1) {
        vm.$toast("请选择座位！");
        return false;
      }
      if (vm.seatList.length > vm.show.buyNumLimit) {
        vm.$toast("每次购票最多只能选择" + vm.show.buyNumLimit + "个座位！");
        return false;
      }
      if (!vm.isPhone(vm.phone)) {
        vm.$toast("请输入正确的手机号！");
        return false;
      }

      vm.$store.commit("ctrlLoader", true);
      let post = {
        phone: vm.phone,
        showId: vm.show.id,
        seatList: vm.seatList
      };
      vm.$http
        .post("/panda-cinema-api/v2/saveOrder", post)
        .then(function(response) {
          vm.$store.commit("ctrlLoader", false);
          if (response.data.code == "1000") {
            vm.$router.push(
              "/movie/confirmCinemaOrder/" + response.data.result
            );
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$store.commit("ctrlLoader", false);
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 验证手机号
    isPhone(val) {
      var reg = /^[1][2,3,4,5,7,8,9][0-9]{9}$/;
      if (reg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    //键盘回缩
    fixScroll() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.scrollTo(0, 0);
      }
    },
    // 缩放事件
    pinch(e) {
      if (e.zoom == 0.8) {
        alert(2);
        this.lastZoom = this.zoom;
      }
      let zoomNum = e.zoom * this.lastZoom;

      if (zoomNum < this.minZoom) {
        zoomNum = this.minZoom;
      } else if (zoomNum > 2) {
        zoomNum = 2;
      }
      this.zoom = zoomNum;
    },

    // 竖向移动
    ySetaScoll() {
      let vm = this;
      let top = document.querySelector(".seats-wrapper-out").scrollTop;
      let borTop = top / vm.zoom;
      document.querySelector(".seats-bor").style["margin-top"] =
        "-" + borTop + "px";
    }
  },
  filters: {
    // // 播放类型
    // showTypeToStr(vlaue) {
    //   if (vlaue == 1) {
    //     return "2D";
    //   } else if (vlaue == 2) {
    //     return "3D";
    //   } else if (vlaue == 3) {
    //     return "MAX2D";
    //   } else if (vlaue == 4) {
    //     return "MAX3D";
    //   } else if (vlaue == 6) {
    //     return "DMAX";
    //   } else {
    //     return "";
    //   }
    // },

    // 时间戳格式化
    timeFormat(val) {
      function add0(m) {
        return m < 10 ? "0" + m : m;
      }
      var time = new Date(val * 1000);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + add0(m) + "-" + add0(d) + " " + add0(h) + ":" + add0(mm);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  padding-top: 84px;
  padding-bottom: 100px;
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
  background-color: #ff5162;
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

.bind-phone-in .cs-item {
  padding: 10px 0;
  border: none;
}

.cs-item {
  padding: 10px 24px;
  border-bottom: 1px solid #eee;
}

.cs-item h4 {
  font-size: 28px;
  color: #4d4d4d;
  line-height: 50px;
  /* padding-left: 40px; */
  position: relative;
  font-weight: 500;
}

.cs-item p {
  font-size: 22px;
  color: #c1c1c1;
  line-height: 38px;
}

.cs-item-dui {
  display: inline-block;
  height: 30px;
  width: 30px;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background-color: #ff9900;
  position: absolute;
  top: 9px;
  left: 0;
}

.cs-item-zuo {
  display: inline-block;
  height: 30px;
  width: 30px;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background-color: #00b202;
  position: absolute;
  top: 9px;
  left: 0;
}

.st-ti {
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  line-height: 70px;
  font-size: 24px;
  color: #4d4d4d;
}

.st-ti-left {
  flex: 10;
}

.st-ti-btn {
  display: block;
  padding: 0 20px;
  border: 1px solid #ff5162;
  border-radius: 6px;
  color: #ff5162;
}

.st-id {
  font-size: 0;
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.st-id-in {
  margin: 0 auto;
  display: flex;
}

.ignore-seat {
  position: absolute;
  display: inline-block;
  height: 20px;
  width: 30px;
  line-height: 20px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  background-position: 0px 0px;
}

.st-id-lable {
  display: inline-block;
  border: 1px solid transparent;
  display: flex;
  position: relative;
  margin-right: 40px;
  margin-left: 40px;
}

.st-id-lable .ignore-seat {
  width: 20px;
  height: 13px;
  position: absolute;
  top: 3px;
  left: -20px;
}

.ignore-label {
  font-size: 12px;
  line-height: 20px;
  display: inline-block;
  height: 20px;
  color: #c2c2c2;
}

.seat-0 {
  background: url(../../assets/movie/setas-o.png);
  background-color: #ffffff;
  background-size: 100% 100%;
}

.seat-1 {
  background: url(../../assets/movie/setas-o.png);
  background-color: #ffffff;
  background-size: 100% 100%;
}

.seat-2 {
  background: url(../../assets/movie/setas-on.png);
  background-color: #ffffff;
  background-size: 100% 100%;
}

.seat-3 {
  background: url(../../assets/movie/setas-un.png);
  background-color: #ffffff;
  background-size: 100% 100%;
}

.seat-4 {
  background: url(../../assets/movie/seats-love.png);
  background-color: #ffffff;
  background-size: 100% 100%;
}

.row {
  position: relative;
}

.row a {
  font-size: 0;
  line-height: 0;
}

.seats-wrapper-out {
  overflow: auto;
  box-sizing: border-box;
  padding: 20px 20px 20px 60px;
  width: 100%;
  background-color: #f8f8f8;
  z-index: 1;
  /* -webkit-overflow-scrolling: touch; */
}

.seats-wrapper {
  white-space: nowrap;
  text-align: center;
}

.seats-wrapper .row {
  white-space: nowrap;
  text-align: center;
  margin-bottom: 40px;
  font-size: 0;
}

.updata-cont {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 10;
  background-color: #dddddd;
}

.updata-left {
  flex: 10;
  background-color: #f8f8f8;
  padding: 16px;
}

.updata-right {
  width: 100%;
  text-align: center;
  line-height: 100px;
  color: #fff;
  background: -webkit-gradient(linear, 0 0, 100% 0, from(#ff8e62), to(#fd4471));
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  background: -moz-linear-gradient(left, #ff8e62, #fd4471);
  background: -o-linear-gradient(left, #ff8e62, #fd4471);
  background: linear-gradient(to right, #ff8e62, #fd4471);
  font-size: 28px;
}

.updata-right.no-select {
  opacity: 0.5;
}

.updata-left input {
  box-sizing: border-box;
  background-color: #fff;
  line-height: 48px;
  display: block;
  padding: 10px;
  width: 100%;
  background-color: #fff;
  border: none;
  outline: none;
  border-radius: 4px;
}
/* 荧幕 */

.seats-screen {
  text-align: center;
  padding-bottom: 40px;
}

.seats-screen-in {
  display: inline-block;
  width: 60%;
  height: 60px;
  line-height: 60px;
  background-color: #e9e9e9;
  border-radius: 0 0 50px 50px;
  color: #d0d0d0;
}
/* 中心线 */

.seats-wrapper-center-line {
  position: absolute;
  z-index: -1;
  width: 0;
  height: 85%;
  top: 100px;
  left: 50%;
  margin-left: 20px;
  border-left: 1px dashed #999;
  box-sizing: border-box;
  border-top: 40px solid transparent;
}

.seats-wrapper-out {
  position: relative;
  width: 100%;
  overflow: auto;
}

.seats-wrapper-out-cont {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.seats-wrapper {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  min-width: 100%;
  box-sizing: border-box;
  padding: 0 20px 0 40px;
}
/* 选中的票 */

.check-list {
  padding: 20px 0 0 20px;
}

.check-item {
  display: inline-block;
  line-height: 50px;
  font-size: 24px;
  border: 1px solid #ff5162;
  padding: 0 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #ff5162;
}
/* 绑定手机号 */

.bind-phone-out {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
}

.bind-phone-in {
  width: 80%;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
}

.bind-phone-input {
  display: block;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ff5162;
  padding: 12px 0px;
  line-height: 40px;
  width: 100%;
  font-size: 28px;
}

.bind-phone-btn {
  display: block;
  line-height: 66px;
  font-size: 28px;
  text-align: center;
  color: #fff;
  background-color: #ff5162;
  margin-top: 20px;
}
/* 排号开始 */

.seats-bor {
  position: absolute;
  z-index: 10;
  width: 4.6%;
  top: 140px;
  left: 10px;
  background-color: #cacaca;
  border-radius: 20px;
  overflow: hidden;
  color: #fff;
  text-align: center;
  padding-top: 10px;
}

.seats-bor-item {
  margin-bottom: 20px;
  width: 100%;
}

.ignore-bor-item {
  display: block;
  height: 20px;
  width: 100%;
  line-height: 20px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
}

.noseats {
  position: absolute;
  left: 0;
  top: 40%;
  z-index: 200;
  width: 100%;
}

.seats-center {
  display: inline-block;
  background-color: #ffffff;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 80px;
  color: #c5c5c5;
  font-size: 16px;
}

.tuijian,
.yixuan {
  position: fixed;
  bottom: 100px;
  width: 100%;
  text-align: center;
  line-height: 100px;
  color: #a1a1a1;
  background-color: #ffffff;
  font-size: 28px;
  padding: 0px 10px;
  z-index: 10;
}

.yixuan {
  text-align: left;
  padding-bottom: 20px;
}

.tuijian span {
  margin-right: 30px;
}

.tuijian .tuijian-type {
  color: #595959;
  padding: 10px 35px;
  border: 1px solid #f1f1f1;
  border-radius: 30px;
}

.yixuan > div {
  line-height: 80px;
}

.yixuan .yiyuan-zhuyi {
  float: right;
  margin-right: 40px;
}

.yiyuan-zhuyi-content {
  color: #bfbfbf;
  padding: 20px;
  font-size: 28px;
}

.yixuan .yiyuan-zhuyi .yiyuan-zhuyi-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(../../assets/movie/zhuyi.png);
  background-size: 100% 100%;
  margin-right: 10px;
}

.yixuan .yixuan-item {
  color: #595959;
  padding: 0px 45px 0 20px;
  color: #b2b2b2;
  border: 1px solid #f1f1f1;
  position: relative;
  display: inline-block;
}

.yixuan .yixuan-item .yixuan-cha {
  display: inline-block;
  padding: 5px;
  width: 18px;
  height: 18px;
  border-radius: 20px;
  background-color: #f5f5f5;
  position: absolute;
  top: 27px;
  right: 8px;
}

.yixuan .yixuan-item .yixuan-cha i {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(../../assets/movie/cha.png);
  background-size: 100% 100%;
  position: absolute;
  top: 7px;
  left: 7px;
}

.yixuan .yixuan-con {
  margin-right: 15px;
}

.yixuan .yixuan-con b {
  position: absolute;
  top: 32px;
  left: 0px;
  display: inline-block;
  width: 20px;
  height: 12px;
  border-radius: 50% / 100% 100% 0 0;
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-bottom: none;
  z-index: 1;
  left: -6px;
}

.phone-popup > div {
  padding: 20px;
  font-size: 28px;
}

.phone-popup > div .title {
  line-height: 60px;
  position: relative;
  margin-left: 20px;
}

.phone-popup > div .title:before {
  content: " ";
  display: inline-block;
  position: absolute;
  top: 15%;
  height: 65%;
  width: 6px;
  left: -18px;
  background-color: #ff5162;
}

.phone-popup > div .title i {
  position: absolute;
  right: 10px;
  top: 5px;
}

.phone-popup > div p:nth-child(2) {
  color: 14px;
  color: #c7c7c7;
  margin-bottom: 40px;
}

.phone-popup > div p:nth-child(3) {
  padding-bottom: 10px;
  margin-bottom: 50px;
  border-bottom: 1px solid #c7c7c7;
}

.phone-popup .botton {
  text-align: center;
  height: 60px;
  line-height: 60px;
  color: #ffffff;
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #fd4471);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #fd4471);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #fd4471);
}
.ymzy {
  display: inline-block;
  background-color: #ffffff;
  color: #c6c6c6;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
<style>
.el-popper[x-placement^="top"] .popper__arrow:after {
  content: "";
}

.el-popper[x-placement^="top"] .popper__arrow {
  border-width: 20px;
  bottom: -39px !important;
  border-top-color: #ffffff;
}
</style>