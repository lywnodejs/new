/**
 * 地区绑定功能页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Modal, Checkbox, Icon } from 'antd';
import config from '@config/style';
import UTree from '@components/UTree';

const FormItem = Form.Item;
const match = UTree.match;
const { searchForm } = config;

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
 * 查询组件
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

class RegionRele extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        name: ''
      },
      selectedRegion: {
        name: '',
        nameZh: ''
      },
      checkedRegions: [] // 选中项
    };
    this.blacKMap = {};
  }

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
   * 重置筛选条件
   */
  resetFilterFields = () => {
    this.setState({
      params: {
        name: ''
      }
    });
  };

  /**
   * 搜索功能
   */
  search = ({ name }) => {
    this.setState({
      params: {
        name
      }
    });
  };

  /**
   * 清楚选择功能
   */
  clear = () => {
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: []
      }
    });
  };

  disabledCheckbox = item => {
    return item.pid == null;
  };

  disabledSelect = item => {
    return item.pid != null;
  };

  /**
   * 绑定标识位
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

  checkedRegions = (checked, checkedRegions) => {
    // 更新选中节点集合
    this.setState({
      checkedRegions
    });

    // 更新选中id集合
    this.props.dispatch({
      type: 'account/mergeAccount',
      payload: {
        regionList: checked
      }
    });
  };

  /**
   * 设置当前点击项
   */
  selectedRegion = (keys, selectedRegion) => {
    this.setState({
      selectedRegion
    });
  };
  //删除以选择项
  deleteselect = item => {
    const { appAreas, account } = this.props;
    const area = appAreas[this.props.appId];
    const allSelect = match(
      area,
      account.regionList,
      (key, node) => key == node.id
    );

    let selectDelete = [];
    let seleIdList = this.props.account.regionList;
    let connet = [];

    allSelect.map((sele, index) => {
      if (sele.id != item.id) {
        selectDelete.push(sele);
      }
    });
    seleIdList.map(A => {
      if (A != item.id) {
        connet.push(A);
      }
    });
    let seleIdListL = [...connet];
    this.checkedRegions(seleIdListL, selectDelete);
  };

  /**
   * 格式化输出选中信息
   */
  formatChecked = () => {
    const { appAreas, account } = this.props;
    const area = appAreas[this.props.appId];
    const checkedAreas = match(
      area,
      account.regionList,
      (key, node) => key == node.id
    );
    const areaAllList = {};
    let selectList = [];
    let parent = null;
    let setData_ = arr => {
      if (arr.parentNode) {
        setData_(arr.parentNode);
      } else {
        parent = arr;
      }
    };
    checkedAreas.map((area, index) => {
      setData_(area);
      if (selectList[parent.name] && selectList[parent.name].length !== 0) {
        selectList[parent.name].push(area);
      } else {
        selectList[parent.name] = [];
        selectList[parent.name].push(area);
      }
    });

    let key = Object.keys(selectList);

    let wrapper = (
      <div>
        {key.map(i => {
          return (
            <li className="selectParentBox">
              <span className="selectParentName">{i}: </span>
              <p>
                {selectList[i].map((item, index) => {
                  return (
                    <span className="selectArea_l" attr-id={i}>
                      {item.name}
                      <Icon
                        onClick={() => {
                          this.deleteselect(item);
                        }}
                        type="close"
                        className="areaIconSelect"></Icon>
                    </span>
                  );
                })}
              </p>
            </li>
          );
        })}
      </div>
    );

    return wrapper;
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
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

  componentWillMount() {
    const { cityBlacklist } = this.props;

    for (let i = 0; i < cityBlacklist.length; i++) {
      const cityBlack = cityBlacklist[i];

      this.blacKMap[cityBlack.areaId] = cityBlack;
    }
  }

  render() {
    const { t } = this.props;
    const { appAreas, account } = this.props;
    const area = appAreas[this.props.appId] ? appAreas[this.props.appId] : [];
    const formItemLayout = null;

    return (
      <Modal
        afterClose={this.resetFilterFields}
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
        footer={[]}>
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleChangeOnParams={this.handleChangeOnParams}
          handleSearch={this.search}
          handleClear={this.clear}
          handleSave={this.relevantRegion}
        />
        <Row className="upm-tree-panel">
          <Col className="upm-tree-panel__left" span={12}>
            <Checkbox
              className="upm-account-rele-region__filter"
              onChange={this.handleChangeFilter}>
              {t('不包含竞对城市')}
            </Checkbox>
            <UTree
              checkable
              showLine
              nodes={area}
              isSelectable={this.disabledSelect}
              isDisableCheckbox={this.disabledCheckbox}
              searchValue={this.state.params.name}
              checkedKeys={account.regionList}
              onCheck={this.checkedRegions}
              onSelect={this.selectedRegion}
            />
          </Col>
          <Col className="upm-tree-panel__right" span={12}>
            <div className="upm-account-rele-region__info upm-border-bottom">
              <label className="upm-tree-panel__label">{t('当前选中：')}</label>
              {this.formatChecked()}
            </div>
            <div>
              <label className="upm-tree-panel__label">{t('地区详情：')}</label>
              <Form className="upm-account-rele-region__detail">
                <FormItem label={t('地区名称')} {...formItemLayout}>
                  <Input value={this.state.selectedRegion.name} disabled />
                </FormItem>
                <FormItem label={t('AID')} {...formItemLayout}>
                  <Input value={this.state.selectedRegion.aid} disabled />
                </FormItem>
                <FormItem label={t('关联出租车ID')} {...formItemLayout}>
                  <Input value={this.state.selectedRegion.taxiId} disabled />
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default connect(({ area, account, global, cityBlacklist }) => {
  return {
    appId: global.managingApp,
    cityBlacklist: cityBlacklist.list,
    appAreas: area.appAreas,
    account: account.account
  };
})(RegionRele);
