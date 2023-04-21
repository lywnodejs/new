import React from 'react';
import connect from '@utils/translateConnect';
import { Select } from 'antd';
import _ from 'lodash';

import './index.less';
const { Option } = Select;

class ProductLineSelector extends React.Component {
  state = {
    value: '0'
  };

  onChange = (value) => {
    const { onChange } = this.props;

    onChange(value);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  render() {
    const { productLineList, style, t } = this.props;
    const { value } = this.state;

    return (
      <Select
        style={style}
        className="ProductLineSelector"
        showSearch
        value={value}
        optionFilterProp="children"
        onChange={this.onChange}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option value={'0'} key='all'>
          {t('无')}
        </Option>
        {productLineList.map((product) => {
          return (
            <Option value={`${product.id}`} key={product.id}>
              {product.name}
            </Option>
          );
        })}
      </Select>
    );
  }
}

export default connect(({ newApply }) => {
  return {
    productLineList: newApply.productLineList
  };
})(ProductLineSelector);
