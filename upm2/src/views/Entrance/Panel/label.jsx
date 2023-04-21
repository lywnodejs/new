import React from 'react';
import { Popover, Icon, Tooltip } from 'antd';

function PanelLabel (props) {
  const { formatter, value, label, title, content } = props
  const titleNode = <div>
    <span>{title || label}：</span><br />
    {content}
  </div >
  if (value == null) return null
  return (
    <div className="entrance-page-panel__item__label">
      {/* <div>{label}{content ? <Popover placement="rightTop" title={title || label} content={content}> <Icon type="question-circle" theme="filled" /></Popover> : null}</div> */}
      <div>{label}{content ? <Tooltip placement="bottomLeft" title={
        titleNode
      } > <Icon type="question-circle" theme="filled" /></Tooltip> : null}</div>
      <div>{typeof formatter === 'function' ? formatter(value) : value}</div>
    </div>
  )
}

export default PanelLabel
