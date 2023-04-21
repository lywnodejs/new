import React from 'react';
import _ from 'lodash';

class ZTree extends React.Component {

  constructor(props) {
    super(props);
    this.ztree = null;
  }

  componentDidMount() {
    this.renderTree();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodes != this.props.nodes) {
      setTimeout(() => {
        this.renderTree();
      }, 0);
    }
  }

  renderTree = () => {
    const { nodes } = this.props;

    console.log(_.cloneDeep(nodes))

    if (this.ztree) {
      this.ztree.destroy();
    }
    this.ztree = $.fn.zTree.init($(this.refs.el), {}, _.cloneDeep(nodes));
  }

  render() {
    return (
      <div className='ztree' ref='el'>
      </div>
    );
  }
}

export default ZTree;
