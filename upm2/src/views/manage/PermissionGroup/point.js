import React from 'react';
import connect from '@utils/translateConnect';
import { Form, Card, Row, Col, Select, Button, Tree, message } from 'antd';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const APPID = 888;

class PermissionGroupPoint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ''
    }
  }

  componentWillMount = () => {
    const { dispatch } = this.props;
    const groupId = this.getPermissionGroupID()
    const name = this.getGroupName(groupId)
    this.setState({
      title: name.length ? name[0].name : ''
    })
    dispatch({
      type: 'permissionGroup/fetchPermissionSystemAndPoint',
      payload: {
        groupId,
        appId: APPID
      }
    })
  }

  getPermissionGroupID = () => {
    const query = {}
    location.search === '' ? null : location.search.split('?')[1].split('&').forEach(i => query[i.split('=')[0]] = i.split('=')[1])
    return Number(query.id)
  }

  getGroupName = (id) => {
    const { permissionGroupList } = this.props;
    const {
      records=[]
    } = permissionGroupList
    return records.filter(i => i.id === id)
  }

  renderSelectPoint = () => {
    const { selectSubsystem, subsystemPoint } = this.props
    const systemNode = []

    for(let k of selectSubsystem) {
      const obj = subsystemPoint[k]
      if (!obj) continue;

      systemNode.push(
        (<TreeNode title={obj.name} key={`${obj.id.toString()}-`}>
          {obj.role.length ? <TreeNode title='角色'>{renderPointNode(obj.role, 'r')}</TreeNode> : null}
          {obj.rolegroup.length ? <TreeNode title='角色组'>{renderPointNode(obj.rolegroup, 'g')}</TreeNode> : null}
        </TreeNode>)
      )
    }
    return systemNode

    function renderPointNode(list, type) {
      return list.map(i => (<TreeNode title={i.name} key={`${i.id.toString()}${type}`}></TreeNode>))
    }
  }

  handleSelectChange = (data) => {
    const { dispatch } = this.props;
    const groupId = this.getPermissionGroupID()
    dispatch({
      type: 'permissionGroup/saveSelectSubsystem',
      payload: {
        data,
        groupId,
        appId: APPID
      }
    })
  }

  onTreeCheck = (selectPoint, info) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permissionGroup/saveSelectPoint',
      payload: {
        selectPoint
      }
    })
  }

  // 非叶子节点都有'-'，自动生成，或者是有意带上的标识
  // role的节点的id带有r，roleGroup节点的id带有g，所以需要过滤
  persist = () => {
    const { dispatch, selectSubsystem, selectPoint } = this.props;
    const groupId = this.getPermissionGroupID()
    const leafPoint = selectPoint.filter(i => i.indexOf('-') < 0)
    const params = {
      appId: APPID,
      privilegeGroupId: groupId,
      appIdRels: {
        [groupId]: selectSubsystem
      },
      roleIdRels: {
        [groupId]: leafPoint.filter(i => i.indexOf('r') > 0).map(i => Number(i.split('r')[0]))
      },
      roleGroupRels: {
        [groupId]: leafPoint.filter(i => i.indexOf('g') > 0).map(i => Number(i.split('g')[0]))
      }
    }
    dispatch({
      type: 'permissionGroup/managePermissionPoint',
      payload: params
    })
    .then(() => {
      message.info('保存成功')
      dispatch(routerRedux.push(`${MANAGE}/permissionGroup/list`))
    })
  }

  returnList = () => {
    const { dispatch } = this.props

    dispatch(routerRedux.push(`${MANAGE}/permissionGroup/list`))
  }

  render () {
    const { t, availableApps, selectSubsystem: defaultValue, selectPoint } = this.props
    const { title } = this.state

    return (
      <div className="ManagePermissionGroupPoint">
        <Card title={`权限管理(权限组：${title})`} bordered={false} extra={<Button onClick={this.returnList}>返回列表</Button>}>
          <Row gutter={24} className="search-fields">
            <Col span={24}>
              <FormItem label={t('选择系统')}>
              <Select
                value={defaultValue}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="选择系统"
                onChange={this.handleSelectChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {availableApps.map(i => (<Option key={i.id} value={i.id}>{i.name}</Option>))}
              </Select>
              </FormItem>
            </Col>
          </Row>
          
          <Tree
            checkedKeys={selectPoint}
            checkable
            onCheck={this.onTreeCheck}>
            {this.renderSelectPoint()}
          </Tree>
          <Button className="btn" type="primary" onClick={this.persist}>提交</Button>
        </Card>
      </div>
    );
  }
}

// export default PermissionGroupPoint;
export default connect(({ global, permissionGroup }) => {
  return {
    availableApps: global.availableApps,
    selectPoint: permissionGroup.selectPoint,
    subsystemPoint: permissionGroup.subsystemPoint,
    selectSubsystem: permissionGroup.selectSubsystem,
    permissionGroupList: permissionGroup.permissionGroupList
  };
})(PermissionGroupPoint);
