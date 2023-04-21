import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import {message, Form, Button, Tabs, Row, Col} from 'antd'
import Router, {withRouter} from 'next/router'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import {VARIABLETABS} from '~/utils/const'
import api from '~/api/risk'
import TableList from './TableList'

const breadcrumbs = [{text: '规则审批'}, {text: '对照'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [activeModuleKey, setActiveModuleKey] = useState('-1')
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

  useEffect(() => {
    async function fetchData() {
      pageParams.pageNo = 1
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    let postData = {
      ...pageParams,
      moduleType: activeModuleKey,
      id: props.router.query.id,
    }
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_diffdetail(postData)
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onPage = async () => {
    fetchList()
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <TableList
        {...{
          list,
          onPage,
          pageParams,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
