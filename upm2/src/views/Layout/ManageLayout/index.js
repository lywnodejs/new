import React from 'react';
import { connect } from 'dva';

import Logo from '../Logo';
import Header from '../Header';
import MainMenu from '../Menus/ManageMenu';
import { Switch, Route } from 'dva/router';

import Dashboard from '../../manage/Dashboard';
import RoleManage from '../../manage/Role/RoleManage';
import RoleGroupManage from '../../manage/Role/RoleGroupManage';
import RoleLabelManage from '../../manage/Role/RoleLabelManage';
import StrategyManage from '../../manage/Strategy/StrategyManage';
import StrategyEdit from '../../manage/Strategy/StrategyManage/Edit';
import StrategyTypeManage from '../../manage/Strategy/TypeManage';
import FeatureGroupManage from '../../manage/FeatureGroup';
import Account from '../../manage/Account';
import RoleEditor from '../../manage/Account/RoleEditor';
import Page40x from '../../ErrorPage/Page40x';
import ManageFlags from '../../manage/Flags';
import ManageFeature from '../../manage/Feature';
import ManageWorkflow from '../../manage/Workflow';
import ManageWorkflowOld from '../../manage/WorkflowOld';
import ManageDimension from '../../manage/Dimension';
import ManageArea from '../../manage/Area';
import ManageApprover from '../../manage/Approver';
import ManageAdmin from '../../manage/Admin';
import ManageTools from '../../manage/Tools';
import ApplyNotice from '../../manage/ApplyNotice'; // 申请说明配置
import EditApplyNotice from '../../manage/ApplyNotice/EditConfig'; // 新增、编辑申请说明
import PreviewNotice from '../../manage/ApplyNotice/PreviewConfig'; // 预览申请说明
import UserAuth from '../../manage/UserAuth'; // 用户权限查询
import AuditExport from '../../manage/Audit/Export';
import AuditApplyLog from '../../manage/Audit/ApplyLog';
import AuditAuditLog from '../../manage/Audit/AuditLog';
import ManageMonitor from '../../manage/Monitor';
import CityBlacklist from '../../manage/CityBlacklist';
import ManageDefaultAuth from '../../manage/DefaultAuth';
import ManageApp from '../../manage/App';
import ManagePermissionImport from '../../manage/PermissionImport'; //权限关系导出
import ManageBigDataAdmin from '../../manage/BigData/Admin';
import ManageBigDataUser from '../../manage/BigData/User';
import ManagePermissionGroup from '../../manage/PermissionGroup';
import ManagePermissionGroupUser from '../../manage/PermissionGroup/user.js';
import ManagePermissionGroupPoint from '../../manage/PermissionGroup/point.js';
import MonitorDataUser from '../../manage/MonitorData/User';
import MonitorDataUserCopy from '../../manage/MonitorData/User/Copy';
import MonitorPermissionGroup from '../../manage/MonitorPermissionGroup';
import MonitorPermissionGroupNew from '../../manage/MonitorPermissionGroup/New';
import MonitorPermissionGroupEdit from '../../manage/MonitorPermissionGroup/Edit';
import PackageCategoryList from '../../manage/Package/Category';
import PackageList from '../../manage/Package/List';
import PackageManager from '../../manage/Package/Manager';
import PackageNotice from '../../manage/Package/Notice';
import EditPackageNotice from '../../manage/Package/Notice/EditConfig'; // 新增、编辑申请说明
import PreviewPackageNotice from '../../manage/Package/Notice/PreviewConfig'; // 预览申请说明
import ManageReview from '../../manage/Review';
import ReviewHistory from '../../manage/ReviewHistory';
import ManageReviewDetail from '../../manage/Review/ReviewDetail';
import Changelog from '../../manage/Changelog';
import OpLog from '../../manage/OpLog';
import HomeBase from '../../manage/Home/Base';
import HomeOperation from '../../manage/Home/Operation';
import HomeFeedback from '../../manage/Home/Feedback';
import FeedbackWidget from '@components/FeedbackWidget';
import DataResource from '../../manage/DataResource';

