import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import api from '~/api/authority'
import {Button, Table, Space, Form, Input, Modal, message} from 'antd'
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
    } = await apiBusiness.getBranchList(params)
    if (code == 0) {
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '客户经理管理'}, {text: '机构管理'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }

  return (
    <Form form={form} name="search" style={{marginBottom: 30}} layout="inline">
      <Form.Item name="keyName">
        <Input placeholder="支行名称" style={{width: 250}} />
      </Form.Item>

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
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [showModal, setModal] = useState(false)
  const [showModalData, setModalData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [departments, setDepartments] = useState([])
  const [cookies] = useCookies(['name'])

  useEffect(() => {
    fetchDepartment()
    getData()
  }, [])
  // 获取部门
  const fetchDepartment = async () => {
    try {
      const {data} = await apiBusiness.getDepart4select()
      console.log(data)
      if (data.code == 0) {
        setDepartments(data.data)
      }
    } catch (err) {
      console.log(err)
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
        } = await apiBusiness.deleteBranch(newData[i].id)
        if (code == 0) {
          newData.splice(i, 1)
          setData({...data, list: newData})
          message.success('删除成功')
        }
      },
    })
  }

  const columns = [
    {title: '序号', render: (v, r, i) => i + 1},
    {title: '机构代码', dataIndex: 'code'},
    {title: '机构名称', dataIndex: 'name'},
    {title: '所属组织架构', dataIndex: 'departmentName'},
    {title: '地址', dataIndex: 'address'},
    {title: '联系电话', dataIndex: 'mobile'},
    {
      title: '营业时间',
      render: (v, r) => {
        return r.startTime + ' - ' + r.endTime
      },
    },
    {title: '操作时间', dataIndex: 'updateTime'},
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => showAddModal(i)}>
              编辑
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
      <Search search={onSearch} showAddModal={() => showAddModal(-1)} />

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
        departments={departments}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  pageParams.pageNo = 1
  let data = await getData()
  return {data}
}

export default body
