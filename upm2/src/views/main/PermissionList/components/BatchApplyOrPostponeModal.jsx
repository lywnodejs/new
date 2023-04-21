import React, { PureComponent } from 'react';
import connect from '@utils/translateConnect';
import moment from 'moment';
import { Form, Modal, Input, DatePicker } from 'antd';

const permissionTypeMapping = {
  2: 2,
  1: 4,
  7: 5,
  100: 7
};
class BatchApplyOrPostponeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleOk = () => {
    const { dispatch, t, records, permissionType, form, handleOk } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const roles = records.map(i => ({
          appId: i.appId,
          refId: i.id,
          type: permissionTypeMapping[permissionType]
        }));
        const params = {
          roles,
          ...values
        };
        handleOk(params);
      }
    });
  };
  handleCancel = () => {
    this.props.handleCancel();
  };
  render() {
    const { t, form, visible, username, title, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Modal
        title={title}
        visible={visible}
        width={550}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={null}
        cancelText={t('取消')}
        confirmLoading={confirmLoading}
        destroyOnClose>
        <Form className="batch-apply" {...formItemLayout}>
          <Form.Item label={t('申请人邮箱前缀')}>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: t('必填')
                }
              ],
              initialValue: username
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label={t('权限失效时间')}>
            {getFieldDecorator('expireTime', {
              rules: [
                {
                  required: true,
                  message: t('必填')
                }
              ]
            })(
              <DatePicker
                showToday={false}
                disabledDate={current => {
                  return current && current < moment().endOf('day');
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={t('申请理由')}>
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: true,
                  message: t('必填')
                }
              ]
            })(<Input.TextArea autosize={{ minRows: 3, maxRows: 5 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default connect(({ userInfo }) => {
  return {
    username: userInfo.username
  };
})(Form.create()(BatchApplyOrPostponeModal));
