import { IRule, IRuleGroup } from '../interface';

let ruleFrontId = 0;

export function createRuleFrontId() {
  return String(++ruleFrontId);
}

/**
 * 创建一个新的规则
 */
export function createNewRule(group: IRuleGroup): IRule {
  return {
    configId: group.id,
    strategyId: group.strategyId,
    $frontId: createRuleFrontId(),
    paramId: undefined,
    conditionId: undefined,
    value: undefined,
  };
}
