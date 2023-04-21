import {Modal, Form, Input, Button, Select, Radio, Space, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {TYPES} from '../../const'
import fetch from '~/utils/fetch'

export default function BatchConfig(props) {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 16},
  }
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  useEffect(() => {
    if (props.show) {
      form.resetFields()
    }
  }, [props.show])

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      const values = form.getFieldsValue()

      const {groupId, groupName, group} = values
      let object = {
        groupId,
        groupName,
      }
      if (group === 1 && groupId) {
        object.groupName = props.groups.find(
          (v) => v.groupId == groupId,
        ).groupName
      }

      if (group === 2 && groupName) {
        // 添加分组
        try {
          let {
            data: {code, data},
          } = await fetch(
            'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.addgroup',
            [groupName],
          )
          setConfirmLoading(false)
          if (code == 0) {
            object.groupId = data
            props.getGroups()
          }
        } catch (e) {
          setConfirmLoading(false)
        }
      }

      let res = {...values, ...object}
      delete res.group
      Object.keys(res).forEach((key) => {
        if (typeof res[key] === 'undefined') {
          delete res[key]
        }
      })
      props.close(res)
    } catch (e) {
      console.log(e)
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      title="批量配置"
      onCancel={() => props.close()}
      onOk={handleOk}
      visible={props.show}
      centered={true}
    >
      <Form form={form} {...layout} initialValues={{group: 1}}>
        <Form.Item label="类型" name="columnType">
          <Select style={{width: '100%'}}>
            {TYPES.map((v, index) => {
              return (
                <Select.Option value={v.columnType} key={index}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="默认值" name="columnDefaultValue">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="分组" name="group">
          <Radio.Group>
            <Space style={{marginBottom: 20}}>
              <Radio style={radioStyle} value={1}>
                已有分组
              </Radio>
              <Form.Item noStyle name="groupId">
                <Select style={{width: 170}}>
                  {props.groups &&
                    props.groups.map((v, i) => {
                      return (
                        <Select.Option value={v.groupId} key={i}>
                          {v.groupName}
                        </Select.Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Space>

            <Space>
              <Radio style={radioStyle} value={2}>
                新增分组
              </Radio>
              <Form.Item noStyle name="groupName">
                <Input placeholder="请输入" />
              </Form.Item>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="指标中文名" name="nameCn">
          <Input placeholder="请输入" />
        </Form.Item>

        {/* <Form.Item label="描述" name="description">
          <Input placeholder="请输入" />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
