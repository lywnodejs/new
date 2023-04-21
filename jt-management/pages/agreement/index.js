import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Input, Select, Tabs, Modal} from 'antd'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import api from '~/api/agreement'

import AgreementForm from './AgreementForm'
import TableList from './TableList'
const {TabPane} = Tabs

import {base64ToFileOrBlob} from 'web-downloadfile'

const breadcrumbs = [{text: '协议管理'}, {text: '协议列表'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [showPages, setShowPages] = useState([])
  const [allPages, setAllPages] = useState([])
  const [statusList, setStatusList] = useState([])
  const [productList, setProductList] = useState([])
  const [agreementIds, setAgreementIds] = useState([])
  const [appTypes, setAppTypes] = useState([])
  const [tempData, setTempData] = useState([])
  const [signNode, setSignNode] = useState([])

  useEffect(() => {
    function fetchData() {
      fetchProductList()
      fetchAppType()
      fetchAllPages()
      fetchStatusList()
      getTempData()
      getSignNode()
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        form.resetFields()
        onSearch({})
      }
    }
    fetchData()
  }, [activeKey])

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products({tenantId: cookies.tenantId})
      if (code == 0) {
        setProductList(data)
        data && data.length && setActiveKey(String(data[0].id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取模板列表
  const getTempData = async () => {
    let {
      data: {code, data},
    } = await api.getEnableTemplateList({route: null})
    if (code == 0) {
      setTempData(data || [])
    }
  }

  // 获取应用类型
  const fetchAppType = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getAppType()
      if (code == 0) {
        const keys = Object.keys(data)
        const types = keys.map((key) => {
          return {
            key,
            value: data[key],
          }
        })
        setAppTypes(types)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const changeAppType = (key) => {
    console.log(key)
    if (!key) {
      return setShowPages([])
    }
    let item = appTypes.find((v) => v.key == key)
    let pages = allPages[item.value]
    const keys = Object.keys(pages)
    const showPage = keys.map((key) => {
      return {
        key,
        value: pages[key],
      }
    })
    setShowPages(showPage)
  }

  // 获取展示页面
  const fetchAllPages = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getAllPage()
      if (code == 0) {
        setAllPages(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取签章节点
  const getSignNode = async () => {
    const {
      data: {data, code},
    } = await api.getSignNode()
    if (code == 0) {
      setSignNode(data)
    }
  }

  const fetchStatusList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getStatusList()
      if (code == 0) {
        const arr =
          (data &&
            Object.keys(data).map((key) => {
              return {
                key,
                value: data[key],
              }
            })) ||
          []
        setStatusList(arr)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchList = async (values = {}) => {
    // getAgreementList
    try {
      const {
        data: {data, code},
      } = await api.getAgreementList({
        ...pageParams,
        ...values,
        productId: activeKey,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
    setSelectItem({})
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const changeTab = async (key) => {
    setActiveKey(key)
  }
  const onSearch = (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = () => {
    fetchList(values)
  }

  const onEdit = ({...item}) => {
    item.applicationType = item.applicationTypeKey
    item.showPage = item.showPageKey

    setIndex(item.id)
    setVisible(true)
    setSelectItem(item)
  }

  const onDownLoad = async () => {
    try {
      if (!agreementIds.length) {
        return message.error('请选择项目')
      }

      const {
        data: {data, code},
      } = await api.downloadAgreement(agreementIds)
      if (code == 0) {
        base64ToFileOrBlob(
          'data:application/zip;base64,' + data.pdfData,
          '',
          false,
        )
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onPreview = (record) => {
    api.previewAgreement(record.id).then((res) => {
      if (res.data.code == 0) {
        window.open(res.data.data)
      }
    })
  }
  const onSwitchStatus = async (record, i) => {
    let params = {
      id: record.id,
      status: record.status == 1 ? 0 : 1,
    }
    Modal.confirm({
      content: `确定将此协议${record.status == 1 ? '停用' : '启用'}吗？`,
      onOk: async () => {
        api.changeAgreementStatus(params).then((res) => {
          if (res.data.code == 0) {
            message.success('修改成功')
            let temp = {...list}
            temp.list[i].status = params.status
            setList(temp)
          }
        })
      },
    })
  }
  const appendAgreementIds = (ids) => {
    setAgreementIds(ids)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
        {productList && productList.length
          ? productList.map((item) => (
              <TabPane
                tab={item.name}
                key={item.id}
                forceRender={true}
              ></TabPane>
            ))
          : null}
      </Tabs>

      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            templateName: '',
            status: '',
            showPage: null,
            applicationType: null,
          }}
        >
          <Form.Item label="应用类型" name="applicationType">
            <Select style={{width: '160px'}} onChange={changeAppType}>
              <Select.Option value={null}>全部</Select.Option>
              {appTypes.map((v, i) => (
                <Select.Option key={i} value={v.key}>
                  {v.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="展示页面" name="showPage">
            <Select style={{width: '160px'}}>
              <Select.Option value={null}>全部</Select.Option>
              {showPages.map((v, i) => (
                <Select.Option key={i} value={v.key}>
                  {v.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="协议名称" name="templateName">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select style={{width: '160px'}}>
              <Select.Option value="">全部</Select.Option>
              {statusList.map((v, i) => (
                <Select.Option key={i} value={v.key}>
                  {v.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>

          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>

          <Button style={{marginRight: 15}} onClick={onDownLoad}>
            下载
          </Button>

          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
        </Form>

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            onEdit,
            onPreview,
            showPages,
            onSwitchStatus,
            appendAgreementIds,
          }}
        />
        <AgreementForm
          {...{
            appTypes,
            allPages,
            tempData,
            signNode,
            selectIndex,
            visible,
            onHide: () => setVisible(false),
            selectItem,
            pullData: onPage,
            showPages,
            productId: activeKey,
            productList,
          }}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
