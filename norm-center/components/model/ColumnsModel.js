import Router from 'next/router'
import {Space} from 'antd'

const columns = [
  {
    title: '调用日期',
    dataIndex: 'callDate',
    width: 120,
    key: 'callDate',
  },
  {
    title: '指标名',
    dataIndex: 'indicatorsName',
    // width: 100,
    key: 'indicatorsName',
  },
  {
    title: '指标中文名',
    dataIndex: 'indicatorsNameCN',
    // width: 150,
    key: 'indicatorsNameCN',
  },
  {
    title: '类型',
    dataIndex: 'indicatorsColumnType',
    width: 70,
    key: 'indicatorsColumnType',
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    width: 80,
    key: 'defaultValue',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    // width: '15%',
    key: 'desc',
  },
  {
    title: '命中结果',
    dataIndex: 'result',
    key: 'result',
    render: (text, record) => {
      let wrap = {
        wordBreak: 'break-all',
      }
      return <div style={wrap}>{text}</div>
    },
  },
  {
    title: '操作',
    width: 80,
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a onClick={() => onCheckDetail(record)}>详情</a>
      </Space>
    ),
  },
]

const onCheckDetail = (record) => {
  let url = `/statistical/query/detail?callId=${record.id}`
  Router.push(url)
}

export default columns
