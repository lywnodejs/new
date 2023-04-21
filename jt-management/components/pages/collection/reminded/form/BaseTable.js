import {Table} from 'antd'
import React, {useEffect, useState} from 'react'

export default function (props) {
  const [paginationConfig, setPaginationConfig] = useState(false)

  useEffect(() => {
    if (props.pageParams) {
      setPaginationConfig(pagination)
    }
  }, [props.list])

  const pagination = {
    defaultCurrent: 1,
    total: Array.isArray(props.list) ? 0 : props.list.total,
    pageSize: (props.pageParams && props.pageParams.pageSize) || 10,
    showQuickJumper: true,
    showSizeChanger: true,
    current: (props.pageParams && props.pageParams.page) || 1,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber, pageSize) => {
      props.changePage(pageNumber, pageSize)
    },
  }

  return (
    <>
      <Table
        rowKey={props.rowKey || 'id'}
        dataSource={Array.isArray(props.list) ? props.list : props.list.list}
        columns={props.columns}
        bordered
        pagination={paginationConfig}
        scroll={{y: '100%', x: '100%'}}
      />
    </>
  )
}
