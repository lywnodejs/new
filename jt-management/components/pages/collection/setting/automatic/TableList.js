import {Button, Modal, Space, Table, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import api from '~/api/collection'
import EditForm from './EditForm'

const initDta = {
  total: 0,
  list: [],
}
const initPage = {page: 1, pageSize: 10}
export default function (props) {
  const [pageParams, setPageParams] = useState({...initPage})
  const [data, setData] = useState(initDta)
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    if (props.productId) {
      onChange(initPage.page, initPage.pageSize)
      getUsers(props.productId)
    }
  }, [props.productId])

  const getData = async (page = pageParams) => {
    let params = {...page, productId: props.productId}
    let {
      data: {code, data},
    } = await api.getProdutAutomaticConfig(params)
    if (code == 0) {
      data.list = data.list || []
      setData(data)
    }
  }

  const getUsers = async () => {
    let {
      data: {code, data},
    } = await api.getNewTreeMemberList()
    setUserData(code == 0 ? data : [])
  }

  const onEdit = (data) => {
    setEditItem(data)
    setVisible(true)
  }

  const changeLoading = () => {
    setLoading(false)
    setLoading(true)
  }

  const getFormData = (data) => {
    data.id = editItem ? editItem.id : null

    api
      .changeAutomaticConfig(data)
      .then(({data: {code}}) => {
        if (code == 0) {
          setVisible(false)
          if (data.productId == props.productId) {
            let pageNo = data.id ? pageParams.page : 1
            onChange(pageNo, initPage.pageSize)
          }
        } else {
          changeLoading()
        }
      })
      .catch((err) => {
        console.error(err)
        changeLoading()
      })
  }

  const onDelete = (item) => {
    Modal.confirm({
      title: '删除后将无法恢复！',
      icon: <ExclamationCircleOutlined />,
      content: <span style={{color: 'red'}}>你确定要删除么？</span>,
      onOk() {
        api.deleteAutomaticConfig(item.id).then(({data: {code}}) => {
          if (code == 0) {
            message.success('删除成功')
            onChange(pageParams.page, pageParams.pageSize)
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const columns = [
    {title: '分案级别', dataIndex: 'collectionLevel'},
    {
      title: '产品名称',
      dataIndex: 'productId',
      render: (text, record, index) => {
        let findOne = props.collectionProducts.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '委案人员姓名',
      dataIndex: 'detailList',
      render: (t) => {
        if (Array.isArray(t)) {
          return t.map((item) => item.accountName).join('、')
        }
        return ''
      },
    },
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '操作',
      dataIndex: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>

            <Button type="link" onClick={() => onDelete(record)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const onChange = (pageNo, pageSize) => {
    pageParams.page = pageNo
    pageParams.pageSize = pageSize
    setPageParams({...pageParams})
    getData()
  }

  const paginationConfig = {
    total: data.total,
    current: pageParams.page,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    pageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange,
  }

  return (
    <>
      <div
        style={{
          textAlign: 'right',
          marginBottom: 15,
        }}
      >
        <Button type="primary" onClick={() => onEdit(null)}>
          新增
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={data.list}
        columns={columns}
        bordered
        pagination={paginationConfig}
      />

      <EditForm
        visible={visible}
        levelData={props.levelData}
        collectionProducts={props.collectionProducts}
        setVisible={setVisible}
        data={editItem}
        getFormData={getFormData}
        userData={userData}
        loading={loading}
      />
    </>
  )
}
