/**
 * 角色组编辑页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Select, Tooltip, Icon } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
// const availableRiskLevel = ['P1', 'P2', 'P3', 'P4'];

/**
 * 编辑页面
 * @param {*} props
 */
class RoleGroupEdit extends React.Component {

  /**
  * 点击确认按钮
  */
  handleOk = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 更新数据之后关闭模态框
        this.props.dispatch({
          type: this.props.oper === 'create' ? 'role/createRoleGroup' : 'role/updateRoleGroup',
          payload: {
            id: this.props.roleGroup.id,
            appId: this.props.appId,
            name: this.props.roleGroup.name,
            nameZh: this.props.roleGroup.nameZh,
            riskLevel: this.props.roleGroup.riskLevel
          }
        }).then(() => {
          this.props.handleOk();
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

  render() {
    const { t, roleGroup } = this.props;
    const { getFieldDecorator } = this.props.form;
    const availableRiskLevel = this.props.oper == 'create' ? ['C1', 'C2', 'C3', 'C4'] : roleGroup.availableRiskLevel;
    const required = [{ required: true, message: t('必填') }];
    const getRiskLevelTilte = () => {
      return (
        <span>
          {t('敏感级别')}
          <Tooltip title={t('注意：敏感级不能低于所含角色的最高敏感级')}>
            &nbsp;<Icon style={{color: 'rgba(0,0,0,.6)'}} type="info-circle" />&nbsp;
          </Tooltip>
        </span>
      )
    }

    return (
      <Modal
        title={this.props.oper === 'create'?t('新增角色组'):t('编辑角色组')}
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
          <FormItem label={t('角色组标识')} required={true}>
            {getFieldDecorator('name', {rules: required})(<Input placeholder={t('角色组标识')} disabled={this.props.oper !== 'create'} />)}
          </FormItem>
          <FormItem label={t('角色组名称')} required={true}>
            {getFieldDecorator('nameZh', {rules: required})(<Input placeholder={t('角色组名称')} />)}
          </FormItem>
          <FormItem label={getRiskLevelTilte()} required={true}>
            {getFieldDecorator('riskLevel', {
              // initialValue: riskLevel
              rules: required
            })(<Select style={{width: '100%'}}>
              <Option value="">{t('请选择')}</Option>
              {availableRiskLevel && availableRiskLevel.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const RoleGroupEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.roleGroup, (value, key) => {
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
      type: 'role/mergeRoleGroup',
      payload: {
        ...values,
      },
    });
  }
})(RoleGroupEdit);

export default connect(({ role, global}) => {
  return {
    roleGroup: role.roleGroup,
    appId: global.managingApp
  };
})(RoleGroupEditPage);
