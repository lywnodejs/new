import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
import {scrollTop} from '~/utils'
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'

const pageParams = {
  pageNo: 1,
  pageSize: 20,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.smscrowdservice.searchpeople', [params])
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '用户运营'}, {text: '手动短信任务管理'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }
  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{status: ''}}
    >
      <Form.Item label="任务名称" name="taskName">
        <Input />
      </Form.Item>

      <Form.Item label="人群名称" name="crowdName">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          搜索
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [visible, setVisible] = useState(false)
  const [mLoading, setLoading] = useState(false)
  const [upTime, setUpTime] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [selectItem, setSelect] = useState()

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
    scrollTop()
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const columns = [
    {title: '任务名称', dataIndex: 'taskName'},
    {title: '发送时间', dataIndex: 'sendTime'},
    {title: '人群名称', dataIndex: 'crowdName'},
    {title: '人群计数', dataIndex: 'peopleCount'},
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      render: (t) => {
        let text = '-'
        // 0:待执行,1:发送中,2:已发送,3:已取消
        if (t == '0') {
          text = '待执行'
        }
        if (t == '1') {
          text = '发送中'
        }
        if (t == '2') {
          text = '已发送'
        }
        if (t == '3') {
          text = '已取消'
        }
        return text
      },
    },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            {r.taskStatus == 0 && (
              <React.Fragment>
                <Button type="link" onClick={() => cancelTask(r.id)}>
                  取消任务
                </Button>
                <Button type="link" onClick={() => changeTime(i)}>
                  修改时间
                </Button>
              </React.Fragment>
            )}

            <Button type="link" onClick={() => downloadData(r.downloadUrl)}>
              下载人群
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const jump2edit = () => {
    let url = '/user-operation/sms/edit'
    Router.push(url)
  }

  const cancelTask = (id) => {
    Modal.confirm({
      icon: <CloseCircleOutlined style={{color: '#ff4d4f'}} />,
      content: '确定取消任务吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let {
          data: {code},
        } = await fetch('bank.api.smscrowdservice.cancletask', [{id}])
        if (code == 0) {
          message.success('任务取消成功')
          onChangePage()
        }
      },
    })
  }

  const changeTime = (i) => {
    setVisible(true)
    setSelect(i)
  }
  const timeChange = (v, b) => {
    setUpTime(b)
  }
  const handleOk = async () => {
    if (moment(upTime).isBefore()) {
      return message.error('提交失败，请填写正确的发送时间')
    }
    setLoading(true)
    let params = {
      ...data.list[selectItem],
      sendTime: moment(upTime).format('YYYY-MM-DD HH:mm:ss'),
    }
    let {
      data: {code},
    } = await fetch('bank.api.smscrowdservice.updateruntime', [params])
    setLoading(false)
    if (code == 0) {
      message.success('修改成功')
      setVisible(false)
      onChangePage()
    }
  }
  const disabledDate = (current) => {
    return moment(current).isBefore(new Date(), 'day')
  }

  const disabledDateTime = (date) => {
    if (!date) return

    const CH = moment().format('HH')
    const HH = moment(date).format('HH')
    const mm = moment(date).format('mm')
    let hs = Array.from({length: CH}).map((v, index) => index)
    let ms = HH > CH ? [] : Array.from({length: mm}).map((v, index) => index)
    return {
      disabledHours: () => hs,
      disabledMinutes: () => ms,
    }
  }

  const downloadData = (downloadUrl) => {
    if (downloadUrl) {
      location.href = downloadUrl
    }
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search search={onSearch} />
      <div style={{marginBottom: 20}}>
        <Button
          type="primary"
          style={{marginRight: 20}}
          onClick={() => jump2edit()}
        >
          新建任务
        </Button>
      </div>
      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />

      <Modal
        title="修改时间"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        confirmLoading={mLoading}
      >
        <DatePicker
          defaultValue={moment(
            data.list[selectItem] && data.list[selectItem].sendTime,
          )}
          onChange={timeChange}
          showTime
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
        />
      </Modal>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
