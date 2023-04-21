import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import $ from 'jquery';

function removeListeners() {
  $(window).off('mouseup.splitter');
  $(window).off('mousemove.splitter');
}

export default class Splitter extends Component {
  static propTypes = {
    onResizeStart: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onResize: PropTypes.func,
  };
  static defaultProps = {
    onResizeStart: _.noop,
    onResizeEnd: _.noop,
    onResize: _.noop,
  };

  constructor(props) {
    super(props);
    this.startPositionY = 0;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentWillUnmount() {
    removeListeners();
  }

  updateStartPositionY(e, diff) {
    if (diff) {
      this.startPositionY = e.clientY + diff;
    } else {
      this.startPositionY = e.clientY;
    }
  }

  handleMouseMove(e) {
    e.preventDefault();

    const { onResize } = this.props;
    const diff = this.startPositionY - e.clientY;

    if (diff !== 0) {
      onResize(diff);
    }
    // this.updateStartPositionY(e);
  }

  handleMouseUp(e) {
    e.preventDefault();

    const { onResizeEnd } = this.props;

    onResizeEnd();
    removeListeners();
  }

  handleMouseDown(e) {
    e.preventDefault();

    const { onResizeStart } = this.props;
    const diff = onResizeStart();

    this.updateStartPositionY(e, diff);
    $(window).on('mouseup.splitter', this.handleMouseUp);
    $(window).on('mousemove.splitter', this.handleMouseMove);
  }

  render() {
    return (
      <div className="nstree-collect-splitter" onMouseDown={this.handleMouseDown}>
        ...
      </div>
    );
  }
}
