import {Modal, Form, Input, message, Select, Radio, Space} from 'antd'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'

export default function GroupConfig(props) {
  const [form] = Form.useForm()
  const [groups, setGroups] = useState()
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

  useEffect(() => {
    if (props.groups) {
      setGroups(props.groups)
    }
  }, [props.groups])

  const handleOk = async () => {
    const {groupId, groupName, group} = form.getFieldsValue()
    let addSuccess = true
    if ((group === 1 && !groupId) || (group === 2 && !groupName)) {
      return message.error('请选择分组或输入新的分组名称创建分组')
    }

    let object = {
      groupId,
      groupName,
    }

    if (group === 1) {
      object.groupName = groups.find((v) => v.groupId == groupId).groupName
    }

    if (group === 2) {
      // 添加分组
      setConfirmLoading(true)
      try {
        let {
          data: {code, data},
        } = await fetch(
          'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.addgroup',
          [groupName],
        )
        setConfirmLoading(false)
        if (code == 0) {
          object.type = 'add'
          object.groupId = data
        } else {
          addSuccess = false
        }
      } catch (e) {
        addSuccess = false
        setConfirmLoading(false)
      }
    }

    if (addSuccess) {
      console.log('object:', object)
      props.close(object)
    }
  }

  return (
    <Modal
      title="分组配置"
      destroyOnClose
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => props.close()}
      visible={props.show}
      centered={true}
    >
      <Form form={form} {...layout} initialValues={{group: 1}}>
        <Form.Item label="分组" name="group">
          <Radio.Group>
            <Space style={{marginBottom: 20}}>
              <Radio style={radioStyle} value={1}>
                已有分组
              </Radio>
              <Form.Item noStyle name="groupId">
                <Select style={{width: 170}}>
                  {groups &&
                    groups.map((v, i) => {
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
      </Form>
    </Modal>
  )
}
