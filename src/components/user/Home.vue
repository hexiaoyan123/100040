<template>
  <div class="container">
    <ul class="list">
      <li class="role">
        <div class="role-img">
          <figure class="img">
            <img :src="$init.login.user.imageUrl" v-if="$init.login.user.imageUrl" />
            <img src="../../assets/user.jpg" v-else />
          </figure>
        </div>
        <div class="role-name">{{$init.login.user.nickname}}</div>
      </li>
    </ul>

    <div class="orders o-cont">
      <div class="orders-in">
        <div class="o-name">我的订单</div>
        <ul>
          <li @click="goPath('/movie/orders')">
            <i class="iconfont" style="height: 19px;">
              <img class="big" src="../../assets/movie/movieList.png" width="100%" height="100%" />
            </i>
            <p>电影订单</p>
          </li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>

    <div class="orders">
      <div class="orders-in">
        <div class="o-name">常用工具</div>
        <ul>
          <li @click="goPath('/payment/myCard')">
            <i class="iconfont">
              <img src="@/assets/user/wdkj.png" width="100%" />
            </i>
            <p>我的卡券</p>
          </li>
          <li @click="goTel">
            <i class="iconfont">
              <img src="@/assets/user/lxkf.png" width="100%" />
            </i>
            <p>客服电话</p>
          </li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserHome",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },

    // 拨打电话
    goTel() {
      window.location.href = "tel:" + this.$init.channel.serviceTel;
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f4f4f4;
  /* padding-top: 85px; */
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

.list {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.item {
  border-top: 1px solid #eee;
  padding: 20px;
  line-height: 44px;
  font-size: 24px;
  color: #818181;
  display: flex;
  background-color: #fff;
}

.item .iconfont {
  font-size: 26px;
  display: inline-block;
  width: 50px;
  text-align: center;
}

.item-left {
  flex: 10;
}

.role {
  padding: 20px;
  background: -webkit-linear-gradient(left, #ff8e62, #ff3766);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #ff3766);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #ff3766);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #ff3766);
  /* 标准的语法（必须放在最后） */
  padding-top: 40px;
  padding-bottom: 80px;
  color: #fff;
}

.role-name {
  margin-top: 10px;
  text-align: center;
  font-size: 28px;
  color: #fff;
}

.role-img {
  width: 100%;
  text-align: center;
}

.role-img .img {
  display: inline-block;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.role-img .img img {
  display: block;
  height: 100%;
  width: 100%;
}

.item .red {
  color: #ff4403;
  border-color: #ff4403;
}

.item .blue {
  color: #00b202;
  border-color: #00b202;
}

.list .item.center {
  display: block;
  text-align: center;
}

.orders {
  padding: 10px 20px;
}

.orders-in {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  box-shadow: 0px 10px 20px #e0e0e0;
}

.orders-in ul {
  display: flex;
  margin-bottom: 10px;
}

.orders-in li {
  flex: 4;
  text-align: center;
  font-size: 20px;
  padding-top: 10px;
}

.orders-in li .iconfont {
  display: inline-block;
  width: 36px;
  height: 30px;
  margin-bottom: 10px;
}

orders-in li .iconfont.big {
  width: 34px;
  height: 36px;
}

.iconfont {
}

.o-cont {
  margin-top: -70px;
}

.o-name {
  margin-bottom: 10px;
  padding: 5px 20px 20px 20px;
  border-bottom: 1px solid #eee;
}

.logo-out {
  line-height: 36px;
  width: 72px;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  color: #ff5162;
}

.logo-out-cont {
  padding: 12px 0 0 0;
}
</style>