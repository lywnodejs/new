import React, { Component } from 'react';

import { Button, Form, Input, Card, Modal, Table, message, Switch } from 'antd';
import connect from '@utils/translateConnect';

import AvailableApps from '../../../components/AvailableApps/index';
import BusinessModal from '../../../components/BusinessModal';
import SystemInformation from '@/components/SystemInformation';

import './index.less';
import getFormFields from './getFormFields';
import { isChengxin, isQa } from '@config/env';

const getColumns = t => [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: t('账号'),
    dataIndex: 'username'
  },
  {
    title: t('姓名'),
    dataIndex: 'usernameZh'
  }
];

const FormItem = Form.Item;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const SUB_ADMINS = 'sub_admins';

class ManageAdmin extends Component {
  state = {
    businessModalVisible: false,
    adminListModalVisible: false,
    business: this.props.business,
    selectedAdmins: [],
    roleName: '',
    adminNames: '',
    visibleSystem: this.props.iShowSystemModal,
    isAdmin: 0, // 是否负责权限管理
    isOpenSwitch: this.props.adminList,
    isLoadingBindBtn: false, // 绑定用户按钮是否加载
    isShowBindBtn: false
  };

  componentDidMount() {
    const { appId, fetchAppDetail } = this.props;

    this.props.getDepartmentLevelOneList();
    this.props.getSyetemEnv();
    this.props.isShowSystemInfoConfig();
    this.props.fetchAvailableApps();

    if (appId) {
      fetchAppDetail(appId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      appId,
      fetchAppDetail,
      appDetail,
      form,
      business,
      adminList
    } = this.props;

    if (appId !== nextProps.appId) {
      fetchAppDetail(nextProps.appId);
    }

    if (appDetail !== nextProps.appDetail) {
      const {
        id,
        name,
        appKey,
        domain,
        homePage,
        icon,
        loginType,
        openApply,
        appLevel,
        openDefault,
        deptId,
        appDefinedEnv,
        permissionConsultant,
        consultGroup
      } = nextProps.appDetail;

      form.setFieldsValue({
        id,
        name,
        appKey,
        domain,
        homePage,
        icon,
        loginType,
        appLevel,
        appDefinedEnv,
        deptId: deptId == 0 ? null : deptId,
        openApply: openApply === 1,
        openDefault: openDefault === 1,
        permissionConsultant,
        consultGroup
      });
    }

    if (business !== nextProps.business) {
      this.setState({
        business: nextProps.business
      });
    }

    if (adminList !== nextProps.adminList) {
      this.setState({
        isOpenSwitch: nextProps.adminList
      });
    }
  }

  handleUpdateSubmit = () => {
    const { form, updateApp, appId, t } = this.props;
    let validateList = null;
    if (form.getFieldsValue(['openApply']).openApply) {
      validateList = [
        'name',
        'appKey',
        'homePage',
        'domain',
        'icon',
        'loginType',
        'appLevel',
        'deptId',
        'appDefinedEnv',
        'openDefault',
        'openApply',
        'permissionConsultant',
        'consultGroup'
      ];
    } else {
      validateList = [
        'name',
        'appKey',
        'homePage',
        'domain',
        'icon',
        'loginType',
        'appLevel',
        'deptId',
        'appDefinedEnv',
        'openDefault',
        'openApply'
      ];
    }
    form.validateFields(validateList, (err, fieldsValue) => {
      if (err) {
        return;
      }

      const { openApply, openDefault, ...others } = fieldsValue;
      updateApp({
        appId,
        id: appId,
        openApply: openApply ? 1 : 2,
        openDefault: openDefault ? 1 : 2,
        ...others
      }).then(() => {
        message.info(t('修改成功'));
      });
    });
  };

  handleBindBusinessClick = () => {
    const { appId, fetchAppBusiness } = this.props;

    fetchAppBusiness(appId);

    this.setState({
      businessModalVisible: true
    });
  };

  handleBindBussiness = () => {
    const { business } = this.state;
    const { t, updateBusiness, appId } = this.props;

    updateBusiness(business, appId).then(() => {
      message.info(t('绑定成功'));
      this.handleBindBussinessCancel();
    });
  };

  handleBindBussinessCancel = () => {
    this.setState({
      businessModalVisible: false
    });
  };

  onBusinessChange = checkedValues => {
    this.setState({
      business: checkedValues
    });
  };

  handleBindAdminCancel = () => {
    this.setState({
      adminListModalVisible: false
    });
  };

  openAdminModal = roleName => {
    const { getAdmins, appId, isAllManager, userId } = this.props;

    getAdmins(appId, roleName).then(() => {
      if (roleName == 'app_administrator') {
        const { adminList } = this.props;

        this.setState({
          isOpenSwitch: adminList
        });
      }
    });
    isAllManager({
      appId,
      userId
    }).then(res => {
      this.setState({
        isShowBindBtn: res
      });
    });

    this.setState({
      adminListModalVisible: true,
      roleName
    });
  };

  onSelectAdminsChange = admins => {
    this.setState({
      selectedAdmins: admins
    });
  };

  handleUnbindAdmins = () => {
    const { selectedAdmins, roleName } = this.state;

    const { appId, unbindAdmins, unbindSubAdmins, t } = this.props;

    let unbindHandler;
    if (roleName === SUB_ADMINS) {
      unbindHandler = unbindSubAdmins({
        userIds: selectedAdmins,
        appId
      });
    } else {
      unbindHandler = unbindAdmins({
        userIds: selectedAdmins,
        appId,
        operateAppId: appId,
        roleName
      });
    }

    unbindHandler.then(() => {
      message.info(t('解绑成功'));
      this.onSelectAdminsChange([]);
    });
  };

  handleAdminNamesChange = event => {
    this.setState({
      adminNames: event.target.value
    });
  };

  handleBindAdmins = () => {
    this.setState({
      isLoadingBindBtn: true
    });
    const { adminNames, roleName, isAdmin } = this.state;

    const { appId, bindAdmins, bindSubAdmins, t } = this.props;

    let bindHandler;
    if (roleName === SUB_ADMINS) {
      bindHandler = bindSubAdmins({
        userNames: adminNames,
        appId
      });
    } else if (roleName === 'app_administrator') {
      bindHandler = bindAdmins({
        userNames: adminNames,
        appId,
        operateAppId: appId,
        roleName,
        isAdmin
      });
    } else {
      bindHandler = bindAdmins({
        userNames: adminNames,
        appId,
        operateAppId: appId,
        roleName
      });
    }

    bindHandler
      .then(() => {
        message.info(t('绑定成功'));
        this.setState({
          adminNames: '',
          isLoadingBindBtn: false
        });
      })
      .catch(() => {
        this.setState({
          isLoadingBindBtn: false
        });
      });
  };

  handleChangeSwitch = value => {
    this.setState({
      isAdmin: value ? 1 : 0
    });
  };

  handleChangeSwitchTab = (value, text, record, index) => {
    let { isOpenSwitch } = this.state;
    isOpenSwitch[index].isAdmin = value ? 1 : 0;
    this.setState({
      isOpenSwitch
    });

    let params = [];
    params.push({
      userName: record.username,
      appId: this.props.appId,
      operateAppId: this.props.appId,
      roleName: 'app_administrator',
      isAdmin: value ? 1 : 0
    });
    this.props.updateAdminSwitch(params).then(() => {
      message.success('修改成功');
    });
  };

  getChildAppColumns = () => {
    const { isOpenSwitch } = this.state;
    const { t } = this.props;
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: t('账号'),
        dataIndex: 'username'
      },
      {
        title: t('姓名'),
        dataIndex: 'usernameZh'
      },
      {
        title: t('是否负责权限管理'),
        dataIndex: 'isAdmin',
        render: (text, record, index) => {
          return (
            <Switch
              key={'switch' + record.id}
              checked={
                isOpenSwitch[index] && isOpenSwitch[index].isAdmin == 1
                  ? true
                  : false
              }
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={value =>
                this.handleChangeSwitchTab(value, text, record, index)
              }
            />
          );
        }
      }
    ];
    return columns;
  };
  isShowBindButton = () => {
    const { t } = this.props;
    const { isShowBindBtn, roleName } = this.state;
    const button = (
      <Button
        type="primary"
        onClick={this.handleBindAdmins}
        // className="user-bind-btn"
        style={{ float: 'right' }}
        loading={this.state.isLoadingBindBtn}>
        {t('绑定用户')}
      </Button>
    );
    if (roleName === 'app_administrator') {
      if (isShowBindBtn) {
        return button;
      } else {
        // 对于子系统管理员弹窗-绑定用户功能。只对全局超管显示“绑定用户”button
        // 橙心优选需求，所有情况显示“绑定用户”button
        // 测试环境需求，所有情况显示“绑定用户”button
        return isChengxin || isQa ? button : null;
      }
    } else if (roleName === 'all_super_administrator') {
      if (isChengxin) {
        // 全局超级管理员弹窗，对于橙心环境，加入判断：全局超管则显示，不是则不显示
        if (isShowBindBtn) {
          return button;
        } else {
          return null;
        }
      } else {
        return button;
      }
    } else {
      return button;
    }
  };

  render() {
    const {
      t,
      form,
      allBusiness,
      adminList,
      departmentLevelOneList,
      systemEnv,
      iShowSystemModal
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const {
      businessModalVisible,
      business,
      adminListModalVisible,
      selectedAdmins,
      adminNames,
      roleName,
      isOpenSwitch,
      modalTableData,
      isShowBindBtn
    } = this.state;

    const rowSelection = {
      selectedRowKeys: selectedAdmins,
      onChange: this.onSelectAdminsChange
    };

    return (
      <div className="ManageAdmin-page">
        <div className="app-selector bottom-spacer">
          <label>{t('系统选择：')}</label>

          <AvailableApps hideClosed={true} style={{ width: 200 }} />
        </div>

        <Card title={t('系统详情')} className="bottom-spacer">
          <Form>
            <FormItem {...formItemLayout} label={t('ID')}>
              {getFieldDecorator('id')(<Input disabled />)}
            </FormItem>

            {getFormFields(
              getFieldDecorator,
              t,
              departmentLevelOneList,
              systemEnv,
              getFieldsValue
            )}

            <FormItem {...tailFormItemLayout}>
              <Button
                className="submit-app-btn"
                type="primary"
                onClick={this.handleUpdateSubmit}>
                {t('提交')}
              </Button>

              <Button onClick={this.handleBindBusinessClick}>
                {t('绑定业务线')}
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Card title={t('管理员管理')} className="bottom-spacer">
          <Button
            type="primary"
            className="admins-btn"
            onClick={() => this.openAdminModal('all_super_administrator')}>
            {t('全局超级管理员')}
          </Button>
          <Button
            type="primary"
            className="admins-btn"
            onClick={() => this.openAdminModal('system_administrator')}>
            {t('子系统超级管理员')}
          </Button>
          <Button
            type="primary"
            className="admins-btn"
            onClick={() => this.openAdminModal('app_administrator')}>
            {t('子系统管理员')}
          </Button>
          <Button
            type="primary"
            className="admins-btn"
            onClick={() => this.openAdminModal(SUB_ADMINS)}>
            {t('小权限管理员')}
          </Button>
          <Button
            type="primary"
            className="admins-btn"
            onClick={() => this.openAdminModal('bigdata_business_manager')}>
            {t('大数据业务线管理员')}
          </Button>
        </Card>

        <BusinessModal
          visible={businessModalVisible}
          value={business}
          allBusiness={allBusiness}
          onOk={this.handleBindBussiness}
          onCancel={this.handleBindBussinessCancel}
          onChange={this.onBusinessChange}
        />

        <Modal
          title={t('绑定用户')}
          width={700}
          visible={adminListModalVisible}
          footer={
            <Button type="danger" onClick={this.handleUnbindAdmins}>
              {t('解绑用户')}
            </Button>
          }
          bodyStyle={{
            maxHeight: 400,
            overflow: 'auto'
          }}
          onCancel={this.handleBindAdminCancel}>
          <div className="bind-user-area">
            <span>{t('用户名 ')}</span>

            <Input
              value={adminNames}
              className="user-name-input"
              placeholder={t('用户名，多用户以逗号间隔')}
              onChange={this.handleAdminNamesChange}
            />
            {roleName === 'app_administrator' ? (
              <span>
                <span>{t('是否负责权限管理 ')}</span>
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={value => this.handleChangeSwitch(value)}
                />
              </span>
            ) : null}
            {this.isShowBindButton()}
            {/* <Button
              type="primary"
              onClick={this.handleBindAdmins}
              // className="user-bind-btn"
              style={{ float: 'right' }}
              loading={this.state.isLoadingBindBtn}
            >
              {t('绑定用户')}
            </Button> */}
          </div>

          <Table
            size="small"
            rowSelection={rowSelection}
            columns={
              roleName === 'app_administrator'
                ? this.getChildAppColumns()
                : getColumns(t)
            }
            dataSource={_.unionBy(adminList, 'id')}
            rowKey="id"
            pagination={false}
          />
        </Modal>

        {iShowSystemModal && (
          <SystemInformation
            key="system"
            t={t}
            visibleSystem={this.state.visibleSystem}></SystemInformation>
        )}
      </div>
    );
  }
}

