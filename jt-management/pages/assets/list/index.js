import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import apiAccounting from '~/api/accounting'
import apiAssets from '~/api/assets'
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
  InputNumber,
} from 'antd'
import TableList from './TableList'
import moment from 'moment'
const breadcrumbs = [{text: '资产保全'}, {text: '资产列表'}]
const {RangePicker} = DatePicker
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [statusList, setStatusList] = useState([])
  const [times, setTimes] = useState('time')
  const [form] = Form.useForm()
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
        }
      } catch (error) {
        console.log(error)
      }
      onSearch()
      fetchStatus()
    }
    fetchData()
  }, [])
  const fetchAssetsList = async (values = {}) => {
    try {
      const {dateType} = values
      if (dateType == 0 && values.time && values.time.length > 0) {
        values = {
          ...values,
          grantFinishTimeStart: moment(values.time[0]).format('YYYY-MM-DD'),
          grantFinishTimeEnd: moment(values.time[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      if (dateType == 1 && values.timeIs && values.timeIs.length > 0) {
        values = {
          ...values,
          repayFinishTimeStart: moment(values.timeIs[0]).format('YYYY-MM-DD'),
          repayFinishTimeEnd: moment(values.timeIs[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      delete values.time
      delete values.timeIs
      delete values.dateType
      const {
        data: {data, code},
      } = await apiAssets.fetch_capital_list({...pageParams, ...values})
      if (code == 0) {
        setTotalData(data)
        setList(data != null ? data.list : null)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchStatus = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('RECEIPT_STATUS')
      if (code == 0) {
        setStatusList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
    values = value
    pageParams.pageNum = 1
    fetchAssetsList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchAssetsList(values)
  }

  const changeDateType = (val) => {
    setTimes(val == 0 ? 'time' : 'timeIs')
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            productId: '',
            status: '',
            dateType: null,
            sign: null,
            fiveLevelType: null,
            protectionType: null,
          }}
        >
          <Row gutter={24}>
            <Col span={5}>
              <Form.Item label="借据状态" name="status">
                <Select style={{width: '160px'}}>
                  <Select.Option value="">全部</Select.Option>
                  {statusList.map((v, i) => (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="产品" name="productId">
                <Select style={{width: '160px'}}>
                  <Select.Option value="">全部</Select.Option>
                  {productList.map((v, i) => (
                    <Select.Option key={i} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="借据号" name="orderNum">
                <Input placeholder="请输入借据号" style={{width: 160}} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="借款人" name="realName">
                <Input placeholder="请输入借款人" style={{width: 160}} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                style={{marginRight: 15}}
                htmlType="submit"
              >
                查询
              </Button>
              <Button style={{marginRight: 15}} onClick={onReset}>
                重置
              </Button>
            </Col>
            <Col span={5}>
              <Form.Item label="资产处置标志" name="protectionType">
                <Select style={{width: '160px'}}>
                  <Select.Option value={null}>全部</Select.Option>
                  <Select.Option value={1}>无</Select.Option>
                  <Select.Option value={2}>资产转让</Select.Option>
                  <Select.Option value={3}>资产核销</Select.Option>
                  <Select.Option value={4}>司法诉讼</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="dateType" style={{display: 'inline-block'}}>
                <Select style={{width: '130px'}} onChange={changeDateType}>
                  <Select.Option value={null}>全部</Select.Option>
                  <Select.Option value={0}>放款日</Select.Option>
                  <Select.Option value={1}>到期日</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label=""
                name={times}
                style={{display: 'inline-block'}}
              >
                <RangePicker style={{marginLeft: -60, width: 300}} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="五级分类" name="fiveLevelType">
                <Select style={{width: 160}}>
                  <Select.Option value={null}>全部</Select.Option>
                  <Select.Option value={1}>正常</Select.Option>
                  <Select.Option value={2}>关注</Select.Option>
                  <Select.Option value={3}>次级</Select.Option>
                  <Select.Option value={4}>可疑</Select.Option>
                  <Select.Option value={5}>损失</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="逾期超过" name="overdueDay">
                <InputNumber style={{width: 160}} min={1} />
              </Form.Item>
            </Col>
            <Col>
              <span style={{marginLeft: -108, position: 'absolute', top: 4}}>
                天
              </span>
            </Col>
          </Row>
        </Form>

        <TableList
          {...{
            list,
            totalData,
            onPage,
            pageParams,
            productList,
            statusList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
