import React, {useState, useContext, useRef, useEffect} from 'react'
import {
  Row,
  Col,
  Card,
  Layout,
  Button,
  Table,
  Modal,
  Space,
  message,
  Form,
  Input,
  Select,
} from 'antd'
const {Header, Footer, Sider, Content} = Layout
import styles from './index.less'

import TableTree from './tableTree'
import Edit from './edit'
import {BaseAddContext} from '../index'
import {TYPES, SQL_TYPES} from '../../const'
import {SearchOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import DataSql from './newDataSql'
import fetch from '~/utils/fetch'

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

export default function InterFace(props) {
  const [editList, setEditList] = useState([])
  const [sqlParams, setSqlParams] = useState([])
  const [json, setJson] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editArr, setEditArr] = useState(null)
  const [editSqlItem, setEditSqlItem] = useState(null)
  const [showDataSqlModal, setShowDataSqlModal] = useState(false)
  const context = useContext(BaseAddContext)

  useEffect(() => {
    setJson(props.data)
  }, [props.data])

  useEffect(() => {
    console.log('configs', props.configs)
    setEditList(props.configs)
  }, [props.configs])

  useEffect(() => {
    getParams()
  }, [])

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
            <Button type="link" onClick={(e) => deleteItem(e, index)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const jsonTreeRef = useRef()

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

  const deleteItemSelected = (item) => {
    let i = editList.findIndex((v) => v.keyExp == item.keyExp)
    editList.splice(i, 1)
    setEditList([...editList])
    if (!item.isNew) {
      jsonTreeRef.current.deleteKey(item, i)
    }
  }

  const changeSelect = (item) => {
    // console.log(item)
    item.edit = true
    // item.name = item.keyName
    setEditList([...editList, item])
  }

  const initSelected = () => {
    if (Array.isArray(props.configs)) {
      let arr = props.configs.map((v, index) => {
        return {
          ...v,
          edit: true,
          keyExp: v.columnPath,
          keyExpSuccess: v.columnPath,
        }
      })
      setEditList(arr)
    }
  }

  const nextStep = async () => {
    // if (!editArr || (Array.isArray(editArr) && editArr.length === 0)) {
    //   return message.error('没有选择指标')
    // }

    // editForm.validateFields().then((values) => {
    //   let hasError = editArr.some((v) => v.edit)
    //   if (hasError) {
    //     message.error('存在未保存指标配置，请检查。')
    //   } else {
    //     context.nextStep()
    //   }
    // })
    context.nextStep()
  }

  const setForm = (form) => {
    setEditForm(form)
  }

  const setList = (list) => {
    // setEditArr(list)
    setEditList(list)
  }
  const changeEditList = (list) => {
    setEditArr(list)
  }

  const onSearch = (params) => {
    console.log(params)
    props.search(params)
  }

  const changeSqlModal = (e, data) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    if (data) {
      setEditSqlItem(data)
    } else {
      setEditSqlItem(null)
    }
    setShowDataSqlModal(true)
  }

  const closeDataSqlConfig = (code) => {
    setShowDataSqlModal(false)
  }

  const deleteItem = async (e, index) => {
    e.stopPropagation()
    e.preventDefault()
    let item = editList[index]

    let {
      data: {code, data: time},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [item.id],
    )
    // api.getBaseNormUseTime(item.id)
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
    let item = editList[index]

    let {
      data: {code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
      [item.id],
    )
    if (code == 0) {
      editList.splice(index, 1)
      setEditList([...editList])
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
    <React.Fragment>
      {/* <Layout>
        <Sider
          style={{marginRight: 15, backgroundColor: '#FFF', padding: 15}}
          className={styles.jsonTree}
          width={350}
        >
          {json && (
            <TableTree
              selecteds={props.configs}
              initSelectData={initSelected}
              data={json}
              ref={jsonTreeRef}
              readOnly={false}
              changeSelect={changeSelect}
            />
          )}
        </Sider> */}
      <Layout>
        <div className={styles.dataHeader}>
          <Search search={onSearch} />
        </div>
        <Content className={styles.dataContent}>
          <div style={{textAlign: 'right', margin: '15px 24px'}}>
            <Button type="primary" onClick={() => changeSqlModal()}>
              添加
            </Button>
          </div>
          <Card style={{paddingTop: 0}} className="expandable-table-box">
            <Table
              // rowSelection={rowSelection}
              rowKey="id"
              dataSource={editList}
              columns={columns}
              rowClassName={(record, idx) => {
                if (idx % 2 === 0) return 'bg-row'
              }}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <div style={{width: '1000px'}}>
                      <p style={{textAlign: 'left'}}>{record.extend}</p>
                    </div>
                  )
                },
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              expandRowByClick={true}
              // expandable={{
              //   expandRowByClick: true,
              //   expandedRowRender: record => <p style={{ margin: 0, textAlign: 'left'}}>{record.extend}</p>,
              //   // rowExpandable: record => record.name !== 'Not Expandable',
              // }}
              pagination={false}
            />
            {/* <Edit
                list={editList}
                type="data"
                sqlParams={sqlParams}
                setForm={setForm}
                setList={setList}
                changeEditList={changeEditList}
                deleteItemSelected={deleteItemSelected}
                groups={props.groups}
                getGroups={props.getGroups}
                data={json}
              /> */}
          </Card>
        </Content>
        <Card>
          <div className={styles.footer}>
            <Button onClick={context.preStep} style={{marginRight: '8px'}}>
              上一步
            </Button>
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
          </div>
        </Card>
        {/* <Footer style={{padding: '24px 0', textAlign: 'right'}}>
          
        </Footer> */}
      </Layout>

      <DataSql
        close={closeDataSqlConfig}
        sqlParams={sqlParams}
        show={showDataSqlModal}
        groups={props.groups}
        getGroups={props.getGroups}
        editItem={editSqlItem}
        list={editList}
        setList={setList}
        data={json}
      />
      {/* </Layout> */}
    </React.Fragment>
  )
}
