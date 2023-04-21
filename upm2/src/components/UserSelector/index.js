import request from '@utils/request';
import React from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import debounce from 'lodash/debounce';

class UserSelector extends React.Component {
  constructor(props) {
    super(props);
    const { value, style } = props;
    this.state = {
      style: style || { width: '100%' },
      value: value || [],
      fetching: false,
      dataSource: []
    };
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  fetchUser = value => {
    this.setState({ fetching: true });
    request('/v2/nopermission/user/query', {
      params: {
        username: value
      }
    })
      .then(data => {
        this.setState({
          dataSource: data
        });
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  };
  handleChange = (value, option) => {
    const { onChange } = this.props;
    this.setState({
      value,
      dataSource: [],
      fetching: false
    });
    if (onChange) {
      onChange(
        value,
        option,
        _.find(this.state.dataSource, item => item.id == value.key)
      );
    }
  };

  componentWillReceiveProps({ value }) {
    // 更新value值
    this.setState({
      value
    });
  }
  render() {
    const { fetching, value, dataSource, style } = this.state;
    const {
      selectType = 'multiple',
      noRepeat,
      disabled,
      placeholder
    } = this.props;
    let extendAttribute = { mode: 'multiple' };
    if (selectType === 'single') {
      extendAttribute = { showSearch: true };
    }
    return (
      <Select
        {...extendAttribute}
        labelInValue
        value={value}
        placeholder={placeholder || '输入用户名'}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        disabled={disabled}
        style={style}
        allowClear={true}
        optionLabelProp="label">
        {dataSource.map(item => (
          <Select.Option
            disabled={noRepeat && _.findIndex(value, ['key', item.id]) !== -1}
            key={item.id}
            label={item.username}
            //
          >
            {`${item.usernameZh}-${item.dept && item.dept.split('-')[0]}<${
              item.username
            }>`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default UserSelector;
