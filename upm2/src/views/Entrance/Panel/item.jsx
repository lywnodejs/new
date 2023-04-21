import { Avatar, Button, Icon } from 'antd';
import React from 'react';
import { translate } from 'react-i18next';

const MAX_LABEL = 3
const LABEL_HEIGHT = 20

function PanelItem (props) {
  const { children, className, onClick, t } = props
  const max = props.max || MAX_LABEL

  let validComponents = []

  React.Children.forEach(children, component => {
    const { value, className } = component.props

    value != null && validComponents.push(component)
  })

  const height = (max + 1) * LABEL_HEIGHT + 'px'

  return (
    <div className={className + ' entrance-page-panel__item'}>
      <div className="entrance-page-panel__item__title">
        <div className="entrance-page-panel__item__title__icon">
          <Avatar size="large" icon={props.icon} />
        </div>
        {props.title}
      </div>
      <div className="entrance-page-panel__item__content" style={{ lineHeight: height, height }}>
        {validComponents.length === 0
          ? <div className="entrance-page-panel__item__empty">{t('空空如也')}</div>
          : validComponents.length > max
            ? React.Children.map(validComponents, (component, index) => {
              if (index == max) {
                return (
                  <div className="entrance-page-panel__item__label">
                    <div><Icon type="more" /></div>
                    <div><Icon type="more" /></div>
                  </div>
                )
              } else if (index > max) {
                return null
              }
              return component
            })
            : React.Children.map(validComponents, (component, index) => {
              if (index > max - 1) return null
              return component
            })
        }
      </div>
      <div className="entrance-page-panel__item__button">
        <Button type="link" size="small" onClick={onClick}>{props.detailText}</Button>
      </div>
    </div>
  )
}

export default translate()(PanelItem)
