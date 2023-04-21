import React, { Component } from 'react';

import {
  Button, Form, Input, Card, Modal,
  Select, Checkbox, Table, Popover,
  Col, Row,
  message, Switch
} from 'antd';
import connect from '@utils/translateConnect';
import BusinessModal from '../../../components/BusinessModal';

import './index.less';
import _ from 'lodash';

import getFormFields from '../Admin/getFormFields';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class ManageApp extends Component {
  state = {
    id: '',
    name: '',
    businessModalVisible: false,
    editingApp: '',
    business: [],
    formModalVisible: false,
    formType: '',
    showData: [],
    currentPage: 1,
  };

  getColumns = () => {
    const {
      t
    } = this.props;

    const columns = [{
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      width: 60
    }, {
      title: t('子系统名称'),
      dataIndex: 'name',
      key: 'name',
      width: 200
    }, {
      title: t('回跳地址'),
      dataIndex: 'homePage',
      key: 'homePage'
    }];

    return columns.concat({
      title: t('操作'),
      key: 'action',
      width: 300,
      render: (text, record) => {
        const {
          status
        } = record;
        const btnText = status === 0 ? t('启用') : t('停用');

        return (
          <span>
            <Button
              type="danger"
              size="small"
              className="btn delete-btn"
              onClick={() => this.confirmDelete(record.id)}
            >
              {t('删除')}
            </Button>

            <Button
              size="small"
              className="btn stop-btn"
              onClick={() => this.confirmToggleStatus(record)}
            >
              {btnText}
            </Button>

            <Button
              size="small"
              className="btn edit-btn"
              onClick={() => this.handleEditApp(record)}
              style={{ display: status === 0 ? 'none' : '' }}
            >
              {t('编辑')}
            </Button>

            <Button
              size="small"
              className="btn copy-btn"
              onClick={() => this.handleEditBusiness(record)}
              style={{ display: status === 0 ? 'none' : '' }}
            >
              {t('业务线')}
            </Button>
          </span>
        );
      },
    });
  };

  handleEditBusiness = (record) => {
    this.props.getBindBusiness(record.id).then(() => {
      this.setState({
        editingApp: record.id,
        businessModalVisible: true,
        business: this.props.business
      });
    });
  };

  handleBindBussiness = () => {
    const { editingApp, business } = this.state;
    const { t, updateBusiness, fetchAvailableApps } = this.props;
    updateBusiness(editingApp, business).then(() => {
      message.info(t('绑定业务线成功！'));
      this.handleBindBussinessCancel();
      this.handleFetch(this.props.searches.current);
      // fetchAvailableApps().then(() => {
      //   this.handleFetch(this.state.currentPage);
      // });
    });
  };

  handleBindBussinessCancel = () => {
    this.setState({
      businessModalVisible: false,
      editingApp: '',
      business: []
    });
  };

  onBusinessChange = (business) => {
    this.setState({
      business
    });
  };

  confirmToggleStatus = (record) => {
    const { status, id } = record;
    const { enableApp, disableApp, appId, t, fetchAvailableApps } = this.props;

    confirm({
      title: t('确定此操作'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        if (status === 1) {
          disableApp(appId, id).then(() => {
            message.success(t('停用成功'));
            this.handleFetch(this.props.searches.current);
            // fetchAvailableApps().then(() => {
            //   this.handleFetch(this.state.currentPage);
            // });
          });
        } else {
          enableApp(appId, id).then(() => {
            message.success(t('启用成功'));
            this.handleFetch(this.props.searches.current);
            // fetchAvailableApps().then(() => {
            //   this.handleFetch(this.state.currentPage);
            // });
          });
        }
      }
    });
  };

  confirmDelete = (id) => {
    const { deleteApp, appId, t, fetchAvailableApps } = this.props;

    confirm({
      title: t('确定此操作'),
      content: '',
      okText: t('确定'),
      okType: 'danger',
      cancelText: t('取消'),
      onOk: () => {
        deleteApp(appId, id).then(() => {
          message.success(t('删除成功'));
          this.handleFetch(this.props.searches.current);
          // fetchAvailableApps().then(() => {
          //   this.handleFetch(this.state.currentPage);
          // });
        });
      }
    });
  };

  // 不显示全部了，改成显示管理员可管理app
  handleFetch = (page) => {
    const { appId, fetchApps } = this.props;
    const { id, name } = this.state;

    fetchApps({
      id,
      name,
      appId,
      page
    });
  };
  // handleFetch = (page) => {
  //   const { availableApps } = this.props;
  //   const { id, name } = this.state;

  //   this.setState({
  //     currentPage: page,
  //     showData: availableApps.filter((item) => {
  //       return (id?item.id==id:true) && (name?item.name.indexOf(name)>-1:true)
  //     })
  //   })
  // };

  handleSearchEnter = (e) => {
    if (e.keyCode == '13') {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      this.handleFetch(1);
    }
  }

  componentDidMount () {
    this.props.getDepartmentLevelOneList();
    this.props.getSyetemEnv();

    if (this.props.appId) {
      this.handleFetch(1);
      // this.props.fetchApps({
      //   appId: this.props.appId
      // })
    }
  }

  componentDidUpdate (prvProps) {
    if (_.isUndefined(prvProps.appId) && !_.isUndefined(this.props.appId)) {
      this.handleFetch(1);
    }
  }

  handlePageChange = (page) => {
    this.handleFetch(page);
    // this.setState({
    //   currentPage: page
    // })
  };

  handleSearchFieldChange = (event, field) => {
    this.setState({
      [field]: event.target.value
    });
  };

  openFormModal = (formType) => {
    this.setState({
      formModalVisible: true,
      formType
    });

    return Promise.resolve();
  };

  onFormModalOk = () => {
    const { form, addApp, t, appId, updateApp, fetchAvailableApps } = this.props;
    // let validateList = Object.keys(form.getFieldsValue());
    let validateList = null;
    if (form.getFieldsValue(['openApply']).openApply) {
      validateList = ['name', 'appKey', 'homePage', 'domain', 'icon', 'loginType', 'appLevel', 'deptId', 'appDefinedEnv', 'openDefault', 'openApply', 'permissionConsultant', 'consultGroup'];
    } else {
      validateList = ['name', 'appKey', 'homePage', 'domain', 'icon', 'loginType', 'appLevel', 'deptId', 'appDefinedEnv', 'openDefault', 'openApply'];
    }
    form.validateFields(validateList, (err, fieldsValue) => {
      if (err) {
        return;
      }
      const {
        id, name, appKey,
        domain, homePage,
        icon, loginType, appLevel,
        openApply, deptId, appDefinedEnv,
        openDefault, permissionConsultant, consultGroup
      } = fieldsValue;

      const { formType, managingApp } = this.state;
      if (formType === 'adding') {
        addApp({
          id, name, appKey,
          domain, homePage,
          icon, loginType, appLevel,
          deptId,
          appDefinedEnv,
          // openApply: Number(openApply),
          // openDefault: Number(openDefault),
          openApply: openApply ? 1 : 2,
          openDefault: openDefault ? 1 : 2,
          appId, consultGroup,
          permissionConsultant
        }).then(() => {
          message.info(t('新增成功！'));
          this.handleFetch(1);
          // fetchAvailableApps().then(() => {
          //   this.handleFetch(this.state.currentPage);
          // });
          this.onFormModalCancel();
        });
      } else if (formType === 'editing') {
        updateApp({
          name, appKey,
          domain, homePage,
          icon, loginType, appLevel,
          deptId,
          appDefinedEnv,
          // openApply: Number(openApply),
          // openDefault: Number(openDefault),
          openApply: openApply ? 1 : 2,
          openDefault: openDefault ? 1 : 2,
          appId,
          id: managingApp,
          consultGroup,
          permissionConsultant
        }).then(() => {
          message.info(t('更新成功！'));
          this.handleFetch(this.props.searches.current);
          // fetchAvailableApps().then(() => {
          //   this.handleFetch(this.state.currentPage);
          // });
          this.onFormModalCancel();
        });
      }
    });
  };

  onFormModalCancel = () => {
    this.setState({
      formModalVisible: false,
      formType: '',
      managingApp: ''
    });
    this.props.form.resetFields();
  };

  handleEditApp = (record) => {
    this.setState({
      managingApp: record.id,
    });

    this.openFormModal('editing').then(() => {
      const {
        id,
        name, appKey,
        domain, homePage,
        icon, loginType, appLevel,
        openApply, deptId, appDefinedEnv,
        openDefault, permissionConsultant, consultGroup
      } = record;
      this.props.form.setFieldsValue({
        id,
        name, appKey,
        domain, homePage,
        icon, loginType, appLevel, appDefinedEnv,
        deptId: deptId == 0 ? null : deptId,
        openApply: openApply === 1,
        openDefault: openDefault === 1,
        permissionConsultant, consultGroup
      });
    });
  };

  render () {
    const { t, form, appList, searches, allBusiness, departmentLevelOneList, systemEnv } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { id, name, businessModalVisible, business, formModalVisible, formType, currentPage, showData } = this.state;

    const { current, total, size } = searches;
    // const pageSize = 20;

    return (
      <div className="manage-app-page">
        <Card title={t('APP管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label='ID'>
                <Input
                  className="search-input"
                  placeholder={t('请输入APPID值进行搜索')}
                  value={id}
                  onChange={(e) => this.handleSearchFieldChange(e, 'id')}
                  onKeyDown={this.handleSearchEnter}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('目标系统')}>
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  value={name}
                  className="search-input"
                  onChange={(e) => this.handleSearchFieldChange(e, 'name')}
                  onKeyDown={this.handleSearchEnter}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handleFetch(1)}>
                  {t('查询')}
                </Button>
                <Button
                  className="btn"
                  onClick={() => this.openFormModal('adding')}>
                  {t('新增')}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card title={t('APP列表')} bordered={false} className="app-list">
          <Table
            rowKey="id"
            className="app-list-table"
            columns={this.getColumns()}
            // dataSource={showData}
            dataSource={appList}
            size="small"
            pagination={{
              current: current,
              pageSize: size,
              hideOnSinglePage: true,
              total: total,
              onChange: this.handlePageChange
            }}
          />
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
          width="65%"
          title={formType == 'adding' ? t('新增业务线') : t('编辑业务线')}
          visible={formModalVisible}
          onOk={this.onFormModalOk}
          onCancel={this.onFormModalCancel}
        >
          <Form>
            {getFormFields(getFieldDecorator, t, departmentLevelOneList, systemEnv, getFieldsValue)}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({ manageApp, global }) => {
  return {
    appList: manageApp.list,
    searches: manageApp.searches,
    appId: global.managingApp,
    allBusiness: global.allBusiness,
    business: manageApp.business,
    availableApps: global.availableApps,
    departmentLevelOneList: global.departmentLevelOneList,
    systemEnv: global.systemEnv
  };
}, (dispatch) => ({

  fetchApps (searches) {
    dispatch({
      type: 'manageApp/fetchApps',
      // type: 'admin/get/appList',
      payload: searches
    });
  },
  fetchAvailableApps () {
    return dispatch({
      type: 'global/fetchAvailableApps'
    });
  },
  enableApp (appId, id) {
    return dispatch({
      type: 'manageApp/enableApp',
      payload: {
        appId,
        id
      }
    });
  },
  disableApp (appId, id) {
    return dispatch({
      type: 'manageApp/disableApp',
      payload: {
        appId,
        id
      }
    });
  },
  getBindBusiness (appId) {
    return dispatch({
      type: 'manageApp/getBusiness',
      payload: {
        appId
      }
    });
  },
  updateBusiness (appId, business) {
    return dispatch({
      type: 'manageApp/updateBusiness',
      payload: {
        appId,
        business
      }
    });
  },
  addApp (appData) {
    return dispatch({
      type: 'manageApp/addApp',
      payload: appData
    });
  },
  updateApp (appData) {
    return dispatch({
      type: 'admin/updateDetail',
      payload: appData
    });
  },
  deleteApp (appId, id) {
    return dispatch({
      type: 'manageApp/deleteApp',
      payload: {
        appId,
        id
      }
    });
  },
  getDepartmentLevelOneList () {
    return dispatch({
      type: 'global/getDepartmentLevelOneList'
    });
  },
  getSyetemEnv () {
    return dispatch({
      type: 'global/getSyetemEnv'
    });
  }
}))(Form.create()(ManageApp));