export default connect(
  ({ admin, global, manageApp, userInfo }) => {
    return {
      adminList: admin.list,
      appDetail: admin.detail,
      business: admin.business,
      allBusiness: global.allBusiness,
      appId: global.managingAvailableApp,
      departmentLevelOneList: global.departmentLevelOneList,
      systemEnv: global.systemEnv,
      iShowSystemModal: manageApp.iShowSystemModal,
      userId: userInfo.id
    };
  },
  dispatch => ({
    fetchAppDetail(appId) {
      dispatch({
        type: 'admin/getDetail',
        payload: {
          appId
        }
      });
    },
    updateApp(params) {
      return dispatch({
        type: 'admin/updateDetail',
        payload: params
      });
    },
    fetchAppBusiness(appId) {
      dispatch({
        type: 'admin/getBusiness',
        payload: {
          appId
        }
      });
    },
    updateBusiness(business, appId) {
      return dispatch({
        type: 'admin/updateBusiness',
        payload: {
          appId,
          business
        }
      });
    },
    getAdmins(appId, roleName) {
      if (roleName === SUB_ADMINS) {
        return dispatch({
          type: 'admin/getSubAdmins',
          payload: { appId }
        });
      }

      return dispatch({
        type: 'admin/getAdminUserList',
        payload: {
          appId,
          roleName
        }
      });
    },
    unbindAdmins(data) {
      return dispatch({
        type: 'admin/unbindAdmins',
        payload: data
      });
    },
    bindAdmins(data) {
      return dispatch({
        type: 'admin/bindAdmins',
        payload: data
      });
    },
    unbindSubAdmins(data) {
      return dispatch({
        type: 'admin/unbindSubAdmins',
        payload: data
      });
    },
    bindSubAdmins(data) {
      return dispatch({
        type: 'admin/bindSubAdmins',
        payload: data
      });
    },
    getDepartmentLevelOneList() {
      return dispatch({
        type: 'global/getDepartmentLevelOneList'
      });
    },
    getSyetemEnv() {
      return dispatch({
        type: 'global/getSyetemEnv'
      });
    },
    isShowSystemInfoConfig() {
      return dispatch({
        type: 'manageApp/isShowSystemInfoConfig'
      });
    },
    fetchAvailableApps() {
      return dispatch({
        type: 'manageApp/fetchAvailableApps'
      });
    },
    updateAdminSwitch(params) {
      return dispatch({
        type: 'manageApp/updateAdminSwitch',
        payload: params
      });
    },
    isAllManager(params) {
      return dispatch({
        type: 'area/getAppManager',
        payload: params
      });
    }
  })
)(Form.create()(ManageAdmin));
