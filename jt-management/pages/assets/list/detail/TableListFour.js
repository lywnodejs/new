import React, {useEffect, useState} from 'react'
import {Table, Button, Modal, message, Form, Input, Radio} from 'antd'
import apiAssets from '~/api/assets'

const {TextArea} = Input

const TableListThree = ({protectionRecord, fetchData}) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [recordId, setRecordId] = useState([])
  const columns = [
    {
      title: '发起人',
      dataIndex: 'launchName',
      key: 'launchName',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            <p>{row.launchName}</p>
            <p>{row.launchTime}</p>
          </div>
        )
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '发起人备注',
      dataIndex: 'launchRemark',
      key: 'launchRemark',
      width: 150,
      render: (text, record, row) => {
        if (record.type == 2 || record.type == 3 || record.type == 4) {
          return <p>/</p>
        } else {
          return <p>{text}</p>
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      width: 150,
      render: (record, row) => {
        if (row.type != 5) {
          return <span>{row.typeString}</span>
        }
        if (row.type == 5) {
          return row.examineStatus == 0
            ? '审核中'
            : row.examineStatus == 1
            ? '通过'
            : '不通过'
        }
      },
    },
    {
      title: '审核人备注',
      dataIndex: 'examineRemark',
      key: 'examineRemark',
      width: 150,
      render: (text, record, row) => {
        if (
          record.type == 2 ||
          record.type == 3 ||
          record.type == 4 ||
          record.examineStatus == 0
        ) {
          return <p>/</p>
        } else {
          return <p>{text}</p>
        }
      },
    },

    {
      title: '审核人',
      dataIndex: 'examineName',
      key: 'examineName',
      width: 150,
      render: (record, row) => {
        if (row.examineStatus == 0) {
          return <a onClick={() => verify(row)}>审核</a>
        } else if (row.type == 2 || row.type == 3 || row.type == 4) {
          return <p>/</p>
        } else {
          return (
            <div>
              <p>{row.examineName}</p>
              <p>{row.examineTime}</p>
            </div>
          )
        }
      },
    },
  ]
  const verify = (row) => {
    setVisible(true)
    setRecordId(row.id)
  }
  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_verify_deduction({
        ...values,
        id: recordId,
      })
      if (code == 0) {
        message.success('提交成功')
        fetchData()
        setVisible(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <Table
        rowKey={(record) => record.launchName + Math.random()}
        dataSource={protectionRecord}
        columns={columns}
        bordered
        scroll={{y: '100%', x: '100%'}}
        style={{marginTop: 20}}
      />
      <Modal
        visible={visible}
        title="资产保全审核"
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            提交
          </Button>,
        ]}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} key={Date.now} name="form" style={{marginLeft: 20}}>
          <Form.Item
            label="审核结果"
            name="examineStatus"
            rules={[{required: true, message: '请选择审核结果'}]}
          >
            <Radio.Group>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>拒绝</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="原因备注"
            name="examineRemark"
            rules={[{required: true, message: '请输入原因备注'}]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TableListThree
