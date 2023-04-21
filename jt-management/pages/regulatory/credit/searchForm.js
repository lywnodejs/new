import {Button, Card, DatePicker, Form, Input, message, Select} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import apiRegulatory from '~/api/regulatory'
const {RangePicker} = DatePicker

import {REPORT_TYPE} from '~/utils/const'
import moment from 'moment'

export default function (props) {
  const [form] = Form.useForm()

  const [p_category, setPCategory] = useState([])
  const [c_category, setCCategory] = useState([])

  useEffect(() => {
    let p_arr = props.allCategory.filter((v) => !v.pid)
    setPCategory(p_arr)
  }, [props.allCategory])

  const changePCategory = (val) => {
    console.log(val)
    if (val === null) {
      return setCCategory([])
    }
    let c_arr = props.allCategory.filter((v) => v.pid == val)
    setCCategory(c_arr)
  }

  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (Array.isArray(time) && time.length == 2) {
      params.startNeedReportDate = moment(time[0]).format('YYYY-MM-DD')
      params.endNeedReportDate = moment(time[1]).format('YYYY-MM-DD')
    }
    props.search(params)
  }

  const resetForm = () => {
    form.resetFields()
    onSearch()
  }

  const exportData = async () => {
    // message.error('功能未实现')
    let {
      data: {code, data},
    } = await apiRegulatory.exportCreditReportList()
    if (code == 0) {
      window.open(data.fileBase64)
    }
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        name="search"
        initialValues={{
          status: null,
          catId: null,
          subCatId: null,
          productId: null,
        }}
        layout="inline"
      >
        <Form.Item label="借据号" name="orderNum">
          <Input placeholder="借据号" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="手机号" name="mobilePhone">
          <Input placeholder="手机号" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="债务人名称" name="name">
          <Input placeholder="债务人名称" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="债务人身份标识号码" name="idCard">
          <Input placeholder="债务人身份标识号码" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="产品名称" name="productId">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            {props.allProducts.map((v, i) => {
              return (
                <Select.Option value={v.productId} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="信息记录大类" name="catId">
          <Select style={{width: 150}} onChange={changePCategory}>
            <Select.Option value={null}>全部</Select.Option>
            {p_category.map((v, i) => {
              return (
                <Select.Option value={v.id} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="信息记录类型" name="subCatId">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            {c_category.map((v, i) => {
              return (
                <Select.Option value={v.id} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="上报标识" name="status">
          <Select style={{width: 120}}>
            <Select.Option value={null}>全部</Select.Option>
            {REPORT_TYPE.map((v, i) => {
              return (
                <Select.Option value={v.key} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="应上报日期" name="time">
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={resetForm}>重置</Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={exportData}>
            导出上报文件
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => props.importData(true)}>
            导入反馈文件
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
