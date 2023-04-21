import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  Card,
  Image,
} from 'antd'
import Router, {withRouter} from 'next/router'

const breadcrumbs = [{text: '用户运营'}, {text: '问题反馈'}, {text: '问题详情'}]

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.userfeedbackservice.userfeeddetails', [{id}])
  if (code == 0) {
    return data
  }
}

function body(props) {
  const [data, setData] = useState([])
  useEffect(() => {
    if (props.id) {
      setData(props.data)
    }
  }, [props])

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card
          title="提交人信息"
          headStyle={{
            paddingLeft: 20,
            fontWeight: 700,
            fontSize: 18,
            // border: 0,
            paddingBottom: -60,
          }}
          style={{padding: '0 30px'}}
          bordered={false}
        >
          <Row gutter={24}>
            <Col span={6}>手机号：{data.mobilePhone}</Col>
            <Col span={6}>姓名：{data.userName}</Col>
            <Col span={6}>提交时间：{data.createTime}</Col>
            <Col span={6}>
              平台：
              {data.appType == 'android'
                ? '客户经理APP安卓端'
                : '客户经理APPios端'}
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: 20}}>
          <div>
            <div style={{fontWeight: 700, fontSize: 18}}>问题描述：</div>
            <div
              style={{
                float: 'left',
                marginLeft: 90,
                marginTop: -26,
                width: '85%',
              }}
            >
              {data.content}
            </div>
          </div>

          <div style={{marginTop: 30}}>
            <div style={{fontWeight: 700, fontSize: 18, float: 'left'}}>
              问题截图：
            </div>
            <div style={{float: 'left', left: 0, top: 0}}>
              {data.pictures && data.pictures.indexOf(',') >= 1 ? (
                <span>
                  <Image.PreviewGroup>
                    <Row gutter={24}>
                      {data.pictures.split(',').map((src, i) => {
                        return (
                          <Col flex="0 0 200" key={i}>
                            <Image width={200} height={300} src={src} key={i} />
                          </Col>
                        )
                      })}
                    </Row>
                  </Image.PreviewGroup>
                </span>
              ) : (
                <Image width={200} src={data.pictures} />
              )}
            </div>
          </div>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const id = params.ctx.query.id
  let data = {}
  if (id) {
    data = await getData(id)
  }
  return {data, id}
}

export default body
