import {Form, message, Select, Modal, Row, Col} from 'antd'
import {useEffect} from 'react'
import {findApiByKey} from '../mapActionToApi'

function CopyStrategyModal(props) {
  const {
    visible,
    onHide,
    variableIds,
    pullData,
    productList,
    activeModuleKey,
    activeKey,
    activeCategoryKey,
  } = props
  const [copyStrategyForm] = Form.useForm()

  useEffect(() => {
    function fetchData() {
      copyStrategyForm.resetFields()
    }
    visible && fetchData()
  }, [visible])

  const onEdit = async () => {
    try {
      const values = await copyStrategyForm.validateFields()

      let postApi = findApiByKey(
        +activeCategoryKey,
        {
          toPId: values.productId,
          ids: variableIds,
          fromPId: activeKey,
          moduleType: activeModuleKey,
        },
        'copy',
      )

      const {
        data: {data, code},
      } = await postApi()

      if (code == 0) {
        onHide()
        message.success('复制成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeProduct = (val) => {
    copyStrategyForm.setFieldsValue('productId', val)
  }

  return (
    <Modal
      title="复制"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={460}
      height={600}
    >
      <Form
        key={Date.now}
        form={copyStrategyForm}
        name="copyStrategyForm"
        initialValues={{
          productId: '',
        }}
      >
        <Row gutter={[0, 16]}>
          <Col span={5}>您共选择：</Col>
          <Col span={19}>
            {Array.isArray(variableIds) ? variableIds.length : 0}
            项目，请选择分配产品
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="productId"
              rules={[{required: true, message: '请选择产品'}]}
            >
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeProduct(val)}
              >
                {productList.map((v, i) => (
                  <Select.Option key={i} value={v.produceId}>
                    {v.productName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CopyStrategyModal
