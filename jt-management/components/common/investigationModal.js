import {Form, Input, Modal} from 'antd'
import {useEffect} from 'react'

function investigationModal(props) {
  const [investigationModal] = Form.useForm()
  const {visible, onHide, selectItem, onSubmit} = props

  useEffect(() => {
    investigationModal.resetFields()
    investigationModal.setFieldsValue({
      ...selectItem,
    })
  }, [visible])

  const onEdit = () => {
    onSubmit(investigationModal, selectItem)
  }
  return (
    <Modal
      title={'下户调查'}
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
        form={investigationModal}
        name="investigationModal"
        initialValues={{
          note: '',
        }}
      >
        <Form.Item
          label="调查内容"
          name="note"
          rules={[{required: true, message: '告知下户调查内容'}]}
        >
          <Input.TextArea placeholder="告知下户调查内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

investigationModal.getInitialProps = async () => ({})

export default investigationModal
