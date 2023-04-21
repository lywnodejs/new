import {Row, Col, Table, Tag, Space} from 'antd'
import {Layout} from '~/components/Layout'
import style from './style.less'
import {useEffect, useState, useContext} from 'react'
import {post, get} from '~/utils/fetch'
import nextId from 'react-id-generator'
import Router from 'next/router'

import Detail from '../business/list'
import CollectionDetail from '../collection/reminded'
import CreditDeal from '../credit/list'
const breadcrumbs = [{text: '工作台'}]

const dataSource = [
  {
    key: '1',
    name: '2020-11-20',
    age: '张三 - 自由贷 - 授信初审',
    address: '2020-11-21',
  },
  {
    key: '1',
    name: '2020-11-29',
    age: '李四 - 轻松贷 - 用信终审',
    address: '2020-11-20',
  },
]

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}

// const deal = (row) => {
//   let detailUrl = JSON.parse(row.detailUrl)
//   let url = `/credit/examine/detail?creditId=${detailUrl.creditId}&orderId=${detailUrl.orderId}&flag=${detailUrl.flag}`
//   Router.push(url)
// }
const TableList = ({onPage, list, deal, collectionDeal, creditDeal}) => {
  const pagination = {
    defaultCurrent: 1,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: false,
    current: pageParams.pageNo,
    showTotal: (total) => `共 ${list.total} 条记录`,
    onChange: (pageNo) => {
      pageParams.pageNo = pageNo
      onPage(pageNo)
    },
  }

  const columns = [
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      align: 'left',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      align: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: '截止日期',
      dataIndex: 'expireDate',
      key: 'expireDate',
      align: 'left',
      render: (value, values) => {
        return (
          <>
            <span>{value || '-'} </span>
            {values.expire && <Tag color="red">已超时</Tag>}
          </>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      render: (record, row) => {
        return (
          <Space>
            {row.type == '待分配' ? (
              <a onClick={() => deal(row)}>处理</a>
            ) : (
              <Space>
                {row.type == '待催收' || row.type == '催收' ? (
                  <a onClick={() => collectionDeal(row)}>处理</a>
                ) : (
                  <a onClick={() => creditDeal(row)}>处理</a>
                )}
              </Space>
            )}
          </Space>
        )
      },
    },
  ]
  return (
    <Table
      pagination={pagination}
      rowKey={() => nextId()}
      dataSource={list.list}
      columns={columns}
      scroll={{x: '100%', y: 'calc(100vh - 430px)'}}
    />
  )
}

function body({summary, list}) {
  const [data, setData] = useState(list)

  const onPage = async (page) => {
    const {
      data: {code, data},
    } = await get('/workbench/queryTaskList', pageParams)
    if (code === 0) {
      setData(data)
    }
  }
  const deal = (item) => {
    location.href = '/business/list'
  }
  const collectionDeal = (item) => {
    // let detailUrl = JSON.parse(item.detailUrl)
    // let url = `/accounting/iou/detail?orderNum=${item.detailUrl}`
    let url = `/collection/reminded/form?id=${item.detailUrl}`
    Router.push(url)
  }

  const creditDeal = (item) => {
    let detailUrl = JSON.parse(item.detailUrl)
    let url = `/credit/examine/detail?creditId=${detailUrl.creditId}&orderId=${detailUrl.orderId}&flag=${detailUrl.flag}`
    Router.push(url)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Row className={style.head}>
        <Col span={6}>
          <div>
            <h2>{summary.waitCount}</h2>
            <span>待办任务</span>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <h2>{summary.expireCount}</h2>
            <span>超时任务</span>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <h2>{summary.newCount}</h2>
            <span>今日新增</span>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <h2>{summary.finishCount}</h2>
            <span>今日完成</span>
          </div>
        </Col>
      </Row>
      <div className={style.content}>
        <h1>待办任务</h1>
        <TableList
          list={data}
          onPage={onPage}
          deal={deal}
          collectionDeal={collectionDeal}
          creditDeal={creditDeal}
        />
      </div>
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const [
      {
        data: {data: summary = {}},
      },
      {
        data: {code, data: list = {}},
      },
    ] = await Promise.all([
      get('/workbench/summary'),
      get('/workbench/queryTaskList', pageParams),
    ])

    return {summary, list}
  } catch (e) {
    console.log(e)
  }
  return {summary: {}, list: []}
}

export default body
