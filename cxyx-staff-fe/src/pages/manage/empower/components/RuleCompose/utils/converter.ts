import { IRuleGroup } from '../interface';
import { createGroupFrontId, createRuleFrontId } from '../utils';

/**
 * 将接口返回的数据转为组件接收的数据格式
 * @param groups 规则分组
 */
export function convertFormDataToValue(
  strategyConfigformData: IRuleGroup[],
): IRuleGroup[] {
  return strategyConfigformData.map(group => {
    return {
      ...group,
      $frontId: createGroupFrontId(),
      strategyConfigRules: group.strategyConfigRules.map(rule => {
        return {
          ...rule,
          $frontId: createRuleFrontId(),
        };
      }),
    };
  });
}

/**
 * 将组件的数据格式转化为接口需要的数据格式
 * @param groups 规则分组
 */
export function convertValueToFormData(groups: IRuleGroup[]): IRuleGroup[] {
  // 将 $frontId 去掉，改字段不需要提交到后端
  return groups.map(group => {
    return {
      ...group,
      $frontId: undefined,
      strategyConfigRules: group.strategyConfigRules.map(rule => {
        return {
          ...rule,
          $frontId: undefined,
        };
      }),
    };
  });
}
