/**
 * 角色配置页面
 * by wujianjian
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Select } from 'antd';
import { echoMessage } from '@utils/notice';
const FormItem = Form.Item;

/**
 * 编辑页面
 * @param {*} props
 */
class AddRole extends React.Component {
  state = {
    loading: false,
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const { form, handleOk, t, isEdit, record } = this.props;
    // 更新数据之后关闭模态框
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { name, nameZh, description, businessId } = values;
        const payload = {
          appId: this.props.appId,
          nameZh,
          description, 
          name,
          businessId
        };
        if (isEdit) {
          payload.id = record.id;
        }
        this.setState({
          loading: true
        });
        this.props.dispatch({
          type: isEdit?'businessRoleList/editRole':'businessRoleList/addRole',
          payload
        }).then(() => {
          this.setState({
            loading: false
          });
          echoMessage(isEdit?t('角色修改成功！'):t('角色创建成功！'), 'success');
          handleOk();
        }, () => {
          this.setState({
            loading: false
          });
        });
      }
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  getPopupContainer = () => document.querySelector('.ant-modal-body')

  getBusinessLineOptions = () => {
    const {businessLine, t} = this.props;
    return _.map(businessLine, (business) => {
      return (
        <Select.Option key={business.id} value={business.id}>
          {t(business.name)}
        </Select.Option>
      );
    });
  }
  render = () => {
    const { t, form, isEdit, record } = this.props;
    const { getFieldDecorator } = form;
    const required = { required: true, message: t('必填') };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        title={isEdit?t('编辑角色')+'-'+record.nameZh:t('创建角色')}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleOk}
          >
            {t('确定')}
            </Button>
        ]}
      >
        <FormItem {...formItemLayout} label={t('角色标识')}>
          {getFieldDecorator('name', {
            rules: [
              required
            ],
            initialValue: isEdit?record.name:''
          })(<Input placeholder={t('角色标识')} />)}
        </FormItem>

        <FormItem {...formItemLayout} label={t('角色名称')}>
          {getFieldDecorator('nameZh', {
            rules: [
              required
            ],
            initialValue: isEdit?record.nameZh:''
          })(<Input placeholder={t('角色名称')} />)}
        </FormItem>

        <FormItem {...formItemLayout} label={t('产品线')}>
          {getFieldDecorator('businessId', {
            rules: [
              required
            ],
            initialValue: isEdit?record.businessId:''
          })(
            <Select
              style={{width: '200px'}}
              showSearch
              placeholder={t('选择产品线')}
            >
              {this.getBusinessLineOptions()}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label={t('角色描述')} >
          {getFieldDecorator('description', {
            initialValue: isEdit?record.description:''
          })(<Input.TextArea rows={4} placeholder={t('角色描述')} />)}
        </FormItem>
      </Modal>
    );
  }
}

const AddRoleModal = Form.create({})(AddRole);

export default connect(({ global, bigData }) => {
  return {
    businessLine: bigData.businessLine,
    // appId: global.globalAppId
  };
})(AddRoleModal);
