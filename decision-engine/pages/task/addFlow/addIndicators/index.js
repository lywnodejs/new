import {Table, Form, Input, Button, Modal, Row, Col, List} from 'antd'
import {CloseOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import AddIndicatorsTitle from './AddIndicatorsTitle'
import AddIndicatorsFooter from './AddIndicatorsFooter'
import fetch from '~/utils/fetch'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const AddIndicators = (props) => {
  const {
    taskRunClick,
    setIndicatorsVisible,
    flowId,
    handleSetFileTemplateIndicators,
    onFlowCancel,
    saveFlow,
    show,
  } = props
  const [visible, setVisible] = useState(show)
  const [selectItemName, setSelectItemName] = useState([])
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  // now
  const [selectItems, setSelectItems] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // before
  const [beforeFlow, setBeforeFlow] = useState(null)
  const [beforeItems, setBeforeItems] = useState([])
  const [beforeKeys, setBeforeKeys] = useState([])
  const [beforePageNo, setBeforePageNo] = useState(pageParams.pageNo)
  const [beforePageSize, setBeforePageSize] = useState(pageParams.pageSize)

  // 未点击保存，关闭页面时触发 -> 回退至 before state
  const initData = () => {
    setSelectItems([...beforeItems])
    setSelectedRowKeys([...beforeKeys])
    pageParams.pageNo = beforePageNo
    pageParams.pageSize = beforePageSize
    fetchData()
  }

  // 成功执行任务时触发 -> 清空还原 all state
  useEffect(() => {
    setSelectItems([])
    setSelectedRowKeys([])
    setSelectItemName([])
    setBeforeFlow([])
    setBeforeItems([])
    setBeforeKeys([])
    pageParams.pageNo = 1
    pageParams.pageSize = 10
  }, [taskRunClick])

  useEffect(() => {
    setVisible(show)
  }, [show])

  useEffect(() => {
    if (flowId[0] !== undefined) {
      fetchData()
    }
    if (flowId === beforeFlow && beforeFlow !== null) {
      setSelectItems([...beforeItems])
      setSelectedRowKeys([...beforeKeys])
    } else {
      setSelectItems([])
      setSelectedRowKeys([])
      setSelectItemName([])
      pageParams.pageNo = 1
      pageParams.pageSize = 10
    }
  }, [flowId])

  const saveIndicators = () => {
    // console.log('selectItems, selectedRowKeys', selectItems, selectedRowKeys)
    setBeforeItems([...selectItems])
    setBeforeKeys([...selectedRowKeys])
    setBeforeFlow(flowId)
    setBeforePageNo(pageParams.pageNo)
    setBeforePageSize(pageParams.pageSize)
  }

  const fetchData = async (params = pageParams, values = {}) => {
    const postData = {
      flowId: flowId[0],
      keyword: values.keyword || '',
      pageNo: params.pageNo,
      pageSize: params.pageSize,
    }
    // console.log('postData', postData)
    try {
      const {
        data: {data, code},
      } = await fetch(
        'fincloud.engine.facade.service.design.flowfdservice.searchindicatorpage',
        [postData],
      )
      if (code === 0) {
        // console.log('fetchData', data)
        setData(data)
        // return data
      }
    } catch (error) {
      return {totalSize: 0, list: []}
    }
  }

  const onOk = () => {
    let postData = selectItemName.join(',')
    handleSetFileTemplateIndicators(postData)
    setIndicatorsVisible(true)
    saveFlow()
    saveIndicators()
  }

  const onCancel = () => {
    setIndicatorsVisible(false)
  }
  const onClose = () => {
    setIndicatorsVisible(true)
    onFlowCancel()
    initData()
  }

  const columns = [
    {title: '指标名', dataIndex: 'fieldColumnName'},
    {title: '类型', dataIndex: 'fieldColumnType', width: 100},
    {title: '默认值', dataIndex: 'defaultValue', width: 200},
    {title: '分组', dataIndex: 'fieldGroupId', width: 200},
    {title: '指标中文名', dataIndex: 'fieldShowName', width: 150},
  ]

  const rowSelection = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      const index = selectItems.findIndex((v) => v.id === record.id)
      if (selected && index == -1) {
        // console.log(record);
        selectItemName.push(record.fieldColumnName)
        selectItems.push(record)
        selectedRowKeys.push(record.id)
      }
      if (!selected && index != -1) {
        selectItemName.splice(index, 1)
        selectItems.splice(index, 1)
        selectedRowKeys.splice(index, 1)
      }

      setSelectItems([...selectItems])
      setSelectedRowKeys([...selectedRowKeys])
      setSelectItemName([...selectItemName])
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        setSelectItems([...selectItems, ...changeRows]) // 补足 item
        const keys = changeRows.map((v) => v.id) // change list id: Array[]
        setSelectedRowKeys([...selectedRowKeys, ...keys]) // 补足 item.id
        const names = changeRows.map((v) => v.fieldColumnName)
        setSelectItemName([...selectItemName, ...names])
      } else {
        changeRows.forEach((v) => {
          const index = selectItems.findIndex((s_v) => v.id === s_v.id)
          selectItems.splice(index, 1)
          selectedRowKeys.splice(index, 1)
          selectItemName.splice(index, 1)
        })
        setSelectItems([...selectItems]) // clear item: []
        setSelectedRowKeys([...selectedRowKeys]) // clear item.id: []
        setSelectItemName([...selectItemName])
      }
    },
  }

  const onSearch = () => {
    pageParams.pageNo = 1
    const values = form.getFieldValue()
    fetchData(pageParams, values)
  }

  const onReset = () => {
    form.resetFields()
    onSearch()
  }

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    // console.log(form.getFieldsValue().keyword)
    fetchData(pageParams, form.getFieldsValue())
  }

  const pagination = {
    defaultCurrent: 1,
    total: data.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  return (
    <Modal
      width={1200}
      title={<AddIndicatorsTitle />}
      visible={visible}
      footer={<AddIndicatorsFooter onCancel={onCancel} onOk={onOk} />}
      // closable={false}
      closeIcon={<CloseOutlined onClick={onClose} />}
    >
      <Row gutter={15}>
        <Col flex="auto" style={{width: 800}}>
          <Form form={form} layout="inline">
            <Form.Item
              name="keyword"
              label="关键词"
              style={{marginRight: '30px'}}
            >
              <Input placeholder="请输入" style={{width: 200}} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={onReset}>重置</Button>
            </Form.Item>
          </Form>

          <Table
            scroll={{y: 330}}
            bordered
            rowSelection={rowSelection}
            dataSource={data.list || []}
            rowKey="id"
            columns={columns}
            pagination={pagination}
          />
        </Col>
        <Col flex="200px">
          <div style={{marginBottom: 15}}>
            （选中 <span style={{color: 'red'}}>{selectItems.length}</span>）
          </div>
          <List
            size="small"
            header={null}
            footer={null}
            bordered
            dataSource={selectItems}
            style={{height: '45vh', overflow: 'scroll'}}
            renderItem={(item) => (
              <List.Item>
                {item.fieldColumnName}_{item.fieldShowName}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default AddIndicators
