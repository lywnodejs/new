import {
  Button,
  InputNumber,
  Modal,
  Form,
  Select,
  Checkbox,
  Transfer,
} from 'antd'
import React, {useEffect, useState} from 'react'

export default function (props) {
  const [targetKeys, setTargetKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (props.visible) {
      form.resetFields()
      if (props.data) {
        let params = {
          ...props.data,
        }

        if (Array.isArray(props.data.detailList)) {
          let ids = props.data.detailList.map((v) => v.accountId)
          params.detailList = ids
          setTargetKeys(ids)
        }
        form.setFieldsValue(params)
      }
    } else {
      setLoading(false)
      setTargetKeys([])
      setSelectedKeys([])
    }
  }, [props.visible])

  useEffect(() => {
    if (!props.loading) {
      setLoading(props.loading)
    }
  }, [props.loading])

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys)
  }

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const handleOk = () => {
    form
      .validateFields()
      .then(({historyFirstYn, detailList, ...values}) => {
        values.historyFirstYn = historyFirstYn ? 1 : 0
        values.detailList = detailList.map((id) => {
          let item = props.userData.find((v) => v.id == id)
          return {
            accountId: id,
            accountName: item.accountName,
          }
        })
        setLoading(true)
        props.getFormData(values)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  }
  const tailLayout = {
    wrapperCol: {offset: 6, span: 16},
  }
  return (
    <Modal
      title="自动分案设置"
      visible={props.visible}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => props.setVisible(false)}
      width={860}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item
          label="产品名称"
          name="productId"
          rules={[{required: true, message: '请选择产品名称'}]}
        >
          <Select style={{width: '200px'}} placeholder="请选择">
            {props.collectionProducts.map((v) => {
              return (
                <Select.Option value={+v.code} key={v.code}>
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="逾期级别"
          name="collectionLevel"
          rules={[{required: true, message: '请选择逾期级别'}]}
        >
          <Select style={{width: '200px'}} placeholder="请选择">
            {props.levelData.map((v) => {
              return (
                <Select.Option value={v.code} key={v.code}>
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          {...tailLayout}
          name="historyFirstYn"
          valuePropName="checked"
        >
          <Checkbox>优先分配（可关联历史订单的人员）</Checkbox>
        </Form.Item>

        <Form.Item
          label="委案人员"
          name="detailList"
          rules={[{required: true, message: '请选择委案人员'}]}
        >
          <Transfer
            rowKey={(record) => record.id + ''}
            dataSource={props.userData}
            titles={['全部人员', '委案人员']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={(item) => item.accountName}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
