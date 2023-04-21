import {Modal, Form, Input, Radio, InputNumber} from 'antd'
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
      form.resetFields()
      setConfirmLoading(false)
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
        const {companyName, ...paramData} = values
        const params = {
          id: props.data.id,
          ...paramData,
        }
        let {
          data: {code},
        } = await api.editProduct(params)
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
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{billingMode: 1, ...props.data}}
      >
        <Form.Item label="数据源名称" name="companyName">
          <Input disabled />
        </Form.Item>

        <Form.Item label="数据产品名称" name="name">
          <Input disabled />
        </Form.Item>

        <Form.Item label="收费方式" name="billingMode" required>
          <Radio.Group>
            <Radio value={1}>查询</Radio>
            <Radio value={2}>查得</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="单价(元/次)">
          <Form.Item name="unitPrice" noStyle>
            <InputNumber
              style={{width: '100%'}}
              min={0}
              precision={2}
              placeholder="数值大于0，最多保留两位小数"
            />
          </Form.Item>
          <span className="ant-form-text"> 默认当日起生效</span>
        </Form.Item>

        <Form.Item
          label="缓存（天）"
          name="cacheDuration"
          rules={[{required: true, message: '缓存时长不可为空'}]}
        >
          <InputNumber style={{width: '100%'}} min={0} precision={0} />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
