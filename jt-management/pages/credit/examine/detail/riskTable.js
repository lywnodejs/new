import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Card, Table} from 'antd'
import apiReview from '~/api/review'
import Router, {withRouter} from 'next/router'

const breadcrumbs = [
  {text: '信审管理'},
  {text: '审核列表'},
  {text: '授信详情页'},
  {text: '风控决策详情'},
]
function body(props) {
  const [list, setList] = useState([])

  useEffect(() => {
    creditDetail()
  }, [])

  const creditDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_risk_peopleDetail({
        orderId: props.router.query.orderId,
        name: props.router.query.name,
        idCard: props.router.query.idCard,
        mobile: props.router.query.mobile,
        userType: props.router.query.userType,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns = [
    {
      title: '执行案件做出执行依据的机构',
      dataIndex: 'basiccourt',
      key: 'basiccourt',
      width: 180,
    },
    {
      title: '失信被执行人行为具体情形',
      dataIndex: 'concretesituation',
      key: 'concretesituation',
      width: 180,
    },
    {
      title: '失信案件执行法院',
      dataIndex: 'court',
      key: 'court',
      width: 180,
    },
    {
      title: '失信案件发生时间',
      dataIndex: 'datatime',
      key: 'datatime',
      width: 180,
    },
    {
      title: '失信案件执行类型',
      dataIndex: 'datatype',
      key: 'datatype',
      width: 180,
    },
    {
      title: '执行案件执行法院',
      dataIndex: 'execCourt',
      key: 'execCourt',
      width: 180,
    },
    {
      title: '执行案件立案时间',
      dataIndex: 'execDatatime',
      key: 'execDatatime',
      width: 180,
    },
    {
      title: '执行案件类型',
      dataIndex: 'execDatatype',
      key: 'execDatatype',
      width: 180,
    },
    {
      title: '执行案件标的',
      dataIndex: 'execMoney',
      key: 'execMoney',
      width: 180,
    },
    {
      title: '失信案件执行标的',
      dataIndex: 'money',
      key: 'money',
      width: 180,
    },
    {
      title: '失信案件生效法律文书确定的义务',
      dataIndex: 'obligation',
      key: 'obligation',
      width: 180,
    },
    {
      title: '失信案件被执行人的履行情况',
      dataIndex: 'performance',
      key: 'performance',
      width: 180,
    },
    {
      title: '执行案件状态',
      dataIndex: 'statute',
      key: 'statute',
      width: 180,
    },
  ]

  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Card>
        <Table
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.execMoney + Math.random()}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}
export default withRouter(body)
