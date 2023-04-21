import React, { Component } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import connect from '@utils/translateConnect';

import ContentCard from '../../../../../components/ContentCard';

import './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 3,
    offset: 0
  },
  wrapperCol: {
    span: 5,
    offset: 0
  }
};
const submitItemLayout = {
  labelCol: {
    span: 3,
    offset: 0
  },
  wrapperCol: {
    span: 5,
    offset: 3
  }
};
const spaceItemLayout = {
  labelCol: {
    span: 3,
    offset: 0
  },
  wrapperCol: {
    span: 10,
    offset: 0
  }
};

export class Copy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchUserInfo();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      form: { validateFields },
      dispatch
    } = this.props;
    validateFields((err, { people, expireAt, reason, groups }) => {
      if (!err) {
        const action =  {
          type: 'monitorDataUser/copyGroups',
          payload: {
            usernames: people,
            expireAt,
            reason,
            groups
          }
        }
        dispatch(action).then((res) => {
          if (res.code === 100) {
            message.success('复制成功')
          } else {
            message.warning('复制失败')
          }
        })
      }
    })
  }

  fetchUsers = () => {
    const { dispatch, users } = this.props;
    if (!users || users.length === 0) {
      const action = {
        type: 'monitorDataUser/fetchMembers',
        payload: {}
      };
      dispatch(action)
    }
  }

  fetchUserInfo = () => {
    const { dispatch, match: { params: username } } = this.props;
    const action = {
      type: 'monitorDataUser/fetchUserInfo',
      payload: {
        username
      }
    };
    dispatch(action).then(this.setUserInfo);
  }

  setUserInfo = (userInfo) => {
    const {
      groups
    } = userInfo;
    const state = {
      ...this.state,
      groups
    };
    this.setState(state);
  }

  render() {
    const {
      t,
      form,
      users
    } = this.props;
    const {
      groups
    } = this.state;
    const { getFieldDecorator } = form;
    const defaultGroups = groups.map(item => `${item.id}`);
    const options = {
      type: {
        rules: [{
          required: true,
          message: '请选择申请类型'
        }]

      },
      people: {
        rules: [{
          required: true,
          message: '请选择申请人'
        }]
      },
      groups: {
        initialValue: defaultGroups,
        rules:[{
          required: true
        }]
      },
      expireAt: {
        rules: [{
          required: true,
          message: '请选择失效日期'
        }]
      },
      reason: {
        rules: [{
          required: true,
          message: '请输入申请理由'
        }]

      }
    }
    const userOptions = users.map(item => (
      <Option key={item.username}>{item.username}</Option>
    ));
    const groupOptions = groups.map(item => (
      <Option key={item.id}>{`${item.name}`}</Option>
    ));
    return (
      <ContentCard className="monitor-data-user-copy" title={t('复制所有权限')}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            required
            {...formItemLayout}
            label={t('系统')}
          >
            <Select value={1} disabled>
              <Option value={1}>滴滴监控</Option>
            </Select>
          </FormItem>
          <FormItem
            required
            {...formItemLayout}
            label={t('申请类型')}
          >
            <Select value={0} disabled>
              <Option value={0}>权限组</Option>
            </Select>
          </FormItem>
          <FormItem
            {...spaceItemLayout}
            label={t('申请人')}
          >
            {getFieldDecorator('people', options.people)(
              <Select
                mode="multiple"
              >
                { userOptions }
              </Select>
            )}
          </FormItem>
          <FormItem
            required
            {...spaceItemLayout}
            label={t('申请权限组')}
          >
            {getFieldDecorator('groups', options.groups)(
              <Select
                disabled
                mode="multiple"
                placeholder="请选择权限组"
              >
                { groupOptions }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('权限失效日期')}
          >
            {getFieldDecorator('expireAt', options.expireAt)(
              <DatePicker>

              </DatePicker>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('申请理由')}
          >
            {getFieldDecorator('reason', options.reason)(
              <TextArea>

              </TextArea>
            )}
          </FormItem>
          <FormItem
            {...submitItemLayout}
          >
            <Button
              type="primary"
              htmlType="submit"
            >提交</Button>
            <Button>查看审批流程</Button>
          </FormItem>
        </Form>
      </ContentCard>
    )
  };
}

export default connect(({ monitorDataUser }) => {
  const {
    members
  } = monitorDataUser;
  return {
    users: members,
  }
})(Form.create()(Copy));
