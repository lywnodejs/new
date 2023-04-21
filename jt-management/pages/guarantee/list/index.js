import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Space,
  message,
  Table,
  Form,
  Input,
  DatePicker,
  Tabs,
  Col,
  Select,
  Button,
} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/order'
import apiProduct from '~/api/product'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '担保业务管理'}, {text: '担保管理'}]
const {RangePicker} = DatePicker
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

let values = {}
const pagination = {}

function body({checkProgressList, statusList, applyStatusList}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    getProducts()
  }, [])

  const columns = [
    {
      title: '借据号',
      dataIndex: '',
      key: '',
      fixed: 'left',
    },
    {
      title: '借款人',
      dataIndex: '',
      key: '',
    },
    {
      title: '手机号',
      dataIndex: '',
      key: '',
    },
    {
      title: '借款周期',
      dataIndex: '',
      key: '',
    },
    {
      title: '产品',
      dataIndex: '',
      key: '',
    },
    {
      title: '年利率',
      dataIndex: '',
      key: '',
    },
    {
      title: '借款金额（元）',
      dataIndex: '',
      key: '',
    },
    {
      title: '借据状态',
      dataIndex: '',
      key: '',
    },
    {
      title: '担保状态',
      dataIndex: '',
      key: '',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      fixed: 'right',
      render: () => {
        return (
          <>
            <Button type="link">下载协议</Button>
            <Button type="link">手动担保</Button>
          </>
        )
      },
    },
  ]

  const getProducts = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products({tenantId: cookies.tenantId})
      if (code == 0) {
        setProductList(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_all_order({
        ...pageParams,
        ...values,
        tenantId: cookies.tenantId,
      })
      if (code === 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  const onSelectChange = ({...value}) => {
    // console.log(value)
    // setSelectedRowKeys(value)
  }

  const rowSelection = {
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Col style={{background: '#ffffff'}}>
          <Tabs>
            <Tabs.TabPane tab="乐融贷 1" key="1"></Tabs.TabPane>
            <Tabs.TabPane tab="乐融贷 2" key="2"></Tabs.TabPane>
            <Tabs.TabPane tab="乐融贷 3" key="3"></Tabs.TabPane>
          </Tabs>
          <Form
            layout="inline"
            style={{paddingLeft: '20px'}}
            initialValues={{
              productId: '',
              checkProgress: '',
              status: '',
            }}
          >
            <Form.Item label="借据状态" name="status">
              <Select style={{width: '130px'}}>
                <Select.Option value="">全部</Select.Option>
                {applyStatusList.map((v, i) => (
                  <Select.Option key={i} value={v.code}>
                    {v.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="借据号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="借款人" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="手机号" name="realName">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="担保状态" name="status">
              <Select style={{width: '130px'}}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="1">未担保</Select.Option>
                <Select.Option value="2">已担保</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="放款日" name="time">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="reset">
                重置
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary">批量担保</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary">批量下载</Button>
            </Form.Item>
          </Form>
        </Col>
      </Space>

      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Table
          rowKey="orderNum"
          rowSelection={rowSelection}
          // dataSource={list.list}
          dataSource={[1, 2, 3]}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{x: 'max-content'}}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    checkProgressList: [],
    statusList: [],
    applyStatusList: [],
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: statusList, code: statusCode},
      },
      {
        data: {data: applyStatusList, code: applyStatusCode},
      },
    ] = await Promise.all([
      api.get_data_dict('LOAN_CHECK_PROGRESS'),
      api.get_data_dict('LOAN_ORDER_STATUS'),
      api.get_data_dict('LOAN_APPLY_STATUS'),
    ])

    if (code == 0) {
      return {
        checkProgressList: data,
        statusList: statusCode === 0 ? statusList : [],
        applyStatusList: applyStatusCode === 0 ? applyStatusList : [],
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default withKeepAlive(body, 'guarantee-list')
