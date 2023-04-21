import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import selectNsModal from './selectNsModal';

export default class NsSelect extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
    size: PropTypes.string,
    style: PropTypes.object,
    checkTreeNode: PropTypes.func,
  };

  static defaultProps = {
    size: 'default',
    style: {},
    checkTreeNode: _.noop,
  };

  handleNsChange = () => {
    selectNsModal({
      nsTreeProps: this.props.nsTreeProps,
      selectedNs: this.props.value,
      onOk: (selectedNs) => {
        this.props.onChange(selectedNs);
      },
      checkTreeNode: this.props.checkTreeNode,
    });
  }

  handleSelectNsClose = (e, itemValue) => {
    e.stopPropagation();
    const { value, onChange } = this.props;
    let valueClone = _.cloneDeep(value);

    if (_.isArray(valueClone)) {
      _.remove(valueClone, o => o === itemValue);
    } else {
      valueClone = '';
    }

    onChange(valueClone);
  }

  render() {
    const { value, size } = this.props;
    const className = classnames({
      'selectNs-selection': true,
      'selectNs-selection-sm': size === 'small',
      'selectNs-selection-lg': size === 'large',
    });
    const values = !_.isEmpty(value) ? (_.isArray(value) ? value : [value]) : value;

    return (
      <div className={className} style={{ ...this.props.style }} onClick={this.handleNsChange}>
        <div className="selectNs-selection-rendered">
          {
            _.map(values, item => (
              <Tag
                key={item}
                closable
                onClose={(e) => this.handleSelectNsClose(e, item)}
              >
                {item}
              </Tag>
            ))
          }
          {/*<Icon type="plus-circle-o" onClick={this.handleNsChange}/>*/}
        </div>
      </div>
    );
  }
}
