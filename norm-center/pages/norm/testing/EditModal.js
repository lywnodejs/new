import {
  Table,
  Space,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Tabs,
  Row,
  Col,
  List,
} from 'antd'
import {useEffect, useState, useRef, useImperativeHandle} from 'react'
import styles from './style.less'
import {SQL_TYPES} from '../base/const'
import fetch from '~/utils/fetch'
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
import './EditModal.less'

// 基础指标
const getBaseData = async (params = {}) => {
  const {
    data: {code, data},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
    [{...params, indicatorsType: 'base'}],
  )
  if (code === 0) {
    return data
  }
  return {list: []}
}

// 衍生指标
const getDerivativeData = async (params = {}) => {
  console.log(params)
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
    [{...params, indicatorsType: 'derivation'}],
  )
  if (code === 0) {
    return data
  }
  return {totalSize: 0, list: []}
}

//人行指标
const getBankData = async (params) => {
  let result = await fetch(
    'fincloud.basics.indicators.center.api.ind.rhdbindmanageservice.getlist',
    [{...params}],
  )
    .then(({data: {code, data}}) => {
      console.log(data)
      if (code == 0) {
        return fetch(
          'fincloud.basics.indicators.center.api.ind.rhdbindmanageservice.getlist',
          [
            {
              datasourceType: 'sql',
              datasourceId: '1',
              ...params,
            },
          ],
        )
      } else {
        return []
      }
    })
    .then(({data: {code, data}}) => {
      return code == 0 ? data : []
    })
  return {
    totalSize: result.length,
    list: result,
  }
}

const {TabPane} = Tabs

