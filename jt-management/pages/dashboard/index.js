import {Layout} from '~/components/Layout'
import {
  message,
  Card,
  Row,
  Col,
  Tooltip as TooltipAnt,
  Progress,
  Select,
} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'
import {useEffect, useState} from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Area,
} from 'recharts'
import {formatMoney, computeUnit} from '~/utils'
import api from '~/api/authority'
import apiProduct from '~/api/product'

const colors = [
  '#1890ff',
  '#5cc35c',
  '#fadb14',
  '#f5222d',
  '#fa8c16',
  '#faad14',
  '#a0d911',
  '#13c2c2',
  '#722ed1',
  '#eb2f96',
  '#bfbfbf',
  '#2f54eb',
]
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [topIndexDatas, setTopIndexDatas] = useState([])
  const [timingDatas, setTimingDatas] = useState([])
  const [listCoreIndexYear, setListCoreIndexYear] = useState([])
  const [dayAddLoanAmountList, setDayAddLoanAmountList] = useState([])
  const [
    dayAddLoanBalanceAmountList,
    setDayAddLoanBalanceAmountList,
  ] = useState([])
  const [dayAddInterestAmountList, setDayAddInterestAmountList] = useState([])
  const [dayAddBadLoanAmountList, setDayAddBadLoanAmountList] = useState([])
  const [dayAddLoanUserList, setDayAddLoanUserList] = useState([])

  const [coreIndexYears, setCoreIndexYears] = useState([])
  const [coreIndex, setCoreIndex] = useState({
    dayAddLoanAmount: 0,
    dayAddLoanBalanceAmount: 0,
    dayAddInterestAmount: 0,
    dayAddBadLoanAmount: 0,
    dayAddLoanUser: 0,
    historyLoanAmount: 0,
    historyLoanBalanceAmount: 0,
    historyLoanNum: 0,
    historyLoanUser: 0,
    historyInterestAmount: 0,
    listCoreIndexYear: [],
    dayAddLoanAmountList: [],
    dayAddLoanBalanceAmountList: [],
    dayAddInterestAmountList: [],
    dayAddBadLoanAmountList: [],
    dayAddLoanUserList: [],
    yearBadLoanAmount: 0,
    yearInterestAmount: 0,
    yearProfit: 0,
    coreIndexNowBadLoan: {amount: 0, count: 0, peopleNumber: 0},
    coreIndexNowOverdue: {},
    yearMonth: null,
    reportTime: null,
  })
  const [coreIndexBadLoan, setCoreIndexBadLoan] = useState({})
  const [coreIndexBadLoanAmount, setCoreIndexBadLoanAmount] = useState([])
  const [coreIndexOverdue, setCoreIndexOverdue] = useState({})
  const [coreIndexOverdueAmount, setCoreIndexOverdueAmount] = useState([])
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState('-1')

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
          data && data.length && setProductId(String(data[0].id))
          fetchIndex(data[0].id)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let {
      dayAddLoanAmount,
      dayAddLoanBalanceAmount,
      dayAddInterestAmount,
      dayAddBadLoanAmount,
      dayAddLoanUser,
      historyLoanAmount,
      historyLoanBalanceAmount,
      historyLoanNum,
      historyLoanUser,
      historyInterestAmount,
      listCoreIndexYear,
      dayAddLoanAmountList,
      dayAddLoanBalanceAmountList,
      dayAddInterestAmountList,
      dayAddBadLoanAmountList,
      dayAddLoanUserList,
      yearBadLoanAmount,
      yearInterestAmount,
      yearProfit,
      coreIndexNowBadLoan,
      coreIndexNowOverdue,
    } = coreIndex
    coreIndexNowBadLoan = coreIndexNowBadLoan || {rate: 0}
    coreIndexNowOverdue = coreIndexNowOverdue || {rate: 0}
    setCoreIndexBadLoan(coreIndexNowBadLoan)
    setCoreIndexOverdue(coreIndexNowOverdue)
    setListCoreIndexYear(listCoreIndexYear)
    setDayAddLoanAmountList(dayAddLoanAmountList)
    setDayAddLoanBalanceAmountList(dayAddLoanBalanceAmountList)
    setDayAddInterestAmountList(dayAddInterestAmountList)
    setDayAddBadLoanAmountList(dayAddBadLoanAmountList)
    setDayAddLoanUserList(dayAddLoanUserList)

    setCoreIndexBadLoanAmount([
      {
        title: '总本金',
        unit: '元',
        value: coreIndexNowBadLoan.amount || 0,
        tips: '不良订单的剩余贷款余额（本金部分）',
      },
      {
        title: '总笔数',
        unit: '笔',
        value: coreIndexNowBadLoan.count || 0,
        tips: '订单的笔数',
      },
      {
        title: '总客户数',
        unit: '人',
        value: coreIndexNowBadLoan.peopleNumber || 0,
        tips: '用户的人数',
      },
    ])
    setCoreIndexOverdueAmount([
      {
        title: '总本金',
        unit: '元',
        value: coreIndexNowOverdue.amount || 0,
        tips: '逾期订单的逾期期数本金之和',
      },
      {
        title: '总笔数',
        unit: '笔',
        value: coreIndexNowOverdue.count || 0,
        tips: '逾期订单的笔数',
      },
      {
        title: '总客户数',
        unit: '人',
        value: coreIndexNowOverdue.peopleNumber || 0,
        tips: '用户的人数',
      },
    ])
    setTopIndexDatas([
      {
        title: '当日新增(放款金额)',
        tips: '当日放款金额的累计',
        unit: '元',
        value: dayAddLoanAmount,
      },
      {
        title: '当日净增 (贷款余额)',
        tips: '当日放款金额-当日还款金额',
        unit: '元',
        value: dayAddLoanBalanceAmount,
      },
      {
        title: '当日实收利息',
        tips: '当日结息金额',
        unit: '元',
        value: dayAddInterestAmount,
      },
      {
        title: '当日新增(60+不良本金)',
        tips: '当日新增的不良（逾期60+）本金',
        unit: '元',
        value: dayAddBadLoanAmount,
      },
      {
        title: '当日新增（放款用户）',
        tips: '当日放款用户数的累计',
        unit: '人',
        value: dayAddLoanUser,
      },
    ])

    setTimingDatas([
      {
        title: '累放金额',
        tips: '历史放款本金金额累计',
        unit: '元',
        value: historyLoanAmount,
      },
      {
        title: '贷款余额',
        tips: '所有在途订单(含逾期)的剩余待还本金之和',
        unit: '元',
        value: historyLoanBalanceAmount,
      },
      {
        title: '累放笔数',
        tips: '历史所有用户放款笔数',
        unit: '笔',
        value: historyLoanNum,
      },
      {
        title: '累放用户数',
        tips: '历史放款用户数',
        unit: '人',
        value: historyLoanUser,
      },
      {
        title: '实收息费（包含利息罚息）',
        tips: '利息+罚息',
        unit: '元',
        value: historyInterestAmount,
      },
    ])
    setCoreIndexYears([
      {
        title: '年度利润率（未剔除获客成本）',
        tips: '（当前年度实收息费-（60+不良本金））/当前年日均余额',
        unit: '',
        value: yearProfit,
      },
      {
        title: '年度实收利息',
        tips: '当前年内的结息之和',
        unit: '元',
        value: yearInterestAmount,
      },
      {
        title: '年度净不良本金（60+）',
        tips: '当前年内的不良本金之和',
        unit: '元',
        value: yearBadLoanAmount,
      },
    ])
  }, [coreIndex])
  const fetchIndex = async (id) => {
    try {
      const {
        data: {data, code},
      } = await api.get_core_index({
        productId: id,
      })
      if (code == 0 && data) {
        setCoreIndex(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const toWan = (decimal, fixed = 0) => `${(decimal / 10000).toFixed(fixed)}万`
  const toBaiFen = (decimal, fixed = 0) => `${decimal}%`
  const changeProduct = (val) => {
    setProductId(val)
    fetchIndex(val)
  }
  return (
    <Layout isGray={true}>
      <Row gutter={[30, 0]} style={{marginLeft: 0}}>
        {topIndexDatas.length
          ? topIndexDatas.slice(0, 1).map((item, i) => (
              <Col span={5} key={i} style={{paddingLeft: i == 0 ? 0 : null}}>
                <Card bodyStyle={{padding: '12px 24px'}}>
                  <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                    {item.title}
                  </span>
                  <TooltipAnt title={item.tips}>
                    <ExclamationCircleOutlined />
                  </TooltipAnt>
                  <div>
                    <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                      {formatMoney(item.value)}
                    </span>
                    <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                  </div>
                  <div style={{color: '#595858'}}>
                    {computeUnit(item.value)}
                  </div>
                </Card>
              </Col>
            ))
          : null}
        <Col span={19} style={{textAlign: 'right'}}>
          <div style={{margin: '20px 0 20px'}}>
            <Select
              style={{width: '130px'}}
              onChange={(val) => changeProduct(val)}
              value={
                productList.find((v) => v.id == productId) &&
                productList.find((v) => v.id == productId).name
              }
            >
              {productList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>数据更新时间：{coreIndex.reportTime}</div>
        </Col>
      </Row>
      <Card
        title="近30日新增放款金额"
        style={{width: '100%', marginTop: '0px'}}
        bodyStyle={{padding: '24px 24px 10px'}}
      >
        <ComposedChart width={1100} height={240} data={dayAddLoanAmountList}>
          <XAxis dataKey="reportTime" />
          <YAxis tickFormatter={toWan} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Bar
            dataKey="amount"
            barSize={16}
            fill="#1890ff"
            name="新增放款金额"
          />
        </ComposedChart>
      </Card>
      <Row gutter={[30, 0]} style={{marginLeft: 0}}>
        {topIndexDatas.length
          ? topIndexDatas.slice(1).map((item, i) => (
              <Col
                span={6}
                key={i}
                style={{
                  paddingLeft: i == 0 ? 0 : null,
                  paddingRight: i != topIndexDatas.length - 2 ? 0 : '15px',
                }}
              >
                <Card>
                  <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                    {item.title}
                  </span>
                  <TooltipAnt title={item.tips}>
                    <ExclamationCircleOutlined />
                  </TooltipAnt>
                  <div>
                    <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                      {formatMoney(item.value)}
                    </span>
                    <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                  </div>
                  <div style={{color: '#595858', height: '22px'}}>
                    {computeUnit(item.value)}
                  </div>
                  <div>
                    {(function () {
                      if (i == 0) {
                        return (
                          <ComposedChart
                            width={260}
                            height={80}
                            data={dayAddLoanBalanceAmountList}
                          >
                            <XAxis
                              dataKey="reportTime"
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <YAxis
                              tickFormatter={toWan}
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              fill="#d9f5f8"
                              stroke="#79dbe6"
                            />
                          </ComposedChart>
                        )
                      }
                      if (i == 1) {
                        return (
                          <ComposedChart
                            width={260}
                            height={80}
                            data={dayAddInterestAmountList}
                          >
                            <XAxis
                              dataKey="reportTime"
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <YAxis
                              tickFormatter={toWan}
                              hide={true}
                              interval="preserveStartEnd"
                            />

                            <Bar dataKey="amount" barSize={10} fill="#1890ff" />
                          </ComposedChart>
                        )
                      }
                      if (i == 2) {
                        return (
                          <ComposedChart
                            width={260}
                            height={80}
                            data={dayAddBadLoanAmountList}
                          >
                            <XAxis
                              dataKey="reportTime"
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <YAxis
                              tickFormatter={toWan}
                              hide={true}
                              interval="preserveStartEnd"
                            />

                            <Bar dataKey="amount" barSize={10} fill="#1890ff" />
                          </ComposedChart>
                        )
                      }
                      if (i == 3) {
                        return (
                          <ComposedChart
                            width={260}
                            height={80}
                            data={dayAddLoanUserList}
                          >
                            <XAxis
                              dataKey="reportTime"
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <YAxis
                              tickFormatter={toWan}
                              hide={true}
                              interval="preserveStartEnd"
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              fill="#d9f5f8"
                              stroke="#79dbe6"
                            />
                          </ComposedChart>
                        )
                      }
                    })()}
                  </div>
                </Card>
              </Col>
            ))
          : null}
      </Row>
      <Card title="累计交易情况" style={{width: '100%', marginTop: '20px'}}>
        <Row gutter={[30, 0]}>
          {timingDatas.length
            ? timingDatas.map((item, i) => (
                <Col span={4.6} key={i}>
                  <Card bordered={false}>
                    <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                      {item.title}
                    </span>
                    <TooltipAnt title={item.tips}>
                      <ExclamationCircleOutlined />
                    </TooltipAnt>
                    <div>
                      <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                        {formatMoney(item.value)}
                      </span>
                      <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                    </div>
                    <div style={{color: '#595858', height: '22px'}}>
                      {computeUnit(item.value)}
                    </div>
                  </Card>
                </Col>
              ))
            : null}
        </Row>
      </Card>
      <Card title="年度指标" style={{width: '100%', marginTop: '20px'}}>
        <Row>
          <Col span={18}>
            <h4 style={{position: 'relative', width: '800px'}}>
              年日均余额及日均余额
              <span style={{position: 'absolute', right: 0, top: '5px'}}>
                {coreIndex.yearMonth}月
              </span>
            </h4>

            <ComposedChart width={800} height={360} data={listCoreIndexYear}>
              <XAxis dataKey="day" />
              <YAxis tickFormatter={toWan} />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Bar
                dataKey="dailyAmount"
                barSize={20}
                fill="#1890ff"
                name="日均余额"
              />
              <Line
                type="monotone"
                dataKey="yearDailyAmount"
                stroke="#5cc35c"
                name="年日均余额"
              />
            </ComposedChart>
          </Col>
          <Col span={6}>
            {coreIndexYears.length
              ? coreIndexYears.map((item, i) => (
                  <Card key={i}>
                    <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                      {item.title}
                    </span>
                    <TooltipAnt title={item.tips}>
                      <ExclamationCircleOutlined />
                    </TooltipAnt>
                    <div>
                      <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                        {formatMoney(item.value)}
                      </span>
                      <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                    </div>
                    <div style={{color: '#595858'}}>
                      {computeUnit(item.value)}
                    </div>
                  </Card>
                ))
              : null}
          </Col>
        </Row>
      </Card>
      <Card title="当前逾期" style={{width: '100%', marginTop: '20px'}}>
        <Row>
          <Col span={18}>
            <h4 style={{position: 'relative', width: '800px'}}>
              分渠道分日逾期率
              <TooltipAnt title={'统计日当日入逾期单数/统计日前日到期单数'}>
                <ExclamationCircleOutlined />
              </TooltipAnt>
            </h4>

            <ComposedChart
              width={800}
              height={360}
              data={coreIndexOverdue.coreIndexBadLoanList}
            >
              <XAxis dataKey="reportTime" />
              <YAxis tickFormatter={toBaiFen} />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {Array.isArray(coreIndexOverdue.channelNames) &&
                coreIndexOverdue.channelNames.map((v, i) => {
                  return (
                    <Line
                      key={i}
                      type="monotone"
                      dataKey={`channelRateList[${i}].rate`}
                      stroke={colors[i]}
                      name={v}
                    />
                  )
                })}
              {/* <Line
                type="monotone"
                dataKey="appBadRate"
                stroke="#1890ff"
                name="APP"
              />
              <Line
                type="monotone"
                dataKey="appletBadRate"
                stroke="#5cc35c"
                name="小程序"
              /> */}
            </ComposedChart>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{padding: '15px'}}>
              <Row gutter={[10, 0]} align="bottom">
                <Col>
                  <div>
                    <div style={{fontSize: '16px', marginBottom: '5px'}}>
                      {coreIndexOverdue.productName}
                    </div>
                    <div style={{color: '#b0b0b0'}}>
                      总逾期率
                      <TooltipAnt title="当前逾期单数/当前总放款单数*100">
                        <ExclamationCircleOutlined />
                      </TooltipAnt>
                    </div>
                    <div style={{fontSize: '24px', fontWeight: 500}}>
                      {coreIndexOverdue.rate || 0}%
                    </div>
                  </div>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    width={66}
                    percent={coreIndexOverdue.rate || 0}
                    showInfo={false}
                    strokeLinecap="square"
                    strokeWidth="16"
                  />
                </Col>
              </Row>
            </Card>
            {coreIndexOverdueAmount.length
              ? coreIndexOverdueAmount.map((item, i) => {
                  return (
                    <Card key={i} bodyStyle={{padding: '15px'}}>
                      <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                        {item.title}
                      </span>
                      <TooltipAnt title={item.tips}>
                        <ExclamationCircleOutlined />
                      </TooltipAnt>
                      <div>
                        <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                          {formatMoney(item.value)}
                        </span>
                        <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                      </div>
                      <div style={{color: '#595858'}}>
                        {computeUnit(item.value)}
                      </div>
                    </Card>
                  )
                })
              : null}
          </Col>
        </Row>
      </Card>

      <Card
        title="当前不良(逾期60+)"
        style={{width: '100%', marginTop: '20px'}}
      >
        <Row>
          <Col span={18}>
            <h4 style={{position: 'relative', width: '800px'}}>
              分渠道分日不良率
              <TooltipAnt title={'统计日当日不良单数/统计日前T-60到期单数'}>
                <ExclamationCircleOutlined />
              </TooltipAnt>
            </h4>

            <ComposedChart
              width={800}
              height={360}
              data={coreIndexBadLoan.coreIndexBadLoanList}
            >
              <XAxis dataKey="reportTime" />
              <YAxis tickFormatter={toBaiFen} />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {Array.isArray(coreIndexBadLoan.channelNames) &&
                coreIndexBadLoan.channelNames.map((v, i) => {
                  return (
                    <Line
                      key={i}
                      type="monotone"
                      dataKey={`channelRateList[${i}].rate`}
                      stroke={colors[i]}
                      name={v}
                    />
                  )
                })}
            </ComposedChart>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{padding: '15px'}}>
              <Row gutter={[10, 0]} align="bottom">
                <Col>
                  <div>
                    <div style={{fontSize: '16px', marginBottom: '5px'}}>
                      {coreIndexBadLoan.productName}
                    </div>
                    <div style={{color: '#b0b0b0'}}>
                      总不良率
                      <TooltipAnt title="当前不良单数（逾期60天以上订单）/当前总放款单数*100">
                        <ExclamationCircleOutlined />
                      </TooltipAnt>
                    </div>
                    <div style={{fontSize: '24px', fontWeight: 500}}>
                      {coreIndexBadLoan.rate || 0}%
                    </div>
                  </div>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    width={66}
                    percent={coreIndexBadLoan.rate || 0}
                    showInfo={false}
                    strokeLinecap="square"
                    strokeWidth="16"
                  />
                </Col>
              </Row>
            </Card>
            {coreIndexBadLoanAmount.length
              ? coreIndexBadLoanAmount.map((item, i) => {
                  return (
                    <Card key={i} bodyStyle={{padding: '15px'}}>
                      <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                        {item.title}
                      </span>
                      <TooltipAnt title={item.tips}>
                        <ExclamationCircleOutlined />
                      </TooltipAnt>
                      <div>
                        <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                          {formatMoney(item.value)}
                        </span>
                        <span style={{fontWeight: 'bold'}}>{item.unit}</span>
                      </div>
                      <div style={{color: '#595858'}}>
                        {computeUnit(item.value)}
                      </div>
                    </Card>
                  )
                })
              : null}
          </Col>
        </Row>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
