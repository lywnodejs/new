import * as React from 'react';
import { Select, message as Toast, Form } from 'antd';
// import { SelectProps } from 'antd/lib/select';
import { useSafeState } from '@didi/cx-react-hooks';
import { IRule, EParamValueType } from '../interface';
import { RuleComposeContext } from '../context';
import { IRuleParamValueSelectProps } from './RuleParamValueSelect';
import { ParamValueSourceRequestService } from '../services/fetchStrategyRuleParamValueSource';

export function RuleParamValueArraySelect(props: IRuleParamValueSelectProps) {
  const { paramId, value, ...restProps } = props;

  const { isPending, options, eventEmitter } = useParamValueOptionStore(
    paramId,
  );

  const selectedValue = React.useMemo(() => {
    return (value || []).map(item => item.value);
  }, [value]);

  const [isValueChanged, setValueChanged] = useSafeState(false);

  const isValueError = !props.value || !props.value.length;

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
        {...restProps}
        value={selectedValue}
        mode="multiple"
        optionFilterProp="children"
        loading={props.loading || isPending}
        onChange={value => props.onChange(value.map(item => ({ value: item })))}
      >
        {options.map(item => {
          return (
            <Select.Option key={item.id} value={item.id}>
              {item.name || item.id}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
}

function useParamValueOptionStore(paramId: IRule['paramId']) {
  const [isPending, setPending] = useSafeState(false);
  const [options, setOptions] = useSafeState<
    Array<{ id: string; name: string }>
  >([]);

  const { strategyRules, eventEmitter } = React.useContext(RuleComposeContext);

  const rule = React.useMemo(() => {
    return strategyRules.find(item => item.id === paramId);
  }, [paramId, strategyRules]);

  React.useEffect(() => {
    if (rule) {
      // 0 表示参数可选值从接口获取
      if (rule.paramValueType === EParamValueType.API) {
        setPending(true);
        ParamValueSourceRequestService.fetch(rule.paramValue as string)
          .then(data => {
            setOptions(enhanceOptionsArray(data));
          })
          .catch(error => {
            Toast.error(error.message);
          })
          .finally(() => {
            setPending(false);
          });
      }
      // 1 表示参数可选值为指定的数组
      else if (rule.paramValueType === EParamValueType.SpecificArray) {
        setPending(false);
        try {
          const parsedOptions = JSON.parse(rule.paramValue);
          if (Array.isArray(parsedOptions)) {
            setOptions(enhanceOptionsArray(parsedOptions));
          } else {
            throw new Error('参数范围可选值应该为数组');
          }
        } catch (error) {
          console.error(error);
          setPending(false);
          setOptions([]);
        }
      }
    } else {
      setPending(false);
      setOptions([]);
    }
  }, [rule]);

  return { isPending, options, rule, eventEmitter };
}

/**
 * 数组可选项值的格式转换
 * 目前函数会自动识别以下两种格式的数据，并转换成组件需要的结构
 *  1: string[]
 *  2: Array<{id: string; name: string}>
 */
function enhanceOptionsArray(data: any[]) {
  if (data.length === 0) {
    return data;
  }
  const first = data[0];
  if (typeof first === 'string' || typeof first === 'number') {
    return data.map(item => ({ id: item, name: item }));
  }
  if (typeof first === 'object' && first && first.id && first.name) {
    return data;
  }
  console.error(
    '参数范围的数据结构不正确，预期是 string[] 或者 Array<{id: string; name: string}>',
  );

  return [];
}
