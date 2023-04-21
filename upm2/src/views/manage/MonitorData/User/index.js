import React, { Component } from 'react';
import { Row, Col, Form, Input, Card, Select, Button, Table } from 'antd';
import connect from '@utils/translateConnect';

import CardTitle from '@components/CardTitle';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class MonitorDataUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterList: [],
      busnessLine: 0,
      groupId: 0,
      username: '',
      name: '',
      email: ''
    };
  }

  componentDidMount() {
    this.fetchMembers();
    this.fetchBusnessLines();
    this.fetchGroupList()
  }

  handleCopyClick = (username) => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorDataUser/redirect',
      payload: {
        path: `./user/copy/${username}`
      }
    };
    dispatch(action);
  }

  handleEditClick = (groupId) => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorDataUser/redirect',
      payload: {
        path: `./user/copy/${groupId}`
      }
    };
    dispatch(action);
  }

  handleSearchClick = () => {
    this.setDefault(this.getMatch());
  }

  handleChange = (value, key) => {
    const state = {
      ...this.state,
      [key]: value
    };
    this.setState(state);
  }

  fetchMembers = () => {
    const { dispatch, members } = this.props;
    if (!members || members.length === 0) {
      const action = {
        type: 'monitorDataUser/fetchMembers',
        payload: {}
      };
      dispatch(action)
        .then(this.setDefault);
    } else {
      this.setDefault(members)
    }
  }

  fetchGroupList = () => {
    const { dispatch, groupList } = this.props;
    if (!groupList || groupList.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchList',
        payload: {}
      };
      dispatch(action)
    }
  }

  fetchBusnessLines = () => {
    const { dispatch, busnessLines } = this.props;
    if (!busnessLines || busnessLines.length === 0) {
      const action = {
        type: 'monitorDataUser/fetchBusnessLineList',
        payload: {}
      };
      dispatch(action);
    }
  }

  setDefault = (members) => {
    const state = {
      ...this.state,
      filterList: members
    };
    this.setState(state);
  }

  getMatch = () => {
    const { members } = this.props;
    const {
      busnessLine,
      groupId,
      name,
      username,
      email
    } = this.state;
    let filterList = members;
    if (busnessLine !== 0) {
      filterList = filterList.filter((item) =>
        item.busnessLine.id === busnessLine
      )
    }
    if (groupId !== 0) {
      filterList = filterList.filter((item) =>
        item.groups.some((item) => item.id === groupId)
      )
    }
    return filterList
      .filter(item => item.username.match(username))
      .filter(item => item.name.match(name))
      .filter(item => item.email.match(email));
  }

  getColumns = () => ([{
    title: '用户编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '账户',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '业务线',
    key: 'busnessLine',
    render: (item) => {
      return (
        <React.Fragment>
          { item.busnessLine.name }
        </React.Fragment>
      )
    }
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  }, {
    title: '权限组',
    key: 'groups.name',
    render: (item) => {
      return (
        <React.Fragment>
          {item.groups.map((item, index) => (
            <p key={index}>{ item.name }</p>
          ))}
        </React.Fragment>
      )
    }
  }, {
    title: '授权时间',
    key: 'groups.createdAt',
    render: (item) => {
      return (
        <React.Fragment>
          {item.groups.map((item, index) => (
            <p key={index}>{ item.createdAt }</p>
          ))}
        </React.Fragment>
      )
    }
  }, {
    title: '失效时间',
    key: 'groups.expireAt',
    render: (item) => {
      return (
        <React.Fragment>
          {item.groups.map((item, index) => (
            <p key={index}>{ item.expireAt }</p>
          ))}
        </React.Fragment>
      )
    }
  }, {
    title: '操作',
    key: 'actions',
    render: (item) => {
      return (
        <div>
          <Button
            type="dashed"
            onClick={() => this.handleCopyClick(item.username)}
          >复制所有权限组</Button>
        </div>
      );
    }
  }])

  render() {
    const {
      t,
      groupList,
      busnessLines
    } = this.props;
    const {
      filterList,
      busnessLine,
      groupId,
      username,
      name,
      email
    } = this.state;
    const columns = this.getColumns();
    return (
      <div className="container">
        <Card title={ < CardTitle title = {t('用户管理')}> </CardTitle>}  bordered={false}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label={t('目标系统')}>
                <Select
                  disabled
                  value={888}
                  placeholder="请选择目标系统"
                >
                  <Option value={888}>滴滴监控</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('业务线')}>
                <Select
                  placeholder="请选择业务线"
                  value={busnessLine}
                  onChange={(value) => this.handleChange(value, 'busnessLine')}
                >
                  <Option value={0}>全部</Option>
                  {busnessLines && busnessLines.map && busnessLines.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('权限组')}>
                <Select
                  value={groupId}
                  placeholder="请选择权限组"
                  onChange={(value) => this.handleChange(value, 'groupId')}
                >
                  <Option value={0}>全部</Option>
                  {groupList && groupList.map && groupList.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={7}>
              <FormItem label={t('账户')}>
                <Input
                  placeholder="请输入账户"
                  value={username}
                  onChange={(e) => this.handleChange(e.currentTarget.value, 'username')}
                />
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem value={name} label={t('名称')}>
                <Input
                  placeholder="请输入名字"
                  value={name}
                  onChange={e => this.handleChange(e.currentTarget.value, 'name')}
                />
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label={t('邮箱')}>
                <Input
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={e => this.handleChange(e.currentTarget.value, 'email')}
                />
              </FormItem>
            </Col>
            <Col span={1}>
              <FormItem>
                <Button
                  type="primary"
                  onClick={this.handleSearchClick}
                >搜索</Button>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title={t('用户列表')}>
          <Table
            dataSource={filterList}
            columns={columns}
            rowKey="id"
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ monitorDataUser, monitorPermissionGroup }) => {
  const {
    members,
    busnessLines
  } = monitorDataUser;
  const {
    list
  } = monitorPermissionGroup;
  return {
    members,
    groupList: list,
    busnessLines
  };
})(MonitorDataUser);
