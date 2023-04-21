import React, { Component } from 'react';
import { Button, Form, Card, Row, Col, Upload, message } from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '../../../components/AvailableApps/index';
import EditableTree from '../../../components/EditableTree/index';
import CardTitle from '@components/CardTitle';
import UserModal from '@components/UserModal';
import { apiHost } from '@config/apiConfig';
import RoleChoice from '@components/RoleChoice/index';
const SHEET_TYPE = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';


import './index.less';
import findTreeNodeById from '@utils/findTreeNodeById';

import EditForm from './Form';

const FormItem = Form.Item;

const initialState = {
  editingFlag: null,
  editingFlagParent: {
    name: ''
  }
};

class ManageFlags extends Component {
  state = {
    visible: false,
    roleModalVisible: false,
    confirmLoading: false,
    //角色选择
    selectedRoleRows: [],
    userList: {},
    ...initialState
  };

  componentDidMount () {
    if (this.props.appId) {
      this.props.fetchFlags(this.props.appId);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.appId && this.props.appId !== nextProps.appId) {
      this.props.fetchFlags(nextProps.appId);
    }

    if (this.props.flagList !== nextProps.flagList) {
      if (this.state.editingFlag) {
        const item = findTreeNodeById(nextProps.flagList, this.state.editingFlag.id);

        if (!item) {
          this.setState({
            editingFlag: null
          });
        }
      }
    }
  }

  idToPathMap = {};

  // transFlagList = (list, path=[]) => {
  //   return list.reduce((res, item) => {
  //     this.idToPathMap[item.id] = path;
  //     return res.concat({
  //       value: item.id,
  //       label: item.commonName,
  //       path: path,
  //       children: item.children ? this.transFlagList(item.children, path.concat(item.id)) : []
  //     });
  //   }, []);
  // };

  fetchAppFlags = () => {
    this.idToPathMap = {};
    this.props.fetchFlags(this.props.appId);
  };

  handleEdit = (flag) => {
    if (!flag) {
      this.setState(initialState);
      return;
    }
    this.setState({
      editingFlag: flag,
      editingFlagParent: flag.parent
    });
  };

  handleEditFlagSubmit = (flagData) => {
    const { updateFlag, appId } = this.props;

    updateFlag({
      ...flagData,
      appId
    }).then(() => {
      message.success('保存成功');
      this.props.fetchFlags(this.props.appId);
    }).catch(() => {
      message.error('保存失败');
    });
  };

  handleAdd = (item, { fakeId }) => {
    const nodeData = {
      id: fakeId,
      name: 'new',
      nameZh: '新增节点',
      path: item ? item.path.concat(fakeId) : [fakeId],
      isFake: true,
      parent: item,
      pid: item ? item.id : 0,
      riskLevel: item ? item.riskLevel : '',
      isApplicable: 1
    };

    if (item) {
      const {
        children,
      } = item;

      let childrenData = [];
      if (children) {
        childrenData = [nodeData, ...children];
      } else {
        childrenData.push(nodeData);
      }

      this.props.addFakeFlag({
        ...item,
        children: childrenData,
      });
    } else {
      this.props.addFakeFlag(nodeData);
    }

    this.handleEdit(nodeData);
  };

  handleDel = (item) => {
    const {
      delFlag,
      appId
    } = this.props;
    const { editingFlag } = this.state;

    delFlag({
      ...item,
      appId
    });

    if (editingFlag && editingFlag.path.indexOf(item.id) !== -1) {
      this.setState({
        editingFlag: null,
        editingFlagParent: {
          name: ''
        },
      });
    }
  };

  handleFetchRelevantUser = (username = '', page = 1) => {
    return this.props.getRelevantUser({
      appId: this.props.appId,
      id: this.state.editingFlag.id,
      username,
      page
    }).then(data => {
      this.setState({
        userList: data
      });
    });
  }

  handleRelevantUser = (usernames) => {
    return this.props.relevantUser({
      appId: this.props.appId,
      flagId: this.state.editingFlag.id,
      usernames,
    });
  }

  handleUnRelevantUser = (userIds) => {
    return this.props.unRelevantUser({
      appId: this.props.appId,
      flagId: this.state.editingFlag.id,
      userIds,
    });
  }

  handleCancelUser = () => {
    return this.props.clearRelevantUser({
      appId: this.props.appId,
      flagId: this.state.editingFlag.id
    });
  }

  relevantUser = () => {
    this.handleFetchRelevantUser().then(() => {
      this.openModal();
    });
  }

