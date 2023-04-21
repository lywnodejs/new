import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, Form, Button, Input, Select} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/authority'
import apiInCollection from '~/api/collection'
import AccountForm from './accountForm'

import TableList from './TableList'
import _ from 'lodash'

const breadcrumbs = [{text: '权限管理'}, {text: '成员管理'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [form] = Form.useForm()
  const [data, setData] = useState({list: [], total: 0})
  const [roles, setRoles] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [departments, setDepartments] = useState([])
  const [showDepartments, setShowDepartments] = useState([])
  const [showRoles, setShowRoles] = useState([])
  const [pageParams, setPageParams] = useState({pageNo: 1, pageSize: 10})

  useEffect(() => {
    fetchList(pageParams)
    fetchDepartment()
    fetchRoles()
  }, [])

  const fetchDepartment = async () => {
    try {
      const {data} = await api.getVisibleDepart()
      if (data.code == 0) {
        setDepartments(data.data)
        setShowDepartments(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearchDepart = (keyword) => {
    if (!keyword) {
      return setShowDepartments(departments)
    }
    const arr = departments.filter((v) => v.name.indexOf(keyword) > -1)
    setShowDepartments(arr)
  }
  const handleChangeDepart = () => {
    setShowDepartments(departments)
  }

  const fetchRoles = async (keyword) => {
    let params = {}
    if (keyword) {
      params.keyword = keyword
    }
    try {
      const {
        data: {data, code},
      } = await api.getRoleList(params)
      if (code === 0) {
        if (!keyword) {
          setRoles(data.list)
        }
        setShowRoles(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const _fetchRoles = _.debounce(fetchRoles, 300)

  const handleSearchRole = (v) => {
    _fetchRoles(v)
  }

  const handleChangeRole = () => {
    setShowRoles(roles)
  }

  const fetchList = async (values) => {
    try {
      const {
        data: {data, code},
      } = await api.getAccount({...values})
      if (code === 0) {
        setData(data)
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
    onSearch()
  }

  const onSearch = () => {
    changePageParams(1)
  }

  const changePageParams = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    let pParams = {pageNo, pageSize}
    let params = {...form.getFieldsValue(), ...pParams}
    setPageParams(pParams)
    fetchList(params)
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
            departmentId: null,
            roleId: null,
          }}
        >
          <Form.Item label="关键字" name="keyword">
            <Input placeholder="请输入关键字" />
          </Form.Item>

          <Form.Item label="部门" name="departmentId">
            <Select
              showSearch
              placeholder="请选择部门"
              filterOption={false}
              defaultActiveFirstOption={false}
              onSearch={handleSearchDepart}
              onChange={handleChangeDepart}
              style={{width: '200px'}}
            >
              <Select.Option value={null} key={-1}>
                全部
              </Select.Option>
              {showDepartments.map((v, i) => {
                return (
                  <Select.Option value={v.id} key={i}>
                    {v.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item label="角色" name="roleId">
            <Select
              showSearch
              placeholder="请选择角色"
              filterOption={false}
              defaultActiveFirstOption={false}
              onSearch={handleSearchRole}
              onChange={handleChangeRole}
              style={{width: '200px'}}
            >
              <Select.Option value={null} key={-1}>
                全部
              </Select.Option>
              {showRoles.map((v) => {
                return (
                  <Select.Option value={v.id} key={v.id}>
                    {v.roleName}
                  </Select.Option>
                )
              })}
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
            data,
            onEdit,
            pageParams,
            changePageParams,
          }}
        />
        <AccountForm
          {...{
            handleSearchRole,
            handleChangeRole,
            handleSearchDepart,
            handleChangeDepart,
            showDepartments,
            showRoles,
            selectIndex,
            visible,
            selectItem,
            onHide: () => setVisible(false),
            changePageParams,
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
