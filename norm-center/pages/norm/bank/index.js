import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import DataSql from './newDataSql'
import {
  Form,
  Card,
  Button,
  Table,
  Input,
  Select,
  Modal,
  Space,
  Row,
  Col,
  message,
} from 'antd'
import fetch from '~/utils/fetch'
import {SQL_TYPES} from '../base/const'
import {SearchOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const breadcrumbs = [{text: '指标管理'}, {text: '人行指标'}]

const Search = (props) => {
  const [form] = Form.useForm()

  const onSearch = () => {
    let params = form.getFieldsValue()
    pageParams.pageNo = 1
    pageParams.pageSize = 10
    props.search(params)
  }

  const resetForm = () => {
    form.resetFields()
    props.search()
  }

  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{type: null}}
    >
      <Form.Item label="指标名" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="指标中文名" name="nameCn">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="类型" name="columnType">
        <Select style={{width: 120}}>
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

      <Form.Item label="分组" name="groupId">
        <Select style={{width: 120}}>
          <Select.Option value={null}>全部</Select.Option>
          {props.groupData.map((group) => {
            return (
              <Select.Option value={group.groupId} key={group.groupId}>
                {group.groupName}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>

          <Button onClick={resetForm}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  // const [selectedItem, setItem] = useState(null)
  const [selectedItem, setItem] = useState({
    dataSourceType: 'sql',
    datasourceId: '1',
    type: 'data',
    item: props.data,
  })

  // const [editList, setEditList] = useState([])
  const [groups, setGroups] = useState(null)
  const [json, setJson] = useState(null)

  const [tableData, setTableData] = useState(props.data.list)
  const [sqlParams, setSqlParams] = useState([])

  // const [editForm, setEditForm] = useState(null)
  // const [editArr, setEditArr] = useState(null)
  const [editSqlItem, setEditSqlItem] = useState(null)
  const [showDataSqlModal, setShowDataSqlModal] = useState(false)
  const [locationType, setLocationType] = useState(null)
  const [groupData, setGroupData] = useState([])
  const [params, setParams] = useState({})
  const [titleModel, settitleModel] = useState('指标编辑')

  useEffect(() => {
    const datasourceId = selectedItem.datasourceId
    const datasourceType = selectedItem.dataSourceType
    getData({datasourceType, datasourceId})
    getGroups()
    // getNormConfig()
    getBankData()
  }, [])

  useEffect(() => {
    getParams()
    getGroup()
  }, [])

  const getGroup = async () => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      [],
    )
    if (code == 0) {
      setGroupData(data)
    }
  }

  const getBankData = async (params = {}) => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.ind.rhdbindmanageservice.getlist',
      [{...params, ...pageParams}],
    )
    // api.getNormBankData({...params, ...pageParams})
    if (code === 0) {
      setTableData(data)
    }
  }

  const getData = async (params) => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getleftdata',
      [params],
    )
    if (code == 0) {
      console.log(JSON.parse(data))
      setJson(JSON.parse(data))
    }
  }

  // const getNormConfig = async (params) => {
  //   let {
  //     data: {code, data},
  //   } = await fetch(
  //     'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getindicators',
  //     [{...params}],
  //   )
  //   if (code == 0) {
  //     setEditList(data)
  //   }
  // }

  const getGroups = async () => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      [],
    )
    if (code == 0) {
      setGroups(data)
    }
  }

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    console.log(pageSize, current)
    const datasourceId = selectedItem.datasourceId
    const datasourceType = selectedItem.dataSourceType
    // console.log(current, pageSize)
    // console.log(pageParams)
    // console.log(params)
    getBankData({datasourceId, datasourceType, ...params, ...pageParams})
  }

  const pagination = {
    defaultCurrent: 1,
    total: tableData.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  const columns = [
    {title: '指标名', dataIndex: 'name'},
    {
      title: '类型',
      dataIndex: 'columnType',
      render: (t, r, i) => {
        let typeI = SQL_TYPES.find((v) => v.columnType == t)
        typeI = (typeI && typeI.name) || t
        let ele = <p>{typeI || '-'}</p>

        return ele
      },
    },
    {title: '默认值', dataIndex: 'columnDefaultValue'},
    {title: '分组', dataIndex: 'groupName'},
    {title: '指标中文名', dataIndex: 'nameCn'},
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <Space>
            <Button type="link" onClick={(e) => changeSqlModal(e, record)}>
              编辑
            </Button>
            <Button type="link" onClick={(e) => deleteItem(e, record)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const getParams = async () => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getalldefaultparams',
      [],
    )
    if (code == 0) {
      setSqlParams(data)
    }
  }

  const setList = (list) => {
    console.log(list)
    setTableData(list)
  }

  const onSearch = (params) => {
    const datasourceId = selectedItem.datasourceId
    const datasourceType = selectedItem.dataSourceType
    setParams(params)
    console.log({datasourceType, datasourceId, ...params})
    getBankData({datasourceType, datasourceId, ...params})
  }

  const changeSqlModal = (e, data, buttonType) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (data) {
      setEditSqlItem(data)
      settitleModel('指标编辑')
    } else {
      setEditSqlItem(null)
      settitleModel('指标添加')
    }
    setShowDataSqlModal(true)
  }

  const closeDataSqlConfig = (code) => {
    setShowDataSqlModal(false)
  }

  const deleteItem = async (e, record) => {
    e.stopPropagation()
    e.preventDefault()

    let {
      data: {code, data: time},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [record.id],
    )
    // api.getBaseNormUseTime(record.id)
    if (code == 0) {
      const title = time
        ? `指标最近一次调用日期“${time}”`
        : '该指标没有被调用过'
      Modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        content: <span style={{color: 'red'}}>你确定要删除么？</span>,
        onOk() {
          deleteOk(record.id)
        },
      })
    }
  }

  const deleteOk = async (id) => {
    console.log(id)
    let {
      data: {code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
      [id],
    )
    if (code == 0) {
      message.success('删除成功')
      const datasourceId = selectedItem.datasourceId
      const datasourceType = selectedItem.dataSourceType
      getBankData({datasourceId, datasourceType, ...params, ...pageParams})
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      )
    },
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search search={onSearch} groupData={groupData} />
      <Card style={{paddingTop: 0}}>
        <div style={{textAlign: 'right', marginBottom: 15}}>
          <Button type="primary" onClick={(e) => changeSqlModal()}>
            添加
          </Button>
        </div>
        <div className="expandable-table-box">
          <Table
            // rowSelection={rowSelection}
            rowKey="id"
            dataSource={tableData.list}
            columns={columns}
            rowClassName={(record, idx) => {
              if (idx % 2 === 0) return 'bg-row'
            }}
            // expandable={{
            //   expandRowByClick: true,
            //   expandedRowRender: record => <p style={{ margin: 0, textAlign: 'left'}}>{record.extend}</p>,
            // }}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    textAlign: 'left',
                    fontSize: '12px',
                    color: 'gray',
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      record.extend && record.extend.replace(/\n/g, '<br>'),
                  }}
                ></p>
              ),
              rowExpandable: (record) => record.name !== 'Not Expandable',
            }}
            expandRowByClick={true}
            pagination={pagination}
          />
        </div>
      </Card>

      <DataSql
        selectedItem={selectedItem}
        close={closeDataSqlConfig}
        sqlParams={sqlParams}
        show={showDataSqlModal}
        groups={groups}
        getGroups={getGroups}
        editItem={editSqlItem}
        list={tableData.list}
        setList={setList}
        data={json}
        locationType={locationType}
        refreshFunc={getBankData}
        titleModel={titleModel}
      />
    </Layout>
  )
}

body.getInitialProps = async (ctx) => {
  let {
    data: {code, data},
  } = await fetch(
    'fincloud.basics.indicators.center.api.ind.rhdbindmanageservice.getlist',
    [{}],
  )
  if (code == 0) {
    return {data}
  }
  return {}
}

export default body
