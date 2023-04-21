import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Card, Table} from 'antd'
import apiReview from '~/api/review'
import Router, {withRouter} from 'next/router'
const breadcrumbs = [
  {text: '信审管理'},
  {text: '审核列表'},
  {text: '授信详情页'},
  {text: '通讯录'},
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
      } = await apiReview.fetch_risk_getContactList({
        userId: props.router.query.userId,
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
      title: '姓名',
      dataIndex: 'bookName',
      key: 'bookName',
      width: 180,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
      width: 180,
    },
  ]

  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Card>
        <Table
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.phoneNo + Math.random()}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}
export default withRouter(body)
