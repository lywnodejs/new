/**
 * 所有系统下拉框
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Select
} from 'antd';
import connect from '@utils/translateConnect';

const Option = Select.Option;

class SystemSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: ''
    };
  }
  handleChange = (value) => {
    this.setState({
      appId: value
    });
    this.props.onChange(value);
  }
  render() {
    const { t, showAll, apps, allowClear } = this.props;

    let AllOption = (
      <Option value=''>
        {t('全部')}
      </Option>
    );
    if (!showAll) {
      AllOption = null;
    }

    const Options = apps.map(item => {
      return (
        <Option key={item.appId} value={item.appId}>{item.appName}</Option>
      );
    });
    return (
      <Select
        placeholder={t('请选择系统')}
        value={this.state.appId}
        onChange={this.handleChange}
        className='form-select'
        showSearch
        allowClear={allowClear}
        optionFilterProp="children"
      >
        { AllOption }
        { Options }
      </Select>
    );
  }
}
SystemSelect.defaultProps = {
  showAll: true,
  allowClear: false
};
SystemSelect.propTypes = {
  allowClear: PropTypes.bool, // 支持删除
  showAll: PropTypes.bool, // 是否显示全部
  onChange: PropTypes.func // 选中事件
};

const mapStateToProps = (state) => {
  const { global } = state;
  
  return {
    apps: global.apps
  };
};
 
export default connect(mapStateToProps)(SystemSelect);