import * as React from 'react';
import { message as Toast } from 'antd';
import { useSafeState } from '@didi/cx-react-hooks';
import { IRule, IStrategyRule, IRuleComposeProps } from './interface';
import { createNewRule, createNewGroup, EventEmitter } from './utils';
import { StrategyRulesRequestService } from './services/fetchStrategyRulesSource';

const noopWithError = () => {
  throw new Error('该函数还未实现');
};

export const RuleComposeContext = React.createContext<
  ReturnType<typeof useUpdateRuleComposeContext>
>({
  isPending: true,
  strategyRules: [],
  eventEmitter: new EventEmitter(),
  addGroup: noopWithError,
  removeGroup: noopWithError,
  addRule: noopWithError,
  removeRule: noopWithError,
  updateRule: noopWithError,
});

export function useUpdateRuleComposeContext(props: IRuleComposeProps) {
  const [isPending, setPending] = useSafeState(false);
  const [strategyRules, setStrategyRules] = useSafeState<IStrategyRule[]>([]);

  const eventEmitter = React.useMemo(() => new EventEmitter(), []);

  // 组件销毁时需要把 eventEmitter 也销毁掉
  React.useEffect(() => {
    return function disposeEventEmitter() {
      eventEmitter.dispose();
    };
  }, [eventEmitter]);

  React.useEffect(() => {
    setPending(true);
    StrategyRulesRequestService.fetch()
      .then(data => {
        setStrategyRules(data);
      })
      .catch(error => {
        Toast.error(error.message);
      })
      .finally(() => {
        setPending(false);
      });
  }, []);

  return {
    isPending,
    strategyRules,

    eventEmitter,

    /**
     * 添加新的分组，默认会添加一条空的规则
     */
    addGroup() {
      props.onChange([...props.value, createNewGroup()]);
    },

    /**
     * 删除分组
     * @param group
     */
    removeGroup(groupFrontId: string) {
      props.onChange(
        props.value.filter(item => item.$frontId !== groupFrontId),
      );
    },

    /**
     * 向分组中添加新的规则
     * @param groupFrontId 分组ID
     * @param ruleFrontId 前一条规则ID
     */
    addRule(groupFrontId: string, ruleFrontId: string) {
      props.onChange(
        props.value.map(item => {
          if (item.$frontId === groupFrontId) {
            const index = item.strategyConfigRules.findIndex(
              vv => vv.$frontId === ruleFrontId,
            );
            return {
              ...item,
              strategyConfigRules:
                index === -1
                  ? [...item.strategyConfigRules, createNewRule(item)]
                  : [
                      ...item.strategyConfigRules.slice(0, index + 1),
                      createNewRule(item),
                      ...item.strategyConfigRules.slice(index + 1),
                    ],
            };
          }
          return item;
        }),
      );
    },

    /**
     * 删除指定规则
     * @param groupFrontId
     */
    removeRule(ruleFrontId: string) {
      props.onChange(
        props.value.map(item => {
          return {
            ...item,
            strategyConfigRules: item.strategyConfigRules.filter(
              rule => rule.$frontId !== ruleFrontId,
            ),
          };
        }),
      );
    },

    /**
     * 修改指定规则
     * @param groupFrontId
     */
    updateRule(ruleFrontId: string, patches: Partial<IRule>) {
      props.onChange(
        props.value.map(item => {
          return {
            ...item,
            strategyConfigRules: item.strategyConfigRules.map(rule => {
              if (rule.$frontId === ruleFrontId) {
                return { ...rule, ...patches };
              }
              return rule;
            }),
          };
        }),
      );
    },
  };
}
