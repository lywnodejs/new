import React, {useState, useEffect} from 'react'
import {
  Space,
  message,
  Form,
  Button,
  Input,
  Select,
  Tabs,
  DatePicker,
  Modal,
  Card,
} from 'antd'
import Router, {withRouter} from 'next/router'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import api from '~/api/data'
import ApiTableList from './ApiTableList'
import SqlTableList from './SqlTableList'
const {TabPane} = Tabs
const {RangePicker} = DatePicker

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

const DataSourceContainer = (props) => {
  const [activeKey, setActiveKey] = useState('1')
  const [form] = Form.useForm()
  const [sqlForm] = Form.useForm()
  const [list, setList] = useState([])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        form.resetFields()
        onSearch({})
      }
    }
    fetchData()
  }, [activeKey])

  const fetchList = async (values = {}) => {
    try {
      const {time} = values
      values.requestType = values.requestType || null
      values.databaseType = values.databaseType || null
      values.startDate = (time && time[0].format('YYYY-MM-DD')) || null
      values.endDate = (time && time[1].format('YYYY-MM-DD')) || null

      let postApi =
        activeKey == 1 ? api.getDataSourceByHttp : api.getDataSourceBySql
      const {
        data: {data, code},
      } = await postApi({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        console.log('data', data)
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    let url = `/data/detail?tab=${activeKey}&id=new`
    Router.push(url)
  }

  const onReset = () => {
    form.resetFields()
    sqlForm.resetFields()
  }
  const changeTab = async (key) => {
    setActiveKey(key)
  }
  const onSearch = (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = () => {
    fetchList(values)
  }

  const onEdit = (item) => {
    let url = `/data/detail?tab=${activeKey}&id=${item.id}`
    Router.push(url)
  }
  const changeMethod = (val) => {
    form.setFieldsValue('requestType', val)
  }

  const changeMethodSql = (val) => {
    form.setFieldsValue('databaseType', val)
  }

  const deleteOk = async (record) => {
    try {
      let postApi =
        activeKey == 1 ? api.deleteDataSourceByHttp : api.deleteDataSqlByHttp

      const {data} = await postApi(record.id)
      if (data.code == 0) {
        message.success('删除成功')
        onPage()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onCheckIndication = (record) => {
    let url = `/data/form?datasourceType=${
      activeKey == 1 ? 'http' : 'sql'
    }&datasourceId=${record.id}`
    Router.push(url)
  }
  const onDelete = async (record) => {
    let postApi =
      activeKey == 1
        ? api.getIndicatorsCountById
        : api.getIndicatorsSqlCountById
    let {
      data: {code, data},
    } = await postApi(record.id)
    if (code == 0) {
      if (data) {
        Modal.confirm({
          title: `该数据源下存在指标${data}个。`,
          icon: <ExclamationCircleOutlined />,
          content: (
            <span style={{color: 'red'}}>
              请先查看并删除相关指标，才可删除该数据源。
            </span>
          ),
          okText: '查看相关指标',
          async onOk() {
            onCheckIndication(record)
          },
        })
      } else {
        Modal.confirm({
          title: `你确定要删除么？`,
          icon: <ExclamationCircleOutlined />,
          content: <span style={{color: 'red'}}>该数据源下没有指标。</span>,
          async onOk() {
            deleteOk(record)
          },
        })
      }
    }
  }
  return (
    <React.Fragment>
      <Card style={{marginBottom: 15}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
          <TabPane tab="接口" key="1" forceRender={true} />
          <TabPane tab="数据库" key="2" forceRender={true} />
        </Tabs>
        {activeKey == 1 && (
          <Form
            form={form}
            onFinish={onSearch}
            layout="inline"
            className="searchForm"
            initialValues={{
              name: '',
              requestType: '',
            }}
          >
            <Form.Item label="名称" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="请求方式" name="requestType">
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeMethod(val)}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="GET">GET</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="创建日期" name="time">
              <RangePicker />
            </Form.Item>

            <Button type="primary" style={{marginRight: 15}} htmlType="submit">
              查询
            </Button>
            <Button style={{marginRight: 15}} onClick={onReset}>
              重置
            </Button>
            <Button type="primary" onClick={onAdd}>
              新增
            </Button>
          </Form>
        )}
        {activeKey == 2 && (
          <Form
            form={sqlForm}
            onFinish={onSearch}
            layout="inline"
            className="searchForm"
            initialValues={{
              name: '',
              databaseType: '',
            }}
          >
            <Form.Item label="名称" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="数据库类型" name="databaseType">
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeMethodSql(val)}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="MySQL">MySQL</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="用户名" name="username">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="创建日期" name="time">
              <RangePicker />
            </Form.Item>

            <Button type="primary" style={{marginRight: 15}} htmlType="submit">
              查询
            </Button>
            <Button style={{marginRight: 15}} onClick={onReset}>
              重置
            </Button>
            <Button type="primary" onClick={onAdd}>
              新增
            </Button>
          </Form>
        )}
      </Card>

      {activeKey == 1 && (
        <ApiTableList
          {...{
            list,
            onPage,
            pageParams,
            onEdit,
            onDelete,
          }}
        />
      )}
      {activeKey == 2 && (
        <SqlTableList
          {...{
            list,
            onPage,
            pageParams,
            onEdit,
            onDelete,
          }}
        />
      )}
    </React.Fragment>
  )
}

export default DataSourceContainer
