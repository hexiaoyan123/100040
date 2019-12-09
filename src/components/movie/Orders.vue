<template>
  <div class="goods-list-out-cont produce-cont order-movie-list">
    <Vheader name="我的订单"></Vheader>
    <van-tabs v-model="dataStatu">
      <van-tab v-for="(item, index) in dataStatus" :key="item.id" :title="item.name">
        <order-movie-list v-if="dataStatu == index" :dataStatu="item.id"></order-movie-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
import OrderMovieList from "./OrderList";
export default {
  components: {
    "order-movie-list": OrderMovieList,
    Vheader
  },
  data() {
    return {
      // 状态
      dataStatu: this.$route.query.type,
      // 1：待付款；2：待出票；3：已出票；4：已取消；5：已失败；
      dataStatus: [
        {
          id: "",
          name: "全部"
        },
        {
          id: 1,
          name: "待付款"
        },
        {
          id: 2,
          name: "待出票"
        },
        {
          id: 3,
          name: "已出票"
        },
        {
          id: 4,
          name: "已取消"
        },
        {
          id: 5,
          name: "已失败"
        }
      ]
    };
  },
  created() {
    if (this.$route.query.type) {
      this.dataStatu = this.$route.query.type - 0;
    } else {
      this.dataStatu = "";
    }
  },
  methods: {},
  watch: {
    "$route.query"() {
      if (this.$route.query.type) {
        this.dataStatu = this.$route.query.type - 0;
      } else {
        this.dataStatu = "";
      }
    }
  }
  // beforeRouteLeave (to, from, next) {
  //   if(to.path.indexOf('/movie/orderDetails/') >= 0 || to.path.indexOf('/movie/orderPay/') >= 0){
  //     from.meta.isBack = true;
  //     to.meta.isBack = false;
  //     window.localStorage.setItem('orderBackScroller1', document.querySelectorAll('.van-tabs__content')[0].scrollTop)
  //     window.localStorage.setItem('orderBackScroller2', document.querySelectorAll('.van-tabs__nav')[0].scrollLeft)
  //   }else{
  //     from.meta.isBack = false;
  //   }
  //   next()
  // },
  // beforeRouteEnter (to,from,next) {
  //   let scrollTop = localStorage.getItem('orderBackScroller1');
  //   let scrollLeft = localStorage.getItem('orderBackScroller2');
  //   next(vm => {
  //     if(vm && scrollTop && to.meta.isBack){
  //       document.querySelectorAll('.van-tabs__content')[0].scrollTo(0, scrollTop)
  //       document.querySelectorAll('.van-tabs__nav')[0].scrollTo(scrollLeft, 0)
  //     }else{
  //       // 刷新数据
  //       vm.dataStatu = 1
  //       vm.$nextTick(() => {
  //         vm.dataStatu = 0
  //       })
  //     }
  //   })
  // }
};
</script>

<style scoped>
.produce-cont {
  padding-top: 84px;
}
/* 商品列表 */
.goods-list-out-cont {
  /* margin-top: 20px; */
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  background-color: #f8f8f8;
}
</style>
<style>
.order-movie-list .van-tabs {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.order-movie-list .van-tabs__content {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f8f8f8;
}
.order-movie-list .van-tab__pane {
  height: auto;
  background-color: #f8f8f8;
}
</style>
