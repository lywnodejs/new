import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
import {
  Descriptions,
  Card,
  Image,
  Form,
  Button,
  Input,
  Row,
  Col,
  Select,
  Switch,
  PageHeader,
  Steps,
  Tabs,
  Table,
  Tooltip,
} from 'antd'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import _ from 'lodash'
import Contacts from '~/components/pages/collection/reminded/form/Contacts'
import History from '~/components/pages/collection/reminded/form/History'
import SendSms from '~/components/pages/collection/reminded/form/SendSms'
import styles from './index.less'
import Router from 'next/router'

const {Step} = Steps
const {TabPane} = Tabs
const breadcrumbs = [{text: '催收管理'}, {text: '待催列表'}, {text: '查看订单'}]
const idCardImgType = ['idCardFrontOcr', 'idCardBackOcr', 'livenessOcr']
const getData = async (id) => {
  let {
    data: {code, data},
  } = await api.fetch_order_detail(id)
  return code == 0 ? data : {}
}

function body(props) {
  const [detail, setDetail] = useState({})
  const [history, setHistory] = useState([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('history')
  const [smsList, setSmsList] = useState([])

  useEffect(() => {
    getDetail()
    fetchList()
  }, [])

  const getDetail = async (key) => {
    let data = await getData(props.id)
    if (data && data.loanApplyVo) {
      setDetail(data.loanApplyVo)
      const {catSnapShotDTOS, collectionOrderRecordList} = data.loanApplyVo
      if (Array.isArray(catSnapShotDTOS) && catSnapShotDTOS.length > 0) {
        setDefaultActiveKey(key || '1')
      }

      if (Array.isArray(collectionOrderRecordList)) {
        setHistory(collectionOrderRecordList)
      }
    }
  }
  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getSmsList({collectionOrderId: props.id})
      if (code == 0) {
        setSmsList(data.list.splice(0, 2))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const sendSuccess = () => {
    console.log('sendSuccess')
    fetchList()
  }

  // const reloadData = () => {}

  const onContactMobile = () => {
    let phones = []
    let mobilePhoneEncrypt = []
    if (detail.otherPhones) {
      phones = detail.otherPhones.split(',')
    }
    if (detail.mobilePhoneEncrypt) {
      mobilePhoneEncrypt = detail.mobilePhoneEncrypt.split(',')
    }
    return phones.length
      ? phones.map((phone, index) => {
          return <span style={{marginRight: '6px'}}>{phone}</span>
        })
      : null
  }

  const ContactList = (props) => {
    let data = Array.isArray(props.data) ? _.cloneDeep(props.data) : []
    data = data.map((v, i) => {
      let arr = v.showValue ? v.showValue.split('|') : []
      return {
        ...v,
        userName: arr[0],
        phoneNo: arr[1],
        contactId: i,
      }
    })
    return (
      <Contacts
        list={data}
        reloadData={getDetail}
        {...props.initData}
        userId={detail.userId}
        mobilePhoneEncrypt={detail.mobilePhoneEncrypt}
      />
      // <Table
      //   dataSource={data}
      //   columns={contactColumns}
      //   pagination={false}
      //   rowKey="contactId"
      // />
    )
  }

  const ShowValContainer = ({type, showValue}) => {
    if (idCardImgType.indexOf(type) > -1) {
      type = 'image'
    }

    if (type == 'image' || type == 'voice' || type == 'video') {
      showValue = showValue ? showValue.split(',') : []
    }

    const getByType = () => {
      let template = null
      switch (type) {
        case 'image':
          template = (
            <div className="imageBox">
              <Image.PreviewGroup>
                {showValue.map((src, i) => {
                  return <Image src={src} key={i} />
                })}
              </Image.PreviewGroup>
            </div>
          )
          break
        case 'video':
          template = (
            <Row gutter={10}>
              {showValue.map((src, i) => {
                return (
                  <Col key={i}>
                    <video width="100" height="75" controls>
                      <source src={src} type="video/mp4" />
                      <source src={src} type="video/ogg" />
                      您的浏览器不支持Video标签。
                    </video>
                  </Col>
                )
              })}
            </Row>
          )
          break
        case 'voice':
          template = (
            <audio controls>
              <source src={showValue} type="audio/ogg" />
              <source src={showValue} type="audio/mpeg" />
              您的浏览器不支持 audio 元素。
            </audio>
          )
          break
        default:
          template = showValue
      }

      return template
    }
    return <React.Fragment>{getByType()}</React.Fragment>
  }

  const ShowDescriptions = (props) => {
    const {list} = props.data

    let template = Array.isArray(list) ? (
      <Descriptions bordered>
        {list.map((desc, desc_index) => {
          let values = desc.showValue
          let span = 1
          if (
            desc.attrType == 'image' ||
            desc.attrType == 'voice' ||
            desc.attrType == 'video'
          ) {
            values = values ? values.split(',') : []
          }
          if (
            (Array.isArray(desc.list) && desc.list.length > 0) ||
            (desc.attrType == 'video' &&
              Array.isArray(values) &&
              values.length > 0)
          ) {
            span = 3
          }

          return (
            <Descriptions.Item
              label={desc.attrName}
              key={desc_index}
              span={span}
            >
              {Array.isArray(desc.list) ? (
                <ShowDescriptions data={desc} />
              ) : (
                <ShowValContainer
                  type={desc.attrType}
                  showValue={desc.showValue}
                />
              )}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    ) : null
    return template
  }

  const columns = [
    {
      title: '催收期数',
      dataIndex: 'loanApplyTerms',
      key: 'loanApplyTerms',
      width: 150,
    },
    {
      title: '催收方式',
      dataIndex: 'collectionType',
      key: 'collectionType',
      width: 150,
      render: (record, row) => {
        if (record == 1) {
          return <span>短信</span>
        }
      },
    },
    {
      title: '发送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      width: 150,
      render: (record, row) => {
        if (record == 1) {
          return <span>人工发送</span>
        }
      },
    },
    {
      title: '催收对象',
      dataIndex: 'collectionLink',
      key: 'collectionLink',
      width: 150,
    },
    {
      title: '短信文案',
      dataIndex: 'collectionContent',
      key: 'collectionContent',
      width: 150,
      render: (record, row) => {
        if (String(record).length >= 20) {
          return (
            <Tooltip placement="top" title={record}>
              {record.substring(0, 9) + '...'}
            </Tooltip>
          )
        } else {
          return <span>{record}</span>
        }
      },
    },
    {
      title: '发送日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
  ]
  const lookDetail = () => {
    Router.push(
      `/collection/reminded/form/detail?collectionOrderId=${Router.query.id}`,
    )
  }
  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      <Card style={{marginBottom: 15}}>
        {/* <Button type="primary" onClick={getDetail}>
          get data
        </Button> */}
        <Descriptions title={`借据号：${detail.orderNum || ''}`}>
          <Descriptions.Item label="姓名">{detail.realName}</Descriptions.Item>
          <Descriptions.Item label="手机号">
            {detail.mobilePhone}（
            <SendSms
              sendSuccess={sendSuccess}
              mobilePhoneEncrypt={detail.mobilePhoneEncrypt}
              outOrderNum={detail.outOrderNum}
            />
            ）
          </Descriptions.Item>
          <Descriptions.Item label="身份证号">
            {detail.idCard}
          </Descriptions.Item>
          <Descriptions.Item label="申请产品">
            {detail.productName}
          </Descriptions.Item>
          <Descriptions.Item label="申请时间">
            {detail.createTimeStr}
          </Descriptions.Item>
          <Descriptions.Item label="放款方式">
            {detail.userAccountTypeDesc}
          </Descriptions.Item>
          <Descriptions.Item label="借款渠道">
            {detail.applySourceName}
          </Descriptions.Item>
          <Descriptions.Item label="申请金额">
            {detail.signLoanAmount}
          </Descriptions.Item>
          <Descriptions.Item label="申请期限">
            {detail.loanApplyTerms}
          </Descriptions.Item>
          <Descriptions.Item label="结清单数">
            {detail.finishedOrderNum}
          </Descriptions.Item>
          <Descriptions.Item label="关联手机">
            {onContactMobile()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="用户基本信息">
        <Tabs
          animated={{tabPane: true}}
          activeKey={defaultActiveKey}
          onTabClick={(key) => setDefaultActiveKey(key)}
        >
          {Array.isArray(detail.catSnapShotDTOS) &&
            detail.catSnapShotDTOS.map((v, i) => {
              const key = i + 1 + ''
              return (
                <TabPane
                  className={styles.tabPaneBox}
                  tab={v.catName}
                  key={key}
                >
                  <Card title={v.catName}>
                    {Array.isArray(v.secondLList)
                      ? v.secondLList.map((s_item, s_index) => {
                          return (
                            <Card
                              style={{marginBottom: 15}}
                              key={s_index}
                              type="inner"
                              title={s_item.catName}
                            >
                              {s_item.catType === 'cat_ocr' && (
                                <Image.PreviewGroup>
                                  <Row gutter={25}>
                                    {Array.isArray(s_item.list) &&
                                      s_item.list
                                        .filter(
                                          (img) =>
                                            idCardImgType.indexOf(
                                              img.attrType,
                                            ) > -1,
                                        )
                                        .map((img, img_index) => {
                                          return (
                                            <Col flex="0 0 200" key={img_index}>
                                              <Image
                                                width={200}
                                                height={150}
                                                src={img.showValue}
                                              />
                                              <div className={styles.imgTime}>
                                                {img.updateTime || '-'}
                                              </div>
                                            </Col>
                                          )
                                        })}
                                  </Row>
                                </Image.PreviewGroup>
                              )}

                              {s_item.catType !== 'cat_ocr' &&
                                s_item.catType !== 'cat_contact' && (
                                  <ShowDescriptions data={s_item} />
                                )}

                              {s_item.catType === 'cat_contact' && (
                                <ContactList
                                  data={s_item.list}
                                  initData={props}
                                />
                              )}
                            </Card>
                          )
                        })
                      : null}
                  </Card>
                </TabPane>
              )
            })}

          {/* <TabPane tab="联系人信息" key="4">
            <Contacts />
          </TabPane> */}
          <TabPane tab="催收记录" key="history">
            <History
              list={history}
              {...props}
              reloadData={getDetail}
              mobilePhoneEncrypt={detail.mobilePhoneEncrypt}
            />
          </TabPane>
          <TabPane tab="催收短信记录" key="sms">
            <Table
              pagination={false}
              dataSource={smsList}
              columns={columns}
              rowKey="id"
              footer={() => (
                <div style={{textAlign: 'center'}}>
                  <a onClick={lookDetail}>查看详情</a>
                </div>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async (context) => {
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
    urgeMethods: [],
    urgeObjects: [],
    urgeResults: [],
    urgeResultUnknows: [],
    urgeResultHighs: [],
    urgeResultLows: [],
    urgeIsConnects: [],
    urgeReasonTypes: [],
    urgeRepayDesires: [],
    connectResults: [],
    unConnectResults: [],
    id: context.ctx.query.id,
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: collectionLevels, code: levelCode},
      },
      {
        data: {data: urgeMethods, code: levelCode01},
      },
      {
        data: {data: urgeObjects, code: levelCode02},
      },
      {
        data: {data: urgeResults, code: levelCode03},
      },
      {
        data: {data: urgeResultUnknows, code: levelCode04},
      },
      {
        data: {data: urgeResultHighs, code: levelCode05},
      },
      {
        data: {data: urgeResultLows, code: levelCode06},
      },
      {
        data: {data: urgeIsConnects, code: levelCode07},
      },
      {
        data: {data: urgeReasonTypes, code: levelCode08},
      },
      {
        data: {data: urgeRepayDesires, code: levelCode09},
      },
    ] = await Promise.all([
      api.get_data_dict('COLLECTION_PRODUCT'),
      api.get_data_dict('COLLECTION_LEVEL'),
      api.get_data_dict('URGE_METHOD'),
      api.get_data_dict('URGE_OBJECT'),
      api.get_data_dict('URGE_RESULT'),
      api.get_data_dict('URGE_RESULT_UNKNOWN'),
      api.get_data_dict('URGE_RESULT_HIGH'),
      api.get_data_dict('URGE_RESULT_LOW'),
      api.get_data_dict('URGE_IS_CONNECT'),
      api.get_data_dict('URGE_REASON_TYPE'),
      api.get_data_dict('URGE_REPAY_DESIRE'),
    ])
    if (code == 0) {
      return {
        collectionProducts: data,
        collectionLevels: levelCode === 0 ? collectionLevels : [],
        urgeMethods: levelCode01 === 0 ? urgeMethods : [],
        urgeObjects: levelCode02 === 0 ? urgeObjects : [],
        urgeResults: levelCode03 === 0 ? urgeResults : [],
        urgeResultUnknows: levelCode04 === 0 ? urgeResultUnknows : [],
        urgeResultHighs: levelCode05 === 0 ? urgeResultHighs : [],
        urgeResultLows: levelCode06 === 0 ? urgeResultLows : [],
        urgeIsConnects: levelCode07 === 0 ? urgeIsConnects : [],
        urgeReasonTypes: levelCode08 === 0 ? urgeReasonTypes : [],
        urgeRepayDesires: levelCode09 === 0 ? urgeRepayDesires : [],
        id: context.ctx.query.id,
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default body
