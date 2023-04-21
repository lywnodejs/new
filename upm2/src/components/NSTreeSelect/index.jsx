import React, { Component } from 'react';
import { Icon, Modal, Tag } from 'antd';
import { Nstree, NsSelect } from '../NSTree';

import { apiHost } from '../../config/apiConfig';

import './index.less';

export default class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nsList: props.value || []
    }
  }

  componentDidUpdate(preProps) {
    if (preProps.value != this.props.value) {
      this.setState({
        ...this.state,
        nsList: this.props.value
      })
    }
  }

  handleNSModalOK = () => {
    this.props.onOk(this.state.nsList);
    this.clearState();
  }

  handleNSModalCancel = () => {
    this.props.onCancel();
    this.clearState();
  }

  handleSelect = (ns) => {
    let nsList = this.state.nsList;

    if(!nsList.includes || !nsList.includes(ns)) {
      nsList = Array.isArray(nsList) ? nsList : [];
      nsList.push(ns)
      this.setState({
        ...this.state,
        nsList
      })
    }
  }

  handleClickDelete = (index) => {
    let nsList = this.state.nsList;
    nsList.splice(index, 1);
    this.setState({
      ...this.state,
      nsList
    });
  }

  clearState = () => {
    this.setState({
      nsList: []
    })
  }

  render() {
    const {
      visible
    } = this.props;
    const {
      nsList
    } = this.state;
    const treeProps = {
      isAll: true,
      treeApi: apiHost,
      width: 300,
      // height: 500,
      // overflowX: 'hidden',
      search: {
        enabled: true,
      },
      zTreeObjSetting: {
        callback: {
          onClick: (event, treeId, treeNode) => {
            this.handleSelect(treeNode.ns)
          }
        }
      }
    };
    return (
      <Modal
        title="选择 NS 节点"
        visible={visible}
        onOk={this.handleNSModalOK}
        onCancel={this.handleNSModalCancel}
        width={700}
      >
        <div
          className="NSTreeSelect"
        >
          <Nstree {...treeProps} className="nstree" />
          <div className="list">
            {nsList && nsList.map && nsList.map((item, index) => (
              <Tag
                key={item}
                closable
                onClose={() => this.handleClickDelete(index)}
              >{item}</Tag>
            ))}
          </div>
        </div>
      </Modal>
    )
  }
}
