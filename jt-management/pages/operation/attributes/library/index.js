import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import fetch from '~/utils/fetch'
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
import EditAttr from '~/components/pages/operation/attributes/library/EditAttr'
// import api from '~/utils/api'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getAttrsData = async () => {
  let {
    data: {code, data},
  } = await api.getAttrsCategory({productId: -1})
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

const breadcrumbs = [{text: '运营配置'}, {text: '属性库管理'}]

function body(props) {
  const [data, setData] = useState(props.data)
  const [editData, setEditData] = useState(null)
  const [searchParams, setSearchParams] = useState({})

  const [attrs, setAttrs] = useState(props.attrs)
  const [sAttrs, setSAttrs] = useState([])
  const [attrList, setAttrList] = useState([])

  const EditEl = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    // getData()
    // EditEl.current.changeVisible(true)
    console.log(props.attrs)
  }, [])

  const columns = [
    {title: '一级分类', dataIndex: 'firCatName'},
    {title: '二级分类', dataIndex: 'secCatName'},
    {title: '属性名称', dataIndex: 'attrName'},
    {title: '子属性名称', dataIndex: 'subAttrName'},
    {title: '属性类型', dataIndex: 'attrType'},
    // {
    //   title: '是否必填',
    //   dataIndex: 'fillAttribute',
    //   render: (t) => {
    //     return t == 'must' ? '是' : '否'
    //   },
    // },
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(r)}>
              编辑
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

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

  const onSearch = () => {
    let params = form.getFieldsValue()
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const onChangePage = (pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  const onEdit = (r) => {
    if (r == -1) {
      setEditData(null)
      EditEl.current.changeVisible(true)
    } else {
      api
        .getAttrDetail({productId: -1, attrId: r.attrId})
        .then(({data: {code, data}}) => {
          console.log(code, data)
          if (code == 0) {
            let item = {
              ...data,
              firCatId: +data.firCatId,
              secCatId: +data.secCatId,
              parentAttrId: data.subAttrId || -1,
              name: data.attrName,
            }
            if (data.modelValidate) {
              item.validateDTO = {
                ...data.modelValidate,
              }
            }
            setEditData(item)
            EditEl.current.changeVisible(true)
          }
        })
    }
  }

  const setAttrData = async ({...attrData}) => {
    if (editData) {
      attrData.id = editData.id
    }
    let {
      data: {code, data},
    } = await api.changeLibAttr(attrData)
    if (code == 0) {
      message.success('编辑成功')
      setEditData(null)
      onChangePage(1)
      EditEl.current.cancelModal(false)
    } else {
      EditEl.current.changeLoading(false)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
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
        dataSource={data.list}
      />

      <EditAttr
        setAttrData={setAttrData}
        attrs={props.attrs}
        ref={EditEl}
        data={editData}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  // let attrs = await getAttrsData()
  // let data = await getData()
  return {
    attrs: [],
    data: {},
  }
}

export default body
