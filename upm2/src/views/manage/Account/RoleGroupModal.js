/**
 * 用户分配角色组页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Select, Button, Modal, Table, DatePicker } from 'antd';
import config from '@config/style';

const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = Table;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};

function SearchForm(props) {
  const { getFieldDecorator, getFieldsValue } = props.form;
  const t = props.t;

  return (
    <Form className="upm-form" onSubmit={e => {
      props.handleSearch(getFieldsValue(['name', 'state']));
      e.preventDefault();
    }}>
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
        {/* <Col span={16}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
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

class DistrRoleGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // 查询参数
      params: {
        name: '', // 名称
        state: '' // 状态
      },
      roleGroupList: []
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

  setChecked = (groupList) => {
    this.setState({
      roleGroupList: _.map(_.partition(groupList, ['isBind', 1])[0], group => group.id)
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
   * 查询角色组
   */
  load = () => {

    // 查找数据
    this.props.dispatch({
      type: 'account/fetchRelevantGroup',
      payload: {
        appId: this.props.appId,
        userId: this.props.account.id
      }
    }).then(() => {
      // 更新选中集合
      this.setChecked(this.props.account.groupList);
    });
  };

  /**
   * 过滤搜索条件
   */
  filter = (datas) => {
    let { name, state } = this.state.params;

    return datas.filter(data => {
      let matchNanme = name ? data.name.indexOf(name) !== -1 || data.nameZh.indexOf(name) !== -1 : true,
        matchState = _.isNumber(state) ? data.isBind == state : true;

      return matchNanme && matchState;
    });
  };

  /**
   * 设置过期时间
   */
  expire = ({ expireAt, relId }) => {
    this.props.dispatch({
      type: 'account/expireRoleGroup',
      payload: {
        appId: this.props.appId,
        relId,
        expireAt
      }
    });
  };

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: 'account/relevantGroup',
      payload: {
        id: this.props.account.id,
        appId: this.props.account.appId,
        roleGroupIds: this.state.roleGroupList
      }
    }).then(() => {
      this.reset();
      this.props.handleOk();
    });
  };

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
    this.setState({
      roleGroupList: selectedRowKeys
    });
  };

  /**
   * 获取角色列表信息
   */
  componentDidMount() {
    this.setChecked(this.props.account.groupList);
  }

  componentWillReceiveProps(nextProps) {
    this.props.account.groupList != nextProps.account.groupList && this.setChecked(nextProps.account.groupList);
  }

  render() {
    const { t } = this.props;
    const datas = this.filter(this.props.account.groupList);
    const rowSelection = {
      selectedRowKeys: this.state.roleGroupList,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        title={t('绑定角色组')}
        destroyOnClose={true}
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
          handleSearch={this.handleSearch}
          handleRele={this.releUser}
        />
        <Table className="upm-table"
          rowKey="id"
          size="middle"
          rowSelection={rowSelection}
          dataSource={datas}
          pagination={{
            hideOnSinglePage: true,
          }}>
          <Column title={t('ID')} dataIndex="id" width={100}/>
          <Column title={t('角色标识')} dataIndex="name"/>
          <Column title={t('角色名称')} dataIndex="nameZh"/>
          <Column
            title={t('过期时间')}
            key="expired"
            width={250}
            render={(text, record, index) => {
              if (record.expireAt) {
                return (
                  <DatePicker
                    showTime
                    value={moment(record.expireAt)}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={value => {
                      this.props.dispatch({
                        type: 'account/updateGroupList',
                        payload: {
                          index,
                          item: {
                            expireAt: value.format('YYYY-MM-DD HH:mm:ss')
                          }
                        }
                      });
                    }}
                  />
                );
              }
              return null;
            }}
          />
          <Column
            title={t('操作')}
            key="action"
            width={80}
            render={(text, record) => (
              record.isBind
                ? <Button size={TableStyle.buttonSize} onClick={() => this.expire(record)}>{t('保存')}</Button>
                : null
            )}
          />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ account, global }) => {
  return {
    account: account.account,
    appId: global.managingApp
  };
})(DistrRoleGroup);
