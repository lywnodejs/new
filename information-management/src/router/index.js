import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import information from '@/pages/imformation'
import test from '@/pages/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children:[
        {
          path: 'information',
          name: 'information',
          component: information,
        },
        {
          path: 'test',
          name: 'test',
          component: test,
        }
      ]
    }
  ]
})
