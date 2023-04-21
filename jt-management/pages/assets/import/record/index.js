import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import {
  Card,
  Row,
  Col,
  Space,
  Select,
  Button,
  message,
  Form,
  Upload,
  Spin,
} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import TableList from './TableList'
import Modal from 'antd/lib/modal/Modal'
import apiAssets from '~/api/assets'

const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
const breadcrumbs = [{text: '资产保全'}, {text: '导入记录'}]
let values = {}

function body(props) {
  const [form] = Form.useForm()
  const [explainVisible, setExplainVisible] = useState(false)
  const [exportFileName, setExportFileName] = useState('')
  const [fileList, setFileList] = useState([])
  const [tips, setTips] = useState(false)
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [exportData, setExportData] = useState([])
  useEffect(() => {
    importRecord()
  }, [])
  const importRecord = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_record_deduction({...pageParams, type: 0})
      if (code == 0) {
        setList(data.list)
        setTotalData(data.totalSize)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onPage = async () => {
    importRecord(values)
  }

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept:
      '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    beforeUpload: (file) => {
      setExportFileName(file.name)
      setFileList(file)
      return false
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        // console.log(info.file)
      }
      if (info.file.status === 'done') {
        // message.success(`导入成功`)
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const beginExport = async () => {
    const values = await form.validateFields()
    if (values.files == undefined) {
      return message.error('请选择上传文件，仅支持[.xls]及[.xlsx]')
    } else if (values.exportType == null) {
      return Modal.info({
        title: '操作提示',
        content: (
          <div style={{marginTop: 40}}>
            <p>请选择导入类型</p>
          </div>
        ),
        onOk() {},
        okText: '好的',
      })
    } else {
      setTips(true)
      let reader = new FileReader()

      reader.readAsDataURL(fileList)
      reader.onload = async () => {
        let valuesData = {
          fileType: values.exportType,
          excelBase64: reader.result,
        }
        try {
          const {
            data: {data, code, desc},
          } = await apiAssets.fetch_cheek_import({
            ...valuesData,
          })
          if (code == 0) {
            setExportData(data)
            setConfirmVisible(true)
          } else if (data == null) {
            setTimeout(() => {
              setTips(false)
            }, 3000)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const importData = async (item) => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_export_downLoad({
        fileLogId: item.id,
      })
      if (code == 0) {
        message.success('下载成功')
        window.open(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const subMit = async () => {
    const values = await form.validateFields()
    let reader = new FileReader()

    reader.readAsDataURL(fileList)
    reader.onload = async () => {
      let valuesData = {
        fileType: values.exportType,
        excelBase64: reader.result,
      }

      try {
        const {
          data: {data, code},
        } = await apiAssets.fetch_import_list({
          ...valuesData,
        })
        if (code == 0) {
          message.success(data)
          setTips(false)
          setConfirmVisible(false)
          setExplainVisible(false)
          importRecord()
          setExportFileName('')
        } else if (code == -1) {
          setTimeout(() => {
            setTips(false)
          }, 3000)
          setExplainVisible(false)
          setConfirmVisible(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const goBack = () => {
    setConfirmVisible(false)
    setTips(false)
  }
  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Spin tip="Loading..." spinning={tips}>
        <Space direction="vertical" size="large" style={{width: '100%'}}>
          <Form
            style={{position: 'relative'}}
            form={form}
            layout="inline"
            className="searchForm"
            initialValues={{
              exportType: null,
            }}
          >
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item name="files">
                  <Upload {...uploadProps}>
                    <Button type="dashed" icon={<UploadOutlined />}>
                      选择文件
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="exportType">
                  <Select style={{width: 130}}>
                    <Select.Option value={null}>选择导入类型</Select.Option>
                    <Select.Option value={4}>司法诉讼</Select.Option>
                    <Select.Option value={3}>资产核销</Select.Option>
                    <Select.Option value={2}>资产转让</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="primary" onClick={beginExport}>
                    开始导入
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <a
                    style={{marginLeft: -30}}
                    onClick={() => setExplainVisible(true)}
                  >
                    查看导入说明
                  </a>
                </Form.Item>
              </Col>
            </Row>
            <p style={{position: 'absolute', left: 30, top: 60}}>
              {exportFileName}
            </p>
          </Form>

          <TableList
            {...{
              list,
              onPage,
              totalData,
              pageParams,
              importData,
            }}
          />
          <Modal
            title="导入说明"
            visible={explainVisible}
            onCancel={() => setExplainVisible(false)}
            okText="确认"
            cancelText="取消"
            footer={null}
            width="700px"
          >
            <p style={{fontWeight: 'bold'}}>
              1）此处下载模板:{' '}
              <a
                onClick={() =>
                  window.open(
                    'https://jdq-01.oss-cn-hangzhou.aliyuncs.com/excel/%E8%B5%84%E4%BA%A7%E6%A0%B8%E9%94%80%E5%90%8D%E5%8D%95.xlsx',
                  )
                }
              >
                资产核销名单导入
              </a>
              &nbsp;&nbsp;
              <a
                onClick={() =>
                  window.open(
                    'https://jdq-01.oss-cn-hangzhou.aliyuncs.com/excel/%E8%B5%84%E4%BA%A7%E8%BD%AC%E8%AE%A9%E5%90%8D%E5%8D%95.xlsx',
                  )
                }
              >
                资产转让名单导入
              </a>
              &nbsp;&nbsp;
              <a
                onClick={() =>
                  window.open(
                    'https://jdq-01.oss-cn-hangzhou.aliyuncs.com/excel/%E5%8F%B8%E6%B3%95%E8%AF%89%E8%AE%BC%E5%90%8D%E5%8D%95.xlsx',
                  )
                }
              >
                司法诉讼名单导入
              </a>
            </p>
            <p style={{fontWeight: 'bold'}}>2）什么时候导入</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分别在资产转让成功/核销成功/向法院提请诉讼后导入；
            </p>
            <p style={{fontWeight: 'bold'}}>3）导入后的影响</p>
            <ul>
              <li>
                <p>
                  资产转让：借据的的资产处置状态标记为【已转让】、同步记账、上报征信、借款人不可再还款；
                </p>
              </li>
              <li>
                <p>
                  资产核销：借据的的资产处置状态标记为【已核销】、同步记账、上报征信；
                </p>
              </li>
              <li>
                <p>
                  司法诉讼：借据的的资产处置状态标记为【已诉讼】、上报征信；
                </p>
              </li>
            </ul>
            <p style={{fontWeight: 'bold'}}>
              4）请严格按照EXCEL模板填写，不可有空单元格；
            </p>
            <ul>
              <li>
                <p>资产转让/资产核销均不可重复导入；</p>
              </li>
              <li>
                <p>资产转让后，不可再诉讼，也不可再核销；</p>
              </li>
              <li>
                <p>核销后，可诉讼，但不可资产转让；</p>
              </li>
              <li>
                <p>诉讼后，可资产转让，也可核销，也可重复诉讼；</p>
              </li>
            </ul>
          </Modal>
          <Modal
            title="操作确认"
            visible={confirmVisible}
            style={{width: 400}}
            onCancel={() => setConfirmVisible(false)}
            footer={[
              <Button key="back" onClick={goBack}>
                返回修改
              </Button>,
              <Button key="submit" type="primary" onClick={subMit}>
                确认提交
              </Button>,
            ]}
          >
            <p style={{fontWeight: 'bold'}}>导入{exportData.typeString}名单</p>
            <p>
              共导入借款人{exportData.userCount}个，借据{exportData.orderCount}
              个，
              {exportData.typeString == '司法诉讼'
                ? '涉及金额'
                : exportData.typeString == '资产转让'
                ? '共转让资产'
                : '共核销资产'}
              {exportData.excelAmount}元。
              {exportData.typeString == '资产转让' ? (
                <span>收入{exportData.incomeAmount}元。</span>
              ) : null}
            </p>
            <p></p>
            <p>导入借据在系统内的剩余未还共{exportData.realAmount} 元。</p>
          </Modal>
        </Space>
      </Spin>
    </Layout>
  )
}
body.getInitialProps = async () => {
  return {}
}

export default body
