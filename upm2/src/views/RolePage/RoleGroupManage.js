/**
 * 角色组管理页面
 * by zhangdi
 *
 */

import React from 'react';
import { Form, Input, Select, Button, Table } from 'antd';

const FormItem = Form.Item,
  Option = Select.Option,
  { Column } = Table;

const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
];

class RoleGroupManage extends React.Component {
  render() {
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <FormItem>
            <Select defaultValue="lucy" style={{ width: 120 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input placeholder="角色标识" />
          </FormItem>
          <FormItem>
            <Input placeholder="角色名称" />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick="addRole">新增</Button>
          </FormItem>
        </Form>
        <Table dataSource={data}>
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
          <Column title="Age" dataIndex="age" key="age" />
          <Column title="Address" dataIndex="address" key="address" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a href="#">Action 一 {record.name}</a>
                <a href="#">Delete</a>
                <a href="#" className="ant-dropdown-link">
                  More actions
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }

  /**
   * 查询角色
   */
  handleSubmit = e => {
    e.preventDefault();
  };

  /**
   * 新增角色
   */
  addRole = () => {};
}

export default RoleGroupManage;
