import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import list from '@/components/list/list';
import CuserManagement from '@/components/CuserManagement';
import BuserManagement from '@/components/BuserManagement';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/list',
      component: list,
      children:[
        {
          path: 'CuserManagement',
          name:"C端用户管理",
          component: CuserManagement,
        },
        {
          path: 'BuserManagement',
          name:"B端用户管理",
          component: BuserManagement,
        },
      ]
    },
  ]
})
