import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import {Table, Card, Button, message} from 'antd'
import Router, {withRouter} from 'next/router'
import fetch from '~/utils/fetch'

const breadcrumbs = [{text: '营销管理'}, {text: '活动管理'}, {text: '获奖名单'}]

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.activityservice.prizelist', [{id}])
  if (code == 0) {
    return data
  }
}
function body(props) {
  const style = {marginLeft: 10}
  const [list, setList] = useState([])

  useEffect(() => {
    setList(props.data.items)
  }, [props])

  const exportData = async () => {
    let postData = {
      id: props.id,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.activityservice.prizeexport', [postData])
    if (code == 0) {
      message.success('导出成功')
      window.open(data)
    }
  }

  const provide = async (row) => {
    let postData = {
      id: row.id,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.activityservice.grantprize', [postData])
    if (code == 0) {
      message.success('发放成功')
      reloadData()
    }
  }

  const reloadData = async () => {
    let data = await getData(props.id)
    setList(data.items)
  }
  const columns = [
    {
      title: '中奖用户',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '奖品类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },

    {
      title: '奖品等级',
      dataIndex: 'leve',
      key: 'leve',
      width: 150,
    },
    {
      title: '奖品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '单件奖品成本(元)',
      dataIndex: 'prizeAmount',
      key: 'prizeAmount',
      width: 150,
    },
    {
      title: '中奖时间',
      dataIndex: 'time',
      key: 'time',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: '奖品发放时间',
      dataIndex: 'grantDate',
      key: 'grantDate',
      width: 150,
    },
    {
      title: '奖品发放状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      fixed: 'right',
      render: (text) => {
        switch (text) {
          case 1:
            return '已发放'
          case 0:
            return '未发放'
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'surplusPayableAmount',
      key: 'surplusPayableAmount',
      width: 180,
      fixed: 'right',
      render: (record, row) => {
        return (
          <span>
            {row.status == 0 ? (
              <a style={style} onClick={() => provide(row)}>
                发放
              </a>
            ) : null}
          </span>
        )
      },
    },
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <div style={{overflow: 'hidden'}}>
          <p style={{fontWeight: 'bold', float: 'left'}}>
            活动名称：{props.activityName}
          </p>
          <Button type="primary" style={{float: 'right'}} onClick={exportData}>
            导出数据
          </Button>
        </div>

        <Table
          style={{marginTop: 10}}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id + Math.random()}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const id = params.ctx.query.id
  const activityName = params.ctx.query.name
  let data = {}
  if (id) {
    data = await getData(id)
  }
  return {data, id, activityName}
}
export default withRouter(body)
