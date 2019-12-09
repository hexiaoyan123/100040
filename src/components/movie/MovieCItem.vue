<template>
  <div class="container">
    <!-- 筛选开始 -->
    <div class="nca-select">
      <div class="nca-select-item" @click="city.show = true">
        <van-icon name="location" />
        <em>{{city.city.name}}</em>
      </div>
      <div class="nca-select-item" @click="city.show = true">
        <van-icon name="search" />
        <em>找影院</em>
      </div>
    </div>
    <!-- 筛选结束 -->

    <!-- 筛选开始 -->
    <div class="ca-select">
      <div class="ca-select-left" @click="city.show = true">
        {{city.city.name}}
        <i class="iconfont">&#xe608;</i>
      </div>
      <div class="ca-select-center" @click="switchCounty">
        {{county.val.name}}
        <i class="iconfont">&#xe608;</i>
      </div>
      <div class="ca-select-right" @click="search.show = true" v-if="! $route.params.id">
        <div class="ca-select-right-1">
          <span class="ca-select-right-lable">{{cinema.name}}</span>
        </div>
        <div class="ca-select-right-2">
          <van-icon name="search" />
        </div>
      </div>
      <div class="ca-select-right" v-if="$route.params.id"></div>
    </div>
    <!-- 筛选结束 -->

    <!-- 瀑布流滚动加载开始 -->
    <van-list v-model="falls.loading" :finished="falls.finished" @load="fallsOnLoad">
      <!-- 影院列表开始 -->
      <div class="ca-list">
        <div
          class="cs-item"
          v-for="(item, index) in cinema.list"
          :key="index"
          @click="goMovieField(item.id)"
        >
          <h4>
            <div class="cs-item-name-left">
              <!-- <span class="cs-item-dui" v-if="item.goodsType == 2 || item.goodsType == 0">兑</span> -->
              <span class="cs-item-zuo" v-if="item.goodsType == 1 || item.goodsType == 0">座</span>
            </div>
            <div class="cs-item-name-right">{{item.name}}</div>
          </h4>
          <p>{{item.address}}</p>
        </div>

        <h3 v-show="cinema.list.length == 0" class="noData">无影院信息</h3>
        <h3 v-show="falls.finished && cinema.list.length > 0" class="noData">到底了！</h3>
      </div>
      <!-- 影院列表结束 -->
    </van-list>
    <!-- 瀑布流滚动加载结束 -->

    <!-- 城市选择开始 -->
    <van-popup v-model="city.show" position="right" :overlay="false">
      <movie-city :v-city="city.city" @closeCity="closeCityModo" @clickCity="getCity"></movie-city>
    </van-popup>
    <!-- 城市选择结束 -->

    <!-- 地区筛选窗口开始 -->
    <div class="class-window" v-show="county.show" @click="switchCounty">
      <div class="class-window-list" @click.stop="1">
        <van-row>
          <van-col span="24" v-for="(item, index) in county.list" :key="index">
            <div
              class="class-window-list-item"
              :class="{'on': item.id == county.val.id}"
              @click="checkCounty(item)"
            >{{item.name}}</div>
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 地区筛选窗口结束 -->

    <!-- 搜索筛选框开始 -->
    <div class="search-modo" v-show="search.show">
      <div class="search-modo-left">
        <input type="text" maxlength="10" v-model="search.val" placeholder="影院名称" />
      </div>
      <div class="search-modo-right">
        <span class="search-modo-btn" @click="searchClear">清除</span>
        <span class="search-modo-btn" @click="searchOk">确认</span>
      </div>
    </div>
    <!-- 收缩筛选框结束 -->
  </div>
</template>

