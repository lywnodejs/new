import {Layout} from '~/components/Layout'
import dynamic from 'next/dynamic'
import {
  Card,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  Space,
  Modal,
  Popconfirm,
  message,
} from 'antd'
import {
  SearchOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import CopyModal from '~/components/common/copyModal'
import RuleEditModal from './edit/RuleEditModal'
import Search from './components/Search'
import styles from './style.less'
import {cloneDeep} from 'lodash'

const {TextArea} = Input

const breadcrumbs = [{text: '指标管理'}, {text: '衍生指标'}]

const new_temp_id = -1

let setVisible = null //编辑弹窗第一次渲染完成后会调用这个回调，通过这个方法来控制弹窗的显示与隐藏
let setSelectItem = null //通过这个方法将当前正在编辑的项传递给弹窗
let curEditItem = {}
let searchForm = null

const types = [
  {name: '整型', columnType: 'int'},
  {name: '浮点型', columnType: 'double'},
  {name: '文本', columnType: 'string'},
  {name: '布尔', columnType: 'boolean'},
]

function body({data, indexGroup}) {
  const [dataSource, setDataSource] = useState(data)
  const [showExpression, setShowExpression] = useState(false)
  const [expression, setExpression] = useState()
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record) => {
    return record.id === editingKey
  }

  const edit = (record, e, i) => {
    e.stopPropagation()
    let dataList = cloneDeep(dataSource)
    dataList.list[i].isIdit = true
    setDataSource(dataList)

    setEditingKey(record.id)
  }

  const onEditDerive = (item) => {
    curEditItem = {...item}
    setVisible(true)
    setSelectItem({...item, ...form.getFieldsValue(), extend: item.extend})
  }

  const save = async (record, e, i) => {
    e.stopPropagation()

    try {
      const row = await form.validateFields()
      const saveData = {...row, type: 'derivation', extend: record.extend}
      if (record.id != new_temp_id) {
        saveData.id = record.id
      }
      const {
        data: {data, code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
        [saveData],
      )

      if (code == 0) {
        message.success('保存成功')
        setEditingKey('')
        updateList()
      }
    } catch (error) {
      console.log('衍生指标编辑保存error', error)
    }
  }

  const onFinalValidateAndSubmit = async (selectItem) => {
    try {
      const list = dataSource.list.map((item) => {
        if (item.id == selectItem.id) {
          return {...selectItem}
        } else {
          return item
        }
      })
      setDataSource({totalSize: dataSource.totalSize, list})
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const onModelVisible = (visible, item) => {
    //弹窗第一次渲染完成后把内部的控制显示和设置数据的方法回调给父组件
    setVisible = visible
    setSelectItem = item
  }

  const addRow = () => {
    if (editingKey != null && editingKey != '' && editingKey != undefined) {
      return message.info('请先完成其他编辑')
    }
    const newData = {
      columnPath: '',
      columnDefaultValue: '',
      groupId: indexGroup[0].groupId,
      nameCn: '',
      type: '',
      datasourceType: '',
      columnType: types[0].columnType,
      groupName: indexGroup[0].groupName,
      name: '',
      id: new_temp_id,
      columnName: '',
      extend: '',
      description: '',
    }
    setDataSource({
      totalSize: dataSource.totalSize + 1,
      list: [newData, ...dataSource.list],
    })
    setEditingKey(newData.id)
  }

  const cancel = (record, e, i) => {
    e.stopPropagation()
    setEditingKey('')
    if (record.id == new_temp_id) {
      setDataSource({
        totalSize: dataSource.totalSize - 1,
        list: [...dataSource.list.slice(1)],
      })
    } else {
      const list = dataSource.list.map((item) => {
        if (item.id == curEditItem.id) {
          return {...curEditItem}
        } else {
          return item
        }
      })
      setDataSource({
        totalSize: dataSource.totalSize,
        list,
      })
    }
    let dataList = cloneDeep(dataSource)
    dataList.list[i].isIdit = false
    setDataSource(dataList)
  }

  const deleteItem = async (record, e) => {
    e.stopPropagation()

    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [record.id],
    )

    if (code == 0) {
      Modal.confirm({
        title:
          data == null || data == ''
            ? '你还没有调用过该指标'
            : `指标最近一次调用日期${data}`,
        icon: <ExclamationCircleOutlined />,
        content: <span style={{color: 'red'}}>你确定要删除么？</span>,
        onOk() {
          doDelete(record)
        },
      })
    }
  }

  const doDelete = async (record) => {
    try {
      const {
        data: {data, code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
        [record.id],
      )

      if (code == 0) {
        message.success('删除成功')
        setEditingKey('')
        updateList()
      }
    } catch (error) {
      console.log('衍生指标删除error', record.id, error)
    }
  }

  const onSearch = (params) => {
    pageParams.pageNo = 1
    updateList(params)
  }

  const updateList = async (params = {}) => {
    let data = await getData(params)
    console.log(data)
    setDataSource(data)
  }

  const onChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    if (searchForm !== null && searchForm !== 'undefined') {
      let params = searchForm.getFieldsValue()
      updateList(params)
    } else {
      updateList()
    }
  }
  const pagination = {
    defaultCurrent: 1,
    total: dataSource.totalSize,
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
    {
      title: '分组',
      dataIndex: 'groupId',
      key: 'groupId',
      width: 100,
      editable: true,
    },
    {
      title: '指标中文名',
      dataIndex: 'nameCn',
      key: 'nameCn',
      // width: '10%',
      editable: true,
    },
    {
      title: '指标名',
      dataIndex: 'name',
      key: 'name',
      // width: '10%',
      editable: true,
    },
    {
      title: '类型',
      dataIndex: 'columnType',
      key: 'columnType',
      width: 100,
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      // width: '15%',
      editable: true,
    },
    // {
    //   title: '动作表达式',
    //   dataIndex: 'extend',
    //   key: 'extend',
    //   width: '150px',
    //   editable: true,
    //   render: (text, record) => {
    //     let wrap = {
    //       wordBreak: 'break-all',
    //       overflow: 'hidden',
    //       textOverflow: 'ellipsis',
    //       display: '-webkit-box',
    //       WebkitLineClamp: 2,
    //       WebkitBoxOrient: 'vertical',
    //     }
    //     if (text === '') {
    //       return <div style={wrap}>{text}</div>
    //     } else {
    //       let obj = JSON.parse(text)
    //       return <div style={wrap}>{obj.script}</div>
    //     }
    //   },
    //   // onCell: () => {
    //   //   return {
    //   //     style: {
    //   //       overflow: 'hidden',
    //   //       whiteSpace: 'nowrap',
    //   //       textOverflow: 'ellipsis',
    //   //     },
    //   //   }
    //   // },
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record, i) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button
              type="link"
              onClick={(e) => save(record, e)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Button>

            <Popconfirm
              title="确定取消?"
              onCancel={(e) => e.stopPropagation()}
              onConfirm={(e) => cancel(record, e, i)}
            >
              <Button type="link" onClick={(e) => e.stopPropagation()}>
                取消
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={(e) => edit(record, e, i)}
            >
              编辑
            </Button>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={(e) => deleteItem(record, e)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  // TODO 插入表格
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = <Input onClick={(e) => e.stopPropagation()} />
    if (dataIndex == 'groupId') {
      inputNode = (
        <Select onClick={(e) => e.stopPropagation()}>
          {indexGroup.map((v) => {
            return (
              <Select.Option value={v.groupId} key={v.groupId}>
                {v.groupName}
              </Select.Option>
            )
          })}
        </Select>
      )
    } else if (dataIndex == 'columnType') {
      inputNode = (
        <Select onClick={(e) => e.stopPropagation()}>
          {types.map((v) => {
            return (
              <Select.Option value={v.columnType} key={v.columnType}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      )
    } else if (dataIndex == 'extend') {
      inputNode = (
        <a onClick={(e) => showExpressionModal(record.extend, e)}>{children}</a>
        // inputNode = <Input onClick={() => onEditDerive(record)} />
      )
    }

    let showNode = children
    if (dataIndex == 'groupId') {
      showNode = record.groupName
    } else if (dataIndex == 'columnType') {
      showNode = record.columnType
    } else if (dataIndex == 'extend') {
      showNode = (
        <a onClick={(e) => showExpressionModal(record.extend, e)}>{children}</a>
      )
    }

    if (editing) {
      if (record.extend === '') {
        form.setFieldsValue({
          ...record,
        })
      } else {
        let obj = JSON.parse(record.extend)
        form.setFieldsValue({
          ...record,
          extend: obj.script,
        })
      }
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请输入${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          showNode
        )}
      </td>
    )
  }
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const showExpressionModal = (expression, e) => {
    e.stopPropagation()
    let obj = JSON.parse(expression)
    setExpression(obj.script)
    console.log(obj)
    setShowExpression(true)
  }

  const closeModal = () => {
    setExpression()
    setShowExpression(false)
  }

  const onSearchVisible = (form) => {
    searchForm = form
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card bodyStyle={{paddingTop: '16px', paddingBottom: '0px'}}>
        <Search
          indexGroup={indexGroup}
          search={onSearch}
          addRow={addRow}
          onSearchVisible={onSearchVisible}
        ></Search>
      </Card>
      <Card
        style={{
          width: '100%',
          marginTop: '10px',
        }}
        bodyStyle={{padding: '0'}}
      >
        <Form form={form} component={false}>
          <div className="expandable-table-box">
            <Table
              bordered
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowClassName={(record, idx) => {
                if (idx % 2 === 0) return 'bg-row'
              }}
              dataSource={dataSource.list}
              rowKey="id"
              expandable={{
                expandedRowRender: (record, i, indent, expanded) => {
                  // console.log(i)
                  // console.log(record)
                  // console.log(editingKey)
                  // if (editingKey === record.id) {
                  //   console.log(record)
                  // }
                  if (record.isIdit) {
                    return (
                      <div
                        style={{
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'gray',
                        }}
                        // dangerouslySetInnerHTML={{
                        //   __html:
                        //     record.extend && record.extend.replace(/\\n/g, '<br>'),
                        // }}
                      >
                        <Form.Item
                          name="extend"
                          rules={[
                            {required: true, message: '请输入动作表达式!'},
                          ]}
                        >
                          <Input.TextArea
                            value={record.extend}
                            onClick={() => onEditDerive(record)}
                            autoSize
                          />
                          {/* <p
                            style={{
                              textAlign: 'left',
                              fontSize: '12px',
                              color: 'gray',
                            }}
                          >
                            <a
                              dangerouslySetInnerHTML={{
                                __html:
                                  record.extend &&
                                  JSON.parse(record.extend).script.replace(
                                    /\n/g,
                                    '<br>',
                                  ),
                              }}
                              onClick={() => onEditDerive(record)}
                            ></a>
                          </p> */}
                        </Form.Item>
                      </div>
                    )
                  } else {
                    return (
                      <p
                        style={{
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'gray',
                        }}
                      >
                        <a
                          dangerouslySetInnerHTML={{
                            __html:
                              record.extend &&
                              JSON.parse(record.extend).script.replace(
                                /\n/g,
                                '<br>',
                              ),
                          }}
                          onClick={(e) => showExpressionModal(record.extend, e)}
                        ></a>
                      </p>
                    )
                  }
                },
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              expandRowByClick={true}
              columns={mergedColumns || []}
              pagination={pagination}
            />
          </div>
        </Form>
      </Card>
      <CopyModal show={showExpression} data={expression} close={closeModal} />
      <RuleEditModal
        {...{
          onFinalValidateAndSubmit,
          onModelVisible,
        }}
      />
    </Layout>
  )
}

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
// TODO 获取列表数据
const getData = async (params = {}) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
    [{...params, ...pageParams, indicatorsType: 'derivation'}],
  )

  let deepObj = cloneDeep(data)

  deepObj.list.forEach((v) => {
    v.isIdit = false
  })

  if (code == 0) {
    return deepObj
  }
  return {totalSize: 0, list: []}
}

const getIndexGroup = async () => {
  try {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      [{}],
    )

    if (code === 0) {
      return data
    }
    return []
  } catch (err) {
    return []
  }
}

body.getInitialProps = async () => {
  const [data, indexGroup] = await Promise.all([getData(), getIndexGroup()])
  return {data, indexGroup}
}

export default body
