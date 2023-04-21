import {Layout} from '~/components/Layout'
import React, {useEffect, useRef, useState} from 'react'
import {
  Card,
  Row,
  Col,
  Select,
  Modal,
  Button,
  message,
  Form,
  Input,
  Avatar,
  Tag,
  Tabs,
  Image,
  Table,
  Descriptions,
  InputNumber,
  Tooltip,
} from 'antd'
import Router, {withRouter} from 'next/router'
import {UserOutlined} from '@ant-design/icons'
import {DownOutlined, UpOutlined} from '@ant-design/icons'
import apiReview from '~/api/review'
import styles from './index.less'
import InvestigationModal from '~/components/common/investigationModal'

import Media from '~/components/common/Media'

const {TabPane} = Tabs
const breadcrumbs = [
  {text: '信审管理'},
  {text: '审核列表'},
  {text: '授信详情页'},
]

const idCardImgType = ['idCardFrontOcr', 'idCardBackOcr', 'livenessOcr']
function body(props) {
  const flag = props.router.query.flag

  const [isCollapse, setIsCollapse] = useState(false)
  const [detailData, setDetailData] = useState([])
  const [infoData, setInfoData] = useState([])
  const [primaryContactData, setPrimaryContactData] = useState([])
  const [unitData, setUnitData] = useState([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('tab')
  const [presentForm] = Form.useForm()
  const [remarkForm] = Form.useForm()
  const [peopleForm] = Form.useForm()
  const [remarkVisible, setRemarkVisible] = useState(false)
  const [addPeopleVisible, setAddPeopleVisible] = useState(false)
  const [creditResult, setCreditResult] = useState([])
  const [rejectCodes, setRejectCodes] = useState([])
  const [courtData, setCourtData] = useState([])
  const [showCourt, setShowCourt] = useState(false)
  const [newRecord, setNewRecord] = useState([])
  const [riskLable, setRiskLable] = useState([])
  //备注历史
  const [remarkStatus, setRemarkStatus] = useState([])
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNo: 1,
  })
  const [loadState, setLoadState] = useState('init')
  //状态历史
  const [statusHistoryList, setStatusHistoryList] = useState([])
  const [paginationHis, setPaginationHis] = useState({
    pageSize: 5,
    pageNo: 1,
  })
  const [loadStateHis, setLoadStateHis] = useState('init')
  const [pointVisible, setPointVisible] = useState(false)
  const [opUpdateData, setOpUpdateData] = useState([])
  const [refuseVisible, setRefuseVisible] = useState(false)
  const [userInfoList, setUserInfoList] = useState([])
  const [visible, setVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const remarkColums = [
    {
      title: '时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '原始值',
      dataIndex: 'oldValue',
      key: 'oldValue',
    },
    {
      title: '修改后',
      dataIndex: 'newValue',
      key: 'newValue',
      render: (record, text) => {
        return String(record).length >= 10 ? (
          <Tooltip placement="top" title={record}>
            {record.substring(0, 9) + '...'}
          </Tooltip>
        ) : (
          <span>{record}</span>
        )
      },
    },

    {
      title: '修改人',
      dataIndex: 'updateUser',
      key: 'updateUser',
    },
  ]

  const historyColumns = [
    {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '修改人',
      dataIndex: 'updateUser',
      key: 'updateUser',
      width: 180,
    },
  ]

  useEffect(() => {
    creditDetail()
    primaryContactList()
    unitDataList()
    creditResultDetail()
    fetchRejectCode()
    const storage = window.localStorage
    if (storage['spreadId']) {
      setIsCollapse(true)
    }
  }, [])

  useEffect(() => {
    remarkList({...pagination})
  }, [pagination])

  useEffect(() => {
    statusList({...paginationHis})
  }, [paginationHis])
  const creditDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_creditDetail_list({
        creditId: props.router.query.creditId,
        orderId: props.router.query.orderId,
      })
      if (code == 0) {
        setDetailData(data)
        setInfoData(data.catSnapShotDTOS)
        const catDTOS = data.catSnapShotDTOS
        if (Array.isArray(catDTOS) && catDTOS.length > 0) {
          setDefaultActiveKey('1')
        }
        setRiskLable(data.riskLabels)
        setUserInfoList(data.userInfo)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const creditResultDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_getResult_detail({
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        setCreditResult(data)
        presentForm.setFieldsValue({
          ...data,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchRejectCode = async (id) => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_reject_code({
        productScope: 10001,
      })
      if (code == 0) {
        setRejectCodes(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const primaryContactList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.get_data_dict('NOTE_CONTACT')
      if (code == 0) {
        setPrimaryContactData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const remarkList = async (payload) => {
    setLoadState('loading')
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_remark_status({
        ...pagination,
        creditId: Number(props.router.query.creditId),
        type: 2,
        ...payload,
      })
      if (code == 0) {
        setRemarkStatus(data.list)
        setLoadState('init')
      }
      if (data.list.length == data.total) {
        setLoadState('noMore')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loadMore = () => {
    setPagination((pagination) => ({
      pageSize: pagination.pageSize + 10,
      pageNo: pagination.pageNo,
    }))
  }

  const statusList = async (payload) => {
    setLoadStateHis('loading')
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_remark_status({
        creditId: Number(props.router.query.creditId),
        type: 1,
        ...payload,
        ...paginationHis,
      })
      if (code == 0) {
        setStatusHistoryList(data.list)
        setLoadStateHis('init')
      }
      if (data.list.length == data.total) {
        setLoadStateHis('noMore')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const lookMore = () => {
    setPaginationHis((paginationHis) => ({
      pageSize: paginationHis.pageSize + 10,
      pageNo: paginationHis.pageNo,
    }))
  }

  const unitDataList = async () => {
    try {
      const {
        data: {data, code},
      } = await await apiReview.get_data_dict('NOTE_CONTACT_COMPANY')
      if (code == 0) {
        setUnitData(data)
      }
    } catch (err) {
      console.log(err)
    }
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
        columns={contactInfoColumns}
        pagination={false}
        rowKey={(record) => record.showValue + Math.random()}
      />
    )
  }

  const contactInfoColumns = [
    {title: '联系人姓名', dataIndex: 'userName'},
    {title: '联系电话', dataIndex: 'phoneNo'},
    {title: '联系人关系', dataIndex: 'attrName'},
    {title: '备注', dataIndex: 'remark'},
    {
      title: '操作',
      dataIndex: 'cz',
      render: (text, record, index) => {
        return <>{flag ? <a onClick={() => remark(record)}>备注</a> : null}</>
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

  const remark = (record) => {
    setRemarkVisible(true)
    setNewRecord(record)
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

  const opUpdate = async () => {
    const values = await presentForm.validateFields()
    if (values.verifyResult == 'A') {
      setPointVisible(true)
      setOpUpdateData(values)
    }
    if (values.verifyResult == 'D') {
      setRefuseVisible(true)
    }
  }

  const subMitFirst = async () => {
    const values = await presentForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_firstCredit_update({
        ...values,
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('提交成功')
        setPointVisible(false)
        setRefuseVisible(false)
        creditDetail()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const subMitReview = async () => {
    const values = await presentForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_reviewCredi_update({
        ...values,
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('提交成功')
        setPointVisible(false)
        setRefuseVisible(false)
        creditDetail()
        setDisabled(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const subMitFinal = async () => {
    const values = await presentForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_finishCredit_update({
        ...values,
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('提交成功')
        setPointVisible(false)
        setRefuseVisible(false)
        creditDetail()
        setDisabled(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const stashSub = async () => {
    const values = await presentForm.validateFields()
    console.log(values, '==')
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_firstCredit_stash({
        ...values,
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('暂存成功')
        creditDetail()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const backSub = async () => {
    const values = await presentForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_firstCredit_orderReturn({
        ...values,
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('回退成功')
        creditDetail()
        setDisabled(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const riskColumns = [
    {
      title: '序号',
      key: 'sortNum',
      width: 150,
      render: (text, record, index) => {
        return index + 1
      },
    },
    {title: '规则名称', dataIndex: 'ruleName'},
    {
      title: '规则设定',
      dataIndex: 'scriptSource',
      width: 150,
      render: (text, record) => (
        <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
          {text}
        </div>
      ),
    },
    {
      title: '命中详情',
      dataIndex: 'fieldValueStrL',
      width: 150,
      render: (text, record) => (
        <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
          {text}
        </div>
      ),
    },
    {
      title: '满足条件是否通过',
      dataIndex: 'expectedValue',
      width: 150,
      render: (text, record, index) => {
        return text ? '通过' : '拒绝'
      },
    },
    {
      title: '命中结果',
      dataIndex: 'result',
      width: 150,
      render: (text, record, index) => {
        return text ? '命中' : '未命中'
      },
    },
    {
      title: '操作',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return record.actionCode == 'Blacklist_rule_set-RF_403' ||
          record.actionCode == 'Blacklist_limit_rule_set-RFL_403' ? (
          <Button type="link" onClick={() => checkDetail(record)}>
            查看详情
          </Button>
        ) : (
          '-'
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/credit/examine/detail/riskTable?name=${userInfoList.name}&orderId=${props.router.query.orderId}&idCard=${userInfoList.certNo}&mobile=${userInfoList.phone}&userType=${record.userType}`
    Router.push(url)
  }

  const bookRecord = () => {
    let url = `/credit/examine/detail/bookRecord?userId=${detailData.userId}`
    Router.push(url)
  }

  const sendEms = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_sendSms_send({
        creditId: props.router.query.creditId,
      })
      if (code == 0) {
        message.success('短信发送成功')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addPeopleOk = async () => {
    const values = await peopleForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_linkman_update({
        ...values,
        creditId: props.router.query.creditId,
        changeType: 1,
      })
      if (code == 0) {
        message.success('新增联系人成功')
        setAddPeopleVisible(false)
        creditDetail()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemark = async () => {
    const values = await remarkForm.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_linkman_update({
        ...values,
        creditId: props.router.query.creditId,
        changeType: 0,
        linkmanName: newRecord.userName,
        linkmanRelship: newRecord.attrName,
        linkmanNo: newRecord.phoneNo,
      })
      if (code == 0) {
        message.success('备注成功')
        setRemarkVisible(false)
        creditDetail()
        remarkForm.resetFields()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const investigate = () => {
    setVisible(true)
  }

  const onAddRemark = async (investigationModal) => {
    const values = await investigationModal.validateFields()
    console.log(values, '---')
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_creditSurvey_update({
        id: Number(props.router.query.creditId),
        remark: values.note,
      })
      if (code == 0) {
        message.success('下户调查成功')
        setVisible(false)
        creditDetail()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const spread = () => {
    setIsCollapse(true)
    window.localStorage.setItem('spreadId', '111')
  }

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
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Avatar size={60} icon={<UserOutlined />} />
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 24,
                padding: 10,
              }}
            >
              {detailData.name}
            </span>
          </Col>
          <Col span={12}>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: 26,
                marginLeft: 250,
              }}
            >
              信审单号：{detailData.creditNum}
            </p>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={flag ? 5 : 3}>
            <span>
              联系电话：{detailData.phone}
              {flag ? <a onClick={sendEms}>（发送致电前短信）</a> : null}
            </span>
          </Col>
          <Col span={3}>
            <span>产品名称:{detailData.productName}</span>
          </Col>
          <Col span={4}>
            <span>授信日期：{detailData.creditTime}</span>
          </Col>
          <Col span={3}>
            <span>机审授信金额:{detailData.policyLoanAmount}</span>
          </Col>
          <Col span={3}>
            <span>机审授信利率:{detailData.policyLoanRate}</span>
          </Col>
          <Col span={3}>
            <span>人审授信金额:{detailData.creditAmount}</span>
          </Col>
          <Col span={3}>
            <span>人审授信利率:{detailData.yearRate}</span>
          </Col>
        </Row>
      </Card>
      <Row gutter={24}>
        <Col span={16}>
          <Card
            title="风险标签"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{padding: '0 30px', marginTop: 20}}
          >
            {Array.isArray(riskLable) && riskLable.length > 0 ? (
              <div>
                {riskLable &&
                  riskLable.map((item, index) => {
                    return <Tag color="red">{item}</Tag>
                  })}
              </div>
            ) : (
              <p>无</p>
            )}
          </Card>
          <div style={{height: '100%', marginTop: 20}}>
            <Card>
              <Tabs
                animated={{tabPane: true}}
                activeKey={defaultActiveKey}
                onTabClick={(key) => setDefaultActiveKey(key)}
              >
                {Array.isArray(infoData) &&
                  infoData.map((v, i) => {
                    const key = i + 1 + ''
                    return (
                      <TabPane tab={v.catName} key={key}>
                        <Card title={v.catName}>
                          {Array.isArray(v.secondLList) &&
                          v.secondLList.length > 0 ? (
                            v.secondLList.map((s_item, s_index) => {
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
                                                idCardImgType.indexOf(
                                                  img.attrType,
                                                ) > -1,
                                            )
                                            .map((img, img_index) => {
                                              return (
                                                <Col
                                                  flex="0 0 200"
                                                  key={img_index}
                                                >
                                                  <Image
                                                    width={200}
                                                    height={150}
                                                    src={img.showValue}
                                                  />
                                                  <div
                                                    className={styles.imgTime}
                                                  >
                                                    {img.updateTime || '-'}
                                                  </div>
                                                </Col>
                                              )
                                            })}
                                      </Row>
                                    </Image.PreviewGroup>
                                  )}
                                  {s_item.catType === 'before_loan_check' && (
                                    <Descriptions bordered>
                                      {Array.isArray(s_item.list) &&
                                        s_item.list.map((vi, i) => {
                                          {
                                            Array.isArray(vi.list)

                                            return (
                                              <Descriptions.Item
                                                label={vi.attrName}
                                                key={i}
                                                span={2}
                                              >
                                                {Array.isArray(vi.list) ? (
                                                  <div>
                                                    {vi.list.map(
                                                      (attr, index) => {
                                                        let showTemp =
                                                          attr.showValue
                                                        let type = attr.attrType
                                                        if (
                                                          type == 'image' ||
                                                          type == 'voice' ||
                                                          type == 'video'
                                                        ) {
                                                          const showValue = attr.showValue
                                                            ? attr.showValue.split(
                                                                ',',
                                                              )
                                                            : []
                                                          showTemp = (
                                                            <Media
                                                              type={type}
                                                              data={showValue}
                                                            />
                                                          )
                                                        }
                                                        return (
                                                          <Descriptions
                                                            bordered
                                                          >
                                                            <Descriptions.Item
                                                              label={
                                                                attr.attrName
                                                              }
                                                              key={index}
                                                            >
                                                              {showTemp}
                                                            </Descriptions.Item>
                                                          </Descriptions>
                                                        )
                                                      },
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div>{vi.showValue}</div>
                                                )}
                                              </Descriptions.Item>
                                            )
                                          }
                                        })}
                                    </Descriptions>
                                  )}

                                  {s_item.catType === 'cat_contact' && (
                                    <div>
                                      <span>
                                        {flag ? (
                                          <Button
                                            type="primary"
                                            style={{marginBottom: 10}}
                                            onClick={() =>
                                              setAddPeopleVisible(true)
                                            }
                                          >
                                            新增联系人
                                          </Button>
                                        ) : null}
                                        <Button
                                          type="primary"
                                          style={{
                                            marginLeft: 20,
                                            marginBottom: 10,
                                          }}
                                          onClick={bookRecord}
                                        >
                                          通讯录数据
                                        </Button>
                                      </span>

                                      <ContactList data={s_item.list} />
                                    </div>
                                  )}

                                  {s_item.catType !== 'cat_ocr' &&
                                    s_item.catType !== 'before_loan_check' &&
                                    s_item.catType !== 'cat_contact' && (
                                      <ShowDescriptions data={s_item} />
                                    )}
                                </Card>
                              )
                            })
                          ) : (
                            <p>无</p>
                          )}
                        </Card>
                      </TabPane>
                    )
                  })}

                <TabPane tab="风控决策" key="tab">
                  <Card title="风控决策">
                    {Array.isArray(detailData.riskList) &&
                    detailData.riskList.length > 0 ? (
                      detailData.riskList.map((riskItem, i) => {
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
                              rowKey={(record) =>
                                record.ruleName + Math.random()
                              }
                            />
                          </div>
                        )
                      })
                    ) : (
                      <p>无</p>
                    )}
                  </Card>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Col>
        <Col span={8} style={{height: '100%'}}>
          <Card
            title="信审策略"
            extra={
              !isCollapse ? (
                <a onClick={spread}>
                  展开 <DownOutlined />
                </a>
              ) : (
                <a onClick={() => setIsCollapse(false)}>
                  收起&nbsp;
                  <UpOutlined />
                </a>
              )
            }
            headStyle={{
              paddingLeft: 5,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{paddingLeft: 30, marginTop: 20, zIndex: 2, height: '100%'}}
          >
            {isCollapse ? (
              <div
                style={{
                  height: '100%',
                }}
                dangerouslySetInnerHTML={{__html: detailData.strategy}}
              >
                {/* {detailData.strategy} */}
              </div>
            ) : null}
          </Card>
          <Form form={presentForm}>
            <Card title="照会注记" bordered>
              <Form.Item
                label="本人"
                name="noteOneself"
                rules={[{required: true, message: '请先选择'}]}
              >
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={!flag ? true : false}
                >
                  <Select.Option value={null}>请选择</Select.Option>
                  {primaryContactData.map((v, i) => (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="主要联系人"
                name="noteContactMain"
                rules={[{required: true, message: '请先选择'}]}
              >
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={!flag ? true : false}
                >
                  <Select.Option value={null}>请选择</Select.Option>
                  {primaryContactData.map((v, i) => (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="次要联系人"
                name="noteContactMinor"
                rules={[{required: true, message: '请先选择'}]}
              >
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={!flag ? true : false}
                >
                  <Select.Option value={null}>请选择</Select.Option>
                  {primaryContactData.map((v, i) => (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="单位"
                name="noteCompany"
                rules={[{required: true, message: '请先选择'}]}
              >
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={!flag ? true : false}
                >
                  <Select.Option value={null}>请选择</Select.Option>
                  {unitData.map((v, i) => (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="照会注记" name="noteRemark">
                <Input.TextArea disabled={!flag ? true : false} />
              </Form.Item>
              {/* <Button type="primary" style={{float: 'right'}}> */}

              {flag ? (
                <Button
                  disabled={infoData.surveyStatus == 1 ? true : false}
                  type="primary"
                  style={{float: 'right'}}
                >
                  {infoData.surveyStatus == 1 ? (
                    <span>调查中</span>
                  ) : infoData.surveyStatus == 0 ||
                    infoData.surveyStatus == null ? (
                    <span onClick={investigate}>发起下户调查</span>
                  ) : (
                    <span>调查完成</span>
                  )}
                </Button>
              ) : null}
            </Card>
            <Card title="信审结论" bordered style={{marginTop: 20}}>
              <Form.Item
                label="结论"
                name="verifyResult"
                rules={[{required: true, message: '请先选择'}]}
              >
                <Select placeholder="请选择" disabled={!flag ? true : false}>
                  <Select.Option value="A">通过</Select.Option>
                  <Select.Option value="D">拒绝</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.verifyResult !== currentValues.verifyResult
                }
              >
                {({getFieldValue}) => {
                  return (
                    getFieldValue('verifyResult') == 'D' && (
                      <>
                        <Form.Item
                          label="拒绝类型"
                          name="reasonType"
                          rules={[{required: true, message: '请选择拒绝类型'}]}
                        >
                          <Select
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                            disabled={!flag ? true : false}
                          >
                            {rejectCodes &&
                              rejectCodes.length &&
                              rejectCodes.map((v) => {
                                return (
                                  <Select.Option
                                    value={v.rejectType}
                                    key={v.rejectType}
                                  >
                                    {v.rejectTypeName}
                                  </Select.Option>
                                )
                              })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) =>
                            prevValues.reasonType !== currentValues.reasonType
                          }
                        >
                          {({getFieldValue}) => {
                            return (
                              <Form.Item
                                label="拒绝原因"
                                name="verifyResultReason"
                                rules={[
                                  {
                                    required: true,
                                    message: '请选择拒绝原因',
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="请选择"
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  disabled={!flag ? true : false}
                                >
                                  {(function () {
                                    let findOne =
                                      rejectCodes &&
                                      rejectCodes.length &&
                                      rejectCodes.filter(
                                        (one) =>
                                          one.rejectType ==
                                          getFieldValue('reasonType'),
                                      )
                                    return (
                                      findOne &&
                                      findOne.length &&
                                      findOne[0].rejectCodeList.map((v) => {
                                        return (
                                          <Select.Option
                                            value={v.rejectCode}
                                            key={v.rejectCode}
                                          >
                                            {v.rejectName}
                                          </Select.Option>
                                        )
                                      })
                                    )
                                  })()}
                                </Select>
                              </Form.Item>
                            )
                          }}
                        </Form.Item>
                      </>
                    )
                  )
                }}
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.verifyResult !== currentValues.verifyResult
                }
              >
                {({getFieldValue}) => {
                  return (
                    getFieldValue('verifyResult') == 'A' && (
                      <>
                        <Form.Item
                          label="授信额度"
                          name="policyLoanAmount"
                          extra={
                            <span>
                              注：步长为:
                              <span style={{color: '#339dff'}}>1000</span>
                              ，请按照步长规则修改授信额度。
                            </span>
                          }
                          rules={[
                            {required: true, message: '请输入授信额度'},
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                if (value && value % 1000 != 0) {
                                  return Promise.reject(
                                    '请注意步长为1000，请重新输入',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            step={100}
                            style={{width: '100%'}}
                            disabled={!flag ? true : false}
                          />
                        </Form.Item>
                        <Form.Item
                          label="年利率"
                          name="policyLoanRate"
                          rules={[{required: true, message: '请输入授信利率'}]}
                        >
                          <Input suffix="" disabled={!flag ? true : false} />
                        </Form.Item>
                      </>
                    )
                  )
                }}
              </Form.Item>
              <Form.Item label="结论备注" name="resultRemark">
                <Input.TextArea disabled={!flag ? true : false} />
              </Form.Item>
              {flag ? (
                <div style={{float: 'right'}}>
                  {flag == 1 ? (
                    <Button
                      type="primary"
                      onClick={stashSub}
                      disabled={disabled}
                    >
                      暂 存
                    </Button>
                  ) : flag == 2 || flag == 3 ? (
                    <Button
                      type="primary"
                      onClick={backSub}
                      disabled={disabled}
                    >
                      回 退
                    </Button>
                  ) : null}

                  <Button
                    disabled={disabled}
                    type="primary"
                    style={{marginLeft: 10, backgroundColor: '#70b603'}}
                    onClick={opUpdate}
                  >
                    提 交
                  </Button>
                </div>
              ) : null}
            </Card>
          </Form>
          <Card title="结论备注历史" bordered style={{marginTop: 20}}>
            <Table
              columns={remarkColums}
              dataSource={remarkStatus}
              pagination={false}
              rowKey={(record) => record.updateTime + Math.random()}
              footer={() => (
                <div style={{textAlign: 'center'}}>
                  {
                    {
                      init: <a onClick={loadMore}>查看更多</a>,
                      loading: <a>加载中</a>,
                      noMore: <span>数据已加载完成</span>,
                    }[loadState]
                  }
                </div>
              )}
            />
          </Card>

          <Card title="状态历史" bordered style={{marginTop: 20}}>
            <Table
              columns={historyColumns}
              dataSource={statusHistoryList}
              pagination={false}
              rowKey={(record) => record.updateTime + Math.random()}
              footer={() => (
                <div style={{textAlign: 'center'}}>
                  {
                    {
                      init: <a onClick={lookMore}>查看更多</a>,
                      loading: <a>加载中</a>,
                      noMore: <span>数据已加载完成</span>,
                    }[loadStateHis]
                  }
                </div>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        visible={remarkVisible}
        title="备注"
        onCancel={() => setRemarkVisible(false)}
        onOk={handleRemark}
        destroyOnClose
        maskClosable={false}
      >
        <Form form={remarkForm} name={remarkForm}>
          <Form.Item label="联系人备注" name="remark">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={addPeopleVisible}
        title="新增联系人"
        onCancel={() => setAddPeopleVisible(false)}
        onOk={addPeopleOk}
      >
        <Form form={peopleForm} name={peopleForm}>
          <Form.Item label="联系人姓名" name="linkmanName">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="联系电话" name="linkmanNo">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="联系人关系" name="linkmanRelship">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>

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
          rowKey={(record) => record.datatime + Math.random()}
        />
      </Modal>
      <Modal
        title="提示"
        visible={pointVisible}
        onCancel={() => {
          setPointVisible(false)
        }}
        onOk={flag == 2 ? subMitReview : flag == 3 ? subMitFinal : subMitFirst}
      >
        <p>确定给与此用户通过吗？</p>
        <p>
          授信额度:&nbsp;
          <span style={{color: '#df273e'}}>
            {opUpdateData.policyLoanAmount}
          </span>
        </p>
        <p>
          年利率:&nbsp;
          <span style={{color: '#df273e'}}>{opUpdateData.policyLoanRate}</span>
        </p>
      </Modal>
      <Modal
        title="提示"
        visible={refuseVisible}
        onCancel={() => {
          setRefuseVisible(false)
        }}
        onOk={flag == 2 ? subMitReview : flag == 3 ? subMitFinal : subMitFirst}
      >
        <p>确定给与此用户拒绝吗？</p>
      </Modal>

      <InvestigationModal
        visible={visible}
        onHide={() => setVisible(false)}
        selectItem={Number(props.router.query.creditId)}
        onSubmit={onAddRemark}
      />
    </Layout>
  )
}
body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
