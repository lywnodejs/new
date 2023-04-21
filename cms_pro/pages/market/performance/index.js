import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
} from 'antd'
import TableList from './TableList'
import moment from 'moment'
import Router from 'next/router'
import fetch from '~/utils/fetch'
const breadcrumbs = [{text: '营销管理'}, {text: '绩效管理'}]
const {RangePicker} = DatePicker
const pageParams = {
  pageNum: 1,
  pageSize: 20,
}
let values = {}

function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [statusList, setStatusList] = useState([])
  const [times, setTimes] = useState('time')
  const [form] = Form.useForm()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let {time} = values
    if (time != null && time != undefined) {
      values = {
        ...values,
        queryDate: moment(time).format('YYYY-MM'),
      }
    } else if (time === undefined) {
      values = {
        ...values,
        queryDate: moment(getCurrentMonthFirst()).format('YYYY-MM'),
      }
    } else if (time === null) {
      values = {
        ...values,
        queryDate: null,
      }
    }
    delete values.time
    if (values.mobile == '') {
      values = {
        ...values,
        mobile: null,
      }
    }
    if (values.jobNumber == '') {
      values = {
        ...values,
        jobNumber: null,
      }
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.usermanagerrewardservice.getlist', [
      {
        ...pageParams,
        ...values,
      },
    ])
    if (code == 0) {
      setList(data.list)
      setTotalData(data.totalSize)
    }
  }

  const toSetting = () => {
    let url = `/market/performance/detail`
    Router.push(url)
  }

  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
  }

  const onPage = async () => {
    getData(values)
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    getData({...values})
  }

  const downLoad = async () => {
    const values = await form.validateFields()
    delete values.time
    let {
      data: {code, data},
    } = await fetch(
      'bank.api.usermanagerrewardservice.downloadmanagerrewards',
      [
        {
          ...pageParams,
          ...values,
          queryDate: moment(values.queryDate).format('YYYY-MM'),
        },
      ],
    )
    if (code == 0) {
      window.open(data)
      message.success('下载成功')
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            mobile: null,
            jobNumber: null,
            time: moment(getCurrentMonthFirst(), 'YYYY-MM'),
          }}
        >
          <Form.Item label="客户经理手机号" name="mobile">
            <Input allowClear />
          </Form.Item>

          <Form.Item label="客户经理工号" name="jobNumber">
            <Input allowClear />
          </Form.Item>

          <Form.Item label="选择时间" name="time">
            <DatePicker picker="month" allowClear />
          </Form.Item>

          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>
          <Button type="primary" style={{marginRight: 15}} onClick={downLoad}>
            下载
          </Button>
          <Button type="primary" style={{marginRight: 15}} onClick={toSetting}>
            绩效配置
          </Button>
        </Form>

        <TableList
          {...{
            list,
            totalData,
            onPage,
            pageParams,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
