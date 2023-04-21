import {Form, Row, Col, message, Modal, Select, Input, Button} from 'antd'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/collection'
import TreeMembers from './TreeMembers'

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
    total,
    totalCs,
    pullData,
    tenantId,
    productList,
    collectionLevels,
    onSearch,
    sourceCom,
  } = props
  const [pids, setPids] = useState([])
  const [accountIds, setAccountIds] = useState([])
  const [accountNames, setAccountNames] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [batchedAssignModal] = Form.useForm()

  useEffect(() => {
    async function fetchData() {
      console.log(productList)
    }
    visible && fetchData()
  }, [visible])

  const onEdit = async () => {
    try {
      const values = await batchedAssignModal.validateFields()
      console.log(pids)
      if (pids.length) {
        const pidSource = Math.max.apply(null, pids)
        const pidTarget = Math.min.apply(null, pids)
        if (pidSource !== pidTarget) {
          return message.error('分配对象需同一岗位级别')
        }
      }
      if (!values.sendOrderNum && values.sendOrderNum != 0) {
        return message.error('分配数量未填写')
      }
      if (!accountIds.length) {
        return message.error('请选择要分配的催收员')
      }

      if (
        sourceCom == 'cs' &&
        (values.sendOrderNum < 1 || values.sendOrderNum > totalCs)
      ) {
        return message.error('分配数量须大于0小于总订单数')
      } else if (
        sourceCom != 'cs' &&
        (values.sendOrderNum < 1 || values.sendOrderNum > total)
      ) {
        return message.error('分配数量须大于0小于总订单数')
      }

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

  const changeProductId = (val) => {
    batchedAssignModal.setFieldsValue('productId', val)
  }
  const changeCollectionLevel = (val) => {
    batchedAssignModal.setFieldsValue('collectionLevel', val)
  }

  const onAllSearch = async () => {
    const values = await batchedAssignModal.validateFields()
    console.log(values)
    delete values.sendOrderNum
    onSearch(values)
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
          <Select onChange={(val) => changeProductId(val)} placeholder="请选择">
            <Select.Option value="">请选择</Select.Option>
            {productList.map((v, i) => (
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
          <Select
            onChange={(val) => changeCollectionLevel(val)}
            placeholder="请选择"
          >
            <Select.Option value="">请选择</Select.Option>
            {collectionLevels.map((v, i) => (
              <Select.Option key={i} value={v.code}>
                {v.description}
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
          <span>当前总单数：{total}</span>
        </Form.Item>
        <Form.Item label="分配数量" name="sendOrderNum">
          <Input placeholder="请输入整数，不得超过总单数" />
        </Form.Item>
        <Form.Item label="人员">
          <TreeMembers
            onSetPids={(payload) => setPids(payload)}
            onSetAccountIds={(payload) => setAccountIds(payload)}
            onSetAccountNames={(payload) => setAccountNames(payload)}
            onSetCompanyIds={(payload) => setCompanyIds(payload)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchedAssignModal
