import {Form, message, Modal, Tabs} from 'antd'
import BaseVariableForm from './BaseVariableForm'
import DecoSearchToBaseVariableTableList from './DecoSearchToBaseVariableTableList'
import {findApiByKey} from './mapActionToApi'
import {useEffect, useState} from 'react'
import api from '~/api/risk'

const {TabPane} = Tabs
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function GenerateOutputVariableModal(props) {
  const {
    visible,
    onHide,
    groups,
    activeKey,
    activeCategoryKey,
    setFieldCb,
    moduleType,
  } = props
  const [variableForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('1')
  const [list, setList] = useState([])
  const [fieldColumnName, setFieldColumnName] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    function fetchData() {
      fetchList()
    }
    fetchData()
  }, [visible])

  useEffect(() => {
    function fetchData() {
      setSelectedRowKeys([])
    }
    fetchData()
  }, [activeCategoryKey, activeKey])

  const onEdit = async () => {
    try {
      if (activeTab == 1) {
        const values = await variableForm.validateFields()
        const postData = {
          ...values,
          productId: activeKey,
          fieldType: 1,
        }
        const {data} = await api.update_risk_variable(postData)

        if (data.code == 0) {
          onHide()
          message.success('保存成功')
          setFieldCb(values.fieldColumnName)
        }
      } else {
        if (!fieldColumnName) {
          return message.error('请选择变量')
        }
        onHide()
        setFieldCb(fieldColumnName)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeTab = async (key, showError) => {
    setActiveTab(key)
  }

  const fetchList = async (values = {}) => {
    let basePostData = {
      ...pageParams,
      ...values,
      moduleType,
      productId: activeKey,
      fieldType: 1,
    }
    let postApi = findApiByKey(1, basePostData, 'fetch')
    try {
      const {
        data: {data, code},
      } = await postApi()
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  const rowSelectionConfig = {
    type: 'radio',
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v, selectedRows) => {
      setSelectedRowKeys(v)
      setFieldColumnName(
        selectedRows.length ? selectedRows[0].fieldColumnName : '',
      )
    },
  }
  return (
    <Modal
      title={'编辑'}
      maskClosable={false}
      visible={visible}
      destroyOnClose
      forceRender
      onOk={onEdit}
      onCancel={onHide}
      width={600}
      cancelText="取消"
      okText="确定"
      bodyStyle={{paddingTop: 0}}
    >
      <Tabs activeKey={activeTab} onTabClick={(key) => changeTab(key, false)}>
        <TabPane tab="新增变量" key="1" forceRender={true}>
          <BaseVariableForm {...{groups, variableForm}} />
        </TabPane>
        <TabPane tab="选择已有" key="2" forceRender={true}>
          <DecoSearchToBaseVariableTableList
            {...{
              onSearch,
              list,
              onPage,
              pageParams,
              setFieldColumnName,
              rowSelectionConfig,
            }}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

GenerateOutputVariableModal.getInitialProps = async () => ({})

export default GenerateOutputVariableModal
