<template>
  <div class="amap-page-container">
    <el-amap vid="amap" :plugin="plugin" class="amap-demo"></el-amap>
  </div>
</template>

  <style>
.amap-demo {
  display: none;
}
</style>

<script>
export default {
  components: {},
  data() {
    let self = this;
    return {
      positions: {
        lng: "",
        lat: "",
        address: "",
        loaded: false
      },
      center: [121.59996, 31.197646],
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                //alert(result.position);
                if (result && result.position) {
                  self.str = result.formattedAddress;
                  self.positions.address = self.str.substring(
                    self.str.indexOf("市") + 1
                  );
                  self.positions.lng = result.position.lng;
                  self.positions.lat = result.position.lat;
                  self.positions.loaded = true;
                  self.$nextTick();
                  // 把获取的数据提交到 store 的数据中，以便其他单文件组件使用
                  self.$store.commit("setPosition", self.positions);
                  window.localStorage.setItem(
                    "positionslng",
                    self.positions.lng
                  );
                  window.localStorage.setItem(
                    "positionslat",
                    self.positions.lat
                  );
                }
              });
            }
          }
        }
      ]
    };
  }
};
</script>