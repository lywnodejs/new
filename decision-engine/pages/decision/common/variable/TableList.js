import React, {useEffect, useState} from 'react'
import {Button} from 'antd'
import BaseVariableTableList from '../BaseVariableTableList'

const TableList = ({
  list,
  onPage,
  pageParams,
  appendToVariableIds,
  activeCategoryKey,
  activeKey,
  onEdit,
  activeModuleKey,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    function fetchData() {
      setSelectedRowKeys([])
    }
    fetchData()
  }, [activeCategoryKey, activeKey, activeModuleKey])

  const rowSelectionConfig = activeCategoryKey != 0 && {
    type: 'checkbox',
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendToVariableIds(v)
    },
  }
  const extraColumn = activeCategoryKey != 0 &&
    !partialPro && {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
          </>
        )
      },
    }
  return (
    <BaseVariableTableList
      {...{
        list,
        onPage,
        pageParams,
        extraColumn,
        rowSelectionConfig,
        partialPro,
        activeCategoryKey,
      }}
    />
  )
}

export default TableList
