import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Select } from 'antd';

const FormItem = Form.Item;
const required = { required: true, message: '必填' };

/**
 * 编辑页面
 * @param {*} props
 */
class AdminEdit extends React.Component {

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const { oper, admin } = this.props;
    const { packageCategoryId, adminName, id } = admin;
    const payload = {
      appId: 888,
      packageCategoryId,
      adminName
    }

    if (oper === 'update') {
      payload.id = id
    }
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: oper === 'create' ? 'managePackage/addAdmin' : 'managePackage/updateAdmin',
      payload
    }).then(() => {
      this.props.handleOk();
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  render() {
    const { t, allCategory } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={this.props.oper === 'create' ? t('新建礼包管理员'):t('编辑礼包管理员')}
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
        <Form>
          <FormItem label={t('礼包分类名称')} required={true}>
            {getFieldDecorator('packageCategoryId', {rules: [required]})(
              <Select placeholder={t('请选择')} allowClear >
                {_.map(allCategory, ({ id, name }) =>
                  <Select.Option key={id} value={id} >{name}</Select.Option>
                )}
              </Select>
            )}
          </FormItem>
          <FormItem label={t('用户名')} required={true}>
            {getFieldDecorator('adminName', {rules: [required]})(<Input placeholder={t('用户名')} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const AdminEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.admin, (value, key) => {
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
      type: 'managePackage/mergeAdmin',
      payload: {
        ...values,
      },
    });
  }
})(AdminEdit);

export default connect(({ managePackage, global}) => {
  return {
    admin: managePackage.admin,
    appId: global.managingApp
  };
})(AdminEditPage);
