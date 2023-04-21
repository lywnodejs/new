import {Modal, Form, Input, Radio, InputNumber, message} from 'antd'
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
    }

    if (props.data) {
      form.resetFields()
      form.setFieldsValue(props.data)
    } else {
      form.resetFields()
    }
  }, [props])

  const handleCancel = () => {
    props.close('edit')
  }

  const handleOk = async () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const params = {...values}

        if (props.data) {
          params.id = props.data.id
        }
        let {
          data: {code},
        } = await api.editBusinessItem(params)
        setConfirmLoading(false)
        if (code == 0) {
          message.success('编辑成功')
          props.close('edit', true)
        }
      })
      .catch((err) => {
        console.error(err)
        setConfirmLoading(false)
      })
  }

  return (
    <Modal
      title={props.data ? '编辑' : '新增业务'}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item
          label="业务名称"
          name="name"
          rules={[{required: true, message: '业务名称不可为空'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="关联产品ID" name="bizProductId">
          <Input />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
