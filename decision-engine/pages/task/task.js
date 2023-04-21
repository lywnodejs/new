import {Form, Input, Space, Upload, Button, message, Typography} from 'antd'
import {UploadOutlined, PlusOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import {upload} from '~/utils/fetch'
import AddFlow from './addFlow'

const Task = (props) => {
  const {updateList} = props
  const [file, setFile] = useState(null)
  const [selectFlow, setselectFlow] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [form] = Form.useForm()
  const [fileTemplateIndicators, setFileTemplateIndicators] = useState('')
  const [taskRunClick, setTaskRunClick] = useState(false)

  useEffect(() => {
    setselectFlow([])
  }, [taskRunClick])

  const handleSetFileTemplateIndicators = (value) => {
    setFileTemplateIndicators(value)
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const changeSelectItems = (data) => {
    if (Array.isArray(data)) {
      setselectFlow(data)
    }
    setShowEdit(false)
  }

  const runTask = async () => {
    const values = await form.getFieldsValue()
    const formData = new FormData()
    formData.append('taskName', values.taskName)
    formData.append('productId', selectFlow[0].productId)
    formData.append('flowId', selectFlow[0].id)
    formData.append('flowName', selectFlow[0].flowName)
    formData.append('testFile', file)

    // 发请求
    try {
      const {
        data: {data, code},
      } = await upload('/design/exec/manual/upload', formData)
      if (code === 0) {
        message.success('执行任务成功')
        updateList()
        form.resetFields()
        setTaskRunClick(true)
        setTaskRunClick(false)
      }
    } catch (error) {
      console.log(err)
    }
  }
  const uploadProps = {
    accept: '.csv',
    beforeUpload: (fileData) => {
      setFile(fileData)
      return false
    },
  }

  const handleDownload = () => {
    let link = document.createElement('a')
    link.href = `/api/design/exec/manual/template?titles=${fileTemplateIndicators}`
    link.click()
    link.remove()
  }

  return (
    <div>
      <Form form={form} onFinish={runTask} style={{paddingTop: '20px'}}>
        <Form.Item
          label="任务名称"
          name="taskName"
          rules={[{required: true, message: '请输入'}]}
          style={{float: 'left', marginRight: '30px'}}
        >
          <Input style={{width: '200px'}} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="决策流" required style={{marginRight: '30px'}}>
          <Space>
            <Button
              type="ghost"
              onClick={() => {
                setShowEdit(true)
              }}
              style={{width: '200px'}}
              icon={selectFlow.length === 1 ? null : <PlusOutlined />}
            >
              {selectFlow.length === 1 ? selectFlow[0].flowName : '添加决策流'}
            </Button>
          </Space>
        </Form.Item>
        <Form.Item label="模版下载" required>
          <Space>
            {selectFlow.length === 1 ? (
              <>
                <Button
                  type="primary"
                  onClick={handleDownload}
                  style={{width: '200px'}}
                >
                  {selectFlow[0].flowName}模版
                </Button>
                <div>请下载模板并使用</div>
              </>
            ) : (
              <Typography.Text type="secondary" style={{marginLeft: '15px'}}>
                请先选择决策流
              </Typography.Text>
            )}
          </Space>
        </Form.Item>
        <Form.Item label="任务文件" required style={{marginBottom: 0}}>
          <Space>
            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{required: true, message: '上传文件'}]}
            >
              <Upload {...uploadProps} maxCount={1}>
                <Button style={{width: '200px'}} icon={<UploadOutlined />}>
                  上传文件
                </Button>
              </Upload>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{width: '200px', marginTop: '10px'}}
            htmlType="submit"
          >
            执行任务
          </Button>
        </Form.Item>
      </Form>
      <AddFlow
        handleSetFileTemplateIndicators={handleSetFileTemplateIndicators}
        show={showEdit}
        changeSelectItems={changeSelectItems}
        taskRunClick={taskRunClick}
      />
    </div>
  )
}

export default Task
