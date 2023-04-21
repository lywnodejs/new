import {Form, Input, message, Select, Modal, InputNumber} from 'antd'
import React, {useEffect, useState, useRef} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/authority'
import {USER_AUTH} from '~/utils/const'

function roleForm(props) {
  const [cookies] = useCookies(['name', 'roleId'])
  const [roleForm] = Form.useForm()
  const {selectIndex, visible, onHide, selectItem, pullData} = props

  useEffect(() => {
    if (selectIndex == -1) {
      roleForm.resetFields()
    } else {
      roleForm.setFieldsValue({
        ...selectItem,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await roleForm.validateFields()
      const postData = {...values}
      let requestFunc = api.createRole
      if (selectIndex != -1) {
        postData.id = selectItem.id
        requestFunc = api.editRole
      }
      const {data} = await requestFunc(postData)

      if (data.code == 0) {
        onHide()
        message.success('保存成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
    // try {
    //   const values = await roleForm.validateFields()
    //   const postData = {
    //     ...values,
    //     institutionUsername: cookies.name,
    //     parentRoleId: cookies.roleId,
    //     id: selectIndex == -1 ? null : selectItem.id,
    //   }
    //   const {data} = await api.handle_role(
    //     selectIndex == -1 ? 'post' : 'put',
    //     postData,
    //   )
    //
    //   if (data.code == 0) {
    //     onHide()
    //     message.success('保存成功')
    //     pullData()
    //   }
    // } catch (errorInfo) {
    //   console.log('Failed:', errorInfo)
    // }
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
      <Form key={Date.now} form={roleForm} name="roleForm" initialValues={{}}>
        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{required: true, message: '请输入角色名称'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="角色描述"
          name="description"
          rules={[{required: true, message: '请输入角色描述'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="数据权限"
          name="dataScope"
          rules={[{required: true, message: '请选择数据权限'}]}
        >
          <Select style={{width: '100%'}} placeholder="请选择">
            {USER_AUTH.map((v, i) => {
              return (
                <Select.Option value={v.key} key={v.key}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

roleForm.getInitialProps = async () => ({})

export default roleForm
