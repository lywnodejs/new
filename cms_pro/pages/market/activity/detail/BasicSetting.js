import React, {useEffect, useState} from 'react'
import {Form, Input, DatePicker, Modal, Avatar, Card} from 'antd'
import UploadImage from './UploadImg'
import api from '~/utils/api'

const BasicSetting = ({basicForm}) => {
  const uploadIcon = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        basicForm.setFieldsValue({appShareTemplateImage: data})
      }
    })
  }

  const uploadIcon1 = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        basicForm.setFieldsValue({shareLogo: data})
      }
    })
  }

  return (
    <Form form={basicForm}>
      <Form.Item
        label="活动名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入活动名称',
          },
        ]}
      >
        <Input style={{width: 400}} />
      </Form.Item>
      <Form.Item
        label="开始时间"
        name="startTime"
        rules={[
          {
            required: true,
            message: '请选择开始时间',
          },
        ]}
      >
        <DatePicker style={{width: 400}} showTime />
      </Form.Item>
      <Form.Item
        label="结束时间"
        name="endTime"
        rules={[
          {
            required: true,
            message: '请选择结束时间',
          },
        ]}
      >
        <DatePicker style={{width: 400}} showTime />
      </Form.Item>
      <Form.Item
        label="活动规则"
        name="rule"
        rules={[
          {
            required: true,
            message: '请输入活动规则',
          },
        ]}
      >
        <Input.TextArea
          autoSize={{minRows: 2, maxRows: 6}}
          style={{width: 400}}
        />
      </Form.Item>
      <Form.Item label="APP分享图" name="appShareTemplateImage">
        <UploadImage onChange={(base64) => uploadIcon(base64)} />
      </Form.Item>

      <Form.Item label="小程序分享标题" name="shareTitle">
        <Input style={{width: 400}} />
      </Form.Item>

      <Form.Item label="小程序分享图" name="shareLogo">
        <UploadImage onChange={(base64) => uploadIcon1(base64)} />
      </Form.Item>
    </Form>
  )
}

export default BasicSetting
