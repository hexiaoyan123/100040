<template>
  <div class="container">
    <Vheader name="扫描详情"></Vheader>
    <div class="Carddetails">
      <div class="Carddetails-bg">
        <div class="Cardcontent-left">
          <p>卡号：9990 3119 7196 9132</p>
          <p>类型：现金卡</p>
          <div class="Cardcontent-valid">有效期：2020-12-31</div>
        </div>
        <div class="Cardcontent-right">
          <span style="color:#D3D3D3">余额</span>
          <div class="Cardcontent-money">
            <i>￥</i>
            59.90
          </div>
        </div>
      </div>
      <div class="tips">
        <div class="tips-tit">
          线上使用范围 ：
          <span style="color:#FF5162">697</span>
          家影院
        </div>
        <div class="tips-right">
          <i class="icon-more"></i>
        </div>
      </div>
    </div>
    <!-- 优惠购票 -->
    <div class="updata-cont">
      <div class="updata-right">优惠购票</div>
    </div>
  </div>
</template>

<script>
import Vheader from "./HeaderV";
export default {
  name: "Scancodedetails",
  components: {
    Vheader
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.container {
  background-color: #fff;
}
.Carddetails {
  background-color: #fff;
  position: relative;
  top: 8%;
  padding-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.Carddetails-bg {
  margin: 0px 26px 20px 26px;
  background-image: url(../assets/Carddetails-bg.png);
  background-size: 100% 100%;
  height: 260px;
  color: #fff;
}
.Cardcontent-left {
  float: left;
  margin-top: 40px;
  margin-left: 40px;
}
.Cardcontent-valid {
  margin-top: 80px;
}
.Cardcontent-right {
  float: right;
  margin-top: 40px;
  margin-right: 40px;
}
.Cardcontent-money {
  color: #ff5162;
  margin-top: 115px;
}
.tips {
  margin-left: 20px;
  color: #808080;
  padding-bottom: 15px;
}
.tips-tit {
  display: inline-block;
}
.tips-right {
  display: inline-block;
  position: absolute;
  right: 20px;
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
</style>
