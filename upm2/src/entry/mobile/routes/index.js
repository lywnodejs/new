/*
 * @Author: Unknown
 * @Date: Unknown
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-10-26 15:40:41
 */
import React from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
const { ConnectedRouter } = routerRedux;

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/setup';

import AntdLocaleProvider from '@routes/AntdLocaleProvider';
import Loading from './Loading';
import { PREFIX, MAIN } from './config';


function RouterConfig({ history, app }) {
  return (
    <I18nextProvider i18n={i18n} >
      <AntdLocaleProvider>
        <ConnectedRouter history={history}>
          <Switch>
            {/* <Route path={`${MAIN}/approve-detail/:approveId`} strict component={dynamic({
              app,
              component: () => import('../views/ApproveDetail')
            })} /> */}
            {/* <Route
              path={`${MAIN}/approve-detail/:approveId`}
              strict
              component={dynamic({
              app,
              component: () => import('../views/ApproveDetail')
            })} /> */}
            <Route path={MAIN} strict component={dynamic({
              app,
              component: () => import('@views/Layout/MobileLayout'),
              LoadingComponent: Loading
            })} />
            <Redirect from={PREFIX} exact to={MAIN} />
          </Switch>
        </ConnectedRouter>
      </AntdLocaleProvider>
    </I18nextProvider>
  );
}

export default RouterConfig;
