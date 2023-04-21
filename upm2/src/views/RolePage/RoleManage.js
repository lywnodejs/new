/**
 * 角色管理页面
 * by zhangdi
 *
 */

import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Input, Select, Button, Table } from 'antd';
import SystemList from '../../components/SystemList';

const FormItem = Form.Item;
const { Column } = Table;

/**
 * 角色条件查询
 * @param {*} props
 */
function SearchForm(props) {
  const { getFieldDecorator, t } = props.form;

  return <Form layout="inline" onSubmit={props.handleSearch}>
      <FormItem>{getFieldDecorator('system', {})(<SystemList />)}</FormItem>
      <FormItem>
        {getFieldDecorator('identify', {})(<Input placeholder="角色标识" />)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('name', {})(<Input placeholder="角色名称" />)}
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button onClick={props.handleAdd}>新增</Button>
      </FormItem>
    </Form>;
}

/**
 * 角色查询组件
 */
const SearchFormWrapper = Form.create({

  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    props.handleValueChange(values);
  }
})(SearchForm);

class RoleManage extends React.Component {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      system: '', // 系统
      name: '', // 名称
      identify: '' // 标识
    };
  }

  render() {
    const { records: datas } = this.props.role;

    return (
      <div className="">
        <SearchFormWrapper
          {...this.state}
          handleValueChange={this.changeState}
          handleSearch={this.search}
          handleAdd={this.addRole}
        />
        <Table dataSource={datas} rowKey="id">
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

  componentDidMount() {

    /**
     * 查找数据
     */
    this.props.dispatch({
      type: 'role/fetch',
      payload: this.state
    });
  }

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.setState({
      ...state
    });
  };

  /**
   * 查询角色
   */
  search = e => {
    e.preventDefault();
  };

  /**
   * 新增角色
   */
  addRole = () => {};
}

export default connect(({ role }) => {
  return { role };
})(RoleManage);
