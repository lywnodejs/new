import React from 'react';
import classnames from 'classnames';
import { Input, Icon } from 'antd';

import './index.less';

export default class EditableCell extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.status !== this.props.status) {
      this.setState({
        editable: nextProps.status === 'editing'
      });
    }

    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      editable: props.status === 'editing',
    };
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className={classnames('editable-cell', this.props.className)}>
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                className="editable-cell-input"
              />

              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}

              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}
