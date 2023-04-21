import React, {useEffect, useState, useRef, useContext} from 'react'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import {UserOutlined} from '@ant-design/icons'
import {
  Avatar,
  Card,
  Space,
  Descriptions,
  List,
  Row,
  Col,
  Divider,
  Button,
  Image,
} from 'antd'
import Media from '~/components/common/Media'

import styles from './index.less'
import Router, {useRouter, withRouter} from 'next/router'

const breadcrumbs = [
  {text: '贷后管理'},
  {text: '贷后检查管理'},
  {text: '检查详情'},
]

// const getData = async (params) => {
//   try {
//     const {
//       data: {data, code},
//     } = await api.getCheckResult(params)
//     return code == 0 ? data : {}
//   } catch (e) {
//     console.error(e)
//     return {}
//   }
// }

function body(props) {
  const [detail, setDetail] = useState([])

  let postData = {
    id: props.router.query.id || props.id,
    type: props.router.query.type || props.type,
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.getCheckResult({...postData})
        if (code == 0) {
          setDetail(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      <Card style={{marginBottom: 30}}>
        <Space align="center" size={15} style={{marginBottom: 25}}>
          <Avatar size={64} icon={<UserOutlined />} />
          <h3 style={{marginBottom: 0}}>{detail.realName}</h3>
        </Space>

        <Descriptions column={6}>
          <Descriptions.Item label="联系电话">
            {detail.mobilePhone}
          </Descriptions.Item>
          <Descriptions.Item label="借据号">
            {detail.orderNum}
          </Descriptions.Item>
          <Descriptions.Item label="借款周期">
            {detail.loanApplyTerm}
          </Descriptions.Item>
          <Descriptions.Item label="申请日期">
            {detail.loanApplyTime}
          </Descriptions.Item>
          <Descriptions.Item label="剩余本金">
            {detail.repayAmount}
          </Descriptions.Item>
          <Descriptions.Item label="提现金额">
            {detail.loanAmount}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={Array.isArray(detail.reviewOrder) ? detail.reviewOrder : []}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={`贷后检查时间：${item.creviewCreateTime.substr(0, 10)}`}
              size="small"
            >
              <Row gutter={20} className={styles.descItem}>
                <Col className={styles.title}>检查编号</Col>
                <Col className={styles.desc}>{item.reviewOrderNum}</Col>
              </Row>
              <Row>
                <Col className={[styles.title, styles.descItem]}>发起检查</Col>
                <Col offset={1} className={styles.desc}>
                  <div>检查原因：{item.reviewReason}</div>
                  <div>检查内容：{item.reviewContent}</div>
                </Col>
              </Row>
              <Row gutter={20} className={styles.descItem}>
                <Col span={20} className={styles.title} style={{marginTop: 6}}>
                  借款详情
                </Col>
                <Col offset={1} className={styles.desc}>
                  <div style={{marginTop: 6}}>
                    <p>
                      借据状态：
                      {item.payStatus == 0
                        ? '还款中'
                        : item.payStatus == 1
                        ? '已逾期'
                        : item.payStatus == 2
                        ? '已还款'
                        : '--'}
                    </p>
                    <a
                      onClick={() =>
                        Router.push(
                          `/accounting/iou/detail?orderNum=${item.orderNum}`,
                        )
                      }
                    >
                      查看详情
                    </a>
                  </div>
                </Col>
              </Row>
              <Divider />

              {Array.isArray(item.catAttrs)
                ? item.catAttrs.map((catAttr, i) => {
                    return (
                      <Card
                        bodyStyle={{padding: 0}}
                        headStyle={{padding: 0}}
                        bordered={false}
                        title={
                          <div className={styles.title}>{catAttr.catName}</div>
                        }
                        key={i}
                      >
                        <Descriptions column={2} style={{marginTop: 15}}>
                          {Array.isArray(catAttr.list)
                            ? catAttr.list.map((attr, index) => {
                                let showTemp = attr.showValue
                                let type = attr.attrType
                                if (
                                  type == 'image' ||
                                  type == 'voice' ||
                                  type == 'video'
                                ) {
                                  const showValue = attr.showValue
                                    ? attr.showValue.split(',')
                                    : []
                                  showTemp = (
                                    <Media type={type} data={showValue} />
                                  )
                                }
                                return (
                                  <Descriptions.Item
                                    label={attr.attrName}
                                    key={index}
                                  >
                                    {showTemp}
                                  </Descriptions.Item>
                                )
                              })
                            : null}
                        </Descriptions>
                      </Card>
                    )
                  })
                : null}
            </Card>
          </List.Item>
        )}
      />
    </Layout>
  )
}

// body.getInitialProps = async (context) => {
//   const {id, type} = context.ctx.query
//   const params = {id, type}
//   const detail = await getData(params)

//   return {detail, params}
// }

export default withRouter(body)
