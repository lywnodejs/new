/**
 * 用户编辑 角色对应的策略
 * 常用在 用户申请的过程中，选择要申请的角色
 */

import React from 'react';
import _ from 'lodash';

import StrategyPanel from '../StrategyPanel';

import './index.less';

class StrategySetter extends React.Component {
  render() {
    /**
     * value 格式为：
     * {
        roleId1: {
          tagId1: {
            dimeId1: [value1-1, value1-2],
            dimeId2: [value2-1]
          },
          tagId2: {
            dimeId1: [value1-2],
            dimeId3: [value3-1],
          }
          ...
        },
        roleId2: {...},
        ...
     * }
     */
    const {
      strategyList,
      dimensionIdMap,
      roleIdNameMap,
      value,
      t
    } = this.props;
    return (
      <div className="strategy-setter">
        {_.map(strategyList, ({ roleId, strategyDto, tagDimeList }, index) => (
          <StrategyPanel
            data={{
              roleId,
              strategyDto,
              tagDimeList
            }}
            dimesionValue={value[roleId] || {}}
            dimensionIdMap={dimensionIdMap}
            roleIdNameMap={roleIdNameMap}
            key={`${roleId}-${index}`}
            t={t}
          />
        ))}
      </div>
    );
  }
}

export default StrategySetter;
