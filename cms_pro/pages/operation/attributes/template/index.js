import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useRef} from 'react'
import {
  Button,
  Table,
  Space,
  Modal,
  message,
  Form,
  Radio,
  Input,
  Card,
  Select,
} from 'antd'
import Router from 'next/router'
import {CloseCircleOutlined} from '@ant-design/icons'
import EditAttr from '~/components/pages/operation/product/EditAttr'
import api from '~/utils/api'

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}
const getAttrsData = async (productType) => {
  let {
    data: {code, data},
  } = await api.getAttrsCategory({productId: -1})
  if (code == 0) {
    return data
  }
  return []
}

const getProductType = async () => {
  let {
    data: {code, data},
  } = await api.getDictMap('PRODUCT_TYPE')
  if (code == 0) {
    return data
  }
  return []
}

const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getAttrLib(params)
  if (code == 0) {
    return data
  }
  return []
}

const breadcrumbs = [{text: '运营配置'}, {text: '属性模板管理'}]

function body(props) {
  const [data, setData] = useState(null)
  const [selectTemp, setSelectTemp] = useState(0)

  const [attrs, setAttrs] = useState([])
  const [sAttrs, setSAttrs] = useState([])
  const [attrList, setAttrList] = useState([])
  const [linkage, setLinkage] = useState(null)

  const [editData, setEditData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const EditEl = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    changeTemp(0)
    // initData(props.PRODUCT_TYPE[0])
    // getAttrs(props.PRODUCT_TYPE[0])
    // getLinkage(props.PRODUCT_TYPE[0])
  }, [])

  const columns = [
    {title: '一级分类', dataIndex: 'firCatName'},
    {title: '二级分类', dataIndex: 'secCatName'},
    {title: '属性名称', dataIndex: 'attrName'},
    {title: '子属性名称', dataIndex: 'subAttrName'},
    {title: '属性类型', dataIndex: 'attrType'},
    {
      title: '是否必填',
      dataIndex: 'fillAttribute',
      render: (t) => {
        return t == 'must' ? '是' : '否'
      },
    },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(r)}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => deleteItem(r, i)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const getAttrs = async (template) => {
    let attrs = await getAttrsData(template.value)
    setAttrs(attrs)
  }

  const getLinkage = async (template) => {
    let {
      data: {code, data},
    } = await api.getLinkageByProType(template.value)
    if (code == 0) {
      setLinkage(data)
    }
  }

  const changeFAttr = (attrId) => {
    let item = attrs.find((v) => v.catId == attrId)
    setSAttrs((item && item.secCatList) || [])
    setAttrList([])
    form.setFieldsValue({
      subCatId: null,
      attrName: null,
    })
  }

  const changeSAttr = (attrId) => {
    let item = sAttrs.find((v) => v.catId == attrId)
    setAttrList((item && item.attrList) || [])
    form.setFieldsValue({
      attrName: null,
    })
  }

  const initData = async (template) => {
    pageParams.pageNo = 1
    let data = await getData({productType: template.value, ...pageParams})
    setData(data)
  }

  const onSearch = () => {
    let params = form.getFieldsValue()
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const changeTemp = (i) => {
    setSelectTemp(i)
    form.resetFields()
    initData(props.PRODUCT_TYPE[i])
    getLinkage(props.PRODUCT_TYPE[i])
    getAttrs(props.PRODUCT_TYPE[i])
  }

  const updateList = async (params) => {
    let temp = props.PRODUCT_TYPE[selectTemp]
    params.productType = temp.value
    let data = await getData(params)
    setData(data)
  }

  const onChangePage = (pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const setAttrData = async ({relationAttrDTO, ...attrData}) => {
    let params = {
      ...attrData,
      productType: props.PRODUCT_TYPE[selectTemp].value,
    }
    if (editData) {
      params.id = editData.id
    }
    if (relationAttrDTO) {
      params.modelRelationAttrDTO = relationAttrDTO
    }
    let {
      data: {code, data},
    } = await api.changeTemplateAttr(params)
    if (code == 0) {
      message.success('编辑成功')
      setEditData(null)
      onChangePage(editData ? pageParams.pageNo : 1)
      EditEl.current.cancelModal(false)
    } else {
      EditEl.current.changeLoading(false)
    }
  }

  const paginationConfig = {
    total: (data && data.totalSize) || 0,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  const deleteItem = (r, i) => {
    Modal.confirm({
      icon: <CloseCircleOutlined style={{color: '#ff4d4f'}} />,
      content: '请确认是否删除该属性？若该属性下包含联动属性，将一并删除。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        api.deleteTemplateAttr(r.id).then(({data: {code}}) => {
          if (code == 0) {
            let n_data = {...data}
            n_data.list.splice(i, 1)
            setData({...n_data})
          }
        })
      },
    })
  }

  const onEdit = (r) => {
    if (r == -1) {
      setEditData(null)
      EditEl.current.changeVisible(true)
    } else {
      let params = {
        productId: 0,
        attrId: r.attrId,
        productType: props.PRODUCT_TYPE[selectTemp].value,
      }
      api.getAttrDetail(params).then(({data: {code, data}}) => {
        console.log(code, data)
        if (code == 0) {
          let item = {
            ...data,
            catId: +data.firCatId,
            subCatId: +data.secCatId,
            linkage: !data.relationAttrSelect ? 0 : 1,
          }
          if (data.relationAttrSelect) {
            item.relationAttrDTO = [
              {
                ...data.relationAttrSelect,
                value: data.relationAttrSelect.selectValue,
              },
            ]
          }
          setEditData(item)
          EditEl.current.changeVisible(true)
        }
      })
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card style={{marginBottom: 30}}>
        <Space>
          <span>模板名称：</span>
          {props.PRODUCT_TYPE.map((v, i) => {
            return (
              <Button
                onClick={() => changeTemp(i)}
                ghost={i == selectTemp}
                type={i == selectTemp ? 'primary' : 'text'}
                key={i}
              >
                {v.valueName}
              </Button>
            )
          })}
        </Space>
      </Card>

      <Form
        name="search"
        form={form}
        initialValues={{
          firCatId: null,
          secCatId: null,
          attrName: null,
        }}
        layout="inline"
        style={{marginBottom: 20}}
      >
        <Form.Item name="firCatId" label="一级分类">
          <Select
            onChange={changeFAttr}
            style={{width: 120}}
            placeholder="请选择"
          >
            <Select.Option value={null}>全部</Select.Option>
            {attrs.map((v, i) => {
              return (
                <Select.Option value={v.catId} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item name="secCatId" label="二级分类">
          <Select
            onChange={changeSAttr}
            style={{width: 120}}
            placeholder="请选择"
          >
            <Select.Option value={null}>全部</Select.Option>
            {sAttrs.map((v, i) => {
              return (
                <Select.Option value={v.catId} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item name="attrName" label="属性名称">
          <Select style={{width: 120}} placeholder="请选择">
            <Select.Option value={null}>全部</Select.Option>
            {attrList.map((v, i) => {
              return (
                <Select.Option value={v.name} key={i}>
                  {v.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => onSearch()}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => onEdit(-1)}>
            新增属性
          </Button>
        </Form.Item>
      </Form>

      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={(data && data.list) || []}
      />

      <EditAttr
        attrs={attrs}
        setAttrData={setAttrData}
        ref={EditEl}
        linkageAttrs={linkage}
        data={editData}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let PRODUCT_TYPE = await getProductType()
  return {PRODUCT_TYPE}
}

export default body
