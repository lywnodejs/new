import {Layout} from '~/components/Layout'
import {useEffect} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space} from 'antd'
import Router from 'next/router'
import {CHANNEL_TYPE} from '~/utils/const'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getData = async () => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appupgradeservice.getappupgradelist', [])
  if (code == 0) {
    return data || []
  }
  return []
}

const breadcrumbs = [{text: '运营配置'}, {text: 'APP更新管理'}]

function body(props) {
  const columns = [
    {title: '渠道号', render: (v, r, i) => i + 1},
    {
      title: '渠道名',
      dataIndex: 'channelName',
      render: (v, r, i) => {
        let item = CHANNEL_TYPE.find((item) => item.value == v)
        return (item && item.name) || ''
      },
    },
    {title: '应用名', dataIndex: 'appName'},
    {title: '版本', dataIndex: 'mainVersion'},
    {title: '更新时间', dataIndex: 'startTime'},
    {title: '操作人', dataIndex: 'operatorName'},
    {
      title: '操作',
      render: (v, r) => {
        return (
          <Space>
            <Button type="link" onClick={() => jump2edit(r.id)}>
              更新
            </Button>
            {r.channelName != 'appstore' && (
              <Button type="link" onClick={() => download(r.downloadUrl)}>
                下载包
              </Button>
            )}
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const jump2edit = (id) => {
    let url = '/operation/update/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
  }

  const download = (url) => {
    window.open(url)
    // location.href = url
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div style={{marginBottom: 20}}>
        <Button type="primary" onClick={() => jump2edit()}>
          添加渠道
        </Button>
      </div>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        dataSource={props.data}
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
