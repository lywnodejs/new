import React, {useEffect, useState, useContext} from 'react'
import {Table, Button, Card, Tooltip} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, pageParams, totalNum, remark}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '预警编号',
      dataIndex: 'warnNo',
      key: 'warnNo',
      width: 150,
    },
    {
      title: '用户名',
      dataIndex: 'realName',
      key: 'realName',
      width: 150,
    },

    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '预警日期',
      dataIndex: 'warnTime',
      key: 'warnTime',
      width: 150,
    },
    {
      title: '命中策略',
      dataIndex: 'hitStrategy',
      key: 'hitStrategy',
      width: 150,
    },
    {
      title: '预警结果',
      dataIndex: 'warnResult',
      key: 'warnResult',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      render: (text) => {
        if (text == null) {
          return '--'
        } else if (String(text).length >= 20) {
          return (
            <Tooltip placement="top" title={text}>
              {text.substring(0, 9) + '...'}
            </Tooltip>
          )
        } else {
          return <span>{text}</span>
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (record, text, index) => {
        return (
          <div>
            <a onClick={() => remark(text)}>备注</a>
            {text.warnResult == '额度冻结' ? (
              <a style={{marginLeft: 10}} onClick={() => checkDetail(text)}>
                客户详情
              </a>
            ) : text.warnResult == '高风险' ? (
              <a style={{marginLeft: 10}} onClick={() => checkList(text)}>
                检查清单
              </a>
            ) : null}
          </div>
        )
      },
    },
  ]

  const checkDetail = (text) => {
    Router.push(`/customer/detail?id=${text.userId}&type=1`)
  }
  const checkList = (text) => {
    Router.push(`/collection/after?keyword=${text.mobilePhone}`)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalNum,
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
    <Card>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
    </Card>
  )
}

export default TableList
