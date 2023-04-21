import React, {useEffect, useState} from 'react'
import Router, {withRouter} from 'next/router'
import {Table, Button} from 'antd'
import _ from 'lodash'
const defaultArr = [
  {title: '日期', dataIndex: 'dateTime'},
  {title: '支行代码', dataIndex: 'networkCode'},
  {title: '所属网点', dataIndex: 'networkName'},
  {title: '进件单数', dataIndex: 'inputLoansCount'},
  {title: '进件用户数', dataIndex: 'inputLoansUserCount'},
  {title: '新增用户数', dataIndex: 'newAddUserCount'},
  {title: '授信通过人数', dataIndex: 'passedUserCount'},
  {title: '授信通过率', dataIndex: 'passedRate'},
  {title: '放款人数', dataIndex: 'loanUserCount'},
  {title: '放款单数', dataIndex: 'loanCount'},
  {title: '放款金额', dataIndex: 'loanAmountSum'},
  {title: '贷款调查通过率', dataIndex: 'surveyRate'},
]

const TableList = ({data, activeKey, pageParams, changePageParams}) => {
  const [columns, setColumns] = useState([...defaultArr])

  useEffect(() => {
    let arr = _.cloneDeep(defaultArr)
    if (activeKey == 1) {
      arr.splice(
        1,
        1,
        ...[
          {title: '客户经理', dataIndex: 'managerName'},
          {title: '工号', dataIndex: 'jobNumber'},
        ],
      )
      setColumns(arr)
    } else {
      setColumns(arr)
    }
  }, [activeKey])

  const pagination = {
    defaultCurrent: 1,
    total: data.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: false,
    current: pageParams.pageNo || 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber, pageSize) => {
      let obj = {
        pageNo: pageParams.pageSize === pageSize ? pageNumber : 1,
        pageSize,
      }
      changePageParams(obj)
    },
  }

  return (
    <Table
      rowKey={(r, i) => {
        return pageParams.pageNo + '' + i
      }}
      dataSource={data.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default withRouter(TableList)
