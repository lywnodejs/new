import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Steps,
  Tabs,
  Descriptions,
  Image,
  Table,
  Modal,
  Avatar,
  Space,
} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'
import Router, {useRouter, withRouter} from 'next/router'
import RepayList from '../RepayList'
import TableList from './TableList'
import api from '~/api/order'
import apiCredit from '~/api/credit'
import apiProduct from '~/api/product'
import _ from 'lodash'
import styles from './index.less'

const {Step} = Steps
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const {TabPane} = Tabs
const breadcrumbs = [{text: '进件管理'}, {text: '授信申请列表'}, {text: '详情'}]
const tabBarStyle = {
  backgroundColor: '#fff',
  marginBottom: 15,
  paddingLeft: 15,
}

const idCardImgType = [
  'idCardFrontOcr',
  'idCardBackOcr',
  'livenessOcr',
  'license',
]

function body(props) {
  const [showCourt, setShowCourt] = useState(false)
  const [detail, setDetail] = useState({})
  const [courtData, setCourtData] = useState([])

  const [defaultActiveKey, setDefaultActiveKey] = useState('tab')
  const router = useRouter()

  useEffect(() => {
    getDetail()
  }, [])

  const contactColumns = [
    {title: '联系人姓名', dataIndex: 'userName'},
    {title: '联系电话', dataIndex: 'phoneNo'},
    {title: '联系人关系', dataIndex: 'attrName'},
  ]
  const riskColumns = [
    {
      title: '序号',
      key: 'sortNum',
      render: (text, record, index) => {
        return index + 1
      },
    },
    {title: '规则名称', dataIndex: 'ruleName'},
    {
      title: '规则设定',
      dataIndex: 'scriptSource',
      width: 300,
      render: (text, record) => (
        <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
          {text}
        </div>
      ),
    },
    {
      title: '命中详情',
      dataIndex: 'fieldValueStrL',
      width: 300,
      render: (text, record) => (
        <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
          {text}
        </div>
      ),
    },
    {
      title: '满足条件是否通过',
      dataIndex: 'expectedValue',
      render: (text, record, index) => {
        return text ? '通过' : '拒绝'
      },
    },
    {
      title: '命中结果',
      dataIndex: 'result',
      render: (text, record, index) => {
        return text ? '命中' : '未命中'
      },
    },
    {
      title: '操作',
      key: 'cz',
      width: 100,
      fixed: 'right',
      render: (text, record, index) => {
        return record.simpleRuleCode == 'Blacklist_access_rules-RA_101' ||
          record.simpleRuleCode == 'Blacklist_access_rules-RS_101' ? (
          <Button type="link" onClick={() => checkDetail(record)}>
            查看详情
          </Button>
        ) : (
          '-'
        )
      },
    },
  ]

  const courtColumns = [
    {
      title: '序号',
      dataIndex: 'name',
      render: (text, record, index) => {
        return index + 1
      },
    },
    {title: '失信案件发生时间', dataIndex: 'datatime'},
    {title: '失信案件执行类型', dataIndex: 'datatype'},
    {title: '失信案件执行法院', dataIndex: 'court'},
    {title: '失信案件执行标的', dataIndex: 'money'},
    {title: '失信案件生效法律文书确定的义务', dataIndex: 'obligation'},
    {title: '失信案件被执行人的履行情况', dataIndex: 'performance'},
    {title: '失信被执行人行为具体情形', dataIndex: 'concretesituation'},
    {title: '执行案件类型', dataIndex: 'execDatatype'},
    {title: '执行案件执行法院', dataIndex: 'execCourt'},
    {title: '执行案件立案时间', dataIndex: 'execDatatime'},
    {title: '执行案件标的', dataIndex: 'execMoney'},
    {title: '执行案件状态', dataIndex: 'statute'},
    {title: '执行案件做出执行依据的机构', dataIndex: 'basiccourt'},
  ]

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
      <Table
        dataSource={data}
        columns={contactColumns}
        pagination={false}
        rowKey="contactId"
      />
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

  const getDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_all_list(router.query.id || props.id)
      // } = await api.getTestData()
      if (code === 0) {
        setDetail(data)
        const catDTOS = data.catSnapShotDTOS
        if (Array.isArray(catDTOS) && catDTOS.length > 0) {
          setDefaultActiveKey('1')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const checkDetail = (record) => {
    fetchRiskDetail(record.userType)
  }

  const fetchRiskDetail = async (type) => {
    const {
      name,
      certNo,
      phone,
      spouseName,
      spousePhone,
      spouseCertNo,
    } = detail.userInfo
    const params = {
      orderId: router.query.orderId || props.id,
      userType: type,
      name: type == 1 ? name : spouseName,
      idCard: type == 1 ? certNo : spouseCertNo,
      mobile: type == 1 ? phone : spousePhone,
    }

    try {
      const {
        data: {data, code},
      } = await apiCredit.fetch_risk_detail({params})
      if (code == 0) {
        setCourtData(data)
        setShowCourt(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => router.back()}>返回上一页</Button>}
    >
      <Card style={{marginBottom: 30}}>
        <Descriptions
          title={
            <div className={styles.userinfo}>
              <Avatar size={64} icon={<UserOutlined />} />
              {/*<img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />*/}
              <span>{detail.name}</span>
            </div>
          }
          extra={
            <div className={styles.extraTit}>
              <span>进件单号：</span>
              {detail.orderNo}
            </div>
          }
          column={5}
        >
          <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
          <Descriptions.Item label="产品名称">
            {detail.productName}
          </Descriptions.Item>
          <Descriptions.Item label="授信金额">
            {detail.creditAmount}
          </Descriptions.Item>
          <Descriptions.Item label="年化利率">
            {detail.yearRate}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="进件状态" style={{marginBottom: 30}}>
        {Array.isArray(detail.loanApplyStatusDetail) ? (
          <Steps progressDot current={detail.loanApplyStatusDetail.length}>
            {detail.loanApplyStatusDetail.map((v, i) => {
              return (
                <Step title={v.statusDesc} description={v.updateTime} key={i} />
              )
            })}
          </Steps>
        ) : null}
      </Card>

      <Tabs
        animated={{tabPane: true}}
        activeKey={defaultActiveKey}
        onTabClick={(key) => setDefaultActiveKey(key)}
        tabBarStyle={tabBarStyle}
      >
        {Array.isArray(detail.catSnapShotDTOS) &&
          detail.catSnapShotDTOS.map((v, i) => {
            const key = i + 1 + ''
            return (
              <TabPane className={styles.tabPaneBox} tab={v.catName} key={key}>
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
                            {/*{s_item.catName === '身份认证' && (*/}
                            {s_item.catType === 'cat_ocr' && (
                              <Image.PreviewGroup>
                                <Row gutter={25}>
                                  {Array.isArray(s_item.list) &&
                                    s_item.list
                                      .filter(
                                        (img) =>
                                          idCardImgType.indexOf(img.attrType) >
                                          -1,
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

                            {/*{s_item.catName !== '联系人信息' &&*/}
                            {/*  s_item.catName !== '身份认证' && (*/}
                            {s_item.catType !== 'cat_ocr' &&
                              s_item.catType !== 'cat_contact' && (
                                <ShowDescriptions data={s_item} />
                                // <Descriptions bordered>
                                //   {Array.isArray(s_item.list) &&
                                //     s_item.list.map((desc, desc_index) => {
                                //       return (
                                //         <Descriptions.Item
                                //           label={desc.attrName}
                                //           key={desc_index}
                                //         >
                                //           {Array.isArray(desc.list) ? (
                                //             <Descriptions
                                //               bordered={false}
                                //               className={styles.childTable}
                                //             >
                                //               {desc.list.map(
                                //                 (child_list, child_index) => {
                                //                   <Descriptions.Item
                                //                     key={child_index}
                                //                     label={child_list.attrName}
                                //                   >
                                //                     <ShowValContainer
                                //                       type={child_list.attrType}
                                //                       showValue={
                                //                         child_list.showValue
                                //                       }
                                //                     />
                                //
                                //                     {/*{child_list.showValue}*/}
                                //                   </Descriptions.Item>
                                //                 },
                                //               )}
                                //             </Descriptions>
                                //           ) : (
                                //             <ShowValContainer
                                //               type={desc.attrType}
                                //               showValue={desc.showValue}
                                //             />
                                //           )}
                                //         </Descriptions.Item>
                                //       )
                                //     })}
                                // </Descriptions>
                              )}

                            {/*{s_item.catName === '联系人信息' && (*/}

                            {s_item.catType === 'cat_contact' && (
                              <ContactList data={s_item.list} />
                            )}
                          </Card>
                        )
                      })
                    : null}
                </Card>
              </TabPane>
            )
          })}

        <TabPane tab="风控决策" key="tab">
          <Card title="风控决策">
            {Array.isArray(detail.riskList)
              ? detail.riskList.map((riskItem, i) => {
                  const list = Array.isArray(riskItem.riskBaseInfoList)
                    ? riskItem.riskBaseInfoList.map((v, i) => {
                        v.riskId = i
                        v.userType = riskItem.userType
                        return v
                      })
                    : []
                  return (
                    <div className={styles.fkjc} key={i}>
                      <h3 className="title">
                        {riskItem.userType == 1 ? '借款人' : '借款人配偶'}
                      </h3>

                      <Row gutter={24} className="desc">
                        <Col>执行条数：{riskItem.resultCount}</Col>
                        <Col>命中拒绝：{riskItem.denyCount}</Col>
                      </Row>

                      <Table
                        dataSource={list}
                        columns={riskColumns}
                        pagination={false}
                        bordered
                        rowKey="riskId"
                      />
                    </div>
                  )
                })
              : null}
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title="详情"
        width="80%"
        footer={null}
        onCancel={() => setShowCourt(false)}
        visible={showCourt}
      >
        <Table
          dataSource={courtData}
          columns={courtColumns}
          pagination={false}
          bordered
          rowKey="id"
        />
      </Modal>
    </Layout>
  )
}

export default withRouter(body)
