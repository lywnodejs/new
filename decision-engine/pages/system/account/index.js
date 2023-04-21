import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import React, {PureComponent, useContext} from 'react'
import fetch from '~/utils/fetch'
import {Form, Input, Button, Table, Modal, Select, Space, message} from 'antd'
// import {TabContext} from '../../../components/Layout/Layout'

const breadcrumbs = [{text: '系统管理'}, {text: '帐号管理'}]

const status = [
  {
    name: '全部',
    value: -1,
  },
  {
    name: '使用中',
    value: 1,
  },
  {
    name: '已停用',
    value: 0,
  },
]

const fetchData = async (params = {}) => {
  return await fetch(
    'fincloud.admin.center.facade.api.accountservice.queryaccountlist',
    [params],
  )
}

const SearchForm = ({t, onAdd, onSearch, form}) => {
  return (
    <Form
      layout="inline"
      onFinish={onSearch}
      form={form}
      initialValues={{enableStatus: -1}}
    >
      <Form.Item label="账号名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item style={{width: 150}} name="enableStatus" label="状态">
        <Select>
          {status.map((v, i) => (
            <Select.Option key={i} value={v.value}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{marginRight: 15}}>
        查询
      </Button>

      <Button type="primary" htmlType="button" onClick={onAdd}>
        新增帐号
      </Button>
    </Form>
  )
}

const AccountModal = ({
  row,
  list,
  visible,
  setVisible,
  roles,
  onAccuntFinish,
}) => {
  const prevVisibleRef = useRef()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const initialValues = row !== null ? row : {}

  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])

  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }

    if (visible) {
      row !== null ? form.setFieldsValue(row) : form.resetFields()
    }
  }, [visible])

  const onFinish = async (values) => {
    setLoading(true)
    if (row !== null) {
      values['id'] = row.id
    }
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.admin.center.facade.api.accountservice.saveaccount',
      [values],
    )

    setLoading(false)

    if (code === 0) {
      setVisible(false)
      onAccuntFinish()
      message.success('提交成功')
    }
  }

  return (
    <Modal
      title={row !== null ? '编辑' : '添加'}
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
        {...{
          labelCol: {span: 6},
          wrapperCol: {span: 16},
        }}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        {/* <Form.Item
          label="账号名称"
          name="accountName"
          rules={[
            {required: true, message: '请输入邮箱!'},
            {
              pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
              message: '请输入正确的邮箱!',
            },
          ]}
        >
          <Input disabled={row !== null} placeholder="请使用公司邮箱" />
        </Form.Item> */}

        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            {required: true, message: '请输入手机号!'},
            {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号'},
          ]}
        >
          <Input placeholder="请输入11位手机号" />
        </Form.Item>

        {/* <Form.Item
          label="登录密码"
          name="password"
          rules={[
            {required: row === null, message: '请输入登录密码!'},
            {pattern: /[\w|\d]{6,50}/, message: '请输入正确的登录密码!'},
          ]}
        >
          <Input placeholder="6位以上数字或字母，最多50字符" />
        </Form.Item> */}

        <Form.Item
          label="姓名"
          name="name"
          rules={[{required: true, message: '请输入姓名!'}]}
        >
          <Input placeholder="请输入用户姓名" />
        </Form.Item>

        <Form.Item
          label="角色"
          name="roleIdList"
          rules={[{required: true, message: '请选择角色!'}]}
        >
          <Select mode="multiple">
            {roles.map((v, i) => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const TableList = ({list, onEdit, onSwitch}) => {
  const columns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'roleNameList',
      render: (value) => value.join(','),
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'enableName',
      render: (value, row) => {
        return (
          <span>
            <span
              style={{
                fontSize: 10,
                paddingRight: 5,
                color: row.enableStatus === 1 ? '#33cc33' : '#ff0000',
              }}
            >
              ●
            </span>
            {value}
          </span>
        )
      },
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 200,
      render: (value, row, index) => {
        return (
          <React.Fragment>
            <Button type="link" onClick={() => onEdit(row)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onSwitch(row)}>
              {row.enableStatus === 1 ? '停用' : '启用'}
            </Button>
          </React.Fragment>
        )
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={list}
      columns={columns}
      scroll={{x: '1600px', y: 'calc(100vh - 350px)'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
    />
  )
}

function body({data, roles}) {
  const [list, setList] = useState(data)
  const [visible, setVisible] = useState(false)
  const [resetVisible, setResetVisible] = useState(false)
  const [row, setRow] = useState()
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    setList(data)
  }, [data])

  const fetchList = async (values = {}) => {
    if (values.enableStatus < 0) {
      delete values.enableStatus
    }

    const {
      data: {data, code},
    } = await fetchData(values)
    if (code === 0) {
      setList(data)
    }
  }

  const onSearch = async (value) => {
    fetchList(value)
  }

  const onAdd = () => {
    setRow(null)
    setVisible(true)
  }

  const onEdit = (row) => {
    setRow(row)
    setVisible(true)
  }

  const onAccuntFinish = () => {
    fetchList(form.getFieldsValue())
  }

  const onSwitch = ({id, enableStatus}) => {
    Modal.confirm({
      title:
        enableStatus === 1
          ? '确定后，该账号将处于停用状态，无法登录。请确认？'
          : '确定后，将启用该账号，并恢复相关权限。请确认？',
      onOk() {
        return new Promise((resolve, reject) => {
          fetch(
            'fincloud.admin.center.facade.api.accountservice.updateenablestatus',
            [{id, status: enableStatus === 1 ? 0 : 1}],
          ).then(({data: {data, code}}) => {
            if (code === 0) {
              resolve()
              onAccuntFinish()
              message.success('提交成功')
            }
            reject()
          })
        }).catch(() => console.log('Oops errors!'))
      },
    })

    fetchList(form.getFieldsValue())
  }
  // const value = useContext(TabContext)
  // console.log('value', value)

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space size="large" direction="vertical" style={{width: '100%'}}>
        <SearchForm {...{onSearch, onAdd, form}} />
        <TableList {...{list, onEdit, onSwitch}} />
      </Space>
      <AccountModal
        {...{visible, setVisible, roles, list, row, onAccuntFinish}}
      />
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const defaultData = {
    data: [],
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
      fetch('fincloud.admin.center.facade.api.roleservice.list', [{}]),
    ])
    const roles = roleCode === 0 ? roleData : []

    if (code === 0) {
      // console.log(data)
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
