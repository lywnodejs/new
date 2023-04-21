import {Form, Input, Modal, Radio, Select, Space, Button} from 'antd'
import {useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {ATTR_LIST, CHILD_ATTR_LIST} from '~/utils/const'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
// import api from '~/utils/api'

const EditAttr = function (props, ref) {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attrs, setAttrs] = useState([])
  const [sAttrs, setSAttrs] = useState([])
  const [attrList, setAttrList] = useState([])
  const [sAttr, setSAttr] = useState(-1)
  const [showAttrs, setShowAttrs] = useState([])
  const [selectAttrs, setSelectAttrs] = useState({})
  const [validateList, setValidateList] = useState([])
  const [operateList, setOperateList] = useState([])
  useEffect(() => {
    if (visible) {
      form.resetFields()
      setAttrs([...props.attrs])
      if (props.data) {
        form.setFieldsValue(props.data)
        initData()
      }
    }
  }, [visible, props.data])

  useEffect(() => {
    // getAttrsDict()
    // getValidateList()
  }, [])

  useImperativeHandle(ref, () => ({
    changeVisible: (visible) => {
      setVisible(visible)
    },
    changeLoading: (loading) => {
      setLoading(loading)
    },
    cancelModal: () => {
      setLoading(false)
      setVisible(false)
    },
  }))

  const initData = () => {
    let f_item = props.attrs.find((v) => v.catId == props.data.firCatId)
    setSAttrs(f_item.secCatList)
    let s_item = f_item.secCatList.find((v) => v.catId == props.data.secCatId)
    setAttrList(s_item.attrList)

    if (props.data.modelValidate) {
      changeValidate(props.data.modelValidate.type)
    }

    // let a_item = s_item.attrList.find((v) => v.attrId == props.data.attrId)
    // setSubAttrList((a_item && a_item.attrList) || null)
  }

  const getAttrsDict = async () => {
    let {
      data: {code, data},
    } = await api.getAttrsDict()
    if (code == 0) {
      setSelectAttrs(data)
      setShowAttrs(data.attrTypes)
    }
  }

  const getValidateList = async () => {
    let {
      data: {code, data},
    } = await api.getValidateList()
    if (code == 0) {
      setValidateList(data)
    }
  }

  const changeFAttr = (attrId) => {
    let item = attrs.find((v) => v.catId == attrId)
    setSAttrs(item.secCatList)
    setAttrList([])
    form.setFieldsValue({
      secCatId: null,
      parentAttrId: null,
    })
  }

  const changeSAttr = (attrId) => {
    let item = sAttrs.find((v) => v.catId == attrId)
    setAttrList(item.attrList)
    form.setFieldsValue({
      parentAttrId: null,
    })
  }

  const changeAttr = (attrId) => {
    const tempAttrTypes =
      attrId == -1 ? [...selectAttrs.attrTypes] : [...selectAttrs.subAttrTypes]
    setShowAttrs(tempAttrTypes)
    setSAttr(attrId)
    const attrType = form.getFieldValue('attrType')
    let item = tempAttrTypes.find((v) => v.code == attrType)
    if (!item) {
      form.setFieldsValue({attrType: null})
    }
  }

  const changeAttrType = (e) => {
    form.setFieldsValue({
      textType: e == 'text' ? 1 : null,
      selectList: e == 'enum' ? [null, null] : null,
    })
  }

  const changeValidate = (key) => {
    let item = validateList.find((v) => v.type == key)
    setOperateList(item.operatorList)
    form.setFieldsValue({
      validateDTO: {
        typeName: item.typeName,
      },
    })
  }

  const onOk = () => {
    form.validateFields().then(({parentAttrId, ...values}) => {
      setLoading(true)
      if (parentAttrId != -1) {
        values.parentAttrId = parentAttrId
      }
      props.setAttrData(values)
    })
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }

  return (
    <Modal
      width={650}
      visible={visible}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={() => setVisible(false)}
      title={props.data ? '编辑属性' : '添加属性'}
    >
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{
          linkage: 0,
          parentAttrId: null,
          textType: null,
        }}
        name="edit"
      >
        <Form.Item required label="所属类目" style={{marginBottom: 0}}>
          <Space size={20}>
            <Form.Item
              name="firCatId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeFAttr}
                style={{width: 120}}
                placeholder="请选择"
              >
                {attrs.map((v, i) => {
                  return (
                    <Select.Option value={v.catId} key={i}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="secCatId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeSAttr}
                style={{width: 120}}
                placeholder="请选择"
              >
                {sAttrs.map((v, i) => {
                  return (
                    <Select.Option value={v.catId} key={i}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="parentAttrId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeAttr}
                style={{width: 120}}
                placeholder="请选择"
              >
                <Select.Option value={-1}>无</Select.Option>
                {attrList.map((v, i) => {
                  return (
                    <Select.Option value={v.attrId} key={i}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item
          label={sAttr == -1 ? '属性' : '子属性'}
          name="name"
          rules={[{required: true, message: '请输入'}]}
        >
          <Input style={{width: '50%'}} placeholder="请输入属性名称" />
        </Form.Item>

        <Form.Item
          label="属性类型"
          rules={[{required: true, message: '请选择属性类型'}]}
          name="attrType"
        >
          <Select
            onChange={changeAttrType}
            style={{width: '50%'}}
            placeholder="请选择"
          >
            {showAttrs.map((v, i) => {
              return (
                <Select.Option value={v.code} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.attrType !== curValues.attrType
          }
        >
          {({getFieldValue}) => {
            const attrType = getFieldValue('attrType')
            let ELE = null
            if (attrType == 'text') {
              ELE = (
                <Form.Item label="文本类型" name="textType">
                  <Select
                    // onChange={changeSAttr}
                    style={{width: 100}}
                    placeholder="请选择"
                  >
                    <Select.Option value={1}>单行</Select.Option>
                    <Select.Option value={2}>多行</Select.Option>
                  </Select>
                </Form.Item>
              )
            }

            if (attrType == 'enum') {
              ELE = (
                <Form.Item label="枚举值" required style={{marginBottom: 15}}>
                  <Form.List
                    rules={[{required: true, message: '枚举值不可为空'}]}
                    name="selectList"
                  >
                    {(fields, {add, remove}, {errors}) => (
                      <>
                        <Button
                          style={{marginBottom: 24}}
                          onClick={() => add()}
                          type="primary"
                          icon={<PlusOutlined />}
                        />

                        {fields.map((field, index) => {
                          return (
                            <Form.Item
                              style={{marginBottom: 0}}
                              key={field.key}
                            >
                              <Space size={10}>
                                <Form.Item
                                  {...field}
                                  rules={[{required: true, message: '请输入'}]}
                                  // fieldKey={field.fieldKey}
                                >
                                  <Input />
                                </Form.Item>
                                <Button
                                  style={{marginBottom: 24}}
                                  onClick={() => remove(field.name)}
                                  type="primary"
                                  danger
                                  icon={<MinusOutlined />}
                                />
                              </Space>
                            </Form.Item>
                          )
                        })}

                        <Form.ErrorList errors={errors} />
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              )
            }
            return ELE
          }}
        </Form.Item>

        <Form.Item label="条件校验" style={{marginBottom: 0}}>
          <Space>
            <Form.Item name={['validateDTO', 'type']}>
              <Select
                onChange={changeValidate}
                style={{width: 100}}
                placeholder="请选择"
              >
                {validateList.map((v, i) => {
                  return (
                    <Select.Option value={v.type} key={i}>
                      {v.typeName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={['validateDTO', 'typeName']} hidden>
              <Select style={{width: 100}} placeholder="请选择">
                {validateList.map((v, i) => {
                  return (
                    <Select.Option value={v.type} key={i}>
                      {v.typeName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={['validateDTO', 'operate']}>
              <Select style={{width: 100}} placeholder="请选择">
                {operateList.map((v, i) => {
                  return (
                    <Select.Option value={v.operate} key={i}>
                      {v.operateName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={['validateDTO', 'value']}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item label="错误提示" name="errorMsg">
          <Input placeholder="请输入错误提示" />
        </Form.Item>

        <Form.Item label="文案说明" name="description">
          <Input.TextArea rows={4} placeholder="请输入文案说明" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(EditAttr)