  openModal = () => {
    this.setState({
      visible: true
    });
  };

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  handleExport = () => {
    let query = [
      `appId=${this.props.appId}&templateType=3`
    ];
    window.open(`${apiHost}/v2/flag/list/export?${query}`);
  };
  uploadTemplate = () => {
    let query = [
      `appId=${this.props.appId}&templateType=1`
    ];
    window.open(`${apiHost}/v2/flag/list/export?${query}`);
  };
  modifyTemplate = () => {
    let query = [
      `appId=${this.props.appId}&templateType=2`
    ];
    window.open(`${apiHost}/v2/flag/list/export?${query}`);
  };

  alterRoleModal = () => {
    Promise.all([
      this.props.fetchRolelabelListALL(this.props.appId),
      this.props.fetchBindFlagRoleList({
        appId: this.props.appId,
        flagId: this.state.editingFlag.id,
      })
    ]).then(() => {
      this.setState({
        roleModalVisible: true
      });
    });
  }

  handleCancelRoleModal = (visible) => {
    this.setState({
      roleModalVisible: visible
    })
  }

  submitRole = (selected) => {
    const params = {
      appId: selected.appId,
      flagId: selected.flagId,
      roleIds: selected.selectedRows.map(item => item.value)
    };
    this.setState({
      confirmLoading: true
    });
    this.props.updateRoleFlag(params).then(() => {
      message.success('绑定成功');
      this.setState({
        roleModalVisible: false,
        confirmLoading: false
      });
    }).catch(() => {
      this.setState({
        confirmLoading: false
      });
    })
  }

  handleChange = (selectedRows) => {
    this.setState({
      selectedRoleRows: selectedRows
    });
  }

