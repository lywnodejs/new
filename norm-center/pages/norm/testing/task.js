import {Form, Input, Space, Upload, Button, message} from 'antd'
import {UploadOutlined, InboxOutlined} from '@ant-design/icons'
import {useEffect, useState, useRef} from 'react'
import {get, post, downloadExcel} from '~/utils/fetch'

import EditModal from './EditModal'

export default function Task(props) {
  // console.log(data);
  const [file, setFile] = useState([])
  const [noSelect, setNoSelect] = useState(false)
  const [selectIds, setSelectIds] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [form] = Form.useForm()

  const childRef = useRef()

  const normFile = (e) => {
    // console.log('Upload event:', e);
    console.log(e.fileList)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const changeSelectItems = (data) => {
    if (Array.isArray(data)) {
      setSelectIds(data)
    }
    setShowEdit(false)
  }

  const runTask = async () => {
    setNoSelect(selectIds.length === 0)

    const values = await form.validateFields()
    const namesArray = []
    selectIds.map((item) => {
      namesArray.push(item.name)
    })
    const namesString = namesArray.join(',')
    // console.log('fileData', file)
    const formData = new FormData()

    formData.append('name', values.taskName)
    formData.append('indicatorNames', namesString)
    formData.append('paramFile', file)
    console.log(formData)

    const postData = {
      name: values.taskName,
      indicatorNames: namesString,
      paramFile: formData,
    }
    // console.log(postData)
    // console.log(typeof fileList, typeof values.upload);
    const post1 = await post('indicators/exec/test/new/task', formData)
    if (post1.data.code === 0) {
      message.success('执行成功')
      form.resetFields()
      setSelectIds([])
      props.updateList()
      childRef.current.setResetp()
    }
  }
  const uploadProps = {
    accept: '.csv',
    beforeUpload: (fileData) => {
      console.log('fileData', fileData)
      setFile(fileData)
      return false
    },
    // file,
  }

  const handleDownload = async () => {
    //   console.log('get', get);
    const downloadFile = await downloadExcel('indicators/exec/test/template')
    const type = Object.prototype.toString.call(downloadFile.data)
    console.log(downloadFile)
    if (type === '[object ArrayBuffer]') {
      var disposition = downloadFile.headers['content-disposition']
      var fileName = decodeURI(disposition.split("filename*=UTF-8''")[1])
      let blob = new Blob([downloadFile.data]) // 假设文件为pdf
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      link.remove()
    } else {
      message.error('下载失败')
    }
  }

  return (
    <div>
      <Form form={form}>
        <Form.Item
          label="任务名"
          name="taskName"
          style={{width: 250}}
          rules={[{required: true, message: '请输入'}]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <div className={'model'} style={{display: 'flex'}}>
          <Form.Item label="任务文件" required style={{marginBottom: 0}}>
            <Space>
              <Form.Item
                name="upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{required: true, message: '请上传文件'}]}
                style={{width: '200px'}}
              >
                <Upload {...uploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
              </Form.Item>
            </Space>
          </Form.Item>
          <div
            style={{
              display: 'flex',
              maxHeight: '32px',
              position: 'relative',
              left: '-78px',
            }}
          >
            <Button
              type="primary"
              style={{marginBottom: 24}}
              onClick={handleDownload}
            >
              下载模板文件
            </Button>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '5px',
                marginLeft: '5px',
              }}
            >
              请下载模板并使用
            </div>
          </div>
        </div>
        <Form.Item
          label="指标"
          required
          name="case"
          rules={[
            ({getFieldValue}) => ({
              validator(_, value) {
                console.log(selectIds.length)
                if (selectIds.length <= 0) {
                  return Promise.reject('请选择指标')
                }
                return Promise.resolve()
              },
            }),
          ]}
          // help={
          //   noSelect ? <span style={{color: '#ff4d4f'}}>请选择指标</span> : null
          // }
        >
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setShowEdit(true)
              }}
            >
              添加或编辑指标
            </Button>
            <div>
              共{' '}
              <span
                style={
                  selectIds.length === 0 ? {color: 'red'} : {color: '#1890ff'}
                }
              >
                {selectIds.length}
              </span>{' '}
              个指标被选中
            </div>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={runTask}>
            执行任务
          </Button>
        </Form.Item>
      </Form>
      <EditModal
        show={showEdit}
        changeSelectItems={changeSelectItems}
        cRef={childRef}
      />
    </div>
  )
}
