import {Form, Input, message, Select, Modal, Radio} from 'antd'
import {useEffect, useState, useRef} from 'react'
import {isIP} from '~/utils'
import api from '~/api/system'

function ticketForm(props) {
  const [ticketForm] = Form.useForm()
  const {selectIndex, visible, onHide, selectItem, pullData, labels} = props

  useEffect(() => {
    if (selectIndex == -1) {
      ticketForm.resetFields()
    } else {
      selectItem.useStatus = String(selectItem.useStatus)
      ticketForm.setFieldsValue({
        ...selectItem,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await ticketForm.validateFields()
      if (values.ip) {
        let newIp = values.ip.replace(/,/g, '，')
        let ipArr = newIp.split('，')
        if (ipArr.filter((item) => item.length).some((one) => !isIP(one))) {
          return message.error('IP格式不正确，请检查。')
        }
      }

      if (selectIndex == -1) {
        const {data} = await api.add_ipconfig_one({
          ...values,
        })
        if (data.code == 0) {
          onHide()
          message.success('新增成功')
          pullData()
        }
      } else {
        const {data} = await api.edit_ipconfig_one({
          ...values,
          id: selectItem.id,
        })
        if (data.code == 0) {
          onHide()
          message.success('编辑成功')
          pullData()
        }
      }

      console.log('Success:', values)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const changeLabel = (val) => {
    ticketForm.setFieldsValue({
      label: val,
    })
  }
  return (
    <Modal
      title={'白名单配置'}
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
        form={ticketForm}
        name="ticketForm"
        initialValues={{
          companyName: '',
          label: '',
          useStatus: '0',
        }}
      >
        <Form.Item
          label="公司名称"
          name="companyName"
          rules={[
            {required: true, message: '请输入公司名称'},
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
          <Input placeholder="请输入公司名称" />
        </Form.Item>

        <Form.Item
          label="标签"
          name="label"
          rules={[{required: true, message: '请选择标签'}]}
        >
          <Select style={{width: '160px'}} onChange={(val) => changeLabel(val)}>
            {labels.map((v, i) => (
              <Select.Option key={i} value={v.code}>
                {v.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <>
              <span style={{color: 'red'}}>*</span>IP地址
            </>
          }
          style={{marginBottom: '10px'}}
        >
          <Form.Item
            name="ip"
            rules={[
              {required: true, message: '请输入IP地址'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (value && value.length > 500) {
                    return Promise.reject('最多输入500个字符')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
            style={{marginBottom: '4px'}}
          >
            <Input.TextArea placeholder="请输入IP地址" />
          </Form.Item>
          <p>输入多个IP时，请用“，”隔开</p>
        </Form.Item>
        <Form.Item
          label="状态"
          name="useStatus"
          rules={[{required: true, message: '请选择状态'}]}
        >
          <Radio.Group>
            <Radio value="0">停用</Radio>
            <Radio value="1">启用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

ticketForm.getInitialProps = async () => ({})

export default ticketForm
