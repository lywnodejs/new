import React, {useEffect, useState} from 'react'
import {Button, message, Form, Divider, Row, Col, Input} from 'antd'
import Router, {withRouter} from 'next/router'
import GenerateOutputVariableModal from '../GenerateOutputVariableModal'
import RuleEditModal from '../RuleEditModal'
import {VARIABLETABS} from '~/utils/const'
import api from '~/api/risk'
const {TextArea} = Input
function body({router, id, productId, category, moduleType, partialPro}) {
  const [form] = Form.useForm()
  const [groups, setGroups] = useState([])
  const [visible, setVisible] = useState(false)
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})

  useEffect(() => {
    function fetchData() {
      fetchGroups()
      if (id == 'new') {
        form.resetFields()
      } else {
        fetchList()
      }
    }
    fetchData()
  }, [])
  const fetchGroups = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_groups({
        productId,
        fieldGroupType: 1,
      })
      if (code == 0) {
        setGroups(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchList = async () => {
    let postData = {
      id,
      productId,
      moduleType,
    }
    let postApi = partialPro
      ? api.fetch_risk_derive_pro_detail(postData)
      : api.fetch_risk_derive_detail(postData)
    try {
      const {
        data: {data, code},
      } = await postApi
      if (code == 0) {
        setSelectItem(data)
        form.setFieldsValue({
          ...data,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSave = async () => {
    try {
      const values = await form.validateFields()
      const {
        actionCode,
        actionName,
        description,
        scriptSource,
        fieldOut,
      } = values

      let postData = {
        productId,
        actionCode,
        actionName,
        description,
        scriptSource,
        fieldList: selectItem.fieldList,
        fieldOut,
        moduleType,
      }
      const {
        data: {data, code},
      } = await api.update_risk_rulederive(postData)
      if (code == 0) {
        message.success('保存成功')
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onCancel = () => {
    Router.back()
  }
  const setFieldCb = (val) => {
    form.setFieldsValue({
      fieldOut: val,
    })
  }
  const onFinalValidateAndSubmit = async (params) => {
    const {scriptSource, fieldList} = params
    try {
      const {
        data: {data, code},
      } = await api.validate_risk_script({
        scriptSource,
        fieldList,
        productId,
      })
      if (code == 0) {
        form.setFieldsValue({
          scriptSource,
        })
        setSelectItem({scriptSource, fieldList})
        setRuleEditVisible(false)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onSetScriptSource = () => {
    setRuleEditVisible(true)
  }
  const onSetFieldOut = () => {
    setVisible(true)
  }
  return (
    <>
      <div className="searchForm">
        <Form form={form} name="form" initialValues={{}}>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                label="编号"
                name="actionCode"
                rules={[{required: true, message: '请输入编号'}]}
              >
                <Input placeholder="请输入" disabled={id != 'new'} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="中文名称"
                name="actionName"
                rules={[{required: true, message: '请输入名称'}]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="说明"
                name="description"
                rules={[{required: true, message: '请输入说明'}]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="赋值给X"
                name="fieldOut"
                rules={[{required: true, message: '请输入赋值给X'}]}
              >
                <Input placeholder="请输入" onClick={() => onSetFieldOut()} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="规则"
                name="scriptSource"
                rules={[{required: true, message: '请输入规则'}]}
              >
                <TextArea
                  placeholder="请输入"
                  onClick={() => onSetScriptSource()}
                  autoSize={{minRows: 3, maxRows: 8}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={onSave}
              style={{marginLeft: '5px'}}
            >
              保存
            </Button>
          </Row>
        </Form>
      </div>
      <GenerateOutputVariableModal
        {...{
          groups,
          visible,
          onHide: () => setVisible(false),
          activeKey: productId,
          activeCategoryKey: category,
          setFieldCb,
          moduleType,
        }}
      />
      <RuleEditModal
        {...{
          variableTabs: VARIABLETABS,
          activeKey: productId,
          visible: ruleEditVisible,
          selectItem,
          onHide: () => setRuleEditVisible(false),
          onFinalValidateAndSubmit,
        }}
      />
    </>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
