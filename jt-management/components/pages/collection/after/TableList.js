import React, {useEffect, useState, useContext} from 'react'
import {Table, Button, Space} from 'antd'
import Router from 'next/router'
import Check from './Check'
import {CHECK_TYPE} from '~/utils/const'
import api from '~/api/collection'

import Detail from '../../../../pages/collection/after/detail'

const TableList = ({data, collectionProducts, pageParams, changeList}) => {
  const [checkItem, setCheckItem] = useState(null)

  const check = (r) => {
    setCheckItem(r)
  }

  const getContent = (content, successFun, failFunc) => {
    let params = {
      keyword: checkItem.orderNum,
      reviewReason: content,
    }
    api
      .upCheckContent(params)
      .then(({data: {code}}) => {
        if (code == 0) {
          successFun()
          setCheckItem(null)
          changeList(pageParams)
        } else {
          failFunc()
        }
      })
      .catch((err) => {
        failFunc()
      })
  }

  const checkDetail = (record) => {
    let type = record.reviewStatus == 1 ? 0 : 1
    let url = `/collection/after/detail?id=${record.id}&type=${type}`
    Router.push(url)
  }

  const columns = [
    {title: '借据编号', dataIndex: 'orderNum', width: 200, fixed: 'left'},
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 150,
      // render: (text, record, index) => {
      //   let findOne = collectionProducts.find((one) => one.code == text)
      //   return findOne ? findOne.description : ''
      // },
    },
    {title: '用户名', dataIndex: 'realName', width: 150},
    {title: '手机号', dataIndex: 'mobilePhone', width: 150},
    {title: '借款金额', dataIndex: 'loanAmount', width: 150},
    {title: '借款期数', dataIndex: 'loanApplyTerm', width: 150},
    {title: '还款方式', dataIndex: 'repayTypeString', width: 150},
    // {title: '转检查次数', dataIndex: 'reviewNum', width: 150},
    {
      title: '检查状态',
      dataIndex: 'reviewStatus',
      width: 150,
      render: (t) => {
        let item = CHECK_TYPE.find((v) => v.key == t)
        return (item && item.name) || ''
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Space>
            {record.reviewStatus == 1 ? (
              <Button type="text" disabled>
                转检查
              </Button>
            ) : (
              <Button type="link" onClick={() => check(record)}>
                转检查
              </Button>
            )}

            {record.reviewNum < 1 ? (
              <Button type="text" disabled>
                详情
              </Button>
            ) : (
              <Button type="link" onClick={() => checkDetail(record)}>
                详情
              </Button>
            )}
          </Space>
        )
      },
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    console.log(pagination, filters, sorter, extra)
    pageParams.page = pagination.current
    pageParams.pageSize = pagination.pageSize
    changeList(pageParams)
  }

  const paginationConfig = {
    total: data.total,
    current: pageParams.page,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
  }

  return (
    <>
      <Table
        rowKey="key"
        dataSource={data.list}
        columns={columns}
        bordered
        pagination={paginationConfig}
        // rowSelection={rowSelection}
        scroll={{
          y: '100%',
          x: '100%',
        }}
        onChange={onChange}
      />
      <Check
        closeCheck={() => setCheckItem(null)}
        show={!!checkItem}
        getContent={getContent}
      />
    </>
  )
}

export default TableList
