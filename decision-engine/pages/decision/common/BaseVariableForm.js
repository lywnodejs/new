import {Form, Input, Select, Radio, Row, Col} from 'antd'

const types = [
  {name: '整型', code: 'int'},
  {name: '浮点型', code: 'double'},
  {name: '文本', code: 'string'},
  {name: '布尔', code: 'boolean'},
]
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

function BaseVariableForm(props) {
  const {variableForm, groups} = props

  const changeGroup = (val) => {
    variableForm.setFieldsValue('fieldGroupId', val)
  }

  const changeType = (val) => {
    variableForm.setFieldsValue('fieldColumnType', val)
  }

  const changeDefaultValue = (val) => {
    variableForm.setFieldsValue('defaultValue', val)
  }
  return (
    <Form
      key={Date.now}
      form={variableForm}
      name="variableForm"
      initialValues={{
        groupType: '1',
      }}
    >
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
                    rules={[
                      {required: true, message: '请输入分组'},
                      ({getFieldValue}) => ({
                        validator(rule, value) {
                          if (value && value.length > 50) {
                            return Promise.reject(
                              '输入范围大于0字符，小于等于50字符',
                            )
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                )
              }
            }}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="变量名称"
        name="fieldShowName"
        rules={[
          {required: true, message: '请输入变量名称'},
          ({getFieldValue}) => ({
            validator(rule, value) {
              if (value && value.length > 50) {
                return Promise.reject('输入范围大于0字符，小于等于50字符')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label="变量参数"
        name="fieldColumnName"
        rules={[
          {required: true, message: '请输入变量参数'},
          ({getFieldValue}) => ({
            validator(rule, value) {
              if (value && value.length > 50) {
                return Promise.reject('输入范围大于0字符，小于等于50字符')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label="数据类型"
        name="fieldColumnType"
        rules={[{required: true, message: '请选择数据类型'}]}
      >
        <Select onChange={(val) => changeType(val)} style={{width: '200px'}}>
          {types &&
            types.length &&
            types.map((v) => {
              return (
                <Select.Option value={v.code} key={v.code}>
                  {v.name}
                </Select.Option>
              )
            })}
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.fieldColumnType !== currentValues.fieldColumnType
        }
      >
        {({getFieldValue}) => {
          if (getFieldValue('fieldColumnType') == 'boolean') {
            return (
              <Form.Item
                label="默认值\匹配值"
                name="defaultValue"
                rules={[{required: true, message: '请输入'}]}
              >
                <Select
                  style={{width: '160px'}}
                  onChange={(val) => changeDefaultValue(val)}
                >
                  <Select.Option value="true">true</Select.Option>
                  <Select.Option value="false">false</Select.Option>
                </Select>
              </Form.Item>
            )
          } else {
            return (
              <Form.Item
                label="默认值\匹配值"
                name="defaultValue"
                rules={[
                  {required: true, message: '请输入'},
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (value && value.length > 10000) {
                        return Promise.reject(
                          '输入范围大于0字符，小于等于10000字符',
                        )
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input.TextArea placeholder="请输入" />
              </Form.Item>
            )
          }
        }}
      </Form.Item>

      <Form.Item
        label="定义"
        name="remark"
        rules={[
          {required: true, message: '请输入定义'},
          ({getFieldValue}) => ({
            validator(rule, value) {
              if (value && value.length > 50) {
                return Promise.reject('输入范围大于0字符，小于等于50字符')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
    </Form>
  )
}

BaseVariableForm.getInitialProps = async () => ({})

export default BaseVariableForm
