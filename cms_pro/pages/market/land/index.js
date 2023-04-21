import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, message, Form, Input, Select, Modal} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'
import QRCode from 'qrcode.react'

const pageParams = {
  pageNo: 1,
  pageSize: 20,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.launchservice.selectlaunchbypageno', [params])
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '营销管理'}, {text: '投放页管理'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }
  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{status: ''}}
    >
      <Form.Item label="编号" name="id">
        <Input placeholder="编号" />
      </Form.Item>

      <Form.Item label="页面名称" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <Input />
      </Form.Item>

      <Form.Item label="状态" name="status">
        <Select style={{width: 80}}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="1">在线</Select.Option>
          <Select.Option value="0">下线</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          搜索
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [qrCode, setQRCode] = useState(null)

  const imgRef = useRef()

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const showQRCode = (url) => {
    setQRCode(url)
  }

  const columns = [
    {title: '编号', dataIndex: 'id'},
    {title: '页面名称', dataIndex: 'name'},
    {title: '地址', dataIndex: 'launchUrl'},
    {title: '更新时间', dataIndex: 'updateTime'},
    {title: '备注', dataIndex: 'remark'},
    {
      title: '上线状态',
      dataIndex: 'status',
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
      render: (v, r) => {
        return (
          <Space>
            <Button type="link" onClick={() => jump2edit(r.id)}>
              编辑
            </Button>
            <Button type="link" onClick={() => copyItem(r.id)}>
              复制
            </Button>
            <Button type="link" onClick={() => showQRCode(r)}>
              生成二维码
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
    let url = '/market/land/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
  }

  const copyItem = async (id) => {
    let {
      data: {code, data},
    } = await fetch('bank.api.launchservice.copylaunchbyid', [{id}])
    if (code == 0) {
      message.success('复制成功')
      onChangePage(1)
    }
  }

  const saveImg = () => {
    let canvas = imgRef.current.children[0]
    var image = canvas.toDataURL()

    function downloadFile(url, name) {
      var a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      let clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    }
    downloadFile(image, qrCode.name)
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
      <Search search={onSearch} />
      <div style={{marginBottom: 20}}>
        <Button
          type="primary"
          style={{marginRight: 20}}
          onClick={() => jump2edit()}
        >
          新建页面
        </Button>
      </div>
      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />

      <Modal
        title="生成二维码"
        visible={qrCode && qrCode.launchUrl}
        footer={null}
        onCancel={() => setQRCode(null)}
        style={{textAlign: 'center'}}
      >
        <div style={{marginBottom: 20}} ref={imgRef}>
          <QRCode
            size={250}
            includeMargin={true}
            value={(qrCode && qrCode.launchUrl) || ''}
          />
        </div>

        <Button type="primary" onClick={saveImg}>
          保存图片
        </Button>
      </Modal>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
