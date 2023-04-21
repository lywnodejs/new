import {Form, Input, Button, Table} from 'antd'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const getData = async (params = {}) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
    [{...params, ...pageParams, indicatorsType: 'base'}],
  )

  if (code == 0) {
    return data
  }
  return {totalSize: 0, list: []}
}

function RuleSearchTableList({onRowClick}) {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState({totalSize: 0, list: []})

  useEffect(() => {
    updateList()
  }, [])

  const onReset = () => {
    form.resetFields()
  }

  const onSearch = (params) => {
    const {keyword: key} = params
    pageParams.pageNo = 1
    updateList(key != null && key != '' ? {key} : {})
  }

  const updateList = async (params = {}) => {
    let data = await getData(params)
    setDataSource(data)
  }

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    updateList()
  }
  const pagination = {
    defaultCurrent: 1,
    total: dataSource.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  const columns = [
    {
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
      width: '10%',
      editable: true,
    },
    {
      title: '指标中文名',
      dataIndex: 'nameCn',
      key: 'nameCn',
      width: '15%',
      editable: true,
    },
    {
      title: '指标名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      editable: true,
    },

    {
      title: '类型',
      dataIndex: 'columnType',
      key: 'columnType',
      width: '8%',
      editable: true,
    },

    {
      title: '默认值',
      dataIndex: 'columnDefaultValue',
      key: 'columnDefaultValue',
      width: '20%',
      editable: true,
    },

    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      editable: true,
    },
  ]

  return (
    <>
      <Form
        form={form}
        onFinish={onSearch}
        name="search"
        layout="inline"
        initialValues={{
          keyword: '',
        }}
      >
        <Form.Item name="keyword" style={{width: '50%'}}>
          <Input placeholder="关键字搜索" />
        </Form.Item>
        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          查询
        </Button>

        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>
      </Form>

      <Table
        bordered
        dataSource={dataSource.list}
        rowKey="id"
        columns={columns || []}
        pagination={pagination}
        // scroll={{y: '100%', x: '100%'}}
        onRow={(record) => {
          return {
            onClick: (event) => {
              onRowClick(record)
            },
          }
        }}
      />
    </>
  )
}

export default RuleSearchTableList
