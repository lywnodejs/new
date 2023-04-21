import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input, Select} from 'antd'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/marketing'

import TicketForm from './ticketForm'
import VertifyForm from './vertifyForm'
import TableList from './TableList'

const breadcrumbs = [{text: '营销管理'}, {text: '免息券'}, {text: '券管理'}]
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
  const [vertifyVisible, setVertifyVisible] = useState(false)

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_marketing_ticket({
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
    setSelectItem(item)
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
            id: '',
            marketingAmt: '',
            status: '',
          }}
        >
          <Form.Item label="券ID" name="id">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="金额" name="marketingAmt">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select
              onChange={(val) => changeStatus(val)}
              style={{width: '200px'}}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="1">启用</Select.Option>
              <Select.Option value="2">停用</Select.Option>
              <Select.Option value="0">待审核</Select.Option>
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
        <TicketForm
          selectIndex={selectIndex}
          visible={visible}
          onHide={() => setVisible(false)}
          selectItem={selectItem}
          pullData={onSearch}
        />
        <VertifyForm
          visible={vertifyVisible}
          onHide={() => setVertifyVisible(false)}
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
