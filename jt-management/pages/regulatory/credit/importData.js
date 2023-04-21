import {Modal, Upload, Divider, Button, Descriptions, message} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {useState} from 'react'
import apiRegulatory from '~/api/regulatory'
import {Spin} from 'antd'
export default function (props) {
  const [fileList, setFileList] = useState([])
  const [result, setResult] = useState({})
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    setFileList([])
    setResult({})
    setLoading(false)
    props.setVisible(false)
  }

  const handleCancel = () => {
    setFileList([])
    setResult({})
    // props.setVisible(false)
  }

  const uploadFile = (file) => {
    setLoading(true)
    let reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = async () => {
      let results = reader.result.split('base64,')
      let valuesData = {
        fileName: file.name,
        fileBase64: results[1],
      }
      try {
        const {
          data: {data, code, desc},
        } = await apiRegulatory
          .uploadCreditReportList({
            ...valuesData,
          })
          .finally(() => {
            setLoading(false)
          })
        if (code == 0) {
          setResult(data)
        } else {
          // setResult({
          //   successNum: 100,
          //   errorNum: 4,
          //   failFileBase64: 'http://localhost:3010/regulatory/credit'
          // })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const downloadData = () => {
    if (!result.failFileBase64) return
    window.open(result.failFileBase64)
  }

  const UploadProps = {
    name: 'file',
    // accept:
    // '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // beforeUpload: (file) => {
    //   return false
    // },
    customRequest: (options) => {
      // message.error('')
      setFileList([options.file])
      uploadFile(options.file)
    },
  }

  const onRemove = (v) => {
    setFileList([])
  }

  return (
    <Modal
      visible={props.visible}
      okText="关闭"
      cancelText="重置"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      title="导入反馈文件"
    >
      <Upload {...UploadProps} onRemove={onRemove} fileList={fileList}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>

      <Divider />

      <Descriptions title="导入结果" column={1}>
        {loading ? (
          <Descriptions.Item>
            <Spin size="large" />
          </Descriptions.Item>
        ) : (
          <React.Fragment>
            <Descriptions.Item label="上报成功数量">
              {result.successNum || 0}
            </Descriptions.Item>
            <Descriptions.Item label="上报错误数量">
              {result.errorNum || 0}
            </Descriptions.Item>
            <Descriptions.Item
              label="下载失败数据"
              contentStyle={{alignItems: 'center'}}
            >
              <Button disabled={!result.failFileBase64} onClick={downloadData}>
                下载
              </Button>
            </Descriptions.Item>
          </React.Fragment>
        )}
      </Descriptions>
    </Modal>
  )
}
