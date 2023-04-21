import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import api from '~/api/authority'
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  Modal,
  Select,
  message,
  Badge,
  Card,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'
import EditModal from './edit'
import {useCookies} from 'react-cookie'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiBusiness.getManagerList(params)
    if (code == 0) {
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '客户经理列表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const [cookies] = useCookies(['dataScope'])

  const [dataScope, setDataScope] = useState(3)

  useEffect(() => {
    setDataScope(cookies.dataScope)
  }, [])

  const onSearch = () => {
    let params = form.getFieldsValue()
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key]
      }
    })
    props.search(params)
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        name="search"
        layout="inline"
        initialValues={{status: null, networkId: null}}
      >
        <Form.Item label="" name="key">
          <Input placeholder="工号/客户经理/电话" />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select style={{width: 100}}>
            <Select.Option value={null}>全部</Select.Option>
            <Select.Option value={'1'}>启用</Select.Option>
            <Select.Option value={'0'}>禁用</Select.Option>
          </Select>
        </Form.Item>

        {dataScope == 3 ? (
          <Form.Item label="所属机构" name="networkId">
            <Select style={{width: 200}}>
              <Select.Option value={null}>全部</Select.Option>
              {props.branch.map((v, i) => {
                return (
                  <Select.Option value={v.id} key={v.id}>
                    {v.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        ) : null}

        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={props.showAddModal}>
            新增
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [showModal, setModal] = useState(false)
  const [showModalData, setModalData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [branch4search, setBranch4search] = useState([])
  const [networkDepartmentTree, setNetworkDepartmentTree] = useState([])

  useEffect(() => {
    getBranch4search()
    fetchNetworkDepartmentTree()
  }, [])

  // 获取网点 部门
  const fetchNetworkDepartmentTree = async () => {
    try {
      const {data} = await apiBusiness.getNetworkDepartmentTree()
      // data.code = 0;
      // data.data = [
      //   {networkName: 'test1',networkId: '9', departmentVoList: [{id:1, name: 'test1-1'}, {id:2, name: 'test1-2'}]},
      //   {networkName: 'test2',networkId: '10', departmentVoList: [{id:3, name: 'test1-3'}, {id:4, name: 'test1-4'}]},
      //   {networkName: 'test3',networkId: '11', departmentVoList: [{id:5, name: 'test1-5'}, {id:6, name: 'test1-6'}]},
      //   {networkName: 'test4',networkId: '12', departmentVoList: [{id:7, name: 'test1-7'}, {id:8, name: 'test1-8'}]}
      // ]
      if (data.code == 0) {
        // console.log(data.data)
        setNetworkDepartmentTree(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getBranch4search = async () => {
    let {
      data: {code, data},
    } = await apiBusiness.getBranch4other()
    if (code == 0) {
      setBranch4search(data || [])
    } else {
      setBranch4search([])
    }
  }

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData({...params})
    setData(data)
  }

  const deleteItem = (i) => {
    Modal.confirm({
      content: '确定删除该项数据？',
      onOk: async () => {
        let newData = [...data.list]

        const {
          data: {code},
        } = await apiBusiness.deleteManager(newData[i].id)
        if (code == 0) {
          newData.splice(i, 1)
          setData({...data, list: newData})
          message.success('删除成功')
        }
      },
    })
  }

  const changeStatus = async (i) => {
    let nData = [...data.list]
    let status = nData[i].status == 0 ? '1' : '0'
    let text = nData[i].status == 0 ? '启用' : '禁用'
    Modal.confirm({
      content: `确定${text}此客户经理账号？`,
      onOk: async () => {
        const {
          data: {code},
        } = await apiBusiness.updateManagerStatus({id: nData[i].id, status})
        if (code == 0) {
          nData[i].status = status
          setData({...data, list: nData})
          message.success('修改成功')
        }
      },
    })
  }

  const columns = [
    {title: '工号', dataIndex: 'jobNumber'},
    {title: '客户经理', dataIndex: 'name'},
    {title: '电话（登录账号）', dataIndex: 'mobile'},
    {title: '所属机构', dataIndex: 'branchNetworkName'},
    {title: '对应组织架构', dataIndex: 'departmentName'},
    {
      title: '状态',
      dataIndex: 'status',
      render: (v, r, i) => {
        const text = v == 0 ? '禁用' : '启用'
        const color = v == 0 ? 'red' : 'green'
        return <Badge color={color} text={text} />
      },
    },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => showAddModal(i)}>
              编辑
            </Button>

            <Button type="link" onClick={() => changeStatus(i)}>
              {r.status == 1 ? '禁用' : '启用'}
            </Button>

            <Button type="link" danger onClick={() => deleteItem(i)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const showAddModal = (i) => {
    let editData = null
    if (i > -1) {
      editData = data.list[i]
    }
    setModalData(editData)
    setModal(true)
  }

  const closeModal = (isSuccess, isUpdateList) => {
    setModal(false)
    if (isUpdateList) {
      onChangePage()
      getBranch()
    }
    if (isSuccess) {
      message.success('编辑成功')
    }
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        branch={branch4search}
        showAddModal={() => showAddModal(-1)}
      />

      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />

      <EditModal
        show={showModal}
        data={showModalData}
        branch={branch4search}
        departments={[]}
        networkDepartmentTree={networkDepartmentTree}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
