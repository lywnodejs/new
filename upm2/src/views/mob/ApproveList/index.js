import React, { Component } from 'react';
import {
  List, Button, Row, Col,
} from 'antd';
import connect from '@utils/translateConnect';
import moment from 'moment';

import './index.less';

class ApproveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: true,
      showLoadmore: true,
      list: []
    };
    this.page = 1;
    this.pageSize = 20;
  }
  componentDidMount() {
    this.getData();
  }
  getData = (page = 1) => {
    this.props.dispatch({
      type: 'approveList/fetchApprove2',
      payload: {
        page,
        size: this.pageSize,
        approveStatuses: [1] // 当前审批的状态；1：待审批；2：审批通过；3：审批驳回；4：撤回
      }
    }).then(res => {
      const approveList = res.payload.records || [];

      const newList = this.state.list.concat(approveList);
      this.setState({
        initLoading: false,
        list: newList
      });

      // 没有更多数据
      if (approveList.length < this.pageSize) {
        this.setState({
          showLoadmore: false
        });
      }
    }).catch(() => {
      this.setState({
        initLoading: false,
      });
    });
  }
  loadMore = () => {
    this.page = this.page + 1;
    this.getData(this.page);
  }
  componentWillUnmount() {
    this.page = 1;
    this.pageSize = 20;
  }
  render() { 
    const { initLoading, showLoadmore, list } = this.state;
    const { t } = this.props;
    // console.log('approveList', list)

    const loadMoreComp = !initLoading && showLoadmore  ? (
      <div className="loadmore-btn">
        <Button onClick={this.loadMore}>{t('加载更多')}</Button>
      </div>
    ) : null;

    return (
      <List
        className="approve-loadmore-list"
        loading={initLoading}
        itemLayout="vertical"
        loadMore={loadMoreComp}
        dataSource={list}
        renderItem={item => {
          const authName = item.applyRoleDtos.map(it => {
            return it.refName;
          }).join(', ');
          const applyUser = item.applyUser || {};
          const applyDate = moment(item.applyCreateAt).format('YYYY-MM-DD HH:mm:ss');
          return (
            <List.Item actions={[<a href={`/upm2-static/mob/approve-detail/${item.approveId}`}>{t('详情')}</a>]}>
              <a className="item-link" href={`/upm2-static/mob/approve-detail/${item.approveId}`}>
                <Row>
                  <Col span={8}>
                    <div><strong>{applyUser.nameDisplay||'-'}</strong></div>
                    <div><strong>{applyUser.accountName||'-'}</strong></div>
                  </Col>
                  <Col span={16}>{item.appName}</Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <strong>{t('权限类型')} - {t(item.applyTypeName)}: </strong>
                    <div className="auth-list">{authName}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}><strong>{t('申请时间')}: </strong>{applyDate}</Col>
                </Row>
              </a>
            </List.Item>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { approveList } = state;
  return {
    approveList: approveList.list2
  };
};

export default connect(
  mapStateToProps
)(ApproveList);