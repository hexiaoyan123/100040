"use strict";
export default {
  // 渠道配置信息
  channel: {
    // 接口地址
    apiUrl: "//zpyl.piaowutong.cc",
    // 静态文件地址
    staticUrl: "//zpyl.static.piaowutong.cc",
    // 项目地址
    itemUrl: "http://100040.wap.piaowutong.cc/#/",
    // 首页地址
    indexUrl: "/movie/home",
    // 支付授权地址
    payAuthUrl: "http://100040.wap.piaowutong.cc/#/payment/payChannel",
    // payAuthUrl: 'http://192.168.1.5:9090/#/payment/payChannel',
    // 未登录重定向地址
    notLoginRedirectUrl:
      "http://100040.wap.piaowutong.cc/#/user/loginWechatCode",
    // notLoginRedirectUrl: 'http://192.168.1.5:9090/#/user/loginPhoneCode',
    // 渠道编码
    id: "100040",
    // 渠道名称
    name: "优加惠品",
    // 秘钥
    secret: "8R1ODIEQJCIJ47S000BA1FNAZB19XCZG",
    // 登录方法（
    // 1：手机号验证码；
    // 2：手机号密码；
    // 3：中影凭证密码；
    // 4：中行接口授权；
    // 5：微信登录；
    // 6：湖北客户接口授权；
    // ）
    loginMethod: "1",
    // 默认城市
    defaultCity: {
      id: "110100",
      hot: 1,
      parentId: "110000",
      grade: "2",
      name: "北京",
      abbr: "B"
    },
    // 客服电话
    serviceTel: "4007001314"
  },

  // 登录信息
  login: {
    // 登录标识
    accessToken: "",
    // 登录用户
    user: {},
    // 登录渠道
    channel: {}
  },

  channelCategory: {
    WAP_SHOP: {
      code: 1,
      msg: "WAP商城"
    },
    WAP_CINEMA: {
      code: 2,
      msg: "WAP电影票"
    },
    WAP_TICKET: {
      code: 3,
      msg: "WAP票务"
    },
    WAP_ACTIVITY: {
      code: 4,
      msg: "WAP活动"
    },
    WAP_SECKILL: {
      code: 5,
      msg: "WAP秒杀"
    },
    WAP_TRAVEL: {
      code: 6,
      msg: "WAP旅游"
    },
    ADMIN: {
      code: 7,
      msg: "管理后台"
    }
  }
};
