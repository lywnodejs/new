import React, {useEffect, useState} from 'react'
import {UploadOutlined} from '@ant-design/icons'
import {Table, Button, message, Form, Divider, Input, Upload, Card} from 'antd'
import {withRouter} from 'next/router'
import {findActionTypeByKey} from '../../common/mapActionToApi'
import api from '~/api/risk'

const pageParams = {
  pageNo: 1,
  pageSize: 5,
}

function body({router}) {
  const [form] = Form.useForm()
  const [previewFileName, setPreviewFileName] = useState('')
  const [testFile, setTestFile] = useState(null)
  const [testRunList, setTestRunList] = useState({})
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  useEffect(() => {
    function fetchData() {
      fetchTestRunList()
    }
    fetchData()
  }, [])

  const fetchTestRunList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.test_run_list({
        ...pageParams,
        productId: router.query.productId,
        actionId: router.query.id,
        actionType: findActionTypeByKey(+router.query.category),
      })
      if (code == 0) {
        setTestRunList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept:
      '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    beforeUpload: (file) => {
      setPreviewFileName(file.name)
      setTestFile(file)
      return false
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        // console.log(info.file);
      }
      if (info.file.status === 'done') {
        // message.success(`导入成功`);
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  // *---------------------------------------------------

  const onDownload = async () => {
    // console.log('下载文件')
    try {
      const {data} = await api.download_test_run({
        productId: router.query.productId,
        actionId: router.query.id,
        actionType: findActionTypeByKey(+router.query.category),
      })
      // console.log('data ->', data)
      var blob = new Blob([data], {
        type: 'application/ms-txt.numberformat:@;charset=UTF-8',
      })
      var objectUrl = URL.createObjectURL(blob)
      // console.log('objectUrl ->', objectUrl)
      var a = document.createElement('a')
      document.body.appendChild(a)
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', 'template.csv')
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      console.log(err)
    }
  }

  // *---------------------------------------------------
  const onExcuteTask = async () => {
    const values = await form.validateFields()
    if (!testFile) {
      return message.error('请先上传文件')
    }

    const formData = new FormData()
    formData.append('productId', router.query.productId)
    formData.append('actionId', router.query.id)
    formData.append('actionType', findActionTypeByKey(+router.query.category))
    formData.append('taskName', values.taskName)

    formData.append('testFile', testFile)
    try {
      const {
        data: {data, code, desc},
      } = await api.upload_task_file(formData)
      if (code == 0) {
        fetchTestRunList()
      } else {
        setTestFile(null)
        setPreviewFileName('')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const columns = [
    {
      title: '操作时间',
      dataIndex: 'taskBeginTime',
      key: 'taskBeginTime',
      width: 150,
    },
    {
      title: '操作员',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 150,
    },
    {
      title: '测试任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 150,
    },
    {
      title: '测试任务文件',
      dataIndex: 'inputFileName',
      key: 'inputFileName',
      width: 150,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        if (text == 0) {
          return '待执行'
        }
        if (text == 1) {
          return '执行成功'
        }
        if (text == 2) {
          return '执行失败'
        }
        if (text == 3) {
          return '执行异常'
        }
        if (text == 4) {
          return '执行中'
        }
      },
    },
    {
      title: '结果导出',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return record.status ? (
          <Button type="link" onClick={() => onDownloadLast(record)}>
            下载
          </Button>
        ) : null
      },
    },
  ]
  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: testRunList.totalSize,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      fetchTestRunList()
    },
  }
  const onDownloadLast = (item) => {
    window.open(item.resultFilePath)
  }
  return (
    <>
      <Card title="测试运行">
        <Form form={form} name="form" initialValues={{}}>
          <Form.Item
            label="测试任务名称"
            name="taskName"
            rules={[
              {required: true, message: '请输入测试任务名称'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (value && (value.length > 20 || value.length < 1)) {
                    return Promise.reject('输入范围大于1字符，小于等于20字符')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input placeholder="支持中英文、数字和下划线" />
          </Form.Item>

          <Form.Item label="测试任务文件">
            <Form.Item
              name="testFile"
              style={{
                width: '153px',
                display: 'inline-block',
                marginBottom: '5px',
              }}
            >
              <Upload {...uploadProps}>
                <Button>
                  <UploadOutlined />
                  上传文件
                </Button>
              </Upload>
            </Form.Item>
            <Button type="primary" onClick={onDownload}>
              模板下载
            </Button>
            <span>{previewFileName}</span>
            <p style={{marginBottom: 0}}>请下载测试模板并使用</p>
          </Form.Item>
          <Button type="primary" onClick={onExcuteTask}>
            执行任务
          </Button>
        </Form>
      </Card>
      <Card title="历史记录" style={{marginTop: '20px'}}>
        <Table
          rowKey="id"
          dataSource={testRunList.list}
          columns={columns}
          bordered
          pagination={pagination}
        />
      </Card>
    </>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
