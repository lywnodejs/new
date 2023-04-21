import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {
  Row,
  Col,
  Button,
  Form,
  Select,
  Input,
  Modal,
  Table,
  message,
} from 'antd'
import Router, {withRouter} from 'next/router'
import {Layout} from '~/components/Layout'

import api from '~/api/data'
const breadcrumbs = [{text: '数据源管理'}, {text: '数据源指标查看'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function body({router}) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [groupData, setGroupData] = useState([])
  const [list, setList] = useState({})

  useEffect(() => {
    function fetchData() {
      getGroup()
      fetchList()
    }
    fetchData()
  }, [])
  const fetchList = async (values = {}) => {
    try {
      values.indicatorsType = values.indicatorsType || null
      values.groupId = values.groupId || null

      const {
        data: {data, code},
      } = await api.getIndicatorsFromDataSource({
        ...pageParams,
        ...values,
        datasourceType: router.query.datasourceType,
        datasourceId: router.query.datasourceId,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }
  const getGroup = async () => {
    try {
      let {
        data: {code, data},
      } = await api.getGroup()
      if (code == 0) {
        setGroupData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onReset = () => {
    form.resetFields()
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'datasourceName',
      key: 'datasourceName',
      width: 100,
    },
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text, record, index) => {
        return text == 'base' ? '基础指标' : '衍生指标'
      },
    },
    {
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 100,
    },
    {
      title: '指标中文名',
      dataIndex: 'nameCn',
      key: 'nameCn',
      width: 100,
    },
    {
      title: '指标名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'columnType',
      key: 'columnType',
      width: 100,
    },
    {
      title: '默认值',
      dataIndex: 'columnDefaultValue',
      key: 'columnDefaultValue',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onDelete(record)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]
  const deleteOk = async (record) => {
    try {
      const {data} = await api.deleteIndicatorsById(record.id)
      if (data.code == 0) {
        message.success('删除成功')
        onPage()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onDelete = async (record) => {
    let {
      data: {code, data},
    } = await api.getLastCallTime(record.id)
    if (code == 0) {
      Modal.confirm({
        title: `${
          data ? `指标最近一次调用日期“${data}”` : '该指标没有被调用过'
        }`,
        icon: <ExclamationCircleOutlined />,
        content: <span style={{color: 'red'}}>你确定要删除么？</span>,
        async onOk() {
          deleteOk(record)
        },
      })
    }
  }
  const onPage = () => {
    fetchList(values)
  }
  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Form
        form={form}
        onFinish={onSearch}
        layout="inline"
        className="searchForm"
        initialValues={{
          groupId: '',
          indicatorsType: '',
        }}
      >
        <Form.Item label="分类" name="indicatorsType">
          <Select
            style={{width: '160px'}}
            onChange={(val) => changeMethod(val)}
          >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="base">基础指标</Select.Option>
            <Select.Option value="derivation">衍生指标</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="分组" name="groupId">
          <Select style={{width: 120}}>
            <Select.Option value="">全部</Select.Option>
            {groupData.map((group) => {
              return (
                <Select.Option value={group.groupId} key={group.groupId}>
                  {group.groupName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label="中文名" name="nameCn">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input placeholder="请输入" />
        </Form.Item>

        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          查询
        </Button>
        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>
      </Form>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={columns}
        bordered
        pagination={pagination}
        // scroll={{y: '100%', x: '100%'}}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
