import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'
import {findFieldByKey} from '../mapActionToApi'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'
const StrategyTableList = ({
  list,
  onPage,
  pageParams,
  appendToVariableIds,
  activeCategoryKey,
  onEditDeriveDetail,
  activeModuleKey,
  activeKey,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')

  useEffect(() => {
    async function fetchData() {
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
      title: '规则编号',
      dataIndex: 'actionCode',
      key: 'actionCode',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'actionName',
      key: 'actionName',
      width: 100,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
    {
      title: '赋值给X',
      dataIndex: 'fieldOut',
      key: 'fieldOut',
      width: 150,
    },
    {
      title: '规则',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 250,
      render: (scriptSource, record) => (
        <span
          onClick={() => onShowAllScriptSource(scriptSource)}
          style={{
            color: '#1890ff',
            cursor: 'pointer',
            wordBreak: 'break-all',
            WebkitLineClamp: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            paddingRight: 14,
          }}
        >
          {scriptSource}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 80,
      render: (text, record, index) => {
        return (
          <>
            {!partialPro && (
              <Button type="link" onClick={() => onEditDeriveDetail(record)}>
                编辑
              </Button>
            )}
          </>
        )
      },
    },
  ]

  const extraColumn = !partialPro
    ? columns
    : columns.slice(0, columns.length - 1)
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

  return (
    <>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={extraColumn}
        bordered
        pagination={pagination}
        rowSelection={!partialPro ? rowSelection : null}
        scroll={{y: '100%', x: '1600px'}}
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

export default StrategyTableList
