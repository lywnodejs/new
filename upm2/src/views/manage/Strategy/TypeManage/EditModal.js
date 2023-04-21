/**
 * 角色配置页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;

/**
 * 编辑页面
 * @param {*} props
 */
class TypeEdit extends React.Component {
  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      // 更新数据之后关闭模态框
      this.props
        .dispatch({
          type:
            this.props.oper === 'create'
              ? 'strategy/createType'
              : 'strategy/updateType',
          payload: {
            id: this.props.type.id,
            appId: this.props.appId,
            tagKey: this.props.type.tagKey,
            tagName: this.props.type.tagName
          }
        })
        .then(() => {
          this.props.handleOk();
        });
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  };

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={this.props.title}
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
            onClick={this.handleOk}>
            {t('确定')}
          </Button>
        ]}>
        <Form>
          <FormItem label={t('策略类型唯一标识')} required>
            {getFieldDecorator('tagKey', {
              rules: [
                { required: true, message: t('必填') },
                {
                  whitespace: true,
                  message: t('不可为空')
                }
              ]
            })(
              <Input
                placeholder={t('类型')}
                disabled={this.props.oper !== 'create'}
              />
            )}
          </FormItem>
          <FormItem label={t('策略类型名称')} required>
            {getFieldDecorator('tagName', {
              rules: [
                { required: true, message: t('必填') },
                {
                  whitespace: true,
                  message: t('不可为空')
                }
              ]
            })(<Input placeholder={t('说明')} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const TypeEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.type, (value, key) => {
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
    props.dispatch({
      type: 'strategy/mergeType',
      payload: {
        ...values
      }
    });
  }
})(TypeEdit);

export default connect(({ strategy, global }) => {
  return {
    type: strategy.type,
    appId: global.managingApp
  };
})(TypeEditPage);
