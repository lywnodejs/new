import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input, Select, Tabs} from 'antd'
import apiProduct from '~/api/product'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/agreement'

import TableList from './TableList'
import {base64ToFileOrBlob} from 'web-downloadfile'
const {TabPane} = Tabs

const breadcrumbs = [{text: '协议管理'}, {text: '签章查询'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [productList, setProductList] = useState([])
  const [agreementIds, setAgreementIds] = useState([])

  useEffect(() => {
    fetchProductList()
  }, [])

  useEffect(() => {
    if (activeKey != -1) {
      form.resetFields()
      onSearch({})
    }
  }, [activeKey])

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products({tenantId: cookies.tenantId})
      if (code == 0) {
        setProductList(data)
        data && data.length && setActiveKey(String(data[0].id))
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.getSignAgreementList({
        ...pageParams,
        ...values,
        productId: activeKey,
      })
      if (code == 0) {
        console.log(data)
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
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

  const onDownLoad = async (ids) => {
    const params = ids || agreementIds
    try {
      if (!params.length) {
        return message.error('请选择项目')
      }
      const {
        data: {data, code},
      } = await api.downloadSignAgreement(params)
      if (code == 0) {
        base64ToFileOrBlob(
          'data:application/zip;base64,' + data.pdfData,
          '',
          false,
        )
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onPreview = (record) => {
    window.open(record.url)
  }

  const onDownLoadItem = async (record) => {
    onDownLoad([record.id])
  }
  const appendAgreementIds = (ids) => {
    setAgreementIds(ids)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
        {productList && productList.length
          ? productList.map((item) => (
              <TabPane
                tab={item.name}
                key={item.id}
                forceRender={true}
              ></TabPane>
            ))
          : null}
      </Tabs>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
        >
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="用户名" name="name">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="协议名称" name="fileName">
            <Input placeholder="请输入" />
          </Form.Item>

          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>

          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>
          <Button style={{marginRight: 15}} onClick={() => onDownLoad()}>
            下载
          </Button>
        </Form>

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            onDownLoadItem,
            onPreview,
            appendAgreementIds,
          }}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
