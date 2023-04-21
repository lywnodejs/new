import * as React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { IRuleGroup } from './interface';
import { RuleParamSelect } from './components/RuleParamSelect';
import { RuleConditionSelect } from './components/RuleConditionSelect';
import { RuleParamValueSelect } from './components/RuleParamValueSelect';
import { RuleComposeContext } from './context';

export function RuleGroup(props: {
  group: IRuleGroup;
  count: number;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { updateRule, addRule, removeRule, removeGroup } = React.useContext(
    RuleComposeContext,
  );

  return (
    <div style={{ display: 'flex' }}>
      <Table
        rowKey="$frontId"
        size="small"
        style={{ flex: 1 }}
        pagination={false}
        loading={props.loading}
        dataSource={props.group.strategyConfigRules}
        columns={[
          {
            title: '参数',
            width: 100,
            render(_, record) {
              return (
                <RuleParamSelect
                  size="small"
                  style={{ width: 100 }}
                  placeholder="请选择"
                  value={record.paramId}
                  disabled={props.disabled}
                  onChange={value => {
                    // 切换参数时需要把条件和值重置掉
                    updateRule(record.$frontId, {
                      paramId: value,
                      conditionId: undefined,
                      value: undefined,
                    });
                  }}
                />
              );
            },
          },
          {
            title: '条件',
            width: 100,
            render(_, record) {
              return (
                <RuleConditionSelect
                  size="small"
                  style={{ width: 100 }}
                  placeholder="请选择"
                  value={record.conditionId}
                  disabled={props.disabled}
                  paramId={record.paramId}
                  onChange={value => {
                    updateRule(record.$frontId, { conditionId: value });
                  }}
                />
              );
            },
          },
          {
            title: '参数范围',
            width: 200,
            render(_, record) {
              return (
                <RuleParamValueSelect
                  size="small"
                  style={{ width: 200 }}
                  placeholder="请选择"
                  value={record.value}
                  disabled={props.disabled}
                  paramId={record.paramId}
                  onChange={value => {
                    updateRule(record.$frontId, { value });
                  }}
                />
              );
            },
          },
          {
            title: '操作',
            width: 150,
            render(_, record) {
              return (
                <div style={{ width: 100 }}>
                  <Button
                    type="link"
                    size="small"
                    disabled={props.disabled}
                    onClick={() =>
                      addRule(props.group.$frontId, record.$frontId)
                    }
                  >
                    添加
                  </Button>
                  <Popconfirm
                    disabled={
                      props.disabled ||
                      props.group.strategyConfigRules.length <= 1
                    }
                    title="确定删除该规则？"
                    onConfirm={() => {
                      removeRule(record.$frontId);
                    }}
                  >
                    <Button
                      type="link"
                      size="small"
                      disabled={
                        props.disabled ||
                        props.group.strategyConfigRules.length <= 1
                      }
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              );
            },
          },
        ]}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
        }}
      >
        <Popconfirm
          disabled={props.disabled || props.count <= 1}
          title="确定删除该规则组？"
          onConfirm={() => {
            removeGroup(props.group.$frontId);
          }}
        >
          <Button
            danger={true}
            shape="circle"
            icon={<MinusOutlined />}
            size="small"
            disabled={props.disabled || props.count <= 1}
          ></Button>
        </Popconfirm>
      </div>
    </div>
  );
}
