/**
 * 地区绑定功能页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Checkbox,
  Tag,
  Spin
} from 'antd';
import config from '@config/style';
// import UTree from '@components/UTree';
import XTree from '@components/XTree';

// const { TreeNode } = Tree;
const FormItem = Form.Item;
const { searchForm } = config;

class RegionRele extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        name: ''
      },
      filterName: '',
      // expandedKeys: [],
      // autoExpandParent: false,
      // checkedKeys: [],
      // selectedKeys: [],
      selectedRegion: {},
      checkedAreaList: [],
      loadingData: false
      // externalCheckedAreaIdList: []
    };
    this.treeRootIdNameMapping = {};
    this.blacKMap = {};
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible != this.props.visible) {
      this.init();
    }
  }

  init = () => {
    const { account } = this.props;
    this.setState({
      loadingData: true
    });
    this.props.dispatch({
      type: 'cityBlacklist/fetchList',
      payload: {
        appId: this.props.appId
      }
    });

    this.props
      .dispatch({
        type: 'area/getAppArea',
        payload: this.props.appId
      })
      .then(() => {
        this.props
          .dispatch({
            type: 'account/fetchRelevantRegion',
            payload: {
              appId: this.props.appId,
              userId: account.id
            }
          })
          .then(() => {
            this.setState({
              loadingData: false
            });
            this.getCheckedAreaList();
            this.getBlackMap();
          });
      });
  };

  /**
   * 根据“地区数据”+“用户拥有权限id”，得到“用户拥有权限数据”
   */
  getCheckedAreaList = () => {
    const {
      account: { regionList },
      appAreas
    } = this.props;
    const areaTree = appAreas[this.props.appId]
      ? appAreas[this.props.appId]
      : [];
    const checkedAreaList = [];
    const loopTree = treeData => {
      treeData.forEach(item => {
        if (!item.pid) {
          // item.ancestorId = 'id_' + item.id;
          // item.isRoot = true
          //
          this.treeRootIdNameMapping[-item.businessId] = item.name;
        } else {
          // item.ancestorId = parentAncestorId;
        }
        if (regionList.indexOf(item.id) > -1) {
          checkedAreaList.push(item);
        }
        if (item.children) {
          loopTree(item.children);
        }
      });
    };
    loopTree(areaTree);
    this.setState({
      // checkedKeys: [...regionList],
      checkedAreaList
    });
  };

  /**
   * 获取“竞对城市”数据
   */
  getBlackMap = () => {
    const { cityBlacklist } = this.props;

    for (let i = 0; i < cityBlacklist.length; i++) {
      const cityBlack = cityBlacklist[i];

      this.blacKMap[cityBlack.areaId] = cityBlack;
    }
  };

  /**
   * 更新查询参数
   */
  handleChangeOnParams = params => {
    this.setState({
      params: {
        ...params
      }
    });
  };

  /**
   * 重置数据
   */
  resetAfterClose = () => {
    this.setState({
      params: {
        name: ''
      },
      filterName: '',
      checkedAreaList: []
      // externalCheckedAreaIdList: []
    });
    // this.props.dispatch({
    //   type: 'area/updateAreas',
    //   payload: {
    //     [this.props.appId]: []
    //   }
    // });
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: []
      }
    });
  };

  /**
   * 搜索功能
   */
  search = () => {
    // console.log(this.state.checkedAreaList);
    // const { checkedAreaList } = this.state;
    // const externalCheckedAreaIdList = [];
    // const loop = nodes => {
    //   nodes.forEach(node => {
    //     externalCheckedAreaIdList.push(node.id);
    //     if (node.children && node.children.length > 0) {
    //       loop(node.children);
    //     }
    //   });
    // };
    // checkedAreaList.forEach(item => {
    //   if (item.children && item.children.length > 0) {
    //     loop(item.children);
    //   }
    // });
    // // console.log(externalCheckedAreaIdList);
    // this.setState({
    //   externalCheckedAreaIdList
    // });
    this.setState({
      // autoExpandParent: true,
      filterName: this.state.params.name
    });
  };

  /**
   * 清空选择
   */
  clear = () => {
    this.setState({
      checkedAreaList: []
    });
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: []
      }
    });
  };

  /**
   * 绑定地区
   */
  relevantRegion = () => {
    const { id, regionList } = this.props.account;

    this.props
      .dispatch({
        type: 'account/relevantRegion',
        payload: {
          userId: id,
          appId: this.props.appId,
          areaIds: regionList
        }
      })
      .then(() => this.props.handleOk());
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  };

  /**
   * 标签关闭
   */
  handleCloseOnTag = areaId => {
    const newCheckedAreaIdList = [];
    const newCheckedAreaList = this.state.checkedAreaList.filter(item => {
      if (item.id !== areaId) {
        newCheckedAreaIdList.push(item.id);
        return true;
      }
    });
    this.setState({
      checkedAreaList: newCheckedAreaList
    });
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: newCheckedAreaIdList
      }
    });
  };

  /**
   * 格式化输出选中信息
   */
  formatChecked = checkedAreaList => {
    // console.log(checkedAreaList);
    const selectedList = {};
    for (let i = 0; i < checkedAreaList.length; i++) {
      const currentArea = checkedAreaList[i];
      if (selectedList[currentArea.businessId]) {
        selectedList[currentArea.businessId].push(currentArea);
      } else {
        selectedList[currentArea.businessId] = [currentArea];
      }
    }
    return (
      <div>
        {Object.keys(selectedList).map(businessId => {
          return (
            <li className="selected-list-li" key={businessId}>
              <span className="selected-list-li-label">
                {this.treeRootIdNameMapping[businessId]}：{' '}
              </span>
              <p>
                {selectedList[businessId].map(area => {
                  return (
                    <Tag
                      key={area.id}
                      className="selected-list-li-tag"
                      closable
                      onClose={() => this.handleCloseOnTag(area.id)}>
                      {area.name}
                    </Tag>
                  );
                })}
              </p>
            </li>
          );
        })}
      </div>
    );
  };

  /**
   * 设置所选择地区数据
   */
  getSelectedNode = item => {
    this.setState({
      selectedRegion: item || {}
    });
  };

  /**
   * 获取树状组件的选中数据
   */
  getRstCheckedNodes = rstCheckedNodes => {
    const rstCheckedNodesKeys = [];
    const checkedAreaList = rstCheckedNodes.map(rstCheckedNode => {
      rstCheckedNodesKeys.push(rstCheckedNode.node.props.dataRef.id);
      return rstCheckedNode.node.props.dataRef;
    });
    this.setState({
      checkedAreaList
    });
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: rstCheckedNodesKeys
      }
    });
  };

  /**
   * 过滤地区黑名单
   */
  handleChangeFilter = e => {
    let checkedKeys = this.props.account.regionList.slice();
    function filterByTrace(id, blacKMap) {
      const ids = Object.keys(blacKMap);
      for (let i = 0; i < ids.length; i++) {
        if (_.includes(blacKMap[ids[i]].parentIdList, +id)) {
          return true;
        }
      }
      return false;
    }
    if (e.target.checked) {
      // 过滤掉地区黑名单
      checkedKeys = checkedKeys.filter(key => {
        return !this.blacKMap[key] && !filterByTrace(key, this.blacKMap);
      });
    }
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: checkedKeys
      }
    });
  };

  /**
   * 重置筛选内容，filterName关联树状组件“级联属性”
   */
  resetFilterName = () => {
    // 保证树状组件处于“级联”状态
    return new Promise((resolve, reject) => {
      this.setState(
        {
          filterName: '',
          params: {
            name: ''
          }
          // externalCheckedAreaIdList: []
        },
        () => {
          resolve();
        }
      );
    });
  };

  render() {
    const { t } = this.props;
    const { appAreas, account } = this.props;
    const { filterName, checkedAreaList } = this.state;
    const area = appAreas[this.props.appId] ? appAreas[this.props.appId] : [];
    const formItemLayout = null;
    return (
      <Modal
        afterClose={this.resetAfterClose}
        className="upm-account-rele-region"
        title={t('绑定地区')}
        destroyOnClose={true}
        style={{
          top: '40px',
          ...this.props.style
        }}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}>
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleChangeOnParams={this.handleChangeOnParams}
          handleSearch={this.search}
          handleClear={this.clear}
          handleSave={this.relevantRegion}
        />
        <Row className="upm-tree-panel">
          <Spin spinning={this.state.loadingData}>
            <Col className="upm-tree-panel__left" span={12}>
              <Checkbox
                className="upm-account-rele-region__filter"
                onChange={this.handleChangeFilter}>
                {t('不包含竞对城市')}
              </Checkbox>
              <XTree
                filterName={filterName}
                // checkedKeys={
                //   filterName
                //     ? [
                //         ...account.regionList,
                //         ...this.state.externalCheckedAreaIdList
                //       ]
                //     : account.regionList
                // }
                checkedKeys={account.regionList}
                checkedAreaList={this.state.checkedAreaList}
                treeData={area}
                getRstCheckedNodes={this.getRstCheckedNodes}
                getSelectedNode={this.getSelectedNode}
                resetFilterName={this.resetFilterName}
              />
            </Col>
            <Col className="upm-tree-panel__right" span={12}>
              <div className="upm-account-rele-region__info upm-border-bottom">
                <label className="upm-tree-panel__label">
                  {t('当前选中：')}
                </label>
                {this.formatChecked(checkedAreaList)}
              </div>
              <div>
                <label className="upm-tree-panel__label">
                  {t('地区详情：')}
                </label>
                <Form className="upm-account-rele-region__detail">
                  <FormItem label={t('地区名称')} {...formItemLayout}>
                    <Input
                      value={this.state.selectedRegion.name || '-'}
                      disabled
                    />
                  </FormItem>
                  <FormItem label={t('AID')} {...formItemLayout}>
                    <Input
                      value={this.state.selectedRegion.aid || '-'}
                      disabled
                    />
                  </FormItem>
                  <FormItem label={t('关联出租车ID')} {...formItemLayout}>
                    <Input
                      value={this.state.selectedRegion.taxiId || '-'}
                      disabled
                    />
                  </FormItem>
                </Form>
              </div>
            </Col>
          </Spin>
        </Row>
      </Modal>
    );
  }
}

function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator } = props.form;

  return (
    <Form
      className="upm-form"
      onSubmit={e => {
        e.preventDefault();
        props.handleSearch();
      }}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('名称')} {...searchForm}>
            {getFieldDecorator('name', {})(
              <Input placeholder={t('名称/中文名/URL')} />
            )}
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem {...searchForm}>
            <Button
              className="upm-form__button"
              type="primary"
              htmlType="submit">
              {t('查询')}
            </Button>
            <Button
              className="upm-form__button"
              type="primary"
              onClick={props.handleClear}>
              {t('清空选择')}
            </Button>
            <Button
              className="upm-form__button"
              type="primary"
              onClick={props.handleSave}>
              {t('保存')}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 角色查询组件
 */
const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.params, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },
  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    props.handleChangeOnParams(values);
  }
})(SearchForm);

export default connect(({ area, account, global, cityBlacklist }) => {
  return {
    appId: global.managingApp,
    cityBlacklist: cityBlacklist.list,
    appAreas: area.appAreas,
    account: account.account
  };
})(RegionRele);
