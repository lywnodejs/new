import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import api from '~/utils/api'
import {
  Button,
  Table,
  Space,
  Badge,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Card,
} from 'antd'
import Link from 'next/link'
import {SearchOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import CopyModal from '~/components/common/copyModal'
// import {SERVICE_TYPE} from '~/utils/const'
import router from 'next/router'
import _ from 'lodash'
import DataSql from './add/step2/dataSql'
// import editSql from './editSql'
import fetch from '~/utils/fetch'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
    [{...params, indicatorsType: 'base'}],
  )
  // normApi.getNormBase(params)
  if (code == 0) {
    // console.log('data', data)
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '指标管理'}, {text: '基础指标'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let params = form.getFieldsValue()
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key]
      }
    })
    props.search(params)
  }

  const resetForm = () => {
    form.resetFields()
  }

  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{groupId: null}}
    >
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

          <Button type="primary" onClick={props.addNewData}>
            新增
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [list, setList] = useState(props.data.list)
  const [searchParams, setSearchParams] = useState({})
  const [showSql, setShowSql] = useState(false)
  const [sql, setSql] = useState()
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)
  const [groupData, setGroupData] = useState([])
  const [form] = Form.useForm()
  const [sqlParams, setSqlParams] = useState([])
  const [sqlConfigItem, setSqlConfigItem] = useState(null)
  const [showDataSqlModal, setShowDataSqlModal] = useState(false)
  const [sqlData, setSqlData] = useState({})

  useEffect(() => {
    const getGroup = async () => {
      let {
        data: {code, data},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      )
      if (code == 0) {
        setGroupData(data)
      }
    }

    getGroup()
    getParams()
  }, [])

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

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
    setList(data.list)
  }

  const deleteItem = async (index) => {
    let item = list[index]
    let {
      data: {code, data: time},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [item.id],
    )
    if (code == 0) {
      const title = time
        ? `指标最近一次调用日期“${time}”`
        : '该指标没有被调用过'
      Modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        content: <span style={{color: 'red'}}>你确定要删除么？</span>,
        async onOk() {
          deleteOk(index)
        },
      })
    }
  }

  const deleteOk = async (index) => {
    let item = list[index]

    let {
      data: {code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
      [item.id],
    )
    if (code == 0) {
      onChangePage()
      message.success('删除成功')
    }
  }

  const changeEdit = (index) => {
    let lastIndex = editIndex
    setEditIndex(index)
    const tempList = [...list]
    const tempEditData = {...editData}
    const item = tempList[index]
    if (_.isNumber(lastIndex) && lastIndex > -1 && lastIndex != index) {
      tempList[editIndex].edit = false
    }
    item.edit = true
    tempEditData['index' + index] = item
    setEditData(tempEditData)
    setList(tempList)
    form.setFieldsValue({...tempEditData, ...form.getFieldsValue()})
  }

  const cancelEdit = (i) => {
    if (i !== -1) {
      const tempList = [...list]
      const item = tempList[i]
      item.edit = !item.edit
      setList(tempList)
      console.log(tempList)
    }
  }
  const validateFields = [
    'groupId',
    'nameCn',
    'columnDefaultValue',
    'description',
    'extend',
  ]
  const saveEdit = async (i) => {
    let params = validateFields.map((field) => {
      return ['index' + i, field]
    })
    try {
      let values = await form.validateFields(params)
      let item = list[i]
      let params = {...item, ...values['index' + i]}
      let {
        data: {code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
        [{...params, type: 'base'}],
      )
      if (code == 0) {
        message.success('修改成功')
        list[i] = params
        list[i].edit = false
        setList([...list])
      }
    } catch (e) {
      console.log(e)
    }

    // changeEdit(i)
  }

  const addNewData = () => {
    router.push('/norm/base/add')
  }

  const showSqlModal = (sql) => {
    setSql(sql)
    setShowSql(true)
  }

  const closeModal = () => {
    setSql()
    setShowSql(false)
  }

  const selectDataSql = async (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    let item = list[i]
    const {code} = await getSqlData(item)
    console.log(list[i])
    if (code == 0) {
      setShowDataSqlModal(true)
      setSqlConfigItem(item)
    }
  }
  const getSqlData = async ({datasourceType, datasourceId}) => {
    let {
      data: {code, data = ''},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getleftdata',
      [{datasourceType, datasourceId}],
    )
    // normApi.getData4left({datasourceType, datasourceId})
    if (code == 0) {
      setSqlData(JSON.parse(data))
    }
    return {code}
  }

  const closeDataSqlConfig = (code) => {
    if (code) {
      let fieldParams = {[`index${editIndex}`]: {extend: code}}
      form.setFieldsValue(fieldParams)
    }
    setShowDataSqlModal(false)
  }

  const columns = [
    {
      title: '分组',
      width: 100,
      dataIndex: 'groupName',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={['index' + i, 'groupId']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Select style={{width: 90}}>
                {groupData.map((group) => {
                  return (
                    <Select.Option value={group.groupId} key={group.groupId}>
                      {group.groupName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          )
        }
        return ele
      },
    },
    {
      title: '指标中文名',
      dataIndex: 'nameCn',
    },
    {
      title: '指标名',
      dataIndex: 'name',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={['index' + i, 'name']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input placeholder="请输入" style={{width: 90}} />
            </Form.Item>
          )
        }
        return ele
      },
    },
    {title: '类型', width: 80, dataIndex: 'columnType'},
    {
      title: '默认值',
      dataIndex: 'columnDefaultValue',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={['index' + i, 'columnDefaultValue']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input placeholder="请输入" style={{width: 90}} />
            </Form.Item>
          )
        }
        return ele
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={['index' + i, 'description']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input placeholder="请输入" style={{width: 90}} />
            </Form.Item>
          )
        }
        return ele
      },
    },
    {
      title: 'SQL逻辑',
      dataIndex: 'extend',
      // width: 500,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        }
      },
      render: (t, r, i) => {
        if (r.datasourceType === 'http') {
          return '-'
        }
        let ele = <a onClick={() => showSqlModal(t)}>{t}</a>
        if (r.edit) {
          ele = (
            <Form.Item
              name={['index' + i, 'extend']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input
                readOnly
                placeholder="请输入"
                onClick={(e) => selectDataSql(e, i)}
                style={{
                  // width: 450,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              />
            </Form.Item>
          )
        }
        return ele
      },
    },
    // datasourceType  sql 数据库 http 接口
    {
      title: '来源',
      dataIndex: 'datasourceType',
      width: 100,
      render: (t, r, i) => {
        let res = '-'
        if (t == 'sql') {
          res = '数据库'
        }
        if (t == 'http') {
          res = '接口'
        }
        return res
      },
    },
    {title: '来源名称', dataIndex: 'datasourceName'},
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (t, r, i) => {
        return (
          <Space>
            {r.edit ? (
              <React.Fragment>
                <Button type="link" onClick={() => saveEdit(i)}>
                  保存
                </Button>
                <Button type="link" onClick={() => cancelEdit(i)}>
                  取消
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button type="link" onClick={() => changeEdit(i)}>
                  编辑
                </Button>
                <Button type="link" onClick={() => deleteItem(i)}>
                  删除
                </Button>
              </React.Fragment>
            )}
          </Space>
        )
      },
    },
  ]

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card style={{marginBottom: 15}}>
        <Search
          search={onSearch}
          groupData={groupData}
          addNewData={addNewData}
        />
      </Card>

      <Form form={form}>
        <Table
          bordered
          rowKey="id"
          pagination={paginationConfig}
          columns={columns}
          dataSource={list || []}
          scroll={{x: '1600px'}}
          rowClassName={(record, idx) => {
            if (idx % 2 === 0) return 'bg-row'
          }}
        />
      </Form>

      <CopyModal show={showSql} data={sql} close={closeModal} />

      <DataSql
        close={closeDataSqlConfig}
        sqlParams={sqlParams}
        show={showDataSqlModal}
        locationType="base_list"
        editItem={sqlConfigItem}
        data={sqlData}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
