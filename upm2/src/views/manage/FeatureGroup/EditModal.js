import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { Form, Input, Button, Modal, Select, Tooltip, Icon } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
// const availableRiskLevel = ['P1', 'P2', 'P3', 'P4'];
class FeatureGroupEdit extends React.PureComponent {
  /**
   * 点击确认按钮
   */
  handleOk = () => {

    const { form, handleOk } = this.props;

    // 更新数据之后关闭模态框
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.props.dispatch({
          type: this.props.oper === 'create' ? 'featureGroup/createFeatureGroup' : 'featureGroup/updateFeatureGroup',
          payload: {
            id: this.props.featureGroup.id,
            appId: this.props.appId,
            pid: this.props.featureGroup.pid,
            name: this.props.featureGroup.name,
            nameZh: this.props.featureGroup.nameZh,
            riskLevel: this.props.featureGroup.riskLevel
          }
        }).then(() => {
          handleOk();
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
    const { t, oper, style, visible, loading, featureGroup } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { availableRiskLevel } = featureGroup;
    const getRiskLevelTilte = () => {
      return (
        <span>
          {t('敏感级别')}
          <Tooltip title={t('注意：敏感级与所含功能点的最高敏感级保持一致，可上调')}>
            &nbsp;<Icon style={{color: 'rgba(0,0,0,.6)'}} type="info-circle" />&nbsp;
          </Tooltip>
        </span>
      )
    }
    return (
      <Modal
        title={oper === 'create'?t('新增功能组'):t('编辑功能组')}
        style={style}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleOk}
          >
            {t('确定')}
            </Button>
        ]}
      >
        <Form>
          <FormItem label={t('分组名称')} required={true}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: t('必填') }]
            })(<Input placeholder={t('分组名称')} />)}
          </FormItem>
          <FormItem label={getRiskLevelTilte()} required={true}>
            {getFieldDecorator('riskLevel', {
              rules: [{ required: true, message: t('必填') }]
            })(<Select>
                <Option value="">{t('请选择')}</Option>
                {availableRiskLevel && availableRiskLevel.map(item => <Option key={item} value={item}>{item}</Option>)}
              </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const FeatureGroupPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.featureGroup, (value, key) => {
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
      type: 'featureGroup/mergeFeatureGroup',
      payload: {
        ...values,
      },
    });
  }
})(FeatureGroupEdit);

export default connect(({ featureGroup, global }) => {
  return {
    featureGroup: featureGroup.featureGroup,
    appId: global.managingApp
  };
})(FeatureGroupPage);
