import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Checkbox,
  Tree,
  List,
  Space,
} from 'antd'
import {
  CloseCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {useForm} from 'antd/lib/form/util'
import moment from 'moment'
import Router, {useRouter} from 'next/router'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '系统管理'}, {text: '角色管理'}]

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}

const fetchData = async (params = {}) => {
  return await fetch('fincloud.admin.center.facade.api.roleservice.list', [
    {...pageParams, ...params},
  ]).catch((erro) => console.log(erro))
}

const SearchForm = ({onSearch, onAdd, form}) => {
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{remember: true}}
      onFinish={onSearch}
      className="form"
    >
      <Form.Item label="" name="name" style={{width: 260}}>
        <Input
          placeholder="搜索角色名称"
          suffix={<SearchOutlined style={{color: '#BFBCC9'}} />}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        查询
      </Button>
      <div className="right">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          htmlType="button"
          onClick={onAdd}
        >
          新增
        </Button>
      </div>
    </Form>
  )
}

const TableList = ({onPage, onEdit, onDelete, list}) => {
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: '',
      render: (value, row, index) => {
        return (
          <>
            <Button
              type="link"
              className="handle_one_button"
              onClick={() => {
                onEdit(value)
              }}
            >
              编辑
            </Button>
            <span style={{color: '#EEEEEE'}}>|</span>
            <Button type="link" danger onClick={() => onDelete(row)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={list}
      columns={columns}
      scroll={{x: '100%', y: 'calc(100vh - 382px)'}}
    />
  )
}

function body({data}) {
  const [list, setList] = useState(data)
  const [form] = Form.useForm()
  const router = useRouter()

  //console.log(list, '---------------------------')
  useEffect(() => {
    form.resetFields()
    setList(data)
  }, [data])

  const fetchList = async (values) => {
    const params = values || form.getFieldsValue()
    const {
      data: {data, code},
    } = await fetchData(params)
    if (code === 0) {
      setList(data)
    }
  }

  const onSearch = (values) => {
    pageParams.pageNo = 1
    fetchList(values)
  }

  const onDelete = async (row) => {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.admin.center.facade.api.roleservice.deleteroleverification',
      [row.id],
    )

    if (code !== 0) {
      return
    }

    if (Array.isArray(data) && data.length > 0) {
      return Modal.warning({
        title: '提示',
        okText: '确定',
        content: (
          <div>
            <p style={{fontSize: 12, color: '#333'}}>
              该角色正在被以下账号使用，请修改后再进行删除
            </p>
            <List
              size="small"
              bordered
              dataSource={data}
              renderItem={(row) => <List.Item>{row.accountName}</List.Item>}
            />
          </div>
        ),
      })
    }

    Modal.confirm({
      title: '删除后不可恢复，请确认是否删除该角色？',
      icon: <CloseCircleOutlined style={{color: '#ff0000'}} />,
      onOk() {
        return new Promise((resolve, reject) => {
          fetch('fincloud.admin.center.facade.api.roleservice.deleterole', [
            row.id,
          ]).then(({data: {code}}) => {
            if (code === 0) {
              resolve()
              fetchList()
            }
            reject()
          })
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  const onPage = (pageNo, pageSize) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    fetchList()
  }

  const onAdd = () => {
    Router.push('/system/role/form')
  }

  const onEdit = (value) => {
    Router.push(`/system/role/form?id=${value.id}`)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <SearchForm {...{onSearch, onAdd, form}} />
      <TableList {...{list, onPage, onEdit, onDelete}} />
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  pageParams.pageNo = 1
  const defaultData = {
    data: [],
  }
  try {
    const {
      data: {data, code},
    } = await fetchData()

    if (code === 0) {
      return {
        data,
      }
    }

    return defaultData
  } catch (err) {
    return defaultData
  }
}

export default body
