import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Select, Button, Modal, Table } from 'antd';
import config from '@config/style';

const FormItem = Form.Item;
const Option = Select.Option;
const { searchForm } = config;
const { Column } = Table;

function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator } = props.form;

  return (
    <Form className="upm-form" onSubmit={props.handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('用户名')} {...searchForm}>
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
        {/* <Col span={16}>
          <FormItem>
            <Button type="primary" htmlType="submit">
              查询
             </Button>
          </FormItem>
        </Col> */}
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

class ReleRole extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      // 查询参数
      params: {
        name: '', // 名称
        state: '' // 状态
      },
      checkedKeys: []
    };
  }

  /**
   * 更新查询条件
   */
  changeState = value => {
    this.setState({
      params: {
        ...value
      }
    });
  }

  /**
   * 重置搜索条件
   */
  reset = () => {
    this.setState({
      params: {
        name: '',
        state: ''
      }
    });
  }

  /**
   * 查询角色
   * Deprecated
   */
  search = e => {
    this.props.dispatch({
      type: 'role/fetchRole',
      payload: this.state.params
    });
    e.preventDefault();
  }

  /**
   * 过滤搜索条件
   */
  filter = (datas = []) => {
    let { name, state } = this.state.params;

    return datas.filter(data => {
      let matchNanme = name ? data.name.indexOf(name) !== -1 || data.commonName.indexOf(name) !== -1 : true,
        matchState = _.isNumber(state)
          ? state
            ? _.includes(this.props.featureGroup.defaultCheckedRoles, data.id)
            : !_.includes(this.props.featureGroup.defaultCheckedRoles, data.id)
          :true;

      return matchNanme && matchState;
    });
  }

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: 'featureGroup/relevantRole',
      payload: {
        featureGroupId: this.props.featureGroup.id,
        appId: this.props.appId,
        roleIds: this.props.featureGroup.roleList
      }
    }).then(() => {
      this.reset();
      this.props.handleOk();
    });
  }

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.reset();
    this.props.handleCancel();
  }

  /**
   * 更新选中项
   */
  onSelectChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'featureGroup/mergeFeatureGroup',
      payload: {
        roleList: selectedRowKeys
      }
    });
  }

  render() {
    const { t } = this.props;
    const datas = this.filter(this.props.roleList);
    const rowSelection = {
      selectedRowKeys: this.props.featureGroup.roleList,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        title={t('绑定角色')}
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
          handleSearch={this.search}
          handleRele={this.releUser}
        />
        <Table className='upm-table'
          rowKey="id"
          size="middle"
          rowSelection={rowSelection}
          dataSource={datas}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title={t('ID')} dataIndex="id" width={100} />
          <Column title={t('角色标识')} dataIndex="name" />
          <Column title={t('角色名称')} dataIndex="commonName" />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ featureGroup, role, global }) => {
  return {
    featureGroup: featureGroup.featureGroup,
    roleList: role.roleList,
    appId: global.managingApp
  };
})(ReleRole);
