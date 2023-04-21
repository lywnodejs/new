import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, Modal} from 'antd'
import Router from 'next/router'
import {CloseCircleOutlined} from '@ant-design/icons'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appcellconfigservice.appcelllist', [
    {location: 'banner'},
  ])
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '运营配置'}, {text: 'banner配置'}]

function body(props) {
  let [data, setData] = useState(props.data)
  const columns = [
    {title: '排序', dataIndex: 'sortId'},
    {title: '活动名称', dataIndex: 'name'},
    {
      title: '缩略图',
      dataIndex: 'imageUrl',
      render: (v, r, i) => {
        return <img src={v} style={{width: 200}} />
      },
    },
    {title: '开始时间', dataIndex: 'startTime'},
    {title: '结束时间', dataIndex: 'endTime'},
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '平台',
      render: (v, r, i) => {
        return (
          <Space>
            <span> {r.enableAndroid == 1 ? '安卓端' : ''}</span>
            <span> {r.enableIos == 1 ? 'ios端' : ''}</span>
            <span> {r.enableMiniApp == 1 ? '小程序' : ''}</span>
          </Space>
        )
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
            <Button type="link" onClick={() => deleteBanner(i)} danger>
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
    let url = '/operation/banner/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
  }

  const deleteBanner = (i) => {
    Modal.confirm({
      icon: <CloseCircleOutlined style={{color: '#ff4d4f'}} />,
      content: '删除后不可恢复，请确认是否删除该banner？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteItem(data, i)
      },
    })
  }

  const deleteItem = async (aData, i) => {
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
        <Button type="primary" onClick={() => jump2edit()}>
          添加banner
        </Button>
      </div>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        dataSource={data}
        columns={columns}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
