import {Modal, Form, Input, Radio, InputNumber, TimePicker, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import api from '~/api/authority'
import moment from 'moment'
import _ from 'lodash'
import {useCookies} from 'react-cookie'
const {RangePicker} = TimePicker

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 15},
}

const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [showRoles, setShowRoles] = useState(props.branches || [])
  const [form] = Form.useForm()
  const [cookies] = useCookies(['name'])
  const [showDepartments, setShowDepartments] = useState([])
  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      form.resetFields()
      setConfirmLoading(false)
    } else {
      let data = props.data
      if (data && data.startTime) {
        data.time = [
          moment(data.startTime, 'HH:mm'),
          moment(data.endTime, 'HH:mm'),
        ]
      }
      form.setFieldsValue(data)
    }

    if (props.departments) {
      setShowDepartments(props.departments)
    }
  }, [props])

  const handleSearchDepart = (keyword) => {
    if (!keyword) {
      return setShowDepartments(props.departments)
    }
    const arr = props.departments.filter((v) => v.name.indexOf(keyword) > -1)
    setShowDepartments(arr)
  }

  const handleCancel = () => {
    form.resetFields()
    form.setFieldsValue(null)
    props.close()
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const {time, ...paramData} = values
        let params = {}
        if (time == undefined) {
          params = {
            ...paramData,
          }
        } else {
          params = {
            startTime: moment(time[0]).format('HH:mm'),
            endTime: moment(time[1]).format('HH:mm'),
            ...paramData,
          }
        }
        if (props.data) {
          params.id = props.data.id
        }
        let {
          data: {code},
        } = await apiBusiness.editBranchItem(params)
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

  return (
    <Modal
      title={props.data ? '编辑' : '新增'}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item
          label="机构代码"
          name="code"
          // rules={[{required: true, message: '机构代码不可为空'}]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          label="机构名称"
          name="name"
          rules={[{required: true, message: '机构名称不可为空'}]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          label="所属组织架构"
          rules={[{required: true, message: '所属组织架构不可为空'}]}
          name="departmentId"
        >
          <Select
            showSearch
            placeholder="请选择部门"
            filterOption={false}
            defaultActiveFirstOption={false}
            onSearch={handleSearchDepart}
            style={{width: '200px'}}
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

        <Form.Item
          label="机构地址"
          name="address"
          // rules={[{required: true, message: '机构地址不可为空'}]}
        >
          <Input maxLength={50} />
        </Form.Item>

        <Form.Item
          label="联系电话"
          name="mobile"
          // rules={[{required: true, message: '联系电话不可为空'}]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          label="营业时间"
          name="time"
          // rules={[{required: true, message: '营业时间不可为空'}]}
        >
          <RangePicker format="HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
