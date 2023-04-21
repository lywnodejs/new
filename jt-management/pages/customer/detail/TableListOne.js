import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListOne = ({
  customerCreditSituationDetail,
  adjustmentDo,
  productList,
}) => {
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productId',
      key: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '授信额度（元）',
      dataIndex: 'fixedLimitAmount',
      key: 'fixedLimitAmount',
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
      title: '已用额度（元）',
      dataIndex: 'usedLimitAmount',
      key: 'usedLimitAmount',
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
      title: '剩余额度（元）',
      dataIndex: 'surplusLimitAmount',
      key: 'surplusLimitAmount',
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
      title: '年化利率',
      dataIndex: 'fixedLimitRate',
      key: 'fixedLimitRate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(3)
        str += '%'
        return str
      },
    },
    {
      title: '状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 150,
      // render: (text) => {
      //   switch (text) {
      //     case '1':
      //       return '正常'
      //     case '2':
      //       return '冻结'

      //   }
      // },
    },
    {
      title: '额度有效期',
      dataIndex: 'fixedEndDate',
      key: 'fixedEndDate',
      width: 200,
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
            <Button type="link" onClick={() => adjustmentDo(record)}>
              调整
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={customerCreditSituationDetail}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListOne
