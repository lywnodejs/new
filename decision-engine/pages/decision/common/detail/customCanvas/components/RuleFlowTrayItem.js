import React, {useState, useEffect} from 'react'
import {
  PlayCircleFilled,
  PoweroffOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'

const RuleSetTableList = ({color, model, name, bgColor}) => {
  const [itemType, setItemType] = useState(null)
  useEffect(() => {
    setItemType(model.referenceType)
  }, [])
  const itemIcon = () => {
    if (itemType === 0) {
      return <PlayCircleFilled />
    }
    if (itemType === 99) {
      return <PoweroffOutlined />
    }
    if (itemType === 1 || itemType === 2 || itemType === 3 || itemType === 4) {
      return <ApartmentOutlined />
    }
    return <ApartmentOutlined />
  }
  return (
    <div
      className="flow-item"
      style={{
        borderColor: color,
        background: bgColor,
        color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('storm-diagram-node', JSON.stringify(model))
      }}
    >
      <p>{itemIcon()}</p>
      <p>{name}</p>
    </div>
  )
}

export default RuleSetTableList
