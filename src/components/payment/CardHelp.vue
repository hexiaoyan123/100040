<template>
  <div class="container">
    <Vheader name="帮助指南"></Vheader>
    <div class="helpContent">
      <span class="titleSpan">猜你想问</span>
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item v-for="(item, index) in cardHelpData" :key="index">
          <div slot="title">
            <img
              style="width: 16px;height: 16px;display: inline-block;position: absolute;left: -22px;top: 4px;"
              src="../../assets/card/q.png"
            />
            {{item.title}}
          </div>
          <img src="../../assets/card/a.png" />
          <div>{{item.text}}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "CardHelp",
  components: {
    Vheader
  },
  data() {
    return {
      activeName: "",
      cardHelpData: [
        {
          title: "卡券如何绑定？",
          text:
            "尊敬的用户您好，绑定卡券请登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击添加卡券按钮—扫描卡券二维码或输入卡号密码后即可绑定。"
        },
        {
          title: "卡券如何购买电影票？",
          text:
            "尊敬的用户您好，请登录我们的客户端(微信公众号或APP)—进入电影—热映影片—点击左上角城市定位到您所在城市—选择影片、影院、座位—选择卡券支付—选择已绑定卡券或绑定卡券—确认支付即可。"
        },
        {
          title: "卡券如何购买商城的商品？",
          text:
            "尊敬的用户您好，请登录我们的客户端(微信公众号或APP)点击首页—搜索或点击分类—选择您需要购买的商品—选择卡券支付—选择已绑定卡券或绑定卡券—确认支付即可。（部分卡券不支持电影以外的其它商品，具体以卡券使用范围为准）"
        },
        {
          title: "卡券如何线下门店消费？",
          text:
            "尊敬的用户您好，如果是我们支持的商户，您可以出示我们的实体卡券或登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击需要出示的卡券—点击二维码付款—出示二维码在POS机上扫描即可。（如未绑定的卡券，需要点击添加卡券按钮，扫描卡券二维码或输入卡号密码绑定后修改）"
        },
        {
          title: "卡券如何查询消费记录，余额、有效期？",
          text:
            "尊敬的用户您好，查询卡券余额、有效期、消费记录请登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击查询的卡券—查看对应信息即可。（如未绑定的卡券，需要点击添加卡券按钮，扫描卡券二维码或输入卡号密码绑定后查询。）"
        },
        {
          title: "卡券如何修改密码？",
          text:
            "尊敬的用户您好，修改密码请登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击需要修改密码的卡券—点击下方的修改密码按钮—输入老密码及新密码即可。（如未绑定的卡券，需要点击添加卡券按钮，扫描卡券二维码或输入卡号密码绑定后修改）"
        },
        {
          title: "卡券如何解除绑定？",
          text:
            "尊敬的用户您好，解除卡券绑定请登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击需要解除绑定的卡券—点击删除即可。（解除绑定前请牢记您的卡号及密码，解除绑定后如重新关联需要重新输入卡号密码或扫描卡面二维码才可以重新绑定）"
        },
        {
          title: "卡券密码如何查看？",
          text:
            "尊敬的用户您好，如果是我们支持的商户，您可以出示我们的实体卡券或登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击需要出示的卡券—点击二维码付款—即可查看该卡片的卡号、密码及二维码。"
        },
        {
          title: "卡券如何充值？",
          text:
            "尊敬的用户您好，卡券充值请登录我们的客户端(微信公众号或APP)点击我的—我的卡券—点击下方的卡券充值按钮—选择或输入充值的金额即可（如未绑定的卡券，需要点击添加卡券按钮，扫描卡券二维码或输入卡号密码绑定后修改）"
        }
      ]
    };
  },
  methods: {}
};
</script>
<style>
.helpContent .van-cell {
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 14px;
}
.van-icon--image {
  margin-left: 5px;
  width: 22px;
  height: 22px;
}
.van-cell__title {
  position: relative;
  color: #525252;
  margin-left: 27px;
}
.van-cell__value.van-cell__value--alone div {
  position: relative;
  color: #525252;
  margin-left: 27px;
}
.helpContent .van-cell__title .titleImg {
}
.van-collapse-item__content {
  padding-left: 20px;
  padding: 0 10px 0px 20px;
}
.van-cell:not(:last-child):after {
  border: none;
}
.van-collapse-item__content img {
  width: 16px;
  height: 16px;
  display: inline-block;
  float: left;
  margin-top: 2px;
}
.van-collapse-item__content div {
  margin-left: 5px;
  display: inline-block;
  width: calc(100% - 30px);
  color: #bbbbbb;
  font-size: 14px;
  padding-bottom: 20px;
}
</style>
<style scoped>
header {
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #ff5162;
  z-index: 101;
}

.helpContent {
  padding-top: 84px;
}

.titleSpan {
  display: inline-block;
  position: relative;
  margin-left: 60px;
  margin-top: 25px;
  margin-bottom: 25px;
  font-size: 28px;
  color: #525252;
}

.titleSpan:before {
  content: " ";
  display: inline-block;
  position: absolute;
  top: 10%;
  height: 80%;
  width: 6px;
  left: -18px;
  background-color: #ff5162;
}
</style>
