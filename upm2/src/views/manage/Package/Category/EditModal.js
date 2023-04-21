import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;
const required = { required: true, message: '必填' };

/**
 * 编辑页面
 * @param {*} props
 */
class CategoryEdit extends React.Component {

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const { oper, category } = this.props;
    const { name, description, id } = category;
    const payload = {
      appId: 888,
      name,
      description
    }

    if (oper === 'update') {
      payload.id = id
    }
    // 更新数据之后关闭模态框
    this.props.dispatch({
      type: oper === 'create' ? 'managePackage/addCategory' : 'managePackage/updateCategory',
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
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={t(this.props.oper === 'create' ? '新建礼包分类':'编辑礼包分类')}
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
            {getFieldDecorator('name', {rules: [required]})(<Input placeholder={t('礼包分类名称')} />)}
          </FormItem>
          <FormItem label={t('描述')} required={true}>
            {getFieldDecorator('description', {rules: [required]})(<Input placeholder={t('描述')} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const CategoryEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.category, (value, key) => {
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
      type: 'managePackage/mergeCategory',
      payload: {
        ...values,
      },
    });
  }
})(CategoryEdit);

export default connect(({ managePackage, global}) => {
  return {
    category: managePackage.category,
    appId: global.managingApp
  };
})(CategoryEditPage);
