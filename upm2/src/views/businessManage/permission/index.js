import React from 'react';
import connect from '@utils/translateConnect';
import {
  Card,
  Breadcrumb,
  Input,
  Tabs,
  Button,
  message,
  Form,
  Table,
  Modal,
  Col,
  Row,
  Select,
  Divider
} from 'antd';
import CardTitle from '@components/CardTitle';
import './index.less';
// import TextButton from '../../../components/TextButton';
import UserSelect from '@components/UserSelector';
import { echoMessage } from '@utils/notice';
import request from '@utils/request';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Column } = Table;

const PERMISSION_TYPE_LIST = {
  '1': {
    type: '地区',
    name: 'name'
  },
  '2': {
    type: '角色',
    name: 'nameZh'
  },
  '3': {
    type: '报表',
    name: 'resourceName'
  },
  '4': {
    type: '模板',
    name: 'resourceName'
  },
  '5': {
    type: '指标',
    name: 'resourceName'
  }
};

class Role extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      permissionName: '',
      permissionType: '1',
      selectedRows: [],
      modalUserVisible: false,
      modalUserList: [],
      modalRoleVisible: false,
      modalType: 'single',
      modalResourceData: null,
      modalRoleList: [],
      modalUserUnbindVisible: false,
      isUnbind: false,
      currentRecord: null,
      currentPage: 1,
      businessId: '',
      allBusiness: []
    };
  }

  componentDidMount() {
    if (this.props.global.appId) {
      this.search();
      this.getAllBusiness(this.props.global.appId);
    }
  }

  componentWillReceiveProps(nextProps) {
    // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
    if (
      nextProps.global.appId &&
      nextProps.global.appId !== this.props.global.appId
    ) {
      this.setState({ businessId: '' }, () => {
        this.search(1, nextProps.global.appId);
      });
      this.getAllBusiness(nextProps.global.appId);
    }
  }

  getAllBusiness = appId => {
    request(`/v2/businessManager/query/business?appId=${appId}`).then(
      allBusiness => {
        this.setState({
          allBusiness: allBusiness || []
        });
      }
    );
  };

  search = (page = 1, appId) => {
    const { dispatch } = this.props;
    const { permissionType, permissionName, businessId } = this.state;

    const params = {
      page,
      permissionName: permissionName || '',
      businessId
    };

    // appId为-1的时候，就是选择【全部】
    if (appId !== -1) {
      params.appId = appId || this.props.global.appId;
    }

    if (permissionType === '1') {
      params.permissionType = permissionType;
      dispatch({
        type: 'businessRoleList/fetchBusinessAreaList',
        payload: params
      });
    } else if (
      permissionType === '3' ||
      permissionType === '4' ||
      permissionType === '5'
    ) {
      params.permissionType = permissionType;
      dispatch({
        type: 'businessRoleList/fetchBusinessResourceList',
        payload: params
      });
    } else if (permissionType === '2') {
      dispatch({
        type: 'businessRoleList/fetchBusinessRoleList',
        payload: params
      });
    }
  };

  handleSearchFieldChange = (key, value) => {
    this.setState(
      {
        [key]: value
      },
      this.search
    );
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
    this.search(page);
  };

  // 操作列的render
  getActions = (text, record) => {
    const { t } = this.props;
    const { permissionType } = this.state;
    const isRole = permissionType !== '2';

    return (
      <div>
        {isRole ? (
          <Button
            size="small"
            onClick={() => {
              this.setState(
                {
                  isUnbind: false,
                  currentRecord: record
                },
                () => {
                  this.handleModalPageChange(1).then(() => {
                    this.setState({
                      modalRoleVisible: true,
                      modalType: 'single',
                      modalResourceData: record,
                      modalRoleList: []
                    });
                  });
                }
              );
            }}>
            {t('绑定角色')}
          </Button>
        ) : (
          ''
        )}
        {isRole ? (
          <Button
            size="small"
            type="primary"
            onClick={() => {
              this.setState(
                {
                  isUnbind: true,
                  currentRecord: record
                },
                () => {
                  this.handleModalPageChange(1).then(() => {
                    this.setState({
                      modalRoleVisible: true,
                      modalType: 'single',
                      modalResourceData: record,
                      modalRoleList: []
                    });
                  });
                }
              );
            }}>
            {t('解绑角色')}
          </Button>
        ) : (
          ''
        )}
        <Button
          size="small"
          onClick={() => {
            this.setState({
              modalUserVisible: true,
              isUnbind: false,
              modalType: 'single',
              modalResourceData: record,
              modalUserList: []
            });
          }}>
          {t('绑定用户')}
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            this.setState(
              {
                isUnbind: true,
                currentRecord: record
              },
              () => {
                this.handleUserUnbindPageChange(1).then(() => {
                  this.setState({
                    modalUserUnbindVisible: true,
                    modalType: 'single',
                    modalResourceData: record,
                    modalUserList: []
                  });
                });
              }
            );
          }}>
          {t('解绑用户')}
        </Button>
      </div>
    );
  };

  // 不同的类型显示不同的列
  getTableColumns = () => {
    const { t } = this.props;
    const { permissionType } = this.state;

    const result = [
      {
        title: t('权限类型'),
        key: 'type',
        render: () => {
          return PERMISSION_TYPE_LIST[permissionType].type;
        }
      },
      {
        title: t('权限名称'),
        key: PERMISSION_TYPE_LIST[permissionType].name,
        dataIndex: PERMISSION_TYPE_LIST[permissionType].name
      },
      {
        title: t('业务线'),
        key: 'businessName',
        dataIndex: 'businessName'
      }
    ];

    if (permissionType === '1') {
      result.push(
        {
          title: t('绑定的角色数'),
          key: 'roleCount',
          dataIndex: 'roleCount'
        },
        {
          title: t('绑定的用户数'),
          key: 'userCount',
          dataIndex: 'userCount'
        }
      );
    } else if (permissionType === '2') {
      result.push(
        {
          title: t('绑定的角色数'),
          key: 'roleCount',
          render: () => {
            return '--';
          }
        },
        {
          title: t('绑定的用户数'),
          key: 'userCountBound',
          dataIndex: 'userCountBound'
        }
      );
    } else {
      result.push(
        {
          title: t('绑定的角色数'),
          key: 'roleCount',
          dataIndex: 'roleCount'
        },
        {
          title: t('绑定的用户数'),
          key: 'userCount',
          dataIndex: 'userCount'
        }
      );
    }

    result.push({
      title: t('操作'),
      key: 'operator',
      render: (text, record) => {
        return this.getActions(text, record);
      }
    });

    return result;
  };

  // 绑定角色的方法，包括单个和批量，通过modalType判断
  bindRole = () => {
    const { dispatch, t, global } = this.props;
    const {
      modalRoleList,
      modalType,
      selectedRows,
      modalResourceData,
      permissionType,
      isUnbind
    } = this.state;
    if (!modalRoleList.length) {
      message.error('请选择至少一个角色');
      return;
    }
    const params = {
      appId: Number(global.appId),
      permissionType: Number(permissionType),
      roleIdList: modalRoleList.map(i => Number(i.id))
    };

    if (modalType === 'single') {
      params.resourceIdList = [modalResourceData.id];
    } else {
      params.resourceIdList = selectedRows.map(i => i.id);
    }

    dispatch({
      type: isUnbind
        ? 'businessRoleList/roleUnBindResource'
        : 'businessRoleList/roleBindResource',
      payload: params
    }).then(() => {
      this.setState({
        modalRoleVisible: false
      });
      echoMessage(
        isUnbind ? t('角色解绑成功！') : t('角色绑定成功！'),
        'success'
      );
    });
  };

  // 绑定用户的方法，包括单个和批量，通过modalType判断
  bindUser = () => {
    const { dispatch, t, global } = this.props;
    const {
      modalUserList,
      modalType,
      selectedRows,
      modalResourceData,
      permissionType
    } = this.state;
    const type =
      permissionType == 2
        ? 'businessRoleList/roleBindResource'
        : 'businessUserList/userBindResource';
    if (!modalUserList.length) {
      message.error('请输入至少一个用户');
      return;
    }
    const params = {
      appId: Number(global.appId),
      permissionType: permissionType == 2 ? 8 : Number(permissionType),
      userIdList: modalUserList.map(i => Number(i.key))
    };

    if (permissionType == 2) {
      if (modalType === 'single') {
        params.roleIdList = [modalResourceData.id];
      } else {
        params.roleIdList = selectedRows.map(i => i.id);
      }
    } else {
      if (modalType === 'single') {
        params.resourceIdList = [modalResourceData.id];
      } else {
        params.resourceIdList = selectedRows.map(i => i.id);
      }
    }

    dispatch({
      type,
      payload: params
    }).then(() => {
      this.setState({
        modalUserVisible: false
      });
      echoMessage(t('用户绑定成功！'), 'success');
    });
  };

  setModalValue = value => {
    console.log(value);
    this.setState({
      modalUserList: value
    });
  };

  unbindUser = () => {
    const { dispatch, global, t } = this.props;
    const { currentRecord, permissionType } = this.state;
    const type =
      permissionType == 2
        ? 'businessRoleList/roleUnBindResource'
        : 'businessUserList/userUnBindResource';
    const params = {
      appId: Number(global.appId),
      permissionType: permissionType == 2 ? 8 : Number(permissionType),
      userIdList: this.state.selectedRows.map(i => i.id)
    };
    if (permissionType == 2) {
      params.roleIdList = [currentRecord.id];
    } else {
      params.resourceIdList = [currentRecord.id];
    }

    dispatch({
      type,
      payload: params
    }).then(() => {
      this.setState({
        modalUserUnbindVisible: false
      });
      echoMessage(t('用户解绑成功！'), 'success');
    });
  };

  handleModalPageChange = page => {
    const { dispatch, global } = this.props;
    const { isUnbind, permissionType, currentRecord } = this.state;
    const params = isUnbind
      ? {
          permissionType,
          targetId: currentRecord.id,
          page,
          appId: global.appId,
          size: 5
        }
      : {
          businessId: currentRecord.businessId,
          page,
          appId: global.appId,
          size: 5
        };
    return dispatch({
      type: isUnbind
        ? 'businessRoleList/fetchResourceBindRoleList'
        : 'businessRoleList/fetchBusinessRoleList',
      payload: params
    });
  };

  handleUserUnbindPageChange = page => {
    if (page && page.current) {
      page = page.current;
      this.setState({
        currentPage: page
      });
    }
    const { dispatch, global } = this.props;
    const { isUnbind, permissionType, currentRecord } = this.state;
    const params = isUnbind
      ? {
          permissionType,
          targetId: currentRecord.id,
          page,
          appId: global.appId,
          size: 5
        }
      : {
          page,
          appId: global.appId,
          size: 5
        };

    let type = null;
    if (isUnbind) {
      if (permissionType == 1) {
        type = 'businessRoleList/fetchAreaBindUserList';
      } else if (permissionType == 2) {
        type = 'businessRoleList/getRoleBindUsers';
      } else {
        type = 'businessRoleList/fetchResourceBindUserList';
      }
    } else {
      type = 'businessRoleList/fetchBusinessUserList';
    }
    return dispatch({
      type,
      payload:
        permissionType == 2
          ? {
              appId: global.appId,
              id: currentRecord.id,
              page,
              size: 5
            }
          : params
    });
  };

  deleteSelectdRows(item) {
    let { selectedRows } = this.state;
    _.remove(selectedRows, i => item.id == i.id);
    this.setState({
      selectedRows: [...selectedRows]
    });
  }

  handleSystemChange = value => {
    this.props.dispatch({ type: 'global/save', payload: { appId: value } });
    this.getAllBusiness(value);
    this.setState({
      businessId: ''
    });
  };

  handleBusinessChange = businessId => {
    this.setState({
      businessId
    });
  };

  render() {
    const {
      t,
      global,
      roleList,
      businessResourceList,
      businessAreaList,
      resourceBindRoleList,
      resourceBindUserList
    } = this.props;
    const { selectedRows, permissionType, isUnbind } = this.state;
    const listObj = {
      '1': businessAreaList,
      '2': roleList,
      '3': businessResourceList,
      '4': businessResourceList,
      '5': businessResourceList
    };
    const businessSystemList = global.businessSystemList;
    const userRowSelection = {
      selectedRowKeys: selectedRows.map(item =>
        _.findIndex(resourceBindUserList.records, function(o) {
          return o.id === item.id;
        })
      ),
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRows.length) {
          let validSelectedRows = _.filter(selectedRows, item => {
            return (
              _.findIndex(this.state.selectedRows, i => i.id === item.id) === -1
            );
          });
          this.setState({
            selectedRows: [...this.state.selectedRows, ...validSelectedRows]
          });
        } else {
          this.deleteSelectdRows(resourceBindUserList.records);
        }
      },
      onSelect: (record, selected, selectedRows) => {
        if (!selected) {
          this.deleteSelectdRows(record);
        }
      }
    };
    const RoleTableColumns = [
      { title: t('角色ID'), dataIndex: 'id', key: 'id' },
      { title: t('角色标识'), dataIndex: 'name', key: 'name' },
      { title: t('角色名称'), dataIndex: 'nameZh', key: 'nameZh' },
      { title: t('业务线'), dataIndex: 'businessName', key: 'businessName' }
    ];

    let {
      // current,
      size,
      total,
      records,
      loading
    } = listObj[permissionType];

    // 角色的弹窗数据源
    let modalCurrent, modalSize, modalTotal, modalRecords, modalLoading;
    if (permissionType !== '2') {
      modalCurrent = roleList.current;
      modalSize = roleList.size;
      modalTotal = roleList.total;
      modalRecords = roleList.records;
      modalLoading = roleList.loading;
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows
        });
      },
      getCheckboxProps: record => {
        return {
          id: record.id.toString()
        };
      }
    };

    // 角色弹窗表格的选择配置项
    const rowSelectionModal = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          modalRoleList: selectedRows
        });
      },
      getCheckboxProps: record => {
        return {
          id: record.id.toString()
        };
      }
    };

    return (
      <div className="businessPermissionList">
        <Breadcrumb className="business-manage-breadcrumb">
          <Breadcrumb.Item>
            <a href="./">{t('首页')}</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('权限管理')}</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          className="business-manage-mod business-manage-card"
          title={
            <CardTitle
              title={t('权限列表')}
              // sub={t('辅助信息')}
            ></CardTitle>
          }>
          <Tabs
            defaultActiveKey="1"
            onChange={tabKey => {
              this.handleSearchFieldChange('permissionType', tabKey);
            }}>
            <TabPane tab={t('地区')} key="1"></TabPane>
            <TabPane tab={t('角色')} key="2"></TabPane>
            <TabPane tab={t('报表')} key="3"></TabPane>
            <TabPane tab={t('模板')} key="4"></TabPane>
            <TabPane tab={t('指标')} key="5"></TabPane>
          </Tabs>

          <div className="content-area">
            <Row gutter={24} className="search-fields">
              <Col span={7}>
                <Form.Item label={t('目标系统')}>
                  <Select
                    placeholder={t('请选择')}
                    value={this.props.global.appId}
                    onChange={this.handleSystemChange}
                    className="form-select"
                    showSearch
                    optionFilterProp="children">
                    {businessSystemList.map(item => (
                      <Select.Option key={item.appId} value={item.appId}>
                        {item.appName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={t('业务线')}>
                  <Select
                    allowClear
                    placeholder={t('请选择')}
                    value={this.state.businessId}
                    onChange={this.handleBusinessChange}
                    className="form-select"
                    showSearch
                    optionFilterProp="children"
                    style={{ minWidth: 200 }}>
                    {this.state.allBusiness.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <FormItem label={t('权限名称：')}>
                  <Input
                    placeholder="请输入权限名称"
                    onChange={e =>
                      this.setState({ permissionName: e.target.value })
                    }
                  />
                </FormItem>
              </Col>

              <Col span={3}>
                <FormItem>
                  <Button icon="search" onClick={e => this.search()}>
                    {t('搜索')}
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} className="search-fields">
              <Col span={3}>
                <FormItem>
                  <Button
                    onClick={() => {
                      if (!selectedRows.length) {
                        message.error('请选择至少一条记录');
                        return;
                      }
                      this.handleModalPageChange(1).then(() => {
                        this.setState({
                          modalRoleVisible: true,
                          modalType: 'batch',
                          modalRoleList: []
                        });
                      });
                    }}>
                    {t('批量绑定角色')}
                  </Button>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button
                    onClick={() => {
                      if (!selectedRows.length) {
                        message.error('请选择至少一条记录');
                        return;
                      }
                      this.setState({
                        modalUserVisible: true,
                        isUnbind: false,
                        modalType: 'batch',
                        modalUserList: []
                      });
                    }}>
                    {t('批量绑定用户')}
                  </Button>
                </FormItem>
              </Col>
            </Row>

            <Table
              dataSource={records}
              size="small"
              pagination={{
                current: this.state.currentPage,
                pageSize: size,
                // hideOnSinglePage: true,
                total,
                onChange: this.handlePageChange
              }}
              className="upm-table"
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              columns={this.getTableColumns()}></Table>
          </div>
        </Card>

        <Modal
          title={
            this.state.modalType === 'single'
              ? isUnbind
                ? t('解绑角色')
                : t('绑定角色')
              : t('批量绑定角色')
          }
          visible={this.state.modalRoleVisible}
          onOk={this.bindRole}
          onCancel={() => this.setState({ modalRoleVisible: false })}
          destroyOnClose={true}
          width={800}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ modalRoleVisible: false })}>
              {t('取消')}
            </Button>,
            <Button key="submit" type="primary" onClick={this.bindRole}>
              {isUnbind ? t('解绑角色') : t('绑定角色')}
            </Button>
          ]}>
          <Table
            dataSource={isUnbind ? resourceBindRoleList.records : modalRecords}
            size="small"
            pagination={
              isUnbind
                ? resourceBindRoleList
                : {
                    current: modalCurrent,
                    pageSize: 5,
                    // hideOnSinglePage: true,
                    total: modalTotal,
                    onChange: this.handleModalPageChange
                  }
            }
            className="upm-table"
            rowKey="id"
            loading={modalLoading}
            rowSelection={rowSelectionModal}
            columns={RoleTableColumns}></Table>
        </Modal>

        <Modal
          title={
            this.state.modalType === 'single'
              ? t('绑定用户')
              : t('批量绑定用户')
          }
          visible={this.state.modalUserVisible}
          onOk={this.bindUser}
          onCancel={() => this.setState({ modalUserVisible: false })}
          destroyOnClose={true}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ modalUserVisible: false })}>
              {t('取消')}
            </Button>,
            <Button key="submit" type="primary" onClick={this.bindUser}>
              {t('确定')}
            </Button>
          ]}>
          <FormItem label={t('绑定用户')}>
            <UserSelect
              onChange={this.setModalValue}
              value={this.state.modalUserList}
            />
          </FormItem>
        </Modal>

        <Modal
          title={t('解绑用户')}
          visible={this.state.modalUserUnbindVisible}
          onOk={this.unbindUser}
          onCancel={() => this.setState({ modalUserUnbindVisible: false })}
          destroyOnClose={true}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ modalUserUnbindVisible: false })}>
              {t('取消')}
            </Button>,
            <Button key="submit" type="primary" onClick={this.unbindUser}>
              {t('确定')}
            </Button>
          ]}>
          {/* <Form layout="inline">
            <FormItem label={t('用户名')}>
              {getFieldDecorator('username', {
                initialValue: ''
              })(<Input />)}
            </FormItem>
            <FormItem>
                <Button
                  type="primary"
                  icon="search"
                  onClick={() => {this.handleUserUnbindPageChange()}}
                >
                  {t('搜索')}
                </Button>
            </FormItem>
          </Form> */}
          <Table
            rowSelection={userRowSelection}
            loading={loading}
            pagination={{
              ...resourceBindUserList,
              pageSize: 5,
              current: this.state.currentPage
            }}
            onChange={this.handleUserUnbindPageChange}
            dataSource={resourceBindUserList.records}>
            <Column title={t('ID')} dataIndex="id" key="id" />
            <Column title={t('账号')} dataIndex="username" key="username" />
            <Column title={t('姓名')} dataIndex="usernameZh" key="usernameZh" />
          </Table>

          {/* <div className="selected-wrap">
            <label>{t('已选：')}</label>
            {selectedRows.map(item => (<Tag key={item.id} closable onClose={() => {this.deleteSelectdRows(item)}}>{item.username}</Tag>))}
          </div> */}
        </Modal>
      </div>
    );
  }
}

// export default Tools;
export default connect(({ businessRoleList, global }) => {
  return {
    businessAreaList: businessRoleList.businessAreaList,
    businessResourceList: businessRoleList.businessResourceList,
    roleList: businessRoleList.list,
    global,
    // appId: global.globalAppId,
    resourceBindRoleList: businessRoleList.resourceBindRoleList,
    resourceBindUserList: businessRoleList.resourceBindUserList
  };
})(Role);
