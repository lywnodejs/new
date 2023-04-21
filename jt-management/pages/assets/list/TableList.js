import React, {useEffect, useState} from 'react'
import {Table, Button, Card, Row, Col, Select, message, Form, Modal} from 'antd'
import Router from 'next/router'
import apiAssets from '~/api/assets'
import _ from 'lodash'

const TableList = ({
  list,
  onPage,
  pageParams,
  statusList,
  productList,
  totalData,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [exportData, setExportData] = useState([])
  const [obtainList, setObtainList] = useState([])
  const timeConversion = (times) => {
    let date = new Date(times)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  }
  const columns = [
    {
      title: '借据号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '借款人',
      dataIndex: 'realName',
      key: 'realName',
      width: 150,
    },

    {
      title: '借款周期',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            {row.grantFinishTime != '' ? (
              <p>借：{timeConversion(row.grantFinishTime)}</p>
            ) : null}
            {row.finalRepayDate != '' ? (
              <p>还：{timeConversion(row.finalRepayDate)}</p>
            ) : null}
          </div>
        )
      },
    },
    {
      title: '产品',
      dataIndex: 'productId',
      key: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },

    {
      title: '借据总额（元）',
      dataIndex: 'signLoanAmount',
      key: 'signLoanAmount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '借据余额（元）',
      dataIndex: 'capitalAmount',
      key: 'capitalAmount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '剩余未还（元）',
      dataIndex: 'surplusPayableAmount',
      key: 'surplusPayableAmount',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDay',
      key: 'overdueDay',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '借据状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        let findOne = statusList.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '资产处置标志',
      dataIndex: 'protectionTypeString',
      key: 'protectionTypeString',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => checkDetail(record)}>
              详情
            </Button>
          </>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/assets/list/detail?orderNum=${record.orderNum}&protectionType=${record.protectionType}`
    Router.push(url)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData != null ? totalData.total : null,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }

  const onSelect = (record, selected) => {
    const keys = [...selectedRowKeys]
    const rows = [...selectedRows]

    if (selected) {
      keys.push(record.id)
      rows.push(record)
    } else {
      _.remove(keys, (i) => {
        return i === record.id
      })
      _.remove(rows, (item) => {
        return item.id === record.id
      })
    }
    const mySelectedRowKeys = _.uniq(keys)
    const mySelectedRows = _.uniqBy(rows, 'id')

    setSelectedRowKeys(mySelectedRowKeys)
    setSelectedRows(mySelectedRows)
  }

  const onSelectAll = (selected, sRows, changeRows) => {
    let keys = [...selectedRowKeys]
    let rows = [...selectedRows]

    const changeRowKeys = _.map(changeRows, 'id')
    if (selected) {
      changeRows.forEach((item) => {
        keys = _.uniq(_.concat(keys, [item.id]))
        rows = _.uniqBy(_.concat(rows, [item]))
      })
    } else {
      changeRows.forEach((item) => {
        _.remove(keys, (i) => {
          return i === item.id
        })
        _.remove(rows, (k) => {
          return _.includes(changeRowKeys, k.id)
        })
      })
    }

    setSelectedRowKeys(keys)
    setSelectedRows(rows)
  }

  const handleExport = async () => {
    let newRows = []
    if (selectedRowKeys.length < 1) {
      return message.error('请先选择导出项')
    }
    const values = await form.validateFields()
    if (values.fileType == undefined) {
      return message.error('请选择导出类型')
    }

    selectedRows.forEach((item) => {
      newRows.push(item.orderNum)
    })
    setObtainList(newRows)
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_cheek_export({
        fileType: values.fileType,
        orderNums: newRows,
      })
      if (code == 0) {
        setVisible(true)
        setExportData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_export_list({
        fileType: values.fileType,
        orderNums: obtainList,
      })
      if (code == 0) {
        message.success('文件生成中，请稍后至【导出记录】中下载')
        setVisible(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Card>
      <Row>
        <Col span={1} style={{marginTop: 5}}>
          <span>
            已选择
            <span style={{color: '#26b3ff'}}>
              {Array.isArray(selectedRowKeys) ? selectedRowKeys.length : 0}
            </span>
            项
          </span>
        </Col>
        <Col span={3}>
          <Form
            name="form"
            form={form}
            style={{marginLeft: 20}}
            initialValues={{
              fileType: null,
            }}
          >
            <Form.Item name="fileType" label="">
              <Select style={{width: 200}}>
                <Select.Option value={null}>选择导出类型</Select.Option>
                <Select.Option value={4}>司法诉讼</Select.Option>
                <Select.Option value={3}>资产核销</Select.Option>
                <Select.Option value={2}>资产转让</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            onClick={handleExport}
            style={{marginLeft: 30}}
          >
            导出
          </Button>
        </Col>
      </Row>

      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={totalData == null ? [] : list}
        bordered
        rowSelection={{
          selectedRowKeys,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
        }}
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
      <Modal
        title="操作确认"
        visible={visible}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false)
            }}
          >
            返回修改
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            确认提交
          </Button>,
        ]}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <p style={{fontWeight: 'bold'}}>导出{`${exportData.typeString}`}文件</p>
        <p>共{`${exportData.iouCount}`}个借据</p>
      </Modal>
    </Card>
  )
}

export default TableList
