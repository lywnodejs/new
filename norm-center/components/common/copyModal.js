import {Modal, Row, Col, Button, message} from 'antd'
import copy from 'copy-to-clipboard'
import dynamic from 'next/dynamic'
const ReactJson = dynamic(import('react-json-view'), {
  ssr: false,
})
import JsonTree from '~/components/common/JsonTree'
import {useEffect, useState} from 'react'

export default function CopyModal(props) {
  const [_props, setProps] = useState(props)
  useEffect(() => {
    if (props.show) {
      setProps({...props})
    }
  }, [props])

  const copyText = () => {
    if (copy(JSON.stringify(props.data))) {
      message.success('复制成功')
    }
  }
  return (
    <Modal
      title={_props.title || '逻辑'}
      footer={null}
      onCancel={() => props.close()}
      visible={props.show}
      centered={true}
    >
      <div style={{marginBottom: 20}}>
        {typeof _props.data === 'string' ? (
          <p
            dangerouslySetInnerHTML={{
              __html: _props.data && _props.data.replace(/\n/g, '<br>'),
            }}
          ></p>
        ) : (
          <JsonTree data={_props.data} />
        )}
      </div>

      <Row align="center">
        <Col span={12}>
          <a onClick={copyText}>复制全部内容</a>
        </Col>
        <Col span={12} style={{textAlign: 'right'}}>
          <Button type="primary" onClick={() => props.close()}>
            关闭
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}
