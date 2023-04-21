import { IRuleGroup } from '../interface';
import { createNewRule } from './createNewRule';

let groupFrontId = 0;

export function createGroupFrontId() {
  return String(++groupFrontId);
}

/**
 * 创建一个新的分组
 */
export function createNewGroup(strategyId?: number): IRuleGroup {
  const group: IRuleGroup = {
    strategyId,
    $frontId: createGroupFrontId(),
    strategyConfigRules: [],
  };
  group.strategyConfigRules.push(createNewRule(group));
  return group;
}
