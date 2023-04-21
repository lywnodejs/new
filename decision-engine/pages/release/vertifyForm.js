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
import api from '~/api/risk'

function vertifyForm(props) {
  const [vertifyForm] = Form.useForm()
  const {
    visible,
    onHide,
    selectItem,
    pullData,
    activeKey,
    activeModuleKey,
  } = props

  useEffect(() => {
    vertifyForm.resetFields()
  }, [visible])

  const onEdit = async () => {
    try {
      const values = await vertifyForm.validateFields()

      const {data} = await api.save_risk_approve_vertify({
        ...values,
        id: selectItem.id,
        productId: activeKey,
        moduleType: activeModuleKey,
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
          pass: '',
          auditDesc: '',
        }}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>类目：{selectItem.actionType}</Col>
        </Row>
        <Row>
          <Col>编号：</Col>

          <Col>{selectItem.actionCodes}</Col>
        </Row>

        <Form.Item
          label="审核结论"
          name="pass"
          rules={[{required: true, message: '请选择审核结论'}]}
        >
          <Radio.Group>
            <Radio value="1">通过</Radio>
            <Radio value="0">
              拒绝
              <span style={{color: 'red', paddingLeft: '3px'}}>
                (会导致提交内容丢失，谨慎操作)
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="反馈详情"
          name="auditDesc"
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
