import {Layout} from '~/components/Layout'
import {Tooltip as TooltipAnt, Button, Tabs, Table} from 'antd'
import Router from 'next/router'

const {TabPane} = Tabs

const List = ({nodetypelist}) => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'actionCode',
      key: 'actionCode',
      width: 180,
    },
    {
      title: '名称',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '结果',
      dataIndex: 'resultDesc',
      key: 'resultDesc',
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      //   width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        // console.log(Math.random(new Date()));
        return (
          <>
            <Button type="link" onClick={() => checkDetail(record)}>
              详情
            </Button>
          </>
        )
      },
    },
  ]
  const columns1 = [
    {
      title: '编号',
      dataIndex: 'actionCode',
      key: 'actionCode',
      width: 180,
    },
    {
      title: '名称',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '结果',
      dataIndex: 'resultDesc',
      key: 'resultDesc',
    },
  ]

  const checkDetail = (record) => {
    let url = `/statistics/query/detail/rulesList?requestNo=${record.requestNo}&actionType=${record.actionType}&actionId=${record.actionId}&pubSeqNo=${record.pubSeqNo}`
    Router.push(url)
  }

  return (
    <div style={{height: 'calc(100vh - 340px)', overflow: 'scroll'}}>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab="规则集">
          <Table
            rowKey={() => Math.random(new Date())}
            dataSource={nodetypelist.ruleSetList}
            columns={columns}
            scroll={{x: '650px', y: '100%'}}
            rowClassName={(record, idx) => {
              if (idx % 2 === 0) return 'bg-row'
            }}
          />
        </TabPane>
        <TabPane key="2" tab="评分卡">
          <Table
            rowKey={() => Math.random(new Date())}
            dataSource={nodetypelist.scoreCardList}
            columns={columns1}
            scroll={{x: '650px', y: '100%'}}
            rowClassName={(record, idx) => {
              if (idx % 2 === 0) return 'bg-row'
            }}
          />
        </TabPane>
        <TabPane key="3" tab="矩阵">
          <Table
            rowKey={() => Math.random(new Date())}
            dataSource={nodetypelist.matrixList}
            columns={columns1}
            scroll={{x: '650px', y: '100%'}}
            rowClassName={(record, idx) => {
              if (idx % 2 === 0) return 'bg-row'
            }}
          />
        </TabPane>
        <TabPane key="4" tab="衍生规则">
          <Table
            rowKey={() => Math.random(new Date())}
            dataSource={nodetypelist.basicActionList}
            columns={columns1}
            scroll={{x: '650px', y: '100%'}}
            rowClassName={(record, idx) => {
              if (idx % 2 === 0) return 'bg-row'
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default List
