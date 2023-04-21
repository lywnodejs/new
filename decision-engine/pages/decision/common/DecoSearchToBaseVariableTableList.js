import React, {useState} from 'react'
import {Form, Input, Button} from 'antd'
import {inRange} from 'lodash'
import BaseVariableTableList from './BaseVariableTableList'

function DecoSearchToBaseVariableTableList(props) {
  const {
    onSearch,
    list,
    onPage,
    pageParams,
    onRowConfig,
    rowSelectionConfig,
    form,
    markId,
    // inputDefaultValue,
  } = props
  // console.log('inputDefaultValue', inputDefaultValue.keyword)
  const [reset, setReset] = useState(false)

  const onReset = () => {
    setReset(true)
    form.resetFields()
  }

  return (
    <>
      <Form
        form={form}
        onFinish={onSearch}
        layout="inline"
        initialValues={{keyword: ''}}
        autoComplete="off"
      >
        <Form.Item name="keyword">
          <Input
            placeholder={'请输入关键词'}
            // defaultValue={reset ? null : inputDefaultValue.keyword}
          />
        </Form.Item>
        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          查询
        </Button>

        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>
      </Form>
      <BaseVariableTableList
        {...{
          list,
          onPage,
          pageParams,
          sizeConfig: 'small',
          onRowConfig,
          rowSelectionConfig,
          markId,
        }}
      />
    </>
  )
}

DecoSearchToBaseVariableTableList.getInitialProps = async () => ({})

export default DecoSearchToBaseVariableTableList
