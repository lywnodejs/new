import React, { Component } from 'react';
import { Button, Form, Input, Select, TreeSelect } from 'antd';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = null;
// const availableRiskLevel = ['P1', 'P2', 'P3', 'P4'];

class EditForm extends Component {
  state = {
    options: ['C1', 'C2', 'C3', 'C4']
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.editingFlag !== nextProps.editingFlag) {
      if (!nextProps.editingFlag) {
        this.handleFormReset();
        this.setState({
          options: []
        });
      } else {
        const {
          name,
          nameZh,
          riskLevel,
          availableRiskLevel,
          isApplicable,
          pid
        } = nextProps.editingFlag;
        this.props.form.setFieldsValue({
          flagName: name,
          flagNameZh: nameZh,
          riskLevel: riskLevel || '',
          isApplicable: isApplicable,
          pid: pid + ''
        });
        this.setState({
          options: availableRiskLevel || ['C1', 'C2', 'C3', 'C4']
        });
      }
    }
  }

  handleEditFlagSubmit = () => {
    const { form, requestSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const {
        flagName,
        flagNameZh,
        riskLevel,
        isApplicable,
        pid
      } = fieldsValue;

      const { editingFlag, editingFlagParent } = this.props;

      requestSubmit({
        ...editingFlag,
        name: flagName,
        nameZh: flagNameZh,
        riskLevel,
        pid,
        isApplicable
      });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      options: ['C1', 'C2', 'C3', 'C4']
    });
  };

  render () {
    const {
      form,
      editingFlag,
      editingFlagParent,
      t,
      flagList
    } = this.props;

    const {
      options
    } = this.state;

    const { getFieldDecorator } = form;

    const reducer = (list) => {
      return list.reduce((acc, item) => {
        if (editingFlag && editingFlag.id === item.id) {
          return acc;
        }

        let i = {};
        i.label = item.name;
        i.title = item.name;
        i.value = `${item.id}`;
        i.key = item.key;

        if (item.children) {
          i.children = reducer(item.children);
        }

        return acc.concat(i);
      }, []);
    };
    const parentsData = [{
      label: t('顶级节点'),
      value: '0',
      key: 0,
    }].concat(reducer(flagList));
    return (
      <Form className="edit-form">
        <FormItem
          {...formItemLayout}
          label={t('标识位')}
        >
          {getFieldDecorator('flagName', {
            rules: [{ required: true, message: t('请输入标识位') }],
          })(
            <Input placeholder={t('自定义识别某个系统功能的唯一标识')} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={t('名称')}
        >
          {getFieldDecorator('flagNameZh', {
            rules: [{ required: true, message: t('请输入名称') }],
          })(
            <Input placeholder={t('描述该标识位代表功能')} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={t('选择敏感级别')}
        >
          {getFieldDecorator('riskLevel', {
            rules: [{ required: true, message: t('请输入敏感级别') }],
            initialValue: ''
          })(
            <Select
              // value={riskLevel}
              // onChange={(e) => this.handleSearchFieldChange(e, 'isMenu')}
              // className="menu-select"
              style={{ width: '100%' }}
              disabled={!editingFlag}
            >
              <Option value="">{t('请选择')}</Option>
              {options && options.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={t('可申请')}
        >
          {getFieldDecorator('isApplicable', {
            rules: [{ required: true, message: t('请选择') }],
            initialValue: ''
          })(
            <Select
              style={{ width: '100%' }}
              disabled={!editingFlag}
            >
              <Option value="">{t('请选择')}</Option>
              {
                [{ value: 1, name: '是' }, { value: 0, name: '否' }].map(entity => <Option key={entity.value} value={entity.value}>{entity.name}</Option>)
              }

            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={t('父级')}
        >
          {/* <Input disabled value={editingFlagParent ? editingFlagParent.name : ''} /> */}
          {getFieldDecorator('pid', {
            rules: [{ message: t('请选择') }],
          })(
            <TreeSelect
              placeholder={t('描述该功能是否具有上级节点，默认为顶级节点')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={parentsData}
              treeDefaultExpandAll={false}
              disabled={!editingFlag}
            />
          )}

        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button
            type="primary"
            onClick={this.handleEditFlagSubmit}
            disabled={!editingFlag}
          >
            {t('保存')}
          </Button>

          <Button
            type="primary"
            className="reset-btn"
            onClick={this.handleFormReset}
          >
            {t('清空')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(EditForm);
