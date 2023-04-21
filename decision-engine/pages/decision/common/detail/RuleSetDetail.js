import React, {useEffect, useState} from 'react'
import {InfoCircleFilled, SettingOutlined} from '@ant-design/icons'
import {message, Form, Divider, Input, Row} from 'antd'
import Router, {withRouter} from 'next/router'
import SearchForm from './SearchForm'
import RuleSetTableList from './RuleSetTableList'
import GenerateOutputVariableModal from '../GenerateOutputVariableModal'
import RuleEditModal from '../RuleEditModal'
import DeleteBabatchedModal from '../DeleteBatchedModal'
import api from '~/api/risk'
import {VARIABLETABS} from '~/utils/const'
import {isEmpty} from '~/utils'

function body({router, id, productId, category, moduleType, partialPro}) {
  const [ruleIds, setRuleIds] = useState([])
  const [list, setList] = useState({simpleRuleList: []})
  const [groups, setGroups] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [equalWhich, setEqualWhich] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
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

  const fetchList = async (values = {}) => {
    let postData = {
      ...values,
      id: id == 'new' ? null : id,
      productId,
      moduleType,
    }

    let postApi = partialPro
      ? api.fetch_risk_ruleset_pro_detail(postData)
      : api.fetch_risk_ruleset_detail(postData)
    try {
      const {
        data: {data, code},
      } = await postApi
      if (code == 0) {
        form.setFieldsValue({
          fieldOut: data.fieldOut,
          fieldHitRules: data.fieldHitRules,
          ruleSetName: data.ruleSetName,
          ruleSetCode: data.ruleSetCode,
          description: data.description,
        })
        setList({...data})
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = (values) => {
    fetchList({...values})
  }
  const onAdd = () => {
    const newData = {
      ruleSetDetailId: id == 'new' ? null : id,
      simpleRuleCode: '',
      simpleRuleName: '',
      scriptSource: '',
      expectedValue: '0',
      useStatus: '0',
      rejectCode: '',
      // rejectDays: '',
      fieldList: [],
    }

    list.simpleRuleList.push(newData)
    setList({...list})
  }
  const onDelete = () => {
    if (!ruleIds.length) {
      return message.error('请选择规则')
    }
    setDeleteVisible(true)
  }
  const validPostData = (rules) => {
    if (Array.isArray(rules) && rules.length > 0) {
      let find = false
      for (let i = 0; i < rules.length; i++) {
        if (
          isEmpty(rules[i].simpleRuleCode) ||
          isEmpty(rules[i].simpleRuleName) ||
          isEmpty(rules[i].scriptSource)
        ) {
          message.error('请检查有未填项')
          find = true
          return false
        }
      }

      if (!find) {
        return true
      }
    }
  }
  const filterNewId = () => {
    let listSimpleRuleList = JSON.parse(JSON.stringify(list.simpleRuleList))
    listSimpleRuleList.forEach((item) => {
      if (item.id && String(item.id).includes('new')) {
        delete item.id
        item.useStatus = Number(item.useStatus)
        item.key = Number(item.key)
      }
    })
    return listSimpleRuleList
  }
  const onSave = async () => {
    try {
      const values = await form.validateFields()
      if (!validPostData(list.simpleRuleList)) {
        return message.error('请检查有未填项')
      }

      let postData = {
        ruleSetId: id == 'new' ? null : id,
        ruleSetDetailId: list.ruleSetDetailId,
        fieldOut: values.fieldOut,
        fieldHitRules: values.fieldHitRules,
        productId,
        simpleRuleList: filterNewId(),
        moduleType,
        ruleSetName: values.ruleSetName,
        description: values.description,
        ruleSetCode: values.ruleSetCode,
      }

      const {
        data: {data, code},
      } = await api.save_risk_ruleset_detail(postData)
      if (code == 0) {
        message.success('保存成功')
        id == 'new' && Router.back()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const setListReplaceItem = (rule, index) => {
    list.simpleRuleList.splice(index, 1, {
      ...rule,
    })
    setList({...list})
  }
  const onEditStatus = async (rule, index) => {
    rule.useStatus = rule.useStatus == 1 ? 1 : 0
    setListReplaceItem(rule, index)

    if (rule.id != undefined) {
      try {
        let postData = {
          operatorType: 4,
          referenceType: 1,
          referenceId: id == 'new' ? null : id,
          referenceCode: list.ruleSetCode,
          ruleId: rule.id && String(rule.id).includes('new') ? null : rule.id,
          ruleCode: rule.simpleRuleCode,
          afterUseStatus: rule.useStatus,
          afterScriptSource: rule.scriptSource,
          productId,
        }

        const {
          data: {data, code},
        } = await api.set_risk_ruleset_detail_status([postData])
      } catch (err) {
        console.log(err)
      }
    }
  }

  const appendToRuleIds = (ids) => {
    setRuleIds(ids)
  }
  const onEditFieldOut = () => {
    setVisible(true)
    setEqualWhich(1)
  }
  const onEditFieldHitRules = () => {
    setVisible(true)
    setEqualWhich(2)
  }
  const setFieldCb = (val) => {
    if (equalWhich == 1) {
      form.setFieldsValue({
        fieldOut: val,
      })
    }
    if (equalWhich == 2) {
      form.setFieldsValue({
        fieldHitRules: val,
      })
    }
  }
  const onEditRule = (item) => {
    setRuleEditVisible(true)
    setSelectItem(item)
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
        referenceType: 1,
        referenceId: id == 'new' ? null : id,
        referenceCode: list.ruleSetCode,
        ruleId:
          selectItem.id && String(selectItem.id).includes('new')
            ? null
            : selectItem.id,
        ruleCode: selectItem.simpleRuleCode,
        afterUseStatus: selectItem.useStatus,
      })
      if (code == 0) {
        setRuleEditVisible(false)
        list.simpleRuleList.splice(selectItem.i, 1, {
          ...selectItem,
          fieldList,
          scriptSource,
        })
        setList({...list})
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const deleteAllOnClient = async () => {
    let deleteList = []
    let simpleRuleList = JSON.parse(JSON.stringify(list.simpleRuleList))
    ruleIds.forEach((item) => {
      let findItem = simpleRuleList.find((li) => li.index == item)
      if (findItem) {
        deleteList.push({
          operatorType: 3,
          referenceType: 1,
          referenceId: id == 'new' ? null : id,
          referenceCode: list.ruleSetCode,
          ruleId:
            findItem.id && String(findItem.id).includes('new')
              ? null
              : findItem.id,
          ruleCode: findItem.simpleRuleCode,
          afterUseStatus: findItem.useStatus,
          afterScriptSource: findItem.scriptSource,
          productId,
        })
        simpleRuleList = simpleRuleList.filter(
          (item) => item.index != findItem.index,
        )
      }
    })

    try {
      const {
        data: {data, code},
      } = await api.set_risk_ruleset_detail_status(deleteList)
      if (code == 0) {
        setRuleIds([])
        setList({...list, simpleRuleList})
        setDeleteVisible(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="searchForm" style={{marginBottom: '10px'}}>
        <SearchForm
          {...{
            onSearch,
            onAdd,
            onDelete,
            onSave,
            activeCategoryKey: category,
            id,
            productId,
            partialPro,
          }}
        />
        {!partialPro && <Divider />}
        {!partialPro && (
          <Form form={form} name="form" layout="inline" initialValues={{}}>
            <Form.Item
              label="编号"
              name="ruleSetCode"
              rules={[{required: true, message: '请输入编号'}]}
            >
              <Input placeholder="请输入" disabled={id != 'new'} />
            </Form.Item>
            <Form.Item
              label="中文名称"
              name="ruleSetName"
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
              <Form.Item label="规则命中数组详情赋值给" name="fieldHitRules">
                <Input
                  addonAfter={
                    <SettingOutlined
                      style={{cursor: 'pointer'}}
                      onClick={onEditFieldHitRules}
                    />
                  }
                  disabled
                />
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

      <RuleSetTableList
        {...{
          list,
          appendToRuleIds,
          onEditRule,
          setList,
          onEditStatus,
          ruleIds,
          partialPro,
        }}
      />
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
