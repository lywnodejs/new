import * as React from 'react';
import { Select, Form } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useSafeState } from '@didi/cx-react-hooks';
import { IRule } from '../interface';
import { RuleComposeContext } from '../context';

export function RuleParamSelect(
  props: Omit<SelectProps<IRule['paramId']>, 'children' | 'options'>,
) {
  const { strategyRules, eventEmitter } = React.useContext(RuleComposeContext);

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
      <Select
        {...props}
        onChange={(value, option) => {
          props.onChange(value, option);
          setValueChanged(true);
        }}
      >
        {strategyRules.map(item => {
          return (
            <Select.Option
              key={item.id}
              value={item.id}
              disabled={item.paramStatus !== 0} // 0-启用 1-下架
            >
              {item.paramName || item.id}
              {item.paramStatus !== 0 ? '(禁用)' : ''}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
}
