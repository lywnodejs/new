import {Layout} from '~/components/Layout'
import {
  Card,
  Button,
  Form,
  Input,
  Table,
  Space,
  Modal,
  message,
  Alert,
} from 'antd'
import styles from './index.less'
import {useState} from 'react'
import fetch from '~/utils/fetch'
import CheckboxItem from './CheckboxItem'

const breadcrumbs = [{text: '指标管理'}, {text: '告警管理'}]

function body(props) {
  const [data, setData] = useState(props.data)
  const [strategyList, setStrategyList] = useState(props.strategyList)
  const [status, setStatus] = useState(false)
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form] = Form.useForm()
  const [isEmai, setIsEmai] = useState(false)

  const columnsCheckList = [
    {title: 'code', dataIndex: 'code'},
    {title: 'desc', dataIndex: 'desc'},
    {title: 'enable', dataIndex: 'enable'},
  ]

  const save = async (record) => {
    try {
      const row = await form.validateFields()
      const saveData = {...row, type: 'derivation', extend: record.extend}
      if (record.id != new_temp_id) {
        saveData.id = record.id
      }

      const {
        data: {data, code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
        [saveData],
      )

      if (code == 0) {
        message.success('保存成功')
        setEditingKey('')
        updateList()
      }
    } catch (error) {
      console.log('衍生指标编辑保存error', error)
    }
  }

  const updateList = async (params = {}) => {
    let data = await getData(params)
    setData(data)
  }

  const showModal = (data) => {
    if (data) {
      console.log(data)
      setEditData(data)
      form.setFieldsValue(data)
    }

    setVisible(true)
  }

  const onOk = async () => {
    console.log(editData)
    const values = await form.validateFields()
    // console.log(values.account);

    setConfirmLoading(true)
    let postData = null
    if (editData) {
      postData = {
        id: editData.id,
        email: values.email,
        name: values.name,
      }
    } else {
      postData = {
        // id: Number(new Date()),
        email: values.email,
        name: values.name,
      }
    }
    console.log(postData)

    try {
      const {
        data: {data, code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.alarm.indalarmmanageservice.savecontact',
        [postData],
      )
      if (code === 0) {
        // console.log(code)
        updateList()
        setVisible(false)
        setConfirmLoading(false)
        setEditData(null)
        editData ? message.success('保存成功') : message.success('添加成功')
        form.resetFields()
        return
      }
    } catch (error) {
      return []
    }
  }

  const onCancel = () => {
    form.resetFields()
    setEditData(null)
    setVisible(false)
    setConfirmLoading(false)
    setIsEmai(false)
  }

  const deleteItem = (record, i) => {
    const deletePost = async (id) => {
      try {
        const data = await fetch(
          'fincloud.basics.indicators.center.api.alarm.indalarmmanageservice.deletecontact',
          [id],
        )
        if (data) {
          console.log(data)
          return data
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }

    Modal.confirm({
      title: '确定删除吗？',
      onOk() {
        // console.log(record.id);
        data.splice(i, 1)
        deletePost(record.id)
        setData([...data])
        message.success('删除成功')
      },
    })
  }

  // TODO 验证邮箱方法
  const isEmailFunc = (e) => ({
    validator(_, value) {
      // console.log(JSON.parse(value))
      // console.log(getFieldValue)
      // console.log(isJSON(value))
      // setJsonModel(true)
      // if (isJSON(value)) {
      //   setJsonModel(false)
      //   setRawData(value)
      //   return Promise.resolve()
      // }
      // return Promise.reject(new Error('请检查当前输入内容'))
      console.log(value)
      if (!value) {
        return Promise.reject(new Error('请输入'))
      } else {
        let emailZ = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/
        console.log(emailZ.test(value))
        if (emailZ.test(value)) {
          setIsEmai(false)
          return Promise.resolve()
        } else {
          setIsEmai(true)
          return Promise.reject()
        }
      }
    },
    validateTrigger: 'onClick',
    required: true,
  })

  const columns = [
    {title: '邮箱账号', dataIndex: 'email'},
    {title: '姓名', dataIndex: 'name'},
    {title: '更新时间', dataIndex: 'updateTime'},
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record, i) => {
        return (
          <Space>
            <a onClick={() => showModal(record)}>编辑</a>
            <a onClick={() => deleteItem(record, i)}>删除</a>
          </Space>
        )
      },
    },
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card title="告警策略">
        {strategyList.map((item, index) => {
          return <CheckboxItem {...item} key={index} />
        })}
      </Card>
      <Card
        style={{
          width: '100%',
          marginTop: 20,
        }}
      >
        <div style={{textAlign: 'right', marginBottom: 20}}>
          <Button type="primary" onClick={() => showModal()}>
            新增
          </Button>
        </div>
        <Table
          bordered
          dataSource={data}
          rowKey="id"
          columns={columns}
          pagination={false}
        />
      </Card>

      <Modal
        title="邮箱配置"
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onOk}
        centered={true}
      >
        <div
          style={{marginBottom: '20px'}}
          className={isEmai ? styles.shows : styles.disbs}
        >
          <Alert
            message="电子邮箱格式有误，请重新输入"
            type="error"
            showIcon
            closable
          />
        </div>
        <Form form={form}>
          <Form.Item
            label="邮箱账号"
            name="email"
            rules={[(e) => isEmailFunc(e)]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{required: true, message: '请输入'}]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {}) => {
  try {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.alarm.indalarmmanageservice.getcontactlist',
      [params],
    )
    if (code === 0) {
      console.log('data', data)
      return data
    }
    return []
  } catch (err) {
    return []
  }
}

const getStrategyList = async (params = {}) => {
  try {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.alarm.indalarmmanageservice.getstrategylist',
      [params],
    )

    if (code === 0) {
      // console.log(data);
      return data
    }
    return []
  } catch (err) {
    return []
  }
}

body.getInitialProps = async () => {
  const [data, strategyList] = await Promise.all([getData(), getStrategyList()])
  return {data, strategyList}
}

export default body
