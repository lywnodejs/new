import {
  Form,
  Input,
  message,
  Select,
  Modal,
  Radio,
  Upload,
  Button,
  DatePicker,
  Checkbox,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import moment from 'moment'
import {UploadOutlined} from '@ant-design/icons'
import api from '~/api/marketing'

function taskForm(props) {
  const [taskForm] = Form.useForm()
  const {selectIndex, visible, onHide, selectItem, pullData} = props
  const [marketingIdList, setMarketingIdList] = useState([])
  const [sendModeType, setSendModeType] = useState(false)
  const [usableNum, setUsableNum] = useState(0)
  const [taskNo, setTaskNo] = useState('')
  const [previewFileName, setPreviewFileName] = useState('')

  useEffect(() => {
    if (selectIndex == -1) {
      taskForm.resetFields()
      setPreviewFileName('')
      setUsableNum(0)
      setSendModeType(false)
      setTaskNo('')
    } else {
      if (visible) {
        selectItem.marketingSendType = String(selectItem.marketingSendType)
        selectItem.sendModeType = selectItem.sendModeType ? true : false
        setPreviewFileName(selectItem.taskObject)
        setSendModeType(selectItem.sendModeType)
        setTaskNo(selectItem.taskNo)

        if (selectItem.marketingIds) {
          selectItem.marketingIds = selectItem.marketingIds.split(',')
          changeMarketingIds(selectItem.marketingIds)
        }
        selectItem.marketingTime = selectItem.marketingTime
          ? moment(new Date(selectItem.marketingTime), 'YYYY-MM-DD HH:mm:ss')
          : ''
        taskForm.setFieldsValue({
          ...selectItem,
        })
      }
    }
    fetchList()
  }, [visible, selectIndex])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_marketing_ticket({
        status: 1,
      })
      if (code == 0) {
        let ids = data.list.filter(
          (v) => v.marketingNum - v.marketingSendNum > 0,
        )
        setMarketingIdList(ids || [])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onEdit = async () => {
    try {
      const values = await taskForm.validateFields()
      values.marketingSendType =
        values.marketingSendType == -1 ? null : Number(values.marketingSendType)
      if (!taskNo) {
        return message.error('请先上传名单文件')
      }
      if (usableNum <= 0) {
        return message.error('请选择有数量可发的券')
      }
      if (selectIndex == -1) {
        const {data} = await api.add_marketing_task({
          ...values,
          marketingIds: values.marketingIds.join(','),
          status: 1,
          sendModeType: sendModeType ? 1 : 0,
          taskNo,
        })
        if (data.code == 0) {
          onHide()
          message.success('新增成功')
          pullData()
        }
      } else {
        const {data} = await api.edit_marketing_task({
          ...values,
          marketingIds: values.marketingIds.join(','),
          id: selectItem.id,
          status: selectItem.status,
          sendModeType: sendModeType ? 1 : 0,
          taskNo,
        })
        if (data.code == 0) {
          onHide()
          message.success('编辑成功')
          pullData()
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const uploadProps = {
    name: 'file',
    showUploadList: false,
    // action: '/api/fund/file/upload/list',
    // accept:
    //   '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    customRequest: (options) => console.log(options),
    beforeUpload: async (file, fileList) => {
      const formData = new FormData()
      formData.append('testFile', file)
      try {
        const {
          data: {data, code},
        } = await api.upload_marketing_list(formData)
        if (code == 0) {
          setTaskNo(data)
          setPreviewFileName(file.name)
          message.success('上传成功')
        } else {
          setPreviewFileName('')
        }
      } catch (error) {
        console.log(error)
      }
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
  const download = () => {
    window.open('/template/template.csv')
  }
  const changeMarketingIds = (val) => {
    taskForm.setFieldsValue('marketingIds', val)
    if (val && val.length) {
      return countUableNum(val.join(','))
    }
    setUsableNum(0)
  }
  const countUableNum = async (val) => {
    try {
      const {
        data: {data, code},
      } = await api.count_marketing_usableNum({marketingIds: val})
      if (code == 0) {
        setUsableNum(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Modal
      title={selectIndex === -1 ? '任务新增' : '任务编辑'}
      maskClosable={false}
      visible={visible}
      destroyOnClose
      forceRender
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
    >
      <Form
        key={Date.now}
        form={taskForm}
        name="taskForm"
        initialValues={{
          marketingSendType: '-1',
          marketingTime: '',
          taskNo: '',
          taskName: '',
          marketingIds: [],
        }}
      >
        <Form.Item
          label="任务名"
          name="taskName"
          rules={[
            {required: true, message: '请输入任务名'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && (value.length > 50 || value.length < 1)) {
                  return Promise.reject('输入范围大于1字符，小于等于50字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入任务名" />
        </Form.Item>

        <Form.Item label="发放人群">
          <Form.Item
            name="taskNo"
            style={{
              width: '153px',
              display: 'inline-block',
              marginBottom: '5px',
            }}
          >
            <Upload {...uploadProps}>
              <Button>
                <UploadOutlined />
                上传名单文件
              </Button>
            </Upload>
          </Form.Item>
          <Button type="primary" onClick={download}>
            模板下载
          </Button>
          <span>{previewFileName}</span>
          <p style={{marginBottom: 0}}>请下载模板并使用</p>
        </Form.Item>

        <Form.Item label="发送模式" name="marketingSendType">
          <Radio.Group>
            <Radio value="1">立即发送</Radio>
            <Radio value="0">定时发送</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.marketingSendType !== currentValues.marketingSendType
          }
        >
          {({getFieldValue}) => {
            return (
              getFieldValue('marketingSendType') == 0 && (
                <Form.Item
                  name="marketingTime"
                  label="选择日期"
                  rules={[{required: true, message: '请选择日期'}]}
                  style={{}}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择日期"
                  />
                </Form.Item>
              )
            )
          }}
        </Form.Item>

        <Form.Item
          label={
            <span>
              <span style={{color: 'red', paddingRight: '5px'}}>*</span>券ID
            </span>
          }
        >
          <Form.Item
            name="marketingIds"
            rules={[{required: true, message: '请选择券ID'}]}
          >
            <Select
              onChange={(val) => changeMarketingIds(val)}
              mode="multiple"
              placeholder="请选择"
            >
              {marketingIdList &&
                marketingIdList.length &&
                marketingIdList.map((v) => {
                  return (
                    <Select.Option value={v.id} key={v.id}>
                      {v.id}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Checkbox
            checked={sendModeType}
            onChange={(e) => {
              setSendModeType(!sendModeType)
            }}
          >
            随机发放一张
            <span style={{color: '#d6d6d6'}}>（选择的id中只随机发放一张）</span>
          </Checkbox>
          <p>
            已选券的可发数量：<span style={{color: 'red'}}>{usableNum}</span> 张
          </p>
        </Form.Item>
      </Form>
    </Modal>
  )
}

taskForm.getInitialProps = async () => ({})

export default taskForm
