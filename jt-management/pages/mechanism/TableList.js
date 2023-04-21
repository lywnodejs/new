import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list}) => {
  const columns = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => look(record)}>查看</a>
            <span style={{color: '#1890ff'}}>/</span>
            <a onClick={() => edit(record)}>编辑</a>
          </span>
        )
      },
    },
  ]
  const look = (record) => {
    let url = `/mechanism/detail?id=${record.id}&type=${record.type}&flag=1`
    Router.push(url)
  }
  const edit = (record) => {
    let url = `/mechanism/detail?id=${record.id}&type=${record.type}`
    Router.push(url)
  }
  return (
    <Table
      rowKey={(record) => record.id}
      dataSource={list}
      columns={columns}
      bordered
    />
  )
}

export default TableList
