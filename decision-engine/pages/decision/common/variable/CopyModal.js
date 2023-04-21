import {Form, Input, message, Select, Modal, Radio, Row, Col} from 'antd'
import {useEffect} from 'react'
import api from '~/api/risk'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

function CopyVariableModal(props) {
  const {
    visible,
    onHide,
    variableIds,
    pullData,
    groups,
    activeKey,
    activeCategoryKey,
    fetchGroups,
  } = props
  const [copyVariableForm] = Form.useForm()

  useEffect(() => {
    function fetchData() {
      copyVariableForm.resetFields()
    }
    visible && fetchData()
  }, [visible])

  const onEdit = async () => {
    try {
      const values = await copyVariableForm.validateFields()
      if (values.groupType == '0') {
        const {
          data: {data, code},
        } = await api.add_one_group({
          productId: activeKey,
          fieldGroupName: values.fieldGroupName,
          fieldGroupType: activeCategoryKey,
        })
        if (code == 0) {
          const {
            data: {data: moveData, code: moveCode},
          } = await api.move_risk_variable({
            fieldIds: variableIds,
            fieldGroupId: data.id,
          })
          if (moveCode == 0) {
            onHide()
            message.success('保存成功')
            pullData()
            fetchGroups()
          }
        }
      } else {
        const {
          data: {data, code},
        } = await api.move_risk_variable({
          fieldIds: variableIds,
          fieldGroupId: values.fieldGroupId,
        })
        if (code == 0) {
          onHide()
          message.success('保存成功')
          pullData()
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeGroup = (val) => {
    copyVariableForm.setFieldsValue('fieldGroupId', val)
  }

  return (
    <Modal
      title="复制"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={600}
      height={600}
    >
      <Form
        key={Date.now}
        form={copyVariableForm}
        name="copyVariableForm"
        initialValues={{
          groupType: '1',
        }}
      >
        <Row gutter={[0, 16]}>
          <Col span={4}>选中数量：</Col>
          <Col span={20}>
            {Array.isArray(variableIds) ? variableIds.length : 0}
            个，请选择要移入的分组
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              label="分组名称"
              name="groupType"
              rules={[{required: true, message: '请选择分组名称'}]}
            >
              <Radio.Group>
                <Radio value="1" style={radioStyle}>
                  已有分组
                </Radio>
                <Radio value="0" style={radioStyle}>
                  新增分组
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.groupType !== currentValues.groupType
              }
            >
              {({getFieldValue}) => {
                if (getFieldValue('groupType') == '1') {
                  return (
                    <Form.Item
                      name="fieldGroupId"
                      rules={[{required: true, message: '请选择分组'}]}
                    >
                      <Select
                        style={{width: '160px'}}
                        onChange={(val) => changeGroup(val)}
                      >
                        {groups.map((v, i) => (
                          <Select.Option key={i.id} value={v.id}>
                            {v.fieldGroupName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )
                }
                if (getFieldValue('groupType') == '0') {
                  return (
                    <Form.Item
                      name="fieldGroupName"
                      style={{marginTop: '20px'}}
                      rules={[{required: true, message: '请输入分组'}]}
                    >
                      <Input placeholder="请输入" />
                    </Form.Item>
                  )
                }
              }}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CopyVariableModal
