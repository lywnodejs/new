import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Modal,
} from 'antd'
import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import TableList from './TableList'
import apiRisk from '~/api/riskWarning'
import apiAccounting from '~/api/accounting'

const breadcrumbs = [{text: '风险预警管理'}, {text: '风险预警记录'}]
const pageParams = {
  page: 1,
  pageSize: 10,
}
let values = {}
function body() {
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [totalNum, setTotalNum] = useState([])
  const [accountList, setAccountList] = useState([])
  const [visible, setVisible] = useState(false)
  const [remarkForm] = Form.useForm()
  const [remarkId, setRemarkId] = useState([])
  useEffect(() => {
    fetchRisksList()
    fetchAccount()
  }, [])
  const fetchRisksList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await apiRisk.fetch_riskList({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        setList(data.list)
        setTotalNum(data.size)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.page = 1
    fetchRisksList({...values})
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
  }

  const onPage = async () => {
    fetchRisksList(values)
  }

  const fetchAccount = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('DECISION_WARN_TYPE')
      if (code == 0) {
        setAccountList(data)
        console.log(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleOk = async () => {
    const values = await remarkForm.validateFields()
    console.log()
    try {
      const {
        data: {data, code},
      } = await apiRisk.fetch_get_updateRemark({
        warnId: remarkId,
        remark: values.remark,
      })
      if (code == 0) {
        message.success('备注成功')
        setVisible(false)
        fetchRisksList()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const remark = (item) => {
    setRemarkId(item.id)
    setVisible(true)
    remarkForm.setFieldsValue({remark: item.remark})
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            queryId: null,
            result: null,
          }}
        >
          <Form.Item label="手机号\预警编号" name="queryId">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="预警结果" name="warnCode">
            <Select style={{width: 180}}>
              <Select.Option value={null}>全部</Select.Option>
              {accountList &&
                accountList.map((v, i) => {
                  return (
                    <Select.Option key={i} value={v.code}>
                      {v.description}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item label="用户名" name="realName">
            <Input placeholder="请输入" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{marginLeft: 15}} onClick={onReset}>
            重置
          </Button>
        </Form>
        <TableList
          {...{
            list,
            totalNum,
            pageParams,
            onPage,
            remark,
          }}
        />

        <Modal
          title="备注"
          visible={visible}
          // maskClosable={false}
          // destroyOnClose
          // forceRender
          onCancel={() => setVisible(false)}
          onOk={handleOk}
        >
          <Form form={remarkForm}>
            <Form.Item
              label="备注"
              name="remark"
              rules={[
                {required: true, message: '请输入备注'},
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    if (value && value.length < 5) {
                      return Promise.reject('请输入至少5个字符')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input.TextArea placeholder="请输入至少五个字符" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Layout>
  )
}

export default body
