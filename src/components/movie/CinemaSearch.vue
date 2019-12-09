<template>
  <div class="city-cont">
    <div class="city-list">
      <!-- 搜索开始 -->
      <div class="city-header">
        <div class="city-header-form">
          <input
            class="city-header-form-input"
            type="text"
            v-model="cinemaName"
            placeholder="请输入影院名称"
            @keyup="searchCinema"
          />
          <i class="iconfont city-header-form-icon">&#xe62c;</i>
          <van-icon
            class="city-header-form-clear"
            name="clear"
            v-show="cinemaName"
            @click="cleanSearch"
          />
        </div>
        <div class="city-header-close" @click="closeSearch">取消</div>
      </div>
      <!-- 搜索结束 -->

      <!-- 搜索列表开始 -->
      <div class="s-list" v-show="cinemaName">
        <ul class="s-list-in">
          <li v-for="val in cinemaList" @click="clickCinema(val)" :key="val.id">{{val.cinemaName}}</li>
          <li v-show="cinemaName && cinemaList.length == 0">未搜索到相应结果</li>
        </ul>
      </div>
      <!-- 搜索列表结束 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchCinema",
  props: ["vCity"],
  data() {
    return {
      // 城市
      city: {},

      // 影院名称
      cinemaName: "",

      // 影院
      cinemaList: []
    };
  },
  created() {
    this.city = this.vCity;
  },
  methods: {
    // 搜索
    searchCinema() {
      let vm = this;
      if (vm.cinemaName) {
        vm.cinemaList = [];
        vm.$http
          .get(
            "/panda-cinema-api/v2/listCityCinema/" +
              vm.city.id +
              "?cinemaName=" +
              vm.cinemaName
          )
          .then(function(response) {
            if (response.data.code == "1000") {
              if (response.data.result) {
                vm.cinemaList = response.data.result;
              }
            } else {
              vm.$toast(response.data.msg);
            }
          })
          .catch(function(error) {
            vm.$toast("请求超时，请稍后再试！");
          });
      }
    },

    // 清除
    cleanSearch() {
      this.cinemaName = "";
      this.cinemaList = [];
    },

    // 关闭
    closeSearch() {
      this.$emit("closeSearch", false);
    },

    // 点击影院
    clickCinema(obj) {
      window.localStorage.setItem("clickCinema", JSON.stringify(obj));
      this.$router.push({ path: "/movie/field", query: { cinema: obj } });
    }
  }
};
</script>

<style scoped>
header {
  width: 100%;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
  /* position: absolute; */
  position: fixed;
  top: 0;
  left: 0;
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
}
.header-more {
  position: absolute;
  line-height: 80px;
  top: 0;
  right: 0;
  padding: 0 20px;
  font-size: 32px;
  color: #ff5162;
}
.fix-bar-clear {
  background-color: #fc9800;
}
.city-cont {
  height: 100%;
}
.city-list {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  /* padding-top: 85px; */
  background-color: #f2f2f2;
}
.city-itme h3 {
  background-color: #f2f2f2;
  line-height: 100px;
  font-size: 30px;
  color: #666666;
  padding: 0 20px;
}
.city-lables {
  background-color: #fff;
}
.city-lables li {
  padding: 0 40px;
  line-height: 66px;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
  border-right: 1px solid #ededed;
  box-sizing: border-box;
  overflow: hidden;
}
.city-lables li:nth-child(4n) {
  border-right: none;
}
.city-letter-cont {
  position: absolute;
  right: 0;
  top: 120px;
  z-index: 10;
  font-size: 30px;
  line-height: 42px;
  text-align: center;
  width: 60px;
}

/* 新头部开始 */
.city-header {
  padding: 10px 20px;
  background-color: #ff5162;
  display: flex;
}
.city-header-close {
  color: #fff;
  width: 80px;
  text-align: right;
  line-height: 56px;
}
.city-header-form {
  flex: 10;
  position: relative;
}
.city-header-form-input {
  font-size: 24px;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 50px 10px 46px;
  line-height: 36px;
  border: none;
  outline: none;
  border-radius: 4px;
}
.city-header-form-icon {
  font-size: 24px;
  left: 10px;
  line-height: 60px;
  position: absolute;
  top: 0;
  font-weight: 700;
  color: #999;
}

/* 搜索列表 */
.s-list {
}
.s-list-in {
  background-color: #fff;
  max-height: 70%;
}
.s-list-in li {
  color: #666666;
  line-height: 66px;
  padding: 0 40px;
  font-size: 24px;
  border-top: 1px solid #ededed;
}
.city-header-form-clear {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 56px;
  width: 50px;
  text-align: center;
  color: #999;
}
</style>