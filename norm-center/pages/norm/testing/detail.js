import {Layout} from '~/components/Layout'
import {Card, Table, Button} from 'antd'
import Router from 'next/router'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'

const breadcrumbs = [{text: '指标调用'}, {text: '指标测试'}, {text: '测试详情'}]
const pageParams = {
  pageNo: 1,
  pageSize: 20,
}

const getData = async (id) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.exec.indexectestservice.gettaskdetail',
    [{id, ...pageParams}],
  )

  if (code == 0) {
    return data
  }
  return {totalSize: 0, list: []}
}

function body(props) {
  const [data, setData] = useState({})

  const updateList = async () => {
    // console.log(pageParams)
    let data = await getData(props.id)
    setData(data)
  }

  useEffect(() => {
    updateList()
  }, [])

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    updateList()
  }

  const pagination = {
    defaultCurrent: 1,
    total: data.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  const columns = [
    {title: '用户姓名', dataIndex: 'name'},
    {title: '身份证号', dataIndex: 'idCard'},
    {title: '手机号码', dataIndex: 'mobile'},
    {title: '指标中文名', dataIndex: 'indNameCN'},
    {title: '指标名', dataIndex: 'indName'},
    {title: '结果', dataIndex: 'result'},
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={
        <Button
          onClick={() => {
            Router.back()
          }}
        >
          返回上一页
        </Button>
      }
    >
      <Card>
        <Table
          bordered
          dataSource={data.list || []}
          rowKey="id"
          columns={columns}
          pagination={pagination}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async ({ctx: {query}}) => {
  const id = query.id
  const data = await getData(id)
  return {data, id}
}

export default body
