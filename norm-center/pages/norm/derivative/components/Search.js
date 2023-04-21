import {Button, Form, Input, Select, Space} from 'antd'
import {SearchOutlined, PlusCircleOutlined} from '@ant-design/icons'
import {useEffect, useState, useRef} from 'react'

const Search = ({indexGroup, search, addRow, onSearchVisible}) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let params = form.getFieldsValue()
    search(params)
  }

  const resetForm = () => {
    form.resetFields()
  }

  useEffect(() => {
    onSearchVisible(form)
  }, [])

  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{groupId: null}}
    >
      <Form.Item label="分组名" name="groupId">
        <Select style={{width: 240}}>
          <Select.Option value={null}>全部</Select.Option>
          {indexGroup.map((v) => {
            return (
              <Select.Option value={v.groupId} key={v.groupId}>
                {v.groupName}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="指标名" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="描述" name="desc">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>
          <Button onClick={resetForm}>重置</Button>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={addRow}>
            新增
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Search
