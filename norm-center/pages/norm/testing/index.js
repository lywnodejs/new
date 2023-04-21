import {Layout} from '~/components/Layout'
import {
  Card,
  Checkbox,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  Space,
  Modal,
  Popconfirm,
  message,
} from 'antd'
import {
  SearchOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import Task from './task'
import Router from 'next/router'
import {downloadExcel} from '~/utils/fetch'
import Detail from './detail'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '指标调用'}, {text: '指标测试'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const getData = async (params = pageParams) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.exec.indexectestservice.gettasklist',
    [pageParams],
  )

  if (code === 0) {
    // console.log(data);
    return data
  }
  return {totalSize: 0, list: []}
}

const downloadData = async (url) => {
  const downloadFile = await downloadExcel(url)
  const type = Object.prototype.toString.call(downloadFile.data)
  if (type === '[object ArrayBuffer]') {
    var disposition = downloadFile.headers['content-disposition']
    var fileName = decodeURI(disposition.split("filename*=UTF-8''")[1])
    let blob = new Blob([downloadFile.data]) // 假设文件为pdf
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    link.remove()
  } else {
    message.error('下载失败')
  }
}

function body({initData}) {
  const [data, setData] = useState({...initData})
  // console.log(props)
  const [status, setStatus] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form] = Form.useForm()

  const showDetail = (r, i) => {
    // console.log(r, i)
    Router.push(`/norm/testing/detail?id=${r.id || 1}`)
    // push(<Detail id={r.id || 1} />)
  }

  const columns = [
    {title: '任务名称', dataIndex: 'name'},
    {title: '任务文件', dataIndex: 'paramFileName'},
    {title: '操作时间', dataIndex: 'operateTime'},
    {title: '操作员', dataIndex: 'operatorName'},
    {title: '任务状态', dataIndex: 'statusDesc'},
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record, i) => {
        return (
          <Space>
            <a
              disabled={!record.isSucceed}
              onClick={() => downloadData(record.detailDownURL)}
            >
              下载
            </a>
            <a
              disabled={!record.isSucceed}
              onClick={() => showDetail(record, i)}
            >
              详情
            </a>
          </Space>
        )
      },
    },
  ]

  const updateList = async () => {
    // console.log(pageParams)
    let data = await getData()
    setData(data)
  }

  // setInterval(() => {
  //   updateList()
  // }, 30000)

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
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const initData = await getData()
  console.log(initData)
  return {initData}
}

export default withKeepAlive(body, 'norm-testing')
