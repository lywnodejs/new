import React from 'react';
import { connect } from 'dva';
import { translate } from 'react-i18next';

import Header from '../Header';
import MainMenu from '../Menus/MainMenu';
import { Switch, Route, Redirect } from 'dva/router';

import Entrance from '../../Entrance';
// import NewApply from '../../main/NewApply';

import ApplyNew from '../../main/ApplyNew';
import FastApply from '../../main/FastApply';
import PackageApply from '../../main/PackageApply';
import PermissionConfirm from '../../main/PermissionConfirm';

import EditStrategy from '../../main/EditStrategy';
import ApplyDetail from '../../main/ApplyDetail';
import ApproveDetail from '../../main/ApproveDetail';
import ApproveList from '../../main/ApproveList';
import Page40x from '../../ErrorPage/Page40x';
import ApplyList from '../../main/ApplyList';
// import PermissionValid from '../../main/PermissionList/validBackup';
import PermissionValid from '../../main/PermissionList/valid';
import PermissionExpiring from '../../main/PermissionList/expiring';
import PermissionExpired from '../../main/PermissionList/expired';
import Changelog from '../../main/Changelog';
import Tools from '../../main/Tools';
import ApplyAreaPermission from '../../main/ApplyAreaPermission';
import MemberList from '../../main/MemberList';
import ReviewList from '../../main/ReviewList';
import ReviewDetail from '../../main/ReviewList/Detail';
import MyApproveList from '../../main/MyApproveList';
import MyApproveDetail from '../../main/MyApproveList/Detail';

// import Carousel from '@components/Carousel';
import FeedbackWidget from '@components/FeedbackWidget';
import ApplyFeedbackWidget from '@components/ApplyFeedbackWidget';

import './index.less';

class MainLayout extends React.Component {
  // handleBannerRedirect = url => {
  //   window.open(url);
  // };

  componentDidMount() {
    this.props.fetchMenus();
  }

