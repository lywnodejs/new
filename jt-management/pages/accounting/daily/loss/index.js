import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import moment from 'moment'
const {RangePicker} = DatePicker

const breadcrumbs = [{text: '财务核算'}, {text: '对账管理'}, {text: '日损益表'}]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    fetchLossList()
  }, [])
  const fetchLossList = async (values = {}) => {
    try {
      const {time} = values
      if (Array.isArray(time)) {
        values = {
          ...values,
          startTime: moment(time[0]).format('YYYY-MM-DD'),
          endTime: moment(time[1]).format('YYYY-MM-DD'),
        }
      } else if (time === undefined) {
        values = {
          ...values,
          startTime: moment(getCurrentMonthFirst(), 'YYYY-MM-DD').format(
            'YYYY-MM-DD',
          ),
          endTime: moment(
            new Date(new Date().setDate(new Date().getDate())),
          ).format('YYYY-MM-DD'),
        }
      } else if (time === null) {
        values = {
          ...values,
          startTime: null,
          endTime: null,
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_loss_list({...pageParams, ...values})
      if (code == 0) {
        setTotalData(data)
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchLossList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchLossList(values)
  }

  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
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
            time: [
              moment(getCurrentMonthFirst(), 'YYYY-MM-DD'),
              moment(
                new Date(new Date().setDate(new Date().getDate())),
                'YYYY-MM-DD',
              ),
            ],
          }}
        >
          <Form.Item label="日期" name="time">
            <RangePicker />
          </Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>
          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
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
