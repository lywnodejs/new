// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import router from './router/index_APP_TARGET.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import qs from 'qs'
import {getJoinCookie} from './utils/commonUtil';
import './utils/dialog'
// import rhLogin from 'rh-login'

// Vue.use(rhLogin)
Vue.use(VueQuillEditor);

Vue.prototype.$qs = qs;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueClipboard);

Vue.prototype.url='';
Vue.prototype.activeInde='';

/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router:router,
  components: { App },
  template: '<App/>'
});*/

// //全局守卫 如果cookie中的userId过期 则需要重新登录
router.beforeEach((to, from, next) => {
  let userId = getJoinCookie('userId')
  if (!userId && to.path!=='/login') {
    let appTarget =process.env.PROJ_NAME;
    if (appTarget === 'dialogue'){
      next({path:'/login',query:{taskType:'dialogue'}})
    }else {
      next({path:'/login'})
    }
  }else {
    next()
  }
});

Vue.prototype.getResponse = function(res) {
  this.$emit('getResponse',res);
}
var vm = new Vue({
  el: '#app',
  router:router,
  components: { App },
  template: '<App/>'
})

window.getResponse = function (res) {
  vm.getResponse(res);
}



