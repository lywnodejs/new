import {useEffect, useState} from 'react'

function useResetCollapsed(formReactElement) {
  let resetFields = []
  let newFormReactElement = formReactElement.slice(6)
  newFormReactElement.forEach((one) => {
    if (!one.props.name) {
      one.props.children.forEach((item) => {
        if (item.type !== 'span') {
          resetFields.push(item.props.name)
        }
      })
    } else {
      resetFields.push(one.props.name)
    }
  })
  return resetFields
}

export default useResetCollapsed
