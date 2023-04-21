import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Tree, Row, Col, Button} from 'antd';
import './index.less';

const { TreeNode } = Tree
const DEFAULT_STATE = {
  checkedKeys: [],
  treeData: []
}

/**
 * 编辑页面
 * @param {*} props
 */
class DetailTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  componentDidMount () {
    this.getDetailAreaTreeData()
  }

  // 获取树节点数据
  getDetailAreaTreeData = () => {
    const { username, permissionReviewId, record, dispatch, t } = this.props
    const { businessId, appId } = record
    dispatch({
      type: 'review/getReviewUserAreaTree',
      payload: {
        username: username,
        businessId: businessId,
        reviewAppId: appId,
        permissionReviewId: Number(permissionReviewId),
        opUserType: 0
      }
    }).then(res => {
      let checkedKeys = this.computedSelectedKeys(res.result)
      this.setState({
        treeData: res.result,
        checkedKeys: checkedKeys,
        expandedKeys: checkedKeys
      })
    })
  }

  computedSelectedKeys = (data) => {
    let keys = []
    if (data && data.length > 0) {
      data.forEach(node => {
        if (node.status == 1) {
          keys.push(node.idStr)
        }
        if (node.children && node.children.length > 0) {
          let res = this.computedSelectedKeys(node.children)
          keys = [...keys, ...res]
        }
      })
    }
    return keys
  }

  onCheck = (checkedKeys, info) => {
    this.setState({ checkedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    let treeTitle = ''
    if (item.status == 0) {
      treeTitle = <div>{item.name}(<span style={{ color: 'red' }}>{this.props.t('删除')}</span>)</div>
    } else if (item.status == 1) {
      treeTitle = <div>{item.name}(<span style={{ color: 'green' }}>{this.props.t('保留')}</span>)</div>
    } else if (item.status == 2) {
      treeTitle = `${item.name}(${this.props.t('无权限')})`
    }
    if (item.children) {

      return (
        <TreeNode title={treeTitle} key={item.idStr} disabled={item.status == 2}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={treeTitle} key={item.idStr} disabled={item.status == 2}/>;
  })

  computedTreeData = (data) => {
    const { checkedKeys } = this.state
    let nodes = [], nodeData = data || this.state.treeData
    if (nodeData && nodeData.length > 0) {
      nodeData.forEach(item => {
          let index = checkedKeys.indexOf(item.idStr)
          if (index != -1) { // 是选中节点
            nodes.push({
              targetId: item.id,
              status: 1,
              applyDate: item.applyDate,
              expireDate: item.expireDate
            })
          } else {
            if (item.status != 2) {
              nodes.push({
                targetId: item.id,
                status: 0,
                applyDate: item.applyDate,
                expireDate: item.expireDate
              })
            }
          }
          if (item.children && item.children.length > 0) {
            let res = this.computedTreeData(item.children)
            nodes = [...nodes, ...res]
          }
      })
    }
    return nodes
  }

  // 提交变更
  handleSubmitTreeData = () => {
    const { username, permissionReviewId, record, dispatch, handleBtnLoadding } = this.props
    const { businessId, appId } = record
    let selectedNodes = []

    //
    handleBtnLoadding(true)

    // 处理选择的数据
    selectedNodes =this.computedTreeData()

    dispatch({
      type: 'review/reviewSubmitAreaTree',
      payload: {
        username: username,
        businessId: businessId,
        reviewAppId: appId,
        permissionReviewId: Number(permissionReviewId),
        permissionIds: selectedNodes,
        opUserType: 0
      }
    }).then(res => {
      handleBtnLoadding(false)
      if (res.success) {
        this.props.reloadTableList()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    // 待数据请求完成时在获取数据
    if (!nextProps.btnLoaddingStatus) {
      this.getDetailAreaTreeData()
    }
  }

  //展开方法
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  render () {
    const { t } = this.props
    return (
      <div className='review-user-detail-expand'>
        <Row>
          <Col span={20}>
            <Tree
                checkable
                selectable={false}
                checkedKeys={this.state.checkedKeys}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                onExpand={this.onExpand}
                >
                  {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </Col>
          <Col span={4} style={{textAlign: "right"}}>
            {this.props.currUserInfo && this.props.currUserInfo.reviewStatus != 0 ?
            <Button type="primary" onClick={this.handleSubmitTreeData}>{t('提交')}</Button>
            : null}
          </Col>
        </Row>

      </div>
    );
  }
}

export default connect(({ global, review }) => {
  return {
  };
})(DetailTree);
