import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Button } from 'antd';
import $ from 'jquery';
import _ from 'lodash';

class Search extends Component {

  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onSearchValueChange: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    placeholder: 'Search...',
    onSearchValueChange: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.value,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        searchValue: nextProps.value,
      });
    }
  }

  handleSearch(value) {
    this.props.onSearchValueChange(value);
  }

  handleSearchChange(e) {
    const val = e.target.value;
    this.setState({
      searchValue: val,
    });
  }

  render() {
    const { value, placeholder, style } = this.props;
    const { searchValue } = this.state;

    return (
      <div className="nstree-search" style={style}>
        <Input.Search
          value={searchValue}
          placeholder={placeholder}
          onChange={this.handleSearchChange}
          onSearch={this.handleSearch}
          enterButton
        />
      </div>
    );
  }
}

export default Search;
