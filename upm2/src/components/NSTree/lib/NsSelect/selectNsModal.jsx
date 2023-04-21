import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Row, Col, Modal, Tag } from 'antd';
import Nstree from '../../NsTree';

class SelectNs extends Component {
  static propTypes = {
    selectedNs: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    prefix: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    destroy: PropTypes.func,
    checkTreeNode: PropTypes.func,
  };

  static defaultProps = {
    selectedNs: [],
    prefix: '',
    visible: true,
    onOk: _.noop,
    onCancel: _.noop,
    destroy: _.noop,
    checkTreeNode: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedNs: props.selectedNs,
    };
    this.treeId = _.uniqueId('selectNs_');
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.selectedNs, this.props.selectedNs)) {
      this.setState({ selectedNs: nextProps.selectedNs });
    }
  }

  handleOk = () => {
    const reuslt = this.props.onOk(this.state.selectedNs);
    if (reuslt === undefined || reuslt === true) {
      this.props.destroy();
    }
  }

  handleCancel = () => {
    this.props.destroy();
  }

  handleAddNs(ns) {
    const { prefix } = this.props;
    const { selectedNs } = this.state;
    const fullNs = nsBindPrefix(ns, prefix);
    let newSelectedNs = fullNs;

    if (_.isArray(selectedNs)) {
      newSelectedNs = [...this.state.selectedNs];

      if (_.indexOf(newSelectedNs, ns) === -1) {
        newSelectedNs.push(fullNs);
      }
    }

    this.setState({ selectedNs: newSelectedNs });
  }

  handleDelNs(ns) {
    const { selectedNs } = this.state;
    let newSelectedNs = '';

    if (_.isArray(selectedNs)) {
      newSelectedNs = [...this.state.selectedNs];

      if (_.indexOf(newSelectedNs, ns) > -1) {
        _.remove(newSelectedNs, sns => sns === ns);
      }
    }

    this.setState({ selectedNs: newSelectedNs });
  }

  render() {
    const { selectedNs } = this.state;
    const nsTreeProps = {
      ...this.props.nsTreeProps,
      treeId: this.treeId,
      width: '100%',
      height: 350,
      zTreeObjSetting: {
        callback: {
          onClick: (event, treeId, treeNode) => {
            const checked = this.props.checkTreeNode(treeNode);

            if (checked === undefined || !!checked) {
              this.handleAddNs(treeNode.ns);
            }
          }
        },
      }
    };
    const selectedNss = !_.isEmpty(selectedNs) ? (_.isArray(selectedNs) ? selectedNs : [selectedNs]) : selectedNs;

    return (
      <Modal
        title={
          <span>
            节点选择 <span style={{ fontWeight: 'normal', fontSize: 12, color: '#f50' }}></span>
          </span>
        }
        width={700}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row gutter={10}>
          <Col span={12}>
            <Nstree {...nsTreeProps} />
          </Col>
          <Col span={12}>
            <div className="selectedNs-content" style={{ height: 351 }}>
              <div style={{ padding: 10 }}>
                {
                  _.map(selectedNss, ns => (
                    <Tag key={ns} closable onClose={() => this.handleDelNs(ns)}>{ns}</Tag>
                  ))
                }
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default function selectNsModal(config = {}) {
  const div = document.createElement('div');
  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }
  function render(props) {
    ReactDOM.render(<SelectNs {...props} />, div);
  }

  document.body.appendChild(div);
  render({ ...config, visible: true, destroy });

  return {
    destroy,
  }
}

function nsBindPrefix(ns, prefix) {
  if (prefix) {
    return `${prefix}${ns}`;
  } else {
    return ns;
  }
}
