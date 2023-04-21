import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Card,
  message,
  Form,
  Button,
  Input,
  Row,
  Col,
  Select,
  Switch,
  PageHeader,
  Space,
  Tooltip,
  InputNumber,
} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'
import Router, {withRouter} from 'next/router'
import api from '~/api/product'

import {CREDIT_TYPE} from '~/utils/const'

const breadcrumbs = [{text: '产品管理'}, {text: '编辑产品信息'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])

  const [detail, setDetail] = useState([])
  const [informationForm] = Form.useForm()
  const [extraInformationForm] = Form.useForm()
  const [yunYingForm] = Form.useForm()
  useEffect(() => {
    async function fetchData() {
      // fetchList()
      if (props.router.query.id !== 'new') {
        fetchList()
      } else {
        extraInformationForm.setFieldsValue({
          gracePeriod: false,
        })
      }
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_product_detail(props.router.query.id)
      if (code === 0) {
        console.log(data)
        // data.newuserLimitExpireTimeUnit = String(
        //   data.newuserLimitExpireTimeUnit,
        // )
        // data.olduserLimitExpireTimeUnit = String(
        //   data.olduserLimitExpireTimeUnit,
        // )
        // data.isStopInterest = String(data.isStopInterest)
        data.repayDay = data.fixedDeductDate == 0 ? 2 : 1
        data.gracePeriod = !!data.gracePeriod
        informationForm.setFieldsValue(data)
        extraInformationForm.setFieldsValue(data)
        yunYingForm.setFieldsValue(data)
        setDetail(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit = async () => {
    const getForm1 = informationForm.validateFields
    const getForm2 = extraInformationForm.validateFields
    const getForm3 = yunYingForm.validateFields

    Promise.all([getForm1(), getForm2(), getForm3()])
      .then(async ([{repayDay, ...values1}, values2, values3]) => {
        if (repayDay == 2) {
          values1.fixedDeductDate = 0
        }

        const params = {
          ...values1,
          ...values2,
          ...values3,
          // stepAmount: 100,
          tenantId: cookies.tenantId,
        }
        let requestFun = null
        if (props.router.query.id !== 'new') {
          params.id = props.router.query.id
          requestFun = api.edit_product
        } else {
          requestFun = api.add_product
        }

        try {
          const {
            data: {data, code},
          } = await requestFun(params)
          if (code == 0) {
            message.success('编辑成功')
            Router.back()
          }
        } catch (errorInfo) {
          console.log('Failed:', errorInfo)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const changeExpireTimeUnit = (val) => {
    informationForm.setFieldsValue('newuserLimitExpireTimeUnit', val)
  }
  const changeOldTimeUnit = (val) => {
    informationForm.setFieldsValue('olduserLimitExpireTimeUnit', val)
  }

  const onCancel = () => {
    Router.back()
  }
  const newTipsElement = () => {
    return (
      <>
        <span>新户额度有效期&emsp;</span>
        <Tooltip title="额度有效期将会影响未申请时需重新进件授信资料的时间。">
          <ExclamationCircleOutlined />
        </Tooltip>
      </>
    )
  }
  const oldTipsElement = () => {
    return (
      <>
        <span>老户额度有效期&emsp;</span>
        <Tooltip title="额度有效期将会影响用户的借款期限选择。">
          <ExclamationCircleOutlined />
        </Tooltip>
      </>
    )
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card title="基本信息" style={{marginTop: '20px'}}>
        <Form
          requiredMark={true}
          style={{marginBottom: 20}}
          form={informationForm}
          layout="vertical"
          name="informationForm"
          initialValues={{
            rateType: 1,
            repaymentPeriodType: 1,
            olduserLimitExpireTimeUnit: 1,
            newuserLimitExpireTimeUnit: 1,
            termModel: 1,
          }}
        >
          <Row gutter={50}>
            <Col span={8}>
              <Form.Item
                label="产品名称"
                name="name"
                rules={[
                  {required: true, message: '请输入产品名称'},
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (value && (value.length < 1 || value.length > 10)) {
                        return Promise.reject(
                          '输入范围大于1字符，小于等于10字符',
                        )
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input placeholder="支持中英文、数字和下划线" />
              </Form.Item>

              <Form.Item label="年化利率" required style={{marginBottom: 0}}>
                <Row align="middle" gutter={10} wrap={false}>
                  <Col flex="0 0 120px">
                    <Form.Item name="rateType">
                      <Select style={{width: '100%'}} placeholder="请选择">
                        <Select.Option value={1}>范围</Select.Option>
                        <Select.Option value={2}>固定</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col flex={1}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.rateType !== curValues.rateType
                      }
                    >
                      {({getFieldValue}) => {
                        const rateType = getFieldValue('rateType')
                        return rateType == 2 ? (
                          <Form.Item
                            name="yearInterestRate"
                            rules={[
                              {required: true, message: '请输入年化利率'},
                              ({getFieldValue}) => ({
                                validator(rule, value) {
                                  if (value >= 37) {
                                    return Promise.reject('输入范围大于0小于37')
                                  }
                                  return Promise.resolve()
                                },
                              }),
                            ]}
                          >
                            <InputNumber
                              style={{width: '100%'}}
                              placeholder="请输入数字"
                              min={0}
                              precision={2}
                            />
                          </Form.Item>
                        ) : (
                          <Row wrap={false} gutter={24} align="middle">
                            <Col flex={1}>
                              <Form.Item
                                name="minRate"
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入最小年化利率',
                                  },
                                  ({getFieldValue}) => ({
                                    validator(rule, value) {
                                      if (value >= 37) {
                                        return Promise.reject(
                                          '输入范围大于0小于37',
                                        )
                                      }
                                      return Promise.resolve()
                                    },
                                  }),
                                ]}
                              >
                                <InputNumber
                                  style={{width: '100%'}}
                                  placeholder="请输入数字"
                                  min={0}
                                  precision={2}
                                />
                              </Form.Item>
                            </Col>

                            <Col
                              flex="0 0 30px"
                              style={{
                                textAlign: 'center',
                                marginBottom: 20,
                              }}
                            >
                              至
                            </Col>

                            <Col flex={1}>
                              <Form.Item
                                name="maxRate"
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入最大年化利率',
                                  },
                                  ({getFieldValue}) => ({
                                    validator(rule, value) {
                                      if (value >= 37) {
                                        return Promise.reject(
                                          '输入范围大于0小于37',
                                        )
                                      }
                                      return Promise.resolve()
                                    },
                                  }),
                                ]}
                              >
                                <InputNumber
                                  style={{width: '100%'}}
                                  placeholder="请输入数字"
                                  precision={2}
                                  min={0}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )
                      }}
                    </Form.Item>
                  </Col>

                  <Col flex="0 0 auto" style={{marginBottom: 20}}>
                    %
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="贷款期限" required style={{marginBottom: 0}}>
                <Row align="middle" gutter={15} wrap={false}>
                  <Col flex="0 0 120px">
                    <Form.Item
                      rules={[{required: true, message: '请选择'}]}
                      name="termModel"
                    >
                      <Select style={{width: '100%'}} placeholder="请选择">
                        <Select.Option value={1}>范围</Select.Option>
                        <Select.Option value={2}>固定</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col flex={1}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.termModel !== curValues.termModel
                      }
                    >
                      {({getFieldValue}) => {
                        const termModel = getFieldValue('termModel')
                        return termModel == 1 ? (
                          <Row gutter={24} wrap={false} align="middle">
                            <Col flex={1}>
                              <Form.Item
                                name="minTerms"
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入贷款期限最小值',
                                  },
                                  // ({getFieldValue}) => ({
                                  //   validator(rule, value) {
                                  //     if (value > 37) {
                                  //       return Promise.reject('输入范围大于0小于37')
                                  //     }
                                  //     return Promise.resolve()
                                  //   },
                                  // }),
                                ]}
                              >
                                <InputNumber
                                  style={{width: '100%'}}
                                  placeholder="请输入正整数"
                                  precision={0}
                                  min={1}
                                  max={999}
                                />
                              </Form.Item>
                            </Col>

                            <Col flex="0 0 auto" style={{marginBottom: 20}}>
                              至
                            </Col>

                            <Col flex={1}>
                              <Form.Item
                                name="maxTerms"
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入贷款期限最大值',
                                  },
                                  // ({getFieldValue}) => ({
                                  //   validator(rule, value) {
                                  //     if (value > 37) {
                                  //       return Promise.reject('输入范围大于0小于37')
                                  //     }
                                  //     return Promise.resolve()
                                  //   },
                                  // }),
                                ]}
                              >
                                <InputNumber
                                  style={{width: '100%'}}
                                  placeholder="请输入正整数"
                                  precision={0}
                                  min={1}
                                  max={999}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ) : (
                          <Form.Item
                            name="allowTerms"
                            rules={[
                              {required: true, message: '请输入贷款期限'},
                              ({getFieldValue}) => ({
                                validator(rule, value) {
                                  if (!value) {
                                    return Promise.resolve()
                                  }
                                  const arr = value
                                    .split('/')
                                    .filter((v) => !!v)
                                  const reg = /(^[1-9]\d*$)/
                                  const isTrue = arr.every((v) => reg.test(v))
                                  if (!isTrue) {
                                    return Promise.reject(
                                      '请输入正确的贷款期限，必须是正整数',
                                    )
                                  }

                                  const numIsTrue = arr.every(
                                    (v) => +v > 0 && +v < 1000,
                                  )
                                  if (!numIsTrue) {
                                    return Promise.reject(
                                      '贷款期限大于0小于1000',
                                    )
                                  }
                                  return Promise.resolve()
                                },
                              }),
                            ]}
                          >
                            <Input
                              style={{width: '100%'}}
                              placeholder="多个值用“/”隔开，例3/6/9"
                            />
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                  </Col>

                  <Col flex="0 0 auto" style={{marginBottom: 20}}>
                    月
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="授信类型"
                rules={[{required: true, message: '请选择授信类型'}]}
                name="creditType"
              >
                <Select style={{width: 180}} placeholder="请选择">
                  {CREDIT_TYPE.map((v, i) => (
                    <Select.Option value={v.key} key={i}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="还款方式" required style={{marginBottom: 0}}>
                <Row align="middle" gutter={15} wrap={false}>
                  <Col flex={1}>
                    <Form.Item
                      name="repaymentTypes"
                      rules={[{required: true, message: '请选择还款方式'}]}
                    >
                      <Select
                        style={{width: '100%'}}
                        mode="multiple"
                        placeholder="请选择还款方式"
                        optionFilterProp="children"
                        allowClear
                        showArrow
                      >
                        <Select.Option value="1">等额本息</Select.Option>
                        <Select.Option value="2">等额本金</Select.Option>
                        <Select.Option value="3">先息后本</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name="repaymentPeriodType">
                      <Select style={{width: '100%'}} showArrow>
                        <Select.Option value={1}>按月还款</Select.Option>
                        <Select.Option value={2}>按季还款</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="整体授信金额（元）"
                required
                style={{marginBottom: 0}}
              >
                <Row align="middle" gutter={15} wrap={false}>
                  <Col flex={1}>
                    <Form.Item
                      name="minCreditAmount"
                      rules={[
                        {required: true, message: '请输入整体授信金额'},
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (value >= 1000000) {
                              return Promise.reject('输入范围大于0小于1000000')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={999999}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>

                  <Col flex="0 0 24px" style={{textAlign: 'center'}}>
                    -
                  </Col>

                  <Col flex={1}>
                    <Form.Item
                      name="maxCreditAmount"
                      rules={[
                        {required: true, message: '请输入整体授信金额'},
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (value >= 1000000) {
                              return Promise.reject('输入范围大于0小于1000000')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={999999}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="单笔用信金额（元）"
                required
                style={{marginBottom: 0}}
              >
                <Row align="middle" gutter={15} wrap={false}>
                  <Col flex={1}>
                    <Form.Item
                      name="minSingleCreditAmount"
                      rules={[
                        {required: true, message: '请输入单笔用信金额'},
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (value >= 1000000) {
                              return Promise.reject('输入范围大于0小于1000000')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={999999}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>

                  <Col flex="0 0 24px" style={{textAlign: 'center'}}>
                    -
                  </Col>

                  <Col flex={1}>
                    <Form.Item
                      name="maxSingleCreditAmount"
                      rules={[
                        {required: true, message: '请输入单笔用信金额'},
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (value >= 1000000) {
                              return Promise.reject('输入范围大于0小于1000000')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={999999}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label={newTipsElement()} required>
                <Form.Item
                  name="newuserLimitExpireTime"
                  style={{
                    display: 'inline-block',
                    marginRight: 0,
                    width: '160px',
                  }}
                  rules={[
                    {required: true, message: '请输入新户额度有效期'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        if (value > 100) {
                          return Promise.reject('输入范围大于0小于100')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="请输入整数"
                    min={0}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <Form.Item
                  name="newuserLimitExpireTimeUnit"
                  style={{
                    display: 'inline-block',
                    width: '60px',
                    marginLeft: '10px',
                  }}
                >
                  <Select onChange={(val) => changeExpireTimeUnit(val)}>
                    <Select.Option value={1}>日</Select.Option>
                    <Select.Option value={2}>月</Select.Option>
                  </Select>
                </Form.Item>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="还款日" required style={{marginBottom: 0}}>
                <Row align="start" gutter={15} wrap={false}>
                  <Col flex="0 0 180px">
                    <Form.Item
                      rules={[{required: true, message: '请选择还款日'}]}
                      name="repayDay"
                    >
                      <Select style={{width: '100%'}} placeholder="请选择">
                        <Select.Option value={1}>固定还款日</Select.Option>
                        <Select.Option value={2}>
                          放款日作为还款日
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col flex={1}>
                    <Form.Item
                      style={{marginBottom: 0}}
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.repayDay !== curValues.repayDay
                      }
                    >
                      {({getFieldValue}) => {
                        const repayDay = getFieldValue('repayDay')
                        return repayDay == 1 ? (
                          <Space align="baseline">
                            <span> 每月</span>

                            <Form.Item
                              name="fixedDeductDate"
                              rules={[
                                {required: true, message: '请填写还款日'},
                                // ({getFieldValue}) => ({
                                //   validator(rule, value) {
                                //     if (value > 37) {
                                //       return Promise.reject('输入范围大于0小于37')
                                //     }
                                //     return Promise.resolve()
                                //   },
                                // }),
                              ]}
                            >
                              <InputNumber
                                style={{width: '100%'}}
                                placeholder="请输入数字"
                                precision={0}
                                min={1}
                                max={28}
                              />
                            </Form.Item>
                            <span>日</span>
                          </Space>
                        ) : null
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="授信金额步长限制"
                name="creditStepAmount"
                rules={[
                  {required: true, message: '请输入授信金额步长'},
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      // if (value && (value.length < 1 || value.length > 10)) {
                      //   return Promise.reject(
                      //     '输入范围大于1字符，小于等于10字符',
                      //   )
                      // }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{width: '100%'}}
                  min={1}
                  max={999999999}
                  precision={0}
                  placeholder="例：步长1000，则授信金额必须是1000的倍数"
                />
              </Form.Item>

              <Form.Item
                label="用信金额步长限制"
                name="stepAmount"
                rules={[
                  {required: true, message: '请输入用信金额步长限制'},
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      // if (value && (value.length < 1 || value.length > 10)) {
                      //   return Promise.reject(
                      //     '输入范围大于1字符，小于等于10字符',
                      //   )
                      // }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={1}
                  max={999999999}
                  precision={0}
                  style={{width: '100%'}}
                  placeholder="例：步长100，则用信金额必须是100的倍数"
                />
              </Form.Item>

              <Form.Item label={oldTipsElement()} required>
                <Form.Item
                  name="olduserLimitExpireTime"
                  style={{
                    display: 'inline-block',
                    marginRight: 0,
                    width: '160px',
                  }}
                  rules={[
                    {required: true, message: '请输入老户额度有效期'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        if (value > 1000) {
                          return Promise.reject('输入范围大于0小于1000')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="请输入整数"
                    min={0}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <Form.Item
                  name="olduserLimitExpireTimeUnit"
                  style={{
                    display: 'inline-block',
                    width: '60px',
                    marginLeft: '10px',
                  }}
                >
                  <Select onChange={(val) => changeOldTimeUnit(val)}>
                    <Select.Option value={1}>日</Select.Option>
                    <Select.Option value={2}>月</Select.Option>
                  </Select>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="补充信息" style={{marginTop: '20px'}}>
        <Form
          style={{marginBottom: 20}}
          form={extraInformationForm}
          layout="vertical"
          name="extraInformationForm"
          initialValues={{}}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="宽限期"
                name="gracePeriod"
                valuePropName="checked"
              >
                <Switch checkedChildren="开" unCheckedChildren="关" />
              </Form.Item>
              <p style={{color: '#bababa'}}>（注：宽限期天数默认为3天)</p>
            </Col>

            <Col span={8}>
              <Form.Item label="罚息上浮比例" required>
                <Form.Item
                  name="penaltyRate"
                  style={{
                    display: 'inline-block',
                    marginLeft: '5px',
                    width: '200px',
                  }}
                  rules={[
                    {required: true, message: '请输入罚息上浮比例'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        // if (value > 100) {
                        //   return Promise.reject('输入范围大于等于0小于101')
                        // }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="请输入数字"
                    min={0}
                    max={100}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <span
                  style={{
                    paddingLeft: '5px',
                    verticalAlign: 'sub',
                  }}
                >
                  %
                </span>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="LPR配置" required>
                <Form.Item
                  name="lprRate"
                  style={{
                    width: '80%',
                    display: 'inline-block',
                    marginBottom: 0,
                  }}
                  rules={[
                    {required: true, message: '请输入LPR'},
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        if (value > 100) {
                          return Promise.reject('输入范围大于等于0小于101')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="请输入数字"
                    min={0}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <span
                  style={{
                    paddingLeft: '5px',
                    verticalAlign: 'sub',
                  }}
                >
                  %
                </span>
              </Form.Item>
              <p style={{color: '#bababa'}}>
                （注：显示在协议中，当配置为0则不展示）
              </p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="提前还款"
                rules={[{required: true, message: '请选择提前还款'}]}
                name="prepaymentType"
              >
                <Select style={{width: 180}} placeholder="请选择">
                  <Select.Option value={1}>允许</Select.Option>
                  <Select.Option value={2}>不允许</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="提前结清"
                rules={[{required: true, message: '请选择提前结清'}]}
                name="aheadSettleType"
              >
                <Select style={{width: 180}} placeholder="请选择">
                  <Select.Option value={1}>允许</Select.Option>
                  <Select.Option value={2}>不允许</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.aheadSettleType !== curValues.aheadSettleType
                }
              >
                {({getFieldValue}) => {
                  const beforeSettle = getFieldValue('aheadSettleType')
                  return beforeSettle == 1 ? (
                    <React.Fragment>
                      <Form.Item label="提前结清违约金" required>
                        <Form.Item
                          name="earlySettleAmountFee"
                          style={{
                            width: '80%',
                            display: 'inline-block',
                            marginBottom: 0,
                          }}
                          rules={[
                            {required: true, message: '请输入提前结清违约金'},
                          ]}
                        >
                          <InputNumber
                            placeholder="请输入数字"
                            min={0}
                            max={999999999}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                        <span
                          style={{
                            paddingLeft: '5px',
                            verticalAlign: 'sub',
                          }}
                        >
                          %
                        </span>
                      </Form.Item>
                      <p style={{color: '#bababa'}}>
                        （注：按剩余本金总额的百分比计收。0为不收取）
                      </p>
                    </React.Fragment>
                  ) : null
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="运营信息" style={{marginTop: '20px'}}>
        <Form
          style={{marginBottom: 20}}
          form={yunYingForm}
          layout="vertical"
          name="yunYingForm"
          initialValues={{}}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="运营模式"
                name="operatingModel"
                rules={[{required: true, message: '请选择运营模式'}]}
              >
                <Select style={{width: 150}} placeholder="请选择运营模式">
                  <Select.Option value={1}>联合贷</Select.Option>
                  <Select.Option value={2}>助贷</Select.Option>
                  <Select.Option value={3}>自营</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="每日放款限额">
                <Form.Item
                  name="operatingLoanAmount"
                  style={{
                    width: '80%',
                    display: 'inline-block',
                    marginBottom: 0,
                  }}
                >
                  <InputNumber
                    placeholder="请输入整数，单位“万元”"
                    min={0}
                    precision={0}
                    max={999999999}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <span
                  style={{
                    paddingLeft: '5px',
                    verticalAlign: 'sub',
                  }}
                >
                  万元
                </span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row style={{marginTop: '10px'}}>
        <Button onClick={onCancel}>取消</Button>
        <Button
          type="primary"
          htmlType="button"
          onClick={onSubmit}
          style={{marginLeft: '5px'}}
        >
          确定
        </Button>
      </Row>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
