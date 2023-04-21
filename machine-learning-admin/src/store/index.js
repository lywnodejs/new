import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  activeIndex:'1',//主菜单索引
  parameter:'',//用于判断从哪点进去的结果页面
};
export default new Vuex.Store({
	state,
	actions,
	mutations,
})
