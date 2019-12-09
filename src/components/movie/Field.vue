<template>
  <div class="container fieldContainer">
    <Vheader :name="cinema.cinemaName"></Vheader>

    <!-- 影院列表开始 -->
    <div class="ca-list">
      <div class="cs-item">
        <div class="addressName" @click="clickCinemaDetails">
          <h4>
            <div class="cs-item-name-right">{{cinema.cinemaName}}</div>
          </h4>
          <p>{{cinema.areaName}}{{cinema.cinemaAddress}}</p>
          <i class="iconfont">
            <img src="../../assets/down.png" width="100%" />
          </i>
        </div>
        <div class="addressIcon">
          <i class="iconfont">
            <img src="../../assets/movie/zuobiao.png" width="100%" />
          </i>
        </div>
      </div>
    </div>
    <!-- 影院列表结束 -->

    <!-- 电影简介图开始 -->
    <div class="fd-banner" style="z-index: 1;padding-left: 30px;padding-right: 30px;">
      <i class="iconfont" v-if="filmDisplayMode == 'img'" @click="filmDisplayMode = 'text'">
        <img src="../../assets/movie/imgliebiao.png" width="100%" />
      </i>
      <i class="iconfont" v-if="filmDisplayMode == 'text'" @click="filmDisplayMode = 'img'">
        <img src="../../assets/movie/liebiao.png" width="100%" />
      </i>
      <div class="fd-banner-item-list" v-if="filmDisplayMode == 'text'">
        <van-row>
          <template v-for="val in cinemaShowList">
            <van-col
              class="movie-list"
              :class="{'list-active': film.id == val.id}"
              :key="val.id"
              @click.native="clickFilm(val)"
              span="8"
            >
              <span>{{val.filmName}}</span>
            </van-col>
          </template>
        </van-row>
        <em class="arrow-top"></em>
      </div>
      <div style="z-index: 2;" v-if="filmDisplayMode == 'img'">
        <span
          class="fd-banner-item"
          :class="{'fd-banner-h': film.id == val.id}"
          v-for="val in cinemaShowList"
          :key="val.id"
          @click="clickFilm(val)"
        >
          <i class="img">
            <img :src="val.poster" style="width: 100%;height: 100%;" />
          </i>
          <em class="arrow-top"></em>
        </span>
      </div>
    </div>
    <!-- 电影简介图结束 -->

    <div class="fd-name">
      <div class="fd-name-title">
        {{film.filmName}}
        <span>{{film.score}}分</span>
      </div>
      <p class="fd-name-info">{{film.duration/60}}分钟丨{{film.filmCategory}}丨{{film.actor}}</p>
    </div>

    <!-- 日期导航开始 -->
    <div v-if="film.showMap">
      <van-tabs>
        <van-tab v-for="(value, key) in film.showMap" :title="key" :key="key">
          <div class="fd-item" v-for="val in value" :key="val.id">
            <div class="fd-item-left">
              <div class="fd-item-left-cont fd-item-left-cont-top">
                <div class="fd-item-left-cont-l">{{val.showStartTime | timeFormat}}</div>
                <div
                  class="fd-item-left-cont-r"
                >{{val.language}} {{val.showVersion | showVersionFormat}}</div>
              </div>
              <div class="fd-item-left-cont">
                <div class="fd-item-left-cont-l">{{val.showStartTime + val.duration | timeFormat}}散场</div>
                <div class="fd-item-left-cont-r">{{val.hallName}}</div>
              </div>
            </div>
            <div class="fd-item-right on">
              <span v-html="'<price>¥</price>' + priceFormat(val.salesPrice)"></span>
              <span class="move-item-btn" @click.stop="clickSeat(val)">购票</span>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 日期导航结束 -->
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "MovieField",
  components: {
    Vheader
  },
  data() {
    return {
      // 影片展示方式（img，text）
      filmDisplayMode: "img",

      // 影院
      cinema: {},

      // 城市
      city: {},

      // 场次
      cinemaShowList: [],

      // 影片
      film: {}
    };
  },
  created() {
    // 影院
    let localCinema = JSON.parse(window.localStorage.getItem("clickCinema"));
    let cinema = this.$route.query.cinema;
    if (localCinema) {
      this.cinema = localCinema;
    } else if (cinema) {
      this.cinema = cinema;
    } else {
      this.$router.back(-1);
    }

    // 影片
    let localFilm = JSON.parse(window.localStorage.getItem("clickFilm"));
    if (localFilm) {
      this.film = localFilm;
    }

    this.getCity();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 获取城市
    getCity() {
      if (window.localStorage.getItem("clickCity")) {
        this.city = JSON.parse(window.localStorage.getItem("clickCity"));
      } else {
        this.city = this.$init.channel.defaultCity;
      }
      this.listCinemaShow();
    },

    // 获取影院场次
    listCinemaShow() {
      let vm = this;
      vm.$http
        .get(
          "/panda-cinema-api/v2/listCinemaShow/" +
            vm.city.id +
            "/" +
            vm.cinema.id
        )
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              vm.cinemaShowList = response.data.result;
              if (vm.cinemaShowList.length > 0) {
                if (vm.film) {
                  vm.cinemaShowList.find(function(e) {
                    if (vm.film.id == e.id) {
                      vm.clickFilm(e);
                    }
                  });
                } else {
                  vm.clickFilm(vm.cinemaShowList[0]);
                }
              }
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 点击影院详情
    clickCinemaDetails() {
      this.$router.push({
        path: "/movie/cinemaDetails",
        query: {
          cinema: this.cinema
        }
      });
    },

    // 点击影片
    clickFilm(val) {
      this.film = val;
      window.localStorage.setItem("clickFilm", JSON.stringify(val));
    },

    // 选座
    clickSeat(val) {
      this.$router.push("/movie/seat/" + val.id);
      window.localStorage.setItem("clickShow", JSON.stringify(val));
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
    }
  },
  filters: {
    // 时间戳格式化（格式：时:分）
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
      return add0(h) + ":" + add0(mm);
    },

    // 场次类型
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
  padding-top: 84px;
  background-color: #fff;
  /* padding-top: 85px; */
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

.iconfont {
  width: 30px;
  height: 20px;
  display: inline-block;
}

.cs-item {
  padding: 15px 24px;
  border-bottom: 1px thin #eee;
}

.cs-item h4 {
  font-size: 28px;
  color: #4d4d4d;
  /* padding-left: 40px; */
  position: relative;
  display: flex;
  font-weight: 500;
}

.cs-item-name-left {
  line-height: 30px;
  padding-top: 6px;
}

.cs-item-name-right {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-item p {
  margin-top: 5px;
  font-size: 22px;
  color: #c1c1c1;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-item .addressName,
.cs-item .addressIcon {
  display: inline-block;
  position: relative;
  height: 72px;
}

.cs-item .addressName {
  width: 88%;
  border-right: 1px solid #dddddd;
}

.addressName .iconfont {
  position: absolute;
  right: 40px;
  top: 25px;
  height: 25px;
  transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  /* Internet Explorer */
  -moz-transform: rotate(270deg);
  /* Firefox */
  -webkit-transform: rotate(270deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(270deg);
  /* Opera */
}

.addressIcon .iconfont {
  position: absolute;
  left: 50%;
  top: 25px;
}

.cs-item .addressIcon {
  width: 8%;
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
  /* position: absolute; */
  top: 9px;
  left: 0;
  margin-right: 10px;
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
  /* position: absolute; */
  top: 9px;
  left: 0;
  margin-right: 10px;
}

.fd-banner {
  width: 100%;
  padding: 20px 0 0px 20px;
  box-sizing: border-box;
  font-size: 0;
  white-space: nowrap;
  background-color: #f5f5f5;
  position: relative;
  /* -webkit-overflow-scrolling: touch;
  z-index:1;
  overflow: auto;
  overflow-x: scroll; */
}

.fd-banner .iconfont {
  position: absolute;
  top: 15px;
  left: 25px;
  height: 20px;
}

.fd-banner > div {
  display: -webkit-box;
  /* overflow-x: scroll;
  -webkit-overflow-scrolling:touch; */
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
}

.fd-banner .fd-banner-item-list {
  overflow: hidden;
  margin-top: 20px;
  padding: 0px 10px 20px 10px;
}

.fd-banner .fd-banner-item-list .van-row {
  width: 100%;
  font-size: 14px;
}

.fd-banner .fd-banner-item-list .van-row .van-col--7 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px 10px;
  background-color: #e8e8e8;
  border-radius: 15px;
  margin-bottom: 15px;
}

.fd-banner .fd-banner-item-list .van-row .van-col--7.list-active {
  background-color: #ff8000;
  color: #ffffff;
}

.fd-banner .img {
  display: inline-block;
  width: 140px;
  height: 200px;
}

.fd-banner .img img {
  border-radius: 5%;
}

.fd-name {
  padding: 20px 20px;
  text-align: center;
  position: relative;
}

.fd-name-title {
  font-size: 28px;
  margin-bottom: 5px;
}

.fd-name-title span {
  font-size: 24px;
  color: #ff8000;
  margin-left: 5px;
}

.fd-name-info {
  color: #b2b2b2;
}

.fd-item {
  border-bottom: 1px solid #eee;
  padding: 20px 20px;
  display: flex;
}

.fd-item-left {
  width: 50%;
  max-width: 50%;
}

.fd-item-left .fd-item-left-cont:last-child {
  color: #b9b9b9;
}

.fd-item-left-cont {
  display: flex;
  font-size: 24px;
  color: #4d4d4d;
  line-height: 44px;
}

.fd-item-left-cont > div:nth-child(1) {
  width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fd-item-left-cont > div:nth-child(2) {
  width: 55%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fd-item-left-cont-top .fd-item-left-cont-l {
  font-size: 40px;
}

.fd-item-left-cont-top .fd-item-left-cont-r {
  font-size: 30px;
}

.fd-item-right {
  font-size: 28px;
  line-height: 88px;
  width: 50%;
  position: relative;
}

.fd-item-right price {
  font-size: 10px !important;
}

.fd-item-right del {
  color: #b9b9b9;
  font-size: 20px;
  margin-right: 10px;
}
.fd-item-right span:first-child {
  margin-left: 50px;
}
.fd-item-right .move-item-btn {
  position: absolute;
  display: block;
  line-height: 60px;
  padding: 0 30px;
  border-radius: 40px;
  color: #ff5364;
  border: 1px solid #ffaec1;
  right: 10px;
  top: 10px;
  font-size: 24px;
}

.fd-banner-item {
  display: inline-block;
  position: relative;
  border: 6px solid transparent;
  border-bottom: none;
  margin-right: 8px;
  padding-bottom: 35px;
}

.fd-banner-item.fd-banner-h .img {
  height: 240px;
  width: 168px;
  position: relative;
}

.fd-banner-h .arrow-top {
  position: absolute;
  bottom: 0px;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid #ffffff;
  font-size: 0;
  line-height: 0;
  left: calc(49% - 15px);
  z-index: 1;
}

.fd-banner-item-list .arrow-top {
  position: absolute;
  bottom: 0px;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid #ffffff;
  font-size: 0;
  line-height: 0;
  left: 47%;
  z-index: 1;
}

.movie-list {
  padding: 0px 5px;
  margin-bottom: 30px;
}

.movie-list span {
  display: inline-block;
  max-width: calc(100% - 40px);
  color: #9a9a9a;
  padding: 6px 20px;
  border-radius: 30px;
  background-color: #e8e8e8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-active span {
  background-color: #ff8000;
  color: #ffffff;
}
</style>

<style>
.van-tabs__line {
  background-color: #c06;
}

.fieldContainer .van-tabs--line .van-tabs__wrap {
  border-bottom: 1px solid;
  border-top: 1px solid;
  color: #f1f1f1;
}
.fieldContainer .van-tabs__line:after,
.fieldContainer .van-tabs__line:before {
  content: " ";
  width: calc(50% - 10px);
  height: 150%;
  display: inline-block;
  position: absolute;
  background-color: #fff;
  top: -1px;
}
</style>
