import {
  Form,
  Input,
  message,
  Select,
  Modal,
  InputNumber,
  TreeSelect,
  Row,
  Col,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import api from '~/api/marketing'

function ticketForm(props) {
  const [ticketForm] = Form.useForm()
  const {selectIndex, visible, onHide, selectItem, pullData} = props

  useEffect(() => {
    if (selectIndex == -1) {
      ticketForm.resetFields()
    } else {
      ticketForm.setFieldsValue({
        ...selectItem,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await ticketForm.validateFields()
      if (selectIndex == -1) {
        const {data} = await api.add_marketing_ticket({
          ...values,
          status: 2,
          validUnit: 'day',
        })
        if (data.code == 0) {
          onHide()
          message.success('新增成功')
          pullData()
        }
      } else {
        const {data} = await api.edit_marketing_ticket({
          ...values,
          id: selectItem.id,
          status: selectItem.status,
          validUnit: 'day',
        })
        if (data.code == 0) {
          onHide()
          message.success('编辑成功')
          pullData()
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title={selectIndex === -1 ? '券新增' : '券编辑'}
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
          marketingAmt: '',
          marketingNum: '',
          validDate: '',
          source: '',
        }}
      >
        {selectIndex !== -1 && (
          <Row gutter={[0, 16]}>
            <Col span={24}>券ID：{selectItem.id}</Col>
          </Row>
        )}

        <Form.Item
          label="金额"
          name="marketingAmt"
          rules={[
            {required: true, message: '请输入券的面值'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                var r = /^[0-9]*[1-9][0-9]*$/
                if (value && !r.test(value)) {
                  return Promise.reject('只可输入整数')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <InputNumber
            min={0}
            placeholder="请输入券的面值，只可输入整数"
            style={{width: '280px'}}
          />
        </Form.Item>

        <Form.Item
          label="数量"
          name="marketingNum"
          rules={[
            {required: true, message: '请输入发券数量'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                var r = /^[0-9]*[1-9][0-9]*$/
                if (value && !r.test(value)) {
                  return Promise.reject('只可输入整数')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <InputNumber
            min={0}
            placeholder="请输入发券数量，只可输入整数"
            style={{width: '280px'}}
          />
        </Form.Item>

        <Form.Item
          label="有效期（天）"
          name="validDate"
          rules={[
            {required: true, message: '请输入有效期'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                var r = /^[0-9]*[1-9][0-9]*$/
                if (value && !r.test(value)) {
                  return Promise.reject('只可输入整数')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <InputNumber
            min={0}
            placeholder="请输入有效期，只可输入整数"
            style={{width: '280px'}}
          />
        </Form.Item>

        <Form.Item
          label="使用说明"
          name="source"
          rules={[
            {required: true, message: '请输入使用说明'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length < 5) {
                  return Promise.reject('最少输入5个字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input.TextArea placeholder="展示给用户，最少输入5个字符" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

ticketForm.getInitialProps = async () => ({})

export default ticketForm
