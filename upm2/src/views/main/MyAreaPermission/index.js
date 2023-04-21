import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Table, Card, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from "dva/router"
import SystemList from '../../../components/SystemList';

const FormItem = Form.Item;
const { Option } = Select;

class MyAreaPermission extends React.Component {

  state = {
    businessId: '',
  }

  fetchAreaList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permissionList/fetchAreaList',
      payload: { ...params }
    });
  }

  handleBusinessChange = (value) => {
    this.setState({
      businessId: value
    });
  };

  requestData = ({page = 1}) => {
    const { businessId, appId } = this.state;
    this.fetchAreaList({businessId, appId, page});
  }

  getColumns = () => {
    const { t } = this.props;
    const columns = [{
      title: t('业务线'),
      dataIndex: 'businessName',
    }, {
      title:  t('地区名'),
      key: 'areaName',
      render: (text, record) => {
        return record.areaDto.map(area => (
          <div key={area.aid}>{area.name}</div>
        ));
      }
    }, {
      title:  t('创建时间'),
      key: 'createAt',
      dataIndex: 'createAt',
      render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm')
    }, {
      title:  t('过期时间'),
      key: 'expireAt',
      dataIndex: 'expireAt',
      render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm')
    }, {
      title:  t('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <Button size="small" onClick={this.goToApply}>
            {t('编辑')}
          </Button>
        );
      }
    }];
    return columns;
  }

  goToApply = () => {
    this.props.dispatch(routerRedux.push(`./apply-area-permission/${this.state.appId}?businessId=${this.state.businessId}`));
  };

  handlePageChange = (page) => this.requestData(page);

  renderOptions = () => {
    const { allBusiness, t } = this.props;
    return _.map(allBusiness, (area) => {
      return (
        <Option key={area.id} value={area.id}>
          {t(area.name)}
        </Option>
      );
    });
  }

  handleSearchFieldChange = (key, value='') => {
    this.setState({
      [key]: value
    });
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'permissionList/resetArea'
    });
  }

  render() {
    const { t, areaList, areaSearches } = this.props;
    const { current, size, total } = areaSearches;
    const { appId } = this.state

    return (
      <Card title={t('我拥有的地区权限')} style={{ marginTop: 25 }}>
        <div className="content-area">
          <Row gutter={24}>
            <Col span={10} className="search-fields">
              <FormItem
                label={t('目标系统') + ':'}
              >
                <SystemList
                  value={appId}
                  onChange={(appId) => this.handleSearchFieldChange('appId', appId)}
                  style={{width: '100%'}}
                />
              </FormItem>
            </Col>
            <Col span={10} className="search-fields">
              <FormItem
                label={t('业务线选择：')}
              >
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.handleBusinessChange}
                  placeholder={t('请选择')}
                  style={{width: '100%'}}
                >
                  {this.renderOptions()}
                </Select>
              </FormItem>
            </Col>
            <Col span={3} className="search-button">
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={this.requestData}>
                  {t('搜索')}
                </Button>
              </FormItem>
            </Col>
          </Row>

          <Table
            size="small"
            className="upm-table"
            rowKey="createAt"
            columns={this.getColumns()}
            dataSource={areaList}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          >
          </Table>
        </div>
      </Card>
    );
  }
}

export default connect(({ global, permissionList }) => {
  return {
    allBusiness: global.allBusiness,
    areaList: permissionList.areaList,
    areaSearches: permissionList.areaSearches,
  };
})(MyAreaPermission);
