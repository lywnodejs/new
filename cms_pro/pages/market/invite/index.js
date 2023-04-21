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
    'bank.api.userinvitationv2service.userinvitationlistpagequery',
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

const breadcrumbs = [{text: '营销管理'}, {text: '邀请管理'}, {text: '邀请列表'}]

const Search = (props) => {
  const [form] = Form.useForm()

  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.time = moment(time).format('YYYY-MM')
    }
    props.search(params)
  }

  const onConfig = () => {
    Router.push('/market/invite/config')
  }

  return (
    <Form
      form={form}
      name="search"
      initialValues={{
        status: null,
        time: moment(),
        invitationFromType: 0,
      }}
      layout="inline"
    >
      <Form.Item label="邀请人" name="invitationFrom">
        <Input placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item label="选择时间" name="time">
        <DatePicker picker="month" allowClear={false} />
      </Form.Item>

      <Form.Item label="发放状态" name="status">
        <Select style={{width: 120}}>
          <Select.Option value={null}>全部</Select.Option>
          <Select.Option value={0}>未发放</Select.Option>
          <Select.Option value={1}>已发放</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="用户类型" name="invitationFromType">
        <Select style={{width: 120}}>
          <Select.Option value={0}>客户经理</Select.Option>
          <Select.Option value={1}>普通用户</Select.Option>
        </Select>
      </Form.Item>

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

      <Form.Item>
        <Button type="primary" onClick={onConfig}>
          页面配置
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
    {
      name: '首次获额有效人数（一级）',
      type: 1,
      width: 150,
      fieldName: 'creditGrantingCount',
    },
    {
      name: '首次放款有效人数（一级）',
      type: 1,
      width: 150,
      fieldName: 'loanSuccessCount',
    },
    {
      name: '当月实收利息（一级）',
      type: 1,
      width: 150,
      fieldName: 'interestIncomeAmount',
    },
    {
      name: '首次获额有效人数（二级）',
      type: 2,
      width: 150,
      fieldName: 'creditGrantingCount',
    },
    {
      name: '首次放款有效人数（二级）',
      type: 2,
      width: 150,
      fieldName: 'loanSuccessCount',
    },
    {
      name: '当月实收利息(二级)',
      type: 2,
      width: 150,
      fieldName: 'interestIncomeAmount',
    },
  ]

  const columns = [
    {
      title: '邀请人',
      dataIndex: 'invitationFrom',
      width: 150,
      render: (t) => {
        return <a href={`/market/invite/detail?phone=${t}`}>{t}</a>
      },
    },
    {title: '姓名', width: 150, dataIndex: 'invitationFromUserName'},
    {title: '用户类型', width: 150, dataIndex: 'invitationFromType'},
    {title: '注册人数（一级）', width: 150, dataIndex: 'levelOneRegisterCount'},
    {title: '注册人数（二级）', width: 150, dataIndex: 'levelTwoRegisterCount'},
    {title: '一级奖励金额', width: 150, dataIndex: 'levelOneRewardAmount'},
    {title: '二级奖励金额', width: 150, dataIndex: 'levelTwoRewardAmount'},
    {title: '奖励总金额', width: 150, dataIndex: 'totalRewardAmount'},
    {
      title: '发放状态',
      width: 150,
      dataIndex: 'status',
      render: (t) => {
        if (t == 1) {
          return '已发放'
        }
        if (t == 0) {
          return '未发放'
        }
        return '-'
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      fixed: 'right',
      render: (t, r) => {
        return r.status == 0 ? (
          <Button type="link" onClick={() => onSend(r)}>
            发放
          </Button>
        ) : null
      },
    },
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
              let values =
                column.type == 1
                  ? r.levelOneProductInfoList
                  : r.levelTwoProductInfoList
              let item = values.find(
                (value) => value.productId == product.productId,
              )
              return item && item[column.fieldName]
            },
          })
        })
      })

      result.unshift(3, 0)
      Array.prototype.splice.apply(newColumns, result)
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

  const onSend = (r) => {
    Modal.confirm({
      content: '确认发放吗？发放后状态不可修改。',
      async onOk() {
        // invitationFromId
        let params = {
          userId: r.invitationFromId,
          time: searchParams.time,
        }
        let {
          data: {code},
        } = await fetch('bank.api.userinvitationv2service.paymentreward', [
          params,
        ])
        if (code == 0) {
          message.success('发放成功')
          onChangePage()
        }
      },
    })
  }

  const downloadData = async () => {
    const params = {...searchParams, ...pageParams}

    let {
      data: {code, data},
    } = await fetch(
      'bank.api.userinvitationv2service.downloaduserinvitationlist',
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
        <Search search={onSearch} download={downloadData} />
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

body.getInitialProps = async () => {
  let searchParams = {
    time: moment().format('YYYY-MM'),
    invitationFromType: 0,
  }
  let params = {
    ...initPageParams,
    ...searchParams,
  }
  let data = await getData(params)
  return {data, searchParams}
  return {}
}

export default body
