import React, {useState} from 'react'
import {FLOWCONFIG, VARIABLETABS} from '~/utils/const'
import RuleFlowTrayItem from './RuleFlowTrayItem'

const RuleFlowList = () => {
  const [flowTrayItems, setFlowTrayItems] = useState(FLOWCONFIG)
  return (
    <div className="flow-left-tab">
      {flowTrayItems.length
        ? flowTrayItems.map(
            ({referenceType, ptype, type, name, color, bgColor, idCard}) => (
              // 组件列表：开始、结束、规则集...
              <RuleFlowTrayItem
                key={idCard}
                {...{
                  color,
                  bgColor,
                  name,
                  model: {
                    referenceType: ptype === 'out' ? referenceType : null,
                    ptype,
                    type,
                  },
                }}
              />
            ),
          )
        : null}
    </div>
  )
}

export default RuleFlowList
