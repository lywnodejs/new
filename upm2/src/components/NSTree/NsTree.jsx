import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { notification, Spin, Icon, Tooltip, message, Tag } from 'antd';
import localforage from 'localforage';
import $ from 'jquery';
import _ from 'lodash';
import './lib/ztree/js/jquery.ztree.all.js';
import './lib/ztree/css/zTreeStyle/zTreeStyle.css';
import './assets/index.less';
import Search from './Search';
import Collect from './Collect';
import Splitter from './Splitter';
import { selectNode } from './util';
import { transferXhrToPromise, getTreeXhr, getAllTreeXhr, getCollectListXhr, collectNs, cancelCollectNs } from './services';

const noop = function noop() {};
const defaultSearchSettings = {
  enabled: true,
  searchValue: '',
};

class NsTree extends Component {
  static propTypes = {
    theme: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    overflowX: PropTypes.string,
    defaultDepth: PropTypes.number, // 默认的起始层级,用于查询节点
    beforeInit: PropTypes.func,
    afterInit: PropTypes.func,
    zTreeObjSetting: PropTypes.object,
    treeId: PropTypes.string,
    treeApi: PropTypes.string,
    permPoint: PropTypes.string,
    search: PropTypes.object,
    contextmenu: PropTypes.object,
    collect: PropTypes.object,
    isAll: PropTypes.bool,
  };

  static defaultProps = {
    theme: 'light',
    width: 200,
    height: 500,
    overflowX: 'auto',
    defaultDepth: 3,
    beforeInit: treeData => _.get(treeData, 'children[0].children[0].children', []), // 默认显示 PDL 节点，对应 defaultDepth
    afterInit: undefined,
    zTreeObjSetting: {},
    treeId: 'nsTree',
    permPoint: '', // 展示树的权限点
    treeApi: 'http://tree.odin.intra.xiaojukeji.com',
    search: defaultSearchSettings,
    contextmenu: {
      enabled: false,
    },
    collect: {
      enabled: false,
    },
    isAll: false,
  };

