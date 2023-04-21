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
  Radio,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import api from '~/api/marketing'

function vertifyForm(props) {
  const [vertifyForm] = Form.useForm()
  const {visible, onHide, selectItem, pullData} = props

  useEffect(() => {
    vertifyForm.resetFields()
  }, [visible])

  const onEdit = async () => {
    try {
      const values = await vertifyForm.validateFields()

      const {data} = await api.vertify_marketing_ticket({
        ...values,
        id: selectItem.id,
        status:
          values.status == 1
            ? selectItem.auditStatus
            : selectItem.auditStatus == 1
            ? 2
            : 1,
      })
      if (data.code == 0) {
        onHide()
        message.success('审核成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title={'审核'}
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
        form={vertifyForm}
        name="vertifyForm"
        initialValues={{
          status: '',
          auditSource: '',
        }}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>券ID：{selectItem.id}</Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            审核内容：状态{selectItem.auditStatus == 1 ? '停用' : '启用'}变更为
            {selectItem.auditStatus == 1 ? '启用' : '停用'}
          </Col>
        </Row>

        <Form.Item
          label="审核结论"
          name="status"
          rules={[{required: true, message: '请选择审核结论'}]}
        >
          <Radio.Group>
            <Radio value="1">通过</Radio>
            <Radio value="0">拒绝</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="反馈详情"
          name="auditSource"
          rules={[
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
          <Input.TextArea placeholder="最少输入5个字符" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

vertifyForm.getInitialProps = async () => ({})

export default vertifyForm
