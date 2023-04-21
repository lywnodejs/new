import {Button, Card, DatePicker, Form, Input, message, Select} from 'antd'
import React, {useEffect, useState} from 'react'
const {RangePicker} = DatePicker
import apiRegulatory from '~/api/regulatory'
import {SECOND_REPORT_TYPE, SECOND_REPORT_MSG_TYPE} from '~/utils/const'
import moment from 'moment'

export default function (props) {
  const [form] = Form.useForm()

  useEffect(() => {
    let firstDay = moment(moment().format('YYYY-MM') + '-01')
    let openTime = [firstDay, moment()]
    form.setFieldsValue({
      openTime,
      reportTime: [moment(), moment()],
    })
    onSearch()
  }, [])

  const onSearch = () => {
    let {openTime, reportTime, ...params} = form.getFieldsValue()
    if (Array.isArray(openTime) && openTime.length == 2) {
      params.startCreateAccountDate = moment(openTime[0]).format('YYYY-MM-DD')
      params.endCreateAccountDate = moment(openTime[1]).format('YYYY-MM-DD')
    }
    if (Array.isArray(reportTime) && reportTime.length == 2) {
      params.startNeedReportDate = moment(reportTime[0]).format('YYYY-MM-DD')
      params.endNeedReportDate = moment(reportTime[1]).format('YYYY-MM-DD')
    }

    props.search(params)
  }

  const resetForm = () => {
    form.resetFields()
    onSearch()
  }

  const exportData = async () => {
    let {reportTime} = form.getFieldsValue()

    const params = {}

    if (Array.isArray(reportTime) && reportTime.length == 2) {
      params.startNeedReportDate = moment(reportTime[0]).format('YYYY-MM-DD')
      params.endNeedReportDate = moment(reportTime[1]).format('YYYY-MM-DD')
      let {
        data: {code, data},
      } = await apiRegulatory.exportSecondReportList(params)
      if (code == 0) {
        getFileAndDownload(data.fileName, data.fileBase64)
      }
    } else {
      message.error('请选择上报日期')
    }
  }

  const getFileAndDownload = (fileName, url) => {
    var x = new XMLHttpRequest()
    x.open('GET', url, true)
    x.responseType = 'blob'
    x.onload = function (e) {
      var blob = x.response
      if ('msSaveOrOpenBlob' in navigator) {
        //IE导出
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        var a = document.createElement('a')
        a.download = fileName
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
    x.send()
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        name="search"
        initialValues={{
          status: null,
          catId: null,
        }}
        layout="inline"
      >
        <Form.Item label="存款人姓名" name="name">
          <Input placeholder="存款人姓名" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="手机号" name="mobilePhone">
          <Input placeholder="手机号" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="存款人身份证件号码" name="idCard">
          <Input placeholder="存款人身份证件号码" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="账号" name="cardNo">
          <Input placeholder="账号" style={{width: 150}} />
        </Form.Item>

        <Form.Item label="信息类型" name="catId">
          <Select style={{width: 150}}>
            <Select.Option value={null}>全部</Select.Option>
            {props.allCategory.map((v, i) => {
              return (
                <Select.Option value={v.id + ''} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="上报状态" name="status">
          <Select style={{width: 120}}>
            <Select.Option value={null}>全部</Select.Option>
            {SECOND_REPORT_TYPE.map((v, i) => {
              return (
                <Select.Option value={v.key} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="开户日期" name="openTime">
          <RangePicker />
        </Form.Item>

        <Form.Item label="应上报日期" name="reportTime">
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
      </Form>
    </Card>
  )
}
