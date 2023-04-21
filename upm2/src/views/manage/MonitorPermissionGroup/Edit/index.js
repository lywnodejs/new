import React, { Component } from 'react';
import { Form, Input, Select, Button, Card, message, TreeSelect, Icon } from 'antd';
import NSTreeSelect from '../../../../components/NSTreeSelect';
import connect from '@utils/translateConnect';

import ContentCard from '../../../../components/ContentCard';

import { MANAGE } from '@routes/config';
import { routerRedux } from 'dva/router';

import './editForm.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;


const formItemLayout = {
  labelCol: {
    span: 4,
    offset: 0
  },
  wrapperCol: {
    span: 10,
    offset: 0
  }
};
const submitItemLayout = {
  labelCol: {
    span: 4,
    offset: 0
  },
  wrapperCol: {
    span: 10,
    offset: 4
  }
};
const spaceItemLayout = {
  labelCol: {
    span: 4,
    offset: 0
  },
  wrapperCol: {
    span: 10,
    offset: 0
  }
};

const permissionLayout = {
  labelCol: {
    span: 4,
    offset: 0
  },
  wrapperCol: {
    span: 18,
    offset: 0
  }
}

const levelEnum = ['role', 'namespace', 'region', 'approver'];
const validateStatusEnum = ['success', 'success', 'warning', 'error', 'validating'];
const permissionHelpEnum = ['', '请添加权限'];

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
      help: '',
      permissionValidateStatus: [],
      odinApproverLists: [],
      nstreeModelIndex: -1
    };
  }

  sysOptions = []
  odinRoleOptions = []
  woatorRoleOptions = []
  woatorRegionNodes = []
  bamaiRoleOptions = []

  componentWillMount() {
    this.fetchWoaterTree();
    this.fetchBamaiTree();
    this.fetchGroupInfo();

    this.setOptions(this.props);
  }

  componentWillUnmount() {
    this.resetGroupInfo();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const isValid = this.validatePermissions();
    this.validateForm(isValid);
  }

  handleClickAdd = () => {
    this.addNewPermission();
    this.setPermissionsHelp(0);
  }

  handleClickDelete = (index) => {
    this.deletePermission(index);
    this.setPermissionsHelp(0);
  }

  handleChangeSys = (id, index) => {
    this.changeSys(id, index);
    this.setPermissionsHelp(0);
  }

  handleChangeLevel = (value, type, index) => {
    this.changeLevel(value, type, index);
    this.setPermissionsHelp(0);
  }

  handleClickCancel = () => {
    const { dispatch } = this.props;

    dispatch(
      routerRedux.push(`${MANAGE}/monitorPermissionGroup`),
    );
  }

  handleNSSelectClick = (index) => {
    const state = {
      ...this.state,
      nstreeModelIndex: index
    };
    this.setState(state);
  }

  handleNSModalOK = (nsList, index) => {
    this.handleChangeLevel(nsList, 'namespace', index !== undefined ? index : this.state.nstreeModelIndex);

    const state = {
      ...this.state,
      nstreeModelIndex: -1
    };
    this.setState(state);
  }

  handleNSModalCancel = () => {
    const state = {
      ...this.state,
      nstreeModelIndex: -1
    };
    this.setState(state);
  }

  validatePermissions = () => {
    const {
      permissions
    } = this.state;

    const hasPermission = this.checkHavingPermission();
    let isValid = hasPermission;

    if (hasPermission) {
      const validStatusArr = this.getInvalidPermissions(permissions);
      isValid = validStatusArr.length === 0;
      if (!isValid) {
        this.setPermissionsHelp(`请修改第${validStatusArr.join(',')}条信息`);
      }
    }

    return isValid;
  }

  checkHavingPermission = () => {
    const {
      permissions
    } = this.state;

    const hasPermission = permissions.length > 0;
    if (!hasPermission) {
      this.setPermissionsHelp(1);
    }

    return hasPermission;
  }

  validateForm = (isValid) => {
    const {
      form: { validateFields, resetFields },
      dispatch,
    } = this.props;
    const {
      permissions
    } = this.state;
    let group = [];

    permissions.forEach(item => {
      if (item.params.namespace && item.params.namespace.map) {
        group = group.concat(item.params.namespace.map(nsItem => ({
          ...item,
          params: {
            ...item.params,
            namespace: nsItem
          }
        })))
      } else {
        group = group.concat(item)
      }
    })

    validateFields((err, { id, name, description }) => {
      if (!err && isValid) {
        const action = {
          type: 'monitorPermissionGroup/modifyGroup',
          payload: {
            id,
            name,
            desc: description,
            group
          }
        };
        dispatch(action).then(() => {
          this.fetchData();
          message.success('修改成功', 2, () => {
            resetFields();
            dispatch(
              routerRedux.push(`${MANAGE}/monitorPermissionGroup`),
            );
          });
        });
      }
    });
  }

  deletePermission = (index) => {
    const { permissions, permissionValidateStatus, odinApproverLists } = this.state;

    permissions.splice(index, 1);
    permissionValidateStatus.splice(index, 1);
    odinApproverLists.splice(index, 1);

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  }

  changeSys = (id, index) => {
    const { permissions, permissionValidateStatus, odinApproverLists } = this.state;

    let permission = permissions[index];
    permission.sysId = parseInt(id);
    permission.params = {};

    permissionValidateStatus[index] = levelEnum.map(() => 0);
    permissionValidateStatus[index].unshift(0);

    odinApproverLists[index] = [];

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  }

  changeLevel = (value, type, index) => {
    const { permissions, permissionValidateStatus, odinApproverLists } = this.state;

    let permission = permissions[index];
    if (permission.params.approver) {
      permission.params.approver = '';
    }
    permission.params = {
      ...permission.params,
      [type]: value
    };

    permissionValidateStatus[index][levelEnum.indexOf(type)] = 0;

    odinApproverLists[index] = [];

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);

    if (type !== 'approver' &&
        permission.sysId == 182 &&
        permission.params.role &&
        permission.params.namespace) {
      this.fetchApproverList(permission.params.role, permission.params.namespace, index);
    }
  }

  redirectTo = (path) => {
    const { dispatch } = this.props;

    const action = {
      type: 'monitorPermissionGroup/redirect',
      payload: {
        path
      }
    };
    dispatch(action);
  }

  resetGroupInfo = () => {
    const { dispatch } = this.props;

    const action = {
      type: 'resetGroupInfo',
      payload: {}
    };
    dispatch(action);
  }

  setOptions = (props) => {
    const {
      odinRoles,
      sysList
    } = props;
    this.sysOptions = this.getOptions(sysList);
    this.odinRoleOptions = this.getOptions(odinRoles);
  }

  addNewPermission = () => {
    let { permissions, permissionValidateStatus, odinApproverLists } = this.state;
    const { sysList } = this.props;

    const newPermission = {
      sysId: sysList[0].id,
      params: {}
    };
    permissions.push(newPermission);

    let newPermissionValidateStatus = levelEnum.map(() => 0);
    permissionValidateStatus.push(newPermissionValidateStatus);

    odinApproverLists.push([]);

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  }

  setPermissionsHelp = (helpParam) => {
    let help = '';
    if (typeof helpParam === 'number') {
      help = permissionHelpEnum[helpParam] || '';
    } else if (typeof helpParam === 'string') {
      help = helpParam;
    }
    const state = {
      ...this.state,
      help
    };
    this.setState(state);
  }

  fetchGroupInfo = () => {
    const { dispatch, match: { params: { groupId } } } = this.props;
    const action = {
      type: 'monitorPermissionGroup/fetchGroupInfo',
      payload: { groupId }
    };
    dispatch(action).then((group) => {
      this.setInfo(group);
      this.fetchInitApproverList(group);
    });
  }

  fetchInitApproverList = (group) => {
    group.forEach((item, index) => {
      if (item.sysId == 1) {
        this.fetchApproverList(item.params.role, item.params.namespace, index);
      }
    });
  }

  fetchWoaterTree = () => {
    const { dispatch, woaterRoleList, woaterRegionTree, sysList } = this.props;
    if (!woaterRoleList || !woaterRoleList.length || woaterRoleList.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[1].id,
          key: 'role'
        }
      };
      dispatch(action).then((newwoaterRoleList) => {
        this.woatorRoleOptions = this.getOptions(newwoaterRoleList);
      });
    } else {
      this.woatorRoleOptions = this.getOptions(woaterRoleList);
    }
    if (!woaterRegionTree || !woaterRegionTree.length || woaterRegionTree.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[1].id,
          key: 'region'
        }
      };
      dispatch(action).then((newwoaterRegionTree) => {
        this.woatorRegionNodes = this.getNodes(newwoaterRegionTree);
      });
    } else {
      this.woatorRegionNodes = this.getNodes(woaterRegionTree);
    }
  }

  fetchBamaiTree = () => {
    const { dispatch, bamaiRoleList, sysList } = this.props;
    if (!bamaiRoleList || !bamaiRoleList.length || bamaiRoleList.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[2].id,
          key: 'role'
        }
      };
      dispatch(action).then((newBamaiRoleList) => {
        this.bamaiRoleOptions = this.getOptions(newBamaiRoleList);
      });
    } else {
      this.bamaiRoleOptions = this.getOptions(bamaiRoleList);
    }
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorPermissionGroup/fetchList',
      payload: {}
    };
    dispatch(action);
  }

  fetchApproverList = (role, nsList, index) => {
    const { dispatch } = this.props;

    const action = {
      type: 'monitorPermissionGroup/fetchOdinApprover',
      payload: {
        role: this.getOdinRoleMark(role),
        nsList: nsList.join('%0A')
      }
    };
    dispatch(action).then((res) => {
      const { odinApproverLists } = this.state;
      odinApproverLists[index] = res;
      const state = {
        ...this.state,
        odinApproverLists
      };
      this.setState(state);
    });
  }

  setInfo = (group = []) => {
    const state = {
      ...this.state,
      permissions: group,
      permissionValidateStatus: Array(group.length).fill([0, 0, 0, 0, 0].slice()),
      odinApproverLists: Array(group.length).fill([])
    };
    this.setState(state);
  }

  getOdinRoleMark = (id) => {
    const { odinRoles } = this.props;

    for (let i = 0;i < odinRoles.length;i++) {
      if (odinRoles[i].id == id) return odinRoles[i].mark;
    }

    return '';
  }

  isValidOdinPermission = (params, index) => {
    let { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
    }
    if (!(params.namespace && typeof params.namespace.length === 'number' && params.namespace.length > 0)) {
      permissionValidateStatus[index][levelEnum.indexOf('namespace')] = 3;
    }
    if (!params.approver) {
      permissionValidateStatus[index][levelEnum.indexOf('approver')] = 3;
    }

    const state = {
      ...this.state,
      permissionValidateStatus
    };
    this.setState(state);

    return params &&
      (params.namespace &&
        typeof params.namespace.length === 'number' &&
        params.namespace.length > 0) &&
      params.role &&
      params.approver;
  }

  isValidWoatorPermission = (params, index) => {
    const { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
    }
    if( !params.region) {
      permissionValidateStatus[index][levelEnum.indexOf('region')] = 3;
    }
    const state = {
      ...this.state,
      permissionValidateStatus
    };
    this.setState(state);

    return params && params.role && params.region;
  }

  isValidBamaiPermission = (params, index) => {
    const { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
      const state = {
        ...this.state,
        permissionValidateStatus
      };
      this.setState(state);
    }

    return params && params.role;
  }

  isValidPermission = (permission, index) => {
    const map = {
      182: this.isValidOdinPermission,
      685: this.isValidWoatorPermission,
      302: this.isValidBamaiPermission
    };

    return permission.sysId && map[permission.sysId](permission.params, index);
  }

  getInvalidPermissions = (permissions) => {
    let list = [];
    permissions.forEach((item, index) => {
      if (!this.isValidPermission(item, index)) {
        list.push(index + 1);
      }
    });

    return list;
  }

  getNodes = (tree, value = 'id', title = 'name') => {
    return tree.map((item, index) => (
      <TreeNode
        key={index}
        value={item[value]}
        key={item[value]}
        title={item[title]}
      >
      {
        item.children && this.getNodes(item.children, value, title)
      }
      </TreeNode>
    ));
  }

  getOptions = (list, value = 'id', title = 'name') => {
    return list.map((item, index) => (
      <Option key={index} value={item[value]}>{item[title]}</Option>
    ));
  }

  getBamaiPermissionSelect = (permissionItem, index) => {
    const {
      t,
      bamaiRoleList
    } = this.props;
    const {
      permissionValidateStatus
    } = this.state;

    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('role')]]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            size="small"
            className="select"
            placeholder="请选择"
            value={permissionItem.params.role ? parseInt(permissionItem.params.role) : ''}
            onChange={(value) => this.handleChangeLevel(value, 'role', index)}
          >
            { bamaiRoleList && this.bamaiRoleOptions }
          </Select>
        </FormItem>
      </React.Fragment>
    );
  }

  getWoaterPermissionSelect = (permissionItem, index) => {
    const {
      t,
      woaterRoleList,
      woaterRegionTree,
    } = this.props;
    const {
      permissionValidateStatus
    } = this.state;
    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('role')]]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            size="small"
            className="select"
            key="woaterlist"
            value={permissionItem.params.role ? parseInt(permissionItem.params.role) : ''}
            placeholder="请选择"
            onChange={(value) => this.handleChangeLevel(value, 'role', index)}
          >
            { woaterRoleList && this.woatorRoleOptions }
          </Select>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('权限地区')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('region')]]}
        >
          <TreeSelect
            showSearch
            treeNodeFilterProp="title"
            key="woatertree"
            value={permissionItem.params.region ? parseInt(permissionItem.params.region) : ''}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
            placeholder="请选择"
            size="small"
            source={woaterRegionTree}
            nodeValue="id"
            nodeTitle="name"
            className="select"
            onChange={(value) => this.handleChangeLevel(value, 'region', index)}
          >
            { woaterRegionTree && this.woatorRegionNodes }
          </TreeSelect>
        </FormItem>
      </React.Fragment>
    );
  }

  getOdinPermissionSelect = (permissionItem, index) => {
    const {
      t,
      odinRoles
    } = this.props;
    const {
      permissionValidateStatus,
      odinApproverLists,
    } = this.state;
    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('NS')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('namespace')]]}
        >
          <div
            className="odin_ns_select_container"
            onClick={() => this.handleNSSelectClick(index)}
          >
            <Select
              size="small"
              mode="multiple"
              placeholder="请选择"
              className="select"
              onChange={(value) => this.handleNSModalOK(value, index)}
              value={permissionItem.params.namespace || []}
              open={false}
            >
            </Select>
            {/* <div
              className="odin_ns_select_mask"
              onClick={() => this.handleNSSelectClick(index)}
            ></div> */}
          </div>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('role')]]}
        >
          <Select
            size="small"
            className="select"
            placeholder="请选择"
            key="odinlist"
            value={permissionItem.params.role || ''}
            onChange={(value) => this.handleChangeLevel(value, 'role', index)}
          >
            { odinRoles && this.odinRoleOptions }
          </Select>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('审批人')}
          validateStatus={validateStatusEnum[permissionValidateStatus[index][levelEnum.indexOf('approver')]]}
        >
          <Select
            size="small"
            className="select"
            placeholder="请选择"
            key="odinApproverLists"
            value={permissionItem.params.approver || ''}
            onChange={(value) => this.handleChangeLevel(value, 'approver', index)}
          >
            {odinApproverLists &&
              odinApproverLists[index] &&
              odinApproverLists[index].map &&
              odinApproverLists[index].map((item, index) => (
              <Option key={index} value={item}>{item}</Option>
            ))}
          </Select>
        </FormItem>
      </React.Fragment>
    );
  }

  getPermissionSelect = (permissionItem, index) => {
    const {
      t,
      sysList
    } = this.props;
    const getMap = {
      182: this.getOdinPermissionSelect,
      685: this.getWoaterPermissionSelect,
      302: this.getBamaiPermissionSelect
    };

    return (
      <div key={index} gutter={24} className="permission">
        <FormItem
          {...permissionLayout}
          label={t('系统名称')}
        >
          <Select
            size="small"
            className="select"
            value={permissionItem.sysId}
            onChange={(value) => this.handleChangeSys(value, index)}
          >
            { sysList && this.sysOptions }
          </Select>
        </FormItem>
        {permissionItem.sysId && getMap[permissionItem.sysId](permissionItem, index)}
        <Icon
          className="close"
          onClick={() => this.handleClickDelete(index)}
          type="close"
        />
      </div>
    );
  }

  render() {
    const {
      t,
      form,
      groupInfo: {
        id,
        name,
        desc,
      }
    } = this.props;
    const {
      permissions,
      help,
      nstreeModelIndex
    } = this.state;
    const { getFieldDecorator } = form;
    const options = {
      id: {
        initialValue: id,
        rules: [{
          required: true
        }]
      },
      name: {
        initialValue: name,
        rules: [{
          required: true,
          message: '请输入权限组名称'
        }]
      },
      description: {
        initialValue: desc,
      }
    };
    return (
      <React.Fragment>
        <ContentCard title={t('编辑权限组')} className="monitor_permission_manage_eidt">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={t('权限组标识符')}
            >
              {getFieldDecorator('id', options.id)(
                <Input
                  disabled
                  placeholder="请输入权限组标识"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('权限组名称')}
            >
              {getFieldDecorator('name', options.name)(
                <Input placeholder="请输入权限组名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('权限组描述')}
            >
              {getFieldDecorator('description', options.description)(
                <TextArea placeholder="请输入权限组描述" rows="4" style={{resize: 'none'}} />
              )}
            </FormItem>
            <FormItem
              {...spaceItemLayout}
              required
              help={help}
              label={t('定义权限组')}
            >
              <Card className="card">
                <p className="tip">权限组是 ODIN、ODIN SRM、Woator 实时监控、TPCC 工单监控、把脉的聚合权限。</p>
                <div className="customContainer">
                  {permissions && permissions.map && permissions.map((permissionItem, index) =>
                    this.getPermissionSelect(permissionItem, index)
                  )}
                  <Button
                    type="primary"
                    className="add"
                    ghost
                    onClick={this.handleClickAdd}
                  >新增</Button>
                </div>
              </Card>
            </FormItem>
            <FormItem
              {...submitItemLayout}
            >
              <Button htmlType="submit" type="primary">确定</Button>
              <Button className="cancel" onClick={this.handleClickCancel}>取消</Button>
            </FormItem>
          </Form>
        </ContentCard>
        <NSTreeSelect
          visible={typeof nstreeModelIndex === "number" && nstreeModelIndex !== -1}
          onOk={this.handleNSModalOK}
          onCancel={this.handleNSModalCancel}
          value={permissions[nstreeModelIndex] && permissions[nstreeModelIndex].params.namespace}
        />
      </React.Fragment>
    );
  }
}

export default connect(({ monitorPermissionGroup }) => {
  const {
    odinRoles,
    sysList,
    woaterRoleList,
    woaterRegionTree,
    bamaiRoleList,
    groupInfo
  } = monitorPermissionGroup;
  return {
    odinRoles,
    sysList,
    woaterRoleList,
    woaterRegionTree,
    bamaiRoleList,
    groupInfo
  };
})(Form.create()(Edit));
