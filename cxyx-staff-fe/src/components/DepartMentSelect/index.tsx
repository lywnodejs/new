import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { TreeSelect } from 'antd';
import { departmentSelect } from '@/utils/api/common';

/**
 * @param props
 * @description 部门选择组件
 */
const DepartMentSelect = props => {
  const { params } = props;
  const [tree, settree] = useState([]);

  useEffect(() => {
    fetchdepartment();
  }, []);

  const fetchdepartment = () => {
    // 部门树状获取
    departmentSelect(params).then(res => {
      if (res.errno === 0) {
        settree(res.data.children);
      }
    });
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
      // treeDefaultExpandAll
      {...props}
    />
  );
};

export default DepartMentSelect;
