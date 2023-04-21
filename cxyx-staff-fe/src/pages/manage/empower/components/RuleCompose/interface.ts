/**
 * 规则组
 */
export interface IRuleGroup {
  id?: number; // 当前数据的ID
  configId?: number;
  strategyId?: number;
  $frontId: string; // 前端使用的ID，不提交到后端，用来做唯一值的，因为新建的数据没有ID值
  strategyConfigRules: IRule[];
}

/**
 * 规则
 */
export interface IRule {
  id?: number; // 当前数据的ID
  configId?: number;
  strategyId?: number;
  $frontId: string; // 前端使用的ID，不提交到后端，用来做唯一值的，因为新建的数据没有ID值
  paramId: number;
  conditionId: number;
  value: Array<{ value: string }>;
}

/**
 * 参数类型
 *  - 0: 普通类型
 *  - 1: 树类型
 */
export enum EParamType {
  /**
   * 数组类型
   */
  Array = 0,

  /**
   * 树类型
   */
  Tree = 1,
}

/**
 * 参数值类型
 *  - 0: 从接口获取
 *  - 1: 指定的数组值
 */
export enum EParamValueType {
  /**
   * 从接口获取
   */
  API = 0,

  /**
   * 指定的数组值
   */
  SpecificArray = 1,
}

export interface IStrategyRule {
  id: number;
  paramName: string;
  paramField: string;
  paramStatus: 0 | 1; // 0-启用 1-下架
  paramCondition: Array<{
    id: number;
    name: string;
    desc: string;
    connector: string;
  }>;
  paramType: EParamType; // 0为普通类型 1为树类型
  paramValueType: EParamValueType; // 0为从接口获取，1 为指定的数组
  paramValue: string;
}

export interface IRuleComposeProps {
  disabled?: boolean;
  value: IRuleGroup[];
  onChange(groups: IRuleGroup[]): void;
}
