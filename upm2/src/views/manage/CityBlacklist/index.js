import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import AvailableApps from '../../../components/AvailableApps/index';

import {
  Button, Select, Table, Card, Row, Col, message
} from 'antd';
import connect from '@utils/translateConnect';

import './index.less';

const Option = Select.Option;

const getColumns = t => [{
  title: t('地区ID'),
  dataIndex: 'areaId'
}, {
  title: t('地区名'),
  dataIndex: 'name'
}, {
  title: t('添加时间'),
  dataIndex: 'createdAt',
  render: (time) => `${moment(time).format('YYYY-MM-DD HH:mm')}`
}];

class CityBlacklist extends Component {
  state = {
    selected: [],
    input: '',
    businessId: '',
    suggestions: []
  };

  componentDidMount() {
    this.props.getBusiness();

    if (!_.isUndefined(this.props.appId)) {
      this.props.getBlackCities(this.props.appId);
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isUndefined(prevProps.appId) && !_.isUndefined(this.props.appId)) {
      this.props.getBlackCities(this.props.appId);
    }
  }

  debouncedSearch = _.debounce(this.props.getSuggestions, 250, { 'maxWait': 800 });

  handleSelectChange = (value) => {
    if (value !== this.state.input) {
      this.setState({
        input: value
      }, () => {
        this.debouncedSearch(value, this.props.appId, this.state.businessId);
      });
    }
  };

  handleRmCities = () => {
    this.props.rmCities(this.state.selected, this.props.appId).then(() => {
      message.info(this.props.t('删除成功！'));

      this.setState({
        selected: []
      });
    });
  };

  handleAddCity = () => {
    const {
      addToList,
      appId,
      list,
      t
    } = this.props;
    const { input } = this.state;
    const city = input.match(/(.*)\((\d+)\)/);

    const cityId = Number(city[2]);
    if (_.find(list, { areaId: cityId})) {
      message.warning(t('已存在敏感城市中！'));
      return;
    }

    if (city) {
      addToList(city[1], cityId, appId).then(() => {
        message.info(t('添加成功！'));
        this.setState({
          input: '',
        });
      });
    }
  };

  handleBusinessChange = (value) => {
    const { businessId } = this.state;

    if (businessId === value) {
      return;
    }

    this.setState({
      businessId: value,
      input: '',
      suggestions: []
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions && nextProps.suggestions !== this.props.suggestions) {
      this.setState({
        suggestions: nextProps.suggestions
      });
    }
  }

  handleAppChange = () => {
    const { appId, getBlackCities } = this.props;
    getBlackCities(appId);

    this.setState({
      input: '',
      suggestions: []
    });
  };

  onSelectListChange = (ids) => {
    this.setState({
      selected: ids
    });
  };

  render() {
    const { t, list, businessList } = this.props;
    const { selected, input, businessId, suggestions } = this.state;
    const rowSelection = {
      selectedRowKeys: selected,
      onChange: this.onSelectListChange,
    };

    const options = suggestions.map(({name, id}) =>
      <Option value={`${name}(${id})`} key={id}>{`${name}(${id})`}</Option>
    );

    return (
      <div className="CityBlacklist">
        <Card
          title={t('添加敏感地区')}
          className="bottom-spacer"
        >
          <Row gutter={24} className="search-fields">
            <Col span={12}>
              <span>{t('系统：')}</span>

              <AvailableApps
                style={{width: 200}}
                changeCallBack={this.handleAppChange}
              />
            </Col>

            <Col span={12}>
              <span>{t('业务线：')}</span>

              <Select
                showSearch
                optionFilterProp="children"
                value={businessId}
                onChange={this.handleBusinessChange}
                style={{width: 200}}
              >
                {businessList.map((bus) => (
                  <Option
                    key={bus.id}
                    value={bus.id}
                  >
                    {bus.commonName || bus.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={12}>
              <div className="bind-city-area">
                <span>{t('地区：')}</span>

                <Select
                  className="city-input"
                  mode="combobox"
                  value={input}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onChange={this.handleSelectChange}
                  optionLabelProp="children"
                >
                  {options}
                </Select>

                <Button
                  type="primary"
                  onClick={this.handleAddCity}
                  disabled={businessId === '' || !/.*\(\d+\)/.test(input)}
                >
                  {t('确定')}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
        <Card title={t('敏感地区列表')}>
          <Button
            type="danger"
            onClick={this.handleRmCities}
            disabled={selected.length === 0}
            className="bottom-spacer"
          >
            {t('移除')}
          </Button>

          <Table
            size="small"
            rowSelection={rowSelection}
            columns={getColumns(t)}
            dataSource={list}
            rowKey="id"
            pagination={true}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ cityBlacklist, global, area }) => {
  const { list, suggestions } = cityBlacklist;

  return {
    list,
    suggestions,
    appId: global.managingApp,
    businessList: area.business,
  };
}, (dispatch) => ({
  getBlackCities(appId) {
    dispatch({
      type: 'cityBlacklist/fetchList',
      payload: {
        appId
      }
    });
  },
  getSuggestions(input, appId, businessId) {
    dispatch({
      type: 'cityBlacklist/getSuggestions',
      payload: {
        input,
        appId,
        businessId
      }
    });
  },
  rmCities(ids, appId) {
    return dispatch({
      type: 'cityBlacklist/rmCities',
      payload: {
        ids,
        appId
      }
    });
  },
  addToList(cityName, cityId, appId) {
    return dispatch({
      type: 'cityBlacklist/addToList',
      payload: {
        cityId,
        appId,
        cityName
      }
    });
  },
  getBusiness() {
    dispatch({
      type: 'area/getBusiness'
    });
  },
}))(CityBlacklist);
