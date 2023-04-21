import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  totalData,
  onPage,
  pageParams,
  productList,
  channelData,
  onEditMemo,
  changeHID,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '信审单号',
      dataIndex: 'creditNum',
      key: 'creditNum',
      width: 180,
      fixed: 'left',
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productType',
      key: 'productType',
      width: 180,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? (
          record.isBlue ? (
            <span style={{color: '#1890ff'}}>{findOne.name}</span>
          ) : (
            findOne.name
          )
        ) : (
          ''
        )
      },
    },
    {
      title: '渠道',
      dataIndex: 'addChannel',
      key: 'addChannel',
      width: 180,
      render: (text, record, index) => {
        let findOne = channelData.find((one) => one.code == text)
        let showText = findOne ? findOne.description : ''
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{showText}</span>
        ) : (
          showText
        )
      },
    },

    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },

    {
      title: '机审出额',
      dataIndex: 'policyLoanAmount',
      key: 'policyLoanAmount',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '授信日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '信审员',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '已过时长/总时长',
      dataIndex: 'waitHours',
      key: 'waitHours',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>
            {record.waitHours}&nbsp;/&nbsp;{record.waitOverallHours}
          </span>
        ) : (
          <p>
            {record.waitHours}&nbsp;/&nbsp;{record.waitOverallHours}
          </p>
        )
      },
    },
    {
      title: '调查状态',
      dataIndex: 'surveyStatus',
      key: 'surveyStatus',
      width: 180,
      render: (text, record, index) => {
        return record.surveyStatus == 1 ? (
          <span style={record.isBlue ? {color: '#1890ff'} : null}>调查中</span>
        ) : record.surveyStatus == 2 ? (
          <span style={record.isBlue ? {color: '#1890ff'} : null}>
            调查完成
          </span>
        ) : null
      },
    },
    {
      title: '临时备注',
      dataIndex: 'note',
      key: 'note',
      width: 180,
      render: (text, record, index) => {
        return record.isBlue ? (
          <span style={{color: '#1890ff'}}>{text}</span>
        ) : (
          text
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'CZ',
      key: 'CZ',
      width: 180,
      fixed: 'right',
      render: (record, row) => {
        return (
          <div>
            <a onClick={() => checkDetail(row)}>详情</a>
            <a style={{marginLeft: 10}} onClick={() => onEditMemo(row)}>
              备注
            </a>
            <a style={{marginLeft: 10}} onClick={() => changeHID(row)}>
              {row.isBlue ? '取消' : ''}标蓝
            </a>
          </div>
        )
      },
    },
  ]

  const checkDetail = (row) => {
    let url = `/credit/examine/detail?creditId=${row.creditId}&orderId=${row.orderId}&flag=1`
    Router.push(url)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData.total,
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
