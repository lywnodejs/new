import React, {useEffect, useState, useContext} from 'react'
import {
  Table,
  Button,
  Card,
  Form,
  DatePicker,
  Input,
  Select,
  Modal,
  message,
  InputNumber,
} from 'antd'
import Router from 'next/router'
import {InfoCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import apiAccounting from '~/api/accounting'

const TableList = ({
  list,
  onPage,
  pageParams,
  totalData,
  fetchRecordList,
  accountList,
}) => {
  const [form] = Form.useForm()
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [visible, setVisible] = useState(false)
  const [returnData, setReturnData] = useState([])
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [timeDate, setTimeDate] = useState([])

  const columns = [
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 150,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 150,
      render: (text, record) => {
        return record.endDate == null ? '-' : record.endDate
      },
    },

    {
      title: '总占用金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '剩余占用金额（元）',
      dataIndex: 'surplusAmount',
      key: 'surplusAmount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '利率（年）',
      dataIndex: 'rate',
      key: 'rate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record).toFixed(3)
        str += '%'
        return str
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text) => {
        switch (text) {
          case 1:
            return '占用中'
          case 2:
            return '已结束'
        }
      },
    },
    {
      title: '成本（元）',
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record) => {
        return <a onClick={() => findDetail(record)}>查看明细</a>
      },
    },
  ]

  const findDetail = (record) => {
    let url = `/accounting/cost/capital/detail?pageSize=10&pageNum=1&moneyCostId=${record.id}`
    Router.push(url)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData.total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }
  const addClick = () => {
    setVisible(true)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const nextStep = async () => {
    const values = await form.validateFields()
    setReturnData(values)
    setConfirmVisible(true)
    setTimeDate(moment(values.time).format('YYYY-MM-DD'))
  }
  const submitClick = async () => {
    let postData = {
      happenDate: timeDate,
      amount: returnData.amount,
      rate: returnData.rate,
      accountType: returnData.payChannelName,
      account: channelId(returnData.payChannelName),
    }
    try {
      const {
        data: {data, code},
      } = await apiAccounting.fetch_record_add(postData)
      if (code == 0) {
        message.success('提交成功')
        setConfirmVisible(false)
        setVisible(false)
        fetchRecordList()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const channelId = (payChannelName) => {
    let findOne = accountList.find((one) => one.description == payChannelName)
    return findOne ? findOne.code : ''
  }

  const closeVisible = () => {
    setConfirmVisible(false)
  }
  return (
    <Card style={{position: 'relative'}}>
      当前占用总计：<span>{totalData.remark}</span>
      <Button
        type="primary"
        style={{position: 'absolute', top: 25, right: 23}}
        onClick={addClick}
      >
        新增
      </Button>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
      <Modal
        title="新增资金成本"
        visible={visible}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button type="primary" onClick={nextStep}>
            下一步
          </Button>,
        ]}
        onCancel={() => setVisible(false)}
      >
        <Form
          name={form}
          form={form}
          style={{marginLeft: 50}}
          initialValues={{
            happenDate: '',
          }}
        >
          <Form.Item
            label="开始日期"
            name="time"
            rules={[{required: true, message: '请选择开始日期'}]}
          >
            <DatePicker allowClear style={{width: 200}} />
          </Form.Item>
          <Form.Item
            label="金额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            name="amount"
            rules={[
              {required: true, message: '请输入金额'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                  if (value && !reg.test(value)) {
                    return Promise.reject(
                      '请输入大于等于0的数，最多输入12位数，并且最多保留2位小数',
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <InputNumber style={{width: 200}} max={999999999999} />
          </Form.Item>
          <Form.Item
            label="年利率&nbsp;&nbsp;&nbsp;"
            name="rate"
            rules={[
              {required: true, message: '请输入年利率'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  var reg = /^(\-)?\d+(\.\d{0,6})?$/
                  if (value && !reg.test(value)) {
                    return Promise.reject('请输入数字，并且最多保留6位小数')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input suffix="%" style={{width: 200}} />
          </Form.Item>
          <Form.Item
            label="行方账户"
            name="payChannelName"
            rules={[{required: true, message: '请选择行方账户'}]}
          >
            <Select style={{width: 200}}>
              {accountList.map((v, i) => (
                <Select.Option key={i} value={v.description}>
                  {v.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="操作确认"
        visible={confirmVisible}
        footer={[
          <Button key="back" onClick={closeVisible}>
            返回修改
          </Button>,
          <Button key="submit" type="primary" onClick={submitClick}>
            确认提交
          </Button>,
        ]}
        onCancel={() => setConfirmVisible(false)}
      >
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#d1e9ff',
            color: '#3da2ff',
            height: 30,
            margin: '0 auto',
            paddingTop: 5,
          }}
        >
          <InfoCircleOutlined style={{paddingRight: 5}} />
          请确认信息是否正确
        </div>
        <div style={{marginLeft: 40, marginTop: 20}}>
          <p>开始日期：{timeDate}</p>
          <p>金额：{returnData.amount}</p>
          <p>年利率：{returnData.rate}%</p>
          <p>
            行方账户：
            {returnData.payChannelName}
          </p>
        </div>
      </Modal>
    </Card>
  )
}

export default TableList
