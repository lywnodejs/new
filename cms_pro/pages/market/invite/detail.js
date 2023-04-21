import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useRef} from 'react'
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
  Select,
  Card,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'

const initPageParams = {
  pageNo: 1,
  pageSize: 20,
}
const getData = async (params) => {
  let {
    data: {code, data},
  } = await fetch(
    'bank.api.userinvitationv2service.userinvitationdetailpagequery',
    [params],
  )
  if (code == 0) {
    if (Array.isArray(data.list)) {
      data.list = data.list.map((v, i) => {
        return {
          ...v,
          key: params.pageNo * params.pageSize + i,
        }
      })
    }
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '营销管理'}, {text: '邀请管理'}, {text: '邀请明细'}]

const Search = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.mobilePhone) {
      form.setFieldsValue({
        mobilePhone: props.mobilePhone,
      })
    }
  }, [props.mobilePhone])
  const onSearch = () => {
    let {...params} = form.getFieldsValue()
    props.search(params)
  }

  return (
    <Form
      form={form}
      name="search"
      initialValues={{
        mobilePhone: '',
        level: 1,
        // time: moment(),
      }}
      layout="inline"
    >
      <Form.Item label="邀请人" name="mobilePhone">
        <Input placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item label="好友级别" name="level">
        <Select style={{width: 120}}>
          <Select.Option value={1}>一级好友</Select.Option>
          <Select.Option value={2}>二级好友</Select.Option>
        </Select>
      </Form.Item>

      {/* <Form.Item label="选择时间" name="time">
        <DatePicker picker="month" allowClear={false} />
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" onClick={onSearch}>
          查询
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={props.download}>
          下载
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState(props.searchParams)
  const [pageParams, setPageParams] = useState({...initPageParams})
  const [showColumns, setShowColumns] = useState([])

  const dynamicColumns = [
    {name: '首次授信金额', width: 150, fieldName: 'firstCreditGrantingAmount'},
    {
      name: '首次授信时间',
      width: 150,
      fieldName: 'firstCreditGrantingDateTime',
    },
    {name: '首次放款金额', width: 150, fieldName: 'firstLoanPassAmount'},
    {name: '首次放款时间', width: 150, fieldName: 'firstLoanPassDateTime'},
    // {name: '当月实收利息', width: 150, fieldName: 'currentMonthlyInterestAmount'},
  ]

  const columns = [
    {
      title: '好友级别',
      dataIndex: 'level',
      width: 150,
      fixed: 'left',
      render: (t) => {
        return `${t == 1 ? '一级好友' : '二级好友'}`
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      width: 150,
      render: (t) => {
        return <a href={`/market/invite/detail?phone=${t}`}>{t}</a>
      },
    },
    {title: '姓名', width: 150, dataIndex: 'userName'},
    {title: '注册时间', width: 150, dataIndex: 'registerDateTime'},
  ].map((v) => {
    v.align = 'center'
    return v
  })

  useEffect(() => {
    changeColumn(props.data)
  }, [])

  const changeColumn = (data) => {
    if (Array.isArray(data.products)) {
      let result = []
      let newColumns = [...columns]
      dynamicColumns.forEach((column) => {
        data.products.forEach((product) => {
          result.push({
            ...column,
            title: product.name + column.name,
            render: (t, r) => {
              let values = r.productInfos
              let item = values.find(
                (value) => value.productId == product.productId,
              )
              return item && item[column.fieldName]
            },
          })
        })
      })

      // result.unshift(2, 0);
      // Array.prototype.splice.apply(newColumns, result);
      newColumns = [...newColumns, ...result]
      setShowColumns(newColumns)
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
    scrollTop()
  }

  const updateList = async (params) => {
    let data = await getData(params)
    changeColumn(data)
    setData(data)
  }

  const downloadData = async () => {
    const params = {...searchParams, ...pageParams}

    let {
      data: {code, data},
    } = await fetch(
      'bank.api.userinvitationv2service.downloaduserinvitationdetail',
      [params],
    )
    if (code == 0) {
      location.href = data
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
      <Card style={{marginBottom: 30}}>
        <Search
          search={onSearch}
          mobilePhone={searchParams.mobilePhone}
          download={downloadData}
        />
      </Card>

      <Table
        bordered
        rowKey="key"
        pagination={paginationConfig}
        columns={showColumns}
        scroll={{x: '100%'}}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async ({ctx}) => {
  let mobilePhone = ctx.query.phone
  console.log(mobilePhone)
  let searchParams = {
    level: 1,
    mobilePhone,
    // time: moment().format('YYYY-MM'),
  }
  let params = {
    ...initPageParams,
    ...searchParams,
  }
  let data = {}
  if (mobilePhone) {
    data = await getData(params)
  }
  return {data, searchParams}
}

export default body
