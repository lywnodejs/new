import React from 'react';

import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
const { ConnectedRouter } = routerRedux;

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/setup';

import AntdLocaleProvider from '@routes/AntdLocaleProvider';

import { PREFIX, MAIN, MANAGE, BUSINESSMANAGE, MOB } from './config';
import uaParser from '@utils/uaParser.js';

import Loading from './Loading';
import BusinessManageLayout from '@views/Layout/BusinessManageLayout';
import MobLayout from '@views/Layout/MobLayout';
// import UserLayout from '@views/Layout/UserLayout';
import AccountCopy from '@views/manage/Account/Copy';
import Welcome from '@views/Welcome';
// import HelpAppEn from '@views/Help/App_en';
// import HelpAppCn from '@views/Help/App_cn';
// import HelpAdEn from '@views/Help/Ad_en';
// import HelpAdCn from '@views/Help/Ad_cn';

function RouterConfig({ history, app }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AntdLocaleProvider>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path={MAIN}
              strict
              component={dynamic({
                app,
                component: () => import('@views/Layout/MainLayout'),
                LoadingComponent: uaParser.isMobile() ? null : Loading
              })}
            />
            <Redirect from={PREFIX} exact to={MAIN} />
            <Route
              path={`${MANAGE}/user/copy`}
              strict
              component={AccountCopy}
            />
            <Route
              path={MANAGE}
              strict
              component={dynamic({
                app,
                component: () => import('@views/Layout/ManageLayout'),
                LoadingComponent: uaParser.isMobile() ? null : Loading
              })}
            />
            <Route
              path={BUSINESSMANAGE}
              strict
              component={BusinessManageLayout}
            />
            <Route path={MOB} component={MobLayout} />
            {/* <Route path={`${PREFIX}/user`} component={UserLayout} /> */}
            {/* <Route path={`${PREFIX}/help/app_en`}  component={HelpAppEn} />
            <Route path={`${PREFIX}/help/app_cn`}  component={HelpAppCn} />
            <Route path={`${PREFIX}/help/ad_en`}  component={HelpAdEn} />
            <Route path={`${PREFIX}/help/ad_cn`}  component={HelpAdCn} /> */}
            <Route component={Welcome} />
          </Switch>
        </ConnectedRouter>
      </AntdLocaleProvider>
    </I18nextProvider>
  );
}

export default RouterConfig;
