import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, Popconfirm, message, Modal} from 'antd'
import api from '~/api/authority'
import moment from 'moment'
import {USER_AUTH} from '~/utils/const'

const TableList = ({list, onEdit, pullData, pageParams, changePageParams}) => {
  const columns = [
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '数据权限',
      dataIndex: 'dataScope',
      key: 'dataScope',
      render: (t) => {
        let item = USER_AUTH.find((v) => v.key == t)
        return (item && item.name) || ''
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (t) => {
        return moment(t).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 300,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onAuthConfig(record)}>
              功能权限
            </Button>

            <Popconfirm
              title="你确定要删除么？"
              onConfirm={() => onDelete(record, index)}
              okText="是"
              cancelText="否"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  const onAuthConfig = (record) => {
    let url = `/authority/role/detail?roleId=${record.id}`
    Router.push(url)
  }
  const onDelete = async (record) => {
    Modal.confirm({
      content: '确定删除该项数据？',
      onOk: async () => {
        try {
          const {data} = await api.deleteRole(record.id)
          if (data.code == 0) {
            pullData()
            message.success('删除成功')
          }
        } catch (errorInfo) {
          console.log('Failed:', errorInfo)
        }
      },
    })
  }

  const pagination = {
    defaultCurrent: 1,
    total: list.total,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo || 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber, pageSize) => {
      let obj = {
        pageNo: pageParams.pageSize === pageSize ? pageNumber : 1,
        pageSize,
      }
      changePageParams(obj)
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
    />
  )
}

export default TableList
