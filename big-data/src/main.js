// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false;
import store from './store/index';
import Cube  from 'cube-ui';
import Util from './util/util'

Vue.use(Cube);
Vue.prototype.Util = Util;
/* eslint-disable no-new */
//先定义过滤器, 再新建 vue 实例
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});

