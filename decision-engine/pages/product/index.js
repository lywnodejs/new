import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Modal} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/product'
import UpdateForm from './UpdateForm'
import TableList from './TableList'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const breadcrumbs = [{text: '产品管理'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectIndex, setIndex] = useState(-1)
  const [selectItem, setSelectItem] = useState({})
  const [copyVisible, setCopyVisible] = useState(false)
  const [initId, setInitId] = useState([])
  const [initProductId, setInitProductId] = useState([])
  useEffect(() => {
    async function fetchData() {
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_products()
      if (code === 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
    setSelectItem({})
  }

  const onEdit = (item) => {
    setIndex(item.id)
    setVisible(true)
    setSelectItem(item)
    setInitProductId(item.produceId)
  }

  const deleteOk = async (record) => {
    try {
      const {data} = await api.delete_product({
        produceId: record.produceId,
        delete: 1,
      })
      if (data.code == 0) {
        message.success('删除成功')
        fetchList()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const goJump = async (record) => {
    location.href = `/decision/produce?productId=${record.produceId}`
  }
  const onDelete = async (item) => {
    let {
      data: {code, data},
    } = await api.delete_product({produceId: item.produceId})
    setInitProductId(item.produceId)
    if (code == 0) {
      Modal.confirm({
        title: `${data ? `该产品下存在决策${data}个。` : '你确定要删除么？'}`,
        icon: <ExclamationCircleOutlined />,
        content: `${
          data
            ? `请先查看并删除相关决策，才可删除该产品。`
            : `该产品下没有决策。`
        }`,
        okText: `${data ? '查看相关决策' : '确定'}`,
        async onOk() {
          data ? goJump(item) : deleteOk(item)
        },
      })
    }
  }
  const copyText = (item) => {
    setCopyVisible(true)
    setInitId(item.produceId)
  }
  const onCopy = () => {
    message.success('产品ID复制成功。')
  }
  const onCancel = () => {
    setCopyVisible(false)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form>
          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
        </Form>

        <TableList
          {...{
            list,
            onEdit,
            onDelete,
            copyText,
          }}
        />
        <UpdateForm
          {...{
            selectIndex,
            visible,
            onHide: () => setVisible(false),
            selectItem,
            pullData: fetchList,
            setVisible,
            initProductId,
          }}
        />
        <Modal
          title="复制产品ID"
          visible={copyVisible}
          // onOk={onEdit}
          onCancel={onCancel}
          destroyOnClose={true}
          footer={[
            <CopyToClipboard text={initId} onCopy={onCopy}>
              <Button type="primary">复制全部内容</Button>
            </CopyToClipboard>,
            <Button key="back" onClick={onCancel}>
              关闭
            </Button>,
          ]}
        >
          <span>{initId}</span>
        </Modal>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
