<template>
  <div class="container">
    <Vheader name="影片详情"></Vheader>

    <div class="nh-out">
      <div class="nh-bg" :style="{'background-image': 'url('+film.poster+')'}"></div>
      <div class="nh-cont">
        <figure class="fm-header-img">
          <img :src="film.poster" alt />
        </figure>
        <div class="nh-cont-cont">
          <h2>{{film.filmName}} {{film.englishName}}</h2>
          <p>{{film.duration / 60}}分钟 评分{{film.score}}</p>
          <p>{{film.filmCategory}}</p>
          <p>{{film.version}}</p>
          <p>{{film.releaseDate}} {{film.source}} 上映</p>
        </div>
      </div>
    </div>

    <!-- 文字介绍开始 -->
    <div class="fm-text">
      <div class="fm-text-p">
        <em>导演：</em>
        {{film.director}}
      </div>
      <div class="fm-text-p">
        <em>主演：</em>
        {{film.actor}}
      </div>
      <div class="fm-text-p fm-text-more">
        <em>剧情：</em>
        {{film.drama}}
      </div>
    </div>
    <!-- 文字介绍结束 -->

    <!-- 剧照开始 -->
    <h4 class="fm-img-name">
      <span class="fm-img-name-left">剧照：</span>
    </h4>
    <div class="fm-img-out">
      <span class="fm-img-item" v-for="(item, index) in film.stagePhoto.split(',')" :key="index">
        <img :src="item" @click="imageView(index)" />
      </span>
    </div>
    <!-- 剧照结束 -->

    <!-- 提交开始 -->
    <div class="updata-cont">
      <div class="updata-right" @click="clickFilm">选座购票</div>
    </div>
    <!-- 提交结束 -->
  </div>
</template>

<script>
import Vheader from "../HeaderV";
import { ImagePreview } from "vant";
export default {
  name: "MovieFilm",
  components: {
    Vheader
  },
  data() {
    return {
      // 影片
      film: {}
    };
  },
  created() {
    // 影片
    let localFilm = JSON.parse(window.localStorage.getItem("clickFilm"));
    let film = this.$route.query.film;
    if (localFilm) {
      this.film = localFilm;
    } else if (film) {
      this.film = film;
    } else {
      this.$router.back(-1);
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 选座购票
    clickFilm() {
      this.$router.push("/movie/cinemaByFilm/" + this.film.filmId);
    },

    // 预览图片
    imageView(num) {
      ImagePreview(this.film.stagePhoto.split(","), num);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f8f8f8;
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
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  color: #4d4d4d;
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
/* 影片头 */

.fm-header {
  position: relative;
  margin-bottom: 20px;
}

.fm-header-top {
  height: 174px;
  box-sizing: border-box;
  padding-left: 240px;
  padding-right: 20px;
  background: #ff366c;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(#ff7380),
    to(#ff366c)
  );
  background: linear-gradient(to bottom right, #ff7380, #ff366c);
  color: #fff;
  padding-top: 10px;
}

.fm-header-top h2 {
  color: #fff;
  font-size: 28px;
  line-height: 60px;
  display: flex;
}

.fm-header-top h2 span {
  flex: 10;
  overflow: hidden;
}

.fm-header-top p {
  font-size: 24px;
  line-height: 50px;
}

.fm-header-bottom {
  padding-left: 240px;
  font-size: 0;
  background-color: #fff;
  padding-top: 24px;
  height: 150px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}

.fm-header-lable {
  display: inline-block;
  line-height: 46px;
  padding: 0 38px;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #dddddd;
  font-size: 22px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.fm-header-img {
  display: block;
  position: absolute;
  height: 270px;
  width: 190px;
  border: 1px solid #eee;
  border-radius: 8px;
  z-index: 10;
  top: 28px;
  left: 26px;
  overflow: hidden;
}

.fm-header-img img {
  display: block;
  height: 100%;
  width: 100%;
}
/* 文字介绍 */

.fm-text {
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.fm-text-p {
  line-height: 38px;
  color: #c1c1c1;
  font-size: 24px;
}

.fm-text-p em {
  color: #4d4d4d;
}
/* .fm-text-more { */
/* margin-top: 40px; */
/* } */
/* 剧照开始 */

.fm-img-name {
  display: flex;
  line-height: 38px;
  font-size: 24px;
  color: #4d4d4d;
  padding: 0 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
}

.fm-img-name-left {
  flex: 10;
}

.fm-img-name-right {
  height: 60px;
}

.fm-img-out {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  background-color: #fff;
  display: -webkit-box;
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
}

.fm-img-in {
  padding: 0 0 20px 20px;
  font-size: 0;
  white-space: nowrap;
  min-width: 101%;
}

.fm-img-item {
  display: block;
  height: 160px;
  width: 160px;
  overflow: hidden;
  margin-right: 20px;
}

.fm-img-item img {
  display: block;
  height: 100%;
}

.updata-cont {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
}

.updata-right {
  flex: 10;
  text-align: center;
  line-height: 100px;
  color: #fff;
  background: -webkit-gradient(linear, 0 0, 100% 0, from(#ff8e62), to(#fd4471));
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  background: -moz-linear-gradient(left, #ff8e62, #fd4471);
  background: -o-linear-gradient(left, #ff8e62, #fd4471);
  background: linear-gradient(90deg, #ff8e62, #fd4471);
  font-size: 28px;
}
/* 背景 */

.nh-out {
  position: relative;
  border-bottom: 1px solid #ddd;
}

.nh-bg {
  height: 256px;
  background-color: #fff;
  background-size: 100% auto;
  filter: blur(8px) brightness(50%);
}

.nh-cont {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  padding-left: 210px;
}

.nh-cont-cont {
  color: #fff;
  font-size: 24px;
  line-height: 38px;
}

.nh-cont-cont h2 {
  padding-top: 40px;
  color: #fff;
  font-size: 28px;
  line-height: 38px;
  padding-bottom: 10px;
  font-weight: 700;
}

.fm-header-img {
  display: block;
  position: absolute;
  height: 180px;
  width: 135px;
  z-index: 10;
  top: 28px;
  left: 26px;
  overflow: hidden;
}
</style>
<style>
.van-swipe .van-swipe__indicator--active {
  background-color: #ff5162;
}
</style>