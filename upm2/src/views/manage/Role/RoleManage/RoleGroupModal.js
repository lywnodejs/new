/**
 * 分配角色组页面页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Select, Button, Modal, Table } from 'antd';
import config from '@config/style';

const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = Table;
const { searchForm } = config;

function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator } = props.form;

  return (
    <Form className="upm-form" onSubmit={props.handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('名称')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('名称/中文名/URL')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('状态')} {...searchForm}>
            {getFieldDecorator('state', {})(
              <Select allowClear>
                <Option value={0}>{t('未绑定')}</Option>
                <Option value={1}>{t('已绑定')}</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 角色查询组件
 */
const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields({ params }) {
    let fields = {};
    _.each(params, (value, key) => {
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

class RoleGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // 查询参数
      params: {
        name: '', // 名称
        state: '' // 状态
      }
    };
  }

  /**
   * 重置筛选条件
   */
  resetFilterFields = () => {
    this.setState({
      params: {
        name: '',
        state: ''
      }
    });
  }

  changeState = (state) => {
    this.setState({
      params: {
        ...this.state.params,
        ...state
      }
    });
  }

  /**
   * 过滤搜索条件
   */
  filter = (datas = []) => {
    let { name, state } = this.state.params;

    return datas.filter(data => {
      let matchNanme = name ? data.name.indexOf(name) !== -1 || data.nameZh.indexOf(name) !== -1 : true,
        matchState = _.isNumber(state)
          ? state
            ? _.includes(this.props.role.defaultCheckedGroups, data.id)
            : !_.includes(this.props.role.defaultCheckedGroups, data.id)
          : true;

      return matchNanme && matchState;
    });
  };

  /**
   * 关联用户
   */
  releUser = () => {

  };

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: 'role/relevantGroup',
      payload: {
        id: this.props.role.id,
        appId: this.props.role.appId,
        roleGroupIds: this.props.role.groupList
      }
    }).then(() => {
      this.props.handleOk();
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  /**
   * 更新选中项
   */
  onSelectChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        groupList: selectedRowKeys
      }
    });
  };

  render() {
    const { t } = this.props;
    const datas = this.filter(this.props.group);
    const rowSelection = {
      selectedRowKeys: this.props.role.groupList,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        afterClose={this.resetFilterFields}
        title={t('绑定角色组')}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loading}
            onClick={this.handleOk}
          >
            {t('确定')}
            </Button>
        ]}
      >
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleValueChange={this.changeState}
          handleRele={this.releUser}
        />
        <Table className="upm-table"
          rowKey="id"
          size="middle"
          dataSource={datas}
          rowSelection={rowSelection}
          pagination={{
            hideOnSinglePage: true,
          }}
          >
          <Column title={t('ID')} dataIndex="id" width={100}/>
          <Column title={t('角色组标识')} dataIndex="name"/>
          <Column title={t('分组名称')} dataIndex="nameZh"/>
        </Table>
      </Modal>
    );
  }
}

export default connect(({ role, global }) => {
  return {
    role: role.role,//{groupList 关联角色组, defaultCheckedGroups 关联角色组}
    group: role.roleGroupList,//全部角色组
    appId: global.managingAvailableApp
  };
})(RoleGroup);
