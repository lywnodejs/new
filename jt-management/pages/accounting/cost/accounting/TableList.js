import React, {useEffect, useState} from 'react'
import {
  Table,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Form,
  Input,
  Alert,
  InputNumber,
  message,
} from 'antd'
import {InfoCircleOutlined} from '@ant-design/icons'
import apiAccounting from '~/api/accounting'
const FormItem = Form.Item
const TableList = ({
  list,
  onPage,
  pageParams,
  totalData,
  fetchCostMothlyList,
}) => {
  const [form] = Form.useForm()
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [visible, setVisible] = useState(false)
  const [nextVisible, setNextVisible] = useState(false)
  const [itemList, setItemList] = useState([])
  const [returnData, setReturnData] = useState([])
  const columns = [
    {
      title: '成本项',
      dataIndex: 'typeString',
      key: 'typeString',
      width: 150,
    },
    {
      title: '预估成本（元）',
      dataIndex: 'planCost',
      key: 'planCost',
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
      title: '实际成本（元）',
      dataIndex: 'realCost',
      key: 'realCost',
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
      title: '操作',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (record, row) => {
        return row.status == 0 && row.type != 0 ? (
          <a onClick={() => business(row)}>核算</a>
        ) : row.type == 0 || row.typeString == '合计' ? (
          <span>-</span>
        ) : (
          <span>已结清</span>
        )
      },
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData.total,
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

  const business = (row) => {
    setVisible(true)
    setItemList(row)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const nextStep = async () => {
    const values = await form.validateFields()
    setNextVisible(true)
    setReturnData(values)
  }
  const submit = async () => {
    let postData = {
      id: itemList.id,
      type: itemList.type,
      planCost: itemList.planCost,
      realCost: Number(returnData.realCost),
      statDate: itemList.statDate,
    }
    if (itemList.typeString == '其他成本') {
      postData = {
        ...postData,
        remark: returnData.remark,
      }
    }
    try {
      const {
        data: {data, code},
      } = await apiAccounting.fetch_update_monthly(postData)
      if (code == 0) {
        message.success('提交成功')
        setNextVisible(false)
        setVisible(false)
        fetchCostMothlyList()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const goBack = () => {
    setNextVisible(false)
  }
  return (
    <div>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
      <Modal
        title="核算"
        visible={visible}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={nextStep}>
            下一步
          </Button>,
        ]}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} key={Date.now} name="form" style={{marginLeft: 20}}>
          <FormItem>
            <p style={{fontWeight: 500, fontSize: 22, color: '#333333'}}>
              {itemList.typeString}
            </p>
          </FormItem>
          <FormItem>
            <p>核算周期：{itemList.statDate}</p>
          </FormItem>
          <FormItem>
            <p>
              预估成本：{itemList.planCost ? `${itemList.planCost}元` : '-'}
            </p>
          </FormItem>
          <FormItem
            label="实际成本"
            name="realCost"
            style={{marginLeft: -10}}
            rules={[
              {required: true, message: '请输入实际成本'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                  if (value && !reg.test(value)) {
                    return Promise.reject(
                      '请输入大于等于0的数，并且最多保留2位小数',
                    )
                  }
                  if (value > 999999999999) {
                    return Promise.reject('输入实际成本过大，请重新输入')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <InputNumber style={{width: 150}} />
          </FormItem>
          <span style={{position: 'absolute', bottom: 125, left: 270}}>元</span>
          {itemList.typeString == '其他成本' ? (
            <FormItem label="备注" name="remark">
              其他成本-
              <Input style={{width: 150}} placeholder="选填" />
            </FormItem>
          ) : null}
        </Form>
        <span style={{color: '#aeaeae'}}>
          （请在账单结清后录入实际成本，提交后【应付】中即不再统计此项）
        </span>
      </Modal>

      <Modal
        title="操作确认"
        visible={nextVisible}
        footer={[
          <Button key="back" onClick={goBack}>
            返回修改
          </Button>,
          <Button key="submit" type="primary" onClick={submit}>
            确认提交
          </Button>,
        ]}
        onCancel={() => setNextVisible(false)}
        maskClosable={false}
        destroyOnClose
      >
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#d1e9ff',
            color: '#3da2ff',
            height: 30,
            margin: '0 auto',
            paddingTop: 5,
          }}
        >
          <InfoCircleOutlined style={{paddingRight: 5}} />
          提交后，状态即变为已结清，不可再修改
        </div>
        <div style={{marginLeft: '30%'}}>
          <p style={{fontWeight: 400, fontSize: 22, marginTop: 20}}>
            {itemList.typeString}
          </p>
          <p style={{marginTop: 20}}>
            核算周期:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{itemList.statDate}
          </p>
          <p style={{marginTop: 20}}>
            实际成本:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{returnData.realCost}&nbsp;元
          </p>
          {itemList.typeString == '其他成本' ? (
            <p style={{marginTop: 20}}>
              备注:其他成本-&nbsp;&nbsp;{returnData.remark}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}

export default TableList
