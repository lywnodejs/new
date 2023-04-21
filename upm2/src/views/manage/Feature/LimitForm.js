import React, { Component } from 'react';
import {
  Button, Input, Form
} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};

class LimitForm extends Component {
  componentDidMount() {
    const { form, setForm } = this.props;

    setForm(form);
  }

  handleSubmit = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render() {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={t('次数')}
        >
          {getFieldDecorator('frequencyNum', {
            rules: [{
              required: true,
            }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={t('被限制人')}
        >
          {getFieldDecorator('userName', {
            initialValue: '',
          })(
            <Input.TextArea
              rows={2}
              placeholder={t('请输入邮箱前缀, 多用户以英文逗号分隔')}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            {t('提交')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LimitForm);
