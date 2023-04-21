import React, {useState} from 'react'
import {Table, Button, Badge} from 'antd'
import ScriptSourceDetailModal from '../ScriptSourceDetailModal'
import moment from 'moment'
import styles from './index.less'

const TableList = ({list, onPage, onEdit, pageParams, onDelete}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [scriptSource, setScriptSource] = useState('')
  const [title, setTitle] = useState('')

  const isNewAdd = (time) => {
    // console.log('time', time)
    let diff = moment().diff(moment(time), 'day', true)
    return diff <= 3
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (t, r, i) => {
        // console.log('r', r);
        const isNew = isNewAdd(r.createTime)
        console.log('isNew', isNew)
        return (
          <React.Fragment>
            <span className={isNew ? styles.newTips : ''}>{t}</span>
          </React.Fragment>
        )
      },
    },
    {
      title: '请求方式',
      dataIndex: 'requestType',
      key: 'requestType',
      width: 100,
    },
    {
      title: '请求URL',
      dataIndex: 'requestUrl',
      key: 'requestUrl',
      width: 100,
      render: (text, record) => (
        <span
          onClick={() => onShowAllScriptSource(text, 'URL')}
          style={{color: '#1890ff', cursor: 'pointer', wordBreak: 'break-all'}}
        >
          {text}
        </span>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
      width: 100,
      render: (text, record, index) => {
        return (
          <span
            onClick={() => onShowAllScriptSource(text, 'Body')}
            style={{
              color: '#1890ff',
              cursor: 'pointer',
              wordBreak: 'break-all',
            }}
          >
            查看详情
          </span>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              更新
            </Button>

            <Button type="link" onClick={() => onDelete(record)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]
  const onShowAllScriptSource = (scriptSource, title) => {
    setTitle(title)
    setScriptSourceVisible(true)
    setScriptSource(scriptSource)
  }
  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }

  return (
    <>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={columns}
        bordered
        pagination={pagination}
        // scroll={{y: '100%', x: '100%'}}
      />
      <ScriptSourceDetailModal
        {...{
          title,
          scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </>
  )
}

export default TableList
