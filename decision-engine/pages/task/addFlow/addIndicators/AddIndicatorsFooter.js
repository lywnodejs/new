import React from 'react'
import {Button} from 'antd'

const AddIndicatorsFooter = (props) => {
  const {onCancel, onOk} = props
  return (
    <div>
      <Button onClick={onCancel}>上一步</Button>
      <Button onClick={onOk} type="primary">
        确认
      </Button>
    </div>
  )
}

export default AddIndicatorsFooter
