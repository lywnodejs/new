import {Modal, Form, Input, Radio, InputNumber, TimePicker, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import _ from 'lodash'

const {RangePicker} = TimePicker

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 15},
}

const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [showDepartments, setShowDepartments] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      setConfirmLoading(false)
    } else {
      form.setFieldsValue({status: 1, ...props.data})
      console.log('showModalData:', props.data)
      initDepartments()
    }
  }, [props])

  const handleCancel = () => {
    form.resetFields()
    form.setFieldsValue(null)
    props.close()
  }

  const initDepartments = () => {
    if (props.data) {
      handleChangeBranch(props.data.branchNetworkId, 'init')
    } else {
      setDepartments([])
      setShowDepartments([])
    }
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const {...params} = values

        if (props.data) {
          params.id = props.data.id
        }
        let {
          data: {code},
        } = await apiBusiness.editManagerItem(params)
        setConfirmLoading(false)
        if (code == 0) {
          form.resetFields()
          form.setFieldsValue(null)
          props.close(true, true)
        }
      })
      .catch((err) => {
        setConfirmLoading(false)
      })
  }

  const handleSearchDepart = (keyword) => {
    const branchNetworkId = form.getFieldValue('branchNetworkId')
    console.log(branchNetworkId)
    if (!keyword) {
      if (!branchNetworkId) {
        return initDepartments()
      }
      return handleChangeBranch(branchNetworkId, 'change')
    }
    const arr = departments.filter((v) => v.name.indexOf(keyword) > -1)
    setShowDepartments(arr)
  }

  const handleChangeBranch = (id, type) => {
    const item = props.networkDepartmentTree.find((v) => v.networkId == id)
    if (item && Array.isArray(item.departmentVoList)) {
      setDepartments(item.departmentVoList)
      setShowDepartments(item.departmentVoList)
    } else {
      setDepartments([])
      setShowDepartments([])
    }
    if (!type) {
      form.setFieldsValue({departmentId: null})
    }
  }

  return (
    <Modal
      title={props.data ? '编辑信息' : '新增人员'}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item
          label="工号"
          name="jobNumber"
          rules={[{required: true, message: '工号不可为空'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="客户经理姓名"
          name="name"
          rules={[{required: true, message: '客户经理姓名不可为空'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="联系电话"
          name="mobile"
          rules={[
            {required: true, message: '联系电话不可为空'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (!/^1[3456789]\d{9}$/.test(value)) {
                  return Promise.reject('手机号格式错误')
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ]}
        >
          <Input style={{width: '100%'}} />
        </Form.Item>

        <Form.Item
          label="所属机构"
          name="branchNetworkId"
          rules={[{required: true, message: '所属机构不可为空'}]}
        >
          <Select
            onChange={(id) => handleChangeBranch(id)}
            style={{width: '100%'}}
          >
            {props.branch.map((v, i) => {
              return (
                <Select.Option value={v.id} key={v.id}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="对应组织架构"
          rules={[{required: true, message: '对应组织架构不可为空'}]}
          name="departmentId"
        >
          <Select
            showSearch
            placeholder="请选择部门"
            filterOption={false}
            defaultActiveFirstOption={false}
            onSearch={handleSearchDepart}
            // onChange={handleChangeDepart}
            style={{width: '100%'}}
          >
            {showDepartments.map((v, i) => {
              return (
                <Select.Option value={v.id} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="状态" name="status" required>
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
