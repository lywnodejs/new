import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

class DimensionForm extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.presetData !== this.props.presetData) {
      if (nextProps.presetData) {
        const { dimeName, dimeKey } = nextProps.presetData;

        this.props.form.setFieldsValue({
          dimeName,
          dimeKey
        });
      } else {
        this.props.form.setFieldsValue({
          dimeName: '',
          dimeKey: ''
        });
      }
    }
  }

  handleModalOk = () => {
    const { form, onSubmit } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { dimeName, dimeKey } = fieldsValue;

      onSubmit({ dimeName, dimeKey });
    });
  };

  validateDimensionName = (rule, value, callback) => {
    const { t } = this.props;
    console.log('ddd');
    if (value.trim() === '') {
      callback(t('请输入维度名称'));
    } else {
      callback();
    }
  };
  validateDimensionKey = (rule, value, callback) => {
    const { t } = this.props;
    if (value.trim() === '') {
      callback(t('请输入维度标识'));
    } else {
      callback();
    }
  };

  render() {
    const {
      form,
      visible,
      onClose,
      confirmLoading,
      presetData,
      t
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={t('维度信息')}
        visible={visible}
        onOk={this.handleModalOk}
        onCancel={onClose}
        cancelText={t('取消')}
        okText={t('确定')}
        confirmLoading={confirmLoading}>
        <Form className="edit-form">
          <FormItem {...formItemLayout} label={t('名称')}>
            {getFieldDecorator('dimeName', {
              rules: [
                { required: true, message: t('必填') },
                {
                  whitespace: true,
                  message: t('不可为空')
                }
              ]
            })(<Input />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('标识')}
            extra={t('标识提交后不可修改')}>
            {getFieldDecorator('dimeKey', {
              rules: [
                { required: true, message: t('必填') },
                {
                  whitespace: true,
                  message: t('不可为空')
                }
              ]
            })(<Input disabled={presetData && presetData.dimeKey !== ''} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DimensionForm);