  constructor(props) {
    super(props);
    const { search = {}, height } = props;
    const searchSettings = { ...defaultSearchSettings, ...search };
    const { searchValue } = searchSettings;
    const nstreeCollectHeight = window.localStorage.getItem('nstreeCollectHeight');

    this.state = {
      treeLoading: false,
      zTreeObj: undefined,
      searchValue,
      diff: 0,
      contextmenuTop: -999999,
      contextmenuLeft: -999999,
      collectLoading: false,
      collects: [],
    };
    this.collectMinHeight = 30;
    this.collectMaxHeight = 150;
    this.collectDefaultHeight = nstreeCollectHeight ? _.toNumber(nstreeCollectHeight) : this.collectMinHeight;
    this.searchTree = this.searchTree.bind(this);
    this.onSearchValueChange = this.onSearchValueChange.bind(this);
    this.refreshTreeCbk = this.refreshTreeCbk.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.bindEvent();
    this.containerHeight = this.refs.nstreeContainer.offsetHeight;
    this.contentHeight = this.containerHeight - this.collectDefaultHeight;
    this.collectHeight = this.collectDefaultHeight;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      this.setState({ searchValue: nextProps.searchValue });
    } else if (!_.isEqual(nextProps.searchSettings, this.props.searchSettings)) {
      this.setState({ searchSettings: nextProps.searchSettings });
    }
  }

  componentWillUnmount() {
    const { treeId } = this.props;

    $(document).off(`refresh.${treeId}`);
    $(document).off(`updateSearchSettings.${treeId}`);
    $(document).off(`click.nsCollect.${treeId}`);
    this.fetchTreeRequest && this.fetchTreeRequest.abort();
    this.fetchTreeCollectRequest && this.fetchTreeCollectRequest.abort();
    this.collectRequest && this.collectRequest.abort();
    this.cancelCollectRequest && this.cancelCollectRequest.abort();
  }

  async fetchData(loadMode = {
    isLoadCollect: true,
    isLoadTree: true,
  }) {
    const { treeApi, collect, permPoint, isAll } = this.props;
    let treeData = [];

    try {
      if (collect.enabled && loadMode.isLoadCollect) {
        this.setState({ collectLoading: true });
        this.fetchTreeCollectRequest && this.fetchTreeCollectRequest.abort();

        const collectListXhr = getCollectListXhr(treeApi);
        const collects = collectListXhr;

        this.setState({
          collectLoading: false,
          collects,
        });
      }

      if (loadMode.isLoadTree) {
        this.setState({ treeLoading: true });
        this.fetchTreeRequest && this.fetchTreeRequest.abort();

        let treeXhr = await getTreeXhr(treeApi, {
          search: this.state.searchValue,
          // permPoint,
        });

        // if (isAll) {
        //   treeXhr = await getAllTreeXhr(treeApi, {
        //     search: this.state.searchValue,
        //     // permPoint,
        //   });
        // }

        treeData = treeXhr;

        this.setState({ treeLoading: false, fromCacheTag: false });
        this.treeData = treeData;
        this.initTree(treeData);

        localforage.setItem('treeData', treeData).catch((err) => {
          console.log('设置 treeData 缓存数据失败');
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        collectLoading: false,
        treeLoading: false,
      });
      if (e.statusText === 'abort') return;

      function errorNotify() {
        notification.error({
          message: '服务树加载失败！',
          description: e.responseText,
        });
      }

      localforage.getItem('treeData').then((value) => {
        if (value) {
          console.log('读取 treeData 缓存数据成功');
          this.setState({ fromCacheTag: true });
          this.treeData = value;
          this.initTree(value);
        } else {
          console.log('读取 treeData 缓存数据失败，缓存已失效');
          ReactDOM.render(
            <div style={{
              color: '#ddd',
              width: 160,
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <img
                src={require('./assets/images/noData.png')}
                style={{
                  opacity: 0.3,
                  width: 60,
                  marginTop: 10,
                }}
              />
              <br />
              加载数据超时，请
              <a onClick={() => {
                this.fetchData({
                  isLoadCollect: false,
                  isLoadTree: true,
                });
              }}>重试</a>
            </div>,
            document.getElementById(this.props.treeId),
          );
        }
      }).catch((err) => {
        console.log('读取 treeData 缓存数据失败', err);
        errorNotify();
      });
    }
  }

  bindEvent() {
    const { treeId } = this.props;

    $(document).off(`refresh.${treeId}`).on(`refresh.${treeId}`, this.refreshTreeCbk);
    $(document).off(`updateSearchSettings.${treeId}`)
    .on(`updateSearchSettings.${treeId}`, (event, searchSettings, callback) => {
      if (callback) {
        callback(this);
      } else {
        this.setState({
          searchValue: searchSettings.searchValue,
        }, () => {
          this.initTree({ search: this.state.searchValue });
        });
      }
    });
    $(document).off(`click.nsCollect.${treeId}`).on(`click.nsCollect.${treeId}`, (e) => {
      this.setState({
        contextmenuTop: -99999,
        contextmenuLeft: -99999,
      });
    });
  }

  refreshTreeCbk(event, callback) {
    if (callback) {
      callback(this);
    } else {
      this.searchTree();
    }
  }

  onSearchValueChange(value) {
    this.setState({ searchValue: value }, () => {
      this.searchTree();
    });
  }

  initTree(treeData = this.treeData) {
    const { treeId, zTreeObjSetting, beforeInit, afterInit, contextmenu, collect, defaultDepth } = this.props;
    const { collects } = this.state;
    let zTreeObj = this.zTreeObj;

    if (zTreeObj && typeof zTreeObj.destroy === 'function') zTreeObj.destroy();

    const newTreeData = beforeInit(treeData) || treeData;
    const defaultNs = _.find(collects, item => item.is_default === 1);

    if (contextmenu.enabled) {
      zTreeObjSetting.callback = zTreeObjSetting.callback || {};
      zTreeObjSetting.callback.onRightClick = (event, treeId, treeNode) => {
        this.rightClickTreeNode = treeNode;
        this.setState({
          contextmenuLeft: event.clientX,
          contextmenuTop: event.clientY,
        });
      };
    }

    if (!_.isEmpty(newTreeData)) {
      this.zTreeObj = $.fn.zTree.init($(`#${treeId}`), zTreeObjSetting, newTreeData);

      if (_.isFunction(afterInit)) {
        afterInit(this.zTreeObj, defaultNs ? defaultNs.name : undefined);
      } else {
        if (defaultNs && defaultNs.name) {
          selectNode(this.zTreeObj, defaultNs.name, '.', defaultDepth);
        }
      }
    } else {
      ReactDOM.render(
        <div style={{
          color: '#ddd',
          width: 160,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <img
            src={require('./assets/images/noData.png')}
            style={{
              opacity: 0.3,
              width: 60,
              marginTop: 10,
            }}
          />
          <br />
          没有权限查看任何节点<br />
          前往<a href="http://odin.xiaojukeji.com/#/perm" target="_blank">权限系统</a>申请权限<br />
          <br />
          或<br />
          <br />
          没有搜索到节点
        </div>,
        document.getElementById(treeId),
      );
    }
  }

  searchTree() {
    const { searchValue } = this.state;

    this.fetchData({
      isLoadCollect: false,
      isLoadTree: true,
    });
  }

  handleCollectNs = (type) => {
    const { treeApi } = this.props;

    if (this.rightClickTreeNode) {
      this.collectRequest = collectNs(treeApi, this.rightClickTreeNode.ns, type).done(() => {
        message.success('节点收藏成功！');
        this.fetchData({
          isLoadTree: false,
          isLoadCollect: true,
        });
      }).fail((xhr) => {
        if (xhr.statusText !== 'abort') {
          notification.error({
            message: '节点收藏失败！',
            description: xhr.responseText,
          });
        }
      });
    }
  }

  handleClickCollect = (ns) => {
    if (this.zTreeObj) {
      selectNode(this.zTreeObj, ns, '.', this.props.defaultDepth);
    } else {
      // 暂无数据 -> 点击收藏节点
    }
  }

  handleCancelCollect = (ns) => {
    const { treeApi } = this.props;

    if (ns) {
      this.cancelCollectRequest = cancelCollectNs(treeApi, ns).done(() => {
        message.success('节点取消收藏成功！');
        this.fetchData({
          isLoadTree: false,
          isLoadCollect: true,
        });
      }).fail((xhr) => {
        if (xhr.statusText !== 'abort') {
          notification.error({
            message: '节点取消收藏失败！',
            description: xhr.responseText,
          });
        }
      });
    }
  }

  render() {
    const {
      theme,
      width,
      height,
      overflowX,
      treeId,
      search,
      contextmenu,
      collect,
    } = this.props;
    const { searchValue, diff, fromCacheTag } = this.state;
    const activeCollectHeight = this.collectDefaultHeight + diff;

    return (
      <div
        ref="nstreeContainer"
        className={theme === 'light' ? 'nstree-container' : 'nstree-container nstree-dark-container'}
        style={{
          minWidth: 180,
          minHeight: 300,
          width,
          height,
          border: `1px solid ${theme === 'light' ? '#e7e9ed' : '#283339'}`,
          background: theme === 'light' ? '#FFF' : '#283339',
          paddingTop: search.enabled ? 36 : 0,
          // paddingBottom: 10,
          position: 'relative',
        }}>
        {
          search.enabled &&
          <Search
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            value={searchValue}
            placeholder={search.placeholder}
            onSearchValueChange={this.onSearchValueChange}
          />
        }
        <div
          style={{
            height: collect.enabled ? `calc(100% - ${activeCollectHeight}px)` : '100%',
            position: 'relative',
            paddingTop: 5,
          }}>
          {
            fromCacheTag ?
              <div className="from-cache-tag">
                <Tooltip title="接口请求异常目前数据来自客户端缓存，缓存数据将无法使用搜索功能。">
                  <Tag color="red">from cache</Tag>
                </Tooltip>
              </div> : null
          }
          <div
            className="nstree-scrollbar"
            style={{
              height: collect.enabled ? 'calc(100% - 20px)' : 'calc(100% - 5px)',
              overflowX,
              overflowY: 'auto',
            }}>
            <Spin spinning={this.state.treeLoading}>
              <div id={treeId} className='ztree' style={{ minHeight: 100 }}/>
            </Spin>
          </div>
          <div
            style={{
              display: collect.enabled ? 'block' : 'none',
              color: '#ddd',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            <Icon type="exclamation-circle-o" /> 右键收藏节点
          </div>
        </div>
        {
          collect.enabled &&
            <div
              style={{
                height: activeCollectHeight,
                position: 'relative',
              }}>
              <div
                style={{
                  borderTop: "1px solid #e7e9ed",
                  height: '100%'
                }}>
                <div className="nstree-collect-header">
                  收藏节点
                  <Splitter
                    onResizeStart={() => {
                      return this.state.diff;
                    }}
                    onResize={(diff) => {
                      if (
                        this.collectHeight + diff < this.collectMaxHeight &&
                        this.collectHeight + diff > this.collectMinHeight
                      ) {
                        this.setState({ diff });
                      }
                    }}
                    onResizeEnd={() => {
                      window.localStorage.setItem('nstreeCollectHeight', activeCollectHeight);
                    }}
                  />
                </div>
                <div className="nstree-scrollbar nstree-collects"
                  style={{
                    overflowX,
                  }}>
                  <Collect
                    treeId={treeId}
                    loading={this.state.collectLoading}
                    collects={this.state.collects}
                    onClickCollect={this.handleClickCollect}
                    onCancelCollect={this.handleCancelCollect}
                  />
                </div>
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
                    <a onClick={() => this.handleCollectNs(0)}>收藏</a>
                  </li>
                  <li>
                    <a onClick={() => this.handleCollectNs(1)}>设为默认节点</a>
                  </li>
                  {
                    _.isFunction(contextmenu.extra) ? contextmenu.extra(this.rightClickTreeNode) : null
                  }
                </ul>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default NsTree;