const EditModal = (props) => {
  const {dataOne, dataTwo, bankData, cRef} = props
  //   console.log(dataOne, dataTwo)
  const [visible, setVisible] = useState(props.show)
  const [selectItems, setSelectItems] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [dataKey, setDataKey] = useState('1')
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  // TODO 变量设置
  const [foundation, setFoundation] = useState({})
  const [deriveFrom, setDeriveFrom] = useState({})
  const [person, setPerson] = useState({})
  const [inputDefault, setInputDefault] = useState('')

  const [dataList, setDataList] = useState([
    {
      columnType: null,
      key: '',
      list: [],
      pageNo: 1,
      pageSize: 10,
    },
    {
      columnType: null,
      key: '',
      list: [],
      pageNo: 1,
      pageSize: 10,
    },
    {
      columnType: null,
      key: '',
      list: [],
      pageNo: 1,
      pageSize: 10,
    },
  ])

  useEffect(() => {
    getListData(pageParams, dataKey)
    initPage()
  }, [dataKey])

  useEffect(() => {
    setVisible(props.show)
  }, [props.show])

  const changeTab = (key) => {
    form.resetFields()
    initPage()
    setDataKey(key)
  }

  const initPage = () => {
    pageParams.pageNo = 1
    pageParams.pageSize = 10
  }

  // TODO 获取列表方法
  const getListData = async (params, key = dataKey) => {
    let result
    console.log(key)
    if (key == 1) {
      // console.log(obj)
      // let obj={columnType:}
      let {columnType, key, pageNo, pageSize} = dataList[0]
      let obj = {columnType, key, pageNo, pageSize}
      console.log(obj)
      // console.log(dataList[0])
      // console.log({...params, ...foundation})
      result = await getBaseData(obj)
      // result = await getBaseData(params)
    }

    if (key == 2) {
      let {columnType, key, pageNo, pageSize} = dataList[1]
      let obj = {columnType, key, pageNo, pageSize}
      console.log(obj)
      // setDeriveFrom(cloneDeep(form.getFieldValue()))
      // console.log(deriveFrom)
      result = await getDerivativeData(obj)
    }
    console.log(params)
    if (key == 3) {
      // setPerson(cloneDeep(form.getFieldValue()))
      console.log(params)
      if (params.hasOwnProperty('key')) {
        console.log(params)
        let paramsData = JSON.parse(JSON.stringify(params))
        paramsData.name = params.key
        delete paramsData.key
        delete paramsData.list
        console.log(paramsData)
        let data = await getBankData({...paramsData})
        result = data.list
      } else {
        let data = await getBankData({...params})
        result = data.list
      }
    }
    console.log(result)
    // console.log(selectItems)
    console.log(key)
    setData(result)
  }

  const inptFunc = (e) => {
    // if (dataKey === '1') {
    //   console.log({...form.getFieldValue(), key: e.target.value})
    //   setFoundation({...form.getFieldValue(), key: e.target.value})
    // } else if (dataKey === '2') {
    //   console.log(2222)
    //   console.log({...form.getFieldValue(), key: e.target.value})
    //   setDeriveFrom({...form.getFieldValue(), key: e.target.value})
    // } else {
    //   setPerson({...form.getFieldValue(), key: e.target.value})
    // }
    if (dataKey === '1') {
      dataList[0].key = e.target.value
      setDataList([...dataList])
    } else if (dataKey === '2') {
      dataList[1].key = e.target.value
      setDataList([...dataList])
    } else {
      dataList[2].key = e.target.value
      setDataList([...dataList])
    }
  }

  const selectFunc = (val) => {
    console.log(val)
    // if (dataKey === '1') {
    //   console.log({...form.getFieldValue(), columnType: val})
    //   setFoundation({...form.getFieldValue(), columnType: val})
    // } else if (dataKey === '2') {
    //   setDeriveFrom({...form.getFieldValue(), columnType: val})
    // } else {
    //   setPerson({...form.getFieldValue(), columnType: val})
    // }

    if (dataKey === '1') {
      dataList[0].columnType = val
      setDataList([...dataList])
    } else if (dataKey === '2') {
      dataList[1].columnType = val
      setDataList([...dataList])
    } else {
      dataList[2].columnType = val
      setDataList([...dataList])
    }
  }

  const onOk = () => {
    props.changeSelectItems(selectItems)
  }

  const onCancel = () => {
    props.changeSelectItems()
  }

  const setResetp = () => {
    setSelectItems([])
    setSelectedRowKeys([])
  }

  useImperativeHandle(cRef, () => ({
    setResetp,
  }))

  const columns = [
    {title: '指标名', dataIndex: 'name', width: 200},
    {title: '类型', dataIndex: 'columnType', width: 200},
    {title: '指标中文名', dataIndex: 'nameCn', width: 200},
    {title: '分组', dataIndex: 'groupName', width: 200},
    {title: '默认值', dataIndex: 'columnDefaultValue'},
  ]

  const rowSelection = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      const index = selectItems.findIndex((v) => v.id === record.id)
      if (selected && index == -1) {
        selectItems.push(record)
        selectedRowKeys.push(record.id)
      }
      if (!selected && index != -1) {
        selectItems.splice(index, 1)
        selectedRowKeys.splice(index, 1)
      }

      setSelectItems([...selectItems])
      setSelectedRowKeys([...selectedRowKeys])
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log('boolean: true or false', selected)
      //   console.log('selected list: Array[]', selectedRows)
      //   console.log('change list: Array[]', changeRows)
      if (selected) {
        setSelectItems([...selectItems, ...changeRows]) // 补足 item
        const keys = changeRows.map((v) => v.id) // change list id: Array[]
        setSelectedRowKeys([...selectedRowKeys, ...keys]) // 补足 item.id
      } else {
        changeRows.forEach((v) => {
          const index = selectItems.findIndex((s_v) => v.id === s_v.id)
          selectItems.splice(index, 1)
          selectedRowKeys.splice(index, 1)
        })
        setSelectItems([...selectItems]) // clear item: []
        setSelectedRowKeys([...selectedRowKeys]) // clear item.id: []
      }
    },
  }

  const onSearch = () => {
    // pageParams.pageNo = 1
    const values = form.getFieldsValue()
    const params = {...pageParams, ...values}
    // setDataList([...dataList])
    getListData({...dataList[dataKey - 1], ...form.getFieldValue()})
  }

  const onReset = () => {
    form.resetFields()
    onSearch()
  }

  const onChange = (current, pageSize) => {
    // pageParams.pageSize = pageSize
    // pageParams.pageNo = current
    dataList[dataKey - 1].pageSize = pageSize
    dataList[dataKey - 1].pageNo = current
    console.log([...dataList])
    setDataList([...dataList])
    getListData({...dataList, ...form.getFieldValue()})
  }

  const pagination = {
    defaultCurrent: 1,
    total: data.totalSize,
    pageSize: dataList[dataKey - 1].pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: dataList[dataKey - 1].pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  return (
    <Modal
      width={1200}
      className={styles.editModal}
      title="选择指标"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      centered={true}
    >
      <Row gutter={15}>
        <Col flex="auto" style={{width: 800}}>
          <Tabs defaultActiveKey="1" className={'jichu'} onChange={changeTab}>
            <TabPane tab="基础指标" key="1" />
            <TabPane tab="衍生指标" key="2" />
            <TabPane tab="人行指标" key="3" />
          </Tabs>

          <Form form={form} layout="inline" initialValues={{columnType: null}}>
            <Form.Item name="key">
              {/* TODO input默认值 */}
              <Input
                placeholder="关键字搜索"
                style={{width: 120}}
                defaultValue={dataList[dataKey - 1].key}
                onChange={(e) => inptFunc(e)}
              />
            </Form.Item>

            <Form.Item label="类型" name="columnType">
              <Select
                style={{width: 120}}
                onChange={(e) => selectFunc(e)}
                defaultValue="文本"
              >
                <Select.Option value={null}>全部</Select.Option>
                {SQL_TYPES.map((v, index) => {
                  return (
                    <Select.Option value={v.columnType} key={index}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
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
            // style={styles2['ant-table-body']}
            scroll={{y: '300px'}}
            bordered
            rowSelection={rowSelection}
            dataSource={data.list || []}
            rowKey="id"
            columns={columns}
            pagination={pagination}
          />
        </Col>
        <Col flex="200px" style={{width: '183px', height: '100%'}}>
          <div style={{marginBottom: 15}}>
            （选中 <span style={{color: 'red'}}>{selectItems.length}</span>）
          </div>
          <List
            className={styles.listBox}
            size="small"
            header={null}
            footer={null}
            bordered
            dataSource={selectItems}
            renderItem={(item) => <List.Item>{item.name}</List.Item>}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default EditModal