  render () {
    const {
      flagList,
      addFakeFlag,
      appId,
      t
    } = this.props;

    const { editingFlagParent, editingFlag, roleModalVisible } = this.state;
    const successCb = this.fetchAppFlags;
    const propsForAddUpload = {
      name: 'file',
      accept: SHEET_TYPE,
      action: apiHost + '/v2/flag/list/import',
      headers: {},
      withCredentials: true,
      data: {
        appId,
        opType: 1
      },
      onChange (info) {
        const {
          file: {
            status,
            response
          }
        } = info;

        if (status === 'done') {
          if (response.code == 200) {
            message.success(t('批量新增成功！'));
            successCb();
          } else {
            message.error(response.msg);
          }
        } else if (status === 'error') {
          // 服务端返回 error 显示需要在 info.event 寻找
          message.error(t('批量新增失败！'));
        }
      },
    };
    const propsForUpdateUpload = {
      name: 'file',
      accept: SHEET_TYPE,
      action: apiHost + '/v2/flag/list/import',
      headers: {},
      withCredentials: true,
      data: {
        appId,
        opType: 2
      },
      onChange (info) {
        const {
          file: {
            status,
            response
          }
        } = info;

        if (status === 'done') {
          if (response.code == 200) {
            message.success(t('批量修改成功！'));
            successCb();
          } else {
            message.error(response.msg);
          }
        } else if (status === 'error') {
          // 服务端返回 error 显示需要在 info.event 寻找
          message.error(t('批量修改失败！'));
        }
      },
    };

    return (
      <div className="ManageFlags">
        <Card title={<CardTitle title={t('标识位管理')} sub={<span><span>{t('(在系统中任意自定义的权限点都可以用标识位来标识出来。建议跟系统的研发同学共同定义好其含义和作用，以确保在鉴权时生效可用。大多数用来自定义一些非标准、灵活度较大的权限点。比如只有绑定了某个自定义标识位的用户，才可以看到一个按钮。) ')}</span><span className="upm-card-title--hint">{t('注：优先录入父级菜单，再根据模板录入子菜单')}</span></span>}></CardTitle>} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('目标系统：')}>
                <AvailableApps
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type="primary"
                  className="btn"
                  onClick={this.fetchAppFlags}>
                  {t('查询')}
                </Button>
                <Button
                  type="primary"
                  className="btn"
                  onClick={this.handleExport}>
                  {t('导出')}
                </Button>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem>
                <Button type="link" onClick={this.uploadTemplate}>
                  {t('新增模板下载')}
                </Button>

                <Upload {...propsForAddUpload} className="add-uploader">
                  <Button
                    disabled={!appId}
                    type="primary"
                    className="btn ">
                    {t('批量新增')}
                  </Button>
                </Upload>

                <Button type="link" onClick={this.modifyTemplate}>
                  {t('修改模板下载')}
                </Button>

                <Upload {...propsForUpdateUpload} className="add-uploader">
                  <Button
                    type="primary"
                    className="btn"
                    disabled={!appId}>
                    {t('批量修改')}
                  </Button>
                </Upload>
              </FormItem>
            </Col>
            {/*<Col span={8}>*/}
            {/*<FormItem label="标识位：">*/}
            {/*<Input placeholder="选中了进入编辑状态？不支持模糊搜索, 可以用antd自带功能" />*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            {/*<Col span={8}>*/}
            {/*<FormItem label="中文名：">*/}
            {/*<Input/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
          </Row>
        </Card>

        <Card title={t('标识位列表')} bordered={false} className="ManageFlags-list">
          <Row gutter={24} className="">
            <Col span={12}>
              <EditableTree
                data={flagList}
                requestAdd={this.handleAdd}
                requestDel={this.handleDel}
                requestSelect={this.handleEdit}
                isNeedSearch={true}
              />
            </Col>

            {flagList.length > 0 ? (
              <Col span={12} style={{ display: editingFlag ? '' : 'none' }}>
                <h4>{t('详情编辑')}</h4>

                <Button
                  type="primary"
                  onClick={this.relevantUser}
                  disabled={!editingFlag}
                >{t('用户绑定')}</Button>

                <Button
                  type="primary"
                  onClick={() => {
                    this.alterRoleModal();
                  }}
                  disabled={!editingFlag}
                  style={{ marginLeft: '30px' }}
                >
                  {t('绑定角色')}
                </Button>

                <EditForm
                  t={t}
                  editingFlag={editingFlag}
                  editingFlagParent={editingFlagParent}
                  requestSubmit={this.handleEditFlagSubmit}
                  flagList={flagList}
                />
              </Col>
            ) : (
                <span />
              )}
          </Row>
        </Card>
        <UserModal
          visible={this.state.visible}
          name={this.state.roleGroupName}
          userList={this.state.userList}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          fetchRelevantUser={this.handleFetchRelevantUser}
          relevantUser={this.handleRelevantUser}
          unRelevantUser={this.handleUnRelevantUser}
          cancelUser={this.handleCancelUser}
        />

        {
          roleModalVisible && <RoleChoice
            t={t}
            title={t('角色选择')}
            modalVisible={roleModalVisible}
            confirmLoading={this.state.confirmLoading}
            onCancel={() => this.handleCancelRoleModal(false)}
            submit={(params) => this.submitRole(params)}
            handleChange={(selectedRows) => this.handleChange(selectedRows)}
            flagId={editingFlag && editingFlag.id}
            type="flagRoleList"
          ></RoleChoice>
        }
      </div>
    );
  }
}

export default connect(({ flags, global }) => {
  return {
    flagList: flags.list,
    appId: global.managingApp
  };
}, (dispatch) => ({
  fetchFlags (appId) {
    dispatch({
      type: 'flags/fetch',
      payload: appId
    });
  },
  addFakeFlag (flag) {
    dispatch({
      type: 'flags/addFakeFlag',
      payload: flag
    });
  },
  updateFlag (params) {
    return dispatch({
      type: 'flags/updateFlag',
      payload: params
    });
  },
  delFlag (params) {
    dispatch({
      type: 'flags/delFlag',
      payload: params
    });
  },
  relevantUser (params) {
    return dispatch({
      type: 'flags/relevantUser',
      payload: params
    });
  },
  unRelevantUser (params) {
    return dispatch({
      type: 'flags/unRelevantUser',
      payload: params
    });
  },
  clearRelevantUser (params) {
    return dispatch({
      type: 'flags/clearRelevantUser',
      payload: params
    });
  },
  getRelevantUser (params) {
    return dispatch({
      type: 'flags/getRelevantUser',
      payload: params
    });
  },
  fetchRoleList (params) {
    return dispatch({
      type: 'feature/fetchRoleList',
      payload: params
    });
  },
  updateRoleFlag (params) {
    return dispatch({
      type: 'flags/updateRoleFlag',
      payload: params
    })
  },
  fetchBindFlagRoleList (params) {
    return dispatch({
      type: 'flags/fetchBindFlagRoleList',
      payload: params
    })
  },
  fetchRolelabelListALL (appId) {
    dispatch({
      type: 'role/fetchRolelabelListALL',
      payload: {
        appId
      }
    });
  },
}))(ManageFlags);
