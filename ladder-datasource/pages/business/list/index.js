import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import api from '~/utils/api'
import {
  Button,
  Table,
  Space,
  Badge,
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
import DateSelect from '~/components/common/DateSelect'

import EditModal from './edit'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getBusinessList(params)
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '业务管理'}, {text: '业务列表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.createTimeStart = moment(time[0]).format('YYYY-MM-DD')
      params.createTimeEnd = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })

    props.search(params)
  }
  return (
    <Form form={form} name="search" layout="inline" className="form">
      <Form.Item label="业务编号" name="code">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="业务名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="创建时间" name="time">
        <DateSelect />
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          查询
        </Button>
      </Form.Item>
      <Form.Item style={{position: 'absolute', right: 40}}>
        {props.newDataBtn()}
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [modalConfig, setModalConfig] = useState({
    edit: false,
  })
  const [editIndex, setEditIndex] = useState(-1)
  const [editData, setEditData] = useState(null)

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const changeStatus = (index, status) => {
    let content
    if (status === 1) {
      content = `确定后，将启用该业务的数据源服务，请确认？`
    }
    if (status === 0) {
      content = `确定后，该业务将无法调用数据源，请确认？`
    }
    let newData = {...data}
    Modal.confirm({
      content,
      onOk: async () => {
        let params = {
          id: newData.list[index].id,
          status,
        }
        const {
          data: {code},
        } = await api.upBusinessStatus(params)
        if (code == 0) {
          newData.list[index].enableStatus = params.status
          setData(newData)
          message.success('修改成功')
        }
      },
    })
  }

  const showModal = (index, type) => {
    let config = {
      ...modalConfig,
      [type]: true,
    }
    const editData = index === -1 ? null : {...data.list[index]}
    setModalConfig(config)
    setEditIndex(index)
    setEditData(editData)
  }

  const closeModal = (type, isUpdateList) => {
    let config = {
      ...modalConfig,
      [type]: false,
    }
    setModalConfig(config)

    if (isUpdateList) {
      onChangePage()
    }
  }

  const columns = [
    {title: '业务编号', dataIndex: 'code'},
    {title: '业务名称', dataIndex: 'name'},
    {
      title: '业务状态',
      dataIndex: 'enableStatus',
      render: (t) => {
        let color = 'red'
        let text = '已停用'
        if (t == 1) {
          color = 'green'
          text = '使用中'
        }
        return <Badge color={color} text={text} />
      },
    },
    {title: '创建时间', dataIndex: 'createTime'},
    {title: '创建人', dataIndex: 'createAccount'},
    {
      title: '操作',
      render: (t, r, i) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => showModal(i, 'edit')}
              className="handle_one_button"
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => changeStatus(i, r.enableStatus == 1 ? 0 : 1)}
            >
              {r.enableStatus == 1 ? '停用' : '启用'}
            </Button>
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
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        newDataBtn={() => (
          <Button type="primary" onClick={() => showModal(-1, 'edit')}>
            新增业务
          </Button>
        )}
      />

      <Table
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        scroll={{x: '100%', y: 'calc(100vh - 390px)'}}
        dataSource={data.list || []}
      />
      <EditModal show={modalConfig.edit} data={editData} close={closeModal} />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