  render() {
    let { match, t } = this.props;

    return (
      <div className="upm-main-layout">
        <Header
          currentPage={'main'}
          t={t}
          needDefaultValue
          needFootprint
          isGlobalAppId
        />
        {/* <div className="upm-layout-sider" >
          <Logo />
          <MainMenu prefix={match.path} />

        </div> */}
        {/* {location.pathname === match.url ? <Carousel autoplay>
          <img src={require('@assets/banner.png')}></img>
          <img className="upm-main-layout__banner" src={require('@assets/banner2.jpg')} onClick={() => { this.handleBannerRedirect('http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=246291682'); }}></img>
        </Carousel>
          : null} */}
        <div className="upm-main-layout__container">
          {/* <Header t={t} needDefaultValue needFootprint isGlobalAppId /> */}
          <MainMenu prefix={match.path} />
          <div className="upm-main-layout__container__content">
            {/* 为实现菜单选中状态保持，对路由进行了调整 */}
            {/* 但同时需保证原地址可用，对路由进行了映射 */}
            {/* 邮件等地方还在向用户推送原地址 */}
            <Switch>
              {/* 用户端首页 */}
              <Route path={`${match.url}`} exact strict component={Entrance} />
              {/* 修正 url 末尾带/的问题 */}
              <Redirect
                from={`${match.url}/`}
                exact
                strict
                to={`${match.url}`}
              />

              {/* <Route path={`${match.url}/new-apply`} exact component={NewApply} /> */}
              {/* 从大数据平台跳转 */}
              {/* <Route path={`${match.url}/new-apply/:resourceType/:appId/:resourceKey`} component={NewApply} /> */}
              {/* <Route path={`${match.url}/new-apply/:resourceType/:resourceKey`} component={NewApply} /> */}
              {/* <Route path={`${match.url}/new-apply/:appId`} component={NewApply} /> */}

              {/* 新版权限申请 */}
              <Route
                path={`${match.url}/newapply`}
                exact
                component={ApplyNew}
              />
              {/* 从大数据平台跳转 */}
              <Route
                path={`${match.url}/newapply/:resourceType/:appId/:resourceKey`}
                component={ApplyNew}
              />
              <Route
                path={`${match.url}/newapply/:appId/:resourceType`}
                component={ApplyNew}
              />
              <Route
                path={`${match.url}/newapply/:appId`}
                component={ApplyNew}
              />
              {/* 旧版权限申请 */}
              <Route
                path={`${match.url}/new-apply`}
                exact
                component={ApplyNew}
              />
              {/* 从大数据平台跳转 */}
              <Route
                path={`${match.url}/new-apply/:resourceType/:appId/:resourceKey`}
                component={ApplyNew}
              />
              <Route
                path={`${match.url}/new-apply/:appId/:resourceType`}
                component={ApplyNew}
              />
              <Route
                path={`${match.url}/new-apply/:appId`}
                component={ApplyNew}
              />
              {/* 申请礼包权限 */}
              <Route
                path={`${match.url}/packageapply`}
                exact
                component={PackageApply}
              />
              {/* 我的申请 */}
              <Route path={`${match.url}/apply`} exact component={ApplyList} />
              <Route
                path={`${match.url}/apply/apply-detail/:applyId`}
                exact
                component={ApplyDetail}
              />
              <Redirect
                from={`${match.url}/apply-detail/:applyId`}
                exact
                strict
                to={`${match.url}/apply/apply-detail/:applyId`}
              />
              {/* 我的审批 */}
              <Route
                path={`${match.url}/approve`}
                exact
                component={ApproveList}
              />
              <Route
                path={`${match.url}/approve/approve-detail/:approveId`}
                exact
                component={ApproveDetail}
              />
              <Redirect
                from={`${match.url}/approve-detail/:approveId`}
                exact
                strict
                to={`${match.url}/approve/approve-detail/:approveId`}
              />
              {/* 我的权限 */}
              <Route
                path={`${match.url}/permission/valid`}
                exact
                component={PermissionValid}
              />
              <Redirect
                from={`${match.url}/permission-valid`}
                exact
                strict
                to={`${match.url}/permission/valid`}
              />
              <Route
                path={`${match.url}/permission/expiring`}
                exact
                component={PermissionExpiring}
              />
              <Redirect
                from={`${match.url}/permission-expiring`}
                exact
                strict
                to={`${match.url}/permission/expiring`}
              />
              <Route
                path={`${match.url}/permission/expired`}
                exact
                component={PermissionExpired}
              />
              <Redirect
                from={`${match.url}/permission-expired`}
                exact
                strict
                to={`${match.url}/permission/expired`}
              />
              {/* 我的团队权限 */}
              <Route
                path={`${match.url}/member/:username`}
                exact
                component={MemberList}
              />
              {/* 权限最小化审核 */}
              <Route
                path={`${match.url}/mini_approve/approve_my`}
                exact
                component={MyApproveList}
              />
              <Redirect
                from={`${match.url}/approve_my`}
                exact
                strict
                to={`${match.url}/mini_approve/approve_my`}
              />
              <Route
                path={`${match.url}/mini_approve/approve_my/approve-my-detail/:reviewId`}
                exact
                component={MyApproveDetail}
              />
              <Redirect
                from={`${match.url}/approve-my-detail/:reviewId`}
                exact
                strict
                to={`${match.url}/mini_approve/approve_my/approve-my-detail/:reviewId`}
              />
              <Route
                path={`${match.url}/mini_approve/review/:reviewId?`}
                exact
                component={ReviewList}
              />
              <Redirect
                from={`${match.url}/review/:reviewId?`}
                exact
                strict
                to={`${match.url}/mini_approve/review/:reviewId?`}
              />
              <Route
                path={`${match.url}/mini_approve/review/review-detail/:reviewId`}
                exact
                component={ReviewDetail}
              />
              <Redirect
                from={`${match.url}/review-detail/:reviewId`}
                exact
                strict
                to={`${match.url}/mini_approve/review/review-detail/:reviewId`}
              />
              {/* 转岗人员权限审核 */}
              <Route
                path={`${match.url}/permission_confirm`}
                exact
                component={PermissionConfirm}
              />
              {/* 变更日志 */}
              <Route
                path={`${match.url}/changelog`}
                exact
                component={Changelog}
              />
              {/* 小工具 */}
              <Route path={`${match.url}/tools/role`} exact component={Tools} />
              <Redirect
                from={`${match.url}/tools`}
                exact
                strict
                to={`${match.url}/tools/role`}
              />
              {/* 幽灵页面，部分用户还在使用 */}
              <Route
                path={`${match.url}/fastapply`}
                exact
                component={FastApply}
              />
              <Route
                path={`${match.url}/edit-strategy/:roleId/:strategyId`}
                component={EditStrategy}
              />
              <Route
                path={`${match.url}/apply-area-permission/:appId`}
                exact
                component={ApplyAreaPermission}
              />
              {/* 无权限 等 页面 */}
              <Route component={Page40x} />
            </Switch>
          </div>
        </div>
        <FeedbackWidget prefix={match.path} />
        <ApplyFeedbackWidget />
      </div>
    );
  }
}

export default translate()(
  connect(
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
  )(MainLayout)
);
