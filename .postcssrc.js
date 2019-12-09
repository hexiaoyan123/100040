// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {}, // 解决@import引入路径问题
    "postcss-url": {}, // 处理文件，比如图片文件、字体文件等引用路径
    // "autoprefixer": {}, // 自动处理浏览器前缀
    "postcss-aspect-ratio-mini": {}, // 元素容器宽高比
    // 处理移动端1px的解决方案
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {}, // css未来特性兼容性处理
    // 插件主要用来把px单位转换为vw、vh、vmin或者vmax这样的视窗单位
    "postcss-px-to-viewport": {
      viewportWidth: 750, // (Number) 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // (Number) 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // (Number) 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）. 
      viewportUnit: 'vw', // (String) 指定需要转换成的视窗单位，建议使用vw. 
      selectorBlackList: ['.van', '.ignore'], // (Array) 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // (Number)小于或等于`1px`不转换为视窗单位
      mediaQuery: false // (Boolean) 允许在媒体查询中转换`px`
    },
    // "postcss-viewport-units": {}, // 给CSS的属性添加content的属性，配合viewport-units-buggyfill库给vw、vh、vmin和vmax做适配的操作
    // 压缩和清理CSS代码
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
}
