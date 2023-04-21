import Vue from 'vue'
import Router from 'vue-router'
import authorityFilter from './filters/authorityFilter'

function isNumber(v) {
  return typeof v === 'number'
}

function normalizeOffset(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function scrollToElPosition(shouldScroll) {
  const isObject = typeof shouldScroll === 'object'
  if (isObject && typeof shouldScroll.selector === 'string') {
    const el = document.querySelector(shouldScroll.selector)
    if (el) {
      const offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      const position = normalizeOffset(offset)

      el.scrollLeft = position.x
      el.scrollTop = position.y
      return false
    }
  }

  return shouldScroll
}

export default function initRouter({
  mode = 'history',
  scrollBehavior = _.noop,
  ...options
} = {}, routes) {
  Vue.use(Router)

  const router = new Router({
    mode,
    scrollBehavior(to, from, savedPosition) {
      const shouldScroll = scrollBehavior(to, from, savedPosition)

      return scrollToElPosition(shouldScroll)
    },
    ...options,
    routes
  })

  /*
   * 添加权限过滤器
  */
  router.beforeEach((to, from, next) => {
    authorityFilter.apply(this, [to, from, next])
  })

  return router
}
