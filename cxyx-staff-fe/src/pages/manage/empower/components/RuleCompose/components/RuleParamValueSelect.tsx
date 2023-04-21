import * as React from 'react';
import { SelectProps } from 'antd/lib/select';
import { IRule, EParamType } from '../interface';
import { RuleComposeContext } from '../context';
import { RuleParamValueArraySelect } from './RuleParamValueArraySelect';
import { RuleParamValueTreeSelect } from './RuleParamValueTreeSelect';

export interface IRuleParamValueSelectProps
  extends Pick<
    SelectProps<IRule['value']>,
    | 'value'
    | 'placeholder'
    | 'className'
    | 'style'
    | 'disabled'
    | 'loading'
    | 'size'
  > {
  paramId: IRule['paramId'];
  onChange(value: IRule['value']): void;
}

export function RuleParamValueSelect(props: IRuleParamValueSelectProps) {
  const { paramId } = props;
  const { strategyRules } = React.useContext(RuleComposeContext);

  const rule = React.useMemo(() => {
    return strategyRules.find(item => item.id === paramId);
  }, [paramId, strategyRules]);

  return rule && rule.paramType === EParamType.Tree ? (
    <RuleParamValueTreeSelect {...props} />
  ) : (
    <RuleParamValueArraySelect {...props} />
  );
}
