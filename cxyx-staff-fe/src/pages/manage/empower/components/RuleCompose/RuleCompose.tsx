import * as React from 'react';
import { Button } from 'antd';
import { IRuleComposeProps } from './interface';
import { RuleGroup } from './RuleGroup';
import { RuleComposeContext, useUpdateRuleComposeContext } from './context';

export const RuleCompose = React.forwardRef(function RuleCompose(
  props: IRuleComposeProps,
  ref,
) {
  const { value: groups } = props;

  const context = useUpdateRuleComposeContext(props);

  React.useImperativeHandle(ref, () => {
    return {
      async validate() {
        // 触发校验事件
        // 表单组件会通过 eventEmitter.on('validate', fnc)
        // 来监听该事件从而进行一些逻辑的处理
        context.eventEmitter.emit('validate');
        for (const group of groups) {
          for (const rule of group.strategyConfigRules) {
            if (
              !rule.paramId ||
              !rule.conditionId ||
              !rule.value ||
              !rule.value.length
            ) {
              return Promise.reject('规则未填写完整');
            }
          }
        }
        return Promise.resolve(groups);
      },
    };
  });

  return (
    <RuleComposeContext.Provider value={context}>
      {groups.map((group, index) => {
        return (
          <div key={group.$frontId}>
            <RuleGroup
              group={group}
              count={groups.length}
              disabled={props.disabled || context.isPending}
              loading={context.isPending}
            />
            {index < groups.length - 1 && (
              <div style={{ color: '#666', userSelect: 'none' }}>或</div>
            )}
          </div>
        );
      })}
      <Button
        ghost={true}
        type="primary"
        size="small"
        style={{ width: '100%', marginTop: 15 }}
        onClick={context.addGroup}
        disabled={props.disabled}
      >
        添加新规则组
      </Button>
    </RuleComposeContext.Provider>
  );
});
