import Vue from "vue";
import vuex from "vuex";
Vue.use(vuex);

export default new vuex.Store({
  state: {
    loader: false, // 页面加载中
    position: {}
  },
  mutations: {
    // 控制加载状态
    ctrlLoader(state, sta) {
      state.loader = sta ? true : false;
    },
    // 设置地址
    setPosition(state, obj) {
      state.position = obj;
    },
    // 显示页面加载状态
    showLoader(state) {
      state.loader = true;
    },
    // 隐藏页面加载状态
    hidenLoader(state) {
      state.loader = false;
    }
  }
});
