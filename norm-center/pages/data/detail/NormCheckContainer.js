import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {LockOutlined} from '@ant-design/icons'
import {Row, Col, Button, Form, Select, Input, Card, Tabs} from 'antd'
import Router, {withRouter} from 'next/router'

function body({router}) {
  const [keywordForm] = Form.useForm()

  useEffect(() => {
    function fetchData() {
      setBreadcrumbs([...breadcrumbs])
    }
    fetchData()
  }, [])

  const onSearchKeyword = () => {}

  const changeDataType = () => {}
  const onSave = () => {
    setVisible(true)
  }
  return (
    <Card>
      <Form
        form={keywordForm}
        onFinish={onSearchKeyword}
        initialValues={{
          keyword: '',
        }}
      >
        <Form.Item
          label="名称"
          name="keyword"
          rules={[{required: true, message: '请输入名称'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="数据库类型" name="keyword">
          <Select
            style={{width: '160px'}}
            onChange={(val) => changeDataType(val)}
          >
            <Select.Option value="MySQL">MySQL</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="主机"
          name="keyword"
          rules={[{required: true, message: '请输入主机'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="端口"
          name="keyword"
          rules={[{required: true, message: '请输入端口'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="数据库名"
          name="keyword"
          rules={[{required: true, message: '请输入数据库名'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="用户名"
          name="keyword"
          rules={[{required: true, message: '请输入用户名'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="passwd"
          rules={[{required: true, message: '请输入密码'}]}
        >
          <Input.Password
            placeholder={'请输入密码'}
            size="large"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          测试连接
        </Button>
        <Button style={{marginRight: 15}} onClick={onSave}>
          保存
        </Button>
      </Form>
    </Card>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
