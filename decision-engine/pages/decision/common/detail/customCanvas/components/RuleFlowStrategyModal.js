import {Form, Select, Modal, Row, message, Input, Button, Table} from 'antd'
import {useEffect, useState} from 'react'
import {findFieldByKey, findNameByKey} from '../../../mapActionToApi'

function CopyStrategyModal(props) {
  const {
    visible,
    onHide,
    strategyList,
    category,
    activeCategoryKey,
    onSave,
    selectItem,
    onSearch,
  } = props
  const [copyStrategyForm] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    function fetchData() {
      let findNode = strategyList.find(
        (one) => one[findFieldByKey(+category, 'name')] == selectItem.nodeName,
      )
      if (findNode) {
        setSelectedRowKeys([findNode.id])
      } else {
        setSelectedRowKeys([])
      }
    }
    visible && fetchData()
    // onEdit()
  }, [visible, strategyList])

  const onEdit = async () => {
    try {
      if (!selectedRowKeys.length) {
        return message.error('请选择内容')
      }
      onSave({strategyId: selectedRowKeys[0]})
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const columns = [
    {
      title: '编号',
      dataIndex: findFieldByKey(+category, 'code'),
      key: findFieldByKey(+category, 'code'),
      width: 150,
    },
    {
      title: '名称',
      dataIndex: findFieldByKey(+category, 'name'),
      key: findFieldByKey(+category, 'name'),
      width: 150,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
  ]

  const rowSelectionConfig = {
    type: 'radio',
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v, selectedRows) => {
      setSelectedRowKeys(v)
    },
  }
  const onReset = () => {
    copyStrategyForm.resetFields()
  }
  return (
    <Modal
      title="请选择"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={660}
      height={600}
    >
      <Form
        key={Date.now}
        form={copyStrategyForm}
        layout="inline"
        name="copyStrategyForm"
        initialValues={{
          keyword: '',
        }}
        onFinish={(values) =>
          onSearch(
            {
              ...values,
            },
            category,
          )
        }
      >
        <Form.Item label={findNameByKey(+category)} name="keyword">
          <Input placeholder="请输入" />
        </Form.Item>
        <Button type="primary" style={{marginRight: 15}} htmlType="submit">
          查询
        </Button>

        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>

        <Table
          rowKey="id"
          dataSource={strategyList}
          columns={columns}
          bordered
          pagination={false}
          rowSelection={rowSelectionConfig}
          scroll={{y: '100%', x: '100%'}}
          size={'small'}
          onRow={(record) => {
            return {
              onClick: (event) => {
                event.currentTarget
                  .getElementsByClassName('ant-radio-wrapper')[0]
                  .click()
              },
            }
          }}
        />
      </Form>
    </Modal>
  )
}

export default CopyStrategyModal
