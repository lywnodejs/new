import {Layout} from '~/components/Layout'
import React, {useEffect, useState, createContext} from 'react'
import {
  Space,
  message,
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/statistics'
import {useRouter} from 'next/router'
import TableList from './TableList'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {withKeepAlive, keepAliveLoadFromCache} from 'react-next-keep-alive'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '统计分析'}, {text: '调用查询'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

export const FatherContext = createContext()
function body(props) {
  // console.log('props.router.query', props.router.query.name)
  const {checkProgressList, statusList} = props
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [visible, setVisible] = useState(false)
  const [reason, setReason] = useState([])
  const [form] = Form.useForm()
  const router = useRouter()
  const [queryName, setQueryName] = useState(router.query.name)

  useEffect(() => {
    // console.log('props.router.query.name', props.router.query.name);
    fetchList({}, queryName)
  }, [])
  keepAliveLoadFromCache('query-detail', false)
  const fetchList = async (values = {}, query = null) => {
    // console.log('values', values)
    try {
      const {time} = values
      values.callDateStart = (time && time[0].format('YYYY-MM-DD')) || null
      values.callDateEnd = (time && time[1].format('YYYY-MM-DD')) || null
      values.mobilePhoneOrCardNo = values.mobilePhoneOrCardNo || null
      values.flowType = values.flowType || null
      if (query) {
        values.taskName = query
      }
      // console.log('fetchList-value', values)
      const {
        data: {data, code},
      } = await api.get_call_query({
        ...pageParams,
        ...values,
        tenantId: cookies.tenantId,
      })
      if (code === 0) {
        // console.log('data', data)
        setProductList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = (value) => {
    pageParams.pageNo = 1
    fetchList({...value})
  }

  const onPage = (pageNo, pageSize) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    fetchList(form.getFieldsValue())
  }

  const exhibition = (item) => {
    setVisible(true)
    setReason(item.rejecDecision)
  }
  const onHide = () => {
    setVisible(false)
  }

  const onCopy = () => {
    message.success('已复制至剪切板')
  }

  const onReset = () => {
    form.resetFields()
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
            mobilePhoneOrCardNo: '',
            flowType: null,
          }}
        >
          <Form.Item label="手机号\身份证号" name="mobilePhoneOrCardNo">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="调用日期" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="调用业务" name="taskName">
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>
          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>
        </Form>

        <TableList
          {...{
            onPage,
            productList,
            statusList,
            checkProgressList,
            pageParams,
            exhibition,
          }}
        />
        <>
          <Modal
            title=""
            visible={visible}
            // onOk={onEdit}
            onCancel={onHide}
            destroyOnClose={true}
            footer={[
              <CopyToClipboard text={reason} onCopy={onCopy}>
                <Button type="primary">复制全部内容</Button>
              </CopyToClipboard>,
              <Button key="back" onClick={onHide}>
                关闭
              </Button>,
            ]}
          >
            <span>{reason}</span>
          </Modal>
        </>
      </Space>
    </Layout>
  )
}

export default body
