<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="! $route.meta.keepAlive"></router-view>
    <Loader v-show="$store.state.loader"></Loader>
    <BottomBar></BottomBar>
    <BottomBarMovie></BottomBarMovie>
  </div>
</template>

<script>
import Loader from "./components/Loader";
import BottomBar from "./components/BottomBar";
import BottomBarMovie from "./components/movie/BottomBar";
export default {
  name: "App",
  components: {
    Loader,
    BottomBar,
    BottomBarMovie
  },
  created() {}
};
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("//at.alicdn.com/t/font_711237_lil1kcl2f.eot");
  src: url("//at.alicdn.com/t/font_711237_lil1kcl2f.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_711237_lil1kcl2f.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_711237_lil1kcl2f.woff") format("woff"),
    url("//at.alicdn.com/t/font_711237_lil1kcl2f.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_711237_lil1kcl2f.svg#iconfont") format("svg");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.priceSpan {
  color: #ff5162 !important;
}

[v-cloak] {
  display: none;
}

body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
button,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}

body {
  background: #fff;
  color: #4d4d4d;
  font-size: 24px;
  font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
}

td,
th,
caption {
  font-size: 24px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  font-size: 100%;
  color: #4d4d4d;
}

address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
  font-style: normal;
  font-weight: normal;
}

a {
  color: #555;
  text-decoration: none;
}

a:link {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

img {
  border: none;
}

ol,
ul,
li {
  list-style: none;
}

input,
textarea,
select,
button {
  border-radius: 0;
  font: 24px Verdana, Helvetica, Arial, sans-serif;
  caret-color: #ff5162;
}

table {
  border-collapse: collapse;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  *zoom: 1;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  /* box-sizing: border-box; */
  /* overflow: auto; */
  /* overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0; */
}

.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  /* overflow-x: hidden;
  overflow-y: auto; */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.container-content {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.red {
  color: #ff4403;
}

.on {
  color: #ff5162;
}

figure {
  margin: 0;
}
/* 富文本 */

.rich-text {
  font-size: 24px;
  line-height: 38px;
}

.rich-text img {
  display: block;
  width: 100%;
}
/* 溢出省略号 */

.unoverflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 无数据 */

.noData {
  line-height: 60px;
  text-align: center;
  color: #c1c1c1;
  font-size: 24px;
  padding-bottom: 40px;
}
/* 宽高比容器 */

.aspectratio {
  position: relative;
}

.aspectratio::before {
  content: "";
  display: block;
  width: 1px;
  margin-left: -1px;
  height: 0;
}

.aspectratio-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

[w-1-1] {
  aspect-ratio: "1:1";
}
/* 初始化tab */

.van-tab {
  font-size: 12px;
  line-height: 38px;
}

.van-tab--active {
  color: #ff5162;
  font-size: 14px;
}

.van-tabs__line {
  background: -webkit-linear-gradient(bottom, #ffffff, red);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(top, #ffffff, red);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(top, #ffffff, red);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to top, #ffffff, red);
  /* 标准的语法（必须放在最后） */
}

.van-tabs__line:before {
  content: " ";
  width: 20%;
  height: 150%;
  display: inline-block;
  position: absolute;
  background-color: #fff;
  left: -1px;
  top: -1px;
}

.van-tabs__line:after {
  content: " ";
  width: 20%;
  height: 150%;
  display: inline-block;
  position: absolute;
  background-color: #fff;
  right: -1px;
  top: -1px;
}

.van-tabs--line .van-tabs__wrap {
  height: 38px;
}

.van-tabs--line {
  padding-top: 38px;
}
/* 渐变色背景 */

.gradation {
  background: -webkit-linear-gradient(left, #ffac62, #ff3666);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ffac62, #ff3666);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ffac62, #ff3666);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ffac62, #ff3666);
  /* 标准的语法（必须放在最后） */
}
/* banner样式 */

.van-swipe__indicator {
  height: 4px;
  width: 4px;
  border-radius: 2px;
  background-color: #dedede;
}

.van-swipe__indicator--active {
  width: 10px;
  height: 4px;
  background: -webkit-linear-gradient(left, #ffac62, #ff3666);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ffac62, #ff3666);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ffac62, #ff3666);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ffac62, #ff3666);
  /* 标准的语法（必须放在最后） */
}

.icon-more {
  display: inline-block;
  height: 22px;
  width: 22px;
  background: url(./assets/xb/more.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.icon-jiantou {
  display: inline-block;
  height: 22px;
  width: 22px;
  background: url(./assets/xb/down.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-close {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/xb/close.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
/* 支付图标 */
.iocn-weixin {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/weixin.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-zhifubao {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/zhifubao.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-yinlian {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/yinlian.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-xianjinka {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/xianjinka.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-xianjinjuan {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/xianjinjuan.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-dianjuan {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/dianjuan.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
.iocn-cika {
  display: inline-block;
  height: 30px;
  width: 30px;
  background: url(./assets/payment/cika.png) no-repeat;
  background-position: 0 0;
  background-size: 100%;
}

.van-overlay,
.van-toast {
  animation: none !important;
}
</style>