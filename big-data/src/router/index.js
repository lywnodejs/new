import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index';
import event from '../pages/event';
import detail from '../pages/detail';
import home from '../pages/home';
import eventDetail from '../pages/eventDetail';

Vue.use(Router)
const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home'
  },
  {
    path: '/index',
    name: '首页',
    component: index
  },{
    path: '/event',
    name: '事件',
    component: event
  },{
    path: '/detail',
    name: '详情',
    component: detail
  },{
    path: '/home',
    name: '主页',
    component: home
  },{
    path:'/eventDetail',
    name:'事件详情页',
    component:eventDetail
  }
]

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: routes
})

export default router