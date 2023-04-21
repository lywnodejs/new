import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input} from 'antd'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/authority'
import RoleForm from './roleForm'

import TableList from './TableList'

const breadcrumbs = [{text: '权限管理'}, {text: '角色管理'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [pageParams, setPageParams] = useState({pageNo: 1, pageSize: 10})

  useEffect(() => {
    fetchList(pageParams)
  }, [])

  const fetchList = async (values) => {
    try {
      const {
        data: {data, code},
      } = await api.getRoleList(values)
      if (code === 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
  }

  const changePageParams = (page) => {
    let pParams = {...page}
    let params = {...form.getFieldsValue(), ...pParams}
    setPageParams(pParams)
    fetchList(params)
  }

  const onReset = () => {
    form.resetFields()
    onSearch()
  }

  const onSearch = () => {
    // fetchList(values)
    let pages = {
      ...pageParams,
      pageNo: 1,
    }
    let values = form.getFieldsValue()
    setPageParams(pages)
    fetchList({...pages, ...values})
  }

  const pullData = () => {
    let values = form.getFieldsValue()
    fetchList({...pageParams, ...values})
  }

  const onEdit = (item) => {
    setIndex(item.id)
    setVisible(true)
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
            keyword: '',
          }}
        >
          <Form.Item label="关键字" name="keyword">
            <Input placeholder="请输入关键字" />
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
            onEdit,
            pullData,
            pageParams,
            changePageParams,
          }}
        />
        <RoleForm
          selectIndex={selectIndex}
          visible={visible}
          onHide={() => setVisible(false)}
          selectItem={selectItem}
          pullData={pullData}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
