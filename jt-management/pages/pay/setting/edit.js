import {Modal, Form, Input, Radio, InputNumber, TimePicker, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import apiPay from '~/api/pay'
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
  const [channels, setChannels] = useState([])

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      form.resetFields()
      setConfirmLoading(false)
    } else {
      let data = props.data

      form.setFieldsValue(data)
      if (data) {
        changePayType(data.payChannelType, data.payChannelCode)
      }
    }
  }, [props])

  const changePayType = (type, payChannelCode) => {
    let arr = props.channels.filter((v) => {
      return v.code.indexOf(`-${type}`) > -1
    })
    setChannels(arr)
    form.setFieldsValue({payChannelCode})
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
        const {...params} = values
        if (props.data) {
          params.id = props.data.id
        }
        let {
          data: {code},
        } = await apiPay.editPayChannelConfig(params)
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
          label="产品名称"
          name="productType"
          rules={[{required: true, message: '请选择产品名称'}]}
        >
          <Select placeholder="请选择产品名称" style={{width: '200px'}}>
            <Select.Option value="0">二类户</Select.Option>
            {props.products.map((v, i) => {
              return (
                <Select.Option value={v.productId + ''} key={i}>
                  {v.productName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="支付类型"
          name="payChannelType"
          rules={[{required: true, message: '请选择支付类型'}]}
        >
          <Select
            placeholder="请选择支付类型"
            style={{width: '200px'}}
            onChange={(v) => changePayType(v)}
          >
            <Select.Option value="in">收款</Select.Option>
            <Select.Option value="out">放款</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="支付通道"
          name="payChannelCode"
          rules={[{required: true, message: '请选择支付通道'}]}
        >
          <Select placeholder="请选择支付通道" style={{width: '200px'}}>
            {channels.map((v, i) => {
              return (
                <Select.Option value={v.code} key={i}>
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="路由比例"
          name="channelWeight"
          rules={[{required: true, message: '路由比例不可为空'}]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="请输入路由比例（0-100）"
            min={0}
            max={100}
            precision={0}
          />
        </Form.Item>

        <Form.Item
          label="启用状态"
          name="relaStatus"
          rules={[{required: true, message: '请选择启用状态'}]}
        >
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
