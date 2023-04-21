import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { TreeSelect } from 'antd';
import { citySelect } from '@/utils/api/common';
import { getResponseData } from '@/utils/api/path';

/**
 * @param props
 * @description 城市选择组件
 */
const CitySelect = props => {
  const [tree, setTree] = useState([]);
  const { onChange, onNameChange, ...elseProps } = props;

  useEffect(() => {
    fetchCity();
  }, []);

  const fetchCity = () => {
    // 城市树状获取
    citySelect().then(res => {
      const treeData = getResponseData(res);
      treeData && setTree(treeData.children);
    });
  };

  const handleChange = (value, label) => {
    onChange && onChange(value);
    onNameChange && onNameChange(label[0]);
  };

  return (
    <TreeSelect
      showSearch
      treeData={tree}
      treeNodeFilterProp="title"
      style={{ width: '100%' }}
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      onChange={handleChange}
      {...elseProps}
      // treeDefaultExpandAll
    />
  );
};

export default CitySelect;
