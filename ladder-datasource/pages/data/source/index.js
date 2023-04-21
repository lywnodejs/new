import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
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
import Router from 'next/router'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import {SERVICE_TYPE} from '~/utils/const'

import EditModal from './edit'
import ConfigModal from './config'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getDataSource(params)
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '数据源管理'}, {text: '数据源'}]

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
      initialValues={{status: ''}}
      className="form"
    >
      <Form.Item label="数据源名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="服务状态" name="status">
        <Select style={{width: 120}}>
          {SERVICE_TYPE.map((v, i) => {
            return (
              <Select.Option value={v.value} key={i}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
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
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [modalConfig, setModalConfig] = useState({edit: false, config: false})
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
    let content = `确定后，将${checked ? '启用' : '关闭'}该数据源服务，请确认？`
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
        } = await api.changeDSStatus(params)
        if (code == 0) {
          newData.list[index].status = params.status
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
    {title: '数据源名称', dataIndex: 'companyName'},
    {title: '数据源联系人', dataIndex: 'contactName'},
    {title: '数据源联系方式', dataIndex: 'contactMobile'},
    {title: '我方对接人', dataIndex: 'bdName'},
    {
      title: '服务状态',
      dataIndex: 'status',
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
            <Button type="link" onClick={() => showModal(i, 'config')}>
              账号配置
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
    onShowSizeChange,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search search={onSearch} />
      <Table
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        scroll={{x: '100%', y: 'calc(100vh - 390px)'}}
        dataSource={data.list || []}
      />
      <EditModal show={modalConfig.edit} data={editData} close={closeModal} />
      <ConfigModal
        show={modalConfig.config}
        data={editData}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
