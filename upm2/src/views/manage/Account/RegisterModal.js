/**
 * 账户注册页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;

/**
 * 角色条件查询
 * @param {*} props
 */
function SearchForm(props) {
  const { getFieldDecorator } = props.form;
  const t = props.t;

  return (
    <Form className="upm-form">
      <FormItem label={t('账号')}>
        {getFieldDecorator('account', {})(<Input placeholder={t('账号')} />)}
      </FormItem>
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
    fields.account = Form.createFormField({ value: props.account });
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

/**
 * 编辑页面
 * @param {*} props
 */
class AccountRegister extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: ''
    };
  }

  /**
   * 清空
   */
  reset = () => {
    this.setState({
      account: ''
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
  * 点击确认按钮
  */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: 'account/registerAccount',
      payload: {
        username: this.state.account,
        appId: this.props.appId,
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

  render() {
    const { t } = this.props;
    return (
      <Modal
        title={t('注册账户')}
        style={this.props.style}
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
          account={this.state.account}
          handleValueChange={this.changeState}
        />
      </Modal>
    );
  }
}

export default connect(({ global }) => {
  return {
    appId: global.managingApp
  };
})(AccountRegister);
