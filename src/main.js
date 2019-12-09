// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import md5 from 'js-md5'
import AMap from 'vue-amap' // 地图
import App from './App'
import router from './router'
import store from './store'
import init from './common/init'
import base from './common/base'
import axios from 'axios'
import vueFinger from 'vue-finger'
import VueCookies from 'vue-cookies'
import VueClipboard from 'vue-clipboard2'
import vueTouch from 'kim-vue-touch'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  List,
  Waterfall,
  Sku,
  Picker,
  SwitchCell,
  Actionsheet,
  Rate,
  Row,
  Col,
  Icon,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  Popup,
  Tab,
  Tabs,
  AddressList,
  AddressEdit,
  Area,
  RadioGroup,
  Radio,
  Field,
  Cell,
  CellGroup,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem
} from 'vant'

Vue.use(List)
Vue.use(Waterfall)
Vue.use(Sku)
Vue.use(Picker)
Vue.use(SwitchCell)
Vue.use(Actionsheet)
Vue.use(Rate)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(AddressList)
Vue.use(AddressEdit)
Vue.use(Area)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Field)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(GoodsAction)
Vue.use(GoodsActionBigBtn)
Vue.use(GoodsActionMiniBtn)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(vueFinger)
Vue.use(VueCookies)
Vue.use(VueClipboard)
Vue.use(vueTouch)
Vue.use(ElementUI)

// 地图
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '1fd17a03360de26427d86c89708ddd77',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
  v: '1.4.4',
  uiVersion: '1.0.11'
})

Vue.prototype.$base = base
Vue.prototype.$axios = axios
Vue.prototype.$init = init
Vue.prototype.$md5 = md5
Vue.prototype.$http = {
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: init.channel.apiUrl,
      url: url,
      data: data,
      timeout: 0,
      transformResponse: [function (data) {
        if (data) {
          let result = JSON.parse(data)
          if (result && result.code == '1017') {
            window.location.href = init.channel.notLoginRedirectUrl
          }
          return result
        }
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Token': init.login.accessToken,
        'Channel-Id': init.channel.id
      }
    })
  },
  get(url) {
    return axios({
      method: 'get',
      baseURL: init.channel.apiUrl,
      url: url,
      timeout: 0,
      transformResponse: [function (data) {
        if (data) {
          let result = JSON.parse(data)
          if (result && result.code == '1017') {
            window.location.href = init.channel.notLoginRedirectUrl
          }
          return result
        }
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Token': init.login.accessToken,
        'Channel-Id': init.channel.id
      }
    })
  }
}

// 初始化用户渠道
Vue.prototype.initLogin = () => {
  // 获取用户
  if (JSON.stringify(init.login.user) == '{}') {
    Vue.prototype.getUser()
  }
  // 获取渠道
  if (JSON.stringify(init.login.channel) == '{}') {
    Vue.prototype.getChannel()
  }
}

// 获取用户
Vue.prototype.getUser = () => {
  Vue.prototype.$http.get('/panda-admin-api/v1/getUser').then((response) => {
    if (response.data.code == '1000') {
      // 赋值登录用户
      init.login.user = response.data.result
    } else {
      Vue.prototype.$toast(response.data.msg)
    }
  })
}

// 获取渠道
Vue.prototype.getChannel = () => {
  Vue.prototype.$http.get('/panda-admin-api/v1/getChannel').then((response) => {
    if (response.data.code == '1000') {
      // 赋值登录渠道
      init.login.channel = response.data.result
    } else {
      Vue.prototype.$toast(response.data.msg)
    }
  })
}

router.beforeEach((to, from, next) => {

  // 手机号验证码登录
  if (init.channel.loginMethod == '1') {

    // 跳转登录页面
    if (to.fullPath === '/user/loginPhoneCode') {
      next()
    }

    // 验证授权
    if (init.login.accessToken) {
      // 初始化用户渠道
      Vue.prototype.initLogin()
      next()
    } else if (VueCookies.isKey('DATA_LOGIN')) {
      // 赋值登录信息
      let login = JSON.parse(VueCookies.get('DATA_LOGIN'))
      init.login = login
      // 初始化用户渠道
      Vue.prototype.initLogin()
      next()
    } else {
      // 没有授权时，请求授权
      next('/user/loginPhoneCode')
    }
  }

  // 微信登录
  else if (init.channel.loginMethod == '5') {

    // 跳转登录页面
    if (to.fullPath === '/user/loginWechatCode') {
      next()
    }

    // 授权后重定向，返回accessToken
    if (to.query.accessToken) {
      if (to.query.accessToken === '' || to.query.accessToken === 'null') {
        Vue.prototype.getWechatLogin()
      } else {
        // 赋值登录标识
        init.login.accessToken = to.query.accessToken
        // 初始化用户渠道
        Vue.prototype.initLogin()
        // 设置cookie
        VueCookies.set('DATA_LOGIN', JSON.stringify(init.login), (1000 * 60 * 60 * 2))
      }
    }

    // 验证授权
    if (init.login.accessToken) {
      // 初始化用户渠道
      Vue.prototype.initLogin()
      next()
    } else if (VueCookies.isKey('DATA_LOGIN')) {
      // 赋值登录信息
      let login = JSON.parse(VueCookies.get('DATA_LOGIN'))
      init.login = login
      // 初始化用户渠道
      Vue.prototype.initLogin()
      next()
    } else {
      // 没有授权时，请求授权
      next('/user/loginWechatCode')
    }
  }

  // 湖北客户接口授权
  else if (init.channel.loginMethod == '6') {

    // 授权后重定向，返回accessToken
    if (to.query.token) {
      if (to.query.token === '' || to.query.token === 'null') {
        window.location.href = init.channel.notLoginRedirectUrl
      } else {
        // 赋值登录标识
        init.login.accessToken = to.query.token
        // 初始化用户渠道
        Vue.prototype.initLogin()
        // 设置cookie
        VueCookies.set('DATA_LOGIN', JSON.stringify(init.login), (1000 * 60 * 60 * 2))
      }
    }

    // 验证授权
    if (init.login.accessToken) {
      // 初始化用户渠道
      Vue.prototype.initLogin()
      next()
    } else if (VueCookies.isKey('DATA_LOGIN')) {
      // 赋值登录信息
      let login = JSON.parse(VueCookies.get('DATA_LOGIN'))
      init.login = login
      next()
    } else {
      // 没有授权时，请求授权
      window.location.href = init.channel.notLoginRedirectUrl
    }
  }
})

router.afterEach((to, from) => {
  // 请空提示
  Toast.clear('clearAll')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
