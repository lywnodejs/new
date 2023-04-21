// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import Vuex from "vuex";
import router from "./router";
import store from "./store";
import video from "video.js";
import "videojs-flash";
Vue.use(Vuex);
Vue.config.productionTip = false;

Vue.prototype.$video = video; // 将video.js 实例放在Vue原型上
/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
});
