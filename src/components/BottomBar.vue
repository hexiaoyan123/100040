<template>
  <div class="botton-bar-cont" v-show="show">
    <div
      class="botton-bar-item"
      :class="{'botton-bar-item-on': $route.path == '/movie/home'}"
      @click="goPath('/movie/home')"
    >
      <i class="iconfont">
        <img
          v-if="$route.path == '/movie/home'"
          src="../assets/movie/movieIcon-active.png"
          width="100%"
          height="100%"
        />
        <img v-else src="../assets/movie/movieIcon.png" width="100%" height="100%" />
      </i>
      <p>影片</p>
    </div>
    <div
      class="botton-bar-item"
      :class="{'botton-bar-item-on': $route.path == '/movie/cinema'}"
      @click="goPath('/movie/cinema')"
    >
      <i class="iconfont">
        <img
          v-if="$route.path == '/movie/cinema'"
          src="../assets/movie/cinema-active.png"
          width="100%"
          height="100%"
        />
        <img v-else src="../assets/movie/cinema.png" width="100%" height="100%" />
      </i>
      <p>影院</p>
    </div>
    <div
      class="botton-bar-item"
      :class="{'botton-bar-item-on': $route.path == '/user/home'}"
      @click="goPath('/user/home')"
    >
      <i class="iconfont">
        <img
          v-if="$route.path == '/user/home'"
          src="../assets/movie/my-active.png"
          width="100%"
          height="100%"
        />
        <img v-else src="../assets/movie/my.png" width="100%" height="100%" />
      </i>
      <p>我的</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BottomBar",
  data() {
    return {
      urls: [
        "/index",
        "/QRcode",
        "/product/searchClass",
        "/product/cart",
        "/user/home"
      ]
    };
  },
  methods: {
    goPath(path) {
      this.$router.push(path);
    }
  },
  computed: {
    show() {
      if (this.urls.indexOf(this.$route.path) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.iconfont {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin-top: 6px;
}

.botton-bar-cont {
  /* position: absolute; */
  position: fixed;
  /* -webkit-overflow-scroll: touch; */
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  width: 100%;
  height: 88px;
  display: flex;
  box-shadow: 0 1px 6px #ccc;
  box-sizing: border-box;
  padding-top: 3px;
  z-index: 90;
}

.botton-bar-item {
  flex: 3;
  text-align: center;
}

.botton-bar-item .iconfont {
  font-size: 36px;
  line-height: 50px;
}

.botton-bar-item p {
  font-size: 24px;
  line-height: 30px;
  color: #a5a5a5;
}

.botton-bar-cont .botton-bar-item-on p {
  color: #ff5162;
}
</style>
