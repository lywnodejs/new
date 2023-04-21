import {Layout} from '~/components/Layout'
import React, {useState, useEffect} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, Form, Input, Select, Modal, message} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'
import {scrollTop} from '~/utils'
import api from '~/utils/api'
import _ from 'lodash'

const pageParams = {
  pageNo: 1,
  pageSize: 20,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getWhiteBlackList(params)
  if (code == 0) {
    return data
  }
  return {list: []}
}

const getProList = async () => {
  let {
    data: {code, data},
  } = await api.getPro4userList()
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '用户运营'}, {text: '白名单列表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }

  return (
    <Form
      form={form}
      name="search"
      style={{marginBottom: 30}}
      layout="inline"
      initialValues={{
        crowdName: '',
        productId: null,
        crowdType: 0,
      }}
    >
      <Form.Item label="人群名称" name="crowdName">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="产品名称" name="productId">
        <Select style={{width: 120}}>
          <Select.Option value={null}>全部</Select.Option>
          {props.proList.map((v, i) => {
            return (
              <Select.Option value={v.id} key={i}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="白名单类型" name="crowdType">
        <Select style={{width: 120}}>
          <Select.Option value={0}>全部</Select.Option>
          <Select.Option value={1}>风控白名单</Select.Option>
          <Select.Option value={2}>机审白名单</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={() => props.jump2export()}>
          名单导入
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})

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

  const jump2export = (id) => {
    let url = '/user-operation/whitelist/export'
    if (id) {
      url += '?id=' + id
    }
    Router.push(url)
  }

  const onDelete = async (r, i) => {
    Modal.confirm({
      content: '删除后不可恢复，请确认是否删除该名单？',
      onOk() {
        api.deleteWhiteBlackItem(r.id).then(({data: {code}}) => {
          if (code == 0) {
            message.success('删除成功')
            let n_data = _.cloneDeep(data)
            n_data.list.splice(i, 1)
            setData(n_data)
          }
        })
      },
    })
  }

  const columns = [
    {title: '导入时间', dataIndex: 'updateTime'},
    {title: '人群名称', dataIndex: 'crowdName'},
    {title: '人群计数', dataIndex: 'peopleCount'},
    {title: '产品名称', dataIndex: 'productName'},
    {
      title: '白名单类型',
      dataIndex: 'crowdType',
      render: (t) => {
        if (t == 1) {
          return '风控白名单'
        }
        if (t == 2) {
          return '机审白名单'
        }

        return ''
      },
    },
    {title: '操作人', dataIndex: 'operatorName'},
    {title: '操作时间', dataIndex: 'updateTime'},
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => downloadData(r.downloadUrl)}>
              下载名单
            </Button>

            <Button type="link" onClick={() => jump2export(r.id)}>
              编辑
            </Button>

            <Button type="link" danger onClick={() => onDelete(r, i)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const downloadData = (url) => {
    if (url) {
      window.open(url)
      // location.href = url
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
      <Search
        search={onSearch}
        proList={props.proList}
        jump2export={jump2export}
      />

      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData({...pageParams, crowdType: 0})
  let proList = await getProList()
  return {data, proList}
}

export default body
