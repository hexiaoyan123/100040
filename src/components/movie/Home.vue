<template>
  <div class="container moveHome" ref="backScroller">
    <go-top vlass="container"></go-top>
    <!-- 说明弹窗结束 -->

    <!-- 新头部开始 -->
    <div class="new-header">
      <div class="nh-left" @click="city.show = true">
        <em>{{city.city.name}}</em>
        <i class="iconfont">
          <img src="../../assets/down.png" width="100%" />
        </i>
      </div>
      <div class="nh-center">
        <div class="nh-center-out">
          <van-tabs v-model="showType">
            <van-tab title="正在热映"></van-tab>
            <van-tab title="即将上映"></van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
    <!-- 新头部结束 -->

    <!-- 城市选择开始 -->
    <van-popup v-model="city.show" position="right" :overlay="false">
      <movie-city :v-city="city.city" @closeCity="closeCityModo" @clickCity="getCity"></movie-city>
    </van-popup>
    <!-- 城市选择结束 -->

    <ul class="move-list">
      <li
        class="move-item"
        v-for="(item, index) in (showType == 0 ? hotFilm : comingFilm)"
        :key="index"
        @click="clickFilm(item)"
      >
        <div class="move-item-in clearfix">
          <figure class="move-item-img">
            <img :src="item.poster" />
          </figure>
          <div class="move-item-r">
            <h4 class="unoverflow">{{item.filmName}}</h4>
            <p class="unoverflow">
              评分：
              <span class="score">{{item.score}}</span>
            </p>
            <p class="unoverflow">
              <span class="move-type">{{item.version}}</span>
            </p>
            <p class="unoverflow">导演：{{item.director}}</p>
            <p class="unoverflow">主演：{{item.actor}}</p>
            <span class="move-item-btn" v-if="showType == 0" @click.stop="clickCinema(item)">购票</span>
            <!-- <span
              class="move-item-btn ready"
              v-if="showType == 1"
              @click.stop="clickCinema(item.filmId)"
            >预售</span>-->
          </div>
        </div>
      </li>
    </ul>
    <!-- <h3 v-show="(showType == 0 ? hotFilm : comingFilm).length == 0" class="noData">暂无数据！</h3> -->
    <h3 v-show="(showType == 0 ? hotFilm : comingFilm).length > 0" class="noData">
      <i class="keguan">
        <img src="../../assets/keguan.png" width="100%" />
      </i>
      <span>客官，没有更多了！</span>
    </h3>
    <!-- 定位开始 -->
    <div v-if="! $store.state.position.lng">
      <v-map></v-map>
    </div>
    <!-- 定位结束 -->
  </div>
</template>

<script>
import City from "./City";
import vMap from "../Map";
import GoTop from "../GoTop";
export default {
  name: "MovieCinema",
  components: {
    "movie-city": City,
    "v-map": vMap,
    "go-top": GoTop
  },
  data() {
    return {
      // 城市
      city: {
        show: false, //城市弹窗
        city: {} // 选中的地址
      },
      // 类型切换
      showType: 0,

      // 热映影片
      hotFilm: [],

      // 待映影片
      comingFilm: []
    };
  },
  created() {
    // 城市处理
    if (window.localStorage.getItem("clickCity")) {
      let data = JSON.parse(window.localStorage.getItem("clickCity"));
      this.getCity(data);
    } else {
      this.getCity(this.$init.channel.defaultCity);
    }

    // 获取热映影片
    this.listHotFilm();
    // 获取待映影片
    this.listComingFilm();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 关闭城市选择
    closeCityModo(data) {
      this.city.show = false;
    },

    // 获取选中的地址
    getCity(data) {
      this.city.city = data;
      this.$init.channel.defaultCity = data;
      window.localStorage.setItem("clickCity", JSON.stringify(data));
      this.city.show = false;
    },

    // 获取热映影片
    listHotFilm() {
      let vm = this;
      vm.$http
        .get("/panda-cinema-api/v2/listHotFilm/" + vm.city.city.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              vm.hotFilm = response.data.result;
              vm.$store.commit("ctrlLoader", false);
            } else {
              vm.hotFilm = [];
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 获取待映影片
    listComingFilm() {
      let vm = this;
      vm.$http
        .get("/panda-cinema-api/v2/listComingFilm/" + vm.city.city.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              vm.comingFilm = response.data.result;
              vm.$store.commit("ctrlLoader", false);
            } else {
              vm.comingFilm = [];
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 购票
    clickCinema(val) {
      window.localStorage.setItem("clickFilm", JSON.stringify(val));
      this.$router.push("/movie/CinemaByFilm/" + val.filmId);
    },

    // 电影
    clickFilm(val) {
      window.localStorage.setItem("clickFilm", JSON.stringify(val));
      this.$router.push({
        path: "/movie/film",
        query: {
          film: val
        }
      });
    }
  },

  beforeRouteEnter(to, from, next) {
    let scrollTop = localStorage.getItem("movieBackScroller");
    if (to.meta.isBack && scrollTop) {
      next(vm => {
        if (vm && vm.$refs.backScroller) {
          vm.$refs.backScroller.scrollTo(0, scrollTop);
        }
      });
    } else {
      next();
    }
  },

  beforeRouteLeave(to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    window.localStorage.setItem(
      "movieBackScroller",
      this.$refs.backScroller.scrollTop
    );
    next();
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  padding-bottom: 120px;
}

.iconfont {
  width: 30px;
  height: 20px;
  display: inline-block;
}

.nh-left .iconfont {
  position: absolute;
  top: 10px;
  right: -25px;
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

.move-list {
  background-color: #ffffff;
  padding-top: 6px;
}

.move-item {
  padding: 6px 26px 20px 26px;
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
  background-color: #eee;
}

.move-item-img img {
  width: 100%;
  height: 100%;
}

.move-item-r h4 {
  font-size: 28px;
  line-height: 38px;
  font-weight: 500;
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
  width: 70%;
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
  top: 0px;
  left: 0px;
  border-radius: 5px 0 0 5px;
}
/* 改版头部 */

.new-header {
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 9;
  font-size: 24px;
  line-height: 80px;
  text-align: center;
}

.nh-left {
  position: absolute;
  left: 30px;
  z-index: 100;
}

.nh-left em {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nh-center-out {
  display: inline-block;
  width: 100%;
}

.sb-cont {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.5);
}

.sb-cont .img-cont {
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  margin-top: -400px;
}

.sb-cont .img-cont img {
  display: block;
  width: 100%;
}

.sb-cont-close {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 32px;
  color: #c06;
}

.noData {
  position: relative;
}

.keguan {
  position: absolute;
  top: 15px;
  left: 36%;
  display: inline-block;
  height: 40px;
  width: 40px;
}

.noData span {
  position: absolute;
  top: 5px;
  left: calc(36% + 50px);
}
</style>

<style>
.van-popup--right {
  height: 100%;
  width: 100%;
  background-color: #fff;
}

.moveHome .van-tabs__wrap.van-hairline--top-bottom {
  padding: 0 100px;
}
</style>