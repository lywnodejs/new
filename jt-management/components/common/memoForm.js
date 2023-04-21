import {Form, Input, message, Select, Modal, InputNumber} from 'antd'
import {useEffect, useState, useRef} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/credit'

function memoForm(props) {
  const [cookies] = useCookies(['name'])
  const [memoForm] = Form.useForm()
  const {visible, onHide, selectItem, onSubmit} = props

  useEffect(() => {
    memoForm.resetFields()
  }, [visible])

  const onEdit = () => {
    onSubmit(memoForm, selectItem)
  }
  return (
    <Modal
      title={'备注'}
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
        form={memoForm}
        name="memoForm"
        initialValues={{
          note: '',
        }}
      >
        <Form.Item
          label="备注"
          name="note"
          rules={[{required: true, message: '请输入备注'}]}
        >
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

memoForm.getInitialProps = async () => ({})

export default memoForm
