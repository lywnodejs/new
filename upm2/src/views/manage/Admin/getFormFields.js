import React from 'react';
import {
  Input, Select, Switch, Form, Popover, Icon
} from 'antd';

const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayout2 = {
  style: {
    display: 'inline-block',
    width: '50%'
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const FormItem = Form.Item;
let isShow = false;


export default function getFormFields (getFieldDecorator, t, departmentLevelOneList = [], systemEnv = [], getFieldsValue) {
  if (getFieldsValue) {
    isShow = getFieldsValue().openApply;
  }
  return (
    <div>
      <FormItem
        {...formItemLayout}
        label={t('目标系统')}
      >
        {getFieldDecorator('name', {
          rules: [{
            required: true
          }],
        })(
          <Input />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={t('SSO APPKEY')}
      >
        {getFieldDecorator('appKey', {
          rules: [{
            required: true
          }],
        })(
          <Input />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={t('回跳地址')}
      >
        {getFieldDecorator('homePage', {
          rules: [{
            required: true
          }],
        })(
          <Input />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={t('主页地址')}
      >
        {getFieldDecorator('domain', {
          rules: [{
            required: true
          }],
        })(
          <Input />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={t('样式')}
      >
        {getFieldDecorator('icon')(
          <Input />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('登录类型')}
      >
        {getFieldDecorator('loginType')(
          <Select>
            <Option value={1}>{t('SSO登录')}</Option>
            <Option value={2}>{t('权限系统登录')}</Option>
            <Option value={3}>{t('ME登录')}</Option>
            <Option value={4}>{t('自有登录')}</Option>
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('系统分级')}
      >
        {getFieldDecorator('appLevel')(
          <Select>
            <Option value={0}>0</Option>
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('一级部门')}
      >
        {getFieldDecorator('deptId', {
          rules: [{
            required: true
          }],
        })(
          <Select style={{ width: '100%' }}
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {departmentLevelOneList.map(dep => {
              return <Select.Option key={dep.deptId} value={+dep.deptId}>{dep.deptName}</Select.Option>;
            })}
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('系统类型')}
      >
        {getFieldDecorator('appDefinedEnv', {
          rules: [{
            required: true
          }],
        })(
          <Select style={{ width: '100%' }}>
            {systemEnv.map(env => {
              return <Select.Option key={env.code} value={env.code}>{env.name}</Select.Option>;
            })}
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('默认授权')}
      >
        {getFieldDecorator('openDefault', {
          valuePropName: 'checked',
        })(
          <Switch />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout2}
        label={t('开放申请')}
      >
        {getFieldDecorator('openApply', {
          valuePropName: 'checked'
        })(
          <Switch onChange={(value) => { console.log(value); isShow = value; }} />
        )}
      </FormItem>

      <FormItem
        style={{ display: isShow ? 'block' : 'none' }}
        {...formItemLayout}
        label={
          <Popover
            placement="right"
            content={<p style={{ width: '200px' }}>{t('请输入系统权限申请相关问题答疑接口人，输入后该用户名字将显示在权限申请页上方')}</p>}
          >
            <span>{t('权限申请咨询人')} <Icon type="question-circle-o" /></span>
          </Popover>
        }
      >
        {getFieldDecorator('permissionConsultant', {
          rules: [{
            required: true,
            message: '请输入'
          }],
        })(
          <Input placeholder="请输入员工邮箱前缀" />
        )}
      </FormItem>

      <FormItem
        style={{ display: isShow ? 'block' : 'none' }}
        {...formItemLayout}
        label={t('系统咨询群')}
      >
        {getFieldDecorator('consultGroup', {
          rules: [{
            required: true,
            message: '请输入'
          }],
        })(
          <Input placeholder="请输入系统咨询群链接" />
        )}
      </FormItem>
    </div>
  );
}
