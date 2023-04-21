import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import {useRouter} from 'next/router'
import api from '~/utils/api'
import {
  Button,
  Table,
  Space,
  Switch,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
} from 'antd'
import Link from 'next/link'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import {SERVICE_TYPE} from '~/utils/const'

import EditModal from './edit'
import ConfigModal from './config'
import WaringModal from './waring'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getProduct(params)
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '数据源管理'}, {text: '数据产品'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let {...params} = form.getFieldsValue()
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })

    props.search(params)
  }
  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{type: null}}
      className="form"
    >
      <Form.Item label="产品类别" name="type">
        <Select style={{width: 165}}>
          <Select.Option value={null} key={-1}>
            全部
          </Select.Option>
          {props.types.map((v, i) => {
            return (
              <Select.Option value={v.code} key={i}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="数据源名称" name="companyName">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="数据产品名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          查询
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const router = useRouter()
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [modalConfig, setModalConfig] = useState({
    edit: false,
    config: false,
    waring: false,
    doc: false,
  })
  const [editIndex, setEditIndex] = useState(-1)
  const [editData, setEditData] = useState(null)

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageNo = 1
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const changeStatus = (checked, event, index) => {
    let content = `确定后，将${checked ? '开启' : '关闭'}报警通知，请确认？`
    let newData = {...data}
    Modal.confirm({
      content,
      onOk: async () => {
        let params = {
          id: newData.list[index].id,
          status: checked ? 1 : 0,
        }
        const {
          data: {code},
        } = await api.upProductWaringStatus(params)
        if (code == 0) {
          newData.list[index].enableAlarm = params.status
          setData(newData)
        }
      },
    })
  }

  const showModal = (index, type) => {
    let config = {
      ...modalConfig,
      [type]: true,
    }
    setModalConfig(config)
    setEditIndex(index)
    setEditData({...data.list[index]})
  }

  const closeModal = (type, isSuccess, isUpdateList) => {
    let config = {
      ...modalConfig,
      [type]: false,
    }
    setModalConfig(config)
    if (isUpdateList) {
      onChangePage()
    }
    if (isSuccess) {
      message.success('编辑成功')
    }
  }

  const columns = [
    {title: '产品类别', dataIndex: 'typeName'},
    {title: '数据源名称', dataIndex: 'companyName', width: 150},
    {title: '数据产品名称', dataIndex: 'name', width: 150},
    {title: '产品ID', dataIndex: 'code', width: 150},
    {title: '计费模式', dataIndex: 'billingModeName', width: 150},
    {title: '单价（元/次）', dataIndex: 'unitPrice', width: 150},
    {title: '缓存（天）', dataIndex: 'cacheDuration', width: 150},
    {
      title: '报警策略开关',
      width: 150,
      dataIndex: 'enableAlarm',
      render: (t, r, i) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onClick={(checked, event) => changeStatus(checked, event, i)}
            checked={t == 1}
          />
        )
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (t, r, i) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => showModal(i, 'edit')}
              style={{paddingLeft: 0}}
              className="handle_one_button"
            >
              编辑
            </Button>
            <Button type="link" onClick={() => showModal(i, 'waring')}>
              报警策略配置
            </Button>
            <Button type="link" onClick={() => showModal(i, 'config')}>
              查看账号配置
            </Button>
            <Link href={r.documentUrl}>
              <Button type="link">查看接口文档</Button>
            </Link>
            {router.query.type === 'edit' && (
              <Link href={`/data/product/form?id=${r.id}&name=${r.name}`}>
                <a>编辑文档</a>
              </Link>
            )}
          </Space>
        )
      },
    },
  ]

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
    onShowSizeChange,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search search={onSearch} types={props.types} />
      <Table
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        scroll={{x: 'max-content', y: 'calc(100vh - 390px)'}}
        dataSource={data.list || []}
      />
      <EditModal show={modalConfig.edit} data={editData} close={closeModal} />
      <ConfigModal
        show={modalConfig.config}
        data={editData}
        close={closeModal}
      />
      <WaringModal
        enums={props.enums}
        show={modalConfig.waring}
        data={editData}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  let types = await api.getProductType()
  let enums = await api.getPWaringEnum()
  return {data, types, enums}
}

export default body
