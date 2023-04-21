import React, {useEffect, useState} from 'react'
import {SettingOutlined} from '@ant-design/icons'
import {Button, message, Form, Divider, Input, Row, Col} from 'antd'
import Router, {withRouter} from 'next/router'
import RuleMatrixTableList from './RuleMatrixTableList'
import GenerateOutputVariableModal from '../GenerateOutputVariableModal'
import RuleEditModal from '../RuleEditModal'
import api from '~/api/risk'
import {VARIABLETABS} from '~/utils/const'

function body({router, id, productId, category, moduleType, partialPro}) {
  const [ruleIds, setRuleIds] = useState([])
  const [list, setList] = useState({})
  const [groups, setGroups] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})
  const [selectRule, setSelectRule] = useState({})
  const [selectIndex, setSelectIndex] = useState({})
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
  const [variableTabs, setVariableTabs] = useState([])
  useEffect(() => {
    function fetchData() {
      if (id != 'new') {
        fetchList()
      } else {
        setList({
          xDimensionRuleList: [
            {
              scriptSource: '其他',
              id: '',
              others: 1,
              fieldList: [],
              valueList: null,
            },
          ],
          yDimensionRuleList: [
            {
              scriptSource: '其他',
              id: '',
              others: 1,
              fieldList: [],
              valueList: ['0'],
            },
          ],
        })
      }
      fetchGroups()
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
      id: id == 'new' ? null : id,
      productId,
      moduleType,
    }

    let postApi = partialPro
      ? api.fetch_risk_matrix_pro_detail(postData)
      : api.fetch_risk_matrix_detail(postData)
    try {
      const {
        data: {data, code},
      } = await postApi
      if (code == 0) {
        data.xDimensionRuleList = data.xDimensionRuleList || [
          {
            scriptSource: '其他',
            id: '',
            others: 1,
            fieldList: [],
            valueList: null,
          },
        ]
        data.yDimensionRuleList = data.yDimensionRuleList || [
          {
            scriptSource: '其他',
            id: '',
            others: 1,
            fieldList: [],
            valueList: ['0'],
          },
        ]
        setList(data)
        form.setFieldsValue({
          fieldOut: data.fieldOut,
          matrixName: data.matrixName,
          matrixCode: data.matrixCode,
          description: data.description,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSave = async () => {
    try {
      const values = await form.validateFields()
      let postData = {
        matrixId: id == 'new' ? null : id,
        matrixDetailId: list.matrixDetailId,
        fieldOut: values.fieldOut,
        productId,
        xDimensionRuleList: list.xDimensionRuleList,
        yDimensionRuleList: list.yDimensionRuleList,
        moduleType,
        matrixName: values.matrixName,
        description: values.description,
        matrixCode: values.matrixCode,
      }

      const {
        data: {data, code},
      } = await api.save_risk_matrix_detail(postData)
      if (code == 0) {
        message.success('保存成功')
        id == 'new' && Router.back()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onTestRun = () => {
    let url = `/decision/edit/form?page=test&category=${category}&productId=${productId}&id=${id}`
    Router.push(url)
  }
  const appendToRuleIds = (ids) => {
    setRuleIds(ids)
  }
  const onEditFieldOut = () => {
    setVisible(true)
  }

  const setFieldCb = (val) => {
    form.setFieldsValue({
      fieldOut: val,
    })
  }
  const onEditRule = (item) => {
    setRuleEditVisible(true)
    setSelectItem(item)
  }
  const onOpenRuleRowModal = (row) => {
    setRuleEditVisible(true)
    setSelectRule(row)
    setSelectIndex(1)
    setVariableTabs([...VARIABLETABS])
  }
  const onOpenRuleColModal = (col) => {
    setSelectRule(col)
    setRuleEditVisible(true)
    setSelectIndex(2)
    setVariableTabs([...VARIABLETABS])
  }
  const submitRuleRow = (rule) => {
    list.yDimensionRuleList.splice(rule.i, 1, rule)
    setList({...list})
  }
  const submitRuleCol = (rule) => {
    list.xDimensionRuleList.splice(rule.i, 1, rule)
    setList({...list})
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
        if (selectIndex == 1) {
          submitRuleRow({...selectRule, fieldList, scriptSource})
        }
        if (selectIndex == 2) {
          submitRuleCol({
            ...selectRule,
            fieldList,
            scriptSource,
          })
        }
        setRuleEditVisible(false)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  return (
    <>
      {!partialPro && (
        <div className="searchForm" style={{marginBottom: '10px'}}>
          <Row>
            <Col span={24}>
              {!partialPro && (
                <Button
                  type="primary"
                  style={{marginRight: 15}}
                  onClick={onTestRun}
                  disabled={id == 'new'}
                >
                  测试运行
                </Button>
              )}
              {!partialPro && (
                <Button
                  type="primary"
                  onClick={onSave}
                  style={{background: '#fa8c16', borderColor: '#fa8c16'}}
                >
                  保存
                </Button>
              )}
            </Col>
          </Row>
          <Divider />
          {!partialPro && (
            <Form
              form={form}
              name="form"
              layout="inline"
              initialValues={{execType: '2'}}
            >
              <Row style={{width: '100%'}}>
                <Form.Item
                  label="编号"
                  name="matrixCode"
                  rules={[{required: true, message: '请输入编号'}]}
                >
                  <Input placeholder="请输入" disabled={id != 'new'} />
                </Form.Item>
                <Form.Item
                  label="中文名称"
                  name="matrixName"
                  rules={[{required: true, message: '请输入名称'}]}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item
                  label="说明"
                  name="description"
                  rules={[{required: true, message: '请输入说明'}]}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    label="结果赋值给"
                    name="fieldOut"
                    rules={[{required: true, message: '请选择输出变量'}]}
                  >
                    <Input
                      addonAfter={
                        <SettingOutlined
                          style={{cursor: 'pointer'}}
                          onClick={onEditFieldOut}
                        />
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </div>
      )}

      <RuleMatrixTableList
        {...{
          list,
          appendToRuleIds,
          onEditRule,
          setList,
          onOpenRuleRowModal,
          onOpenRuleColModal,
          partialPro,
        }}
      />
      <GenerateOutputVariableModal
        groups={groups}
        visible={visible}
        onHide={() => setVisible(false)}
        activeKey={productId}
        activeCategoryKey={category}
        setFieldCb={setFieldCb}
        moduleType={moduleType}
      />
      <RuleEditModal
        {...{
          variableTabs,
          activeKey: productId,
          visible: ruleEditVisible,
          selectItem: selectRule,
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
