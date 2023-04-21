import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useRef} from 'react'
import fetch from '~/utils/fetch'
import {scrollTop} from '~/utils'
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Upload,
  InputNumber,
} from 'antd'
import Router from 'next/router'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import moment from 'moment'
import api from '~/utils/api'
import {REWARD_TASK} from '~/utils/const'

const getData = async () => {
  let {
    data: {code, data},
  } = await fetch(
    'bank.api.userinvitationv2service.getuserinvitationrewardconfig',
  )
  if (code == 0) {
    return data
  }
  return {}
}

const getProList = async () => {
  let {
    data: {code, data},
  } = await api.getPro4userList()
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '营销管理'}, {text: '邀请管理'}, {text: '页面配置'}]

function body(props) {
  const [appImage, setAppImage] = useState('')
  const [miniAppImage, setMiniAppImage] = useState('')
  const [form] = Form.useForm()
  const layout = {
    labelCol: {flex: '0 0 200px'},
    wrapperCol: {flex: '1 1 0'},
  }

  const addItem = {
    action: null,
    productId: null,
    rewardAmount: null,
    rewardCurrentMonthlyInterestPercent: null,
  }

  useEffect(() => {
    if (props.data) {
      let data = {...props.data}
      if (data.startTime) {
        data.startTime = moment(data.startTime)
      }
      if (data.endTime) {
        data.endTime = moment(data.endTime)
      }
      if (data.shareImage) {
        setAppImage([
          {
            uid: '888',
            url: data.shareImage,
          },
        ])
        data.appImage = data.shareImage
      }
      if (data.miniappShareImage) {
        setMiniAppImage([
          {
            uid: '888',
            url: data.miniappShareImage,
          },
        ])
        data.miniAppImage = data.miniappShareImage
      }
      let strategy = props.data.strategy && JSON.parse(props.data.strategy)
      if (Array.isArray(strategy)) {
        data.fAttrs = strategy.filter((v) => v.level == 1)
        data.sAttrs = strategy.filter((v) => v.level == 2)
      } else {
        data.fAttrs = [{...addItem}]
        data.sAttrs = [{...addItem}]
      }
      form.setFieldsValue(data)
    }
  }, [])

  const onCommit = () => {
    form
      .validateFields()
      .then(
        async ({
          appImage,
          miniAppImage,
          fAttrs,
          sAttrs,
          startTime,
          endTime,
          ...params
        }) => {
          if (appImage) {
            params.shareImage = appImage
          }
          if (miniAppImage) {
            params.miniappShareImage = miniAppImage
          }
          params.startTime = startTime.format('YYYY-MM-DD')
          params.endTime = endTime.format('YYYY-MM-DD')
          let strategy = []

          fAttrs.forEach((attrs) => {
            attrs.level = 1
            strategy.push(attrs)
          })
          sAttrs.forEach((attrs) => {
            if (attrs.action) {
              attrs.level = 2
              strategy.push(attrs)
            }
          })

          params.strategy = JSON.stringify(strategy)

          let {
            data: {code, data},
          } = await fetch(
            'bank.api.userinvitationv2service.saveorupdateinvitationstrategy',
            [params],
          )
          if (code == 0) {
            message.success('提交成功')
          }
        },
      )
  }

  const uploadIcon = (options, type) => {
    const fileReader = new FileReader()
    fileReader.onloadend = async (e) => {
      let arr = e.target.result.split(';base64,')
      let imgType = arr[0].split('/')[1]
      let params = {
        imgType,
        imgData: e.target.result,
      }
      let {
        data: {code, data},
      } = await fetch('bank.api.activityservice.uploadimg', [params])
      if (code == 0) {
        console.log(data)
        form.setFieldsValue({
          [type]: data,
        })
        const img = [
          {
            ...options.file,
            status: 'done',
            url: data,
          },
        ]
        if (type === 'appImage') {
          setAppImage(img)
        }
        if (type === 'miniAppImage') {
          setMiniAppImage(img)
        }
      }
    }
    fileReader.readAsDataURL(options.file)
  }

  const onRemove = (type) => {
    form.setFieldsValue({[type]: ''})
    if (type === 'appImage') {
      setAppImage()
    }
    if (type === 'miniAppImage') {
      setMiniAppImage()
    }

    console.log(form.getFieldsValue())
    return true
  }

  const changeStartTime = () => {
    let startTime = form.getFieldValue('startTime')
    let endTime = form.getFieldValue('endTime')
    if (startTime && endTime && endTime < startTime) {
      form.setFieldsValue({endTime: null})
    }
  }
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current.endOf('day').isBefore(moment().endOf('day'))
  }

  const disabledStartDate = (current) => {
    // Can not select days before today and today
    return current
      .endOf('day')
      .isBefore(form.getFieldValue('startTime').endOf('day'))
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Form
          // style={{width: 750}}
          {...layout}
          name="config"
          initialValues={{
            fAttrs: [{...addItem}],
            sAttrs: [{...addItem}],
          }}
          form={form}
        >
          <Form.Item label="最高奖励金额" required style={{marginBottom: 0}}>
            <Space>
              <Form.Item
                rules={[{required: true, message: '请输入最高奖励金额'}]}
                name="maxRewardAmount"
              >
                <InputNumber style={{width: 200}} min={0} precision={0} />
              </Form.Item>
              <div style={{marginBottom: 24}}>元</div>
            </Space>
          </Form.Item>

          <Form.Item
            rules={[{required: true, message: '请选择奖励类型'}]}
            label="奖励类型"
            name="rewardType"
          >
            <Select placeholder="请选择" style={{width: 200}}>
              <Select.Option value={1}>现金</Select.Option>
              <Select.Option value={2}>电话卡</Select.Option>
              <Select.Option value={3}>购物卡</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            rules={[{required: true, message: '请选择活动开始时间'}]}
            label="活动开始时间"
            name="startTime"
          >
            <DatePicker
              onChange={changeStartTime}
              disabledDate={disabledDate}
              style={{width: 200}}
            />
          </Form.Item>

          <Form.Item
            rules={[{required: true, message: '请选择活动结束时间'}]}
            label="活动结束时间"
            name="endTime"
          >
            <DatePicker disabledDate={disabledStartDate} style={{width: 200}} />
          </Form.Item>

          <Form.Item label="一级邀请奖励" required style={{marginBottom: 0}}>
            <Form.List name="fAttrs">
              {(fields, {add, remove}, {errors}) =>
                fields.map((field, index) => {
                  return (
                    <div key={field.key} style={{marginBottom: 15}}>
                      <Space size={10}>
                        <Form.Item
                          {...field}
                          rules={[{required: true, message: '请选择任务'}]}
                          name={[field.name, 'action']}
                          fieldKey={[field.fieldKey, 'action']}
                        >
                          <Select placeholder="请选择任务" style={{width: 120}}>
                            {REWARD_TASK.map((v, i) => {
                              return (
                                <Select.Option value={v.value} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) => {
                            let p_item = prevValues.fAttrs[index]
                            let c_item = curValues.fAttrs[index]
                            return (
                              ((p_item && p_item.action) || '') !=
                              ((c_item && c_item.action) || '')
                            )
                          }}
                        >
                          {({getFieldValue}) => {
                            const taskVal = getFieldValue([
                              'fAttrs',
                              index,
                              'action',
                            ])
                            return taskVal == 2 || taskVal == 3 ? (
                              <Form.Item
                                rules={[
                                  {required: true, message: '请选择产品'},
                                ]}
                                name={[field.name, 'productId']}
                              >
                                <Select
                                  style={{width: 120}}
                                  placeholder="请选择产品"
                                >
                                  {props.proList.map((v, i) => {
                                    return (
                                      <Select.Option value={v.id} key={i}>
                                        {v.name}
                                      </Select.Option>
                                    )
                                  })}
                                </Select>
                              </Form.Item>
                            ) : null
                          }}
                        </Form.Item>

                        <Form.Item
                          label="奖励金额"
                          required={false}
                          {...field}
                          rules={[{required: true, message: '请输入奖励金额'}]}
                          name={[field.name, 'rewardAmount']}
                          fieldKey={[field.fieldKey, 'rewardAmount']}
                        >
                          <Input style={{width: 100}} />
                        </Form.Item>
                        <div style={{marginBottom: 24}}>元/人</div>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) => {
                            let p_item = prevValues.fAttrs[index]
                            let c_item = curValues.fAttrs[index]
                            return (
                              ((p_item && p_item.action) || '') !=
                              ((c_item && c_item.action) || '')
                            )
                          }}
                        >
                          {({getFieldValue}) => {
                            const taskVal = getFieldValue([
                              'fAttrs',
                              index,
                              'action',
                            ])
                            return taskVal == 3 ? (
                              <Space>
                                <div style={{marginBottom: 24}}>
                                  {' '}
                                  + 当月实收利息总收入 *{' '}
                                </div>
                                <Form.Item
                                  rules={[{required: true, message: '请输入'}]}
                                  name={[
                                    field.name,
                                    'rewardCurrentMonthlyInterestPercent',
                                  ]}
                                >
                                  <InputNumber min={0} />
                                </Form.Item>
                                <div style={{marginBottom: 24}}>%</div>
                              </Space>
                            ) : null
                          }}
                        </Form.Item>

                        {index == 0 ? (
                          <Button
                            style={{marginBottom: 24}}
                            onClick={() => add({...addItem})}
                            type="primary"
                            icon={<PlusOutlined />}
                          />
                        ) : (
                          <Button
                            style={{marginBottom: 24}}
                            onClick={() => remove(field.name)}
                            type="primary"
                            danger
                            icon={<MinusOutlined />}
                          />
                        )}
                      </Space>
                    </div>
                  )
                })
              }
            </Form.List>
          </Form.Item>

          <Form.Item label="二级邀请奖励" style={{marginBottom: 0}}>
            <Form.List name="sAttrs">
              {(fields, {add, remove}, {errors}) =>
                fields.map((field, index) => {
                  return (
                    <div key={field.key} style={{marginBottom: 15}}>
                      <Space size={10}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'action']}
                          fieldKey={[field.fieldKey, 'action']}
                        >
                          <Select placeholder="请选择任务" style={{width: 120}}>
                            {REWARD_TASK.map((v, i) => {
                              return (
                                <Select.Option value={v.value} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) => {
                            let p_item = prevValues.fAttrs[index]
                            let c_item = curValues.fAttrs[index]
                            return (
                              ((p_item && p_item.action) || '') !=
                              ((c_item && c_item.action) || '')
                            )
                          }}
                        >
                          {({getFieldValue}) => {
                            const taskVal = getFieldValue([
                              'sAttrs',
                              index,
                              'action',
                            ])
                            return taskVal == 2 || taskVal == 3 ? (
                              <Form.Item name={[field.name, 'productId']}>
                                <Select
                                  style={{width: 120}}
                                  placeholder="请选择产品"
                                >
                                  {props.proList.map((v, i) => {
                                    return (
                                      <Select.Option value={v.id} key={i}>
                                        {v.name}
                                      </Select.Option>
                                    )
                                  })}
                                </Select>
                              </Form.Item>
                            ) : null
                          }}
                        </Form.Item>

                        <Form.Item
                          label="奖励金额"
                          required={false}
                          {...field}
                          name={[field.name, 'rewardAmount']}
                          fieldKey={[field.fieldKey, 'rewardAmount']}
                        >
                          <Input style={{width: 100}} />
                        </Form.Item>
                        <div style={{marginBottom: 24}}>元/人</div>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) => {
                            let p_item = prevValues.fAttrs[index]
                            let c_item = curValues.fAttrs[index]
                            return (
                              ((p_item && p_item.action) || '') !=
                              ((c_item && c_item.action) || '')
                            )
                          }}
                        >
                          {({getFieldValue}) => {
                            const taskVal = getFieldValue([
                              'sAttrs',
                              index,
                              'action',
                            ])
                            return taskVal == 3 ? (
                              <Space>
                                <div style={{marginBottom: 24}}>
                                  {' '}
                                  + 当月实收利息总收入 *{' '}
                                </div>
                                <Form.Item
                                  name={[
                                    field.name,
                                    'rewardCurrentMonthlyInterestPercent',
                                  ]}
                                >
                                  <InputNumber min={0} />
                                </Form.Item>
                                <div style={{marginBottom: 24}}>%</div>
                              </Space>
                            ) : null
                          }}
                        </Form.Item>

                        {index == 0 ? (
                          <Button
                            style={{marginBottom: 24}}
                            onClick={() => add({...addItem})}
                            type="primary"
                            icon={<PlusOutlined />}
                          />
                        ) : (
                          <Button
                            style={{marginBottom: 24}}
                            onClick={() => remove(field.name)}
                            type="primary"
                            danger
                            icon={<MinusOutlined />}
                          />
                        )}
                      </Space>
                    </div>
                  )
                })
              }
            </Form.List>
          </Form.Item>

          <Form.Item
            rules={[{required: true, message: '请输入活动规则'}]}
            label="活动规则"
            name="rule"
          >
            <Input.TextArea autoSize style={{minHeight: 150, width: 400}} />
          </Form.Item>

          <Form.Item
            label="APP分享图"
            style={{marginBottom: 15}}
            name="appImage"
          >
            <Upload
              name="file"
              accept="image/*"
              customRequest={(options) => uploadIcon(options, 'appImage')}
              listType="picture-card"
              fileList={appImage}
              onRemove={() => onRemove('appImage')}
            >
              <Button type="primary">{appImage ? '重新' : '点击'}上传</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="小程序分享标题" name="miniappShareTitle">
            <Input style={{width: 400}} />
          </Form.Item>

          <Form.Item
            label="小程序分享图"
            style={{marginBottom: 15}}
            name="miniAppImage"
          >
            <Upload
              name="file"
              accept="image/*"
              customRequest={(options) => uploadIcon(options, 'miniAppImage')}
              listType="picture-card"
              fileList={miniAppImage}
              onRemove={() => onRemove('miniAppImage')}
            >
              <Button type="primary">
                {miniAppImage ? '重新' : '点击'}上传
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{marginLeft: 200}}>
            <Button type="primary" onClick={onCommit}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  let proList = await getProList()
  return {
    data,
    proList,
  }
}

export default body
