import React, {useState, useContext, useEffect} from 'react'
import {Button, DatePicker, Form, Input, Checkbox, Space, Table} from 'antd'
import {BaseAddContext} from '../index'
import {SearchOutlined} from '@ant-design/icons'
import moment from 'moment'
import styles from './index.less'
import CopyModal from '~/components/common/copyModal'
import fetch from '~/utils/fetch'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const getSqlData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.search',
    [params],
  )
  if (code == 0) {
    return data
  }
  return {list: []}
}

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.startDate = moment(time[0]).format('YYYY-MM-DD')
      params.endDate = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })

    props.search(params)
  }

  const resetForm = () => {
    form.resetFields()
  }

  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{code: null}}
    >
      <Form.Item label="名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="用户名" name="username">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="创建日期" name="time">
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>

          <Button onClick={resetForm}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default function DataBase(props) {
  const values = useContext(BaseAddContext)
  const [data, setData] = useState({list: [], totalSize: 0})
  const [searchParams, setSearchParams] = useState({})
  const [showModal, setSowModal] = useState(false)
  const [showData, setShowData] = useState()
  const [modalTit, setModalTit] = useState()

  useEffect(() => {
    updateList()
  }, [])

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getSqlData(params)
    setData(data)
  }

  const setShowModalData = (data, title) => {
    setShowData(data)
    setModalTit(title)
    setSowModal(!!data)
  }

  const isNewAdd = (time) => {
    let diff = moment().diff(moment(time), 'day', true)
    return diff <= 3
  }

  const onClickItem = (r, e) => {
    values.selectDataSource('data', r, e)
  }

  const columns = [
    {
      width: 50,
      render: (t, r, i) => {
        return (
          <Checkbox
            checked={
              values.selectedItem &&
              values.selectedItem.type === 'data' &&
              values.selectedItem.item.id == r.id
            }
            className={styles.checkbox}
            onChange={(e) => {
              e.preventDefault()
              e.stopPropagation()
              values.selectDataSource('data', r, e)
            }}
          />
        )
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      onCell: () => {
        return {
          style: {
            minWidth: 100,
          },
        }
      },
      render: (t, r, i) => {
        const isNew = isNewAdd(r.updateTime)
        return (
          <React.Fragment>
            <span className={isNew ? styles.newTips : ''}>{t}</span>
          </React.Fragment>
        )
      },
    },
    {title: '主机', dataIndex: 'hostname'},
    {title: '端口', dataIndex: 'port'},
    {title: '用户名', dataIndex: 'userName'},
    {title: '创建日期', dataIndex: 'createTime'},
  ]

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <React.Fragment>
      <Search search={onSearch} />

      <Table
        onRow={(record) => {
          return {
            onClick: (event) => {
              onClickItem(record, event)
            }, // 点击行
          }
        }}
        rowClassName={(r, i) => {
          return values.selectedItem &&
            values.selectedItem.type === 'data' &&
            values.selectedItem.item.id == r.id
            ? 'ant-table-row-selected'
            : ''
        }}
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />

      <CopyModal
        show={showModal}
        data={showData}
        title={modalTit}
        close={setShowModalData}
      />
    </React.Fragment>
  )
}
