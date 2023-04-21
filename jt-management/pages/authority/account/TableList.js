import React from 'react'
import {Table, Button, Popconfirm, message, Badge, Modal} from 'antd'
import api from '~/api/authority'
import moment from 'moment'
const TableList = ({data, onEdit, pageParams, changePageParams}) => {
  const columns = [
    {title: '姓名', dataIndex: 'accountName'},
    {title: '手机号', dataIndex: 'mobile'},
    {title: '邮箱账号', dataIndex: 'email'},
    {title: '部门', dataIndex: 'departmentName'},
    {title: '角色', dataIndex: 'roleName'},
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (t) => {
        return moment(t).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return (
          <>
            <Badge status={text ? 'success' : 'error'} />
            {text ? '启用' : '禁用'}
          </>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 250,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onStatus(record)}>
              {record.status ? '禁用' : '启用'}
            </Button>

            <Button type="link" onClick={() => onDelete(record, index)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]

  const onStatus = async (record) => {
    Modal.confirm({
      content: `确定${record.status ? '禁用' : '启用'}该项账号？`,
      onOk: async () => {
        try {
          const {data} = await api.changeAccountStatus({
            id: record.id,
            status: record.status ? 0 : 1,
          })
          if (data.code == 0) {
            changePageParams()
            message.success('操作成功')
          }
        } catch (errorInfo) {
          console.log('Failed:', errorInfo)
        }
      },
    })
  }
  const onDelete = async (record) => {
    Modal.confirm({
      content: '确定删除该项数据？',
      onOk: async () => {
        try {
          const {data} = await api.deleteAccount(record.id)
          if (data.code == 0) {
            changePageParams()
            message.success('删除成功')
          }
        } catch (errorInfo) {
          console.log('Failed:', errorInfo)
        }
      },
    })
  }

  const onShowSizeChange = (current, pageSize) => {
    changePageParams(1, pageSize)
  }

  const pagination = {
    defaultCurrent: 1,
    total: data.total,
    pageSize: pageParams.pageSize || 20,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo || 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      changePageParams(pageNumber)
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={data.list}
      columns={columns}
      bordered
      pagination={pagination}
    />
  )
}

export default TableList