class ManageLayout extends React.Component {

  componentDidMount () {
    this.props.fetchMenus();
  }

  getMenus = () => {
    // TODO 优化菜单逻辑
    return this.props.menus;
  }

  render () {
    let { match, menus } = this.props;

    return (
      <div className="upm-manage-layout">
        <Header currentPage={'manage'} >权限系统</Header>
        {/* <div className="upm-layout-sider">
          <Logo />
          <Menus prefix={`${match.url}`} menus={menus}/>
        </div> */}
        <div className="upm-manage-layout__container">
          {/* <Header>权限系统</Header> */}
          <MainMenu prefix={`${match.url}`} menus={menus} />
          <div className="upm-manage-layout__container__content">
            <Switch>
              <Route path={`${match.url}`} exact strict component={Dashboard} />
              <Route path={`${match.url}/`} exact strict component={Dashboard} />
              <Route path={`${match.url}/home/base`} exact strict component={HomeBase} />
              <Route path={`${match.url}/home/operation`} exact strict component={HomeOperation} />
              <Route path={`${match.url}/nps/getFeedBack`} exact strict component={HomeFeedback} />
              <Route path={`${match.url}/flag/list`} component={ManageFlags} />
              <Route path={`${match.url}/area/list`} component={ManageArea} />
              <Route path={`${match.url}/approver/list`} component={ManageApprover} />
              <Route
                path={`${match.url}/role/list`}
                exact
                component={RoleManage}
              />
              <Route
                path={`${match.url}/rolegroup/list`}
                exact
                component={RoleGroupManage}
              />
              <Route
                path={`${match.url}/rolelabel/list`}
                exact
                component={RoleLabelManage}
              />
              <Route
                path={`${match.url}/strategy/list`}
                exact
                component={StrategyManage}
              />
              <Route
                path={`${match.url}/strategy/create/:appId`}
                exact
                component={StrategyEdit}
              />
              <Route
                path={`${match.url}/strategy/update/:appId/:id`}
                exact
                component={StrategyEdit}
              />
              <Route
                path={`${match.url}/strategy/type/list`}
                exact
                component={StrategyTypeManage}
              />
              <Route
                path={`${match.url}/user/list`}
                exact
                component={Account}
              />
              <Route path={`${match.url}/user/role-edit/:appId/:userId/:username`} exact component={RoleEditor} />
              <Route
                path={`${match.url}/feature/list`}
                exact
                component={ManageFeature}
              />
              <Route
                path={`${match.url}/featuregroup/list`}
                exact
                component={FeatureGroupManage}
              />
              <Route
                path={`${match.url}/workflow/list`}
                exact
                component={ManageWorkflow}
              />
              <Route
                path={`${match.url}/workflow-old/list`}
                exact
                component={ManageWorkflowOld}
              />
              <Route
                path={`${match.url}/review/list`}
                exact
                component={ManageReview}
              />
              <Route
                path={`${match.url}/review/history`}
                exact
                component={ReviewHistory}
              />
              <Route
                path={`${match.url}/review/detail`}
                exact
                component={ManageReviewDetail}
              />
              <Route
                path={`${match.url}/strategy/dimension/list`}
                exact
                component={ManageDimension}
              />
              <Route
                path={`${match.url}/app/admin`}
                exact
                component={ManageAdmin}
              />
              <Route
                path={`${match.url}/app/tools`}
                exact
                component={ManageTools}
              />
              <Route
                path={`${match.url}/app/monitor`}
                exact
                component={ManageMonitor}
              />
              {/* 申请说明配置 */}
              <Route
                path={`${match.url}/app/notice`}
                exact
                component={ApplyNotice}
              />
              {/* 新建申请说明 */}
              <Route
                path={`${match.url}/app/new-notice`}
                exact
                component={EditApplyNotice}
              />
              {/* 编辑申请说明 */}
              <Route
                path={`${match.url}/app/edit-notice`}
                exact
                component={EditApplyNotice}
              />
              {/* 预览申请说明 */}
              <Route
                path={`${match.url}/app/preview-notice`}
                exact
                component={PreviewNotice}
              />
              {/* 用户权限查询 */}
              <Route
                path={`${match.url}/user-auth`}
                exact
                component={UserAuth}
              />
              <Route
                path={`${match.url}/audit/export`}
                exact
                component={AuditExport}
              />
              <Route
                path={`${match.url}/audit/applylog`}
                exact
                component={AuditApplyLog}
              />
              <Route
                path={`${match.url}/audit/auditlog`}
                exact
                component={AuditAuditLog}
              />
              <Route
                path={`${match.url}/city/blacklist`}
                exact
                component={CityBlacklist}
              />
              <Route
                path={`${match.url}/grant/list`}
                exact
                component={ManageDefaultAuth}
              />
              <Route
                path={`${match.url}/app/list`}
                exact
                component={ManageApp}
              />
              {/* 权限关系导出页面*/}
              <Route
                path={`${match.url}/app/export`}
                exact
                component={ManagePermissionImport}
              />

              {/* 大数据平台定制化页面 */}
              <Route
                path={`${match.url}/bigdata/admin`}
                exact
                component={ManageBigDataAdmin}
              />
              <Route
                path={`${match.url}/bigdata/user`}
                exact
                component={ManageBigDataUser}
              />
              {/* 权限组页面 */}
              <Route
                path={`${match.url}/permissionGroup/list`}
                exact
                component={ManagePermissionGroup}
              />
              <Route
                path={`${match.url}/permissionGroup/user`}
                exact
                component={ManagePermissionGroupUser}
              />
              <Route
                path={`${match.url}/permissionGroup/point`}
                exact
                component={ManagePermissionGroupPoint}
              />
              {/* 滴滴监控数据管理 */}
              {/* <Route
                path={`${match.url}/monitor/user`}
                exact
                component={MonitorDataUser}
              />
              <Route
                path={`${match.url}/monitor/user/copy/:username`}
                component={MonitorDataUserCopy}
              /> */}
              {/* 监控权限管理 */}
              <Route
                path={`${match.url}/package/category`}
                exact
                component={PackageCategoryList}
              />
              <Route
                path={`${match.url}/package/list`}
                exact
                component={PackageList}
              />
              <Route
                path={`${match.url}/package/manager`}
                exact
                component={PackageManager}
              />
              <Route
                path={`${match.url}/package/notice`}
                exact
                component={PackageNotice}
              />
              {/* 新建申请说明 */}
              <Route
                path={`${match.url}/package/notice/new-notice`}
                exact
                component={EditPackageNotice}
              />
              {/* 编辑申请说明 */}
              <Route
                path={`${match.url}/package/notice/edit-notice`}
                exact
                component={EditPackageNotice}
              />
              {/* 预览申请说明 */}
              <Route
                path={`${match.url}/package/notice/preview-notice`}
                exact
                component={PreviewPackageNotice}
              />
              <Route
                path={`${match.url}/monitorPermissionGroup`}
                exact
                component={MonitorPermissionGroup}
              />
              <Route
                path={`${match.url}/monitorPermissionGroup/new`}
                component={MonitorPermissionGroupNew}
              />
              <Route
                path={`${match.url}/monitorPermissionGroup/edit/:groupId`}
                component={MonitorPermissionGroupEdit}
              />
              <Route
                path={`${match.url}/changelog/list`}
                component={Changelog}
              />
              <Route
                path={`${match.url}/oplog/list`}
                component={OpLog}
              />
              <Route
                path={`${match.url}/dataRescource/list`}
                component={DataResource}
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

export default connect(({ menus }) => {
  return { menus };
}, (dispatch) => ({
  fetchMenus () {
    dispatch({
      type: 'menus/fetchMyMenus',
      loading: true,
    });
  }
}))(ManageLayout);
