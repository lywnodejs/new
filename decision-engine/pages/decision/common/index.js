import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import Router, {withRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {message, Tabs, Row, Col, Space, Form, Select, Input, Button} from 'antd'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import {VARIABLETABS} from '~/utils/const'
import api from '~/api/risk'
import CopyVariableModal from './variable/CopyModal'
import DeleteBabatchedModal from './DeleteBatchedModal'
// import SearchForm from './SearchForm'
import VariableModal from './variable/AddModal'
import TableList from './variable/TableList'
import DeriveTableList from './variable/DeriveTableList'
import RuleEditModal from './RuleEditModal'
import StrategyTableList from './strategy/TableList'
import RuleDeriveTableList from './strategy/RuleDeriveTableList'
import StrategyForm from './strategy/AddModal'
import CopyStrategyModal from './strategy/CopyModal'
import PublishSubmitModal from './strategy/PublishModal'

import {findApiByKey, categoryTabs} from './mapActionToApi'

const {TabPane} = Tabs

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function body(props) {
  // console.log('props.router.query.category', props)
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('10001')
  const [activeModuleKey, setActiveModuleKey] = useState('all')
  const [activeCategoryKey, setActiveCategoryKey] = useState('-1')
  const [productList, setProductList] = useState([])
  const [groups, setGroups] = useState([])
  const [list, setList] = useState([])
  const [moudleList, setMoudleList] = useState([])
  const [categories, setCategories] = useState(categoryTabs)
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [variableIds, setVariableIds] = useState([])
  const [copyVisible, setCopyVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
  const [strategyMixVisible, setStrategyMixVisible] = useState(false)
  const [copyStrategyMixVisible, setCopyStrategyMixVisible] = useState(false)
  const [publishVisible, setPublishVisible] = useState(false)
  const [variableTabs, setVariableTabs] = useState(VARIABLETABS.slice(0, 3))
  const [breadcrumbs, setBreadcrumbs] = useState([{text: '决策引擎（编辑）'}])
  const [types, setTypes] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    function fetchData() {
      fetchProductList()
      if (
        props.router.query.category != undefined &&
        props.router.query.category != ''
      ) {
        setActiveCategoryKey(props.router.query.category)
      } else {
        setActiveCategoryKey(String(categories[0].key))
      }

      if (props.partialPro) {
        setBreadcrumbs([{text: '决策引擎（生产）'}])
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1 && activeCategoryKey != -1 && activeModuleKey != -1) {
        onInitPage()
      }
    }
    fetchData()
  }, [activeKey, activeCategoryKey, activeModuleKey])

  const onInitPage = () => {
    values = {}
    pageParams.pageNo = 1
    setVariableIds([])
    fetchGroups()
    onPage()
    fetchType()
  }

  // *-----------------------------------------

  const fetchList = async (values = {}) => {
    let basePostData = {
      ...pageParams,
      ...values,
      moduleType: activeModuleKey,
      productId: activeKey,
      fieldType: activeCategoryKey,
      partialPro: props.partialPro,
    }
    // console.log('basePostData', basePostData, props.partialPro)
    let postApi = findApiByKey(+activeCategoryKey, basePostData, 'fetch')
    try {
      const {
        data: {data, code},
      } = await postApi()
      if (code == 0) {
        // console.log('fetchList', data)
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // *-----------------------------------------

  const fetchGroups = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_groups({
        productId: activeKey,
        fieldGroupType: activeCategoryKey,
      })
      if (code == 0) {
        setGroups(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchType = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_vartypelist()
      if (code == 0) {
        setTypes(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products()
      if (code == 0) {
        // console.log('fetchProductList',data);
        setProductList(data)
        if (data && data.length) {
          if (
            props.router.query.productId != undefined &&
            props.router.query.productId != ''
          ) {
            setActiveKey(props.router.query.productId)
          } else {
            setActiveKey(String(data[0].produceId))
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createMapStateToUrlFn = (tabType) => {
    return function mapStateToUrl(key) {
      const {router} = props
      const href = {
        pathname: `/decision/${props.partialPro ? 'produce' : 'edit'}`,
        query: {
          productId: tabType === 'productId' ? key : router.query.productId,
          category: tabType === 'category' ? key : router.query.category,
        },
      }
      const as = href
      Router.push(href, as, {shallow: true})
    }
  }
  const changeTab = async (key) => {
    createMapStateToUrlFn('productId')(key)
    setActiveKey(key)
  }

  const changeCategoryTab = async (key) => {
    createMapStateToUrlFn('category')(key)
    setActiveCategoryKey(key)
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  const showAddModal = (cb) => {
    setIndex(-1)
    cb()
    setSelectItem({})
  }
  const onGoDetail = (record = {}) => {
    let url = `/decision/edit/detail?category=${activeCategoryKey}&productId=${activeKey}&id=${
      record.id == undefined ? 'new' : record.id
    }&moduleType=${activeModuleKey}`
    Router.push(url)
  }
  const onEditDeriveDetail = (record) => {
    if (!record.editable) {
      return message.error('审核中，请勿编辑')
    }
    onGoDetail(record)
  }
  const onAdd = () => {
    if (activeCategoryKey == 7) {
      onGoDetail()
      return
    }
    if ([4, 5, 6, 8].includes(+activeCategoryKey)) {
      let url = `/decision/edit/detail?category=${activeCategoryKey}&productId=${activeKey}&id=new&moduleType=${activeModuleKey}`
      Router.push(url)
      // showAddModal(() => {
      //   setStrategyMixVisible(true)
      // })
      return
    }
    showAddModal(() => {
      setVisible(true)
    })
  }

  const appendToVariableIds = (ids) => {
    console.log(ids)
    setVariableIds(ids)
  }

  const onDelete = () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }
    setDeleteVisible(true)
  }

  const onCopy = () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }

    if ([4, 5, 6, 7, 8].includes(+activeCategoryKey)) {
      setCopyStrategyMixVisible(true)
      return
    }

    setCopyVisible(true)
  }

  const onEdit = (item) => {
    setIndex(item.id)
    setVisible(true)
    setSelectItem(item)
  }

  const onEditDerive = (item) => {
    setRuleEditVisible(true)
    setSelectItem(item)
  }

  const onPublish = () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }
    setPublishVisible(true)
  }

  const onEditStrategyMix = (item) => {
    if (!item.editable) {
      return message.error('审核中，请勿编辑')
    }

    setIndex(item.id)
    setStrategyMixVisible(true)
    setSelectItem(item)
  }

  const onFinalValidateAndSubmit = async (params) => {
    const {scriptSource, fieldList} = params
    try {
      const {
        data: {data, code},
      } = await api.validate_risk_script({
        scriptSource,
        callSource: 1,
        fieldList,
        productId: activeKey,
      })
      if (code == 0) {
        const {
          data: {data: saveData, code: saveCode},
        } = await api.save_risk_variable([
          {
            ...selectItem,
            scriptSource,
            fieldList,
            productId: activeKey,
          },
        ])
        if (saveCode == 0) {
          setRuleEditVisible(false)
          message.success('保存成功')
          onPage()
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeFieldGroupIds = (val) => {
    form.setFieldsValue('fieldGroupIds', val)
  }
  const changeTypes = (val) => {
    form.setFieldsValue('fieldColumnType', val)
  }

  const onReset = () => {
    form.resetFields()
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm riskRule" style={{marginBottom: '10px'}}>
        <Row>
          <Col span={2} style={{lineHeight: '51px'}}>
            产品名称：
          </Col>
          <Col span={22}>
            <Tabs
              activeKey={activeKey}
              onTabClick={(key) => changeTab(key, false)}
            >
              {productList && productList.length
                ? productList.map((item) => (
                    <TabPane
                      tab={item.productName}
                      key={item.produceId}
                      forceRender={true}
                    ></TabPane>
                  ))
                : null}
            </Tabs>
          </Col>
        </Row>

        <Row>
          <Col span={2} style={{lineHeight: '51px'}}>
            所属类目：
          </Col>
          <Col span={22}>
            <Tabs
              activeKey={activeCategoryKey}
              onTabClick={(key) => changeCategoryTab(key, false)}
            >
              {categories && categories.length
                ? categories.map((item) => (
                    <TabPane
                      tab={item.name}
                      key={item.key}
                      forceRender={true}
                    ></TabPane>
                  ))
                : null}
            </Tabs>
          </Col>
        </Row>
      </div>
      <Form
        form={form}
        onFinish={onSearch}
        layout="inline"
        className="searchForm"
        initialValues={{
          fieldGroupIds: null,
          fieldColumnType: null,
        }}
      >
        <Form.Item label="关键字" name="keyword">
          <Input placeholder="请输入" />
        </Form.Item>
        {+activeCategoryKey == 1 || +activeCategoryKey == 2 ? (
          <div>
            <Form.Item
              label="分组"
              name="fieldGroupIds"
              style={{display: 'inline-block'}}
            >
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeFieldGroupIds(val)}
              >
                <Select.Option value={null}>全部</Select.Option>
                {groups.map((v, i) => (
                  <Select.Option key={i.id} value={v.id}>
                    {v.fieldGroupName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="类型"
              name="fieldColumnType"
              style={{display: 'inline-block'}}
            >
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeTypes(val)}
              >
                <Select.Option value={null}>全部</Select.Option>
                {types.map((v, i) => (
                  <Select.Option key={i.code} value={v.code}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        ) : null}
        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          查询
        </Button>

        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>

        {activeCategoryKey != 0 && !props.partialPro && (
          <Button type="primary" style={{marginRight: 15}} onClick={onAdd}>
            新增
          </Button>
        )}
        {activeCategoryKey != 0 && !props.partialPro && (
          <Button type="primary" style={{marginRight: 15}} onClick={onDelete}>
            删除
          </Button>
        )}
        {activeCategoryKey != 0 && activeCategoryKey != 8 && !props.partialPro && (
          <Button type="primary" onClick={onCopy} style={{marginRight: 15}}>
            {[4, 5, 6, 7].includes(+activeCategoryKey) ? '复制' : '移动到'}
          </Button>
        )}
        {[4, 5, 6, 7, 8].includes(+activeCategoryKey) && !props.partialPro && (
          <Button type="primary" onClick={onPublish}>
            发布提交
          </Button>
        )}
      </Form>
      {activeCategoryKey != 0 && !props.partialPro && (
        <div
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '10px 0 10px 10px',
            marginBottom: '10px',
          }}
        >
          <InfoCircleFilled style={{color: '#1890ff'}} />
          <span style={{paddingLeft: '5px'}}>
            已选择 {variableIds.length} 项。
          </span>
        </div>
      )}
      {[0, 1, 2].includes(+activeCategoryKey) && (
        <TableList
          {...{
            list,
            onPage,
            pageParams,
            appendToVariableIds,
            activeCategoryKey,
            activeKey,
            onEdit,
            activeModuleKey,
            partialPro: props.partialPro,
          }}
        />
      )}
      {activeCategoryKey == 3 && (
        <DeriveTableList
          {...{
            list,
            onPage,
            pageParams,
            appendToVariableIds,
            activeCategoryKey,
            activeKey,
            onEditDerive,
            activeModuleKey,
            partialPro: props.partialPro,
          }}
        />
      )}
      {activeCategoryKey == 7 && (
        <RuleDeriveTableList
          {...{
            list,
            onPage,
            pageParams,
            appendToVariableIds,
            activeCategoryKey,
            activeModuleKey,
            onEditDeriveDetail,
            activeKey,
            partialPro: props.partialPro,
          }}
        />
      )}
      {[4, 5, 6, 8].includes(+activeCategoryKey) && (
        <StrategyTableList
          {...{
            list,
            onPage,
            pageParams,
            appendToVariableIds,
            activeCategoryKey,
            activeModuleKey,
            onEditStrategyMix,
            activeKey,
            partialPro: props.partialPro,
          }}
        />
      )}
      <VariableModal
        {...{
          activeKey,
          activeCategoryKey,
          selectIndex,
          visible,
          groups,
          onHide: () => setVisible(false),
          selectItem,
          pullData: onPage,
          fetchGroups,
        }}
      />
      <CopyVariableModal
        {...{
          activeKey,
          activeCategoryKey,
          activeModuleKey,
          groups,
          variableIds,
          visible: copyVisible,
          onHide: () => setCopyVisible(false),
          pullData: onPage,
          fetchGroups,
        }}
      />
      <CopyStrategyModal
        {...{
          activeKey,
          activeCategoryKey,
          activeModuleKey,
          productList,
          variableIds,
          visible: copyStrategyMixVisible,
          onHide: () => setCopyStrategyMixVisible(false),
          pullData: onPage,
        }}
      />
      <PublishSubmitModal
        {...{
          activeKey,
          activeCategoryKey,
          activeModuleKey,
          list,
          variableIds,
          visible: publishVisible,
          onHide: () => setPublishVisible(false),
          pullData: onPage,
        }}
      />
      <DeleteBabatchedModal
        {...{
          activeKey,
          activeCategoryKey,
          activeModuleKey,
          variableIds,
          visible: deleteVisible,
          onHide: () => setDeleteVisible(false),
          setVariableIds,
          pullData: onPage,
        }}
      />
      <RuleEditModal
        {...{
          activeKey,
          visible: ruleEditVisible,
          selectItem,
          onHide: () => setRuleEditVisible(false),
          variableTabs,
          onFinalValidateAndSubmit,
        }}
      />
      <StrategyForm
        {...{
          activeKey,
          activeCategoryKey,
          activeModuleKey,
          selectIndex,
          visible: strategyMixVisible,
          onHide: () => setStrategyMixVisible(false),
          selectItem,
          pullData: onPage,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
