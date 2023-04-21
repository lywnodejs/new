import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Card,
  message,
  Form,
  Button,
  Input,
  Row,
  Col,
  Select,
  Switch,
  PageHeader,
  Steps,
  Tabs,
} from 'antd'
import {useCookies} from 'react-cookie'
import Router, {withRouter} from 'next/router'
import RepayDetail from '~/components/common/repayDetail'

import api from '~/api/collection'

const breadcrumbs = [
  {text: '催收管理'},
  {text: '待催列表'},
  {text: '还款详情页'},
]

function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [detail, setDetail] = useState({})

  useEffect(() => {
    async function fetchData() {
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_coll_checkdetail({orderId: router.query.id})
      if (code === 0) {
        setDetail(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card title="订单信息" style={{marginTop: '10px'}}>
        <RepayDetail detail={detail} />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
