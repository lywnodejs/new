import React, {useEffect, useState} from 'react'
import {Form, Button, Input, DatePicker, Upload, Select, Space} from 'antd'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import api from '~/utils/api'
import UploadImage from './UploadImg'

const StrideSetting = ({setttingForm, handleSave}) => {
  const uploadAward = async (base64, index) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        const newData = [...setttingForm.getFieldValue('items')].filter(
          (v) => !!v,
        )
        newData[index] = {
          ...newData[index],
          logo: data,
        }
        setttingForm.setFieldsValue({
          items: newData,
        })
      }
    })
  }

  return (
    <Form
      form={setttingForm}
      name="basic"
      initialValues={{
        items: [
          {
            type: null,
            level: null,
            name: null,
            amount: null,
            num: null,
            probability: null,
            logo: null,
          },
        ],
      }}
    >
      <Form.Item label="分享奖励" name="shareMaxNum">
        <Input
          addonBefore="最多可获得"
          suffix="次抽奖机会"
          style={{width: 550}}
        />
      </Form.Item>
      <Form.Item label="申请贷款奖励" name="applyMaxNum">
        <Input
          style={{width: 500}}
          addonBefore="最多可获得"
          suffix="次抽奖机会"
        />
      </Form.Item>

      <Form.List name="items">
        {(fields, {add, remove}) =>
          fields.map((field, index) => {
            return (
              <div key={field.key}>
                <Space size={10} direction="vertical">
                  <p style={{color: '#000', marginTop: 20}}>{`奖励${
                    index + 1
                  }`}</p>
                  <Form.Item
                    label="奖品类型"
                    {...field}
                    rules={[{required: true, message: '请选择奖品类型'}]}
                    name={[field.name, 'type']}
                    fieldKey={[field.fieldKey, 'type']}
                  >
                    <Select placeholder="请选择奖品类型" style={{width: 500}}>
                      <Select.Option value={2}>实物奖励</Select.Option>
                      <Select.Option value={3}>虚拟奖励</Select.Option>
                      <Select.Option value={4}>现金</Select.Option>
                      <Select.Option value={5}>谢谢参与</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="奖品等级"
                    {...field}
                    rules={[{required: true, message: '请选择奖品等级'}]}
                    name={[field.name, 'level']}
                    fieldKey={[field.fieldKey, 'level']}
                  >
                    <Select placeholder="请选择奖品等级" style={{width: 500}}>
                      <Select.Option value="1">一等奖</Select.Option>
                      <Select.Option value="2">二等奖</Select.Option>
                      <Select.Option value="3">三等奖</Select.Option>
                      <Select.Option value="4">四等奖</Select.Option>
                      <Select.Option value="5">五等奖</Select.Option>
                      <Select.Option value="6">六等奖</Select.Option>
                      <Select.Option value="7">七等奖</Select.Option>
                      <Select.Option value="8">八等奖</Select.Option>
                      <Select.Option value="9">九等奖</Select.Option>
                      <Select.Option value="10">十等奖</Select.Option>
                      <Select.Option value="99">默认奖励</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="奖品名称"
                    {...field}
                    rules={[{required: true, message: '请输入奖品名称'}]}
                    name={[field.name, 'name']}
                    fieldKey={[field.fieldKey, 'name']}
                  >
                    <Input style={{width: 500}} />
                  </Form.Item>

                  <Form.Item
                    label="单件奖品成本(元)"
                    {...field}
                    rules={[
                      {required: true, message: '请输入单件奖品成本'},
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
                    name={[field.name, 'amount']}
                    fieldKey={[field.fieldKey, 'amount']}
                  >
                    <Input style={{width: 500}} />
                  </Form.Item>

                  <Form.Item
                    label="奖品数量"
                    {...field}
                    rules={[
                      {required: true, message: '请输入奖品数量'},
                      ({getFieldValue}) => ({
                        validator(rule, value) {
                          var reg = /^[1-9]\d*$/
                          if (value && !reg.test(value)) {
                            return Promise.reject('请输入正整数')
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                    name={[field.name, 'num']}
                    fieldKey={[field.fieldKey, 'num']}
                  >
                    <Input style={{width: 500}} />
                  </Form.Item>
                  <Form.Item
                    label="中奖概率(%)"
                    {...field}
                    rules={[
                      {required: true, message: '请输入中奖概率(%)'},
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
                    name={[field.name, 'probability']}
                    fieldKey={[field.fieldKey, 'probability']}
                  >
                    <Input style={{width: 500}} />
                  </Form.Item>
                  <Form.Item
                    label="奖励图标"
                    {...field}
                    rules={[{required: true, message: '请上传奖励图标'}]}
                    name={[field.name, 'logo']}
                    fieldKey={field.fieldKey}
                  >
                    <UploadImage
                      onChange={(base64) => {
                        uploadAward(base64, index)
                      }}
                    />
                  </Form.Item>

                  {index == 0 && fields.length < 10 ? (
                    <Button
                      style={{width: 60}}
                      onClick={() => add({})}
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  ) : (
                    <Button
                      style={{width: 60}}
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

      <Button type="primary" style={{marginLeft: 200}} onClick={handleSave}>
        保存
      </Button>
    </Form>
  )
}

export default StrideSetting
