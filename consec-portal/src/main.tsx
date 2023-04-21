/**
 * 项目入口文件
 *
 * 1. 加载store配置
 * 2. 初始化router
 * 3. 加载子页面
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { createHashHistory } from 'history'
import store from './store'

import App from './App'
import Home from './pages/home'
import Page404 from './errors/Page404'
import Capacity from './pages/capacity' // 产品能力页
import Detection from './pages/detection' // 在线检测页
import Solve from './pages/solve' // 解决方案
import Help from './pages/help' // 帮助中心

// 引入页面
// TODO: 修改为异步加载

configure({ enforceActions: 'strict' })

const browserHistory = createHashHistory() // 初始化history，使用HTML5 history API
const routingStore = new RouterStore() // 创建router store，将location变为响应式
const history = syncHistoryWithStore(browserHistory, routingStore) // 增强history，添加subscribe&unsubscribe方法，同时监听history变化，同步更新store中location

// 初始化页面
ReactDOM.render(
  <Provider router={routingStore} {...store}>
    <App>
      <Router history={history}>
        <Switch>
          <Route
            path="/capacity"
            component={Capacity}
          />
          <Route
            path="/solve"
            component={Solve}
          />
          <Route
            path="/detection"
            component={Detection}
          />
          <Route
            path="/help"
            component={Help}
          />

          <Route
            path="/"
            exact
            component={Home}
          />
          <Route component={Page404} />
        </Switch>
      </Router>
    </App>
  </Provider>,
  document.getElementById('app')
)
