import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Table, Popover, message } from 'antd';

import connect from '@utils/translateConnect';

import './index.less';

const FormItem = Form.Item;

class MonitorPermissionGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mark: '',
      name: '',
      filterList: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { dispatch, permissionGroups } = this.props;
    if (!permissionGroups || permissionGroups.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchList',
        payload: {}
      };
      dispatch(action)
        .then(this.setDefault);
    } else {
      this.setDefault(permissionGroups);
    }
  }

  setDefault = (permissionGroups) => {
    const state = {
      ...this.state,
      filterList: permissionGroups
    };
    this.setState(state);
  }

  handleSearchClick = () => {
    const state = {
      ...this.state,
      filterList: this.getMacth()
    };
    this.setState(state);
  }

  handleNewClick = () => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorPermissionGroup/redirect',
      payload: {
        path: './monitorPermissionGroup/new'
      }
    };
    dispatch(action);
  }

  handleEditClick = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorPermissionGroup/redirect',
      payload: {
        path: './monitorPermissionGroup/edit/' + id
      }
    };
    dispatch(action);
  }

  handleDeleteClick = (id) => {
    const {
      dispatch,
      permissionGroups
    } = this.props;
    const action = {
      type: 'monitorPermissionGroup/deleteOneGroup',
      payload: {
        groupIds: [id]
      }
    };
    dispatch(action)
      .then(() => {
        message.success('删除成功');
        const list = permissionGroups.filter((item) => item.id !== id) || [];
        const action = {
          type: 'monitorPermissionGroup/save',
          payload: {
            list
          }
        };
        dispatch(action);
        this.handleSearchClick();
      });
  }

  handleInput = (value, key) => {
    let state = {
      ...this.state,
      [key]: value
    };
    this.setState(state);
  }

  getColumns = () => ([{
    title: '权限组管理',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '权限组名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '创建时间',
    key: 'createAt',
    render: (item) => {
      let date = new Date(parseInt(item.createdAt));
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`;
    }
  }, {
    title: '操作',
    key: 'actions',
    render: (item) => {
      return (
        <span>
          <Button
           size="small"
            onClick={() => this.handleEditClick(item.id)}
          >编辑</Button>
          <Popover
            trigger="click"
            content={
              <Button
                type="primary"
                onClick={() => this.handleDeleteClick(item.id)}
              >确认删除</Button>
            }
            title="Are you sure?"
          >
            <Button size="small">删除</Button>
          </Popover>
        </span>
      );
    }
  }])

  getMacth = () => {
    const { permissionGroups } = this.props;
    const { mark, name } = this.state;
    // console.log(permissionGroups)
    return permissionGroups
      .filter((item) => String(item.id).match(mark))
      .filter((item) => item.name.match(name));
  }

  render() {
    const {
      t,
    } = this.props;
    const {
      mark,
      name,
      filterList
    } = this.state;

    const columns = this.getColumns();
    const data = filterList;

    return (
      <div className="monitor-permission-group-page">
        <div className="controller-pannel">
          <Row gutter={24} >

            <Col span={12} className="item">
              <FormItem label={t('权限组唯一标识')} className="content">
                <Input
                  value={mark}
                  onChange={(e) => this.handleInput(e.currentTarget.value, 'mark')}
                  className="input"
                  placeholder="请输入关键字进行模糊搜索"
                />
              </FormItem>
            </Col>

            <Col span={12} className="item">
              <FormItem label={t('权限组名称')} className="content">
                <Input
                  value={name}
                  onChange={(e) => this.handleInput(e.currentTarget.value, 'name')}
                  className="input"
                  placeholder="请输入关键字进行模糊搜索"
                />
              </FormItem>
            </Col>

          </Row>

          <Row>

            <Button
              type="primary"
              onClick={this.handleSearchClick}
            >{t('查询')}</Button>

            <Button
              className="btn-mid"
              onClick={this.handleNewClick}
            >{t('新增')}</Button>

          </Row>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

export default connect(({ monitorPermissionGroup }) => {
  const {
    list
  } = monitorPermissionGroup;
  return {
    permissionGroups: list
  };
})(MonitorPermissionGroup);
