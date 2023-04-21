import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'

const TableList = ({
  list,
  onPage,
  pageParams,
  appendToVariableIds,
  onEditDerive,
  activeKey,
  activeCategoryKey,
  activeModuleKey,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')

  useEffect(() => {
    function fetchData() {
      setSelectedRowKeys([])
    }
    fetchData()
  }, [activeCategoryKey, activeKey, activeModuleKey])

  const rowSelection = {
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendToVariableIds(v)
    },
  }

  const columns = [
    {
      title: '分组',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      width: 150,
    },
    {
      title: '中文名',
      dataIndex: 'fieldShowName',
      key: 'fieldShowName',
      width: 150,
    },
    {
      title: '参数',
      dataIndex: 'fieldColumnName',
      key: 'fieldColumnName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'fieldColumnType',
      key: 'fieldColumnType',
      width: 150,
    },
    {
      title: '动作表达式',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (scriptSource, record) => (
        <span
          onClick={() => onShowAllScriptSource(scriptSource)}
          style={{color: '#1890ff', cursor: 'pointer', wordBreak: 'break-all'}}
        >
          {scriptSource}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEditDerive(record)}>
              编辑
            </Button>
          </>
        )
      },
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
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
  const onShowAllScriptSource = (scriptSource) => {
    setScriptSourceVisible(true)
    setScriptSource(scriptSource)
  }

  const extraColumn = partialPro
    ? [...columns.slice(0, columns.length - 1)]
    : columns
  return (
    <>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={extraColumn}
        bordered
        pagination={pagination}
        rowSelection={!partialPro ? rowSelection : null}
      />
      <ScriptSourceDetailModal
        {...{
          scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </>
  )
}

export default TableList
