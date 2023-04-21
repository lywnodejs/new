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
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('状态')} {...searchForm}>
            {getFieldDecorator('state', {})(
              <Select allowClear placeholder={t('全部')}>
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

  changeState = (state) => {
    this.setState({
      params: {
        ...this.state.params,
        ...state
      }
    });
  }

  resetFilterParams = () => {
    this.setState({
      params: {
        name: '', // 名称
        state: '' // 状态
      }
    })
  }

  /**
   * 过滤搜索条件
   */
  filter = (featureGroupList = []) => {
    let { name, state } = this.state.params;

    return featureGroupList.filter(featureGroup => {
      const matchNanme = name ? featureGroup.name.indexOf(name) !== -1 || featureGroup.commonName.indexOf(name) !== -1 : true;
      const matchState = _.isNumber(state)
          ? state
            ? _.includes(this.props.role.defaultCheckedFeatureGroups, featureGroup.id)
            : !_.includes(this.props.role.defaultCheckedFeatureGroups, featureGroup.id)
          : true;

      return matchNanme && matchState;
    });
  };


  /**
  * 点击确认按钮
  */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: 'role/relevantFeatureGroup',
      payload: {
        id: this.props.role.id,
        appId: this.props.role.appId,
        featureGroupIds: this.props.role.featureGroupList
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
    console.log(selectedRowKeys)
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        featureGroupList: selectedRowKeys
      }
    });
  };

  render() {
    const { t,loadingRelevantFeatureGroup } = this.props;
    const filterdFeatureGroupList = this.filter(this.props.featureGroupList);
    const rowSelection = {
      selectedRowKeys: this.props.role.featureGroupList,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        title={t('绑定功能组')}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.resetFilterParams}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loadingRelevantFeatureGroup}
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
        />
        <Table
          className="upm-table"
          rowKey="id"
          size="middle"
          dataSource={filterdFeatureGroupList}
          rowSelection={rowSelection}
          pagination={{
            hideOnSinglePage: true,
          }}
        >
          <Column title={t('ID')} dataIndex="id" width={100}/>
          <Column title={t('分组名称')} dataIndex="commonName"/>
          <Column title={t('敏感级别')} dataIndex="riskLevel"/>
        </Table>
      </Modal>
    );
  }
}

export default connect(({ role, global }) => {
  return {
    role: role.role,//{featureGroupList 关联功能组, defaultCheckedFeatureGroups 关联功能组}
    featureGroupList: role.featureGroupList,//全部功能组
    appId: global.managingAvailableApp,
    loadingRelevantFeatureGroup: role.loading.loadingRelevantFeatureGroup
  };
})(RoleGroup);
