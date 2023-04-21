import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {Table, Card, message} from 'antd'
import fetch from '~/utils/fetch'
import Router from 'next/router'
import api from '~/utils/api'
import Modal from 'antd/lib/modal/Modal'

const breadcrumbs = [{text: '用户运营'}, {text: '公众号模板消息管理'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

function body(props) {
  const [list, setList] = useState([])
  const [total, setTotal] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [productData, setProductData] = useState([])
  const [startUsingVisible, setStartUsingVisible] = useState(false)
  const [isUsing, setIsUsing] = useState(false)
  const [rowId, setRowId] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async (params = {...pageParams}) => {
    let {
      data: {code, data},
    } = await fetch('bank.api.standard.webchattemplateservice.list', [params])
    if (code == 0) {
      setList(data.list)
      setTotal(data.totalSize)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.getProductList()
        if (code == 0) {
          setProductData(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }

  const onPage = async () => {
    getData()
  }
  const pagination = {
    defaultCurrent: 1,
    total: total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }

  const handleOk = async (row) => {
    let postData = {
      id: rowId,
      status: isUsing == true ? 1 : 0,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.standard.webchattemplateservice.updatestatus', [
      postData,
    ])
    if (code == 0) {
      message.success('状态操作成功')
      getData()
      handleCancel()
    }
  }
  const handleCancel = () => {
    setStartUsingVisible(false)
  }
  const startStop = (row) => {
    setStartUsingVisible(true)
    setRowId(row.id)
    if (row.status == 1) {
      setIsUsing(false)
    } else {
      setIsUsing(true)
    }
  }
  const edit = (row) => {
    Router.push(`/user-operation/public/detail?id=${row.id}`)
  }

  const style = {marginLeft: 10}
  const columns = [
    {
      title: '序号',
      dataIndex: 'xu',
      key: 'xu',
      width: 150,
      render: (v, r, i) => i + 1,
    },
    {
      title: '模板标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },

    {
      title: 'First文案',
      dataIndex: 'firstContent',
      key: 'firstContent',
      width: 150,
    },
    {
      title: 'Remark文案',
      dataIndex: 'remarkContent',
      key: 'remarkContent',
      width: 150,
    },
    {
      title: '跳转链接',
      dataIndex: 'url',
      key: 'url',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'productIds',
      key: 'productIds',
      width: 150,
      render: (text) => {
        var arr = text.indexOf(',') === -1 ? text.split() : text.split(',')
        var arr1 = []
        productData.map((e) => {
          if (arr.includes(String(e.id))) arr1.push(e.name)
        })
        return arr1.toString()
      },
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text) => {
        switch (text) {
          case 1:
            return '启用'
          case 0:
            return '停用'
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 180,
      fixed: 'right',
      render: (record, row) => {
        return (
          <span>
            <a onClick={() => edit(row)}>编辑</a>
            {row.status == 1 ? (
              <a style={style} onClick={() => startStop(row)}>
                停用
              </a>
            ) : (
              <a style={style} onClick={() => startStop(row)}>
                启用
              </a>
            )}
          </span>
        )
      },
    },
  ]
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          bordered
          pagination={pagination}
          scroll={{y: '100%', x: '100%'}}
        />
        <Modal
          visible={startUsingVisible}
          onCancel={handleCancel}
          onOk={handleOk}
        >
          {isUsing ? (
            <p>确定启用该模板消息吗？启用后，可推送公众号模板消息。</p>
          ) : (
            <p>确定停用该模板消息吗？停用后，不可推送公众号模板消息。</p>
          )}
        </Modal>
      </Card>
    </Layout>
  )
}

export default body
