import React, {useEffect, useState, useContext} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'
import {keepAliveLoadFromCache} from 'react-next-keep-alive'

const TableList = ({onPage, productList, pageParams, exhibition}) => {
  const columns = [
    {
      title: '调用日期',
      dataIndex: 'callTime',
      key: 'callTime',
      width: '200px',
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: '130px',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      width: '200px',
    },
    {
      title: '调用产品',
      dataIndex: 'productName',
      key: 'productName',
      width: '90px',
    },
    {
      title: '触发类型',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: '90px',
    },
    {
      title: '姓名',
      dataIndex: 'custName',
      key: 'custName',
      width: '80px',
    },
    {
      title: '决策流',
      dataIndex: 'flowName',
      key: 'flowName',
      width: '170px',
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: '70px',
      // 新增风险预警结果
      render: (text) => {
        switch (text) {
          case 'PASS':
            return '通过'
          case 'REFUSE':
            return '拒绝'
          case 'ARTIFICIAL':
            return '人工'
        }
      },
    },
    {
      title: '拒绝原因',
      dataIndex: 'rejecDecision',
      key: 'rejecDecision',
      width: '150px',
      render: (text, record) => {
        if (text) {
          return (
            <a
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: 130,
                display: 'inline-block',
              }}
              onClick={() => exhibition(record)}
            >
              {text}
            </a>
          )
        } else {
          return <p>--</p>
        }
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: '170px',
    },
    {
      title: '调用任务',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '150px',
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: '100px',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <a
            type="link"
            onClick={() => {
              checkDetail(record)
            }}
          >
            详情
          </a>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/statistics/query/detail?requestNo=${record.requestNo}`
    // keepAliveLoadFromCache('query-detail', false)
    Router.push(url)
  }

  const pagination = {
    defaultCurrent: 1,
    total: productList.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onPage,
  }

  return (
    <Table
      // rowKey={(record) => record.decisionOrderId}
      rowKey="id"
      dataSource={productList.list || []}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{x: '1600px', y: '100%'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
    />
  )
}

export default TableList
