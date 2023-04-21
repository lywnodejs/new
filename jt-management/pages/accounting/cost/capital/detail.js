import {Layout} from '~/components/Layout'
import {
  Button,
  Card,
  Table,
  Form,
  Modal,
  DatePicker,
  Select,
  InputNumber,
} from 'antd'
import React, {useEffect, useRef, useState, useContext} from 'react'
import apiAccounting from '~/api/accounting'
import Router, {withRouter} from 'next/router'
import {InfoCircleOutlined} from '@ant-design/icons'
import moment from 'moment'

const breadcrumbs = [
  {text: '账务管理'},
  {text: '成本明细'},
  {text: '资金成本明细'},
]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
function body(props) {
  const [itemList, setItemList] = useState([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [timeDate, setTimeDate] = useState([])
  const [returnData, setReturnData] = useState([])
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [accountList, setAccountList] = useState([])

  const columns = [
    {
      title: '发生日期',
      dataIndex: 'happenDate',
      key: 'happenDate',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'operType',
      key: 'operType',
      width: 150,
      render: (text) => {
        switch (text) {
          case 1:
            return '开始占用'
          case 2:
            return '解除占用'
        }
      },
    },

    {
      title: '发生金额（元）',
      dataIndex: 'amount',
      key: 'amount',
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
      title: '发生账户',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            <p>
              {row.accountType}&nbsp;&nbsp;{row.account}
            </p>
          </div>
        )
      },
    },
    {
      title: '操作人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      width: 150,
      render: (record, row) => {
        return (
          <span>
            <p>{row.updateBy}</p>
            <p>{row.updateTime}</p>
          </span>
        )
      },
    },
  ]
  useEffect(() => {
    async function fetchData() {
      recordDetail()
      fetchAccount()
    }
    fetchData()
  }, [])
  const recordDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.fetch_record_detail({
        ...pageParams,
        moneyCostId:
          Number(props.router.query.moneyCostId) || Number(props.moneyCostId),
      })
      if (code == 0) {
        setItemList(data.list)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const fetchAccount = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('FUND_PAY_CHANNEL_MERCHANT_CODE')
      if (code == 0) {
        setAccountList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const channelId = (payChannelName) => {
    let findOne = accountList.find((one) => one.description == payChannelName)
    return findOne ? findOne.code : ''
  }
  const release = () => {
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

  const submit = async () => {
    let postData = {
      happenDate: timeDate,
      amount: returnData.amount,
      accountType: channelId(returnData.payChannelName),
      account: returnData.payChannelName,
      moneyCostId: props.router.query.moneyCostId,
    }
    try {
      const {
        data: {data, code},
      } = await apiAccounting.fetch_relieve_delete(postData)
      if (code == 0) {
        setConfirmVisible(false)
        setVisible(false)
        recordDetail()
        message.success('解除成功')
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      <Card style={{position: 'relative'}}>
        剩余占用金额：
        <Button
          type="primary"
          style={{position: 'absolute', top: 25, right: 23}}
          onClick={release}
        >
          解除占用
        </Button>
        <Table
          style={{marginTop: 20}}
          columns={columns}
          dataSource={itemList}
        />
        <Modal
          title="解除资金占用"
          visible={visible}
          footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={nextStep}>
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
              label="解除日期"
              name="time"
              rules={[{required: true, message: '请选择开始日期'}]}
            >
              <DatePicker allowClear style={{width: 200}} />
            </Form.Item>
            <Form.Item
              label="金额"
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
              <InputNumber
                style={{width: 200, marginLeft: 30}}
                max={999999999999}
              />
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
            <Button key="back" onClick={() => setConfirmVisible(false)}>
              返回修改
            </Button>,
            <Button key="submit" type="primary" onClick={submit}>
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
            <p>解除日期：{timeDate}</p>
            <p>金额：{returnData.amount} 元</p>
            <p>
              行方账户：
              {returnData.payChannelName}
            </p>
          </div>
        </Modal>
      </Card>
    </Layout>
  )
}
body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
