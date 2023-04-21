import {Layout} from '~/components/Layout'
import {Table, Button, Tooltip, Row, Col} from 'antd'
import Router, {withRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import api from '~/api/collection'

const breadcrumbs = [
  {text: '催收管理'},
  {text: '催收历史记录'},
  {text: '催收历史'},
  {text: '历史详情'},
]

function body({router}) {
  const [list, setList] = useState([])
  const [pageParams, setPageParams] = useState({page: 1, pageSize: 10})
  const [companys, setCompanys] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.fetch_all_whitelist({
          page: 1,
          pageSize: 9999,
          useStatus: 1,
        })
        if (code == 0) {
          setCompanys(data.list)
        }
        fetchList(pageParams)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const fetchList = async (pageParams) => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_history_detail({
        collectionOrderId: router.query.id,
        page: pageParams.page,
        pageSize: pageParams.pageSize,
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
      title: '催收订单ID',
      dataIndex: 'collectionOrderId',
      key: 'collectionOrderId',
      width: 150,
    },
    {
      title: '催收级别',
      dataIndex: 'collectionLevel',
      key: 'collectionLevel',
      width: 150,
    },
    // {
    //   title: '逾期天数',
    //   dataIndex: 'overdueDays',
    //   key: 'overdueDays',
    //   width: 150,
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'collectionStatus',
    //   key: 'collectionStatus',
    //   width: 150,
    // },
    {
      title: '催收员账号',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 150,
    },
    {
      title: '催收员姓名',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '催收员所属部门',
      dataIndex: 'companyId',
      key: 'companyId',
      width: 150,
      render: (text, record, index) => {
        let findOne = companys.find((one) => one.id == text)
        return findOne ? findOne.companyName : ''
      },
    },
    {
      title: '入催日期',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 150,
    },
    {
      title: '最近一次催收日期',
      dataIndex: 'lastCollectionTime',
      key: 'lastCollectionTime',
      width: 250,
    },
    {
      title: '入催期应还日期',
      dataIndex: 'planRepayTime',
      key: 'planRepayTime',
      width: 250,
    },
    {
      title: '实际还款日期',
      dataIndex: 'realRepayTime',
      key: 'realRepayTime',
      width: 250,
    },
    {
      title: '催收次数',
      dataIndex: 'collectionTimes',
      key: 'collectionTimes',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 150,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    console.log(pagination, filters, sorter, extra)
    pageParams.page = pagination.current
    pageParams.pageSize = pagination.pageSize
    setPageParams({...pageParams})
    fetchList(pageParams)
  }

  const paginationConfig = {
    total: list.total,
    current: pageParams.page,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={columns}
        bordered
        pagination={paginationConfig}
        scroll={{y: '100%', x: '100%'}}
        onChange={onChange}
      />
    </Layout>
  )
}

export default withRouter(body)
