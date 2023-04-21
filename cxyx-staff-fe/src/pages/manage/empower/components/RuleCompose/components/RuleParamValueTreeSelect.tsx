import * as React from 'react';
import { TreeSelect, message as Toast, Form } from 'antd';
// import { TreeSelectProps } from 'antd/lib/tree-select';
import { useSafeState } from '@didi/cx-react-hooks';
import { IRule, EParamValueType } from '../interface';
import { RuleComposeContext } from '../context';
import { IRuleParamValueSelectProps } from './RuleParamValueSelect';
import { ParamValueSourceRequestService } from '../services/fetchStrategyRuleParamValueSource';

export function RuleParamValueTreeSelect(props: IRuleParamValueSelectProps) {
  const { paramId, value, ...restProps } = props;

  const { isPending, treeData, eventEmitter } = useParamValueOptionStore(
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
      <TreeSelect
        {...restProps}
        value={selectedValue}
        multiple={true}
        loading={props.loading || isPending}
        treeData={treeData}
        onChange={value => props.onChange(value.map(item => ({ value: item })))}
      ></TreeSelect>
    </Form.Item>
  );
}

interface ITreeData {
  title: string;
  value: string;
  children?: ITreeData[];
}

function useParamValueOptionStore(paramId: IRule['paramId']) {
  const [isPending, setPending] = useSafeState(false);
  const [treeData, setTreeData] = useSafeState<ITreeData[]>([]);

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
            setTreeData(data.children);
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
        setTreeData(rule.paramValue as any);
      }
    } else {
      setPending(false);
      setTreeData([]);
    }
  }, [rule]);

  return { isPending, treeData, rule, eventEmitter };
}
