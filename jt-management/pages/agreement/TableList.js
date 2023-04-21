import React, {useState} from 'react'
import {Table, Button, Badge} from 'antd'

const TableList = ({
  list,
  onPage,
  onEdit,
  pageParams,
  showPages,
  onPreview,
  onSwitchStatus,
  appendAgreementIds,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendAgreementIds(v)
    },
  }

  const columns = [
    {title: '应用类型', dataIndex: 'applicationType', key: 'applicationType'},
    {title: '展示页面', dataIndex: 'showPage'},
    {title: '协议名称', dataIndex: 'fileName'},
    {title: '协议模板', dataIndex: 'templateName'},
    {
      title: '是否首位',
      dataIndex: 'isFirst',
      render: (text, record, index) => {
        return text ? '是' : '否'
      },
    },
    {
      title: '强制阅读',
      dataIndex: 'readStatus',
      render: (text, record, index) => {
        return text ? '是' : '否'
      },
    },
    {
      title: '是否签章',
      dataIndex: 'isSignature',
      render: (text, record, index) => {
        return text ? '是' : '否'
      },
    },
    {
      title: '签章节点',
      dataIndex: 'node',
      render: (text, record, index) => {
        return record.isSignature ? text : '不签章'
      },
    },
    // {
    //   title: '页面默认勾选',
    //   dataIndex: 'defaultCheck',
    //   key: 'defaultCheck',
    //   width: 100,
    //   render: (text, record, index) => {
    //     return text ? '是' : '否'
    //   },
    // },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return (
          <React.Fragment>
            <Badge status={text == 1 ? 'success' : 'error'} />
            {text == 1 ? '启用' : '停用'}
          </React.Fragment>
        )
      },
    },
    {title: '更新人', dataIndex: 'updateBy'},
    {title: '更新日期', dataIndex: 'updateTime'},
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 225,
      render: (text, record, index) => {
        return (
          <React.Fragment>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onPreview(record)}>
              预览
            </Button>

            <Button type="link" onClick={() => onSwitchStatus(record, index)}>
              {record.status == 1 ? '停用' : '启用'}
            </Button>
          </React.Fragment>
        )
      },
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
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
      pagination={pagination}
      rowSelection={rowSelection}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
