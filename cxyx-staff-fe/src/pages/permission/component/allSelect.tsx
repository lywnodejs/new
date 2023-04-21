import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { message, DatePicker } from 'antd';
import { queryCategoryList, queryPackageList, queryOutCategoryList } from '@/utils/api/permission';

/**
 * 权限包分类下拉
 * @param props
 * @constructor
 */
export const PackClass = props => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    queryCategoryList().then(res => {
      if (res && res.data) {
        setDataList(res.data);
      }
    })
  }, [])
  return renderOptionsByMap(dataList, 'categoryId', 'categoryName', props);
};

/**
 * 权限包分类下拉 外部
 * @param props
 * @constructor
 */
export const ExternalPackClass = props => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    queryOutCategoryList().then(res => {
      if (res && res.data) {
        setDataList(res.data);
      }
    })
  }, [])

  return renderOptionsByMap(dataList, 'categoryId', 'categoryName', props);
};

/**
 * 状态
 * @param props
 * @constructor
 */
export const StatusSelect = props => {
  const [dataList, setDataList] = useState([
    {
      id: 0,
      name: '正常',
    }, {
      id: 1,
      name: '锁定'
    }]);

  return renderOptionsByMap(dataList, 'id', 'name', props);
};


/**
 * 是否可申请
 * @param props
 * @constructor
 */
export const ApplySelect = props => {
  const [dataList, setDataList] = useState([
    {
      id: 0,
      name: '是',
    }, {
      id: 1,
      name: '否'
    }]);

  return renderOptionsByMap(dataList, 'id', 'name', props);
};


/**
 * 职责状态
 * @param props
 * @constructor
 */
export const ObligationSelect = props => {
  const [dataList, setDataList] = useState([
    {
      id: '0',
      name: '启用',
    }, {
      id: '1',
      name: '禁用'
    }]);

  return renderOptionsByMap(dataList, 'id', 'name', props);
};

/**
 * 权限包分类下拉
 * @param props
 * @constructor
 */
const PackNameChild = (props, ref) => {
  const [dataList, setDataList] = useState([]);

  useImperativeHandle(ref, () => ({
    getList: (id) => {
      return getList(id);
    }
  }))

  const getList = (id) => {
    let data = {
      categoryId: id
    }
    queryPackageList(data).then(res => {
      if (res && res.data) {
        setDataList(res.data);
      }
    })
    return false;
  }
  return renderOptionsByMap(dataList, 'privilegePackageId', 'privilegePackageName', props);
};

export const PackName = React.forwardRef(PackNameChild);

