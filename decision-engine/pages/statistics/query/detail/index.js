import {Layout} from '~/components/Layout'
import {message, Card, Row, Col, Button, Tabs} from 'antd'
import {useEffect, useState} from 'react'
import api from '~/api/statistics'
import Router, {useRouter} from 'next/router'
import dynamic from 'next/dynamic'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import List from './List'
import NodeList from './customCanvas/RuleFlowTableList'
// import NodeList from './NodeList'
import {withKeepAlive, keepAliveLoadFromCache} from 'react-next-keep-alive'
const {TabPane} = Tabs
const breadcrumbs = [{text: '统计分析'}, {text: '调用查询'}, {text: '调用详情'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const ReactJson = dynamic(
  () => import('react-json-view').then((module) => module),
  {ssr: false},
)
function body(props) {
  const [parameterData, setParameterData] = useState([])
  const [nodetypelist, setNodetypelist] = useState([])
  const router = useRouter()
  let postData = {
    requestNo: router.query.requestNo,
  }

  useEffect(() => {
    async function fetchData() {
      fetchParameter()
      resultnodetypelist()
    }
    fetchData()
  }, [])
  keepAliveLoadFromCache('query-detail', true)
  const fetchParameter = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_input_parameter(postData)
      if (code == 0) {
        setParameterData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const resultnodetypelist = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_node_list(postData)
      if (code == 0) {
        // console.log('data', data)
        setNodetypelist(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onCopy = () => {
    message.success('已复制至剪切板')
  }
  const jsonText = JSON.stringify(parameterData.paramsIn)

  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={
        <Button
          onClick={() => {
            Router.back()
          }}
        >
          返回上一页
        </Button>
      }
    >
      <Row gutter={24}>
        <Col span={10}>
          <Card
            title="输入参数"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              border: 0,
              paddingBottom: -60,
            }}
            style={{padding: '0 30px'}}
            bordered={false}
          >
            <div style={{height: 'calc(100vh - 316px)', overflow: 'scroll'}}>
              <ReactJson src={parameterData.paramsIn} />
            </div>
            <CopyToClipboard text={jsonText} onCopy={onCopy}>
              <Button type="primary" block>
                复制全部内容
              </Button>
            </CopyToClipboard>
          </Card>
        </Col>
        <Col span={14}>
          <Card
            title="结果详情"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              border: 0,
              paddingBottom: -60,
            }}
            style={{padding: '0 30px'}}
            bordered={false}
          >
            <Tabs defaultActiveKey="1" type="card">
              <TabPane key="1" tab="图形">
                <NodeList
                  {...{
                    parameterData,
                  }}
                />
              </TabPane>
              <TabPane key="2" tab="列表">
                <List
                  {...{
                    nodetypelist,
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export default withKeepAlive(body, 'query-detail')
