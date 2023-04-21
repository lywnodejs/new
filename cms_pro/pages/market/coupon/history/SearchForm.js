import React, {useEffect} from 'react'
import {Input, Button, Form, Select, DatePicker} from 'antd'
import api from '~/api/marketing'
const {RangePicker} = DatePicker

const SearchForm = ({onSearch, router}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      businessType: router.query.taskName || '',
    })
  }, [router.query.taskName])

  const getFields = () => {
    const children = [
      <Form.Item label="手机号/借据号" name="likeStr">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="任务名" name="businessType">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item name="status" label="状态">
        <Select>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="0">未使用</Select.Option>
          <Select.Option value="1">已使用</Select.Option>
          <Select.Option value="2">已过期</Select.Option>
        </Select>
      </Form.Item>,
      <Form.Item label="发放日期" name="time">
        <RangePicker />
      </Form.Item>,
      <Form.Item label="使用日期" name="usedTime">
        <RangePicker />
      </Form.Item>,
      <Form.Item label="过期日期" name="expirationTime">
        <RangePicker />
      </Form.Item>,
    ]

    return children
  }

  const onReset = () => {
    form.resetFields()
  }

  const onBatchedExport = async () => {
    try {
      var values = form.getFieldsValue()
      const {time, usedTime, expirationTime} = values
      values.sendStartTime =
        (time && time[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.sendEndTime =
        (time && time[1].format('YYYY-MM-DD HH:mm:ss')) || null

      values.useStartTime =
        (usedTime && usedTime[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.useEndTime =
        (usedTime && usedTime[1].format('YYYY-MM-DD HH:mm:ss')) || null

      values.expireStartTime =
        (expirationTime && expirationTime[0].format('YYYY-MM-DD HH:mm:ss')) ||
        null
      values.expireEndTime =
        (expirationTime && expirationTime[1].format('YYYY-MM-DD HH:mm:ss')) ||
        null

      const {data, status} = await api.export_marketing_history({
        ...values,
      })
      console.log(data.length)
      if (status == 200) {
        var blob = new Blob([data], {
          type: 'application/octet-stream;charset=UTF-8',
        })
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', '发券历史.csv')
        a.click()
        URL.revokeObjectURL(objectUrl)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Form
      form={form}
      onFinish={(values) =>
        onSearch({
          ...values,
        })
      }
      layout="inline"
      className="searchForm"
      initialValues={{
        status: '',
      }}
    >
      {getFields()}
      <Button type="primary" style={{marginRight: 15}} htmlType="submit">
        查询
      </Button>

      <Button style={{marginRight: 15}} onClick={onReset}>
        重置
      </Button>

      <Button
        type="primary"
        style={{marginRight: 15}}
        onClick={onBatchedExport}
      >
        批量导出
      </Button>
    </Form>
  )
}

export default SearchForm
