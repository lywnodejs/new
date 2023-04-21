import {Modal, Form, Input} from 'antd'
import {useEffect, useState} from 'react'
import api from '~/utils/api'

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 15},
}

const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      setConfirmLoading(false)
      form.resetFields()
    } else {
      form.setFieldsValue(props.data)
    }
  }, [props])

  const handleCancel = () => {
    props.close('edit')
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const params = {
          id: props.data.id,
          ...values,
        }
        let {
          data: {code},
        } = await api.editDSItem(params)
        setConfirmLoading(false)
        if (code == 0) {
          props.close('edit', true, true)
        }
      })
      .catch((err) => {
        setConfirmLoading(false)
      })
  }

  return (
    <Modal
      title="编辑"
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item label="数据源名称" name="companyName">
          <Input disabled />
        </Form.Item>

        <Form.Item label="数据源联系人" name="contactName">
          <Input />
        </Form.Item>

        <Form.Item
          label="数据源联系方式"
          name="contactMobile"
          validateTrigger="onBlur"
          rules={[
            {pattern: /^1[0-9]{10}$/, message: '联系方式格式有误，请重新输入'},
          ]}
        >
          <Input maxLength="11" />
        </Form.Item>

        <Form.Item label="我方对接人" name="bdName">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
