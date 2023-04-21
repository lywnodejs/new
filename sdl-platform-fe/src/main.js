import BayMax from '@/lib'
import store from './store'
import models from './models'
import i18n from './i18n'
import routes from './routes'
import plugin from './plugin'
import element from 'element-ui'
import App from './App'
import user from './models/user'
import { APP_BASEURL } from 'commons/constant'
import { userInfo } from 'commons/userInfo'
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.min.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'

const app = new BayMax()

app.plugin(element)
  .plugin(plugin)
  .i18n(i18n)
  .router({
    base: APP_BASEURL
  }, routes)

  // 页面渲染的前置函数
  .before(function() {
    const { state, ...other } = store
    const { namespace, state: ustate, ...reset } = user

    // 初始化vuex
    app.store({
      state: {
        ...state
      },
      ...other
    })

    // 手动注册用户模块
    app._store.registerModule(namespace, {
      namespaced: true,
      state: {
        user: {
          ...ustate,
          ...userInfo
        }
      },
      ...reset
    })
  })

_.each(models, (m) => {
  app.model(m.default);
});

app.bootstrap('#app', App)
