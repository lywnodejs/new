import Vue from 'vue'
import App from './App'
import router from './router'
import ant from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(ant);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
