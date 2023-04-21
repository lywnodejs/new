import React from 'react'
import {Input, Button, Form} from 'antd'
import Router from 'next/router'
const SearchForm = ({
  onSearch,
  onAdd,
  onDelete,
  onSave,
  activeCategoryKey,
  id,
  productId,
  partialPro,
}) => {
  const [form] = Form.useForm()

  const getFields = () => {
    const children = [
      <Form.Item label="关键字" name="keyword">
        <Input placeholder="请输入" />
      </Form.Item>,
    ]

    return children
  }

  const onReset = () => {
    form.resetFields()
  }
  const onTestRun = () => {
    let url = `/decision/edit/form?page=test&category=${activeCategoryKey}&productId=${productId}&id=${id}`
    Router.push(url)
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
      initialValues={{}}
    >
      {getFields()}
      <Button type="primary" style={{marginRight: 15}} htmlType="submit">
        查询
      </Button>

      <Button style={{marginRight: 15}} onClick={onReset}>
        重置
      </Button>
      {!partialPro && (
        <Button
          type="primary"
          style={{marginRight: 15}}
          onClick={onTestRun}
          disabled={id == 'new'}
        >
          测试运行
        </Button>
      )}
      {!partialPro && (
        <Button type="primary" style={{marginRight: 15}} onClick={onAdd}>
          新增
        </Button>
      )}
      {!partialPro && (
        <Button type="primary" style={{marginRight: 15}} onClick={onDelete}>
          删除
        </Button>
      )}
      {!partialPro && (
        <Button
          type="primary"
          onClick={onSave}
          style={{background: '#fa8c16', borderColor: '#fa8c16'}}
        >
          保存
        </Button>
      )}
    </Form>
  )
}

export default SearchForm
