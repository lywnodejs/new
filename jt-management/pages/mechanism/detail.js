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
  Radio,
  InputNumber,
  DatePicker,
} from 'antd'
import apiMechanism from '~/api/mechanism'
import Router, {withRouter} from 'next/router'

const breadcrumbs = [{text: '合作机构列表'}, {text: '编辑机构信息'}]

function body(props) {
  const [organizationForm] = Form.useForm()
  const [dataDetail, setDataDetail] = useState([])
  const [bool, setBool] = useState(true)
  let type = props.router.query.type
  let flag = props.router.query.flag
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiMechanism.get_mechanism_detail({
          id: props.router.query.id,
        })
        if (code == 0) {
          console.log(data, 'data..')
          setDataDetail(data)
          organizationForm.setFieldsValue(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [organizationForm])

  const determine = async () => {
    setBool(false)
    const values = await organizationForm.validateFields()
    if (bool) {
      let postData = {
        id: dataDetail.id,
        contactWay: values.contactWay,
        linkman: values.linkman,
        unitPriceOne: Number(values.unitPriceOne),
        unitPriceTwo: Number(values.unitPriceTwo),
        unitPriceThird: Number(values.unitPriceThird),
        unitPriceFour: Number(values.unitPriceFour),
        unitPriceFive: Number(values.unitPriceFive),
        unitPriceSix: Number(values.unitPriceSix),
      }
      try {
        const {
          data: {data, code},
        } = await apiMechanism.update_mechanism_update(postData)
        if (code == 0) {
          message.success('编辑成功')
          Router.push('/mechanism')
        }
      } catch (err) {
        console.log(err)
      }
      setBool(true)
    }
  }

  const handleCanel = async () => {
    Router.push('/mechanism')
  }

  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Form name={organizationForm} form={organizationForm}>
        <Card
          title="基本信息"
          headStyle={{
            paddingLeft: 20,
            fontWeight: 700,
            fontSize: 18,
            paddingBottom: -60,
          }}
          style={{padding: '0 30px'}}
        >
          <Row gutter={20}>
            <Col span={10}>
              <span>机构名称</span>
            </Col>
            <Col span={10}>
              <span>机构类型</span>
            </Col>
          </Row>
          <Row gutter={20} style={{marginTop: 20}}>
            <Col span={10}>
              <Form.Item label="" name="name">
                <span>{dataDetail.name}</span>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="" name="name">
                <span>{dataDetail.type}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20} style={{marginTop: 20}}>
            <Col span={10}>
              <Form.Item
                label="联系人(选填)"
                name="linkman"
                rules={[
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (value && value.length > 20) {
                        return Promise.reject('请输入小于20个字符')
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="请输入机构联系人"
                  style={{marginTop: 60, marginLeft: -100, width: 300}}
                  maxLength={100}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="联系方式（选填）"
                name="contactWay"
                rules={[
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (value && value.length > 20) {
                        return Promise.reject('请输入小于20个字符')
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="请输入机构联系方式"
                  style={{marginTop: 60, marginLeft: -130, width: 300}}
                  maxLength={100}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {type == '电子签章' ? (
          <Card
            title="计费信息"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{
              padding: '0 30px',
              marginTop: 30,
              height: 300,
            }}
          >
            <p style={{color: '#666666'}}>电子签章</p>
            <Row gutter={20}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceOne"
                  rules={[
                    {required: true, message: '请输入电子签章价格'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入电子签章"
                    suffix="元/次"
                    style={{width: 250}}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        ) : type == '短信通道' ? (
          <Card
            title="计费信息"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{
              padding: '0 30px',
              marginTop: 30,
              height: 300,
            }}
          >
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>营销类短信</Col>
                <Col span={10}>通知类短信</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceOne"
                  rules={[
                    {required: true, message: '请输入营销类短信价格'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入营销类短信金额"
                    style={{width: 250}}
                    suffix="元 / 条"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceTwo"
                  rules={[
                    {required: true, message: '请输入通知类短信价格'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入通知类短信金额"
                    style={{width: 250}}
                    suffix="元 / 条"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        ) : type == '智能识别' ? (
          <Card
            title="计费信息"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{
              padding: '0 30px',
              marginTop: 30,
              height: 300,
            }}
          >
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>OCR</Col>
                <Col span={10}>人脸核身</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceOne"
                  rules={[
                    {required: true, message: '请输入OCR'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入OCR"
                    style={{width: 250}}
                    suffix="元 / 次"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceTwo"
                  rules={[
                    {required: true, message: '请输入人脸核身'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入人脸核身"
                    style={{width: 250}}
                    suffix="元 / 次"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        ) : type == '支付通道' ? (
          <Card
            title="计费信息"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{
              padding: '0 30px',
              marginTop: 30,
              height: 650,
            }}
          >
            <p style={{fontWeight: 'bold'}}>协议支付</p>
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>结算价格</Col>
                <Col span={10}>保底单价</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceOne"
                  rules={[
                    {required: true, message: '请输入计费比例'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入计费比例"
                    style={{width: 250}}
                    suffix="%"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceTwo"
                  rules={[
                    {required: true, message: '请输入保底单价'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="无保底价格时，请填“0”"
                    style={{width: 250}}
                    suffix="元 / 笔"
                  />
                </Form.Item>
              </Col>
            </Row>
            <p style={{fontWeight: 'bold'}}>代扣</p>
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>结算价格</Col>
                <Col span={10}>保底单价</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceThird"
                  rules={[
                    {required: true, message: '请输入计费比例'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入计费比例"
                    style={{width: 250}}
                    suffix="%"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceFour"
                  rules={[
                    {required: true, message: '请输入保底单价'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="无保底价格时，请填“0”"
                    style={{width: 250}}
                    suffix="元/笔"
                  />
                </Form.Item>
              </Col>
            </Row>
            <p style={{fontWeight: 'bold'}}>代付</p>
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>对私单价</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceFive"
                  rules={[
                    {required: true, message: '请输入保底单价'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入保底单价"
                    style={{width: 250}}
                    suffix="元/笔"
                  />
                </Form.Item>
              </Col>
            </Row>
            <p style={{fontWeight: 'bold'}}>银行卡验证</p>
            <div style={{color: '#666666'}}>
              <Row gutter={20}>
                <Col span={10}>五要素验证</Col>
              </Row>
            </div>
            <Row gutter={20} style={{marginTop: 20}}>
              <Col span={10}>
                <Form.Item
                  label=""
                  name="unitPriceSix"
                  rules={[
                    {required: true, message: '请输入五要素验证单价'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,4}))$/
                        if (value && !reg.test(value)) {
                          return Promise.reject(
                            '请输入大于等于0的数，并且最多保留4位小数',
                          )
                        }
                        if (value > 99999) {
                          return Promise.reject('请输入小于99999的数')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="请输入五要素验证单价"
                    style={{width: 250}}
                    suffix="元/次"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card
            title="计费信息"
            headStyle={{
              paddingLeft: 20,
              fontWeight: 700,
              fontSize: 18,
              paddingBottom: -60,
            }}
            style={{
              padding: '0 30px',
              marginTop: 30,
              height: 300,
            }}
          >
            <p style={{color: '#666666'}}>每日计提</p>
            <p style={{color: '#262626'}}>
              当日利息收入 - 当日贷款余额 * 7% / 360
            </p>
            <p style={{color: '#666666'}}>每月结算</p>
            <p style={{color: '#262626'}}>
              若M3+ ≤ 1%，月结算额 = 按每日计提汇总额；
            </p>
            <p style={{color: '#262626'}}>
              若M3+ ＞ 1%，月结算额 = 按每日计提汇总额 - 当月日均贷款 * （M3 -
              1%）/ 360 * 当月天数
            </p>
          </Card>
        )}

        {flag == 1 ? (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 200,
              bottom: 0,
              right: 600,
              zIndex: 9999,
            }}
          />
        ) : (
          <Card style={{padding: '0 30px', marginTop: 30}}>
            <span style={{position: 'absolute', right: 20, top: 10}}>
              <Button style={{marginRight: 20}} onClick={handleCanel}>
                取消
              </Button>
              <Button type="primary" onClick={determine}>
                确定
              </Button>
            </span>
          </Card>
        )}
      </Form>
    </Layout>
  )
}
body.getInitialProps = async () => ({})

export default withRouter(body)
