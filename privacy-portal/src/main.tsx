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
import { createBrowserHistory } from 'history'
import store from './store'
import App from './App'
import Loadable from 'react-loadable'
import Page404 from './errors/Page404'

// 引入页面
// TODO: 修改为异步加载

configure({ enforceActions: 'strict' })

const browserHistory = createBrowserHistory() // 初始化history，使用HTML5 history API
const routingStore = new RouterStore() // 创建router store，将location变为响应式

const history = syncHistoryWithStore(browserHistory, routingStore) // 增强history，添加subscribe&unsubscribe方法，同时监听history变化，同步更新store中location

const Loading = () => <div />
// 初始化页面
ReactDOM.render(
  <Provider router={routingStore} {...store}>
    <App>
      <Router history={history}>
        <Switch>
          {/*<Route*/}
          {/*  path="/example"*/}
          {/*  component={Loadable({*/}
          {/*    loader: () => import('./pages/Example'),*/}
          {/*    loading: Loading*/}
          {/*  })}*/}
          {/*/>*/}
          <Route
            path="/login/weixin"
            component={Loadable({
              loader: () => import('./pages/Login/WXLogin'),
              loading: Loading
            })}
          />
          <Route
            path="/login/weibo"
            component={Loadable({
              loader: () => import('./pages/Login/WBLogin'),
              loading: Loading
            })}
          />
          <Route
            path="/login/qq"
            component={Loadable({
              loader: () => import('./pages/Login/QQLogin'),
              loading: Loading
            })}
          />
          <Route
            path="/operationGuide"
            component={Loadable({
              loader: () => import('./pages/OperationGuide'),
              loading: Loading
            })}
          />
          <Route
            path="/generalPolicy"
            component={Loadable({
              loader: () => import('./pages/GeneralPolicy'),
              loading: Loading
            })}
          />
          <Route
            path="/policy"
            component={Loadable({
              loader: () => import('./pages/Policy'),
              loading: Loading
            })}
          />
          <Route
            path="/"
            exact
            component={Loadable({
              loader: () => import('./pages/Home'),
              loading: Loading
            })}
          />
          <Route component={Page404} />
        </Switch>
      </Router>
    </App>
  </Provider>,
  document.getElementById('app')
)
