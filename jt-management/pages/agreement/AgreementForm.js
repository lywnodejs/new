import {
  Form,
  Input,
  message,
  Select,
  Modal,
  Radio,
  Checkbox,
  Row,
  Col,
} from 'antd'
import React, {useEffect, useState} from 'react'
import api from '~/api/agreement'

function AgreementForm(props) {
  const [agreementForm] = Form.useForm()
  const [showPages, setShowPages] = useState([])
  const [showSignNode, setShowSignNode] = useState([])
  // const [editFunc, setEditFunc] = useState(null)

  const {
    selectIndex,
    visible,
    onHide,
    selectItem,
    pullData,
    allPages,
    productId,
    productList,
  } = props

  useEffect(() => {
    if (selectIndex == -1) {
      agreementForm.resetFields()
      agreementForm.setFieldsValue({readStatus: 0})
      setShowPages([])
      setShowSignNode([])
    } else {
      console.log(selectItem)
      agreementForm.setFieldsValue({
        ...selectItem,
        node: selectItem.nodeKey,
      })

      selectItem.applicationType && changeAppType(selectItem.applicationType)
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await agreementForm.validateFields()
      let params = {
        ...values,
        productId,
      }
      let editFunc = null
      params.isFirst = !params.isFirst ? 0 : 1
      params.templateName = props.tempData.find(
        (v) => v.id == params.templateId,
      ).name

      if (selectIndex == -1) {
        editFunc = api.addAgreement
      } else {
        editFunc = api.updateAgreement
        params.id = selectItem.id
      }
      const res = await editFunc(params)

      if (res.data.code == 0) {
        onHide()
        message.success('保存成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const findProductName = () => {
    let findItem = productList.find((item) => item.id == productId)
    return findItem ? findItem.name : ''
  }

  const getSelectByAppType = (appType, selectType) => {
    let item = props.appTypes.find((v) => v.key == appType)
    let pages = props[selectType][item.value]
    const keys = Object.keys(pages)
    return keys.map((key) => {
      return {
        key,
        value: pages[key],
      }
    })
  }

  const changeAppType = (key, type) => {
    // console.log(key)
    let pages = []
    let nodes = []
    if (!!key) {
      pages = getSelectByAppType(key, 'allPages')
      nodes = getSelectByAppType(key, 'signNode')
    }

    setShowPages(pages)
    setShowSignNode(nodes)
  }

  return (
    <Modal
      title={selectIndex === -1 ? '协议新增' : '协议编辑'}
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
        form={agreementForm}
        name="agreementForm"
        // initialValues={}
      >
        <Form.Item label="产品">
          <Form.Item noStyle>{findProductName()}</Form.Item>
        </Form.Item>

        <Form.Item
          label="应用类型"
          rules={[{required: true, message: '请选择应用类型'}]}
          name="applicationType"
        >
          <Select style={{width: '160px'}} onChange={changeAppType}>
            {props.appTypes.map((v, i) => (
              <Select.Option key={i} value={v.key}>
                {v.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="展示页面"
          rules={[{required: true, message: '请选择展示页面'}]}
          name="showPage"
        >
          <Select style={{width: '160px'}}>
            {showPages.map((v, i) => (
              <Select.Option key={i} value={v.key}>
                {v.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="协议名称"
          name="fileName"
          rules={[
            {required: true, message: '请输入协议名称'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && (value.length > 30 || value.length < 1)) {
                  return Promise.reject('输入范围大于1字符，小于等于30字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="示例：《借款协议》，最多30字符。" />
        </Form.Item>

        <Form.Item
          label="协议模板"
          name="templateId"
          rules={[{required: true, message: '请选择协议模板'}]}
        >
          <Select style={{width: '160px'}}>
            {props.tempData.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="是否首位" name="isFirst" valuePropName="checked">
          <Checkbox>首位，同页面存在多个协议时置于首位。</Checkbox>
        </Form.Item>

        <Form.Item
          label="强制阅读"
          name="readStatus"
          rules={[{required: true, message: '请选择是否强制阅读'}]}
        >
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="是否签章"
          name="isSignature"
          rules={[{required: true, message: '请选择是否签章'}]}
        >
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, curValues) => {
            return prevValues.isSignature !== curValues.isSignature
          }}
          noStyle
        >
          {({getFieldValue}) => {
            // console.log(getFieldValue('isSignature'))
            if (getFieldValue('isSignature') == 1) {
              return (
                <Form.Item
                  label="签章节点"
                  name="node"
                  rules={[{required: true, message: '请选择签章节点'}]}
                >
                  <Select style={{width: '160px'}}>
                    {showSignNode.map((v, i) => (
                      <Select.Option key={i} value={v.key}>
                        {v.value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          }}
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{required: true, message: '请选择状态'}]}
        >
          <Radio.Group>
            <Radio value={0}>停用</Radio>
            <Radio value={1}>启用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[
            // {required: true, message: '请输入描述'},
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
          <Input.TextArea placeholder="请输入至少5个字符" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

AgreementForm.getInitialProps = async () => ({})

export default AgreementForm
