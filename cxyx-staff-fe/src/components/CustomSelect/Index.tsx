/*
 * @Author: xuwenjie
 * @Date: 2020-07-20 14:10:59
 * @LastEditTime: 2020-08-17 16:38:32
 * @Description:
 */
import React, { useMemo } from 'react';
import { Select } from 'antd';

type Item = {
  code: number | string;
  name: string;
};

type CST = {
  dataSource: Item[];
  renderLabel(item: object): React.ReactNode;
  view: boolean;
  fieldNames: {
    code: string;
    name: string;
  };
  [propName: string]: any;
};

const noop = (v, fieldNames) => v[fieldNames.name];

export default React.forwardRef(function(props: CST, ref: any) {
  const {
    dataSource = [],
    renderLabel = noop,
    view,
    fieldNames = { code: 'code', name: 'name' },
    value,
    ...SelectProps
  } = props;
  const renderView = () => {
    if (SelectProps.mode === 'multiple') {
      const matchedItems = dataSource.filter(
        item => value && value.includes(item[fieldNames.code]),
      );
      return matchedItems.map(m => m[fieldNames.name]).join(', ');
    }
    const matchedItem = dataSource.find(
      item => `${item[fieldNames.code]}` === `${value}`,
    );
    return matchedItem && matchedItem[fieldNames.name];
  };
  const domId = useMemo(() => {
    const uniqueId = Date.now();
    return `select-container-${uniqueId}`;
  }, []);

  return (
    <span id={domId}>
      {view ? (
        renderView()
      ) : (
        <Select
          placeholder="请选择"
          ref={ref}
          value={value}
          allowClear={true}
          showSearch={true}
          // @ts-ignore
          getPopupContainer={() => document.getElementById(domId)}
          {...SelectProps}
          filterOption={(input, option) => {
            if (typeof option!.props!.children === 'string') {
              return option!.props!.children!.indexOf(input) >= 0;
            } else {
              return option!.props!.children! === input;
            }
          }}
        >
          {dataSource.map(item => (
            <Select.Option
              key={item[fieldNames.code]}
              value={item[fieldNames.code]}
            >
              {renderLabel(item, fieldNames)}
            </Select.Option>
          ))}
        </Select>
      )}
    </span>
  );
});
