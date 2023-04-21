import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Spin, notification, message, Popconfirm } from 'antd';
import $ from 'jquery';
import _ from 'lodash';

class Collect extends Component {
  static propTypes = {
    treeId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    collects: PropTypes.array.isRequired,
    onClickCollect: PropTypes.func.isRequired,
    onCancelCollect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      contextmenuTop: -99999,
      contextmenuLeft: -99999,
    };
  }

  componentDidMount() {
    const { treeId } = this.props;

    $(document).off(`click.cancelCollect.${treeId}`).on(`click.cancelCollect.${treeId}`, (e) => {
      this.setState({
        contextmenuTop: -99999,
        contextmenuLeft: -99999,
      });
    });
  }

  componentWillUnmount() {
    const { treeId } = this.props;

    if (this.fetchTreeCollectRequest) {
      this.fetchTreeCollectRequest.abort();
    }
    if (this.cancelCollectRequest) {
      this.cancelCollectRequest.abort();
    }
    $(document).off(`click.cancelCollect.${treeId}`);
  }

  handleCancelCollect = () => {
    this.props.onCancelCollect(this.rightClickNs);
  }

  render() {
    const { loading } = this.props;
    const collects = _.sortBy(this.props.collects, o => !o.is_default);

    return (
      <Spin spinning={loading}>
        <div style={{ padding: 5 }}>
          <ul>
          {
            collects.length ?
            _.map(collects, collect => (
              <li
                key={collect.id}
                onClick={(event) => {
                  event.preventDefault();

                  this.props.onClickCollect(collect.name);
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  this.rightClickNs = collect.name;
                  this.setState({
                    contextmenuLeft: event.clientX,
                    contextmenuTop: event.clientY,
                  });
                }}>
                {
                  collect.is_default === 1 &&
                    <img
                      src={require('./assets/images/defaultNsIcon.png')}
                      style={{ width: 14, verticalAlign: 'text-top', marginRight: 3 }}
                    />
                }
                {collect.name}
              </li>
            )) :
            <div>暂无收藏节点信息</div>
          }
          </ul>
        </div>
        <div
          className="nstree-contextmenu"
          style={{
            top: this.state.contextmenuTop,
            left: this.state.contextmenuLeft,
          }}
        >
          <ul>
            <li>
              <a onClick={this.handleCancelCollect}>取消收藏</a>
            </li>
          </ul>
        </div>
      </Spin>
    );
  }
}

export default Collect;
