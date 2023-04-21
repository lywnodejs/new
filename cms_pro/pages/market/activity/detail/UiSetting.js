import React, {useEffect, useState} from 'react'
import {Form, Tag, Input, Space, Upload} from 'antd'
import UploadImage from './UploadImg'
import api from '~/utils/api'
import {SP} from 'next/dist/next-server/lib/utils'

const UiSetting = ({uiForm, changeColor, colors}) => {
  const uploadIcon = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({headImage: data})
      }
    })
  }

  //背景图
  const uploadBg = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({bgImage: data})
      }
    })
  }

  //轮盘背景图
  const uploadBgWheel = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({wheelBgImage: data})
      }
    })
  }

  //抽奖按钮图
  const uploadBgWheelButton = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({wheelButton: data})
      }
    })
  }

  //分享按钮图
  const uploadShareButton = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({shareButton: data})
      }
    })
  }

  const updateLoan = async (base64) => {
    api.ImgUpload(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        uiForm.setFieldsValue({loanButton: data})
      }
    })
  }

  return (
    <Form form={uiForm} style={{position: 'relative'}}>
      <Form.Item
        label="头图"
        name="headImage"
        rules={[{required: true, message: '请上传头图'}]}
      >
        <UploadImage onChange={(base64) => uploadIcon(base64)} />
      </Form.Item>

      <Form.Item
        label="背景"
        name="bgImage"
        rules={[{required: true, message: '请上传背景'}]}
      >
        <UploadImage onChange={(base64) => uploadBg(base64)} />
      </Form.Item>

      <Form.Item
        label="转盘背景图"
        name="wheelBgImage"
        rules={[{required: true, message: '请上传转盘背景图'}]}
      >
        <UploadImage onChange={(base64) => uploadBgWheel(base64)} />
      </Form.Item>

      <Form.Item label="抽奖按钮" name="wheelButton">
        <UploadImage onChange={(base64) => uploadBgWheelButton(base64)} />
      </Form.Item>

      <div>
        <Space>
          <Form.Item
            label="抽奖次数背景色值"
            name="wheelCountBg"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('wheelCountBg', e.target.value)}
            />
          </Form.Item>
          {colors.wheelCountBg && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.wheelCountBg == 'error' ? 'red' : colors.wheelCountBg
              }
            >
              {colors.wheelCountBg == 'error'
                ? '颜色错误'
                : colors.wheelCountBg}
            </Tag>
          )}
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            label="抽奖次数文字色值"
            name="wheelCountTextColor"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) =>
                changeColor('wheelCountTextColor', e.target.value)
              }
            />
          </Form.Item>
          {colors.wheelCountTextColor && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.wheelCountTextColor == 'error'
                  ? 'red'
                  : colors.wheelCountTextColor
              }
            >
              {colors.wheelCountTextColor == 'error'
                ? '颜色错误'
                : colors.wheelCountTextColor}
            </Tag>
          )}
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            label="抽奖次数数字色值"
            name="wheelCountNumColor"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) =>
                changeColor('wheelCountNumColor', e.target.value)
              }
            />
          </Form.Item>
          {colors.wheelCountNumColor && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.wheelCountNumColor == 'error'
                  ? 'red'
                  : colors.wheelCountNumColor
              }
            >
              {colors.wheelCountNumColor == 'error'
                ? '颜色错误'
                : colors.wheelCountNumColor}
            </Tag>
          )}
        </Space>
      </div>

      <Form.Item label="抽奖次数说明色值">
        <Space>
          <Form.Item name="wheelCountIntroColor" noStyle>
            <Input
              style={{width: 400}}
              onChange={(e) =>
                changeColor('wheelCountIntroColor', e.target.value)
              }
            />
          </Form.Item>
          {colors.wheelCountIntroColor && (
            <Tag
              color={
                colors.wheelCountIntroColor == 'error'
                  ? 'red'
                  : colors.wheelCountIntroColor
              }
            >
              {colors.wheelCountIntroColor == 'error'
                ? '颜色错误'
                : colors.wheelCountIntroColor}
            </Tag>
          )}
        </Space>
      </Form.Item>

      <Form.Item label="分享按钮" name="shareButton">
        <UploadImage onChange={(base64) => uploadShareButton(base64)} />
      </Form.Item>

      <Form.Item label="申请贷款按钮" name="loanButton">
        <UploadImage onChange={(base64) => updateLoan(base64)} />
      </Form.Item>

      <Form.Item label="中奖播报文字色值">
        <Space>
          <Form.Item name="prizeListTextColor" noStyle>
            <Input
              style={{width: 400}}
              onChange={(e) =>
                changeColor('prizeListTextColor', e.target.value)
              }
            />
          </Form.Item>
          {colors.prizeListTextColor && (
            <Tag
              color={
                colors.prizeListTextColor == 'error'
                  ? 'red'
                  : colors.prizeListTextColor
              }
            >
              {colors.prizeListTextColor == 'error'
                ? '颜色错误'
                : colors.prizeListTextColor}
            </Tag>
          )}
        </Space>
      </Form.Item>

      <div>
        <Space>
          <Form.Item
            label="我的奖品文字色值"
            name="myPrizeTextColor"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('myPrizeTextColor', e.target.value)}
            />
          </Form.Item>
          {colors.myPrizeTextColor && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.myPrizeTextColor == 'error'
                  ? 'red'
                  : colors.myPrizeTextColor
              }
            >
              {colors.myPrizeTextColor == 'error'
                ? '颜色错误'
                : colors.myPrizeTextColor}
            </Tag>
          )}
        </Space>
      </div>

      <Form.Item
        label="中奖弹窗标题"
        name="dialogTitle"
        rules={[{required: true, message: '请输入'}]}
      >
        <Input style={{width: 400}} />
      </Form.Item>

      <div>
        <Space>
          <Form.Item
            label="中奖弹窗底色"
            name="dialogBgColor"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('dialogBgColor', e.target.value)}
            />
          </Form.Item>
          {colors.dialogBgColor && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.dialogBgColor == 'error' ? 'red' : colors.dialogBgColor
              }
            >
              {colors.dialogBgColor == 'error'
                ? '颜色错误'
                : colors.dialogBgColor}
            </Tag>
          )}
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            label="中奖弹窗按钮色值"
            name="dialogButtonStyle"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('dialogButtonStyle', e.target.value)}
            />
          </Form.Item>
          {colors.dialogButtonStyle && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.dialogButtonStyle == 'error'
                  ? 'red'
                  : colors.dialogButtonStyle
              }
            >
              {colors.dialogButtonStyle == 'error'
                ? '颜色错误'
                : colors.dialogButtonStyle}
            </Tag>
          )}
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            label="中奖弹窗文字色值"
            name="dialogTextColor"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('dialogTextColor', e.target.value)}
            />
          </Form.Item>
          {colors.dialogTextColor && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.dialogTextColor == 'error'
                  ? 'red'
                  : colors.dialogTextColor
              }
            >
              {colors.dialogTextColor == 'error'
                ? '颜色错误'
                : colors.dialogTextColor}
            </Tag>
          )}
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            label="中奖弹窗按钮文字色值"
            name="dialogModalText"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input
              style={{width: 400}}
              onChange={(e) => changeColor('dialogModalText', e.target.value)}
            />
          </Form.Item>
          {colors.dialogModalText && (
            <Tag
              style={{marginBottom: 20}}
              color={
                colors.dialogModalText == 'error'
                  ? 'red'
                  : colors.dialogModalText
              }
            >
              {colors.dialogModalText == 'error'
                ? '颜色错误'
                : colors.dialogModalText}
            </Tag>
          )}
        </Space>
      </div>
    </Form>
  )
}

export default UiSetting
