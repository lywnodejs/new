import {Button, Modal, Space, Table, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import api from '~/api/collection'
import EditForm from './EditForm'

const initDta = {
  total: 0,
  list: [],
}
const initPage = {pageNo: 1, pageSize: 10}
export default function (props) {
  const [pageParams, setPageParams] = useState({...initPage})
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [levelData, setLevelData] = useState([])

  useEffect(() => {
    if (props.productId) {
      getData(props.productId)
    }
  }, [props.productId])

  useEffect(() => {
    if (!loading) {
      setLoading(true)
    }
  }, [loading])

  const getData = async (productId) => {
    let {
      data: {code, data},
    } = await api.getProdutLevelConfig(productId)
    setData(code == 0 ? data : null)
    changeLevelData(data)
  }

  const changeLevelData = (list) => {
    if (Array.isArray(props.levelData)) {
      let res = props.levelData.map((level) => {
        return {
          ...level,
          isDisabled:
            list.findIndex((v) => v.collectionLevel == level.description) > -1,
        }
      })

      setLevelData(res)
    }
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
    if (editItem) {
      data.id = editItem.id
      data.useStatus = 1
    }

    api
      .changeProdutLevelConfig(data)
      .then(({data: {code}}) => {
        if (code == 0) {
          setVisible(false)
          if (data.productId == props.productId) {
            getData(props.productId)
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
        api.removeProdutLevelConfig(item.id).then(({data: {code}}) => {
          if (code == 0) {
            message.success('删除成功')
            getData(props.productId)
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const columns = [
    {title: '催收级别', dataIndex: 'collectionLevel'},
    {title: '最小逾期天数', dataIndex: 'minOverdueDays'},
    {title: '最大逾期天数', dataIndex: 'maxOverdueDays'},
    {
      title: '产品名称',
      dataIndex: 'productId',
      render: (text, record, index) => {
        let findOne = props.collectionProducts.find((one) => one.code == text)
        return findOne ? findOne.description : ''
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
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    setPageParams({...pageParams})
    getData()
  }

  // const paginationConfig = {
  //   total: data.total,
  //   current: pageParams.pageNo,
  //   showSizeChanger: true,
  //   showQuickJumper: true,
  //   defaultPageSize: pageParams.pageSize,
  //   pageSize: pageParams.pageSize,
  //   showTotal: (total) => `共 ${total} 条`,
  //   onChange,
  // }

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
        dataSource={data}
        columns={columns}
        bordered
        pagination={false}
      />

      <EditForm
        visible={visible}
        levelData={levelData}
        collectionProducts={props.collectionProducts}
        setVisible={setVisible}
        loading={loading}
        data={editItem}
        getFormData={getFormData}
      />
    </>
  )
}
