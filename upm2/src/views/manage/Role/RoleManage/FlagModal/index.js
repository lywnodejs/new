/**
 * 标识位绑定功能页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Modal } from 'antd';
import config from '@config/style';
import UTree from '@components/UTree';

const FormItem = Form.Item;
const match = UTree.match;
const { searchForm } = config;

function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator, getFieldsValue } = props.form;

  return (
    <Form className="upm-form" onSubmit={e => {
      e.preventDefault();
      props.handleSearch(getFieldsValue(['name']));
    }}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('名称')} {...searchForm}>
            {/* {getFieldDecorator('name', {})(<Input placeholder={t('名称/中文名/URL')} />)} */}
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem {...searchForm}>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
          </Button>
            <Button className="upm-form__button" type="primary" onClick={props.handleClear}>
              {t('清空选择')}
          </Button>
            <Button className="upm-form__button" type="primary" onClick={props.handleSave}>
              {t('保存')}
          </Button>
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
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.params, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  }
})(SearchForm);

class FlagRele extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        name: ''
      },
      selectedFlag: {
        name: '',
        nameZh: ''
      },
      checkedFlags: [] // 选中项
    };
  }

  /**
   * 重置筛选条件
   */
  resetFilterFields = () => {
    this.setState({
      params: {
        name: ''
      }
    });
  }

  /**
   * 搜索功能
   */
  search = ({ name }) => {
    this.setState({
      params: {
        name
      }
    });
  }

  /**
   * 清楚选择功能
   */
  clear = () => {
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        flagList: []
      }
    });
  }

  /**
   * 绑定标识位
   */
  relevantFlag = () => {
    const { id, appId, flagList } = this.props.role;

    this.props.dispatch({
      type: 'role/relevantFlag',
      payload: {
        id,
        appId,
        flagIds: flagList
      }
    }).then(() => {
      this.props.handleOk();
    });
  }

  checkedFlags = (checked, checkedFlags) => {
    // 更新选中节点集合
    this.setState({
      checkedFlags
    });

    // 更新选中id集合
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        flagList: checked
      }
    });
  }

  /**
   * 设置当前点击项
   */
  selectedFlag = (keys, selectedFlag) => {
    this.setState({
      selectedFlag
    });
  }

  /**
   * 格式化输出选中信息
   */
  formatChecked = () => {

    const { flags, role } = this.props;
    const checkedFlags = match(flags, role.flagList, (key, node) => key == node.id);

    return checkedFlags.map(flag => {
      return <span key={flag.id}>{flag.name}({flag.nameZh})  </span>;
    });
  }

  /**
   * 关闭模态框
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  render() {
    const { flags, role, t } = this.props;
    const formItemLayout = null;

    return (
      <Modal
        afterClose={this.resetFilterFields}
        className="upm-role-rele-flag"
        title={t('绑定标识位')}
        destroyOnClose={true}
        style={{
          top: '40px',
          ...this.props.style
        }}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[]}
      >
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleSearch={this.search}
          handleClear={this.clear}
          handleSave={this.relevantFlag}
        />
        <Row className="upm-tree-panel">
          <Col className="upm-tree-panel__left"
            span={12}>
            <UTree
              checkable
              showLine
              showName
              nodes={flags}
              searchValue={this.state.params.name}
              checkedKeys={role.flagList}
              onCheck={this.checkedFlags}
              onSelect={this.selectedFlag}
            />
          </Col>
          <Col className="upm-tree-panel__right"
            span={12}>
            <div className="upm-role-rele-flag__info upm-border-bottom">
              <label className="upm-tree-panel__label">{t('当前选中：')}</label>
              {this.formatChecked()}
            </div>
            <div>
              <label className="upm-tree-panel__label">{t('标识位详情：')}</label>
              <Form className="upm-role-rele-flag__detail">
                <FormItem label={t('名称')} {...formItemLayout}>
                  <Input value={this.state.selectedFlag.name} disabled />
                </FormItem>
                <FormItem label={t('中文名')} {...formItemLayout}>
                  <Input value={this.state.selectedFlag.nameZh} disabled />
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default connect(({ flags, role }) => {
  return {
    flags: flags.list,
    role: role.role
  };
})(FlagRele);
