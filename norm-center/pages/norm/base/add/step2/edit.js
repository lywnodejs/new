import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useContext} from 'react'
import fetch from '~/utils/fetch'

import {
  Button,
  Table,
  Space,
  Card,
  Badge,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Row,
  Col,
  Tooltip,
} from 'antd'
import Link from 'next/link'
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import BatchCofig from './batchConfig'
import GroupConfig from './groupConfig'
import styles from './index.less'
import DataSql from './dataSql'
import _ from 'lodash'

import {TYPES, SQL_TYPES} from '../../const'
import {BaseAddContext} from '../index'

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let params = form.getFieldsValue()

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

      <Form.Item label="类型" name="type">
        <Select style={{width: 120}}>
          <Select.Option value={null}>全部</Select.Option>
          {props.types.map((v, index) => {
            return (
              <Select.Option value={v.columnType} key={index}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="指标中文名" name="nameCn">
        <Input placeholder="请输入" />
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
const httpFields = [
  'columnType',
  'name',
  'columnDefaultValue',
  'groupName',
  'nameCn',
  // 'description',
]
const sqlFields = [...httpFields, 'extend', 'keyExp']

function body(props) {
  const [searchParams, setSearchParams] = useState({})
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showDataSqlModal, setShowDataSqlModal] = useState(false)
  const [list, setList] = useState([])
  const [showList, setShowList] = useState([])
  const [groups, setGroups] = useState([])
  const [selectList, setSelectList] = useState([])
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)
  const [sqlConfigItem, setSqlConfigItem] = useState(null)
  const [types, setTypes] = useState([])
  const [form] = Form.useForm()

  const context = useContext(BaseAddContext)

  useEffect(() => {
    if (props.list) {
      let newItems = list.filter((v) => v.isNew)
      let tempList = [...list]
      let newList = [...props.list]
      console.log('props.list', props.list)
      let fieldParams = {}
      newList = newList.map((v, index) => {
        const temp_index = tempList.findIndex(
          (i) => i.keyExpSuccess == v.keyExpSuccess,
        )
        let res =
          temp_index != -1 ? form.getFieldValue(`${v.keyExp}${temp_index}`) : v
        fieldParams[`${v.keyExp}${index}`] = res

        // debugger
        // let res = item ? item : v
        // let res = v
        // fieldParams[`${v.keyExp}${index}`] = {...res}
        if (res.isNew && _.isNumber(res.keyExp)) {
          fieldParams[`${v.keyExp}${index}`].keyExp = ''
        }

        return res
      })

      setList(newList)

      // fieldParams = {...fieldParams, ...form.getFieldsValue()}
      console.log('fieldParams1111111', fieldParams)
      form.setFieldsValue(fieldParams)
    }
  }, [props.list])

  useEffect(() => {
    if (props.groups) {
      setGroups(props.groups)
    }
  }, [props.groups])
  useEffect(() => {
    if (form) {
      props.setForm(form)
    }
  }, [form])

  useEffect(() => {
    // console.log('useEffect~~~~~~~~~:', list)
    onSearch()
    props.changeEditList(list)
  }, [list])

  useEffect(() => {
    console.log('props.type:', props.type)
    let type = props.type === 'data' ? SQL_TYPES : TYPES
    setTypes(type)
  }, [props.type])

  const onSearch = (params = {}) => {
    const formValues = form.getFieldsValue()
    let tempList = list.map((v, i) => {
      if (formValues[`${v.keyExp}${i}`]) {
        return {
          ...v,
          ...formValues[`${v.keyExp}${i}`],
        }
      }
      return v
    })
    if (params.name) {
      tempList = tempList.filter((v) => v.name.indexOf(params.name) > -1)
    }
    if (params.type) {
      tempList = tempList.filter((v) => v.columnType == params.type)
    }
    if (params.nameCn) {
      tempList = tempList.filter((v) => v.nameCn.indexOf(params.nameCn) > -1)
    }
    console.log('tempList:', tempList)
    setShowList(_.cloneDeep(tempList))
  }

  const batchConfig = () => {
    if (selectList.length === 0) {
      return message.warning('请选择操作项')
    }
    setShowBatchModal(true)
  }

  const batchDelete = () => {
    if (selectList.length === 0) {
      return message.warning('请选择操作项')
    }
  }

  const deleteItem = async (index) => {
    let item = list[index]
    if (!item.id) {
      return deleteItem4list(item)
    }
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
        onOk() {
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
      deleteItem4list(item)
    }
  }

  const deleteItem4list = (item) => {
    console.log(item)
    props.deleteItemSelected(item)
    message.success('删除成功')
    // return
    // if (item.isNew) {
    //   const i = list.findIndex((v) => v.keyExp == item.keyExp)
    //   list.splice(i, 1)
    //   setList([...list])
    // } else {
    //   props.deleteItemSelected(item)
    //   message.success('删除成功')
    // }
  }

  const changeEdit = (index) => {
    const tempList = [...list]
    const tempEditData = {...editData}
    const item = tempList[index]
    item.edit = !item.edit
    tempEditData[index] = item
    setEditData(tempEditData)
    setList(tempList)
    form.setFieldsValue({...tempEditData, ...form.getFieldsValue()})
  }

  const cancelEdit = (i) => {
    changeEdit(i)
  }

  const saveEdit = async (i) => {
    const key = `${list[i].keyExp}${i}`
    let fieldsArr = []
    if (props.type == 'data') {
      fieldsArr = sqlFields
    } else {
      fieldsArr = httpFields
    }
    const params = fieldsArr.map((field) => {
      return [key, field]
    })

    try {
      const formValues = await form.validateFields(params)
      const values = formValues[key]
      const datasourceId = context.selectedItem.item.id
      const datasourceType = context.selectedItem.dataSourceType
      const groupId = groups.find((v) => v.groupName == values.groupName)
        .groupId
      let item = list[i]
      let obj = {
        columnPath: item.keyExp,
        columnName: item.keyName,
        type: 'base',
        datasourceType,
        datasourceId,
        groupId,
        ...values,
      }

      if (item.id) {
        obj.id = item.id
      }

      if (item.isNew) {
        obj.columnPath = values.keyExp
        delete obj.keyExp
      }

      let {
        data: {code, data},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
        [obj],
      )
      if (code == 0) {
        message.success('保存成功')
        list[i] = {...item, ...obj}
        list[i].edit = false
        list[i].id = data
        setList([...list])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const saveAllEdit = () => {
    if (!list || (Array.isArray(list) && list.length === 0)) {
      return
    }
    form.validateFields().then(async (values) => {
      const datasourceId = context.selectedItem.item.id
      const datasourceType = context.selectedItem.dataSourceType
      let keyExps = Object.keys(values)
      console.log(values)
      // debugger
      let dataArr = keyExps.map((keyExp) => {
        let item = list.find((v, i) => `${v.keyExp}${i}` == keyExp)
        const groupId = groups.find(
          (v) => v.groupName == values[keyExp].groupName,
        ).groupId
        let obj = {
          columnPath: values[keyExp].keyExp || item.keyExp,
          columnName: item.keyName,
          type: 'base',
          datasourceType,
          datasourceId,
          groupId,
          ...values[keyExp],
        }
        if (item.id) {
          obj.id = item.id
        }
        return obj
      })

      let {
        data: {code, data},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.saveall',
        [{indicatorsManageRequest: dataArr}],
      )
      // api.saveBaseNormConfig4all(dataArr)
      if (code == 0) {
        message.success('保存成功')
        const newList = list.map((v, index) => {
          v = {...v, ...dataArr[index], edit: false}
          return v
        })
        setList(newList)
      }
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      )
      setSelectList(selectedRows)
    },
  }

  const selectGroup = (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    setEditIndex(i)
    setShowGroupModal(true)
  }

  const selectDataSql = (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    setEditIndex(i)
    setShowDataSqlModal(true)

    let val = _.cloneDeep(form.getFieldValue([`${list[i].keyExp}${i}`]))
    if (!val.extend) {
      val.extend = `select * from ${list[i].name}`
    }
    setSqlConfigItem(val)
  }

  const addNewItem = () => {
    let key = parseInt(Math.random() * 1000000)
    let obj = {
      isNew: true,
      edit: true,
      keyExpSuccess: key,
      keyExp: key,
    }
    // setList([obj, ...list])
    console.log('addNewItem', [obj, ...list])
    props.setList([obj, ...list])
  }

  const columns = [
    {
      title: '指标名',
      dataIndex: 'name',
      render: (t, r, i) => {
        let ele = (
          <p>
            {t || '-'}
            <sup style={{marginLeft: 5, fontSize: 14}}>
              <Tooltip title={r.columnPath || r.keyExp}>
                <InfoCircleOutlined />
              </Tooltip>
            </sup>
          </p>
        )
        if (r.edit) {
          ele = (
            <Form.Item style={{marginBottom: 0}}>
              <Form.Item
                name={[`${r.keyExp}${i}`, 'name']}
                style={{marginBottom: 0, width: '90%'}}
                rules={[{required: true, message: '该项不能为空'}]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <sup style={{fontSize: 14, position: 'absolute', right: '-4%'}}>
                <Tooltip title={r.columnPath || r.keyExp}>
                  <InfoCircleOutlined />
                </Tooltip>
              </sup>
            </Form.Item>
          )
        }
        return ele
      },
    },
    {
      title: '指标中文名',
      dataIndex: 'nameCn',
      render: (t, r, i) => {
        let ele = <p>{t || '-'}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={[`${r.keyExp}${i}`, 'nameCn']}
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
      title: '类型',
      dataIndex: 'columnType',
      render: (t, r, i) => {
        let typeI = types.find((v) => v.columnType == t)
        typeI = (typeI && typeI.name) || t
        let ele = <p>{typeI || '-'}</p>
        if (r.keyName === 'root') {
          return <p>对象</p>
        }
        if (r.edit) {
          ele = (
            <Form.Item
              name={[`${r.keyExp}${i}`, 'columnType']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Select style={{width: 120}}>
                {types.map((v, index) => {
                  return (
                    <Select.Option value={v.columnType} key={index}>
                      {v.name}
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
      title: '默认值',
      dataIndex: 'columnDefaultValue',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={[`${r.keyExp}${i}`, 'columnDefaultValue']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          )
        }
        return ele
      },
    },
    {
      title: '分组',
      dataIndex: 'groupName',
      render: (t, r, i) => {
        let ele = <p>{t}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={[`${r.keyExp}${i}`, 'groupName']}
              onClick={(e) => selectGroup(e, i)}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input readOnly />
            </Form.Item>
          )
        }
        return ele
      },
    },
    // {
    //   title: 'KEY名',
    //   dataIndex: 'keyExp',
    //   render: (t, r, i) => {
    //     let text = r.columnPath || t || '-'
    //     let ele = <p>{text}</p>
    //     if (r.edit && r.isNew) {
    //       ele = (
    //         <Form.Item
    //           name={[`${r.keyExp}${i}`, 'keyExp']}
    //           style={{marginBottom: 0}}
    //           rules={[{required: true, message: '该项不能为空'}]}
    //         >
    //           <Input placeholder="请输入" />
    //         </Form.Item>
    //       )
    //     }
    //     return ele
    //   },
    // },

    // {
    //   title: '描述',
    //   dataIndex: 'description',
    //   render: (t, r, i) => {
    //     let ele = <p>{t || '-'}</p>
    //     if (r.edit) {
    //       ele = (
    //         <Form.Item
    //           name={[`${r.keyExp}${i}`, 'description']}
    //           style={{marginBottom: 0}}
    //           rules={[{required: true, message: '该项不能为空'}]}
    //         >
    //           <Input placeholder="请输入" />
    //         </Form.Item>
    //       )
    //     }
    //     return ele
    //   },
    // },
    {
      title: '操作',
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

  const clickSqlItem = (item) => {
    console.log('item:', item)
    let params = [[item.keyExp, 'type']]
    if (item.isNew) {
      params.push([item.keyExp, 'keyExp'])
    }
    let value = form.getFieldsValue(params)
    console.log(value)
  }

  if (props.type == 'data') {
    let columnSql = {
      title: 'SQL编辑',
      dataIndex: 'extend',
      width: 100,
      render: (t, r, i) => {
        let ele = <p>{t || '-'}</p>
        if (r.edit) {
          ele = (
            <Form.Item
              name={[`${r.keyExp}${i}`, 'extend']}
              style={{marginBottom: 0}}
              rules={[{required: true, message: '该项不能为空'}]}
            >
              <Input readOnly onClick={(e) => selectDataSql(e, i)} />
            </Form.Item>
          )
        }
        return ele
      },
    }

    columns.splice(7, 0, columnSql)
  }

  const closeGroupConfig = (params) => {
    if (params) {
      form.setFieldsValue({
        [`${list[editIndex].keyExp}${editIndex}`]: {
          groupName: params.groupName,
        },
      })
      if (params.type === 'add') {
        props.getGroups()
      }
    }
    setShowGroupModal(false)
    setEditIndex(-1)
  }

  const closeBatchConfig = (params) => {
    if (params) {
      let fieldParams = {}
      selectList.forEach((v, i) => {
        // fieldParams[v.keyExp] = params
        fieldParams[`${v.keyExp}${i}`] = params
      })
      form.setFieldsValue(fieldParams)
      console.log(fieldParams)
    }
    setShowBatchModal(false)
    setEditIndex(-1)
  }

  const closeDataSqlConfig = (code) => {
    if (code) {
      let fieldParams = {
        [`${list[editIndex].keyExp}${editIndex}`]: {extend: code},
      }
      form.setFieldsValue(fieldParams)
    }
    setShowDataSqlModal(false)
    setEditIndex(-1)
  }

  return (
    <React.Fragment>
      <Card
        style={{
          height: 'calc(100vh - 329px)',
          overflowY: 'auto',
        }}
      >
        <Search search={onSearch} types={types} />
        {/* <Row style={{marginBottom: 15}}>
          <Col span={12}>
            <Space>
              <Button type="primary" onClick={batchConfig}>
                批量配置
              </Button>

              <Button type="link" onClick={saveAllEdit}>
                保存全部
              </Button>
            </Space>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            {props.type == 'data' && (
              <Button type="primary" onClick={addNewItem}>
                新增逻辑字段
              </Button>
            )}
          </Col>
        </Row> */}

        <Form form={form} component={false}>
          <Table
            bordered
            rowSelection={{
              ...rowSelection,
            }}
            // rowKey="keyExpSuccess"
            rowKey={(r, i) => {
              // console.log(r)
              return r.keyExpSuccess + i
            }}
            pagination={false}
            columns={columns}
            // dataSource={list || []}
            dataSource={showList || []}
          />
        </Form>
      </Card>

      <Col span={24} className={styles.editFooter}>
        <Row className={'rows'} style={{textAlign: 'left', marginLeft: '25px'}}>
          <Col span={12}>
            <Space>
              <Button type="primary" onClick={batchConfig}>
                批量配置
              </Button>

              <Button type="link" onClick={saveAllEdit}>
                保存全部
              </Button>
            </Space>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={context.preStep}>上一步</Button>
              <Button type="primary" onClick={props.nextStep}>
                下一步
              </Button>
            </Space>
            {/* {props.type == 'data' && (
              <Button type="primary" onClick={addNewItem}>
                新增逻辑字段
              </Button>
            )} */}
          </Col>
        </Row>
      </Col>

      <BatchCofig
        show={showBatchModal}
        groups={groups}
        getGroups={props.getGroups}
        close={closeBatchConfig}
      />
      <GroupConfig
        show={showGroupModal}
        groups={groups}
        close={closeGroupConfig}
      />
      <DataSql
        close={closeDataSqlConfig}
        sqlParams={props.sqlParams}
        show={showDataSqlModal}
        editItem={sqlConfigItem}
        data={props.data}
      />
    </React.Fragment>
  )
}

export default body
