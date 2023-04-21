import {Row, Col, message, Modal, Select} from 'antd'
import {useEffect, useState} from 'react'

function AssignModal(props) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [ids, setIds] = useState([])

  useEffect(() => {
    setVisible(props.visible)
    if (props.visible) {
      setLoading(false)
      setIds([])
    }
  }, [props.visible])

  const onChange = (e) => {
    setIds(e)
  }
  const onEdit = () => {
    if (ids.length == 0) {
      return message.error('请选择分配对象')
    }
    let params = {
      accountIdList: [...ids],
      accountNameList: [],
      companyIdList: [1],
      type: 1,
    }
    ids.forEach((id) => {
      let item = props.showList.find((item) => item.id == id)
      params.accountNameList.push(item.accountName)
    })
    setLoading(true)
    props.onOk(params, onFail)
  }

  const onFail = () => {
    setLoading(false)
  }

  return (
    <Modal
      title="选择分配"
      visible={visible}
      confirmLoading={loading}
      onOk={onEdit}
      onCancel={props.onHide}
      cancelText="取消"
      okText="确定"
      width={600}
    >
      <div style={{marginBottom: 20}}>
        选中数量 {props.showNumber || 0} 个，请选择分配对象
      </div>

      <Row>
        <Col>人员：</Col>
        <Col>
          {Array.isArray(props.showList) ? (
            <Select
              value={ids}
              onChange={onChange}
              mode="multiple"
              style={{width: 450}}
            >
              {props.showList.map((v, i) => {
                return (
                  <Select.Option value={v.id} key={i}>
                    {v.accountName}_{v.roleName}
                  </Select.Option>
                )
              })}
            </Select>
          ) : null}
        </Col>
      </Row>
    </Modal>
  )
}

export default AssignModal
