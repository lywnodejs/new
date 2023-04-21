import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Table, Button, Card, Form, Input, Badge, Modal, message} from 'antd'
import {InfoCircleTwoTone} from '@ant-design/icons'
import apiReview from '~/api/review'

const TableList = ({list, onSearch, productId, personnelList}) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [rowsData, setRowsData] = useState([])

  const columns = [
    {
      title: '委案人员姓名',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 180,
    },
    {
      title: '分案级别',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'isOnLine',
      key: 'isOnLine',
      width: 180,
      render: (text) => {
        return (
          <React.Fragment>
            <Badge status={text == 1 ? 'success' : 'error'} />
            {text == 1 ? '在岗' : '离岗'}
          </React.Fragment>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'CZ',
      key: 'CZ',
      width: 180,
      render: (record, row) => {
        if (row.isOnLine == 1) {
          return <a onClick={() => demobilized(row)}>离岗</a>
        } else {
          return <a onClick={() => demobilized(row)}>在岗</a>
        }
      },
    },
  ]

  const demobilized = (row) => {
    setVisible(true)
    setRowsData(row)
  }

  const reset = () => {
    form.resetFields()
    onSearch()
  }

  const handleOk = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_updateStatus_list({
        productId,
        accountId: rowsData.id,
        accountStatus: rowsData.isOnLine == 1 ? 2 : 1,
      })
      if (code == 0) {
        message.success('人员状态切换成功')
        setVisible(false)
        personnelList({productId: productId})
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <Card>
        <div>
          <Form
            form={form}
            onFinish={(values) => {
              onSearch(values)
            }}
            layout="inline"
            className="searchForm"
            initialValues={{}}
          >
            <Form.Item label="委案人员姓名" name="accountName">
              <Input placeholder="请输入" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 15}} onClick={reset}>
              重置
            </Button>
          </Form>
        </div>
        <Table
          style={{marginTop: 20}}
          rowKey="id"
          columns={columns}
          dataSource={list}
          bordered
          scroll={{y: '100%', x: '100%'}}
        />
        <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={() => setVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <p>
            <InfoCircleTwoTone /> &nbsp;&nbsp; 切换
            <span style={{color: '#1890ff', fontWeight: 'bold'}}>
              {' '}
              &nbsp;{`${rowsData.accountName}`}&nbsp;
            </span>
            状态从
            <span style={{color: '#e65a6b'}}>
              &nbsp;{`${rowsData.isOnLine == 1 ? '在岗' : '离岗'}`}&nbsp;
            </span>
            变更为
            <span style={{color: '#e65a6b'}}>
              &nbsp;{`${rowsData.isOnLine == 1 ? '离岗' : '在岗'}`}&nbsp;,
            </span>
            确认这个操作吗？
          </p>
        </Modal>
      </Card>
    </Layout>
  )
}

export default TableList
