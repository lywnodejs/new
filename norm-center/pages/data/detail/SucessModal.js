import {Modal, Result, Button} from 'antd'
import {useEffect} from 'react'
import Router, {withRouter} from 'next/router'

function SucessModal(props) {
  const {visible, onHide} = props

  useEffect(() => {
    function fetchData() {}
    visible && fetchData()
  }, [visible])

  const onEdit = () => {
    let url = `/norm/base/add`
    let type = Router.router.query.tab == 1 ? 'interFace' : 'data'
    url += `?type=${type}`
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
      centered={true}
    >
      <Result
        status="success"
        title="数据源保存成功"
        extra={[
          <Button type="primary" key="console" onClick={onEdit}>
            继续，指标加工
          </Button>,
          <Button key="buy" onClick={onHide}>
            返回
          </Button>,
        ]}
      />
    </Modal>
  )
}

export default SucessModal
