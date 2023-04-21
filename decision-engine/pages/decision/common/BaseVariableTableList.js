import React, {useState} from 'react'
import {Table, Modal, Button, message, Tooltip} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const BaseVariableTableList = (props) => {
  const {
    list,
    onPage,
    pageParams,
    extraColumn,
    sizeConfig,
    rowSelectionConfig,
    onRowConfig,
    partialPro,
    activeCategoryKey,
    markId,
  } = props
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const [visible, setVisible] = useState(false)
  const [initDefault, setInitDefault] = useState([])
  const [selectId, setSelectId] = useState([])
  const columns = [
    {
      title: '分组',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      width: 150,
    },
    {
      title: '中文名',
      dataIndex: 'fieldShowName',
      key: 'fieldShowName',
      width: 150,
    },
    {
      title: '参数',
      dataIndex: 'fieldColumnName',
      key: 'fieldColumnName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'fieldColumnType',
      key: 'fieldColumnType',
      width: 150,
    },
    {
      title: `${activeCategoryKey == 2 ? '匹配值' : '默认值'}`,
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 150,
      render: (text, record) => {
        return activeCategoryKey == 2 ? (
          <a
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: 150,
              display: 'inline-block',
            }}
            onClick={() => copyText(record)}
          >
            {text}
          </a>
        ) : text !== null &&
          text != isNaN(text) &&
          text != true &&
          text != false &&
          text != '' &&
          String(text).length >= 20 ? (
          <Tooltip placement="top" title={text}>
            {text.substring(0, 9) + '...'}
          </Tooltip>
        ) : (
          <span>{text}</span>
        )
      },
    },
    {
      title: '定义',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
  ]

  const copyText = (record) => {
    setVisible(true)
    setInitDefault(record.defaultValue)
  }

  const onCopy = () => {
    message.success('已复制至剪切板')
  }

  const onHide = () => {
    setVisible(false)
  }
  const mergedColumns = extraColumn ? [...columns, extraColumn] : columns

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
      // console.log(pageParams)
      onPage(pageParams)
    },
  }

  return (
    <>
      <Table
        rowKey="id"
        dataSource={list.list}
        columns={mergedColumns}
        bordered
        pagination={pagination}
        rowSelection={
          rowSelectionConfig && !partialPro
            ? {
                ...rowSelectionConfig,
              }
            : null
        }
        scroll={{y: '100%', x: '1600px'}}
        size={sizeConfig || 'default'}
        onRow={(record) => {
          return {
            onClick: (event) => {
              typeof onRowConfig === 'function' && onRowConfig(record)
              console.log(record.id)
              setSelectId(record.id)
            },
          }
        }}
        rowClassName={(record, idx) => {
          let classes = []
          classes.push(record.id === selectId && markId ? 'rowStyle' : '')
          classes.push(idx % 2 === 0 ? 'bg-row' : '')
          classes.join(' ')
          return classes
        }}
      />
      <Modal
        title=""
        visible={visible}
        // onOk={onEdit}
        onCancel={onHide}
        destroyOnClose={true}
        width={600}
        footer={[
          <CopyToClipboard text={initDefault} onCopy={onCopy}>
            <Button type="primary">复制全部内容</Button>
          </CopyToClipboard>,
          <Button key="back" onClick={onHide}>
            关闭
          </Button>,
        ]}
      >
        <span>{initDefault}</span>
      </Modal>
    </>
  )
}

export default BaseVariableTableList
