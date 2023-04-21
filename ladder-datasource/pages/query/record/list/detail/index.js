import {Layout} from '~/components/Layout'
import React, {useState} from 'react'
import api from '~/utils/api'
import dynamic from 'next/dynamic'
import {Card, Divider, Space, Button} from 'antd'
import Router, {withRouter} from 'next/router'

const ReactJson = dynamic(() => import('react-json-view'), {ssr: false})

const getData = async (id) => {
  let {
    data: {code, data},
  } = await api.getRecordDetail(id)
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [
  {text: '明细管理'},
  {text: '用户记录查询', path: '/query/record/list'},
  {text: '查看结果'},
]

function body(props) {
  const [data, setData] = useState(props.data)

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      // extra={<Button onClick={Router.back}>返回上一页</Button>}
    >
      <Card
        title="用户信息"
        style={{borderBottom: 'none'}}
        headStyle={{borderBottom: 'none', fontWeight: 'bold'}}
      >
        <Space size={150}>
          <span>姓名：&emsp;{data.name}</span>
          <span>手机号码：&emsp;{data.mobile}</span>
          <span>身份证号码：&emsp;{data.idCard}</span>
        </Space>
      </Card>

      <Card
        title="查询信息"
        style={{borderBottom: 'none'}}
        headStyle={{borderBottom: 'none', fontWeight: 'bold'}}
      >
        <Space size={150}>
          <span>数据源名称：&emsp;{data.companyName}</span>
          <span>数据产品名称：&emsp;{data.dataProductName}</span>
          <span>业务名称：&emsp;{data.callerName}</span>
        </Space>
        <Divider />
        <Space size={150}>
          <span>查询结果：&emsp;{data.successName}</span>
          {/*<span>查询IP：&emsp;{data.ip}</span>*/}
          <span>查询耗时：&emsp; {data.querySecsValue}</span>
          <span>是否缓存：&emsp; {data.fromCache}</span>
        </Space>
      </Card>

      <Card
        title="输入参数"
        style={{borderBottom: 'none'}}
        headStyle={{borderBottom: 'none', fontWeight: 'bold'}}
      >
        <Card>
          {/* theme="colors" */}
          <ReactJson
            src={data.input && JSON.parse(data.input)}
            theme="colors"
          />
        </Card>
      </Card>

      <Card
        title="输出结果"
        style={{borderBottom: 'none'}}
        headStyle={{borderBottom: 'none', fontWeight: 'bold'}}
      >
        <Card>
          <ReactJson
            src={data.output && JSON.parse(data.output)}
            theme="colors"
          />
        </Card>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async ({ctx}) => {
  let data = await getData(ctx.query.id)
  return {data}
}

export default body
