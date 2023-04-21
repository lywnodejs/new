import React from 'react';
import connect from '@utils/translateConnect';
import request from '@utils/request';
import { Breadcrumb, Card, Button, Form, Input, Table, Popover, Modal, Select } from 'antd';
import CardTitle from '@components/CardTitle';
import AddRoleModal from './addRoleModal';
import UserBindModal from './userBindModal';
import UserUnBindModal from './userUnBindModal';
import RoleResourceBindModal from './roleResourceBindModal';
import RoleAreaBindModal from './roleAreaBindModal';
import _ from 'lodash';
import { echoMessage } from '@utils/notice';
import {getBusinessResourceList, getRoleBindResourceList, getRoleBindAreaList} from '../../../services/businessManage';

const confirm = Modal.confirm;
// const Option = Select.Option;

class Role extends React.Component {
  state = {
    selectedRows: [],
    currentRole: null,
    search: {
      permissionName: '',
      businessId: ''
    },
    modal: {
      type: '',
      style: {},
      visible: false
    },
    allBusiness: [],
  };

  componentDidMount() {
    if (this.props.global.appId) {
      this.fetchData();
      this.props.fetchBusinessLine(this.props.global.appId);
      this.getAllBusiness(this.props.global.appId);
    }
  }

  componentWillReceiveProps(nextProps){
    // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
    if (nextProps.global.appId && nextProps.global.appId !== this.props.global.appId) {
      this.setState({search:{businessId: ''}}, () => {
        this.fetchData(1, nextProps.global.appId);
      });
      this.props.fetchBusinessLine(nextProps.global.appId);
      this.getAllBusiness(nextProps.global.appId);
    }
  }

  getAllBusiness = (appId) => {
    request(`/v2/businessManager/query/business?appId=${appId}`).then(allBusiness => {
      this.setState({
        allBusiness: allBusiness || []
      });
    })
  }

  fetchData = (page, appId) => {
    const {fetchData, list: {current}} = this.props;
    const { permissionName, businessId } = this.state.search;
    fetchData({
      permissionName: permissionName|| '',
      page: page || current,
      appId: appId || this.props.global.appId,
      businessId
    });
  }

  operationsHandle = (type, record) =>  {
    this.setState({
      currentRole: {
       ...record
      }
   });
   this.openModal(type);
  }
  /**
   * 动态创建模态框
   */
  createModal = () => {
    const ModalMap = {
      'new': <AddRoleModal {...this.state.modal} appId={this.props.global.appId} handleOk={this.modalHandleOk} handleCancel={this.modalClose} businessLine={this.props.businessLine} />,
      'edit': <AddRoleModal isEdit={true} {...this.state.modal} appId={this.props.global.appId} handleOk={this.modalHandleOk} handleCancel={this.modalClose} businessLine={this.props.businessLine} />,
      'bindUser': <UserBindModal {...this.state.modal} appId={this.props.global.appId} role={this.state.currentRole} handleOk={this.modalHandleOk} handleCancel={this.modalClose}/>,
      'unbindUser': <UserUnBindModal  {...this.state.modal} role={this.state.currentRole} handleOk={this.modalHandleOk} handleCancel={this.modalClose}/>,
      'bindReport': this.getBindReportModal(),
      'unbindReport': this.getUnBindReportModal(),
      'bindTemplate': this.getBindTemplateModal(),
      'unbindTemplate': this.getUnBindTemplateModal(),
      'bindMetric': this.getBindMetricModal(),
      'unbindMetric': this.getUnBindMetricModal(),
      'bindArea': this.getBindAreaModal(),
      'unbindArea': this.getUnBindAreaModal(),
    };
    return ModalMap[this.state.modal.type];
  }

  /**
   * 打开模态框
   */
  openModal = (type, record) => {
    this.setState({
      modal: {
        ...this.state.modal,
        type,
        visible: true,
        record
      }
    });
  }

  getBindReportModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getBusinessResourceList({
        ...query,
        permissionType: 3
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleBindResource',
        payload: {
          ...query,
          permissionType: 3
        }
      });
    };
    const searchConfig = [
      {label: t('报表名'), key: 'permissionName'},
      {label: t('报表ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('报表ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('报表名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('报表')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindReportModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getRoleBindResourceList({
        ...query,
        permissionType: 3
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleUnBindResource',
        payload: {
          ...query,
          permissionType: 3
        }
      });
    };
    const searchConfig = [
      {label: t('报表名'), key: 'permissionName'},
      {label: t('报表ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('报表ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('报表名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('报表')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getBindTemplateModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
       return getBusinessResourceList({
          ...query,
          permissionType: 4
       });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleBindResource',
        payload: {
          ...query,
          permissionType: 4
        }
      });
    };
    const searchConfig = [
      {label: t('模板名'), key: 'permissionName'},
      {label: t('模板ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('模板ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('模板名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('模板')} operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindTemplateModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getRoleBindResourceList({
        ...query,
        permissionType: 4
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleUnBindResource',
        payload: {
          ...query,
          permissionType: 4
        }
      });
    };
    const searchConfig = [
      {label: t('模板名'), key: 'permissionName'},
      {label: t('模板ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('模板ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('模板名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('模板')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getBindMetricModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
       return getBusinessResourceList({
          ...query,
          permissionType: 5
       });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleBindResource',
        payload: {
          ...query,
          permissionType: 4
        }
      });
    };
    const searchConfig = [
      {label: t('指标名'), key: 'permissionName'},
      {label: t('指标ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('指标ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('指标名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('指标')}  operateName={t('绑定')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getUnBindMetricModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getRoleBindResourceList({
        ...query,
        permissionType: 5
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleUnBindResource',
        payload: {
          ...query,
          permissionType: 5
        }
      });
    };
    const searchConfig = [
      {label: t('指标名'), key: 'permissionName'},
      {label: t('指标ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('指标ID'), dataIndex: 'resourceKey',key: 'resourceKey'},
      {title: t('指标名'), dataIndex: 'resourceName',key: 'resourceName'},
      {title: t('业务线'), dataIndex: 'businessName',key: 'businessName'},
    ];
    return <RoleResourceBindModal {...this.state.modal} resourceName={t('指标')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }

  getBindAreaModal = () => {
    const {t, dispatch} = this.props;
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleBindResource',
        payload: {
          ...query,
          permissionType: 1
        }
      });
    }
    return (
      <RoleAreaBindModal {...this.state.modal} resourceName={t('地区')} operateName={t('绑定')} operateHandle={operateHandle} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
    );
  }

  getUnBindAreaModal = () => {
    const {t, dispatch} = this.props;
    const fetchData = (query) => {
      return getRoleBindAreaList({
        ...query,
        permissionType: 1
      });
    };
    const operateHandle = (query) => {
      return dispatch({
        type: 'businessRoleList/roleUnBindResource',
        payload: {
          ...query,
          permissionType: 1
        }
      });
    };
    const searchConfig = [
      {label: t('地区名'), key: 'permissionName'},
      {label: t('地区ID'), key: 'permissionId'}
    ];
    const tableColumns = [
      {title: t('地区ID'), dataIndex: 'id',key: 'id'},
      {title: t('地区名'), dataIndex: 'name',key: 'name'},
    ];
    return <RoleResourceBindModal {...this.state.modal} showTagName={(item)=> {return item.name}} resourceName={t('地区')} operateName={t('解绑')} tableColumns={tableColumns} searchConfig={searchConfig} operateHandle={operateHandle} fetchData={fetchData} role={this.state.currentRole} successHandle={this.modalHandleOk} handleCancel={this.modalClose}/>
  }  

  modalHandleOk = () => {
    this.modalClose();
    this.freshList();
  }

  modalClose = () => {
    this.setState({
      currentRole: null,
      modal: {
        ...this.state.modal,
        type: '',
        visible: false
      }
    });
  }

  // 刷新页面
  freshList = () => {
    this.fetchData();
  }

  deleteRole = (record) => {
    const isBatch = _.isArray(record);
    const records = isBatch ? record : [record];
    const {t} = this.props;
    const confirmText = records.map(item => item.nameZh).join(',');
    if (isBatch && !record.length) {
      echoMessage(t('至少选择一个角色，再进行操作！'), 'error');
      return;
    }
    confirm({
      title: isBatch ? t('批量删除') : t('删除'),
      content: t('您确认要删除角色：{{roleName}}吗？', {roleName: confirmText}),
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.handleDelete(records);
      }
    });
  }

  bindUser = (record) => {
    const {t} = this.props;
    if (_.isArray(record)) {
      if (!record.length) {
        echoMessage(t('至少选择一个角色，再进行操作！'), 'error');
        return;
      }
      this.setState({
         currentRole: [
          ...record
         ]
      });
    } else {
      this.setState({
        currentRole: {
          ...record
        }
      })
    }
    this.openModal('bindUser');
  }

  handleDelete = (records) => {
    const { dispatch, t } = this.props;
    dispatch({
      type: 'businessRoleList/removeRole',
      payload: {
        idsList: records.map(item => item.id)
      }
    }).then(() => {
      echoMessage(t('删除角色成功！'), 'success');
      this.freshList();
    });
  };

  getBatchButtons = () => {
    const {t} = this.props;
    const {selectedRows} = this.state;
    return (
      <div className="batch-operate business-manage-mod">
        <label htmlFor="">{t('批量操作：')}</label>
        <Button size="small" onClick={() => this.bindUser(selectedRows)}>{t('批量绑定用户')}</Button>
        <Button type="primary" onClick={() => this.deleteRole(selectedRows)} size="small">{t('批量删除')}</Button>
        <Button
            className="pull-right"
            type="primary"
            icon="plus"
            onClick={() => this.openModal('new')}
          >
          {t('新增角色')}
        </Button>
      </div>
    );
  }

  getOperations = (record)  =>  {
    const { t } = this.props;
    const bindContent = (<span>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindArea', record)} size="small" >{t('地区')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindReport', record)} size="small" >{t('报表')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindTemplate', record)} size="small" >{t('模版')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('bindMetric', record)} size="small" >{t('指标')}</Button>
    </span>);
    const unBindContent = (<span>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindArea', record)} size="small" >{t('地区')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindReport', record)} size="small" >{t('报表')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindTemplate', record)} size="small" >{t('模版')}</Button>
      <Button className="upm-popover__button" onClick={() => this.operationsHandle('unbindMetric', record)} size="small" >{t('指标')}</Button>
    </span>);
    return (
      <span className="table-operate-wrap">
        <Button size="small" onClick={() => this.openModal('edit', record)}>{t('编辑角色')}</Button>
        <Button size="small" onClick={() => this.bindUser(record)}>{t('绑定用户')}</Button>
        <Button size="small" type="primary"  onClick={() => this.operationsHandle('unbindUser', record)}>{t('解绑用户')}</Button>
        <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={bindContent} placement="bottom" trigger="click">
          <Button size="small">{t('绑定权限')}</Button>
        </Popover>
        <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={unBindContent} placement="bottom" trigger="click">
          <Button size="small" type="primary">{t('解绑权限')}</Button>
        </Popover>        
        <Button type="primary" onClick={() => this.deleteRole(record)} size="small">{t('删除')}</Button>
      </span>
    );
  }
  getTableColumns = () => {
    const { t } = this.props;
    return [
        {
          title: t('角色名称'),
          key: 'nameZh',
          dataIndex: 'nameZh'
        },
        {
          title: t('角色描述'),
          key: 'description',
          dataIndex: 'description'
        },
        {
          title: t('业务线'),
          key: 'businessName',
          dataIndex: 'businessName'
        },
        {
          title: t('绑定用户数'),
          key: 'userCountBound',
          dataIndex: 'userCountBound'
        },
        {
          title: t('绑定权限数'),
          key: 'permissionCountBound',
          dataIndex: 'permissionCountBound'
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
    this.getAllBusiness(value);
    this.setState({
      search: {
        businessId: ''
      }
    });
  }

  handleBusinessChange = (businessId) => {
    this.setState({
      search: {
        ...this.state.search,
        businessId: businessId?businessId:''
      }
    });
  }

  render = () => {
    const { selectedRows } = this.state;
    const {t, list: {records, current, total, size, loading}} = this.props;
    const rowSelection = {
      selectedRowKeys: selectedRows.map((item) => _.findIndex(records, function(o) { return o.id === item.id; })),
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
      }
    };
    const permissionNameChange = (e) => {
      const { value } = e.target;
      this.setState({
        search: {
          ...this.state.search,
          permissionName: value
        }
      })
    }
    const businessSystemList = this.props.global.businessSystemList;

    return (
      <div className="role-list-wrap business-manage">
        <Breadcrumb className="business-manage-breadcrumb">
          <Breadcrumb.Item><a href="./">{t('首页')}</a></Breadcrumb.Item>
          <Breadcrumb.Item>{t('角色管理')}</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          className="business-manage-mod business-manage-card"
          title = {<CardTitle
            title={t('角色列表')}
            // sub={t('辅助信息')}
            >
          </CardTitle>}
        >
          <Form layout="inline">
            <Form.Item label={t('目标系统')}>
              <Select
                placeholder={t('请选择')}
                value={this.props.global.appId}
                onChange={this.handleSystemChange}
                className='form-select'
                showSearch
                optionFilterProp="children"
                style={{minWidth: 200}}
              >
                {businessSystemList.map(item => <Select.Option key={item.appId} value={item.appId}>{item.appName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label={t('业务线')}>
              <Select
                allowClear
                placeholder={t('请选择')}
                value={this.state.search.businessId}
                onChange={this.handleBusinessChange}
                className='form-select'
                showSearch
                optionFilterProp="children"
                style={{minWidth: 200}}
              >
                {this.state.allBusiness.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label={t('角色名称')}>
              <Input
                value={this.state.search.permissionName}
                onChange={permissionNameChange}
                style={{minWidth: 200}}
                placeholder={t('请输入关键字进行模糊搜索')}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon="search"
                onClick={() => {this.fetchData()}}
              >
                {t('搜索')}
              </Button>
            </Form.Item>
          </Form>
          {this.getBatchButtons()}
          <Table className="business-manage-mod" rowKey="id" loading={loading} rowSelection={rowSelection} pagination={{current, total, pageSize: size}} onChange={this.handleTableChange} dataSource={records} columns={this.getTableColumns()} />
        </Card>
        {this.createModal()}
      </div>
    );
  }
}

// export default Tools;
export default connect(({ businessRoleList, global, bigData }) => {
  return {
    ...businessRoleList,
    global,
    businessLine: bigData.businessLine
  };
}, (dispatch) => ({
  dispatch,
  fetchData(params) {
    return dispatch({
      type: 'businessRoleList/fetchBusinessRoleList',
      payload: params
    });
  },
  fetchBusinessLine(appId) {
    dispatch({
      type: 'bigData/fetchBusinessLine',
      payload: { appId }
    });
  }
}))(Role);
