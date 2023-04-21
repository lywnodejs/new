import {Form, Row, Col, message, Modal, Select, InputNumber, Button} from 'antd'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/collection'

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 20},
}

function BatchedAssignModal(props) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [batchedAssignModal] = Form.useForm()

  useEffect(() => {
    setVisible(props.visible)
    if (props.visible) {
      setLoading(false)
      batchedAssignModal.resetFields()
    }
  }, [props.visible])

  const onEdit = async () => {
    try {
      const values = await batchedAssignModal.validateFields()

      console.log(values)
      let params = {
        collectionOrderIdList: null,
        accountIdList: [...values.accountIds],
        accountNameList: [],
        companyIdList: [1],
        productId: values.productId,
        sendOrderNum: values.sendOrderNum,
        collectionLevel: values.collectionLevel,
        type: 2,
      }
      values.accountIds.forEach((id) => {
        let item = props.showList.find((item) => item.id == id)
        params.accountNameList.push(item.accountName)
      })
      setLoading(true)
      props.onOk(params, onFail)
      return
      const {
        data: {data, code},
      } = await api.edit_overdueAlloc_allselect({
        type: 2,
        collectionOrderIdList: null,
        accountIdList: accountIds,
        accountNameList: accountNames,
        companyIdList: companyIds,
        productId: values.productId,
        sendOrderNum: values.sendOrderNum,
        collectionLevel: values.collectionLevel,
        tenantId,
      })
      if (code == 0) {
        onHide()
        message.success('按量分配成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const onFail = () => {
    setLoading(false)
  }

  const onAllSearch = async () => {
    const values = await batchedAssignModal.validateFields([
      'productId',
      'collectionLevel',
    ])
    props.onSearch(values)
  }
  return (
    <Modal
      title="按量分配"
      visible={visible}
      onOk={onEdit}
      onCancel={props.onHide}
      confirmLoading={loading}
      cancelText="取消"
      okText="确定"
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
          name="productId"
          rules={[{required: true, message: '请先选择产品'}]}
        >
          <Select placeholder="请选择">
            <Select.Option value="">请选择</Select.Option>
            {props.productList.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="催收级别"
          name="collectionLevel"
          rules={[{required: true, message: '请先选择催收级别'}]}
        >
          <Select placeholder="请选择">
            <Select.Option value="">请选择</Select.Option>
            {props.collectionLevels.map((v, i) => (
              <Select.Option key={i} value={v.code}>
                {v.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* {!onAssignSubmit && (
          
        )} */}

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            style={{marginRight: 15}}
            onClick={onAllSearch}
          >
            总单数查询
          </Button>
          <span>当前总单数：{props.total}</span>
        </Form.Item>
        <Form.Item
          label="分配数量"
          name="sendOrderNum"
          rules={[{required: true, message: '请输入分配数量'}]}
        >
          <InputNumber
            style={{width: '100%'}}
            min={1}
            precision={0}
            max={props.total || 1}
            placeholder="请输入整数，不得超过总单数"
          />
        </Form.Item>
        <Form.Item
          label="人员"
          rules={[{required: true, message: '请选择分配对象'}]}
          name="accountIds"
        >
          <Select mode="multiple" style={{width: 450}}>
            {props.showList.map((v, i) => {
              return (
                <Select.Option value={v.id} key={i}>
                  {v.accountName}_{v.roleName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchedAssignModal
