import {Table, Form, Input, Button, Modal, Row, Col, List, message} from 'antd'
import {CloseOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import AddFlowTitle from './AddFlowTitle'
import AddFlowFooter from './AddFlowFooter'
import AddIndicators from './addIndicators'
import {findApiByKey} from '../../decision/common/mapActionToApi'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const AddFlow = (props) => {
  const {
    handleSetFileTemplateIndicators,
    taskRunClick,
    changeSelectItems,
    show,
  } = props
  const [visible, setVisible] = useState(show)
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  const [showIndicators, setShowIndicators] = useState(false)
  // now
  const [selectItems, setSelectItems] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // before
  const [beforeFlowItems, setBeforeFlowItems] = useState([])
  const [beforeFlowKeys, setBeforeFlowKeys] = useState([])
  const [beforePageNo, setBeforePageNo] = useState(pageParams.pageNo)
  const [beforePageSize, setBeforePageSize] = useState(pageParams.pageSize)

  // 未点击保存，关闭页面时触发 -> 回退至 before state
  const initData = () => {
    setSelectItems(beforeFlowItems)
    setSelectedRowKeys(beforeFlowKeys)
    pageParams.pageNo = beforePageNo
    pageParams.pageSize = beforePageSize
    fetchFlow()
  }

  // 成功执行任务时触发 -> 清空还原 all state
  useEffect(() => {
    setSelectItems([])
    setSelectedRowKeys([])
    setBeforeFlowItems([])
    setBeforeFlowKeys([])
    pageParams.pageNo = 1
    pageParams.pageSize = 10
  }, [taskRunClick])

  useEffect(() => {
    setVisible(show)
  }, [show])

  useEffect(() => {
    fetchFlow()
  }, [])

  const fetchFlow = async (values = '') => {
    let basePostData = {
      ...pageParams,
      moduleType: 'all',
      fieldType: '8',
      partialPro: 1,
      keyword: values,
    }
    let postApi = findApiByKey(+8, basePostData, 'fetch')
    try {
      const {
        data: {data, code},
      } = await postApi()
      if (code == 0) {
        setData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onOk = () => {
    if (selectItems.length < 1) {
      message.error('请选择决策流')
    } else {
      // changeSelectItems(selectItems)
      setVisible(false)
      setShowIndicators(true)
    }
  }

  // *------------------------------------------------

  const onCancel = () => {
    changeSelectItems()
    setVisible(false)
    initData()
  }

  const columns = [
    {title: '编号', dataIndex: 'flowCode'},
    {title: '名称', dataIndex: 'flowName', width: 200},
    {title: '说明', dataIndex: 'description', width: 200},
  ]

  // *---------------------------------------

  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      setSelectItems([record])
      setSelectedRowKeys([record.id])
    },
  }

  // 传子组件，子组件流程走完，点击 '保存'时触发。
  const saveFlow = () => {
    setBeforeFlowItems(selectItems)
    setBeforeFlowKeys(selectedRowKeys)
    setBeforePageNo(pageParams.pageNo)
    setBeforePageSize(pageParams.pageSize)
    changeSelectItems(selectItems)
  }

  // *---------------------------------------

  const onSearch = () => {
    pageParams.pageNo = 1
    const serchName = form.getFieldValue('keywords')
    fetchFlow(serchName)
  }

  const onReset = () => {
    form.resetFields()
    onSearch()
  }

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    fetchFlow(form.getFieldsValue().keywords)
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

  const setIndicatorsVisible = (allClose) => {
    if (!allClose) {
      setVisible(true)
      setShowIndicators(false)
    } else {
      setVisible(false)
      setShowIndicators(false)
    }
  }

  return (
    <>
      <Modal
        width={1200}
        title={<AddFlowTitle />}
        footer={<AddFlowFooter onCancel={onCancel} onOk={onOk} />}
        visible={visible}
        closeIcon={<CloseOutlined onClick={onCancel} />}
      >
        <Row gutter={15}>
          <Col flex="auto" style={{width: 800}}>
            <Form form={form} layout="inline">
              <Form.Item name="keywords" label="关键字：">
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
              bordered
              dataSource={selectItems}
              renderItem={(item) => {
                return <List.Item>{item.flowName}</List.Item>
              }}
            />
          </Col>
        </Row>
      </Modal>
      <AddIndicators
        handleSetFileTemplateIndicators={handleSetFileTemplateIndicators}
        flowId={selectedRowKeys}
        flowShow={visible}
        show={showIndicators}
        setIndicatorsVisible={setIndicatorsVisible}
        taskRunClick={taskRunClick}
        onFlowCancel={onCancel}
        saveFlow={saveFlow}
      />
    </>
  )
}

export default AddFlow
