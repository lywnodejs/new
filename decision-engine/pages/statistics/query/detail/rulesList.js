import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import {Button, Table, Modal, message, Form, Input, Select} from 'antd'
import Router, {withRouter} from 'next/router'
import api from '~/api/statistics'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const breadcrumbs = [
  {text: '统计分析'},
  {text: '调用查询'},
  {text: '调用详情'},
  {text: '规则详情'},
]
function body(props) {
  const [form] = Form.useForm()
  const [rulesData, setRulesData] = useState([])
  const [visible, setVisible] = useState(false)
  const [reference, setReference] = useState([])
  // console.log(form.getFieldValue())
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData(resultDesc = '') {
    // console.log('resultDesc',resultDesc);
    let postData = {
      requestNo: props.router.query.requestNo,
      actionId: props.router.query.actionId,
      actionType: props.router.query.actionType,
      pubSeqNo: props.router.query.pubSeqNo,
      resultType: resultDesc !== '全部' ? resultDesc : '',
    }
    // console.log('postData',postData)
    try {
      const {
        data: {data, code},
      } = await api.get_rules_list(postData)
      if (code == 0) {
        console.log('data', data)
        setRulesData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const columns = [
    {
      title: '规则编号',
      dataIndex: 'ruleCode',
      key: 'ruleCode',
      width: 200,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
    },
    {
      title: '规则',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
    },
    {
      title: '入参',
      dataIndex: 'fieldValueStrL',
      key: 'fieldValueStrL',
      render: (text, record) => {
        return (
          <a
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              display: 'inline-block',
              width: '200px',
            }}
            onClick={() => exhibition(record)}
          >
            {text}
          </a>
        )
      },
    },
    {
      title: '结果',
      dataIndex: 'resultDesc',
      key: 'resultDesc',
      width: 150,
    },
  ]
  const exhibition = (record) => {
    setVisible(true)
    setReference(record.fieldValueStrL)
  }
  const onHide = () => {
    setVisible(false)
  }
  const onCopy = () => {
    message.success('已复制至剪切板')
  }

  const textWrap = (str) => {
    let reg = /[、]/g
    return str.toString().replace(reg, '$&\r\n')
  }

  // *------------------------
  const onSearch = () => {
    // console.log(form.getFieldValue().resultDesc)
    const selectResult = form.getFieldValue().resultDesc
    fetchData(selectResult)
  }
  const onReset = () => {
    console.log('onReset')
    form.resetFields()
    fetchData()
  }
  // *------------------------

  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={Router.back}>返回上一页</Button>}
    >
      <Form form={form} layout="inline">
        <Form.Item label="结果" name="resultDesc">
          <Select style={{width: 120}} placeholder="请选择">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="通过">通过</Select.Option>
            <Select.Option value="拒绝">拒绝</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table rowKey="id" dataSource={rulesData} columns={columns} />
      <>
        <Modal
          title=""
          visible={visible}
          // onOk={onEdit}
          onCancel={onHide}
          destroyOnClose={true}
          footer={[
            <CopyToClipboard text={textWrap(reference)} onCopy={onCopy}>
              <Button type="primary">复制全部内容</Button>
            </CopyToClipboard>,
            <Button key="back" onClick={onHide}>
              关闭
            </Button>,
          ]}
        >
          <div style={{whiteSpace: 'pre-wrap'}}>{textWrap(reference)}</div>
        </Modal>
      </>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
