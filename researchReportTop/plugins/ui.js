import Vue from 'vue';
import {DatetimePicker,Toast,Loadmore  } from 'mint-ui';
import jWeixin from 'weixin-js-sdk';
import 'mint-ui/lib/style.css';
import vueScroller from 'vue-scroller'

Vue.prototype.wx=jWeixin;
Vue.component(DatetimePicker.name,DatetimePicker);
Vue.component(Toast.name,Toast);
Vue.component(Loadmore.name,Loadmore);
Vue.use(vueScroller)