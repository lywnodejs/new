import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'

const TableList = ({list, setList}) => {
  const columns = [
    {
      title: '产品ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '整体授信金额',
      dataIndex: 'creditAmountDesc',
      key: 'creditAmountDesc',
      width: 150,
    },
    {
      title: '单笔用信金额',
      dataIndex: 'singleCreditAmountDesc',
      key: 'singleCreditAmountDesc',
      width: 150,
    },
    {
      title: '贷款期限',
      dataIndex: 'allowTerms',
      key: 'allowTerms',
      width: 150,
      render: (text, record) => {
        if (record.termModel == 1) {
          return record.minTerms + '~' + record.maxTerms + ' 月'
        }
        if (record.termModel == 2) {
          return record.allowTerms + ' 月'
        }
        return null
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTimeDesc',
      key: 'updateTimeDesc',
      width: 150,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 150,
    //   render: (text, record, index) => {
    //     return text ? '启用' : '停用'
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            {/*<Button type="link" onClick={() => onEditStatus(record)}>*/}
            {/*  {record.status ? '停用' : '启用'}*/}
            {/*</Button>*/}
          </>
        )
      },
    },
  ]

  const onEditStatus = (record) => {
    record.status = !record.status
    setList([...list])
  }
  const onEdit = (record) => {
    let url = `/product/information/detail?id=${record.id}`
    Router.push(url)
  }

  return (
    <Table
      rowKey="id"
      dataSource={list}
      columns={columns}
      bordered
      pagination={false}
    />
  )
}

export default TableList