<script>
import MovieCity from "./MovieCity";
export default {
  name: "MovieC",
  components: {
    "movie-city": MovieCity
  },
  data() {
    return {
      // 城市
      city: {
        show: false, //城市弹窗
        city: {} // 选中的地址
      },
      // 地区
      county: {
        list: [],
        show: false,
        val: {
          name: "全部地区",
          id: ""
        }
      },
      // 影院
      cinema: {
        list: [], // 影院列表
        pageNum: 1, // 页码
        name: "" // 模糊搜索
      },
      // 搜索
      search: {
        show: false,
        val: ""
      },

      // 瀑布流
      falls: {
        loading: false, // 加载中
        finished: false // 结束调用
      }
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
  },
  methods: {
    // 瀑布流加载数据
    fallsOnLoad() {
      this.getCinema();
    },
    // 搜索框确认
    searchOk() {
      this.search.show = false;
      this.cinema.name = this.search.val;
      this.getCinema(true);
    },
    // 收缩框清除
    searchClear() {
      this.search.show = false;
      this.search.val = "";
      this.cinema.name = "";
      this.getCinema(true);
    },
    // 打开关闭选择地区
    switchCounty() {
      this.county.show ? (this.county.show = false) : (this.county.show = true);
    },
    // 选择地区
    checkCounty(obj) {
      this.county.val = obj;
      this.county.show = false;
      this.getCinema(true);
    },
    // 前往影院
    goMovieField(id) {
      let filmId = "";
      if (this.$route.params.id) {
        filmId = "?filmId=" + this.$route.params.id;
      }
      this.$router.push("/movie/field/" + id + filmId);
    },
    // 关闭城市选择
    closeCityModo(data) {
      this.city.show = false;
    },
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },
    // 获取选中的地址
    getCity(data) {
      this.city.city = data;
      this.$init.channel.defaultCity = data;
      this.$cookies.set("clickCity", JSON.stringify(data));
      this.city.show = false;
      this.getCounty();
      this.county.val = {
        name: "全部地区",
        id: ""
      };
      this.getCinema(true);
    },
    // 获取城市下地区
    getCounty() {
      let vm = this;
      this.$http
        .get("/panda-cinema-api/v1/listCounty/" + this.city.city.id)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              vm.county.list = response.data.result;
            } else {
              vm.county.list = [];
            }
            // 添加全部地区
            vm.county.list.unshift({
              name: "全部地区",
              id: ""
            });
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 获取地区影院
    getCinema(clear) {
      if (clear) {
        this.cinema.list = [];
        this.cinema.pageNum = 1;
        this.falls.finished = false;
      } else {
        this.cinema.pageNum += 1;
      }
      let vm = this;
      let postData; // 请求参数
      let url; // 请求链接
      if (this.$route.params.id) {
        url = "/panda-cinema-api/v1/pageFilmCinema/";
        postData = {
          filmId: this.$route.params.id,
          cityCode: this.city.city.id,
          countyCode: this.county.val.id ? this.county.val.id : ""
        };
      } else {
        url = "/panda-cinema-api/v1/pageCinema/";
        postData = {
          name: this.cinema.name,
          cityCode: this.city.city.id,
          countyCode: this.county.val.id ? this.county.val.id : ""
        };
      }
      this.$http
        .post(url + this.cinema.pageNum + "/20", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              if (response.data.result.list.length > 0) {
                vm.cinema.list = vm.cinema.list.concat(
                  response.data.result.list
                );
                vm.$nextTick(() => {
                  vm.falls.loading = false;
                });
              } else {
                vm.falls.loading = false;
                vm.falls.finished = true;
              }
            } else {
              vm.county.list = [];
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  /* padding-top: 155px; */
  padding-bottom: 88px;
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

.ca-select {
  position: fixed;
  top: 85px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 24px;
  color: #808080;
  display: flex;
  line-height: 70px;
  border-bottom: 1px solid #e6e6e6;
  z-index: 101;
}
.ca-select .iconfont {
  font-size: 24px;
  color: #808080;
}
.ca-select-left {
  flex: 2;
}
.ca-select-center {
  text-align: center;
  flex: 4;
  font-size: 28px;
  color: #4d4d4d;
}
.ca-select-right {
  text-align: right;
  flex: 2;
  display: flex;
  height: 68px;
}

.cs-item {
  padding: 10px 24px;
  border-bottom: 1px solid #e6e6e6;
}
.cs-item h4 {
  font-size: 28px;
  color: #4d4d4d;
  line-height: 50px;
  /* padding-left: 40px; */
  position: relative;
  display: flex;
}
.cs-item-name-left {
  line-height: 30px;
  padding-top: 7px;
}
.cs-item-name-right {
  flex: 10;
}
.cs-item p {
  font-size: 22px;
  color: #bababa;
  line-height: 44px;
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
.city-popup {
  height: 100%;
  width: 100%;
  background-color: #fff;
}

/* 地区筛选 */
.class-window {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98px;
  line-height: 76px;
  padding-top: 156px;
}
.class-window-btn {
  width: 100%;
  box-sizing: border-box;
  line-height: 80px;
  border-top: 1px solid #d9d9d9;
  font-size: 28px;
  text-align: center;
  background-color: #ffffff;
  display: flex;
}
.class-window-btn-left {
  flex: 5;
}
.class-window-btn-right {
  flex: 5;
  color: #ffffff;
  background-color: #ff5162;
}
.class-window-list {
  padding: 20px;
  background-color: #ffffff;
  font-size: 24px;
  line-height: 80px;
  max-height: 530px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.class-window-list-item {
  border-bottom: 1px solid #eeeeee;
  text-align: center;
}
.class-window-list-item:last {
  border: none;
}
/* 搜索框 */
.search-modo {
  display: flex;
  position: absolute;
  height: 70px;
  width: 100%;
  padding: 10px 20px;
  z-index: 102;
  background-color: #fff;
  top: 85px;
  left: 0;
  box-sizing: border-box;
  line-height: 50px;
}
.search-modo-left {
  flex: 10;
}
.search-modo-left input {
  display: block;
  width: 100%;
  border: 1px solid #e6e6e6;
  line-height: 47px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 6px;
}
.search-modo-right {
}
.search-modo-btn {
  display: inline-block;
  line-height: 50px;
  background-color: #ff5162;
  color: #fff;
  padding: 0 30px;
  border-radius: 4px;
  margin-left: 20px;
}
.ca-select-right-lable {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ca-select-right-1 {
  flex: 9;
}
.ca-select-right-2 {
  width: 50px;
  height: 60px;
  overflow: hidden;
  text-align: right;
}

/* 新搜索 */
.nca-select {
  display: flex;
  padding: 0 20px;
  background-color: #ff5162;
  color: #fff;
}
.nca-select-item {
  margin-right: 40px;
  padding-right: 10px;
}
.nca-select-item em {
  font-size: 24px;
  line-height: 66px;
}
.nca-select .van-icon {
  margin-right: 5px;
}
</style>

<style>
.van-popup--right {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>
