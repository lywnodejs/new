import React, {useEffect, useState} from 'react'
import {InfoCircleFilled, SettingOutlined} from '@ant-design/icons'
import {Button, message, Form, Divider, Input, Radio, Row, Col} from 'antd'
import Router, {withRouter} from 'next/router'
import RuleCardTableList from './RuleCardTableList'
import GenerateOutputVariableModal from '../GenerateOutputVariableModal'
import DeleteBabatchedModal from '../DeleteBatchedModal'
import RuleEditModal from '../RuleEditModal'
import api from '~/api/risk'
import {VARIABLETABS} from '~/utils/const'
import {isEmpty, isNumber} from '~/utils'

function body({router, id, productId, category, moduleType, partialPro}) {
  const [ruleIds, setRuleIds] = useState([])
  const [list, setList] = useState({})
  const [groups, setGroups] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [selectRule, setSelectRule] = useState({})
  const [selectIndex, setSelectIndex] = useState({})
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
  const [variableTabs, setVariableTabs] = useState([])
  const [deleteVisible, setDeleteVisible] = useState(false)

  useEffect(() => {
    function fetchData() {
      id != 'new' && fetchList()
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
      ? api.fetch_risk_scorecard_pro_detail(postData)
      : api.fetch_risk_scorecard_detail(postData)
    try {
      const {
        data: {data, code},
      } = await postApi
      if (code == 0) {
        setList(data)
        form.setFieldsValue({
          fieldOut: data.fieldOut,
          baseScore: data.baseScore,
          execType: String(data.execType),
          scoreCardCode: data.scoreCardCode,
          scoreCardName: data.scoreCardName,
          description: data.description,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    const newData = {
      scoreCardDetailId: id == 'new' ? null : id,
      id: null,
      scoreRuleGroupCode: '',
      scriptSource: '',
      fieldList: [],
      scoreRuleList: [
        {
          id: null,
          scoreRuleGroupId: null,
          score: 0,
          scriptSource: '其他',
          others: 1,
          fieldList: [],
        },
      ],
    }
    list.scoreRuleGroupList.push(newData)
    setList({...list})
  }
  const onDelete = () => {
    if (!ruleIds.length) {
      return message.error('请选择评分')
    }
    setDeleteVisible(true)
  }
  const validRuleDetail = (score) => {
    const ruleList = score.scoreRuleList
    if (Array.isArray(ruleList) && ruleList.length > 0) {
      let find = false
      ruleList.forEach((rule, index) => {
        if (isEmpty(rule.scriptSource) || isEmpty(rule.score)) {
          message.error('请检查有未填项')
          find = true
          return false
        }
        if (!isNumber(rule.score)) {
          message.error('评分需输入数值')
          find = true
          return false
        }
      })
      if (!find) {
        return true
      }
    }
  }
  const validPostData = (scores) => {
    if (Array.isArray(scores) && scores.length > 0) {
      let find = false
      scores.forEach((score, index) => {
        if (isEmpty(score.scoreRuleGroupCode) || isEmpty(score.scriptSource)) {
          message.error('请检查有未填项')
          find = true
          return false
        }

        if (!validRuleDetail(score)) {
          find = true
        }
      })
      if (!find) {
        return true
      }
    } else {
      message.error('请检查有未填项')
    }
  }
  const onSave = async () => {
    try {
      const values = await form.validateFields()
      if (
        (values.baseScore || values.baseScore == 0) &&
        !isNumber(values.baseScore)
      ) {
        return message.error('基本分需输入数值')
      }
      if (!validPostData(list.scoreRuleGroupList)) {
        return false
      }

      let postData = {
        scoreCardId: id == 'new' ? null : id,
        scoreCardDetailId: list.scoreCardDetailId,
        fieldOut: values.fieldOut,
        execType: values.execType,
        baseScore: values.baseScore,
        productId,
        scoreRuleGroupList: list.scoreRuleGroupList,
        moduleType,
        scoreCardName: values.scoreCardName,
        description: values.description,
        scoreCardCode: values.scoreCardCode,
      }

      const {
        data: {data, code},
      } = await api.save_risk_scorecard_detail(postData)
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

  const onOpenRuleEditModal = (rule) => {
    setRuleEditVisible(true)
    setSelectRule(rule)
    setSelectIndex(1)
    setVariableTabs([...VARIABLETABS])
  }
  const onOpenRuleEditModalForCondition = (rule) => {
    setSelectRule(rule)
    setRuleEditVisible(true)
    setSelectIndex(2)
    setVariableTabs(
      VARIABLETABS.slice(VARIABLETABS.length - 2, VARIABLETABS.length - 1),
    )
  }
  const submitRuleEdit = (rule) => {
    setRuleEditVisible(false)
    list.scoreRuleGroupList.splice(selectRule.i, 1, rule)
    setList({...list})
  }
  const submitConditionEdit = (rule) => {
    setRuleEditVisible(false)
    list.scoreRuleGroupList[selectRule.i].scoreRuleList.splice(
      selectRule.j,
      1,
      rule,
    )
    setList({...list})
  }
  const deleteAllOnClient = () => {
    ruleIds.forEach((item) => {
      let findItem = list.scoreRuleGroupList.find((li) => li.index == item)
      if (findItem) {
        list.scoreRuleGroupList.splice(findItem.index--, 1)
      }
    })
    setRuleIds([])
    setList({...list})
    setDeleteVisible(false)
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
          submitRuleEdit({...selectRule, fieldList, scriptSource})
        }
        if (selectIndex == 2) {
          submitConditionEdit({
            ...selectRule,
            fieldList,
            scriptSource,
          })
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <>
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
              <Button type="primary" style={{marginRight: 15}} onClick={onAdd}>
                新增
              </Button>
            )}

            {!partialPro && (
              <Button
                type="primary"
                style={{marginRight: 15}}
                onClick={onDelete}
              >
                删除
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
        {!partialPro && <Divider />}

        {!partialPro && (
          <Form
            form={form}
            name="form"
            layout="inline"
            initialValues={{execType: '2'}}
          >
            <Form.Item
              label="编号"
              name="scoreCardCode"
              rules={[{required: true, message: '请输入编号'}]}
            >
              <Input placeholder="请输入" disabled={id != 'new'} />
            </Form.Item>
            <Form.Item
              label="中文名称"
              name="scoreCardName"
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
            <Row>
              <Form.Item label="基本分" name="baseScore">
                <Input placeholder="只可输入数字" />
              </Form.Item>
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
              <Form.Item label="运行模式" name="execType">
                <Radio.Group>
                  <Radio value="1">累加</Radio>
                  <Radio value="2">取最大值</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          </Form>
        )}
      </div>
      {!partialPro && (
        <div
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '10px 0 10px 10px',
            marginBottom: '15px',
          }}
        >
          <InfoCircleFilled style={{color: '#1890ff'}} />
          <span style={{paddingLeft: '5px'}}>已选择 {ruleIds.length} 项。</span>
        </div>
      )}

      <RuleCardTableList
        {...{
          list,
          appendToRuleIds,
          setList,
          onOpenRuleEditModal,
          onOpenRuleEditModalForCondition,
          ruleIds,
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
          selectIndex,
          activeKey: productId,
          visible: ruleEditVisible,
          selectItem: selectRule,
          onHide: () => setRuleEditVisible(false),
          onFinalValidateAndSubmit,
        }}
      />
      <DeleteBabatchedModal
        {...{
          activeKey: productId,
          activeCategoryKey: category,
          activeModuleKey: moduleType,
          variableIds: ruleIds,
          visible: deleteVisible,
          onHide: () => setDeleteVisible(false),
          deleteAllOnClient,
        }}
      />
    </>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
