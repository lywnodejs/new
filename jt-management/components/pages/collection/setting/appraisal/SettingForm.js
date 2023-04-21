import {Button, Form, InputNumber, Space, Input, Empty, message} from 'antd'
import React, {useEffect, useState} from 'react'
import api from '~/api/collection'

export default function (props) {
  const [form] = Form.useForm()
  const [data, setData] = useState([])

  useEffect(() => {
    if (props.productId) {
      form.resetFields()
      getData()
    }
  }, [props.productId])

  const getData = async () => {
    let {
      data: {code, data},
    } = await api.getAppraisalConfig(props.productId)
    if (code == 0) {
      form.setFieldsValue({list: data})
      setData(data)
    }
    console.log(code, data)
  }

  const saveSetting = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = values.list.map((v) => {
          return {
            id: v.id + '',
            newValue: v.newValue + '',
          }
        })

        let {
          data: {code, data},
        } = await api.changeAppraisalConfig({valueList: params})
        if (code == 0) {
          message.success('修改成功')
          getData()
        }
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  return (
    <Form form={form}>
      <Form.List name="list">
        {(fields) =>
          fields.map((field, index) => {
            return (
              // {...field}
              <div key={index}>
                <Space style={{marginBottom: 15}}>
                  <div style={{marginBottom: 24}}>
                    {data[index] && data[index].name}按收回总金额的
                  </div>

                  <div style={{margin: '0 20px'}}>
                    <Form.Item
                      name={[field.name, 'newValue']}
                      rules={[{required: true, message: '请输入'}]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  </div>

                  <div style={{marginBottom: 24}}> % 计算。</div>
                </Space>
              </div>
            )
          })
        }
      </Form.List>

      {Array.isArray(data) && data.length > 0 ? (
        <Form.Item>
          <Button type="primary" onClick={saveSetting}>
            保存
          </Button>
        </Form.Item>
      ) : (
        <Empty
          style={{
            margin: '50px 0',
          }}
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={'未配置'}
        ></Empty>
      )}
    </Form>
  )
}
