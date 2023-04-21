import { Row, Col } from 'antd';
import React from 'react';

import './style.less'

function Panel (props) {
  return (
    <div className="entrance-page-panel">
      <div className="entrance-page-panel__header">
        <div className="entrance-page-panel__header__title">
          {props.title}
        </div>
        <div className="entrance-page-panel__header__custom">
          {props.custom}
        </div>
      </div>
      <div className="entrance-page-panel__content">
        <Row gutter={10}>
          {React.Children.toArray(props.children).map((item) => {
            return (
              <Col span={24 / React.Children.count(props.children)} style={{ height: '257px', margin: 'auto', position: 'relative' }} key={item.key}>{item}</Col>
            )
          })}
        </Row>
      </div>
    </div>
  )
}

export default Panel
