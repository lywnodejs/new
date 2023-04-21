import {Form, Row, Col, message, Modal, Select, Input, Button} from 'antd'
import {useEffect, useState} from 'react'
import apiReview from '~/api/review'

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 20},
}

function BatchedAssignModal(props) {
  const {
    visible,
    onHide,
    productList,
    selectData,
    assignType,
    verifyStatus,
  } = props

  const [batchedAssignModal] = Form.useForm()
  const [selectValue, setSelectValue] = useState([])
  const [size, setSize] = useState([])

  useEffect(() => {
    async function fetchData() {
      console.log(productList)
    }
    visible && fetchData()
  }, [visible])

  const changeProductId = (val) => {
    batchedAssignModal.setFieldsValue('productId', val)
  }

  const onAllSearch = async () => {
    const values = await batchedAssignModal.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_countOrder({
        productType: values.productType,
        verifyStatus: verifyStatus,
      })
      if (code == 0) {
        message.success('查询成功')
        setSize(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (value) => {
    setSelectValue(value)
  }

  const onEdit = async () => {
    const values = await batchedAssignModal.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_assign_update({
        assignType: assignType,
        verifyStatus: verifyStatus,
        checkedUser: selectValue,
        ...values,
      })
      if (code == 0) {
        message.success('选择分配成功')
        onHide()
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Modal
      title="按量分配"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      forceRender
      width={600}
      destroyOnClose
    >
      <Form
        {...layout}
        form={batchedAssignModal}
        name="batchedAssignModal"
        initialValues={{productId: '', collectionLevel: ''}}
      >
        <Form.Item
          label="产品"
          name="productType"
          rules={[{required: true, message: '请先选择产品'}]}
        >
          <Select onChange={(val) => changeProductId(val)} placeholder="请选择">
            <Select.Option value="">请选择</Select.Option>
            {productList.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            style={{marginRight: 15}}
            onClick={onAllSearch}
          >
            总单数查询
          </Button>
          <span>当前总单数：{size}</span>
        </Form.Item>
        <Form.Item label="分配数量" name="num">
          <Input placeholder="请输入整数，不得超过总单数" />
        </Form.Item>
        <Form.Item label="人员">
          <Select mode="multiple" onChange={handleChange}>
            {selectData.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.accountName}_{v.roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchedAssignModal
