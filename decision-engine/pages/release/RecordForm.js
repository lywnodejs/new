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
  const [detail, setDetail] = useState({})

  useEffect(() => {
    visible && fetchRecords()
  }, [visible])

  const fetchRecords = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_approve_vertifyrecord({
        id: selectItem.id,
        moduleType: activeModuleKey,
      })
      if (code == 0) {
        setDetail(data)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title={'审核记录'}
      maskClosable={false}
      visible={visible}
      destroyOnClose
      forceRender
      onCancel={onHide}
      onOk={onHide}
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
          <Col span={24}>审批结论：{detail.stage}</Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col span={24}>反馈详情：{detail.auditDesc}</Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col span={24}>审批时间：{detail.auditTime}</Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col span={24}>审批人：{detail.auditUser}</Col>
        </Row>
      </Form>
    </Modal>
  )
}

vertifyForm.getInitialProps = async () => ({})

export default vertifyForm
