import {Col, Row, Button} from 'antd'
import Router, {withRouter} from 'next/router'
import {Layout} from '~/components/Layout'
import ParamsDetail from './components/ParamsDetail'
import fetch from '~/utils/fetch'

const breadcrumbs = [{text: '统计分析'}, {text: '调用查询'}, {text: '调用详情'}]

function body(props) {
  return (
    <Layout
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
      <Row
        gutter={24}
        style={{
          marginTop: 0,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <ParamsDetail
            title="输入参数"
            content={(props.data && props.data.inputData) || `{}`}
          />
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <ParamsDetail
            title="输出参数"
            content={(props.data && props.data.outputData) || `{}`}
          />
        </Col>
      </Row>
    </Layout>
  )
}
body.getInitialProps = async ({ctx}) => {
  const defaultData = {
    inputData: `{}`,
    outputData: `{}`,
  }
  let callId = ctx.query.callId
  try {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsstatisticservice.getcalldetailbycallid',
      [callId],
    )
    console.log(data)
    if (code === 0) {
      return {
        data,
      }
    }

    return {
      data: defaultData,
    }
  } catch (err) {
    return {
      data: defaultData,
    }
  }
}
export default withRouter(body)
