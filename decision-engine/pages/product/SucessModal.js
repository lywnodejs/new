import {Modal, Result, Button} from 'antd'
import {useEffect} from 'react'
import Router, {withRouter} from 'next/router'

function SucessModal(props) {
  const {visible, onHide} = props

  const onEdit = () => {
    let url = `/norm/base/add`
    Router.push(url)
  }

  return (
    <Modal
      title=""
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      footer={null}
    >
      <Result
        status="success"
        title="产品配置成功"
        extra={[
          <Button type="primary" key="console" onClick={onEdit}>
            继续,决策配置
          </Button>,
          <Button key="buy" onClick={onHide}>
            关闭
          </Button>,
        ]}
      />
    </Modal>
  )
}

export default SucessModal
