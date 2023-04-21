import React from 'react';
import ReactDOM from 'react-dom';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { MAIN } from '@/entry/mobile/routes/config';
import { isOversea } from '@config/env';
import { connect } from 'dva';
import { translate } from 'react-i18next';
import {
  Badge,
  PullToRefresh,
  ListView,
  TextareaItem,
  NavBar,
  Toast,
  Icon,
  Checkbox,
  ActionSheet,
  Flex,
  Modal,
  NoticeBar
} from 'antd-mobile';

import './index.less';

const { alert } = Modal;

function MyBody(props) {
  return (
    <div className="am-list-body upm-mobile-approve-list-body">
      {props.children}
    </div>
  );
}

class ApproveList extends React.Component {
  constructor(props) {
    super(props);

    this.lv = React.createRef();
    this.pageSize = 50; // 每页条数
    this.page = 1; // 当前页
    this.dataList = []; // 数据集
    this.reason = ''; // 审批意见
    this.state = {
      dataSource: new ListView.DataSource({
        // getRowData: (dataBlob, sectionID, rowID) => dataBlob.s1.filter(item => item.approveId == rowID)[0],
        rowHasChanged: () => true // 强制刷新
      }),
      checkable: false,
      hasMore: true,
      refreshing: false,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4, // 高度初始值
      modalVisible: false,
      isAll: false, // 是否为全部通过操作
      checkList: [] // 选择集
    };
  }

  componentDidMount() {
    this.getData().then(() => {
      this.setState({
        /* eslint-disable react/no-find-dom-node */
        height:
          document.documentElement.clientHeight -
          ReactDOM.findDOMNode(this.lv.current).offsetTop
      });
    });
  }

  /**
   * 获取审批数据
   */
  getData = (page = 1, reload) => {
    this.setState({ isLoading: true, refreshing: true });

    return this.props
      .dispatch({
        type: 'approveList/fetchApprove2',
        payload: {
          page,
          size: this.pageSize,
          approveStatuses: [1] // 当前审批的状态；1：待审批；2：审批通过；3：审批驳回；4：撤回
        }
      })
      .then(res => {
        this.total = res.payload.total;
        if (res.payload.records.length < this.pageSize) {
          this.setState({
            hasMore: false
          });
        }

        if (reload) {
          this.dataList = res.payload.records || [];
        } else {
          this.dataList = this.dataList.concat(res.payload.records || []); // 拼接数据
        }

        this.setState(
          {
            dataSource: this.state.dataSource.cloneWithRows(this.dataList),
            isLoading: false,
            refreshing: false
          },
          () => {
            if (reload) {
              // this.lv.current.scrollTo(0)
            }
          }
        );
      });
  };

  /**
   * 滚动加载数据
   */
  onEndReached = () => {
    if (this.state.isLoading) {
      return;
    }

    this.getData((this.page = this.page + 1));
  };

  handleRefresh = () => {
    this.getData((this.page = 1), true);
  };

