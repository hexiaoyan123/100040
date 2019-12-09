<template>
  <div class="container">
    <Vheader name="影院详情"></Vheader>
    <div class="move-item">
      <div class="move-item-in clearfix">
        <p class="title">{{cinema.cinemaName}}</p>
        <p class="nomorl">
          <span class="juli">
            <i></i>
          </span>
          <span>{{cinema.areaName}}{{cinema.cinemaAddress}}</span>
        </p>
        <p class="nomorl">
          <span class="phone">
            <i></i>
          </span>
          <span>{{cinema.cinemaPhone}}</span>
        </p>
      </div>
    </div>
    <div class="move-item">
      <div class="move-item-in clearfix item-info">
        <p class="title">特色服务</p>
        <p class="nomorl" v-for="val in toJson(cinema.cinemaFeature)" :key="val.featureName">
          <span><span class="border-span yellow">
              {{val.featureName}}
            </span>{{val.featureDesc}}</span>
        </p>
      </div>
    </div>
    <div class="move-item">
      <div class="move-item-in clearfix item-info">
        <p class="title">影院公告</p>
        <p class="nomorl">
          <span v-html="cinema.cinemaNotice"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import Vheader from "../HeaderV";
  export default {
    components: {
      Vheader
    },
    name: "CinemaDetails",
    data() {
      return {
        // 影院
        cinema: {}
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
    },
    methods: {
      // 返回上一页
      goBack() {
        this.$router.back(-1);
      },

      // 转换JSON对象
      toJson(str) {
        return JSON.parse(str);
      }
    }
  };
</script>

<style scoped>
  .container {
    background-color: #f8f8f8;
    padding-top: 85px;
  }

  .move-list {
    background-color: #ffffff;
  }

  .move-item {
    padding: 6px 26px 20px 26px;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .move-item-in {
    padding: 10px 20px;
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

  .red {
    color: #ff5162 !important;
  }

  .move-item .title {
    font-size: 26px;
    border-bottom: 1px solid #dddddd;
    line-height: 60px;
    margin-bottom: 10px;
    color: #545454;
  }

  .move-item .nomorl {
    line-height: 50px;
    color: #808080;
    position: relative;
  }

  .to {
    float: right;
    position: relative;
  }

  .to .move-icon {
    display: inline-block;
    width: 18px;
    height: 20px;
    background-image: url(../../assets/movie/to.png);
    background-size: 100% 100%;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .juli,
  .phone {
    position: relative;
    margin-right: 30px;
  }

  .juli i {
    display: inline-block;
    width: 22px;
    height: 25px;
    background-image: url(../../assets/movie/zuobiao.png);
    background-size: 100% 100%;
    position: absolute;
    top: 2px;
  }

  .phone i {
    display: inline-block;
    width: 22px;
    height: 25px;
    background-image: url(../../assets/movie/phone.png);
    background-size: 100% 100%;
    position: absolute;
    top: 2px;
  }

  .item-info p {
    line-height: 60px !important;
    word-break:break-all;
  }

  .border-span {
    position: relative;
    border-radius: 10px;
    margin-right: 10px;
    font-size: 18px;
    height: 26px;
    vertical-align: middle;
    padding: 5px 10px 0px;
  }

  .border-span.red {
    border: 1px solid #ff5c6b;
    color: #ff5c6b;
  }

  .border-span.yellow {
    border: 1px solid #ff9439;
    color: #ff9439;
  }
</style>
