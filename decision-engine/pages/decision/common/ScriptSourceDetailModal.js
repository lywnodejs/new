import {message, Modal, Row, Col, Button} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard'

function ScriptSourceDetailModal(props) {
  const {visible, onHide, scriptSource} = props

  const onCopy = () => {
    message.success('已复制至剪切板')
  }
  return (
    <Modal
      title="规则"
      maskClosable={false}
      visible={visible}
      onCancel={onHide}
      width={600}
      height={600}
      footer={[
        <CopyToClipboard text={scriptSource} onCopy={onCopy}>
          <Button type="primary">复制全部内容</Button>
        </CopyToClipboard>,
        <Button onClick={onHide}>关闭</Button>,
      ]}
    >
      <Row>
        <Col span={24}>{scriptSource}</Col>
      </Row>
    </Modal>
  )
}

export default ScriptSourceDetailModal
