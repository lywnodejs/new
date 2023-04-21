import React from 'react';
import { connect } from 'dva';

import Logo from '../Logo';
import Header from '../Header';
import BusinessManageMenu from '../Menus/BusinessManageMenu';
import { Switch, Route, Redirect } from 'dva/router';

import Blank from '../../manage/Blank';
import Role from '../../businessManage/role';
import User from '../../businessManage/user';
import Permission from '../../businessManage/permission';
import Page40x from '../../ErrorPage/Page40x';

import FeedbackWidget from '@components/FeedbackWidget';
import './index.less';

class MainLayout extends React.Component {
  componentDidMount() {
    this.props.fetchMenus();
  }

  render() {
    let { match, t } = this.props;

    return (
      <div className="upm-main-layout">
        <Header
          currentPage={'businessManage'}
          t={t}
          needDefaultValue
          needFootprint
          isGlobalAppId
        />
        {/* <div className="upm-layout-sider" >
          <Logo />
          <BusinessManageMenu prefix={match.path} />
        </div> */}
        <div className="upm-main-layout__container">
          {/* <Header needDefaultValue needFootprint isGlobalAppId /> */}
          <BusinessManageMenu prefix={match.path} />
          <div className="upm-main-layout__container__content">
            <Switch>
              {/* 用户申请的首页 */}
              <Route path={`${match.url}`} exact strict component={Blank} />
              {/* <Route path={`${match.url}`} exact strict component={Entrance} /> */}
              {/* 修正 url 末尾带/的问题 */}
              <Redirect
                from={`${match.url}/`}
                exact
                strict
                to={`${match.url}`}
              />
              <Route path={`${match.url}/role`} exact component={Role} />
              <Route path={`${match.url}/user`} exact component={User} />
              <Route
                path={`${match.url}/permission`}
                exact
                component={Permission}
              />

              {/* 无权限 等 页面 */}
              <Route component={Page40x} />
            </Switch>
          </div>
        </div>
        <FeedbackWidget />
      </div>
    );
  }
}

export default connect(
  ({ menus, global }) => {
    return { menus, global };
  },
  dispatch => ({
    fetchMenus() {
      dispatch({
        type: 'menus/fetchMyMenus',
        loading: true
      });
    }
  })
)(MainLayout);
