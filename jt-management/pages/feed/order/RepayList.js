import React, {useEffect, useState} from 'react'
import {Table, Button, Tooltip} from 'antd'
import Router from 'next/router'

const RepayList = ({
  list,
  onPage,
  operationTypes,
  statusList,
  pageParams,
  hidePage,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '支付流水号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '还款金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
      render: (text, record, index) => {
        let findOne = operationTypes.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },

    {
      title: '银行名称',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 150,
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 150,
    },
    {
      title: '支付状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        let findOne = statusList.find((one) => one.code == text)
        return findOne ? (
          <>
            {findOne.description}
            {findOne.description == '失败' && (
              <Tooltip title={record.errorMsg}>
                <Button type="link" style={{paddingLeft: 0}}>
                  详情
                </Button>
              </Tooltip>
            )}
          </>
        ) : (
          ''
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={hidePage ? false : pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default RepayList
