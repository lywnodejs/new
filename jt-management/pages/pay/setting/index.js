import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiPay from '~/api/pay'
import apiProduct from '~/api/product'
import apiAccount from '~/api/accounting'
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  Modal,
  message,
  Select,
  Card,
  Badge,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'
import EditModal from './edit'
import api from '~/api/collection'
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiPay.getPayChannelConfig(params)
    if (code == 0) {
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '支付管理'}, {text: '支付配置'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        name="search"
        initialValues={{
          productType: null,
          payChannelCode: null,
          payChannelType: null,
          relaStatus: null,
        }}
        layout="inline"
      >
        <Form.Item label="产品名称" name="productType">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value={0}>二类户</Select.Option>
            {props.products.map((v, i) => {
              return (
                <Select.Option value={v.productId} key={v.id}>
                  {v.productName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="支付通道" name="payChannelCode">
          <Select style={{width: 180}}>
            <Select.Option value={null}>全部</Select.Option>
            {props.channels.map((v, i) => {
              return (
                <Select.Option value={v.code} key={v.code}>
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="支付类型" name="payChannelType">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value="in">收款</Select.Option>
            <Select.Option value="out">放款</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="启用状态" name="relaStatus">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value={'1'}>启用</Select.Option>
            <Select.Option value={'0'}>禁用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={props.showAddModal}>
            新增配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [showModal, setModal] = useState(false)
  const [showModalData, setModalData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [products, setProducts] = useState([])
  const [channels, setChannels] = useState([])
  const [cookies] = useCookies(['name'])

  useEffect(() => {
    // getDict('FUND_PAY_PRODUCT_CODE', setProducts)
    fetchProductList()
    getDict('FUND_PAY_CHANNEL_MODE_CODE', setChannels)
    getData()
  }, [])
  // 获取字典列表
  const getDict = async (type, func) => {
    try {
      const {data} = await apiAccount.get_data_dict(type)
      if (data.code == 0) {
        func(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getLoanAfterConfig()
      if (code == 0) {
        setProducts(data)
        // data && data.length && setActiveKey(String(data[0].id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData({...params})
    setData(data)
  }

  const deleteItem = (i) => {
    Modal.confirm({
      content: '确定删除该项数据？',
      onOk: async () => {
        let newData = [...data.list]

        const {
          data: {code},
        } = await apiBusiness.deleteBranch(newData[i].id)
        if (code == 0) {
          newData.splice(i, 1)
          setData({...data, list: newData})
          message.success('删除成功')
        }
      },
    })
  }

  const onSwitchStatus = async (record, i) => {
    let params = {
      ...record,
      relaStatus: record.relaStatus == 1 ? 0 : 1,
    }
    Modal.confirm({
      content: `确定${record.relaStatus == 1 ? '停用' : '启用'}此配置？`,
      onOk: async () => {
        apiPay.editPayChannelConfig(params).then((res) => {
          if (res.data.code == 0) {
            message.success('修改成功')
            let newData = [...data.list]
            newData[i].relaStatus = params.relaStatus
            setData({...data, list: newData})
          }
        })
      },
    })
  }

  const getByDict = (val, list) => {
    const item = list.find((v) => v.code == val)
    return (item && item.description) || ''
  }
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productType',
      render: (t) => {
        if (t == 0) {
          return <span>二类户</span>
        }
        const item = products.find((v) => v.productId == t)
        return (item && item.productName) || ''
      },
    },
    {
      title: '支付通道',
      dataIndex: 'payChannelCode',
      render: (t) => {
        return getByDict(t, channels)
      },
    },
    {
      title: '支付类型',
      dataIndex: 'payChannelType',
      render: (t) => {
        if (t == 'in') {
          return '收款'
        } else if (t == 'out') {
          return '放款'
        } else {
          return ''
        }
      },
    },
    {title: '路由比例', dataIndex: 'channelWeight'},
    {
      title: '启用状态',
      dataIndex: 'relaStatus',
      render: (v, r, i) => {
        const text = v == 1 ? '启用' : '停用'
        const color = v == 1 ? 'green' : 'red'
        return <Badge color={color} text={text} />
      },
    },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => showAddModal(i)}>
              编辑
            </Button>
            {/*<Button type="link" danger onClick={() => deleteItem(i)}>*/}
            {/*  删除*/}
            {/*</Button>*/}
            <Button type="link" onClick={() => onSwitchStatus(r, i)}>
              {r.relaStatus == 1 ? '停用' : '启用'}
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const showAddModal = (i) => {
    let editData = null
    if (i > -1) {
      editData = data.list[i]
    }
    setModalData(editData)
    setModal(true)
  }

  const closeModal = (isSuccess, isUpdateList) => {
    setModal(false)
    if (isUpdateList) {
      onChangePage()
    }
    if (isSuccess) {
      message.success('编辑成功')
    }
  }

  const paginationConfig = {
    total: data.total,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        products={products}
        channels={channels}
        showAddModal={() => showAddModal(-1)}
      />

      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />

      <EditModal
        show={showModal}
        data={showModalData}
        products={products}
        channels={channels}
        departments={[]}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  pageParams.pageNo = 1
  let data = await getData()
  return {data}
}

export default body
