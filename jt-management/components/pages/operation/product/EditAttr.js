import {Form, Input, Modal, Radio, Select, Space} from 'antd'
import {useEffect, useState, forwardRef, useImperativeHandle} from 'react'
// import api from '~/utils/api'

const EditAttr = function (props, ref) {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attrs, setAttrs] = useState([])
  const [sAttrs, setSAttrs] = useState([])
  const [attrList, setAttrList] = useState([])
  const [subAttrList, setSubAttrList] = useState(null)
  const [linkageAttrs, setLinkageAttrs] = useState([])
  const [subLinkageAttrs, setSubLinkageAttrs] = useState([])
  const [attrDict, setAttrDict] = useState([])
  const [contactGroupDict, setContactGroupDict] = useState([])
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (props.attrs) {
      setAttrs(props.attrs)
    }
    // getAttrDict()
    // getContactGroupDict()
  }, [props.attrs])

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setLoading(false)
      if (props.data) {
        form.setFieldsValue(props.data)
        console.log(props.data)
        setIsEdit(true)
        initData()
      } else {
        setIsEdit(false)
      }
      if (Array.isArray(props.linkageAttrs)) {
        setLinkageAttrs([...props.linkageAttrs])
      }
    } else {
      setSAttrs([])
      setAttrList([])
      setSubAttrList(null)
    }
  }, [visible, props.data])

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

  const getAttrDict = async () => {
    let {
      data: {code, data},
    } = await api.getAttrsDict()
    if (code == 0) {
      console.log('getAttrDict', data)
      setAttrDict([...data.attrTypes, ...data.subAttrTypes])
    }
  }

  const getContactGroupDict = async () => {
    let {
      data: {code, data},
    } = await api.getDictMap('CONTACT_GROUP_TYPE')
    if (code == 0) {
      console.log('getContactGroupDict', data)
      setContactGroupDict(data)
    }
  }

  const initData = () => {
    let f_item = attrs.find((v) => v.catId == props.data.catId)
    setSAttrs(f_item.secCatList)
    let s_item = f_item.secCatList.find((v) => v.catId == props.data.subCatId)
    setAttrList(s_item.attrList)
    let a_item = s_item.attrList.find((v) => v.attrId == props.data.attrId)
    setSubAttrList((a_item && a_item.subAttrList) || null)

    if (props.data.linkage == 1) {
      changeLinkAttr(props.data.relationAttrSelect.attrId, props.linkageAttrs)
    }
    setDisabledInfo(props.data)
  }

  const changeFAttr = (attrId) => {
    let item = attrs.find((v) => v.catId == attrId)
    setSAttrs(item.secCatList)
    setAttrList([])
    setSubAttrList(null)
    form.setFieldsValue({
      subCatId: null,
      attrId: null,
      subAttrId: null,
    })
  }

  const changeSAttr = (attrId) => {
    let item = sAttrs.find((v) => v.catId == attrId)
    setAttrList(item.attrList)
    setSubAttrList(null)
    form.setFieldsValue({
      attrId: null,
      subAttrId: null,
    })
  }

  const changeAttr = (attrId) => {
    let item = attrList.find((v) => v.attrId == attrId)
    // console.log('changeAttr', item)
    setSubAttrList(item.subAttrList)
    form.setFieldsValue({
      subAttrId: null,
    })

    // if (!item.subAttrList) {
    setDisabledInfo(item)
    // }
  }

  const changeSubAttr = (attrId) => {
    let item = subAttrList.find((v) => v.attrId == attrId)
    setDisabledInfo(item)
  }

  const setDisabledInfo = (item) => {
    let {attrType, selectList, modelValidate, errorMsg, description} = item
    // console.log('setDisabledInfo', item)
    let params = {
      attrType,
      selectList,
      modelValidate,
      errorMsg,
      description,
      attrTypeName: null,
    }
    if (attrType) {
      let item = attrDict.find((v) => v.code == attrType)
      params.attrTypeName = (item && item.name) || ''
    }
    if (attrType == 'contact' && !props.data) {
      params.contactRelationCode =
        Array.isArray(contactGroupDict) && contactGroupDict.length > 0
          ? contactGroupDict[0].value
          : ''
    }
    // console.log('params', params)
    form.setFieldsValue(params)
  }

  const changeLinkAttr = (attrId, arr = linkageAttrs) => {
    let item = arr.find((v) => v.attrId == attrId)
    let subAttr = []
    if (item.selectValue && Array.isArray(JSON.parse(item.selectValue))) {
      subAttr = JSON.parse(item.selectValue)
    }
    setSubLinkageAttrs(subAttr)
  }

  const changeLinkage = () => {
    form.setFieldsValue({
      relationAttrDTO: [{attrId: null, value: null}],
    })
  }

  const onOk = () => {
    form.validateFields().then((values) => {
      // setLoading(true)
      const {
        attrId,
        subAttrId,
        fillAttribute,
        relationAttrDTO,
        contactRelationCode,
        ...obj
      } = values
      let result = {attrId, fillAttribute}
      if (subAttrId) {
        result.subAttrId = subAttrId
      }
      if (contactRelationCode) {
        result.contactRelationCode = contactRelationCode
      }
      if (Array.isArray(relationAttrDTO)) {
        result.relationAttrDTO = relationAttrDTO[0]
      }
      props.setAttrData(result)
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
          relationAttrDTO: [{attrId: null, value: null}],
        }}
        name="edit"
      >
        <Form.Item required label="所属类目" style={{marginBottom: 0}}>
          <Space size={20}>
            <Form.Item
              name="catId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeFAttr}
                style={{width: 180}}
                placeholder="请选择"
                disabled={isEdit}
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
              name="subCatId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeSAttr}
                style={{width: 180}}
                placeholder="请选择"
                disabled={isEdit}
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
          </Space>
        </Form.Item>

        <Form.Item label="属性名称" required style={{marginBottom: 0}}>
          <Space size={20}>
            <Form.Item
              name="attrId"
              rules={[{required: true, message: '请选择'}]}
            >
              <Select
                onChange={changeAttr}
                style={{width: 180}}
                placeholder="请选择"
                disabled={isEdit}
              >
                {attrList.map((v, i) => {
                  return (
                    <Select.Option value={v.attrId} key={i}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            {Array.isArray(subAttrList) ? (
              <Form.Item
                name="subAttrId"
                onChange={changeSubAttr}
                rules={[{required: true, message: '请选择'}]}
              >
                <Select
                  style={{width: 180}}
                  placeholder="请选择"
                  disabled={isEdit}
                >
                  {subAttrList.map((v, i) => {
                    return (
                      <Select.Option value={v.attrId} key={i}>
                        {v.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            ) : null}
          </Space>
        </Form.Item>
        {/* 属性类型、枚举值、条件校验、错误提示、文案说明 */}
        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('attrType') ? (
              <Form.Item label="属性类型" name="attrTypeName">
                <Input style={{width: 180}} disabled />
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('attrType') == 'contact' ? (
              <Form.Item
                rules={[{required: true, message: '请选择'}]}
                label="联系人分类"
                name="contactRelationCode"
              >
                <Select style={{width: 180}} placeholder="请选择">
                  {contactGroupDict.map((v, i) => {
                    return (
                      <Select.Option value={v.value} key={i}>
                        {v.valueName}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('selectList') ? (
              <Form.Item label="枚举值" style={{marginBottom: 15}}>
                <Form.List name="selectList">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => {
                        return (
                          <Form.Item {...field}>
                            <Input disabled style={{width: 180}} />
                          </Form.Item>
                        )
                      })}
                    </>
                  )}
                </Form.List>
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('modelValidate') ? (
              <Form.Item label="条件校验" style={{marginBottom: 0}}>
                <Space>
                  <Form.Item name={['modelValidate', 'typeName']}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name={['modelValidate', 'operate']}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name={['modelValidate', 'value']}>
                    <Input disabled />
                  </Form.Item>
                </Space>
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('errorMsg') ? (
              <Form.Item label="错误提示" name="errorMsg">
                <Input disabled />
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({getFieldValue}) => {
            return getFieldValue('description') ? (
              <Form.Item label="文案说明" name="description">
                <Input.TextArea rows={4} disabled />
              </Form.Item>
            ) : null
          }}
        </Form.Item>

        <Form.Item
          label="是否必填"
          name="fillAttribute"
          rules={[{required: true, message: '请选择'}]}
        >
          <Select style={{width: 180}} placeholder="请选择">
            <Select.Option value="must">是</Select.Option>
            <Select.Option value="optional">否</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="是否要添加联动条件" name="linkage">
          <Radio.Group onChange={changeLinkage}>
            <Radio value={0}>否</Radio>
            <Radio value={1}>
              是
              <Form.Item
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.linkage !== curValues.linkage
                }
                noStyle
              >
                {(v) => {
                  const linkage = v.getFieldValue('linkage')
                  return linkage == 1 ? (
                    <span>（当满足以下条件时，属性展示且必填）</span>
                  ) : null
                }}
              </Form.Item>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          wrapperCol={{offset: 6}}
          shouldUpdate={(prevValues, curValues) =>
            prevValues.linkage !== curValues.linkage
          }
        >
          {(v) => {
            const linkage = v.getFieldValue('linkage')
            return linkage == 1 ? (
              <Form.List name="relationAttrDTO">
                {(fields) =>
                  fields.map((field) => {
                    return (
                      <Space size={10} key={field.key}>
                        <Form.Item
                          {...field}
                          rules={[{required: true, message: '请选择'}]}
                          name={[field.name, 'attrId']}
                          fieldKey={[field.fieldKey, 'attrId']}
                        >
                          <Select
                            onChange={(id) => changeLinkAttr(id)}
                            style={{width: 180}}
                            placeholder="请选择"
                          >
                            {linkageAttrs.map((v, i) => {
                              return (
                                <Select.Option value={v.attrId} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <div style={{marginBottom: 24}}>=</div>

                        <Form.Item
                          {...field}
                          rules={[{required: true, message: '请选择'}]}
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value']}
                        >
                          <Select style={{width: 180}} placeholder="请选择">
                            {subLinkageAttrs.map((v, i) => {
                              return (
                                <Select.Option value={v.value} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>
                      </Space>
                    )
                  })
                }
              </Form.List>
            ) : null
          }}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(EditAttr)
