import * as React from 'react'
import { inject } from 'mobx-react'
import { Table } from 'antd'


interface Iprops {
  dataSource: any //表哥数据
  columns: any, //表头数据
  pagination?: any // 分页
  size?: 'middle'
  bordered?: boolean
}
@inject('router')

class UseTable extends React.Component<Iprops> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const { dataSource, columns, pagination, size, bordered } = this.props
    return (
      <div className="table">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          size={size}
          bordered={bordered}
        />
      </div>
    )
  }
}

export default UseTable
