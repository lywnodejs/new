/**
 * 业务线下拉框
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Select
} from 'antd';
import connect from '@utils/translateConnect';

const Option = Select.Option;

class BusinessSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessId: '0',
    };
  }
  handleChange = (value) => {
    this.setState({
      businessId: value
    });
    this.props.onChange(value);
  }
  render() {
    const { t, showAll, allBusiness } = this.props;

    let AllOption = (
      <Option value="0">
        {t('全部')}
      </Option>
    );
    if (!showAll) {
      AllOption = null;
    }

    const Options = allBusiness.map(business => {
      return (
        <Option key={business.id} value={business.id}>
          {business.name}
        </Option>
      );
    });
    return (
      <Select
        showSearch
        placeholder={t('请选择业务线')}
        value={ this.state.businessId }
        onChange={ this.handleChange }
        className="form-select"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        { AllOption }
        { Options }
      </Select>
    );
  }
}
BusinessSelect.defaultProps = {
  showAll: true
};
BusinessSelect.propTypes = {
  showAll: PropTypes.bool, // 是否显示全部
  onChange: PropTypes.func // 选中事件
};

const mapStateToProps = (state) => {
  const { global } = state;
  
  return {
    allBusiness: global.allBusiness
  };
};
 
export default connect(mapStateToProps)(BusinessSelect);