  /**
   * 操作面板
   */
  handleMoreClick = () => {
    const { t } = this.props;
    const BUTTONS = [t('批量管理列表'), t('取消')];

    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        maskClosable: true
      },
      index => {
        if (index == 0) {
          this.setState({
            checkable: true,
            dataSource: this.state.dataSource.cloneWithRows(this.dataList) // 强制刷新数据，损失了性能优化
          });
        }
      }
    );
  };

  /**
   * 设置选中状态
   */
  handleCheckChange = value => {
    const _checkList = this.state.checkList.slice();
    const index = _checkList.indexOf(value);
    if (index == -1) {
      _checkList.push(value);
    } else {
      _checkList.splice(index, 1);
    }

    this.setState({
      checkList: _checkList,
      dataSource: this.state.dataSource.cloneWithRows(this.dataList) // 强制刷新数据，损失了性能优化
    });
  };

  handleSelectAll = () => {};

  handleTouchstart = e => {
    e.currentTarget.classList.add('upm-mobile-touch--active');
  };

  handleTouchend = e => {
    e.currentTarget.classList.remove('upm-mobile-touch--active');
  };

  /**
   * 查看审批详情
   */
  handleClick = id => {
    if (this.state.checkable) return this.handleCheckChange(id);
    const url = `${MAIN}/approve-detail/${id}`;

    // window.location = url;
    this.props.dispatch(routerRedux.push(url));
  };

  /**
   * 点击完成按钮，关闭批量操作
   */
  handleDone = () => {
    this.setState({
      checkable: false,
      checkList: [],
      dataSource: this.state.dataSource.cloneWithRows(this.dataList)
    });
  };

  /**
   * 通过全部待审批申请
   */
  handleAllPass = () => {
    // const { t } = this.props;

    // alert(t('全部通过?'), t('一次最多批量通过{{ total }}条待审批记录', { total: this.pageSize }), [
    //   { text: t('取消') },
    //   { text: t('确定'), onPress: () => {
    //     // 设置全选状态
    //     this.setState({
    //       checkList: this.dataList.slice(0, 50).map(data => data.approveId), // 最大一次审批数量不超过50
    //       dataSource: this.state.dataSource.cloneWithRows(this.dataList)
    //     })
    //     this.showModal(true)
    //   } },
    // ]);
    // 设置全选状态
    const { t } = this.props;

    if (this.dataList.length === 0) {
      alert(t('操作失败'), t('当前暂无待审批申请'), [{ text: t('确定') }]);
    } else {
      this.setState({
        checkList: this.dataList.slice(0, 50).map(data => data.approveId), // 最大一次审批数量不超过50
        dataSource: this.state.dataSource.cloneWithRows(this.dataList)
      });
      this.showModal(true);
    }
  };

  /**
   * 批量操作
   * 1. 通过
   * 2. 驳回
   */
  handlePatchOperate = () => {
    const { t } = this.props;

    if (this.state.checkList.length === 0) {
      alert(t('操作失败'), t('请至少选择一条数据'), [{ text: t('确定') }]);
    } else {
      this.showModal();
    }
  };

  /**
   * 批量通过审批
   */
  handlePatchPass = e => {
    e.preventDefault();
    const { dispatch, t } = this.props;

    if (!this.reason) {
      return Toast.fail(t('审批说明不能为空'), 1);
    }

    this.setState({
      modalVisible: false
    });
    Toast.loading('Loading...', 0);

    // 批量通过
    dispatch({
      type: 'approveList/batchPassApprove',
      payload: this.state.checkList.map(i => ({
        id: i,
        reason: this.reason
      }))
    }).then(result => {
      let fail = result.filter(res => res.resultCode != 0); // 过滤通过失败结果

      this.setState({
        checkList: fail
          .filter(res => res.resultCode != 705012)
          .map(res => +res.id) // 过滤自动驳回的数据
      });

      if (fail.length === 0) {
        Toast.success(t('批量操作成功'), 1);
      } else {
        Toast.fail(t('{{fail}}条数据操作失败', { fail: fail.length }), 3);
      }
      this.getData((this.page = 1), true);
    });
  };

  /**
   * 批量驳回审批
   */
  handleReject = e => {
    e.preventDefault();
    const { dispatch, t } = this.props;

    if (!this.reason) {
      return Toast.fail(t('审批说明不能为空'), 1);
    }

    this.setState({
      modalVisible: false
    });
    Toast.loading('Loading...', 0);

    // 批量驳回
    dispatch({
      type: 'approveList/batchRejectApprove',
      payload: this.state.checkList.map(i => ({
        id: i,
        reason: this.reason
      }))
    }).then(result => {
      let fail = [];

      for (const item in result) {
        if (result[item] != 0) {
          fail.push(+item); // 设置未成功驳回的数据
        }
      }

      this.setState({
        checkList: fail
      });

      if (fail.length === 0) {
        Toast.success(t('批量操作成功'), 1);
      } else {
        Toast.fail(t('{{fail}}条数据操作失败', { fail: fail.length }), 3);
      }
      this.getData((this.page = 1), true);
    });
  };

  showModal = (isAll = false) => {
    this.setState({
      modalVisible: true,
      isAll
    });
  };

  handleCloseModal = e => {
    e.preventDefault();
    this.setState({
      modalVisible: false,
      checkList: [], // 最大一次审批数量不超过50
      dataSource: this.state.dataSource.cloneWithRows(this.dataList)
    });
  };

  handleBlur = () => {
    window.scrollTo(0, 0);
  };

  handleValueChange = value => {
    this.reason = value;
  };

  render() {
    const { t } = this.props;
    const { checkable, isAll, checkList } = this.state;
    const separtor = (rowData, rowID) => {
      return (
        <div
          key={rowID}
          className="upm-mobile-approve-list-body__list__separtor"></div>
      );
    };
    const row = (rowData, sectionID, rowID) => {
      if (rowData == undefined) return;

      const authName = rowData.applyRoleDtos
        .map(it => {
          return it.refNameZh;
        })
        .join(', ');
      const applyUser = rowData.applyUser || {};
      const applyDate = moment(rowData.applyCreateAt).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      return (
        <div
          key={rowID}
          className="upm-mobile-approve-list-body__list__item"
          onTouchStart={this.handleTouchstart}
          onTouchEnd={this.handleTouchend}
          onContextMenu={e => e.preventDefault()}
          onClick={() => this.handleClick(rowData.approveId)}>
          <Flex
            className="upm-mobile-approve-list-body__list__item--flex"
            data-touch="true">
            {/* 批量操作 */}
            {checkable ? (
              <Flex.Item className="upm-mobile-approve-list-body__list__item__checkbox">
                <Checkbox
                  checked={checkList.includes(rowData.approveId)}></Checkbox>
              </Flex.Item>
            ) : null}
            {/* 列表内容 */}
            <Flex.Item className="upm-mobile-approve-list-body__list__item__content">
              <div className="upm-mobile-approve-list-body__list__item__title">
                {rowData.appName}
              </div>
              <Flex>
                <Flex.Item>
                  <div>{applyUser.nameDisplay || '-'}</div>
                </Flex.Item>
                <Flex.Item>
                  <div>{applyUser.accountName || '-'}</div>
                </Flex.Item>
              </Flex>
              <Flex className="upm-mobile-margin--bottom">
                <Flex.Item>
                  <div>{`${applyUser.deptDescr1}-${applyUser.deptDescr2}`}</div>
                </Flex.Item>
              </Flex>
              <Flex className="upm-mobile-margin--bottom">
                <Flex.Item>
                  {t('权限类型')} - {t(rowData.applyTypeName)}
                  <div className="auth-list">{authName}</div>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{ textAlign: 'right', color: '#888' }}>
                  {t('申请时间')} {applyDate}
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </div>
      );
    };

    return (
      <div className="upm-mobile-approve-list">
        <NavBar
          mode="light"
          rightContent={[
            checkable ? (
              <a key={1} onClick={this.handleDone}>
                {t('完成')}
              </a>
            ) : (
              <a key={2} onClick={this.handleMoreClick}>
                {t('管理')}
              </a>
            )
          ]}>
          {t('权限审批')}
          <Badge
            text={isOversea ? t('国际') : t('国内')}
            style={{
              marginLeft: 5,
              backgroundColor: '#ff7d4c',
              borderRadius: 2
            }}
          />
        </NavBar>
        <ListView
          ref={this.lv}
          dataSource={this.state.dataSource}
          renderHeader={() => <span>{t('待审批')}</span>}
          renderFooter={() => (
            <div className="upm-mobile-approve-list-body__list__bottom">
              {this.state.isLoading ? t('加载中...') : t('已无更多数据')}
            </div>
          )}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
          renderSeparator={separtor}
          style={{
            height: this.state.height,
            overflow: 'auto'
          }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          pullToRefresh={
            <PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        />
        {checkable ? (
          <div className="upm-mobile-approve-list-footer upm-mobile-base-bg">
            <div className="upm-mobile-border--top"></div>
            <div className="upm-mobile-approve-list-footer__content">
              <Flex className="upm-mobile-approve-list-body__list__item--flex">
                {/* <Flex.Item className="upm-mobile-approve-list-body__list__item__checkbox">
                  <Checkbox onChange={this.handleSelectAll}></Checkbox>
                </Flex.Item> */}
                <Flex.Item className="upm-mobile-approve-list-body__list__item__content">
                  <a onClick={this.handleAllPass}>{t('全选（最近50条）')}</a>
                </Flex.Item>
                <Flex.Item style={{ textAlign: 'right' }}>
                  <a onClick={this.handlePatchOperate}>{t('批量操作')}</a>
                </Flex.Item>
              </Flex>
            </div>
          </div>
        ) : null}
        <Modal
          popup
          maskClosable
          visible={this.state.modalVisible}
          animationType="slide-up">
          <p
            style={{ textAlign: 'left' }}
            className="upm-mobile-padding upm-mobile-border--bottom"
            dangerouslySetInnerHTML={{
              __html: t('您已勾选{{ total }}条审批单', {
                total: `<span class="upm-mobile-main-color">${checkList.length}</span>`,
                interpolation: { escapeValue: false }
              })
            }}></p>
          <TextareaItem
            rows={5}
            onBlur={this.handleBlur}
            onChange={this.handleValueChange}
            placeholder="请输入审批说明"
          />
          <div className="upm-mobile-border--bottom"></div>
          <Flex className="upm-mobile-padding">
            <Flex.Item>
              <a onClick={this.handleCloseModal}>{t('取消')}</a>
            </Flex.Item>
            <Flex.Item>
              <div className="upm-mobile-approve-list-buttonGroup">
                <a
                  className="upm-mobile-approve-list-button"
                  onClick={this.handlePatchPass}>
                  {t('通过')}
                </a>
                <a
                  className="upm-mobile-approve-list-button upm-mobile-approve-list-button--danger"
                  onClick={this.handleReject}>
                  {t('驳回')}
                </a>
              </div>
            </Flex.Item>
          </Flex>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { approveList } = state;
  return {
    approveList: approveList.list2
  };
};

export default translate()(connect(mapStateToProps)(ApproveList));
