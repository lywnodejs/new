import React from 'react';
import {
  Modal, Form, Select,
  Input, TreeSelect, Cascader,
  message,
} from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
};

const transferOptions = (data) => {
  const options = [];
  data.forEach((option) => {
    const newOption = {};
    newOption.key = `${option.id}`,
    newOption.value = `${option.id}`,
    newOption.label = option.name,
    newOption.children = option.children ? transferOptions(option.children) : null;
    options.push(newOption);
  });
  return options;
};

const filter = (inputValue, path) => {
  return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
};

const DFSDept = (path, node, relId) => {
  if (node.id == relId) {
    path.push(node.id.toString());
    return true;
  }
  if (node.children) {
    for (let child of node.children) {
      if (DFSDept(path, child, relId)) {
        path.push(node.id.toString());
        return true;
      }
    }
  } else {
    return false;
  }
  return false;
};

const getIdList = (list) => list
  ? list.map((item) => item.split('-')[0])
  : [];

const getId = (str) => str ? str.split('-')[0] : '';

const transferList = (list) => _.map(list, (item) => `${item.id}-${item.name}`);

const transferJob = (list, relId ) => {
  for (let index in list) {
    if (list[index].jobcode == relId) {
      return `${relId}-${index}`;
    }
  }
};

const transferDept = (rootNode, relId) => {
  const deptPath = [];
  DFSDept(deptPath, rootNode, relId);
  return deptPath.reverse();
};

class DefaultAuthForm extends React.Component {

  componentDidUpdate = (prevPorps) => {
    const { form, initialValue } = this.props;
    if (prevPorps.initialValue !== initialValue) {
      const params = this.formatInitialData(initialValue.data);
      form.setFieldsValue(params);
    }
  }

  formatInitialData = (values) => {
    let { name, roleList, areaList, flagList, dept, job } = values;
    const { departments, jobs } = this.props.data;
    dept = dept ? transferDept(departments[0], dept.relId) : [];
    job = job ? transferJob(jobs, job.relId) : '';
    roleList = transferList(roleList);
    areaList = transferList(areaList);
    flagList = transferList(flagList);
    return { name, roleList, areaList, flagList, dept, job };
  }

  formatSubmitData = (values) => {
    let { name, areaList, roleList, flagList, dept, job } = values;
    areaList = getIdList(areaList);
    roleList = getIdList(roleList);
    flagList = getIdList(flagList);
    dept = { relId: _.isEmpty(dept) ? '' : dept[dept.length - 1]};
    job = { relId:  _.isEmpty(job) ? '' : getId(job) };
    const params = {
      areaList, roleList,
      flagList, dept, job, name,
    };
    return params;
  }

  handleSubmit = () => {
    const {
      form, initialValue, addAuth,
      updateAuth, t
    } = this.props;

    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        const { appId } = this.props.data;
        const { action, data } = initialValue;
        const { id } = data;
        let run = () => {};
        const params = this.formatSubmitData(values);
        if (action === 'add') {
          run = () => addAuth({ appId, ...params});
        }
        else if (action === 'edit') {
          run = () => updateAuth({ id, appId, ...params});
        }
        run().then(() => {
          message.success(t('操作成功！'));
          this.handleCancel();
        });
      }
    });
  }

  handleCancel = () => {
    const { handleModalVisible, form } = this.props;
    handleModalVisible(false);
    form.resetFields();
  }

  requestValidate = (field) => {
    const { form } = this.props;
    if (_.isEmpty(form.getFieldValue(field))) {
      form.validateFields([field], {force: true});
    }
  }

  validateDeptAndJob = (rule, value, callback) => {
    const { form, t } = this.props;
    const bothEmpty = _.isEmpty(form.getFieldValue('job')) && _.isEmpty(form.getFieldValue('dept'));
    if (bothEmpty) {
      callback(t('部门/岗位 请至少填写一个！'));
    } else {
      callback();
      if (value && rule.field === 'dept') {
        this.requestValidate('job');
      }
      else if (value && rule.field === 'job') {
        this.requestValidate('dept');
      }
    }
  }

  validateFlagAreaRole = (rule, value, callback) => {
    const { form, t } = this.props;
    const bothEmpty = _.isEmpty(form.getFieldValue('flagList')) && _.isEmpty(form.getFieldValue('roleList'))
      && _.isEmpty(form.getFieldValue('areaList'));

    if (bothEmpty) {
      callback(t('角色/标识位/区域 请至少填写一个！'));
    } else {
      callback();
    }
  }

  renderJobsOptions = () => {
    const { jobs } = this.props.data;
    return jobs.map((job, index) => (
      <Option key={index} value={`${job.jobcode}-${index}`}>
        {`${job.jobcode}-${job.jobcodeDescr}`}
      </Option>
    ));
  }

  renderRoleListOptions = () => {
    const { roleList } = this.props.data;
    return roleList.map((role, index) => (
      <Option key={index} value={`${role.id}-${role.nameZh}`}>
        {role.nameZh}
      </Option>
    ));
  }

  renderAreaListOptions = () => {
    const { areaList } = this.props.data;
    return areaList.map((areaGroup, index) => (
      <OptGroup key={index} label={areaGroup.businessName}>
        {areaGroup.areas.map((area, index) => (
          <Option key={index} value={`${area.id}-${area.name}`}>
            {area.name}
          </Option>
        ))}
      </OptGroup>
    ));
  }

  render() {
    const {
      t, form, modalVisible,
      modalStatus, data,
    } = this.props;
    const { departments, flagList }= data;
    const { getFieldDecorator } = form;
    const options = transferOptions(departments);
    const treeData = transferOptions(flagList);

    return (
      <Modal
        title={t('默认授权')}
        visible={modalVisible}
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
        confirmLoading={modalStatus==='loading'}
        cancelText={t('取消')}
        okText={t('确定')}
        width="80%"
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label={t('默认授权名称')}
          >
            {
              getFieldDecorator('name', {
                rules: [{ required: true, message: t('请输入授权名称') }],
              })(<Input placeholder={t('默认授权名称')}/>)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('部门')}
          >
            {
              getFieldDecorator('dept', {
                rules: [{ validator: this.validateDeptAndJob }],
              })(
                <Cascader
                  options={options}
                  placeholder={t('请选择')}
                  showSearch={{ filter }}
                  changeOnSelect
                />
              )
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('岗位')}
          >
            {
              getFieldDecorator('job', {
                rules: [{ validator: this.validateDeptAndJob }],
              })(
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder={t('请选择')}
                >
                  {this.renderJobsOptions()}
                </Select>
              )
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('角色名称')}
          >
            {
              getFieldDecorator('roleList', {
                rules: [{
                  validator: this.validateFlagAreaRole
                }]
              })(
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={t('请选择')}
                >
                  {this.renderRoleListOptions()}
                </Select>
              )
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('标识位名称')}
          >
            {
              getFieldDecorator('flagList', {
                rules: [{ validator: this.validateFlagAreaRole }]
              })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder={t('请选择')}
                  allowClear
                  multiple
                  treeData={treeData}
                />
              )
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('区域名称')}
          >
            {
              getFieldDecorator('areaList', {
                rules: [{ validator: this.validateFlagAreaRole }],
              })(
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={t('请选择')}
                >
                  {this.renderAreaListOptions()}
                </Select>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DefaultAuthForm);
