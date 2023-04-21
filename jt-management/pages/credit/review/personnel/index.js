import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Space,
  message,
  Form,
  Select,
  Input,
  Button,
  Row,
  Steps,
  Card,
  Radio,
  Empty,
} from 'antd'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import ManagementTable from './ManagementTable'
import apiReview from '~/api/review'
let values = {}

const {Step} = Steps

const breadcrumbs = [
  {text: '信审管理'},
  {text: '信审设置'},
  {text: '委案人员设置'},
]

function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [activityCurrent, setActivityCurrent] = useState([])
  const [productId, setProductId] = useState([])
  const [list, setList] = useState([])
  const [isNull, setIsNull] = useState(false)

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
    }
    fetchData()
  }, [])

  const handleClick = async (e) => {
    setActivityCurrent(e.target.value != null ? 1 : 0)
    setProductId(Number(e.target.value))
    personnelList({productId: e.target.value})
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_switchList({productId: e.target.value})
      if (code == 0) {
        if (data == null) {
          setIsNull(true)
        } else {
          setIsNull(false)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const personnelList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_personnel_list({
        ...values,
      })
      if (code == 0) {
        if (data != null) {
          setList(data)
          setActivityCurrent(2)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const configure = () => {
    location.href = `/credit/review/switch`
  }

  const onSearch = async (value) => {
    values = value
    console.log(value)
    personnelList({...values, productId: productId})
    if (value.accountName == '' || value.accountName == undefined) {
      try {
        const {
          data: {data, code},
        } = await apiReview.fetch_personnel_list()
        if (code == 0) {
          if (data != null) {
            setList(data)
            setActivityCurrent(2)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space
        direction="vertical"
        size="large"
        style={{width: '100%', position: 'relative'}}
      >
        <Card>
          <Steps direction="vertical" current={activityCurrent}>
            <Step
              title="选择贷款产品"
              description={
                <div style={{height: 100}}>
                  <div style={{marginTop: 50}}>
                    <Form form={form} name="form">
                      <Form.Item label="信贷产品" name="creditProducts">
                        <Radio.Group>
                          {productList.map((v, i) => (
                            <Radio.Button
                              key={v.id}
                              value={v.id}
                              onClick={handleClick}
                            >
                              {v.name}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              }
            />
            <Step
              title="委案人员管理"
              description={
                isNull == true ? (
                  <Empty
                    style={{
                      marginTop: 100,
                    }}
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                      height: 60,
                    }}
                    description={'当前产品未开启信审开关，请前去设置'}
                  >
                    <Button type="primary" onClick={configure}>
                      前去配置
                    </Button>
                  </Empty>
                ) : (
                  <ManagementTable
                    {...{
                      list,
                      onSearch,
                      productId,
                      personnelList,
                    }}
                  />
                )
              }
            />
          </Steps>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
