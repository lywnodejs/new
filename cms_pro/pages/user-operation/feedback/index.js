import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {
  Table,
  Card,
  Button,
  Form,
  DatePicker,
  Input,
  Select,
  Tooltip,
  message,
} from 'antd'
import fetch from '~/utils/fetch'
import moment from 'moment'
import Router from 'next/router'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '用户运营'}, {text: '问题反馈'}]

const pageParams = {
  pageNo: 1,
  pageSize: 20,
}

let values = {}

function body(props) {
  const [list, setList] = useState([])
  const [total, setTotal] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [form] = Form.useForm()
  useEffect(() => {
    getData()
  }, [])

  const getData = async (values = {}) => {
    const {time} = values
    if (time == undefined) {
      values = {
        ...values,
        startTime: moment(new Date()).format('YYYY-MM-DD'),
        endTime: moment(new Date()).format('YYYY-MM-DD'),
      }
    }
    if (time === null) {
      values = {
        ...values,
        startTime: null,
        endTime: null,
      }
    }
    if (Array.isArray(time)) {
      values = {
        ...values,
        startTime: moment(time[0]).format('YYYY-MM-DD'),
        endTime: moment(time[1]).format('YYYY-MM-DD'),
      }
    }
    delete values.time
    const params = {
      ...pageParams,
      ...values,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.userfeedbackservice.listuserfeed', [params])
    if (code == 0) {
      setList(data.list)
      setTotal(data.total)
    }
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    getData({...values})
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }

  const onPage = async () => {
    getData(values)
  }
  const pagination = {
    defaultCurrent: 1,
    total: total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }

  const columns = [
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },

    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '问题描述',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      render: (text) => {
        return String(text).length >= 20 ? (
          <Tooltip placement="top" title={text}>
            {text.substring(0, 9) + '...'}
          </Tooltip>
        ) : (
          <span>{text}</span>
        )
      },
    },
    {
      title: '平台',
      dataIndex: 'appType',
      key: 'appType',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 180,
      fixed: 'right',
      render: (record, row) => {
        return (
          <span>
            <Button type="link" onClick={() => lookSee(row)}>
              查看
            </Button>
          </span>
        )
      },
    },
  ]

  const lookSee = (row) => {
    Router.push(`/user-operation/feedback/detail?id=${row.id}`)
  }
  const exportExcel = async () => {
    if (Array.isArray(values.time)) {
      values = {
        ...values,
        startTime: moment(values.time[0]).format('YYYY-MM-DD'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD'),
      }
    }
    delete values.time
    let {
      data: {code, data},
    } = await fetch('bank.api.userfeedbackservice.downloadeduserfeedback', [
      values,
    ])
    if (code == 0) {
      message.success('导出成功')
      window.open(data)
    }
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Form
        form={form}
        initialValues={{
          time: [
            moment(new Date(), 'YYYY-MM-DD'),
            moment(new Date(), 'YYYY-MM-DD'),
          ],
          appType: null,
        }}
        layout="inline"
        onFinish={onSearch}
      >
        <Form.Item label="提交时间" name="time">
          <RangePicker allowClear />
        </Form.Item>
        <Form.Item label="手机号" name="mobile">
          <Input placeholder="请输入手机号" style={{width: 200}} allowClear />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入姓名" style={{width: 200}} allowClear />
        </Form.Item>
        <Form.Item label="平台" name="appType">
          <Select placeholder="请选择平台" style={{width: 200}} allowClear>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value="android">客户经理APP安卓端</Select.Option>
            <Select.Option value="ios">客户经理APPios端</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button type="primary" style={{marginLeft: 20}} onClick={exportExcel}>
            导出
          </Button>
        </Form.Item>
      </Form>
      <Card>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          bordered
          pagination={pagination}
          scroll={{y: '100%', x: '100%'}}
        />
      </Card>
    </Layout>
  )
}

export default body
