import Vue from 'vue'
import Router from 'vue-router'
import index from '../page/index'
import default_ from '../page/default'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
    },
    {
      path: '/default',
      name: 'default',
      component: default_,
    }
  ]
})
