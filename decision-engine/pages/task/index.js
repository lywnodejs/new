import {Layout} from '~/components/Layout'
import {Card, Button, Table, Space} from 'antd'
import {useState} from 'react'
import fetch from '~/utils/fetch'
import Task from './task'

const breadcrumbs = [{text: '任务管理'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const getData = async (params = pageParams) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.engine.facade.service.biz.manualtaskfdservice.querymanualtaskvo',
    [params],
  )
  if (code === 0) {
    return data
  }
  return {totalSize: 0, list: []}
}

function body(props) {
  const {
    initData: {totalSize, list},
  } = props
  const [data, setData] = useState({list, totalSize})

  const showDetail = (record) => {
    // Router.push(`/statistics/query?name=${record.taskName}`)
    window.location = `/statistics/query?name=${record.taskName}`
  }

  const columns = [
    {title: '任务名称', dataIndex: 'taskName'},
    {title: '决策流', dataIndex: 'flowName'},
    {title: '任务归属', dataIndex: 'productName'},
    {title: '任务文件', dataIndex: 'fileName', width: 220},
    {title: '操作时间', dataIndex: 'createTime'},
    {title: '操作员', dataIndex: 'createUser'},
    {title: '任务状态', dataIndex: 'status'},
    {
      title: '操作',
      dataIndex: 'detailDownURL',
      width: 180,
      fixed: 'right',
      render: (_, record, i) => {
        const disabled = () => {
          if (record.status !== '执行成功') {
            return true
          }
          return false
        }
        return (
          <Space>
            <Button
              disabled={disabled()}
              type="link"
              onClick={() => downloadData(record)}
            >
              下载
            </Button>
            <Button
              disabled={disabled()}
              type="link"
              onClick={() => showDetail(record)}
            >
              详情
            </Button>
          </Space>
        )
      },
    },
  ]

  const downloadData = async (record) => {
    let link = document.createElement('a')
    link.href = `/api/design/exec/manual/result/${record.id}`
    link.click()
    link.remove()
  }

  const updateList = async (params = pageParams) => {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.engine.facade.service.biz.manualtaskfdservice.querymanualtaskvo',
      [pageParams],
    )

    if (code === 0) {
      const {list, totalSize} = data
      setData({list, totalSize})
    }
    return {totalSize: 0, list: []}
  }

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

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Task updateList={updateList} />
      </Card>
      <Card
        title="历史记录"
        style={{
          width: '100%',
          marginTop: 20,
        }}
      >
        <Table
          bordered
          dataSource={data.list || []}
          rowKey="id"
          columns={columns}
          pagination={pagination}
          scroll={{y: '100%', x: '1600px'}}
          rowClassName={(record, idx) => {
            if (idx % 2 === 0) return 'bg-row'
          }}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const [initData] = await Promise.all([getData()])
  return {initData}
}

export default body
