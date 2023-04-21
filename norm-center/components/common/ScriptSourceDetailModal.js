import {message, Modal, Row, Col, Button} from 'antd'
import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const ReactJson = dynamic(() => import('react-json-view'), {ssr: false})

function ScriptSourceDetailModal(props) {
  const {visible, onHide, scriptSource, title} = props
  const [newScriptSource, setNewScriptSource] = useState({})

  useEffect(() => {
    function fetchData() {
      try {
        setNewScriptSource(JSON.parse(scriptSource))
      } catch (e) {}
    }
    fetchData()
  }, [scriptSource])

  const onCopy = () => {
    message.success('已复制至剪切板')
  }
  return (
    <Modal
      title={title ? title : '规则'}
      maskClosable={false}
      visible={visible}
      onCancel={onHide}
      width={600}
      height={600}
      centered={true}
      footer={[
        <CopyToClipboard text={scriptSource} onCopy={onCopy}>
          <Button type="primary">复制全部内容</Button>
        </CopyToClipboard>,
        <Button onClick={onHide}>关闭</Button>,
      ]}
    >
      {title != 'Body' && (
        <Row>
          <Col span={24}>{scriptSource}</Col>
        </Row>
      )}

      {title == 'Body' && (
        <div style={{height: '360px', overflowY: 'scroll'}}>
          <ReactJson
            src={newScriptSource}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            theme="monokai"
            style={{minHeight: '360px'}}
          />
        </div>
      )}
    </Modal>
  )
}

export default ScriptSourceDetailModal
