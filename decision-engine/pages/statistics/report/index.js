import {Layout} from '~/components/Layout'
import {
  message,
  Card,
  Row,
  Col,
  Tooltip as TooltipAnt,
  Progress,
  Select,
  Form,
  DatePicker,
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
  BarChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
} from 'recharts'
import {formatMoney, computeUnit} from '~/utils'
import api from '~/api/statistics'
import apiProduct from '~/api/product'
import {set} from 'lodash'
import moment from 'moment'
const {RangePicker} = DatePicker
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#fad337',
  '#f2637b',
]

const breadcrumbs = [{text: '统计分析'}, {text: '统计报表'}]
function body(props) {
  const [coreIndex, setCoreIndex] = useState({})
  const [topIndexDatas, setTopIndexDatas] = useState([])
  const [productList, setProductList] = useState([])
  const [rjProduceId, setRjProduceId] = useState('-1')
  const [produceId, setProduceId] = useState('-1')
  const [dateTabs, setDateTabs] = useState(['今天', '7天', '30天'])
  const [current, setCurrent] = useState('30天')
  const [active, setActive] = useState(2)
  const [totalCallSets, setTotalCallSets] = useState([])
  const [classificationData, setClassificationData] = useState([])
  const [classificationCurret, setClassificationCurret] = useState('30天')
  const [productCurrent, setProductCurrent] = useState('30天')
  const [userCurrent, setUserCurrent] = useState('30天')
  const [userCurrentData, setUserCurrentData] = useState([])
  const [statRejectActionList, setStatRejectActionList] = useState([])
  const [productListNew, setProductListNew] = useState([])
  const [totalPieList, setTotalPieList] = useState([])
  const [rejectionList, setRejectionList] = useState([])
  const [rejectsCount, setRejectsCount] = useState([])
  const [form] = Form.useForm()
  const [refuseForm] = Form.useForm()
  const [isShow, setIsShow] = useState('hide')

  const dateFormat = 'YYYY-MM-DD'

  const initDate = () => {
    function Appendzero(obj) {
      if (obj < 10) return '0' + '' + obj
      else return obj
    }

    let nowDate = new Date()
    let oneMouthDate = new Date(nowDate - 30 * 24 * 3600 * 1000)

    let formatNowDate =
      nowDate.getFullYear() +
      '-' +
      Appendzero(nowDate.getMonth() + 1) +
      '-' +
      Appendzero(nowDate.getDate())
    let formatLastMouthDate =
      oneMouthDate.getFullYear() +
      '-' +
      Appendzero(oneMouthDate.getMonth() + 1) +
      '-' +
      Appendzero(oneMouthDate.getDate())

    return {
      formatNowDate: formatNowDate,
      formatLastMouthDate: formatLastMouthDate,
    }
  }

  useEffect(() => {
    async function fetchData() {
      const {formatNowDate, formatLastMouthDate} = initDate()
      // console.log(formatNowDate, formatLastMouthDate)
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products()
        if (code == 0) {
          setProductList(data)
          fetchIndex({
            flowType: null,
            produceId: null,
            // time: null,
          })
          fetchTotal({
            flowType: null,
            produceId: null,
            time: null,
            initDate: {formatLastMouthDate, formatNowDate},
          })
          fetchRejection({
            rjProduceId: null,
            rjFlowType: null,
            time: null,
            initDate: {formatLastMouthDate, formatNowDate},
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
    initDate()
  }, [])
  useEffect(() => {}, [coreIndex])
  const fetchIndex = async ({flowType, produceId}) => {
    try {
      const {
        data: {data, code},
      } = await api.get_core_index({
        flowType,
        produceId,
      })
      if (code == 0 && data) {
        setCoreIndex(data)
        setTopIndexDatas([
          {
            title: '今日调用数(决策引擎)',
            tips: '今日调用数(决策引擎)',
            // unit: '元',
            value: data.callCountNow,
          },
          {
            title: '总调用数(决策引擎)',
            tips: '总调用数(决策引擎)',
            // unit: '元',
            value: data.callCountAll,
          },
        ])
        setTotalCallSets(data.thirtyDayList)
        setClassificationData(data.thirtyDayList)
        setUserCurrentData(data.thirtyDayList)
        setStatRejectActionList(data.statRejectActionList)
        setProductListNew(data.thirtyProductList)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    // console.log('totalPieList改变了')
  }, [totalPieList])
  const fetchTotal = async ({flowType, produceId, time, initDate}) => {
    let callDateStart =
      (time && time[0].format('YYYY-MM-DD')) || initDate.formatLastMouthDate
    let callDateEnd =
      (time && time[1].format('YYYY-MM-DD')) || initDate.formatNowDate
    const postData = {
      flowType,
      produceId,
      beginTime: callDateStart,
      endTime: callDateEnd,
    }
    // console.log('fetchTotal-time', postData)
    try {
      const {
        data: {data, code},
      } = await api.get_result_pie(postData)
      if (code == 0 && data) {
        // console.log('fetchTotal-data', data)
        setTotalPieList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {}, [rejectionList])
  const fetchRejection = async ({rjFlowType, rjProduceId, time, initDate}) => {
    let callDateStart =
      (time && time[0].format('YYYY-MM-DD')) || initDate.formatLastMouthDate
    let callDateEnd =
      (time && time[1].format('YYYY-MM-DD')) || initDate.formatNowDate
    const postData = {
      rjFlowType,
      rjProduceId,
      beginTime: callDateStart,
      endTime: callDateEnd,
    }
    // console.log('fetchRejection-time', postData)
    try {
      const {
        data: {data, code},
      } = await api.get_result_rejection(postData)
      if (code == 0 && data) {
        // console.log('fetchRejection-data', data)
        setRejectionList(data.statRejectActionList)
        setRejectsCount(data.rejectsCount)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // const toWan = (decimal, fixed = 0) => `${Math.ceil(decimal * 83.33)}`
  // const toBaiFen = (decimal, fixed = 0) => `${decimal}%`

  // *---------------------------------------

  const changeRefuseProduct = () => {
    console.log(
      // refuseForm.getFieldsValue().refuseProduct,
      // refuseForm.getFieldsValue().refuseProductType,
      // refuseForm.getFieldsValue(),
      '成功调用',
    )
    fetchRejection({
      rjProduceId: refuseForm.getFieldsValue().refuseProduct,
      rjFlowType: refuseForm.getFieldsValue().refuseProductType,
      time: refuseForm.getFieldsValue().time,
    })
  }
  const changeRefuseProductType = (val) => {
    console.log(
      // refuseForm.getFieldsValue().refuseProduct,
      // refuseForm.getFieldsValue().refuseProductType,
      refuseForm.getFieldsValue(),
    )
    fetchRejection({
      rjProduceId: refuseForm.getFieldsValue().refuseProduct,
      rjFlowType: refuseForm.getFieldsValue().refuseProductType,
      time: refuseForm.getFieldsValue().time,
    })
  }

  const changeRefuseProductDate = (val) => {
    console.log(
      // refuseForm.getFieldsValue().refuseProduct,
      // refuseForm.getFieldsValue().refuseProductType,
      refuseForm.getFieldsValue(),
    )
    fetchRejection({
      rjProduceId: refuseForm.getFieldsValue().refuseProduct,
      rjFlowType: refuseForm.getFieldsValue().refuseProductType,
      time: refuseForm.getFieldsValue().time,
    })
  }

  // *---------------------------------------

  const changeProductTotal = () => {
    console.log(
      // form.getFieldsValue().productTotal,
      // form.getFieldsValue().productTotalType,
      'changeProductTotal',
      form.getFieldsValue(),
    )
    fetchTotal({
      produceId: form.getFieldsValue().productTotal,
      flowType: form.getFieldsValue().productTotalType,
      time: form.getFieldsValue().time,
    })
  }

  const changeProductTotalType = () => {
    console.log(
      // form.getFieldsValue().productTotal,
      // form.getFieldsValue().productTotalType,
      'changeProductTotalType',
      form.getFieldsValue(),
    )
    fetchTotal({
      produceId: form.getFieldsValue().productTotal,
      flowType: form.getFieldsValue().productTotalType,
      time: form.getFieldsValue().time,
    })
  }

  const changeProductTotalDate = () => {
    console.log(
      // form.getFieldsValue().productTotal,
      // form.getFieldsValue().productTotalType,
      'changeProductTotalType',
      form.getFieldsValue(),
    )
    fetchTotal({
      produceId: form.getFieldsValue().productTotal,
      flowType: form.getFieldsValue().productTotalType,
      time: form.getFieldsValue().time,
    })
  }

  // *---------------------------------------

  // const changeProductTotalDate2 = (dates, dateStrings) => {
  //   console.log('dates, dateStrings', dates, dateStrings);
  // }

  // *---------------------------------------

  const toTime = (times) => {
    let date = new Date(times)
    let Y = date.getFullYear() + '-'
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    let D = date.getDate() + ' '
    let h = date.getHours() + ':'
    let m = date.getMinutes() + ':'
    let s = date.getSeconds() + ''
    return Y + M + D + h + m + s
  }
  const getRandomColor = () => {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  useEffect(() => {
    if (current == '今天') {
      setTotalCallSets(coreIndex.oneDayList)
    }
    if (current == '7天') {
      setTotalCallSets(coreIndex.sevenDayList)
    }
    if (current == '30天') {
      setTotalCallSets(coreIndex.thirtyDayList)
    }
  }, [current])
  useEffect(() => {
    if (classificationCurret == '今天') {
      setClassificationData(coreIndex.oneDayList)
    }
    if (classificationCurret == '7天') {
      setClassificationData(coreIndex.sevenDayList)
    }
    if (classificationCurret == '30天') {
      setClassificationData(coreIndex.thirtyDayList)
    }
  }, [classificationCurret])
  useEffect(() => {
    if (userCurrent == '今天') {
      setUserCurrentData(coreIndex.oneDayList)
    }
    if (userCurrent == '7天') {
      setUserCurrentData(coreIndex.sevenDayList)
    }
    if (userCurrent == '30天') {
      setUserCurrentData(coreIndex.thirtyDayList)
    }
  }, [userCurrent])
  useEffect(() => {
    if (productCurrent == '今天') {
      setProductListNew(coreIndex.oneProductList)
    }
    if (productCurrent == '7天') {
      setProductListNew(coreIndex.sevenProductList)
    }
    if (productCurrent == '30天') {
      setProductListNew(coreIndex.thirtyProductList)
    }
  })

  const customTooltip = ({payload, label}) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload && payload.length > 0 ? (
            <p
              className="label"
              style={{color: '#98d87d'}}
            >{`${payload[0].name}:${payload[0].payload.successCount}`}</p>
          ) : null}
          {payload && payload.length > 0 ? (
            <p
              className="label"
              style={{color: '#dc4635'}}
            >{`${payload[1].name}:${payload[1].payload.failCount}`}</p>
          ) : null}
        </div>
      )
    }

    return null
  }
  const customizedLegend = ({payload}) => {
    return (
      <div style={{marginLeft: '40%'}}>
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: '#98d87d',
            display: 'inline-block',
            marginRight: 8,
          }}
        ></div>
        <span>{payload[0].value}</span>
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: '#dc4635',
            display: 'inline-block',
            marginRight: 8,
            marginLeft: 8,
          }}
        ></div>
        <span>{payload[1].value}</span>
      </div>
    )
  }

  const userTooltip = ({payload, label}) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload && payload.length > 0 ? (
            <p
              className="label"
              style={{color: '#2fc25b'}}
            >{`总用户数:\xa0\xa0\xa0${payload[0].payload.soleCount}`}</p>
          ) : null}
        </div>
      )
    }

    return null
  }
  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Row gutter={[30, 0]} style={{marginLeft: 0}}>
        {topIndexDatas.length
          ? topIndexDatas.slice(0, 2).map((item, i) => (
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
        <Col span={14} style={{textAlign: 'right'}}>
          <div style={{marginTop: '79px'}}>
            数据更新时间：{toTime(coreIndex.statDate)}
          </div>
        </Col>
      </Row>

      <Card
        title="决策引擎调用统计"
        style={{width: '100%', marginTop: '0px'}}
        headStyle={{fontWeight: 'bold'}}
        bodyStyle={{padding: '24px 24px 10px'}}
      >
        <h4 style={{position: 'relative', fontWeight: 'bold'}}>
          总调用趋势
          <span>（次）</span>
          <p
            className="dateSwitch"
            style={{position: 'absolute', right: '43px', top: 0}}
          >
            {dateTabs.map((item, i) => (
              <a
                className={current === item ? 'active' : ''}
                onClick={() => {
                  setCurrent(item)
                }}
              >
                {item}
              </a>
            ))}
          </p>
        </h4>
        <ResponsiveContainer height={240}>
          <ComposedChart data={totalCallSets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            {/* <YAxis tickFormatter={toWan} dataKey="count"/> */}
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend content={customizedLegend} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Bar
              stackId="0"
              dataKey="successCount"
              barSize={16}
              name="成功次数"
              fill="#98d87d"
            />
            <Bar
              stackId="0"
              dataKey="failCount"
              barSize={16}
              fill="#dc4635"
              name="失败次数"
            />
            <Line
              type="monotone"
              dataKey="successCount"
              stroke="#5cc35c"
              name="成功次数"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <h4
          style={{position: 'relative', marginTop: '20px', fontWeight: 'bold'}}
        >
          分类调用趋势
          <span>（次）</span>
          <p
            className="dateSwitch"
            style={{position: 'absolute', right: '43px', top: 0}}
          >
            {dateTabs.map((item, i) => (
              <a
                className={classificationCurret === item ? 'active' : ''}
                onClick={() => {
                  setClassificationCurret(item)
                }}
              >
                {item}
              </a>
            ))}
          </p>
        </h4>
        <ResponsiveContainer height={360}>
          <ComposedChart data={classificationData}>
            <XAxis dataKey="day" />
            {/* <YAxis tickFormatter={toBaiFen} /> */}
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Line
              type="monotone"
              dataKey="creditCount"
              stroke="#1890ff"
              name="授信"
            />
            <Line
              type="monotone"
              dataKey="decisionCount"
              stroke="#5cc35c"
              name="用信"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <h4
          style={{position: 'relative', marginTop: '20px', fontWeight: 'bold'}}
        >
          分产品调用趋势
          <span>（次）</span>
          <p
            className="dateSwitch"
            style={{position: 'absolute', right: '43px', top: 0}}
          >
            {dateTabs.map((item, i) => (
              <a
                className={productCurrent === item ? 'active' : ''}
                onClick={() => {
                  setProductCurrent(item)
                }}
              >
                {item}
              </a>
            ))}
          </p>
        </h4>

        <ResponsiveContainer height={360}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {productListNew &&
              productListNew.length &&
              productListNew.map((item) => (
                <Line
                  dataKey="count"
                  data={item.producList}
                  stroke={getRandomColor()}
                  name={item.productName}
                  key={item.productName}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
        <h4
          style={{position: 'relative', marginTop: '20px', fontWeight: 'bold'}}
        >
          用户去重调用趋势
          <span>（用户数）</span>
          <p
            className="dateSwitch"
            style={{position: 'absolute', right: '43px', top: 0}}
          >
            {dateTabs.map((item, i) => (
              <a
                className={userCurrent === item ? 'active' : ''}
                onClick={() => {
                  setUserCurrent(item)
                }}
              >
                {item}
              </a>
            ))}
          </p>
        </h4>
        <ResponsiveContainer height={360}>
          <ComposedChart data={userCurrentData}>
            <XAxis dataKey="day" />
            {/* <YAxis tickFormatter={toBaiFen} /> */}
            <YAxis />
            <Tooltip content={userTooltip} />
            {/* <Legend content={''} /> */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Line type="monotone" dataKey="soleCount" stroke="#2fc25b" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Row>
        <Col span={12}>
          <Card
            title="结果占比统计"
            style={{
              width: '100%',
              marginTop: '20px',
              height: '96.5%',
              position: 'relative',
            }}
          >
            <div style={{margin: '20px 0 20px'}}>
              <Form
                form={form}
                layout="inline"
                initialValues={{
                  productTotalType: null,
                  productTotal: null,
                }}
              >
                <Form.Item name="productTotal">
                  <Select
                    showSearch
                    style={{width: '130px', marginRight: '6px'}}
                    onChange={changeProductTotal}
                    defaultValue={null}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value={null}>全部产品</Select.Option>
                    {productList.map((v, i) => (
                      <Select.Option key={i} value={v.produceId}>
                        {v.productName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="productTotalType">
                  <Select
                    showSearch
                    style={{width: '130px'}}
                    onChange={changeProductTotalType}
                    defaultValue={null}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value={null}>全部分类</Select.Option>
                    <Select.Option value={1}>授信</Select.Option>
                    <Select.Option value={2}>用信</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="日期" name="time">
                  <RangePicker
                    onChange={changeProductTotalDate}
                    defaultValue={[
                      moment(initDate().formatLastMouthDate, dateFormat),
                      moment(initDate().formatNowDate, dateFormat),
                    ]}
                  />
                </Form.Item>
              </Form>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 280,
                left: 165,
                color: '#ad9b9d',
              }}
            >
              总执行次数
            </div>

            <div style={{marginLeft: 60, marginTop: 80}}>
              <Progress
                type="circle"
                width={237}
                percent={totalPieList.successRatio}
                format={() => `${totalPieList.totalCount} 次`}
                strokeLinecap="square"
                strokeWidth="10"
                strokeColor="#0088fe"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 300,
                left: 400,
                width: 200,
                height: 200,
              }}
            >
              <div>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#0088fe',
                    borderRadius: '100%',
                    display: 'inline-block',
                  }}
                ></div>
                <span>&nbsp;通过&nbsp;&nbsp;|</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {totalPieList.successRatioStr}
                </span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {totalPieList.succeedCount}
                </span>
              </div>
              <div>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '100%',
                    display: 'inline-block',
                  }}
                ></div>
                <span>&nbsp;拒绝&nbsp;&nbsp;|</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {totalPieList.failRatioStr}
                </span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totalPieList.errorCount}
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="拒绝原因占比统计"
            style={{width: '100%', marginTop: '20px', position: 'relative'}}
          >
            <div style={{margin: '20px 0 20px'}}>
              <Form
                form={refuseForm}
                layout="inline"
                initialValues={{
                  refuseProduct: null,
                  refuseProductType: null,
                }}
              >
                <Form.Item name="refuseProduct">
                  <Select
                    showSearch
                    style={{width: '130px', marginRight: '6px'}}
                    onChange={changeRefuseProduct}
                    defaultValue={null}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value={null}>全部产品</Select.Option>
                    {productList.map((v, i) => (
                      <Select.Option key={i} value={v.produceId}>
                        {v.productName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="refuseProductType">
                  <Select
                    showSearch
                    style={{width: '130px'}}
                    onChange={changeRefuseProductType}
                    defaultValue={null}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value={null}>全部分类</Select.Option>
                    <Select.Option value={1}>授信</Select.Option>
                    <Select.Option value={2}>用信</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="日期" name="time">
                  <RangePicker
                    onChange={changeRefuseProductDate}
                    defaultValue={[
                      moment(initDate().formatLastMouthDate, dateFormat),
                      moment(initDate().formatNowDate, dateFormat),
                    ]}
                  />
                </Form.Item>
              </Form>
            </div>
            <div
              style={{
                width: 240,
                height: 242,
                backgroundColor: '#fff',
                border: '40px solid #e9e9e9',
                borderRadius: '50%',
                display: 'inline-block',
                position: 'absolute',
                left: 90,
                bottom: '128px',
                display: `${isShow}`,
              }}
            >
              <div style={{textAlign: 'center', marginTop: 20}}>
                <p style={{color: '#ad9b9d'}}>总拒绝次数</p>
                <p style={{marginTop: 20, fontSize: 34}}>
                  {rejectsCount != 0 ? rejectsCount : 0}次
                </p>
              </div>
            </div>

            <PieChart width={800} height={400}>
              <Legend
                iconSize={10}
                // width={200}
                height={140}
                layout="vertical"
                verticalAlign="middle"
                wrapperStyle={{
                  top: 90,
                  left: 380,
                  lineHeight: '24px',
                }}
              />
              <Pie
                data={rejectionList}
                cx={180}
                cy={170}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="rejectCount"
                label
                nameKey="actionNmae"
              >
                {rejectionList.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.actionNmae == '无' || entry.ratioStr == '0.00%'
                        ? '#e9e9e9'
                        : COLORS[index % COLORS.length]
                    }
                    name={`${entry.actionNmae} | ${entry.ratioStr} \xa0${entry.rejectCount}`}
                    style={{width: 200}}
                  />
                ))}
              </Pie>
            </PieChart>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
