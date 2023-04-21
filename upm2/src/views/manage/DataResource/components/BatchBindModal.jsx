import React, {Component} from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Modal } from 'antd';
import config from '@config/style';
const { searchForm } = config;
const FormItem = Form.Item;

class BatchBindModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '' // 名称
    };
  }
  componentDidMount() {

  }
  handleOk = () => {
    this.props.form.validateFields((errors,values)=>{
      if(errors) {
        return;
      }
      this.props.handleOkOnBatchBindModal(values.userNames)
    })
  }
  handleCancel = () => {
    this.props.handleCancelOnBatchBindModal();
  }

  validateUserNames = (rule, value, callback) => {
    const { t } = this.props;
    if(value.trim().split(',').length>50) {
      callback(t('批量关联用户，最大支持50个'))
    }
    callback()

  }
  render() {
    const {t,form,loadingRelation} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={t('批量绑定用户')}
        destroyOnClose={true}
        style={this.props.style}
        width={config.modal.size.xs}
        visible={this.props.visible}
        confirmLoading={loadingRelation}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form className="upm-form">
      <Row gutter={12}>
        <Col span={24}>
          <FormItem label={t('绑定用户')} {...searchForm}>
            {getFieldDecorator('userNames', {
              rules: [
                {
                  required: true,
                  message: t('必填')
                },
                {
                  validator: this.validateUserNames
                }
              ]
            })(<Input placeholder={t('用户名，多用户以逗号间隔')} />)}
          </FormItem>
        </Col>
      </Row>
    </Form>
      </Modal>
    );
  }
}

export default Form.create()(connect(({dataResource})=>{
  return {
    loadingRelation: dataResource.loading.loadingRelation
  }
})(BatchBindModal));