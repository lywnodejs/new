/*
 * @Date: 2020-03-31 14:17:06
 * @Author: 魏愈茜
 * @LastEditTime: 2020-03-31 16:40:07
 */
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AllCompany from '@/views/AllCompany'
import Assessment from '@/views/Assessment'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Feedback from '@/views/Feedback.vue'
import Video from '@/views/Video.vue'
import Audio from '@/views/Audio.vue'
import Summary from '@/views/Summary.vue'
import PortfolioMage from '@/views/PortfolioMage.vue'
import GroupMage from '@/views/GroupMage.vue'
import PrivateEquity from '@/views/PrivateEquity.vue'
import CustomMade from '@/views/CustomMade.vue'
import Level2coupon from '@/views/Level2Coupon.vue'
import homeSignal from '@/views/homeSignal.vue'
import homeSignalUpdate from '@/views/homeSignalRecord.vue'
import level2AssessData from '@/views/level2AssessData.vue'
import level2Statistics from '@/views/level2Statistics.vue'
import homePop from '@/views/homePop.vue'
import information from '@/views/information'
import changedInformation from '@/views/changedInformation'
import setPermission from '@/views/setPermission'
import riskInformationList from '@/views/riskInformationList'
import contentMaintain from '@/views/contentMaintain'
import sendSubject from '@/views/sendSubject'
import preview from '@/views/preview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {path: '/hello', component: Hello, name: '中心营业部/分公司'},
        {path: '/allCompany', component: AllCompany, name: '全公司'},
        {path: '/assessment', component: Assessment, name: '考核指标汇总'},
        {path: '/feedback', component: Feedback, name: '意见反馈'},
        {path: '/video', component: Video, name: '研播'},
        {path: '/audio', component: Audio, name: '研听'},
        {path: '/summary', component: Summary, name: '简介'},
        {path: '/portfolioMage', component: PortfolioMage, name: '组合管理'},
        {path: '/groupMage', component: GroupMage, name: '分组管理'},
        {path: '/privateEquity', component: PrivateEquity, name: '私募数据'},
        {path: '/customMade', component: CustomMade, name: '用户定制信息'},
        {path: '/level2coupon', component: Level2coupon, name: 'Level2体验券管理'},
        {path: '/homeSignal', component: homeSignal, name: '信号管理'},
        {path: '/homeSignalUpdate', component: homeSignalUpdate, name: '已修正条目'},
        {path: '/level2AssessData', component: level2AssessData, name: 'Level2考核数据查询'},
        {path: '/level2Statistics', component: level2Statistics, name: 'Level2考核数据统计'},
        {path: '/homePop', component: homePop, name: '首页弹框'},
        {path: '/information', component: information, name: '资讯列表'},
        {path: '/changedInformation', component: changedInformation, name: '已修正资讯列表'},
        {path: '/setPermission', component: setPermission, name: '权限管理'},
        {path: '/riskInformationList', component: riskInformationList, name: '风险列表'},
        {path: '/contentMaintain', component: contentMaintain, name: '华创官网内容维护'},
      ]
    },
    {path: '/sendSubject', component: sendSubject, name: '发布/修改专题'},
    {path: '/preview', component: preview, name: '预览'},
  ]
})
