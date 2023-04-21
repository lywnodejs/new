import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import fetch from '~/utils/fetch'
import {
  Button,
  Table,
  Space,
  Modal,
  Card,
  Tabs,
  Form,
  Radio,
  Input,
  message,
} from 'antd'
import Router from 'next/router'
import AttrsTit from '~/components/pages/operation/product/AttrsTit'
import {createDndContext, DndProvider, useDrag, useDrop} from 'react-dnd'
import update from 'immutability-helper'
import {HTML5Backend} from 'react-dnd-html5-backend'
import EditAttr from '~/components/pages/operation/product/EditAttr'
import api from '~/utils/api'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getData = async (productId) => {
  let {
    data: {code, data},
  } = await api.getProductAttrs({productId})
  if (code == 0) {
    return data
  }
  return []
}

const getAttrs = async (productId) => {
  let {
    data: {code, data},
  } = await api.getAttrsCategory({productId: -1, productType: null})
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '运营配置'}, {text: '产品管理'}, {text: '属性列表'}]

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
  const [attrs, setAttrs] = useState(props.attrs)
  const [f_attrs, setFAttrs] = useState([])
  const [f_select, setFSlect] = useState('0')
  const [s_attrs, setSAttrs] = useState([])
  const [s_select, setSSlect] = useState(0)
  const [showData, setShowData] = useState([])
  const [editItem, setEditItem] = useState(null)
  const EditEl = useRef(null)

  const [form] = Form.useForm()

  useEffect(() => {
    formatData(props.data)
  }, [])

  const formatData = (data) => {
    let result = []
    // console.log(data)
    if (Array.isArray(data)) {
      let map = {}
      let tempData = {}
      data.forEach((item) => {
        tempData[`f_${item.firCatId}`] = item
        tempData[`s_${item.secCatId}`] = item
        map[item.firCatId] = map[item.firCatId] || {}

        if (!map[item.firCatId][item.secCatId]) {
          map[item.firCatId][item.secCatId] = []
        }
        map[item.firCatId][item.secCatId].push(item)
        // (map[item.firCatId][item.secCatId] || (map[item.firCatId][item.secCatId] = [])).push(item)
        // (map[item.firCatId] || (map[item.firCatId] = [])).push(item)
      })

      Object.keys(map).forEach((firCatId) => {
        const tempFItem = tempData[`f_${firCatId}`]

        let f_item = {
          catId: tempFItem.firCatId,
          catName: tempFItem.firCatName,
          // ...tempData[`f_${firCatId}`],
          children: [],
        }
        Object.keys(map[firCatId]).forEach((secCatId) => {
          const tempSItem = tempData[`s_${secCatId}`]
          f_item.children.push({
            catId: tempSItem.secCatId,
            catName: tempSItem.secCatName,
            // ...tempData[`s_${secCatId}`],
            children: map[firCatId][secCatId],
          })
        })

        result.push(f_item)
      })

      setFAttrs(result)
      setSAttrs(result[f_select].children)
      setShowData(result[f_select].children[s_select].children)
    }
  }

  const onTabClick = (key) => {
    if (key == f_select) return
    const sAttrs = f_attrs[key].children
    setFSlect(key)
    setSSlect(0)
    setSAttrs(sAttrs)
    setShowData(sAttrs[0].children)
  }

  const onClickSCat = (key) => {
    if (key == s_select) return
    setSSlect(key)
    setShowData(s_attrs[key].children)
  }

  const onDelete = (r, i) => {
    Modal.confirm({
      content: '请确认是否删除该属性？若该属性下包含联动属性，将一并删除。',
      onOk() {
        api.deleteProAttr(r.id).then(({data: {code}}) => {
          if (code == 0) {
            showData.splice(i, 1)
            setShowData([...showData])
          }
        })
      },
    })
  }

  const columns = [
    {title: '属性名称', dataIndex: 'attrName'},
    {title: '子属性名称', dataIndex: 'subAttrName'},
    {title: '属性类型', dataIndex: 'attrType'},
    {title: '是否必填', dataIndex: 'fillAttribute'},
    {title: '联动条件', dataIndex: 'relationDesc'},
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(r)}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => onDelete(r, i)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const onEdit = async (r) => {
    api
      .getAttrDetail({productId: props.productId, attrId: r.attrId, id: r.id})
      .then(({data: {code, data}}) => {
        if (code == 0) {
          let item = {
            ...data,
            catId: +data.firCatId,
            subCatId: +data.secCatId,
            linkage: !data.relationAttrSelect ? 0 : 1,
          }
          if (data.relationAttrSelect) {
            item.relationAttrDTO = [
              {
                ...data.relationAttrSelect,
                value: data.relationAttrSelect.selectValue,
              },
            ]
          }
          setEditItem(item)
          EditEl.current.changeVisible(true)
        }
      })
  }

  const onAdd = () => {
    setEditItem(null)
    EditEl.current.changeVisible(true)
  }

  const notSort = () => {
    return s_attrs[s_select] && s_attrs[s_select].catId == 5
  }

  const saveSort = async () => {
    Modal.confirm({
      title: '保存顺序后，将更改前端产品展示顺序，请确认？',
      onOk() {
        let sortIds = showData.map((v, i) => {
          return {
            order: i + 1,
            id: v.id,
          }
        })

        api.updateProductAttrSorts(sortIds).then(({data: {code}}) => {
          if (code == 0) {
            message.success('保存成功')
          }
        })
      },
      onCancel() {
        console.log('onCancel')
      },
    })
  }

  const reloadData = async () => {
    let data = await getData(props.productId)
    setData(data)
    formatData(data)
  }

  const setAttrData = async (attrData) => {
    let params = {
      ...attrData,
      productId: props.productId,
    }
    if (editItem) {
      params.id = editItem.id
    }

    let {
      data: {code, data},
    } = await api.changeAttr(params)
    if (code == 0) {
      message.success('编辑成功')
      setEditItem(null)
      reloadData()
      EditEl.current.cancelModal(false)
    } else {
      EditEl.current.changeLoading(false)
    }
  }

  const components = {
    body: {
      row: DragableBodyRow,
    },
  }

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = showData[dragIndex]
      const upData = update(showData, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      })
      setShowData(upData)
    },
    [showData],
  )

  const manager = useRef(RNDContext)

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <div style={{marginBottom: 30}}>
          <AttrsTit
            reloadData={reloadData}
            productId={props.productId}
            onAdd={onAdd}
          />
        </div>

        <Tabs
          activeKey={f_select}
          onTabClick={onTabClick}
          tabBarGutter={35}
          tabBarExtraContent={{
            left: <span>一级分类：&emsp;&emsp;</span>,
          }}
        >
          {f_attrs.map((v, i) => {
            return <Tabs.TabPane tab={v.catName} key={i + ''} />
          })}
        </Tabs>
        <Space style={{marginBottom: 50}}>
          <span>二级分类：&emsp;</span>
          {s_attrs.map((v, i) => {
            return (
              <Button
                onClick={() => onClickSCat(i)}
                type={s_select == i ? 'primary' : 'text'}
                key={i}
              >
                {v.catName}
              </Button>
            )
          })}
        </Space>

        <div>
          {!notSort() ? (
            <div style={{marginBottom: 20}}>
              <Button type="primary" onClick={() => saveSort()}>
                保存顺序
              </Button>
            </div>
          ) : null}

          {!notSort() ? (
            <DndProvider manager={manager.current.dragDropManager}>
              <Table
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
                dataSource={showData}
                components={components}
                onRow={(record, index) => ({
                  index,
                  moveRow,
                })}
              />
            </DndProvider>
          ) : (
            <Table
              bordered
              rowKey="id"
              pagination={false}
              columns={columns}
              dataSource={showData}
            />
          )}
        </div>
      </Card>
      <EditAttr
        attrs={attrs}
        setAttrData={setAttrData}
        data={editItem}
        ref={EditEl}
        linkageAttrs={props.linkageAttrs}
      />
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const productId = params.ctx.query.productId
  const attrs = await getAttrs(productId)
  let initData = {
    data: null,
    linkageAttrs: null,
    productId,
    attrs,
  }

  if (productId) {
    initData.data = await getData(productId)

    let {
      data: {code, data},
    } = await api.getLinkageByProId(productId)
    let {
      data: {code: code1, data: ATTR_TYPE},
    } = await api.getDictMap('ATTR_TYPE')
    if (code == 0) {
      initData.linkageAttrs = data || []
    }
    if (code1 == 0) {
      initData.ATTR_TYPE = ATTR_TYPE || []
    }
  }
  return initData
}

export default body
