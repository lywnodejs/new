import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import {DownOutlined, RightOutlined} from '@ant-design/icons'

const TableListTwo = ({plan}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const columns = [
    {
      title: '期数',
      dataIndex: 'term',
      key: 'term',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: '科目',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '应还总额（元）',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },

    {
      title: '已还',
      dataIndex: 'finish',
      key: 'finish',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '剩余（元）',
      dataIndex: 'surplus',
      key: 'surplus',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '减免（元）',
      dataIndex: 'reduction',
      key: 'reduction',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '起息日',
      dataIndex: 'beginInterestDateStr',
      key: 'beginInterestDateStr',
      width: 150,
    },
    {
      title: '应还日',
      dataIndex: 'deductDate',
      key: 'deductDate',
      width: 150,
    },
    {
      title: '逾期天数',
      dataIndex: 'days',
      key: 'days',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (t, record) => renderOperation(record),
    },
  ]

  const renderOperation = (record) => {
    if (Array.isArray(record.subDtos) && record.subDtos.length) {
      if (expandedRowKeys.includes(record.id)) {
        return (
          <DownOutlined
            style={{color: 'blue'}}
            onClick={() => handleClose(record)}
          />
        )
      } else {
        return (
          <RightOutlined
            style={{color: 'blue'}}
            onClick={() => handleOpen(record)}
          />
        )
      }
    }
    return null
  }

  const handleOpen = (record) => {
    const keys = [...expandedRowKeys]
    keys.push(record.id)
    setExpandedRowKeys(keys)
  }

  const handleClose = (record) => {
    const keys = [...expandedRowKeys]
    const index = keys.indexOf(record.id)
    keys.splice(index)
    setExpandedRowKeys(keys)
  }

  return (
    <Table
      rowKey="id"
      dataSource={plan}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
      expandable={{
        childrenColumnName: 'subDtos',
        expandIcon: () => <span></span>,
        expandedRowKeys,
      }}
    />
  )
}

export default TableListTwo
