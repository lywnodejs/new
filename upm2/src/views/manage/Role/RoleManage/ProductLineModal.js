import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Button, Modal, Form, Input, message } from 'antd';
import config from '@config/style';
import { translate } from 'react-i18next';
import ProductLineSelector from '@components/ProductLineSelector';
import _ from "lodash";

const FormItem = Form.Item;

class ProductLineFormEntity extends React.Component {
  componentDidMount() {
    const {
      form,
      produceLineId
    } = this.props;

    form.setFieldsValue({
      produceLineId: `${produceLineId}`
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit(this.props.form.getFieldValue('produceLineId'));
  };

  render() {
    const {
      t, form,
      handleSubmit,
      roleName,
      handleCancel,
      produceLineId
    } = this.props;

    const { getFieldDecorator } = form;

    return (
      <Form className="upm-form" onSubmit={this.onSubmit}>
        <Row gutter={12}>
          <Col span={8}>
            <FormItem label={t('角色')}>
              <Input value={roleName} disabled/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('产品线')}>
              {getFieldDecorator('produceLineId')(
                <ProductLineSelector />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
              >
                {t('确定')}
              </Button>
              <Button
                onClick={handleCancel}
                style={{
                  marginLeft: 12
                }}
              >
                {t('取消')}
              </Button>
            </FormItem>
          </Col>
          {/*<Col span={4}>*/}
          {/*<FormItem>*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
        </Row>
      </Form>
    );
  }
}

const ProductLineForm = translate()(Form.create()(ProductLineFormEntity));

class ProductLineModal extends React.PureComponent {

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.handleOk();
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  };

  onSubmit = (produceLineId) => {
    const {
      t,
      role,
      dispatch,
    } = this.props;

    const {
      id,
      appId,
    } = role;

    dispatch({
      type: 'role/bindProduct',
      payload: {
        roleId: id,
        appId,
        produceLineId: produceLineId === '' ? null : produceLineId
      }
    }).then(() => {
      message.info(t('绑定成功'));
      this.handleOk();
    });
  };

  render() {
    const { t, role, visible, style } = this.props;

    return (
      <Modal
        title={t('绑定产品线')}
        style={style}
        width={config.modal.size.large}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={false}
      >
        {
          visible && (
            <ProductLineForm
              roleName={role.name}
              handleCancel={this.handleCancel}
              produceLineId={role.produceLineId}
              handleSubmit={this.onSubmit}
            />
          )
        }
      </Modal>
    );
  }
}

export default connect(({ role, global }) => {
  return {
    role: role.role,
    appId: global.managingAvailableApp
  };
})(ProductLineModal);
