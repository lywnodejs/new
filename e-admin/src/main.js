// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import VueResource from 'vue-resource'
import Highcharts from 'highcharts'
// import md5 from 'js-md5'
// import MD5 from './assets/md5.js'
// let MD5 = require('./assets/md5.js')
// Object.definePrototype(Vue.prototype, '$md5', { value: md5 })

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.config.silent = true
Vue.use(Highcharts)
Vue.component(CollapseTransition.name, CollapseTransition)
// Vue.use(MD5)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})

// 全局过滤器
// 时间戳
Vue.filter('timeDateChange', function (nS) {
  if (!nS || isNaN(nS)) {
    return ''
  }
  var date = new Date(parseInt(nS))
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
  // var s = date.getSeconds()
  return Y + M + D + h + m
})

Vue.filter('timeDateFormatChange', function (nS) {
  if (!nS || isNaN(nS)) {
    return ''
  }
  var date = new Date(parseInt(nS))
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  return Y + M + D
})

// 处理状态转化
Vue.filter('dealStatus', function (st) {
  switch (st) {
    case 0:
      return '未处理'
    case 3:
      return '已处理'
    default:
      return '--'
  }
})
// 截取标题
Vue.filter('subStr', function (value) {
  if (!value) return ''
  value = value.toString()
  if (value.length > 15) {
    return value.substring(0, 15) + '...'
  } else {
    return value
  }
})
// 截取简介
Vue.filter('splitStr30', function (value) {
  if (!value) return ''
  value = value.toString()
  if (value.length > 30) {
    return value.substring(0, 30) + '...'
  } else {
    return value
  }
})
// 解码
Vue.filter('decodeStr', function (value) {
  if (!value) return ''
  value = value.toString()
  return decodeURI(value)
})
// 格式化类型
Vue.filter('formattingClass', function (val) {
  var returndata = '';
  var testA = ['WEIXIN','REPORT','NOTICE'];
  var testB = ['NEWS','GREAT_WISDOM_DATA','GREAT_WISDOM_DATA_BASIC','GREAT_WISDOM_DATA_NEGATIVE'];
  if(val){
    for(var i =0;i<val.length;i++){
      if(testA.includes(val[i])){
        return returndata = '公告';
      }else if(testB.includes(val[i])){
        return returndata = '新闻'
      }
    }
  }
})

// 格式化时间 时间参数格式为（20200311） 返回  2020-03-11
Vue.filter('formattingTime', function (val) {
  var str = '';
  if(val){
    var a = val.substring(0,4);
    var b = val.substring(4,6);
    var c=  val.substring(6,8);
    return a+'-'+b+'-'+c
  }else{
    return val;
  }
})
