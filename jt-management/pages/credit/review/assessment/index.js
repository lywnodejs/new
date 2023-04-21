import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Space,
  message,
  Form,
  Select,
  Input,
  Button,
  Radio,
  Steps,
  Card,
  Empty,
} from 'antd'
import apiProduct from '~/api/product'
import apiReview from '~/api/review'
import {useCookies} from 'react-cookie'
const {Step} = Steps

const breadcrumbs = [
  {text: '信审管理'},
  {text: '信审设置'},
  {text: '绩效考核设置'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [activityCurrent, setActivityCurrent] = useState([])
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
    const value = e.target.value
    setActivityCurrent(value != null ? 1 : 0)
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_assessmentList({productId: value})
      if (code == 0) {
        if (data != null) {
          form.setFieldsValue(data)
          setActivityCurrent(2)
        } else if (data == null) {
          message.error('绩效考核未设置')
          form.resetFields(['deductOne'])
          form.resetFields(['cardinalNum'])
          form.resetFields(['currentYearEnd'])
          form.resetFields(['afterNextCurrentGrant'])
          form.resetFields(['deductTwo'])
          form.resetFields(['currentGrant'])
          form.resetFields(['deductThird'])
          form.resetFields(['nextCurrentGrant'])
        }
      }
    } catch (err) {
      console.log(err)
    }

    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_switchList({productId: value})
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
  const shiftOut = async () => {
    const values = await form.validateFields()
    if (
      values.deductOne != undefined &&
      values.deductTwo != undefined &&
      values.deductThird &&
      Number(values.deductOne) +
        Number(values.deductTwo) +
        Number(values.deductThird) >
        100
    ) {
      message.error('当前项目累计之和已超出百分之百，请检查。')
      form.resetFields(['deductThird'])
    }
    if (
      values.deductOne != undefined &&
      values.deductTwo != undefined &&
      Number(values.deductOne) + Number(values.deductTwo) > 100
    ) {
      message.error('当前项目累计之和已超出百分之百，请检查。')
      form.resetFields(['deductTwo'])
    }
  }
  const handleOut = async () => {
    const values = await form.validateFields()
    if (
      values.currentGrant != undefined &&
      values.currentYearEnd != undefined &&
      values.nextCurrentGrant &&
      values.afterNextCurrentGrant != undefined &&
      Number(values.currentGrant) +
        Number(values.currentYearEnd) +
        Number(values.nextCurrentGrant) +
        Number(values.afterNextCurrentGrant) >
        100
    ) {
      message.error('当前项目累计之和已超出百分之百，请检查。')
      form.resetFields(['afterNextCurrentGrant'])
    }
    if (
      values.currentGrant != undefined &&
      values.currentYearEnd != undefined &&
      values.nextCurrentGrant &&
      Number(values.currentGrant) +
        Number(values.currentYearEnd) +
        Number(values.nextCurrentGrant) >
        100
    ) {
      message.error('当前项目累计之和已超出百分之百，请检查。')
      form.resetFields(['nextCurrentGrant'])
    }
    if (
      values.currentGrant != undefined &&
      values.currentYearEnd != undefined &&
      Number(values.currentGrant) + Number(values.currentYearEnd) > 100
    ) {
      message.error('当前项目累计之和已超出百分之百，请检查。')
      form.resetFields(['currentYearEnd'])
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (values.productId == null) {
      return message.error('未选择产品')
    }
    if (values.cardinalNum == '' || values.cardinalNum == null) {
      return message.error('请输入计算基数')
    }
    if (values.deductOne == '' || values.deductOne == null) {
      return message.error('请输入逾期率为1%以内的数值')
    }
    if (values.deductTwo == '' || values.deductTwo == null) {
      return message.error('请输入逾期率为1%-2%以内的数值')
    }
    if (values.deductThird == '' || values.deductThird == null) {
      return message.error('请输入逾期率为2%以上的数值')
    }
    if (values.currentGrant == '' || values.currentGrant == null) {
      return message.error('请输入当月发放的绩效')
    }
    if (values.currentYearEnd == '' || values.currentYearEnd == null) {
      return message.error('请输入本年度终了发放的绩效')
    }
    if (values.nextCurrentGrant == '' || values.nextCurrentGrant == null) {
      return message.error('请输入下一年度的当月发放的绩效')
    }
    if (
      values.afterNextCurrentGrant == '' ||
      values.afterNextCurrentGrant == null
    ) {
      return message.error('请输入下下一年度的当月发放的绩效')
    }

    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_updateAssessment({
        ...values,
        afterNextCurrentGrant: Number(values.afterNextCurrentGrant),
      })

      if (code == 0) {
        message.success('保存成功')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const configure = () => {
    location.href = `/credit/review/switch`
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card>
          <Form form={form} name="form">
            <Steps direction="vertical" current={activityCurrent}>
              <Step
                title="选择贷款产品"
                description={
                  <div style={{height: 100}}>
                    <div style={{marginTop: 50}}>
                      <Form.Item label="信贷产品" name="productId">
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
                    </div>
                  </div>
                }
              />
              <Step
                title="绩效考核设置"
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
                    <div style={{position: 'relative', marginTop: 30}}>
                      <p>1、按全部贷款利息收入，实收利息的（计提总额）的 </p>
                      <Form.Item
                        name="cardinalNum"
                        style={{position: 'absolute', top: -2, left: 310}}
                        rules={[
                          ({getFieldValue}) => ({
                            validator(rule, value) {
                              var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                              if (value && !reg.test(value)) {
                                return Promise.reject(
                                  '请输入大于等于0的数，并且最多保留2位小数',
                                )
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input style={{width: 150}} suffix="%" />
                      </Form.Item>
                      <span style={{position: 'absolute', top: 0, left: 470}}>
                        计算基数。
                      </span>
                      <p>2、按逾期率相应扣减：</p>
                      <div style={{marginLeft: 90}} onMouseLeave={shiftOut}>
                        <p>逾期率1%以内，每增0.01%，扣减</p>
                        <Form.Item
                          name="deductOne"
                          style={{position: 'absolute', top: 65, left: 310}}
                          rules={[
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                if (value && !reg.test(value)) {
                                  return Promise.reject(
                                    '请输入大于等于0的数，并且最多保留2位小数',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <Input style={{width: 150}} suffix="%" />
                        </Form.Item>
                        <div style={{marginTop: 30}}>
                          <p>逾期率1%-2%，每增0.01%，扣减</p>
                          <Form.Item
                            name="deductTwo"
                            style={{position: 'absolute', top: 105, left: 310}}
                            rules={[
                              ({getFieldValue}) => ({
                                validator(rule, value) {
                                  var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                  if (value && !reg.test(value)) {
                                    return Promise.reject(
                                      '请输入大于等于0的数，并且最多保留2位小数',
                                    )
                                  }
                                  return Promise.resolve()
                                },
                              }),
                            ]}
                          >
                            <Input
                              style={{width: 150, marginTop: 10}}
                              suffix="%"
                            />
                          </Form.Item>
                        </div>
                        <div style={{marginTop: 30}}>
                          <p>逾期率2%以上，每增0.01%，扣减</p>
                          <Form.Item
                            name="deductThird"
                            style={{position: 'absolute', top: 145, left: 310}}
                            rules={[
                              ({getFieldValue}) => ({
                                validator(rule, value) {
                                  var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                  if (value && !reg.test(value)) {
                                    return Promise.reject(
                                      '请输入大于等于0的数，并且最多保留2位小数',
                                    )
                                  }
                                  return Promise.resolve()
                                },
                              }),
                            ]}
                          >
                            <Input
                              style={{width: 150, marginTop: 20}}
                              suffix="%"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <p style={{marginBottom: 30}}>
                        3、延期发放：当月产生应发绩效的
                      </p>
                      <div style={{height: 240}} onMouseLeave={handleOut}>
                        <Form.Item
                          name="currentGrant"
                          style={{position: 'absolute', top: 240, left: 150}}
                          rules={[
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                if (value && !reg.test(value)) {
                                  return Promise.reject(
                                    '请输入大于等于0的数，并且最多保留2位小数',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <Input style={{width: 150}} suffix="%" />
                        </Form.Item>

                        <Form.Item
                          name="currentYearEnd"
                          style={{position: 'absolute', top: 290, left: 150}}
                          rules={[
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                if (value && !reg.test(value)) {
                                  return Promise.reject(
                                    '请输入大于等于0的数，并且最多保留2位小数',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <Input style={{width: 150}} suffix="%" />
                        </Form.Item>

                        <Form.Item
                          name="nextCurrentGrant"
                          style={{position: 'absolute', top: 340, left: 150}}
                          rules={[
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                if (value && !reg.test(value)) {
                                  return Promise.reject(
                                    '请输入大于等于0的数，并且最多保留2位小数',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <Input style={{width: 150}} suffix="%" />
                        </Form.Item>

                        <Form.Item
                          name="afterNextCurrentGrant"
                          style={{position: 'absolute', top: 390, left: 150}}
                          rules={[
                            ({getFieldValue}) => ({
                              validator(rule, value) {
                                var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                                if (value && !reg.test(value)) {
                                  return Promise.reject(
                                    '请输入大于等于0的数，并且最多保留2位小数',
                                  )
                                }
                                return Promise.resolve()
                              },
                            }),
                          ]}
                        >
                          <Input style={{width: 150}} suffix="%" />
                        </Form.Item>
                      </div>
                      <span style={{position: 'absolute', top: 244, left: 310}}>
                        当月发放
                      </span>
                      <span style={{position: 'absolute', top: 294, left: 310}}>
                        本年度终了发放
                      </span>
                      <span style={{position: 'absolute', top: 344, left: 310}}>
                        下一年度的当月发放
                      </span>
                      <span style={{position: 'absolute', top: 394, left: 310}}>
                        下下一年度的当月发放
                      </span>
                      <Button type="primary" onClick={handleSave}>
                        保存
                      </Button>
                    </div>
                  )
                }
              ></Step>
            </Steps>
          </Form>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
