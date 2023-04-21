import React, { useEffect, useState } from 'react';
import _, { includes } from 'lodash';
import { Select, TreeSelect } from 'antd';
import { useImperativeHandle } from 'react';
import { FormInstance } from 'antd/lib/form';
import { renderOptionsByMap } from '@/utils/data';
import { getGoodsTypeList } from '@/utils/api/company';

const { Option } = Select;

const renderOption: any = (list: any) => {
  return list && list.map(item => {
    return (
      <Option
        key={item.id}
        value={item.id}
      >
        {item.name}
      </Option>
    )
  })
}

export const businessChange = (val, callback) => {
  callback([]);
}

/**
 * 下拉框
 * @param props
 * @constructor
 */
export const FormSelect = props => {
  const { defaultValue, dataList, selectChange } = props;
  return (
    <>
      <Select
        allowClear
        mode="multiple"
        showSearch
        showArrow
        placeholder={'请选择'}
        optionFilterProp="label"
        defaultValue={defaultValue}
        onChange={selectChange}
      >
        {renderOption(dataList)}
      </Select>
    </>
  )
};

/**
 * 业务线下拉框
 * @param props
 * @constructor
 */
export const BusinessSelect = props => {
  const { defaultValue, dataList, selectChange } = props
  return (
    <>
      <Select
        allowClear
        labelInValue
        showSearch
        showArrow
        placeholder={'请选择'}
        optionFilterProp="label"
        defaultValue={defaultValue}
        onChange={selectChange}
      >
        {renderOption(dataList)}
      </Select>
    </>
  )
};

/**
 * 商品品类下拉框
 * @param props
 * @constructor
 */

export const CommoditySelectChild = (props, ref) => {
  const [list, setList] = useState([]);
  const [option, setOption] = useState([])
  const [value, setValue] = useState([]);
  useEffect(() => {
    getGoodsTypeList().then(res => {
      setList(_.get(res, 'data', []))
      setOption(_.get(res, 'data', []).map(item => {
        return {
          label: item.goodsTypeName,
          value: item.goodsTypeId
        }
      }))
    })
  }, [])

  useImperativeHandle(ref, () => ({
    clearData: () => {
      setValue([]);
    },
  }))

  const handleChange = (val) => {
    let value = [];
    setValue(val);
    value = list.filter(item => {
      let _item = item.goodsTypeId;
      return val.includes(_item)
    })
    props.getValue && props.getValue(value);
  }

  return (
    <Select
      allowClear
      showSearch
      value={value}
      style={{ minWidth: 100 }}
      placeholder={'请选择'}
      optionFilterProp="label"
      options={option}
      onChange={handleChange}
      {...props}
    />
  )
  // renderOptionsByMap(list, 'goodsTypeId', 'goodsTypeName', props);
}

export const CommoditySelect = React.forwardRef(CommoditySelectChild);

/**
 * 地区下拉框
 * @param props
 * @constructor
 */
const AreaSelectChild = (props, ref) => {
  const { TreeNode } = TreeSelect;
  const { useDefaultValue, dataList, selectChange } = props;
  const [value, setValue] = useState([]);

  useImperativeHandle(ref, () => ({
    clearData: () => {
      setValue([]);
      props.onChange([]);
    },
    handleChange: (val) => {
      handleChange(val)
    }
  }))

  useEffect(() => {
    let defaultValue = [];
    if (useDefaultValue && useDefaultValue()) {
      defaultValue = useDefaultValue();
      handleChange(defaultValue)
    }
  }, [])


  // 生成下拉树
  let renderTree = data => data.map(element => {
    if (element.children) {
      return <TreeNode
        title={element.name}
        value={element.id}
        key={element.id}
      >
        {renderTree(element.children)}
      </TreeNode>
    } else {
      return <TreeNode
        title={element.name}
        value={element.id}
        key={element.id}
      />
    }
  })

  // 根据id搜索对应数据
  let result = {};
  let serachID: any = ((data, id) => {

    data.forEach(item => {
      if (item.id === id) {
        result = {
          id: item.id,
          name: item.name
        }
      } else if (item.children && item.children.length > 0) {
        result = serachID(item.children, id);
      }
    });
    return result
  })


  const handleChange = (val) => {
    setValue(val);
    let returnData = [];
    val.map(item => {
      returnData.push(serachID(dataList, item))
    })
    props.onChange(val);
    selectChange(returnData)
  }

  return (
    <TreeSelect
      showSearch
      // labelInValue
      treeNodeFilterProp='title'
      style={{ width: '100%' }}
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      multiple
      value={value}
      {..._.omit(props, ['selectChange', 'onChange', 'setValue'])}
      onChange={handleChange}
    >
      {dataList.length !== 0 ? renderTree(dataList) : []}
    </TreeSelect>
  )
}
export const AreaSelect = React.forwardRef(AreaSelectChild);




