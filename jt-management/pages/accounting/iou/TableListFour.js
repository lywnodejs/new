import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListThree = ({assetProtectionsList}) => {
  const columns = [
    {
      title: '发起人',
      dataIndex: 'launchName',
      key: 'launchName',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            <p>{row.launchName}</p>
            <p>{row.launchTime}</p>
          </div>
        )
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '发起人备注',
      dataIndex: 'launchRemark',
      key: 'launchRemark',
      width: 150,
      render: (text, record, row) => {
        if (record.type == 2 || record.type == 3 || record.type == 4) {
          return <p>/</p>
        } else {
          return <p>{text}</p>
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      width: 150,
      render: (record, row) => {
        if (row.type != 5) {
          return <span>{row.typeString}</span>
        }
        if (row.type == 5) {
          return row.examineStatus == 0
            ? '审核中'
            : row.examineStatus == 1
            ? '通过'
            : '不通过'
        }
      },
    },
    {
      title: '审核人备注',
      dataIndex: 'examineRemark',
      key: 'examineRemark',
      width: 150,
      render: (text, record, row) => {
        if (
          record.type == 2 ||
          record.type == 3 ||
          record.type == 4 ||
          record.examineStatus == 0
        ) {
          return <p>/</p>
        } else {
          return <p>{text}</p>
        }
      },
    },

    {
      title: '审核人',
      dataIndex: 'examineName',
      key: 'examineName',
      width: 150,
      render: (record, row) => {
        if (row.examineStatus == 0) {
          return <p></p>
        } else if (row.type == 2 || row.type == 3 || row.type == 4) {
          return <p>/</p>
        } else {
          return (
            <div>
              <p>{row.examineName}</p>
              <p>{row.examineTime}</p>
            </div>
          )
        }
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={assetProtectionsList}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListThree
