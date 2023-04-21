import {Button, Card, message} from 'antd'
import copy from 'copy-to-clipboard'
import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react'
const ReactJson = dynamic(() => import('react-json-view'), {ssr: false})
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {ssr: false})

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

function ParamsDetail(props) {
  const [codeMirror, setCodeMirror] = useState(null)
  const [showVal, setShowVal] = useState(null)

  useEffect(() => {
    import('codemirror/keymap/sublime')
    import('codemirror/mode/sql/sql')
  }, [])

  useEffect(() => {
    if (props.content) {
      let jsonData = ''
      if (isJSON(props.content)) {
        jsonData = JSON.stringify(JSON.parse(props.content), null, '\t')
        setShowVal(jsonData)
      } else {
        jsonData = props.content
        setShowVal(jsonData)
      }
    } else {
      setShowVal('{}')
    }
  }, [props.content])

  const onCopy = () => {
    copy(props.content)
    message.info('已复制到粘贴板')
  }

  const changeData = (instance) => {
    if (!codeMirror) {
      setCodeMirror(instance)
    }
  }

  return (
    <Card
      title={props.title}
      actions={[
        <div>
          <Button type="link" onClick={onCopy}>
            复制全部内容
          </Button>
        </div>,
      ]}
    >
      <div style={{wordBreak: 'break-all'}}>
        {/* <ReactJson
          src={JSON.parse(props.content)}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={true}
          name={null}
          theme="monokai"
          style={{minHeight: '360px'}}
        /> */}
        {showVal && (
          <CodeMirror
            value={showVal}
            height={614}
            options={{
              theme: 'monokai',
              keyMap: 'sublime',
              json: true,
              mode: 'javascript',
            }}
            onChange={(v) => changeData(v)}
          />
        )}
      </div>
    </Card>
  )
}

export default ParamsDetail
