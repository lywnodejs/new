import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'
import {findFieldByKey} from '../mapActionToApi'
const StrategyTableList = ({
  list,
  onPage,
  pageParams,
  appendToVariableIds,
  activeCategoryKey,
  onEditStrategyMix,
  activeModuleKey,
  activeKey,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

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
      title: '编号',
      dataIndex: findFieldByKey(+activeCategoryKey, 'code'),
      key: findFieldByKey(+activeCategoryKey, 'code'),
      // width: 150,
    },
    {
      title: '名称',
      dataIndex: findFieldByKey(+activeCategoryKey, 'name'),
      key: findFieldByKey(+activeCategoryKey, 'name'),
      // width: 150,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      // width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onCheckDetail(record)}>
              编辑
            </Button>
          </>
        )
      },
    },
  ]

  const onCheckDetail = (record) => {
    let url
    if (partialPro) {
      url = `/decision/produce/detail?category=${activeCategoryKey}&productId=${activeKey}&id=${record.id}&moduleType=${activeModuleKey}&partialPro=${partialPro}&updateTime=${record.updateTime}`
    } else {
      url = `/decision/edit/detail?category=${activeCategoryKey}&productId=${activeKey}&id=${record.id}&moduleType=${activeModuleKey}&updateTime=${record.updateTime}`
    }

    Router.push(url)
  }
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

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      rowSelection={!partialPro ? rowSelection : null}
      scroll={{y: '100%', x: '1600px'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
    />
  )
}

export default StrategyTableList
