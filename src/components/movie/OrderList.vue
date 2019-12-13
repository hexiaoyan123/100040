<template>
  <div class="movie-conter">
    <!-- 瀑布流滚动加载开始 -->
    <van-list v-model="falls.loading" :finished="falls.finished" @load="fallsOnLoad">
      <div class="movie-list">
        <movie-item v-for="(item, index) in list" :key="index" :obj="item" @refreshList="getOrder"></movie-item>
        <div class="noOrderContent" v-if="list.length < 1 && falls.finished">
          <ul>
            <li>
              <i>
                <img src="@/assets/noThing/order.png" width="100%" />
              </i>
            </li>
            <li>
              <span>您还没有相关订单！</span>
            </li>
            <li>
              <i>
                <img
                  src="@/assets/noThing/gwc-button.png"
                  width="100%"
                  @click="goPath('/movie/home')"
                />
              </i>
            </li>
          </ul>
        </div>
      </div>
    </van-list>
    <!-- 瀑布流滚动加载结束 -->
  </div>
</template>

<script>
import OrderMovieListItem from "./OrderListItem";
export default {
  name: "OrderMovieList",
  components: {
    "movie-item": OrderMovieListItem
  },
  props: ["dataStatu"],
  data() {
    return {
      list: [],
      pageNum: 1,
      // 瀑布流
      falls: {
        loading: true, // 加载中
        finished: false // 结束调用
      }
    };
  },

  created() {
    this.getOrder(true);
  },
  methods: {
    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },

    // 瀑布流加载数据
    fallsOnLoad() {},
    // 获取订单列表
    getOrder(clear) {
      // 页码处理
      // if (clear) {
      //   this.list = [];
      //   this.pageNum = 1;
      //   this.falls.finished = false;
      // } else {
      //   this.pageNum += 1;
      // }

      let vm = this;
      vm.$http
        // .get(
        //   "/panda-cinema-api/v2/pageOrder/" +
        //     this.pageNum +
        //     "/20?dataStatus=" +
        //     this.dataStatu
        // )
        .get(
          "/panda-cinema-api/v2/pageOrder/" +
            this.pageNum +
            "/100?dataStatus=" +
            this.dataStatu
        )
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result && response.data.result.length > 0) {
              vm.list = response.data.result;
              vm.falls.loading = false;
            } else {
              vm.falls.loading = false;
              vm.falls.finished = true;
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
.movie-list {
  padding: 20px;
}

.movie-conter {
  height: 100%;
  overflow: auto;
}

.noOrderContent ul {
  margin-top: 80px;
}

.noOrderContent ul li {
  text-align: center;
}

.noOrderContent ul li:nth-child(1) i {
  width: 160px;
  height: 160px;
  display: inline-block;
}

.noOrderContent ul li:nth-child(2) span {
  font-size: 30px;
  color: #969696;
}

.noOrderContent ul li:nth-child(3) {
  margin-top: 30px;
}

.noOrderContent ul li:nth-child(3) i {
  display: inline-block;
  width: 240px;
}

.noData {
  position: relative;
  height: 50px;
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

.van-tabs__content {
  background-color: #f8f8f8;
}
</style>
<style>
.movie-conter .van-tabs {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f8f8f8;
}
</style>