import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input, Select} from 'antd'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/system'

import WhiteForm from './whiteForm'
import VertifyForm from './vertifyForm'
import TableList from './TableList'

const breadcrumbs = [{text: '系统设置管理'}, {text: '白名单配置'}]
const pageParams = {
  page: 1,
  pageSize: 10,
}
let values = {}
function body({labels}) {
  const [cookies] = useCookies(['tenantId'])
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [vertifyVisible, setVertifyVisible] = useState(false)

  useEffect(() => {
    async function fetchData() {
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async (values = {}) => {
    values.label = values.label || null
    values.useStatus = values.useStatus || null

    try {
      const {
        data: {data, code},
      } = await api.fetch_white_list({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        console.log(data)
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
    pageParams.page = 1
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
    form.setFieldsValue('useStatus', val)
  }
  const changeLabel = (val) => {
    form.setFieldsValue('label', val)
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
            label: '',
            useStatus: '',
          }}
        >
          <Form.Item label="公司名称" name="companyName">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item name="label" label="标签">
            <Select
              style={{width: '130px'}}
              onChange={(val) => changeLabel(val)}
            >
              <Select.Option value="">全部</Select.Option>
              {labels.map((v, i) => (
                <Select.Option key={i} value={v.code}>
                  {v.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="状态" name="useStatus">
            <Select
              onChange={(val) => changeStatus(val)}
              style={{width: '200px'}}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="1">启用</Select.Option>
              <Select.Option value="0">停用</Select.Option>
              <Select.Option value="2">待审核</Select.Option>
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
            labels,
          }}
        />
        <WhiteForm
          selectIndex={selectIndex}
          visible={visible}
          onHide={() => setVisible(false)}
          selectItem={selectItem}
          pullData={onSearch}
          labels={labels}
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
  const backData = {
    labels: [],
  }

  try {
    const [
      {
        data: {data: labels, code: levelCode},
      },
    ] = await Promise.all([api.get_data_dict('COMPANY_CONF_LABEL')])

    if (levelCode == 0) {
      return {
        labels: levelCode === 0 ? labels : [],
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default body
