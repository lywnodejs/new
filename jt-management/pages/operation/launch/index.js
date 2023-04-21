import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, Modal} from 'antd'
import Router from 'next/router'
import {CloseCircleOutlined} from '@ant-design/icons'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getData = async () => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appcellconfigservice.appcelllist', [
    {location: 'openApp'},
  ])
  if (code == 0) {
    return data
  }
  return []
}
const breadcrumbs = [{text: '运营配置'}, {text: '开屏配置'}]

function body(props) {
  const [data, setData] = useState(props.data)

  const columns = [
    {title: '名称', dataIndex: 'name'},
    {
      title: '缩略图',
      dataIndex: 'imageUrl',
      render: (v, r, i) => {
        return <img src={v} style={{width: 100}} />
      },
    },
    {
      title: 'IphoneX缩略图',
      dataIndex: 'iphonexImageUrl',
      render: (v, r, i) => {
        return <img src={v} style={{width: 100}} />
      },
    },
    {title: '开始时间', dataIndex: 'startTime'},
    {title: '结束时间', dataIndex: 'endTime'},
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '状态',
      dataIndex: 'online',
      render: (v) => {
        let text = '-'
        if (v == 1) {
          text = '在线'
        }
        if (v == 0) {
          text = '下线'
        }
        return text
      },
    },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => jump2edit(r.id)}>
              编辑
            </Button>
            <Button type="link" onClick={() => deleteItem(i)} danger>
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

  const jump2edit = (id) => {
    let url = '/operation/launch/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
  }

  const deleteItem = (i) => {
    Modal.confirm({
      icon: <CloseCircleOutlined style={{color: '#ff4d4f'}} />,
      content: '删除后不可恢复，请确认是否删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteCommit(data, i)
      },
    })
  }

  const deleteCommit = async (aData, i) => {
    let item = aData[i]
    let {
      data: {code},
    } = await fetch('bank.api.appcellconfigservice.deleteappcell', [
      {id: item.id},
    ])
    if (code == 0) {
      aData.splice(i, 1)
      setData([...aData])
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div style={{marginBottom: 20}}>
        <Button
          type="primary"
          style={{marginRight: 20}}
          onClick={() => jump2edit()}
        >
          添加
        </Button>
      </div>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  // let data = await getData()
  return {data: []}
}

export default body
