import React, {useState} from 'react'
import {Table, Button, Badge, Input, Select} from 'antd'

const TableList = ({list, setList, onAdd, type, allDefaultParams}) => {
  const calculateTitle = (param) => {
    return type == 4
      ? param == 'key'
        ? '系统内参数'
        : '映射参数'
      : param == 'key'
      ? 'KEY'
      : 'VALUE'
  }
  const columns = [
    {
      title: calculateTitle('key'),
      dataIndex: 'key',
      key: 'key',
      width: 100,
      render: (text, record, index) => {
        if (type == 4) {
          return (
            <Select
              onChange={(val) => {
                record.key = String(val)
                setList([...list])
              }}
              value={text}
              style={{width: '180px'}}
            >
              {allDefaultParams.map((params) => {
                return (
                  <Select.Option value={String(params.id)} key={params.id}>
                    {params.columnName}
                  </Select.Option>
                )
              })}
            </Select>
          )
        }
        return (
          <Input
            value={text}
            onChange={(e) => {
              record.key = e.target.value
              setList([...list])
            }}
          />
        )
      },
    },
    {
      title: calculateTitle(),
      dataIndex: 'value',
      key: 'value',
      width: 100,
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            onChange={(e) => {
              record.value = e.target.value
              setList([...list])
            }}
          />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 60,
      render: (text, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              list.splice(index, 1)
              setList([...list])
            }}
          >
            删除
          </Button>
        )
      },
    },
  ]
  return (
    <>
      <Table
        rowKey="id"
        dataSource={list || []}
        columns={columns}
        bordered
        pagination={false}
        // scroll={{y: '100%', x: '100%'}}
      />
      <Button
        type="dashed"
        style={{width: '100%', marginTop: '10px'}}
        onClick={() => onAdd(type)}
      >
        新增
      </Button>
    </>
  )
}

export default TableList
