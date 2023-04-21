import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import Router, {withRouter} from 'next/router'
import fetch from '~/utils/fetch'

import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  Input,
} from 'antd'
const breadcrumbs = [{text: '营销管理'}, {text: '绩效管理'}, {text: '绩效配置'}]
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'
const initAmount = {asss: '', amount: ''}
function body({}) {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    getDetailData()
  }, [])
  const getDetailData = async () => {
    let {
      data: {code, data},
    } = await fetch('bank.api.usermanagerrewardservice.getrewardconfig')
    if (code == 0) {
      data.grantList = Array.isArray(data.grantList) ? data.grantList : [{}]

      if (data.grantList.length === 0) {
        data.grantList = [{}]
      }

      form.setFieldsValue({
        ...data,
      })
    }
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    let {
      data: {code, data},
    } = await fetch('bank.api.usermanagerrewardservice.updaterewardconfig', [
      values,
    ])
    if (code == 0) {
      message.success('提交成功')
      setVisible(false)
      Router.back()
    }
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card>
          <Form
            form={form}
            name="basic"
            initialValues={{
              grantList: [{grantAmountStart: null, grantReward: null}],
            }}
          >
            <Form.Item label="贷款调查奖励" name="incestValue">
              <Input suffix="元/单" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="贷后检查奖励" name="inspectValue">
              <Input suffix="元/单" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="放款额奖励">
              <Form.List name="grantList">
                {(fields, {add, remove}) =>
                  fields.map((field, index) => {
                    return (
                      <div key={field.key}>
                        首次达到 &nbsp;
                        <Space size={10}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'grantAmountStart']}
                            fieldKey={[field.fieldKey, 'grantAmountStart']}
                            rules={[
                              {
                                required: true,
                                message: '请输入',
                              },
                            ]}
                          >
                            <Input suffix="万" />
                          </Form.Item>
                          <div style={{marginBottom: 20}}>
                            &nbsp;，奖励&nbsp;
                          </div>
                          <Form.Item
                            {...field}
                            name={[field.name, 'grantReward']}
                            fieldKey={[field.fieldKey, 'grantReward']}
                            rules={[
                              {
                                required: true,
                                message: '请输入',
                              },
                            ]}
                          >
                            <Input suffix="元" />
                          </Form.Item>
                        </Space>
                        {index == 0 ? (
                          <Button
                            style={{
                              marginBottom: 24,
                              marginLeft: 10,
                              width: 60,
                            }}
                            onClick={() => add()}
                            type="primary"
                            icon={<PlusOutlined />}
                          />
                        ) : (
                          <Button
                            style={{
                              marginBottom: 24,
                              marginLeft: 10,
                              width: 60,
                            }}
                            onClick={() => remove(field.name)}
                            danger
                            type="primary"
                            icon={<MinusOutlined />}
                          />
                        )}
                      </div>
                    )
                  })
                }
              </Form.List>
            </Form.Item>
            <Form.Item label="管户数量奖励" name="userValue">
              <Input suffix="元/人" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="管户利息收入奖励" name="interestValue">
              <Input
                suffix="% 元"
                addonBefore="管户当月实收利息总收入*"
                style={{width: 500}}
              />
            </Form.Item>
            <Form.Item label="绩效延期发放规则">
              <span>当月产生应发绩效的</span>
            </Form.Item>
            <Form.Item name="realRewardValue" label="当月发放">
              <Input suffix="%" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="本年度12月发放" name="decRewardValue">
              <Input suffix="%" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="下一年度的当月发放" name="nyRewardValue">
              <Input suffix="%" style={{width: 200}} />
            </Form.Item>
            <Form.Item label="下下一年度的当月发放" name="ntyRewardValue">
              <Input suffix="%" style={{width: 200}} />
            </Form.Item>
            <Button
              type="primary"
              style={{width: 200, marginLeft: 150, marginTop: 50}}
              onClick={() => setVisible(true)}
            >
              提交
            </Button>
          </Form>

          <Modal
            visible={visible}
            onCancel={() => setVisible(false)}
            onOk={handleOk}
          >
            <p>
              绩效规则配置后，将从当月起生效，不影响历史月份绩效统计及发放规则。请确认？
            </p>
          </Modal>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
