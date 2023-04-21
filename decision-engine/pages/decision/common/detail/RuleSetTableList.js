import React, {useEffect, useState, useContext, useRef} from 'react'
import {Table, Form, Input, Tooltip, Select, InputNumber} from 'antd'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'
const EditableContext = React.createContext()

const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  onEditStatus,
  rowIndex,
  partialPro,
  ...restProps
}) => {
  const inputRef = useRef()
  const form = useContext(EditableContext)

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
    }
  }, [record])

  const save = async (e) => {
    try {
      handleSave({...record, ...form.getFieldsValue()})
      const values = await form.validateFields()
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const changeExpectedValue = (val) => {
    form.setFieldsValue({
      [dataIndex]: val,
    })
    handleSave({...record, expectedValue: val})
  }
  const changeUseStatus = (val) => {
    form.setFieldsValue({
      [dataIndex]: val,
    })
    onEditStatus({...record, useStatus: val}, rowIndex)
    handleSave({...record, useStatus: val})
  }
  let childNode = children

  if (editable) {
    childNode = (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required:
              dataIndex == 'rejectCode' || dataIndex == 'rejectDays'
                ? false
                : true,
            message: `${title}为必填项.`,
          },
        ]}
      >
        {dataIndex === 'expectedValue' ? (
          <Select
            onChange={(val) => changeExpectedValue(val)}
            disabled={partialPro}
          >
            <Select.Option value="1">通过</Select.Option>
            <Select.Option value="0">拒绝</Select.Option>
          </Select>
        ) : dataIndex === 'useStatus' ? (
          <Select
            onChange={(val) => changeUseStatus(val)}
            disabled={partialPro}
          >
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">禁用</Select.Option>
          </Select>
        ) : !partialPro ? (
          dataIndex === 'rejectDays' ? (
            <InputNumber
              style={{width: '60px'}}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          ) : (
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          )
        ) : (
          record[dataIndex]
        )}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const RuleSetTableList = ({
  list,
  appendToRuleIds,
  onEditRule,
  setList,
  onEditStatus,
  ruleIds,
  partialPro,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState([])
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')

  useEffect(() => {
    function fetchData() {
      Array.isArray(list.simpleRuleList) &&
        list.simpleRuleList.length &&
        list.simpleRuleList.forEach((one, index) => {
          one.expectedValue = String(one.expectedValue)
          one.useStatus = String(one.useStatus)
          one.index = index
          one.key = String(one.index)
          if (
            (!one.id && one.id != 0) ||
            (one.id && String(one.id).includes('new'))
          ) {
            one.id = `new${one.index}`
          }
        })
      list.simpleRuleList = list.simpleRuleList || []
      setData([...list.simpleRuleList])
    }
    fetchData()
  }, [list])

  useEffect(() => {
    function fetchData() {
      if (!ruleIds.length) {
        setSelectedRowKeys([])
      }
    }
    fetchData()
  }, [ruleIds])

  const rowSelection = {
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v, row) => {
      let keys = []
      if (Array.isArray(row) && row.length) {
        keys = row.map((item) => item.index)
      }
      setSelectedRowKeys(v)
      appendToRuleIds(keys)
    },
  }

  const onShowAllScriptSource = (scriptSource) => {
    setScriptSourceVisible(true)
    setScriptSource(scriptSource)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNum',
      key: 'seqNum',
      width: 80,
      render: (text, record, index) => {
        return index + 1
      },
    },
    {
      title: '规则编号',
      dataIndex: 'simpleRuleCode',
      key: 'simpleRuleCode',
      width: 150,
      editable: true,
    },
    {
      title: '规则名称',
      dataIndex: 'simpleRuleName',
      key: 'simpleRuleName',
      width: 150,
      editable: true,
    },
    {
      title: '规则',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (scriptSource, record, index) => (
        <Tooltip placement="topLeft" title={scriptSource}>
          {!partialPro ? (
            <Input
              value={scriptSource}
              onClick={() => onEditRule({...record, i: index})}
            />
          ) : (
            <span
              onClick={() => onShowAllScriptSource(scriptSource)}
              style={{color: '#1890ff', cursor: 'pointer'}}
            >
              {scriptSource}
            </span>
          )}
        </Tooltip>
      ),
    },
    {
      title: '满足条件是否通过',
      dataIndex: 'expectedValue',
      key: 'expectedValue',
      width: 110,
      editable: true,
    },
    {
      title: '被拒编码',
      dataIndex: 'rejectCode',
      key: 'rejectCode',
      width: 150,
      editable: true,
    },
    {
      title: '被拒后X天内不可进件',
      dataIndex: 'rejectDays',
      key: 'rejectDays',
      width: 80,
      editable: true,
    },
    {
      title: '状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      width: 110,
      editable: true,
    },
  ]

  const handleSave = (row) => {
    const newData = [...data]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    list.simpleRuleList.splice(index, 1, {...item, ...row})
    setList({...list})
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const mergeColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record, rowIndex) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        rowIndex,
        onEditStatus,
        partialPro: !partialPro ? false : true,
      }),
    }
  })

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data}
        columns={mergeColumns}
        components={components}
        bordered
        pagination={false}
        rowSelection={!partialPro ? rowSelection : null}
        scroll={{y: '100%', x: '100%'}}
      />
      <ScriptSourceDetailModal
        {...{
          scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </>
  )
}

export default RuleSetTableList
