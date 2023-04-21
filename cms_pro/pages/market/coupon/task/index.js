import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input, Select} from 'antd'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/marketing'

import TaskForm from './taskForm'
import TableList from './TableList'

const breadcrumbs = [{text: '营销管理'}, {text: '免息券'}, {text: '任务管理'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})

  useEffect(() => {
    async function fetchData() {
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_marketing_task({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
    setSelectItem({})
  }

  const onReset = () => {
    form.resetFields()
  }

  const onSearch = (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  const onEdit = (item) => {
    setIndex(item.id)
    setVisible(true)
    setSelectItem({...item})
  }
  const changeStatus = (val) => {
    form.setFieldsValue('status', val)
  }
  const onVertify = (item) => {
    setVertifyVisible(true)
    setSelectItem(item)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            marketingIds: '',
            taskName: '',
            status: '',
          }}
        >
          <Form.Item label="任务名" name="taskName">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="券ID" name="marketingIds">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select
              onChange={(val) => changeStatus(val)}
              style={{width: '200px'}}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="0">锁定</Select.Option>
              <Select.Option value="1">激活</Select.Option>
              <Select.Option value="2">发放中</Select.Option>
              <Select.Option value="3">已完成</Select.Option>
            </Select>
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

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            onEdit,
            onVertify,
            pullData: onSearch,
          }}
        />
        <TaskForm
          selectIndex={selectIndex}
          visible={visible}
          onHide={() => setVisible(false)}
          selectItem={selectItem}
          pullData={onSearch}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
