import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Login from '../views/Login'
import Home from '../views/Home'
import RelationContrl from '../views/RelationContrl'
import dynamicContrl from '../views/dynamicContrl'
import SynonymContrl from '../views/SynonymContrl'
import BlacklistContrl from '../views/BlacklistContrl'
import WhitelistContrl from '../views/WhitelistContrl.vue'
import DeleteHistoryContrl from '../views/DeleteHistoryContrl'
import EntityContrl from '../views/EntityContrl'
import MaintainHot from '../views/MaintainHot'
import StructuredKnowledge from '../views/StructuredKnowledge'
import entityType from '../views/entityType'
import entityKnowledge from '../views/entityKnowledge'
import objectKnowledge from '../views/objectKnowledge'
import entityDictionary from '../views/entityDictionary'

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

Vue.use(Router)
const routes = [
  {
    path: '/login',
    component: Login
  },
  // {
  //   path: '/',
  //   component: Login,
  //   name: '',
  //   //hidden: true
  // },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      {path: '/entityType', component: entityType, name: '实体类型'},
      {path: '/entityKnowledge', component: entityKnowledge, name: '实体知识'},
      {path: '/objectKnowledge', component: objectKnowledge, name: '对象知识'},
      {path: '/relationContrl', component: RelationContrl, name: '实体关系维护'},
      {path: '/entityDictionary', component: entityDictionary, name: '实体词典'},
      {path: '/dynamicContrl', component: dynamicContrl, name: '动态实体关系维护'},
      {path: '/synonymContrl',component: SynonymContrl, name: '同义词管理'},
      {path: '/blacklistContrl',component: BlacklistContrl, name: '黑名单管理'},
      {path: '/whitelistContrl',component: WhitelistContrl, name: '白名单管理'},
      {path: '/MaintainHot',component: MaintainHot, name: '热点维护'},
      {path: '/deleteHistoryContrl',component: DeleteHistoryContrl, name: '删除历史'},
      {path: '/entityContrl',component: EntityContrl, name: '实体关系库'},
      { path: '/StructuredKnowledge', component: StructuredKnowledge, name: '知识化结构' }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
];
const router = new Router({
  //mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(function (item) {
    return item.meta.requiresAuth
  })) {
    let isLogin = window.localStorage.getItem('isLogin');
    if (isLogin) {
      next()
    } else {
      next({
          path: '/login',//如果为假，则重定向到这个路由路劲
          //query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else
    next()
})
export default router;

// export default new Router({
//   routes: 
// })



