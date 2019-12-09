<template>
  <div class="container">
    <div class="cityname">
      北京
      <i class="icon-jiantou"></i>
    </div>
    <div class="firstcity">
      北京市
      <i class="icon-jiantou"></i>
    </div>
    <div class="Cinemasum">
      北京市
      <span style="color:#FF5162">238</span>家影院
    </div>
    <div class="firstcity">
      顺义区
      <i class="icon-jiantou"></i>
    </div>

    <div class="ca-list">
      <div class="cs-item">
        <h4>
          <div class="cs-item-name-right">北京博纳顺景国际影城</div>
        </h4>
        <p>东城区王府井大街138号北京apm6层</p>
      </div>
      <div class="cs-item">
        <h4>
          <div class="cs-item-name-right">奥斯卡香江国际影城</div>
        </h4>
        <p>东城区王府井大街138号北京apm6层</p>
      </div>
      <div class="cs-item">
        <h4>
          <div class="cs-item-name-right">恒大影城（安阳店）</div>
        </h4>
        <p>东城区王府井大街138号北京apm6层</p>
      </div>
      <div class="cs-item">
        <h4>
          <div class="cs-item-name-right">奥斯卡榕森国际影城</div>
        </h4>
        <p>东城区王府井大街138号北京apm6层</p>
      </div>
      <div class="cs-item">
        <h4>
          <div class="cs-item-name-right">工人文化数字3D影城</div>
        </h4>
        <p>东城区王府井大街138号北京apm6层</p>
      </div>

      <h3 class="noData">
        <i class="keguan">
          <img src="../assets/keguan.png" width="100%" />
        </i>
        <span>客官，没有更多了！</span>
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "CityCinema",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.container {
  color: #4d4d4d;
}
.cityname {
  height: 80px;
  line-height: 80px;
  font-size: 3.5vw;
  text-align: center;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  margin-top: 10px;
}
.firstcity {
  text-align: left;
  padding-left: 24px;
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
}
.firstcity i {
  float: right;
  margin-right: 20px;
}
.Cinemasum {
  height: 60px;
  background-color: #f5f5f5;
  padding-top: 20px;
  padding-left: 24px;
}
.cs-item:first-child {
  border-top: 1px solid #e6e6e6;
}

.cs-item {
  padding: 10px 24px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
}

.cs-item h4 {
  font-size: 28px;
  color: #4d4d4d;
  line-height: 50px;
  /* padding-left: 40px; */
  position: relative;
  display: flex;
}
.cs-item-name-right {
  flex: 10;
}

.cs-item p {
  font-size: 22px;
  color: #c1c1c1;
  line-height: 38px;
  width: calc(100% - 100px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.noData {
  position: relative;
  margin-top: 40px;
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
