import * as React from 'react';
import { Select, Form } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useSafeState } from '@didi/cx-react-hooks';
import { IRule } from '../interface';
import { RuleComposeContext } from '../context';

export function RuleConditionSelect(
  props: {
    paramId: IRule['paramId'];
  } & Omit<SelectProps<IRule['conditionId']>, 'children' | 'options'>,
) {
  const { paramId, ...restProps } = props;
  const { strategyRules, eventEmitter } = React.useContext(RuleComposeContext);

  const conditions = React.useMemo(() => {
    const rule = strategyRules.find(item => item.id === props.paramId);
    return rule?.paramCondition || [];
  }, [props.paramId, strategyRules]);

  const [isValueChanged, setValueChanged] = useSafeState(false);

  const isValueError = !props.value;

  React.useEffect(() => {
    // 注意，这里的 return 不能少，因为在组件销毁时需要把监听事件也取消
    return eventEmitter.on('validate', () => {
      setValueChanged(true);
    });
  }, []);

  return (
    <Form.Item
      style={{ marginBottom: 0 }}
      validateStatus={isValueChanged && isValueError ? 'error' : undefined}
    >
      <Select {...restProps}>
        {conditions.map(item => {
          return (
            <Select.Option key={item.id} value={item.id}>
              {item.desc || item.name || item.id}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
}
