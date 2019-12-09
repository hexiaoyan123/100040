export default {
  // 验证微信
  isWeixn() {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  // 乘法
  numMulti(num1, num2) {
    var baseNum = 0;
    try {
      baseNum += num1.toString().split(".")[1].length;
    } catch (e) {}
    try {
      baseNum += num2.toString().split(".")[1].length;
    } catch (e) {}
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
  },
  // 验证ios
  isIOS() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
      return true;
    } else {
      return false;
    }
  }
}
