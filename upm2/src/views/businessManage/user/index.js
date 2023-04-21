import React from 'react';
import connect from '@utils/translateConnect';
import { Breadcrumb, Card, Button, Form, Input, Table, Popover, Select } from 'antd';
import CardTitle from '@components/CardTitle';
import UserResourceBindModal from './userResourceBindModal';
import UserAreaBindModal from './userAreaBindModal';
import _ from 'lodash';
import { echoMessage } from '@utils/notice';
import {getUserBindResourceList, getBusinessResourceList, getBusisnessRoleList, getUserBindRoleList, getUserBindAreaList} from '../../../services/businessManage';


class UserSearch extends React.Component {
  render = () => {
    const {t, form, queryData, global, onChange, value} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Form.Item label={t('目标系统')}>
          <Select
            placeholder={t('请选择')}
            value={value}
            // value={this.state.appId}
            onChange={onChange}
            // onChange={(value) => this.setState({appId: value})}
            className='form-select'
            showSearch
            optionFilterProp="children"
            style={{minWidth: 200}}
          >
            {global.businessSystemList.map(item => <Select.Option key={item.appId} value={item.appId}>{item.appName}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label={t('用户名')}>
          {getFieldDecorator('username', {
            initialValue: ''
          })(<Input placeholder={t('支持模糊搜索用户名、邮箱')} style={{minWidth: 200}} />)}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon="search"
            onClick = {() => queryData()}
          >
            {t('搜索')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const UserSearchForm = connect()(Form.create({})(UserSearch));

class User extends React.Component {
  state = {
    selectedRows: [],
    currentUser: {},
    modal: {
      type: '',
      style: {},
      visible: false
    },
    // appId: ''
  };
  // init = () => {
  //   const { fetchBusinessLine } = this.props;
  //   this.fetchData();
  //   fetchBusinessLine(this.state.appId);
  // }

  // // componentDidUpdate = (prevProps) => {
  // //   if (global.globalAppId !== prevProps.global.globalAppId) {
  // //     this.init();
  // //   }
  // // }
  // componentDidUpdate = (prevProps) => {
  //   const { global } = this.props;
  //   if (global.businessSystemList != prevProps.global.businessSystemList) {
  //     this.setState({
  //       appId: global.businessSystemList[0].appId
  //     }, () => {
  //       this.init();
  //     })
  //   }
  // }
  componentDidMount() {
    if (this.props.global.appId) {
      this.fetchData();
      this.props.fetchBusinessLine(this.props.global.appId);
    }
  }

  componentWillReceiveProps(nextProps){
    // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
    if (nextProps.global.appId && nextProps.global.appId !== this.props.global.appId) {
      this.fetchData(1, nextProps.global.appId);
      this.props.fetchBusinessLine(nextProps.global.appId);
    }
  }
  
  // componentDidMount = () => {
  //   const { global, t } = this.props;
  //   if (global.globalAppId) {
  //     this.init();
  //   } else {
  //     echoMessage(t('您必须先选择系统！'), 'error');
  //   }
  // }

  fetchData = (page, appId) => {
    const {fetchData, list: {current}, fetchBusinessLine} = this.props;
    const {username} = this.formInstance.props.form.getFieldsValue();
    fetchBusinessLine(this.props.global.appId);
    fetchData({
      username,
      page: page || current,
      appId: appId || this.props.global.appId,
    });
  }
  /**
   * 动态创建模态框
   */
  createModal = () => {
    const ModalMap = {
      'bindArea': this.getBindAreaModal(),
      'unbindArea': this.getUnBindAreaModal(),
      'bindRole': this.getBindRoleModal(),
      'unbindRole': this.getUnBindRoleModal(),
      'bindReport': this.getBindReportModal(),
      'unbindReport': this.getUnBindReportModal(),
      'bindTemplate': this.getBindTemplateModal(),
      'unbindTemplate': this.getUnBindTemplateModal(),
      'bindMetric': this.getBindMetricModal(),
      'unbindMetric': this.getUnBindMetricModal()
    };
    return ModalMap[this.state.modal.type];
  }

  /**
   * 打开模态框
   */
  openModal = (type) => {
    this.setState({
      modal: {
        ...this.state.modal,
        type,
        visible: true
      }
    });
  }

  getBusinessIdSelect = () => {
    const {businessId = ''} = this.state.currentUser;
    const {businessLine} = this.props;
    return (
      <Select
        allowClear
        showSearch
        optionFilterProp="children"
        style={{ width: 100 }}
      >
        {businessLine.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
      </Select>
    );
  }

  getBindAreaModal() {
    const {t, dispatch} = this.props;
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userBindResource',
        payload: {
          ...query,
          permissionType: 1
        }
      });
    }
    return (
      <UserAreaBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('地区')} operateName={t('绑定')} operateHandle={operateHandle} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
    );
  }

  getUnBindAreaModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getUserBindAreaList({
        ...query
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userUnBindResource',
        payload: {
          ...query,
          permissionType: 1
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('地区ID'), key: 'permissionId'},
      {label: t('地区名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('地区ID'), dataIndex: 'id',key: 'resourceKey'},
      {title: t('地区名'), dataIndex: 'name',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} showTagName={item => item.name} resourceName={t('地区')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>;
  }

  getBindReportModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getBusinessResourceList({
        ...query,
        permissionType: 3
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userBindResource',
        payload: {
          ...query,
          permissionType: 3
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('报表ID'), key: 'permissionId'},
      {label: t('报表名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('报表ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('报表名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('报表')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindReportModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getUserBindResourceList({
        ...query,
        permissionType: 3
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userUnBindResource',
        payload: {
          ...query,
          permissionType: 3
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('报表ID'), key: 'permissionId'},
      {label: t('报表名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('报表ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('报表名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('报表')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>;
  }

  getBindTemplateModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getBusinessResourceList({
        ...query,
        permissionType: 4
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userBindResource',
        payload: {
          ...query,
          permissionType: 4
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('模板ID'), key: 'permissionId'},
      {label: t('模板名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('模板ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('模板名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('模板')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindTemplateModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getUserBindResourceList({
        ...query,
        permissionType: 4
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userUnBindResource',
        payload: {
          ...query,
          permissionType: 4
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('模板ID'), key: 'permissionId'},
      {label: t('模板名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('模板ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('模板名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('模板')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>;
  }

  getBindRoleModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getBusisnessRoleList({
        ...query,
        permissionType: 2
      });
    };
    const operateHandle = (query) => {
      // 角色特殊处理
      return dispatch({
        type: 'businessRoleList/roleBindResource',
        payload: {
          userIdList: query.userIdList,
          roleIdList: query.resourceIdList,
          permissionType: 8
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('角色ID'), key: 'permissionId'},
      {label: t('角色名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('角色ID'), dataIndex: 'id',key: 'id'},
      {title: t('角色标识'), dataIndex: 'name',key: 'name'},
      {title: t('角色名称'), dataIndex: 'nameZh',key: 'nameZh'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} showTagName={item => item.nameZh} resourceName={t('角色')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindRoleModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getUserBindRoleList({
        ...query,
        permissionType: 8
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleUnBindResource',
        payload: {
          userIdList: query.userIdList,
          roleIdList: query.resourceIdList,
          permissionType: 8
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('角色ID'), key: 'permissionId'},
      {label: t('角色名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('角色ID'), dataIndex: 'id',key: 'id'},
      {title: t('角色标识'), dataIndex: 'name',key: 'name'},
      {title: t('角色名称'), dataIndex: 'nameZh',key: 'nameZh'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} showTagName={item => item.nameZh} resourceName={t('角色')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>;
  }

  getBindMetricModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getBusinessResourceList({
        ...query,
        permissionType: 5
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userBindResource',
        payload: {
          ...query,
          permissionType: 5
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('指标ID'), key: 'permissionId'},
      {label: t('指标名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('指标ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('指标名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('指标')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindMetricModal() {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getUserBindResourceList({
        ...query,
        permissionType: 5
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessUserList/userUnBindResource',
        payload: {
          ...query,
          permissionType: 5
        }
      });
    };
    const searchConfig = [
      {label: t('业务线'), key: 'businessId', formItem: this.getBusinessIdSelect()},
      {label: t('指标ID'), key: 'permissionId'},
      {label: t('指标名'), key: 'permissionName'},
    ];
    const tableColumns = [
      {title: t('指标ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('指标名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <UserResourceBindModal {...this.state.modal} appId={this.props.global.appId} resourceName={t('指标')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} user={this.state.currentUser} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>;
  }

  batchBindRole = (users) => {
    const {t} = this.props;
    if (_.isArray(users)) {
      if (!users.length) {
        echoMessage(t('至少选择一个用户，再进行操作！'), 'error');
        return;
      }
      this.setState({
        currentUser: [
          ...users
         ]
      });
    } else {
      this.setState({
        currentUser: {
          ...users
        }
      })
    }
    this.openModal('bindRole');
  }

  getBatchButtons() {
    const { selectedRows } = this.state;
    const {t} = this.props;
    const bindContent = (<span>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindRole')} size="small" >{t('角色')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindArea')} size="small" >{t('地区')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindReport')} size="small" >{t('报表')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindTemplate')} size="small" >{t('模版')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindMetric')} size="small" >{t('指标')}</Button>
    </span>);
    return (
      <div className="batch-operate business-manage-mod">
        <label>{t('批量操作：')}</label>
        <Button size="small" onClick={() => this.batchBindRole(selectedRows)}>{t('批量绑定角色')}</Button>
        <Popover className="pull-right" overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={bindContent} placement="bottom" trigger="click">
            <Button type="primary" icon="plus">{t('新增权限')}</Button>
        </Popover>
      </div>
    );
  }
  operationsHandle = (type, record) =>  {
    if (record) {
      this.setState({
        currentUser: {
         ...record
        }
     });
    } else {
      // 创建添加权限
      this.setState({
        currentUser: {}
     });
    }

   this.openModal(type);
  }

  modalHandleOk = () => {
    this.modalClose();
    this.fetchData();
  }

  modalClose = () => {
    this.setState({
      currentRole: {},
      modal: {
        ...this.state.modal,
        type: '',
        visible: false
      }
    });
  }
  getOperations(record) {
    const { t } = this.props;
    const bindContent = (<span>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindRole', record)} size="small" >{t('角色')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindArea', record)} size="small" >{t('地区')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindReport', record)} size="small" >{t('报表')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindTemplate', record)} size="small" >{t('模版')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindMetric', record)} size="small" >{t('指标')}</Button>
    </span>);
    const unBindContent = (<span>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindRole', record)} size="small" >{t('角色')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindArea', record)} size="small" >{t('地区')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindReport', record)} size="small" >{t('报表')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindTemplate', record)} size="small" >{t('模版')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindMetric', record)} size="small" >{t('指标')}</Button>
    </span>);
    return (
      <span className="table-operate-wrap">
        <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={bindContent} placement="bottom" trigger="click">
            <Button size="small">{t('绑定权限')}</Button>
        </Popover>
        <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={unBindContent} placement="bottom" trigger="click">
            <Button size="small" type="primary">{t('解绑权限')}</Button>
        </Popover>        
      </span>
    );
  }
  getTableColumns() {
    const { t } = this.props;
    return [
        {
          title: t('用户名'),
          key: 'usernameZh',
          render: (record) => {
          return (<span>{record.usernameZh}({record.username}) <br/>{record.dept} {record.job}</span>);
          }
        },
        {
          title: t('业务线'),
          key: 'productName',
          dataIndex: 'productName'
        },
        {
          title: t('绑定角色数'),
          key: 'roleCount',
          dataIndex: 'roleCount'
        },
        {
          title: t('绑定权限数'),
          key: 'permissionCount',
          dataIndex: 'permissionCount'
        },
        {
          title: t('操作'),
          key: 'operate',
          render: (record) => {
            return this.getOperations(record);
          }
        }
    ];
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.fetchData(pagination.current);
  }
  handleSystemChange = (value) => {
    this.props.dispatch({type: 'global/save', payload: {appId: value}});
  }
  render () {
    const { selectedRows } = this.state;
    const {t, global, list: {records, current, total, size, loading}} = this.props;
    const rowSelection = {
      selectedRowKeys: selectedRows.map((item) => _.findIndex(records, function(o) { return o.id === item.id; })),
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
      }
    };
    return (
      <div className="user-list-wrap business-manage">
        <Breadcrumb className="business-manage-breadcrumb">
            <Breadcrumb.Item><a href="./">{t('首页')}</a></Breadcrumb.Item>
            <Breadcrumb.Item>{t('用户管理')}</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          className="business-manage-mod business-manage-card"
          title = {<CardTitle
              title={t('用户列表')}
              // sub={t('辅助信息')}
              >
          </CardTitle>}
        >
            <UserSearchForm
              wrappedComponentRef={(form) => this.formInstance = form}
              queryData={() => this.fetchData()}
              onChange={this.handleSystemChange}
              // onChange={(value) => this.setState({appId: value})}
              value={this.props.global.appId}
              global={global}
            />
            {this.getBatchButtons()}
            <Table className="business-manage-mod" loading={loading} rowSelection={rowSelection} pagination={{current, total, pageSize: size}} onChange={this.handleTableChange}  dataSource={records} columns={this.getTableColumns()} />
        </Card>
        {this.createModal()}
      </div>
    );
  }
}

export default connect(({businessUserList, global, bigData}) => {
  return {
    businessLine: bigData.businessLine,
    ...businessUserList,
    global
  };
}, (dispatch) => ({
  dispatch,
  fetchData(params) {
    return dispatch({
      type: 'businessUserList/fetchBusinessUserList',
      payload: params
    });
  },
  fetchBusinessLine(appId) {
    dispatch({
      type: 'bigData/fetchBusinessLine',
      payload: { appId }
    });
  }
}))(User);
