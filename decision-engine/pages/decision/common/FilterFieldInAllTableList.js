import React from 'react'
import {Table, Button, Input} from 'antd'

const FilterFieldInAllTableList = ({
  selectedFieldList,
  setSelectedFieldList,
  onImportToTextArea,
}) => {
  const columns = [
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onDelete(record, index)}>
              删除
            </Button>
          </>
        )
      },
    },
    {
      title: '中文名',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      width: 150,
      render: (text, record, index) => {
        return record.fieldShowName + ':' + record.fieldColumnName
      },
      onCell: (record) => {
        return {
          onClick: (event) => {
            onImportToTextArea(record)
          },
        }
      },
    },
    {
      title: '输入',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            placeholder="赋值"
            onChange={(e) => {
              record.value = e.target.value
              setSelectedFieldList([...selectedFieldList])
            }}
          />
        )
      },
    },
  ]

  const onDelete = (record, index) => {
    selectedFieldList.splice(index, 1)
    setSelectedFieldList([...selectedFieldList])
  }

  return (
    <Table
      showHeader={false}
      rowKey="id"
      dataSource={selectedFieldList}
      columns={columns}
      bordered
      pagination={false}
      scroll={{y: '180px', x: '100%'}}
    />
  )
}

export default FilterFieldInAllTableList
