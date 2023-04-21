import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, Modal, message, Form, Radio, Input} from 'antd'
import Router from 'next/router'
import {DndProvider, useDrag, useDrop, createDndContext} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import css from '../index.less'
// import api from '~/utils/api'

const getData = async () => {
  // let {
  //   data: {code, data},
  // } = await api.getProductList()
  // if (code == 0) {
  //   return data
  // }
  return []
}

const breadcrumbs = [
  {text: '运营管理'},
  {text: '产品管理'},
  {text: '贷款产品管理'},
]

const RNDContext = createDndContext(HTML5Backend)
const type = 'DragableBodyRow'

const DragableBodyRow = ({index, moveRow, className, style, ...restProps}) => {
  const ref = React.useRef()
  const [{isOver, dropClassName}, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const {index: dragIndex} = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    item: {type, index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{cursor: 'move', ...style}}
      {...restProps}
    />
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    console.log(props.data)
  }, [])

  const changeStatus = (r) => {
    setVisible(true)
    setEditItem(r)
    form.setFieldsValue({onlineStatus: r.onlineStatus})
  }

  const jump2attr = (type, id) => {
    if (type === 'add') {
      Router.push(`/operation/product/loans/attrs-add?productId=${id}`)
    } else {
      Router.push(`/operation/product/loans/attrs-list?productId=${id}`)
    }
  }

  const columns = [
    {title: '产品ID', dataIndex: 'id'},
    {title: '产品名称', dataIndex: 'name'},
    {
      title: '产品Icon',
      dataIndex: 'icon',
      render: (t) => {
        return <img src={t} style={{maxWidth: 50}} />
      },
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      render: (t) => {
        return api.getValueByDict(t, props.PRODUCT_TYPE)
      },
    },
    {
      title: '发布平台',
      dataIndex: 'platform',
      render: (t) => {
        let res = []
        if (t) {
          t.split(',').reduce((p, c) => {
            const p_type = api.getValueByDict(c, props.PLATFORM_TYPE)
            if (p_type) {
              res.push(p_type)
            }
            return res
          }, [])
        }
        return res.join('、')
      },
    },
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '状态',
      dataIndex: 'onlineStatus',
      render: (v) => {
        let text = '-'
        if (v == 1) {
          text = '在线'
        }
        if (v == 0) {
          text = '下线'
        }
        return text
      },
    },
    {
      title: '操作',
      render: (v, r) => {
        return (
          <Space>
            <Button type="link" onClick={() => jump2edit(r.id)}>
              编辑
            </Button>
            <Button type="link" onClick={() => changeStatus(r)}>
              修改状态
            </Button>
            {r.attrButtonType == 0 && (
              <Button type="link" onClick={() => jump2attr('add', r.id)}>
                新增属性
              </Button>
            )}
            {r.attrButtonType == 1 && (
              <Button type="link" onClick={() => jump2attr('update', r.id)}>
                属性列表
              </Button>
            )}
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const jump2edit = (id) => {
    let url = '/operation/product/loans/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
  }

  const saveSort = async () => {
    Modal.confirm({
      title: '保存顺序后，将更改前端产品展示顺序，请确认？',
      async onOk() {
        console.log('onOk')
        const sortIds = data.map((v, i) => {
          return {
            id: v.id,
            order: i + 1,
          }
        })
        let {
          data: {code},
        } = await api.updateProductSorts(sortIds)
        if (code == 0) {
          message.success('保存成功')
        }
      },
      onCancel() {
        console.log('onCancel')
      },
    })
  }

  const reloadData = async () => {
    let data = await getData()
    setData([...data])
  }

  const onOk = () => {
    form.validateFields().then(async ({...values}) => {
      setLoading(true)
      values.id = editItem.id
      try {
        let {
          data: {code},
        } = await api.updateProductStatus(values)
        setLoading(false)
        if (code == 0) {
          message.success('修改成功')
          form.resetFields()
          setVisible(false)
          reloadData()
        }
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    })
  }

  const components = {
    body: {
      row: DragableBodyRow,
    },
  }

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex]
      const upData = update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      })
      setData(upData)
    },
    [data],
  )

  const manager = useRef(RNDContext)

  return (
    <Layout breadcrumbs={breadcrumbs} className={css.backdrop}>
      <div style={{marginBottom: 20}}>
        <Button
          type="primary"
          style={{marginRight: 20}}
          onClick={() => jump2edit()}
        >
          新增产品
        </Button>
        <Button type="primary" onClick={() => saveSort()}>
          保存顺序
        </Button>
      </div>
      <DndProvider manager={manager.current.dragDropManager}>
        <Table
          bordered
          rowKey="id"
          pagination={false}
          columns={columns}
          dataSource={data}
          components={components}
          onRow={(record, index) => ({
            index,
            moveRow,
          })}
        />
      </DndProvider>

      <Modal
        title="修改状态"
        visible={visible}
        confirmLoading={loading}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        <Form name="basic" form={form}>
          <Form.Item name="onlineStatus">
            <Radio.Group>
              <Radio value={1}>在线</Radio>
              <Radio value={0}>下线</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="修改理由"
            name="reason"
            rules={[{required: true, message: '请输入修改理由'}]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  const initData = {data}
  try {
    const [
      {
        data: {code, data: PRODUCT_TYPE},
      },
      {
        data: {code: code1, data: PLATFORM_TYPE},
      },
    ] = await Promise.all([
      api.getDictMap('PRODUCT_TYPE'),
      api.getDictMap('PLATFORM_TYPE'),
    ])
    initData.PRODUCT_TYPE = code == 0 ? PRODUCT_TYPE : []
    initData.PLATFORM_TYPE = code1 == 0 ? PLATFORM_TYPE : []
  } catch (error) {
    return initData
  }

  return initData
}

export default body
