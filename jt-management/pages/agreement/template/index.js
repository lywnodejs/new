import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import apiAgreement from '~/api/agreement'
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  Modal,
  message,
  Select,
  Badge,
  Card,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiAgreement.getTemplateList(params)
    if (code == 0) {
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '协议管理'}, {text: '协议模板'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }

  const resetForm = () => {
    form.resetFields()
    onSearch()
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        name="search"
        initialValues={{status: null}}
        layout="inline"
      >
        <Form.Item label="模板名称" name="name">
          <Input placeholder="模板名称" style={{width: 250}} />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select style={{width: 100}}>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value={'1'}>启用</Select.Option>
            <Select.Option value={'0'}>停用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={resetForm}>
            重置
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={props.goToEdit}>
            新增
          </Button>
        </Form.Item>
      </Form>
    </Card>
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
  }

  const updateList = async (params) => {
    let data = await getData({...params})
    setData(data)
  }

  const changeStatus = (i) => {
    const item = data.list[i]
    let params = {
      id: item.id,
      status: item.status == 1 ? 0 : 1,
      // update: 'test'
    }
    Modal.confirm({
      content: `确定将此模板${item.status == 1 ? '停用' : '启用'}吗？`,
      onOk: async () => {
        apiAgreement.changeTempStatus(params).then((res) => {
          if (res.data.code == 0) {
            let temp = {...data}
            temp.list[i].status = params.status
            setData(temp)
          }
        })
      },
    })
  }

  const preview = (id) => {
    apiAgreement.previewTemplate({id}).then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        window.open(res.data.data)
      }
    })
  }
  const columns = [
    {
      title: '序号',
      render: (v, r, i) =>
        (pageParams.pageNo - 1) * pageParams.pageSize + i + 1,
    },
    {title: '模板名称', dataIndex: 'name'},
    {
      title: '状态',
      dataIndex: 'status',
      render: (v, r, i) => {
        const text = v == 1 ? '启用' : '停用'
        const color = v == 1 ? 'green' : 'red'
        return <Badge color={color} text={text} />
      },
    },
    {title: '更新人', dataIndex: 'updateBy'},
    {title: '更新日期', dataIndex: 'updateTime'},
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => goToEdit(i)}>
              编辑
            </Button>
            <Button type="link" onClick={() => preview(r.id)}>
              预览
            </Button>
            <Button type="link" onClick={() => changeStatus(i)}>
              {r.status == 1 ? '停用' : '启用'}
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const goToEdit = (i) => {
    let url = '/agreement/template/detail'
    url = i === -1 ? url : `${url}?id=${data.list[i].id}`
    Router.push(url)
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
      <Search search={onSearch} goToEdit={() => goToEdit(-1)} />

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

body.getInitialProps = async (ctx) => {
  let data = await getData()
  return {data}
}

export default body
