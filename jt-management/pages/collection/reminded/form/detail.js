import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
import {Card, Table, Button, Tooltip} from 'antd'
import Router, {withRouter} from 'next/router'

import api from '~/api/collection'
const breadcrumbs = [
  {text: '催收管理'},
  {text: '待催列表 '},
  {text: '催收短信记录'},
]
const pageParams = {
  page: 1,
  pageSize: 10,
}
function body(props) {
  const [list, setList] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  useEffect(() => {
    creditDetail()
  }, [])

  const creditDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getSmsList({
        collectionOrderId: props.collectionOrderId,
        ...pageParams,
      })
      if (code == 0) {
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns = [
    {
      title: '催收期数',
      dataIndex: 'loanApplyTerms',
      key: 'loanApplyTerms',
      width: 150,
    },
    {
      title: '催收方式',
      dataIndex: 'collectionType',
      key: 'collectionType',
      width: 150,
      render: (record, row) => {
        if (record == 1) {
          return <span>短信</span>
        }
      },
    },
    {
      title: '发送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      width: 150,
      render: (record, row) => {
        if (record == 1) {
          return <span>人工发送</span>
        }
      },
    },
    {
      title: '催收对象',
      dataIndex: 'collectionLink',
      key: 'collectionLink',
      width: 150,
    },
    {
      title: '短信文案',
      dataIndex: 'collectionContent',
      key: 'collectionContent',
      width: 150,
      render: (record, row) => {
        if (String(record).length >= 20) {
          return (
            <Tooltip placement="top" title={record}>
              {record.substring(0, 9) + '...'}
            </Tooltip>
          )
        } else {
          return <span>{record}</span>
        }
      },
    },
    {
      title: '发送日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
  ]

  const onPage = async () => {
    creditDetail()
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }

  const pagination = {
    defaultCurrent: 1,
    total: list.length,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.page,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.page = pageNumber
      onPage()
    },
  }

  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      <Card>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={pagination}
          bordered
          scroll={{y: '100%', x: '100%'}}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}
export default withRouter(body)
