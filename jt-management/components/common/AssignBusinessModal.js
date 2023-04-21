import {Row, Col, message, Modal, Form, TreeSelect} from 'antd'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/business'
import styles from '~/pages/business/list/index.less'

function AssignModal(props) {
  const {visible, onHide, orderIds, onAssignSubmit} = props
  const [form] = Form.useForm()
  const [userList, setUserList] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    function fetchData() {
      fetchList()
    }
    visible && fetchData()
  }, [visible])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getUsers()
      if (code == 0) {
        tansvertKey(data, 1)
        setUserList(data)
        console.log(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const tansvertKey = (mem, level) => {
    if (Array.isArray(mem) && mem.length) {
      for (let i = 0; i < mem.length; i++) {
        setCommonKey(mem[i], level)
        tansvertKey(mem[i].children)
      }
    }
  }

  const setCommonKey = (one, level) => {
    one.title = `${one.name}`
    one.disabled = level === 1
    // one.value = `${one.id}-${new Date().getTime() + (Math.random()*1000).toFixed(0)}`
    one.value = `${one.id}-${
      new Date().getTime() + (Math.random() * 1000).toFixed(0)
    }`
    // one.key = `${one.id}`
    // one.key = String(new Date().getTime() + one.id)
  }

  const onEdit = async () => {
    if (!value) {
      return message.error(`请选择要分配的${'信审员'}`)
    }
    let arr = value.split('-')
    let giveAccountManagerId = arr[0]

    if (onAssignSubmit) {
      typeof onAssignSubmit === 'function' &&
        onAssignSubmit({
          orderIds,
          giveAccountManagerId,
        })
    }
  }
  const onChange = (value) => {
    setValue(value)
  }
  return (
    <Modal
      title="选择分配"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={600}
      height={600}
    >
      <Row gutter={[0, 16]}>
        <Col span={4}>选中数量：</Col>
        <Col span={20}>
          {Array.isArray(orderIds) ? orderIds.length : 0}个，请选择分配对象
        </Col>
      </Row>

      <TreeSelect
        dropdownClassName={styles.businessBox}
        style={{width: '100%'}}
        value={value}
        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
        treeData={userList}
        placeholder="请选择"
        treeDefaultExpandAll
        onChange={onChange}
      />
    </Modal>
  )
}

export default AssignModal
