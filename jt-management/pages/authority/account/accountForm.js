import {Form, Input, message, Select, Modal, Radio} from 'antd'
import {useCookies} from 'react-cookie'
import React, {useEffect, useState} from 'react'
import api from '~/api/authority'
import TreeMembers from '~/components/common/TreeMembers'
import _ from 'lodash'

function accountForm(props) {
  const [accountForm] = Form.useForm()
  const {selectIndex, visible, onHide, selectItem, changePageParams} = props

  const [cookies] = useCookies(['name'])

  useEffect(() => {
    if (selectIndex == -1) {
      accountForm.resetFields()
    } else {
      accountForm.setFieldsValue({
        ...selectItem,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const {...params} = await accountForm.validateFields()
      if (selectIndex != -1) {
        params.id = selectItem.id
      }
      const {data} = await api.editAccount(params)
      if (data.code == 0) {
        onHide()
        message.success('保存成功')
        if (selectIndex != -1) {
          changePageParams()
        } else {
          changePageParams(1)
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title={selectIndex === -1 ? '新增' : '编辑'}
      maskClosable={false}
      visible={visible}
      destroyOnClose
      forceRender
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
    >
      <Form
        key={Date.now}
        form={accountForm}
        name="accountForm"
        initialValues={{
          status: 1,
        }}
      >
        <Form.Item
          label="姓名"
          name="accountName"
          rules={[
            {required: true, message: '请输入姓名'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length > 20) {
                  return Promise.reject('输入范围大于0字符，小于等于20字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入，最多20字符" />
        </Form.Item>

        <Form.Item
          label="手机号码"
          name="mobile"
          rules={[
            {required: true, message: '手机号码'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length > 20) {
                  return Promise.reject('输入范围大于0字符，小于等于20字符')
                }
                if (!/^1[3456789]\d{9}$/.test(value)) {
                  // alert('手机号码有误')
                  return Promise.reject('手机号码有误')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入手机号码（登录账号）" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            // {required: true, message: '请输入登录邮箱'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length > 50) {
                  return Promise.reject('输入范围大于0字符，小于等于50字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入，最多50字符" />
        </Form.Item>

        {/*<Form.Item*/}
        {/*  label="登录密码"*/}
        {/*  name="password"*/}
        {/*  rules={[*/}
        {/*    {required: true, message: '请输入登录密码'},*/}
        {/*    ({getFieldValue}) => ({*/}
        {/*      validator(rule, value) {*/}
        {/*        if (value && value.length > 50) {*/}
        {/*          return Promise.reject('输入范围大于0字符，小于等于50字符')*/}
        {/*        }*/}
        {/*        return Promise.resolve()*/}
        {/*      },*/}
        {/*    }),*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <Input.Password placeholder="请输入" />*/}
        {/*</Form.Item>*/}

        <Form.Item
          label="部门"
          name="departmentId"
          rules={[{required: true, message: '请选择部门'}]}
        >
          <Select
            showSearch
            placeholder="请选择部门"
            filterOption={false}
            defaultActiveFirstOption={false}
            onSearch={props.handleSearchDepart}
            onChange={props.handleChangeDepart}
            style={{width: '200px'}}
          >
            {props.showDepartments.map((v, i) => {
              return (
                <Select.Option value={v.id} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="角色"
          name="roleId"
          rules={[{required: true, message: '请选择角色'}]}
        >
          <Select
            showSearch
            placeholder="请选择角色"
            filterOption={false}
            defaultActiveFirstOption={false}
            onSearch={props.handleSearchRole}
            onChange={props.handleChangeRole}
            style={{width: '200px'}}
          >
            {props.showRoles.map((v) => {
              return (
                <Select.Option value={v.id} key={v.id}>
                  {v.roleName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{required: true, message: '请选择状态'}]}
        >
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="人员备注"
          name="personRemark"
          rules={[
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length > 50) {
                  return Promise.reject('输入范围小于等于50字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入，最多50字符" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

accountForm.getInitialProps = async () => ({})

export default accountForm
