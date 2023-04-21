import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
import {Button, Table, Space, Modal, message} from 'antd'
import Router from 'next/router'
import {DndProvider, useDrag, useDrop, createDndContext} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import css from './index.less'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getData = async () => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appcellconfigservice.appcelllist', [
    {location: 'myPage'},
  ])
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '运营配置'}, {text: '我的页管理'}]

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
  const columns = [
    {title: '名称', dataIndex: 'name'},
    {
      title: 'ICON',
      dataIndex: 'imageUrl',
      render: (t) => {
        return (
          <div>
            <img style={{width: 100}} src={t} />
          </div>
        )
      },
    },
    {
      title: '链接',
      dataIndex: 'targetUrl',
      render: (t) => {
        return (
          <div
            style={{
              maxWidth: '500px',
              wordBreak: 'break-word',
              margin: '0 auto',
            }}
          >
            {t}
          </div>
        )
      },
    },
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '状态',
      dataIndex: 'online',
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
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const saveSort = async () => {
    const sortIds = data
      .map((v) => {
        return v.id
      })
      .join(',')
    const params = {
      location: 'myPage',
      sortIds,
    }
    let {
      data: {code},
    } = await fetch('bank.api.appcellconfigservice.sortdata', [params])
    if (code == 0) {
      message.success('保存成功')
    }
  }

  const jump2edit = (id) => {
    let url = '/operation/my/edit'
    if (id) {
      url += `?id=${id}`
    }
    Router.push(url)
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
      console.log(upData)
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
          新增
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
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
