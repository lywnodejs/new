import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import React, {PureComponent} from 'react'
import fetch from '~/utils/fetch'

import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  InputNumber,
  List,
  Radio,
  Space,
  message,
} from 'antd'
import {CloseCircleOutlined} from '@ant-design/icons'

import moment from 'moment'
import css from './index.less'

const breadcrumbs = [{text: '账号管理'}]

const status = [
  {
    name: '全部',
    value: -1,
  },
  {
    name: '有效',
    value: 1,
  },
  {
    name: '无效',
    value: 0,
  },
]

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}

const fetchData = async (params = {...pageParams, enableStatus: 1}) => {
  return await fetch('bank.api.accountservice.queryaccountlist', [params])
}

const SearchForm = ({t, onAdd, onSearch}) => {
  return (
    <Form layout="inline" onFinish={onSearch} initialValues={{enableStatus: 1}}>
      <Form.Item label="登录账号" name="name">
        <Input placeholder="模糊搜索" />
      </Form.Item>

      <Form.Item label="角色名称" name="roleName">
        <Input placeholder="模糊搜索" />
      </Form.Item>

      <Form.Item style={{width: 150}} name="enableStatus" label="账号状态">
        <Select>
          {status.map((v, i) => (
            <Select.Option key={i} value={v.value}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{marginRight: 15}}>
        搜索
      </Button>

      <Button type="primary" htmlType="button" onClick={onAdd}>
        新增
      </Button>
    </Form>
  )
}

const AccountModal = ({
  index,
  list,
  visible,
  setVisible,
  roles,
  onAccuntFinish,
}) => {
  const prevVisibleRef = useRef()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const initialValues =
    index > -1 && Array.isArray(list.list) && list.list.lenght > index
      ? list.list[index]
      : {roleId: roles[0].id}

  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])

  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }

    if (visible) {
      index > -1 ? form.setFieldsValue(list.list[index]) : form.resetFields()
    }
  }, [visible])

  const onFinish = async (values) => {
    setLoading(true)
    if (index > -1) {
      values['id'] = list.list[index].id
    }
    const {
      data: {data, code},
    } = await fetch('bank.api.accountmanageservice.createaccountrole', [values])

    setLoading(false)

    if (code === 0) {
      setVisible(false)
      onAccuntFinish()

      if (index < 0) {
        Modal.info({
          title: '提示',
          content: (
            <div>
              <p>账号创建成功！</p>
              <p>初始密码：123456</p>
            </div>
          ),
        })
      }
    }
  }

  return (
    <Modal
      title={index > -1 ? '编辑账号' : '新增账号'}
      confirmLoading={true}
      destroyOnClose
      forceRender
      visible={visible}
      destroyOnClose
      forceRender
      confirmLoading={loading}
      okText="提交"
      cancelText="取消"
      onCancel={() => {
        setVisible(false)
        setLoading(false)
      }}
      onOk={() => {
        form.submit()
      }}
    >
      <Form
        key={Date.now}
        form={form}
        name={index + ''}
        {...{
          labelCol: {span: 6},
          wrapperCol: {span: 16},
        }}
        initialValues={{enableStatus: 1, ...initialValues}}
        onFinish={onFinish}
      >
        <Form.Item
          label="登录手机号"
          name="mobile"
          rules={[{required: true, message: '请输入登录账号!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="员工姓名"
          name="name"
          rules={[{required: true, message: '请输入员工姓名!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="角色名称"
          name="roleId"
          rules={[{required: true, message: '请选择角色名称!'}]}
        >
          <Select>
            {roles.map((v, i) => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="账号状态"
          name="enableStatus"
          rules={[{required: true, message: '请选择状态!'}]}
        >
          <Radio.Group>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>无效</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const TableList = ({t, list, onEdit, onReset, onDelete, onPage}) => {
  const columns = [
    {
      title: '登录账号',
      dataIndex: 'mobile',
    },
    {
      title: '员工姓名',
      dataIndex: 'name',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '账号状态',
      dataIndex: 'enableStatus',
      render: (value) => (value === 1 ? '有效' : '无效'),
    },
    {
      title: '最后操作人',
      dataIndex: 'updateName',
    },
    {
      title: '最后操作时间',
      dataIndex: 'updateTime',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: '',
      render: (value, row, index) => {
        return (
          <React.Fragment>
            <Button type="link" onClick={() => onEdit(index)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onReset(index)}>
              重置
            </Button>
            <Button type="link" danger onClick={() => onDelete(row.id)}>
              删除
            </Button>
          </React.Fragment>
        )
      },
    },
  ]

  const pagination = {
    defaultCurrent: 1,
    total: list.pageRet.totalCount,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: false,
    current: list.pageRet.pageNo,
    showTotal: (total) => `共 ${total} 条`,
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage(pageNumber)
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{x: '100%', y: 'calc(100vh - 350px)'}}
    />
  )
}

const ResetModal = ({
  list: {list},
  index,
  t,
  setResetVisible,
  resetVisible,
  onAccuntFinish,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // console.log(list[index])

  const onFinish = async ({passwd}) => {
    setLoading(true)
    const id = list[index].id
    const {
      data: {data, code},
    } = await fetch('bank.api.accountmanageservice.resetaccountpsw', [
      {id, passwd},
    ])

    setLoading(false)

    if (code === 0) {
      form.resetFields()
      setResetVisible(false)
      onAccuntFinish()
      message.success('重置密码成功')
    }
  }

  return (
    <Modal
      title="重置密码"
      confirmLoading={loading}
      destroyOnClose
      forceRender
      onOk={() => form.submit()}
      onCancel={() => {
        setResetVisible(false)
        setLoading(false)
      }}
      okText="提交"
      cancelText="取消"
      visible={resetVisible}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="passwd"
          rules={[{required: true, message: '请输入密码'}]}
        >
          <Input placeholder="请输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

let values = {}
function body({data, roles}) {
  const [list, setList] = useState(data)
  const [visible, setVisible] = useState(false)
  const [resetVisible, setResetVisible] = useState(false)
  const [index, setIndex] = useState()

  const fetchList = async (values = {}) => {
    const {
      data: {data, code},
    } = await fetchData({...pageParams, ...values})
    if (code === 0) {
      setList(data || {list: []})
    }
  }

  const onSearch = async (value) => {
    if (value.enableStatus < 0) {
      delete value.enableStatus
    }
    values = value
    pageParams.pageNo = 1
    fetchList(values)
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
  }

  const onEdit = (index) => {
    setIndex(index)
    setVisible(true)
  }

  const onAccuntFinish = () => {
    fetchList(values)
  }

  const onDelete = (id) => {
    Modal.confirm({
      title: '删除后不可恢复，请确认是否删除该账号？',
      icon: <CloseCircleOutlined style={{color: '#ff0000'}} />,
      onOk() {
        return new Promise((resolve, reject) => {
          fetch('bank.api.accountmanageservice.deleteaccountrole', [{id}]).then(
            ({data: {data, code}}) => {
              if (code === 0) {
                resolve()
                onAccuntFinish()
              }
              reject()
            },
          )
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  const onReset = (index) => {
    setIndex(index)
    setResetVisible(true)
  }

  const onPage = async () => {
    fetchList(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space size="large" direction="vertical" style={{width: '100%'}}>
        <SearchForm {...{onSearch, onAdd}} />
        <TableList {...{list, onEdit, onDelete, onReset, onPage}} />
      </Space>
      <AccountModal
        {...{visible, setVisible, roles, list, index, onAccuntFinish}}
      />
      <ResetModal
        {...{resetVisible, setResetVisible, index, list, onAccuntFinish}}
      />
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const defaultData = {
    data: [{list: [], pageRet: {}}],
    roles: [],
  }
  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: roleData, code: roleCode},
      },
    ] = await Promise.all([
      fetchData(),
      fetch('bank.api.rolemanageservice.queryrolelist', [{}]),
    ])

    const roles = roleCode === 0 ? roleData : []

    if (code === 0) {
      return {
        data,
        roles,
      }
    }

    return defaultData
  } catch (err) {
    return defaultData
  }
}

export default body
