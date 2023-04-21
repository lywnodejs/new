import React from 'react'
import {Button} from 'antd'

const AddFlowFooter = (props) => {
  const {onCancel, onOk} = props
  return (
    <div>
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" onClick={onOk}>
        下一步
      </Button>
    </div>
  )
}

export default AddFlowFooter
