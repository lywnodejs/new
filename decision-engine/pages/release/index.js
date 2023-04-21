import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import {message, Form, Button, Tabs, Row, Col, Select, Input} from 'antd'
import Router, {withRouter} from 'next/router'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import {VARIABLETABS} from '~/utils/const'
import api from '~/api/risk'
import TableList from './TableList'
import VertifyForm from './vertifyForm'
import RecordForm from './RecordForm'

const {TabPane} = Tabs
const breadcrumbs = [{text: '规则审批'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
const orderBys = {
  s: 'DESC',
}
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [activeModuleKey, setActiveModuleKey] = useState('all')
  const [activeCategoryKey, setActiveCategoryKey] = useState('-1')
  const [productList, setProductList] = useState([])
  const [groups, setGroups] = useState([])
  const [list, setList] = useState([])
  const [moudleList, setMoudleList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [variableIds, setVariableIds] = useState([])
  const [actionTypes, setActionTypes] = useState([])
  const [verifyStatus, setVerifyStatus] = useState([])
  const [vertifyVisible, setVertifyVisible] = useState(false)
  const [recordVisible, setRecordVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    async function fetchData() {
      fetchProductList()
      fetchActionTypes()
      fetchVerifystatus()
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        values = {}
        pageParams.pageNo = 1
        setVariableIds([])
        onPage()
      }
    }
    fetchData()
  }, [activeKey, activeModuleKey])

  const fetchList = async (values = {}) => {
    values.actionType = values.actionType || null
    values.stage = values.stage || null
    let postData = {
      ...pageParams,
      ...values,
      sortType: orderBys.s,
      moduleType: activeModuleKey,
      productId: activeKey,
    }
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_ruleverify(postData)
      if (code == 0) {
        setList(data)
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
  const fetchActionTypes = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_actiontypes()
      if (code == 0) {
        setActionTypes(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchVerifystatus = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_verifystatus()
      if (code == 0) {
        setVerifyStatus(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchModule = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_modules_byUser({type: 2})
      if (code == 0) {
        setMoudleList(data)
        data && data.length && setActiveModuleKey(data[0].modulePath)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createMapStateToUrlFn = (tabType) => {
    return function mapStateToUrl(key) {
      const {router} = props
      const href = {
        pathname: `/release`,
        query: {
          productId: tabType === 'productId' ? key : router.query.productId,
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

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  const appendToOrderIds = (ids) => {
    setVariableIds(ids)
  }

  const onDelete = () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }
    setDeleteVisible(true)
  }

  const onEdit = (item) => {
    setIndex(item.id)
    setVisible(true)
    setSelectItem(item)
  }
  const onVertify = (record) => {
    setVertifyVisible(true)
    setSelectItem(record)
  }
  const onRecord = (record) => {
    setRecordVisible(true)
    setSelectItem(record)
  }
  const onExport = async () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }
    try {
      const {data, status} = await api.export_risk_vertifyrecord({
        ids: variableIds.join(','),
        moduleType: activeModuleKey,
        productId: activeKey,
      })
      if (status == 200) {
        var blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', '对照详情.xlsx')
        a.click()
        URL.revokeObjectURL(objectUrl)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const changeActionType = (val) => {
    form.setFieldsValue('actionType', val)
  }
  const changeStage = (val) => {
    form.setFieldsValue('stage', val)
  }
  const onReset = () => {
    form.resetFields()
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm" style={{marginBottom: '10px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
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
        <Form
          form={form}
          onFinish={(values) =>
            onSearch({
              ...values,
            })
          }
          layout="inline"
          initialValues={{
            actionType: '',
            stage: '',
          }}
        >
          <Form.Item label="类型" name="actionType">
            <Select
              style={{width: '160px'}}
              onChange={(val) => changeActionType(val)}
            >
              <Select.Option value="">全部</Select.Option>
              {actionTypes.map((v, i) => (
                <Select.Option key={i} value={v.code}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="编号" name="code">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="提交人" name="submitUser">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="状态" name="stage">
            <Select
              style={{width: '160px'}}
              onChange={(val) => changeStage(val)}
            >
              <Select.Option value="">全部</Select.Option>
              {verifyStatus.map((v, i) => (
                <Select.Option key={i} value={v.code}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>
          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>
          <Button type="primary" onClick={onExport}>
            导出
          </Button>
        </Form>
      </div>
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

      <TableList
        {...{
          list,
          onPage,
          pageParams,
          orderBys,
          appendToOrderIds,
          activeKey,
          activeModuleKey,
          verifyStatus,
          onEdit,
          onVertify,
          onRecord,
        }}
      />
      <VertifyForm
        {...{
          visible: vertifyVisible,
          onHide: () => setVertifyVisible(false),
          selectItem,
          pullData: onPage,
          activeKey,
          activeModuleKey,
        }}
      />
      <RecordForm
        {...{
          visible: recordVisible,
          onHide: () => setRecordVisible(false),
          selectItem,
          pullData: onPage,
          activeKey,
          activeModuleKey,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
