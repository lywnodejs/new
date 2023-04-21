import React, { Component } from 'react';

import {
  Button, Form, Input, Card,
  Col, Row, Select, message,
} from 'antd';
import connect from '@utils/translateConnect';
import {
  getRolesFromCache,
  refreshRolesToRedis,
  getFlagsFromCache,
  refreshFlagsToRedis,
  getRegionFromCache,
  refreshRegionToRedis
} from '@services/serviceCache';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class ServiceCache extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: '',
    };

    this.appId = '';
    this.userName = '';
    this.actType = 'role';
  }
  search = () => {
    const {t} = this.props;
    const appId = this.appId;
    const userName = this.userName;
    const actType = this.actType;

    if (!appId || !userName) {
      message.error(t('请输入系统 Id 和用户名！'));
      return;
    }

    switch (actType) {
    case 'role':
      getRolesFromCache({
        appId,
        userName,
      }).then((result) => {
        // console.log('getRolesFromCache', result);
  
        this.setState({
          jsonData: result
        });
  
      }).catch((err) => {
        console.log('getRolesFromCache err', err);
      });
      break;
    case 'flag':
      getFlagsFromCache({
        appId,
        userName,
      }).then((result) => {
        // console.log('getFlagsFromCache', result);

        this.setState({
          jsonData: result
        });

      }).catch((err) => {
        console.log('getFlagsFromCache err', err);
      });
      break;
    case 'region':
      getRegionFromCache({
        appId,
        userName,
      }).then((result) => {
        // console.log('getRegionFromCache', result);

        this.setState({
          jsonData: result
        });

      }).catch((err) => {
        console.log('getRegionFromCache err', err);
      });
      break;
    }

    
  }
  refresh = () => {
    const {t} = this.props;
    const appId = this.appId;
    const userName = this.userName;
    const actType = this.actType;

    if (!appId || !userName) {
      message.error(t('请输入系统 Id 和用户名！'));
      return;
    }
    switch (actType) {
    case 'role':
      refreshRolesToRedis({
        appId,
        userName
      }).then((result) => {
        message.success(t('刷入角色数据成功！'));

        // console.log('refreshRolesToRedis', result);
      }).catch((err) => {
        message.error(t('刷入角色数据失败！'));

        console.log('refreshRolesToRedis err', err);
      });
      break;
    case 'flag':
      refreshFlagsToRedis({
        appId,
        userName
      }).then((result) => {
        message.success(t('刷入角色数据成功！'));

        // console.log('refreshFlagsToRedis', result);
      }).catch((err) => {
        message.error(t('刷入角色数据失败！'));

        console.log('refreshFlagsToRedis err', err);
      });
      break;
    case 'region':
      refreshRegionToRedis({
        appId,
        userName
      }).then((result) => {
        message.success(t('刷入角色数据成功！'));

        // console.log('refreshRegionToRedis', result);
      }).catch((err) => {
        message.error(t('刷入角色数据失败！'));

        console.log('refreshRegionToRedis err', err);
      });
      break;
    }
    
    
  }
  changeType = (value) => {
    this.actType = value;
  }
  changeUsr = (e) => {
    this.userName = e.target.value;
  }
  changeSysId = (e) => {
    this.appId = e.target.value;
  }
  render() { 
    const { t } = this.props;
    const { jsonData } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <div className="service-cache">
        <Card title={t('业务缓存')} bordered={false}>
          <Form layout="inline">
          <Row>
            <Col span={5}>
              <FormItem {...formItemLayout} label={t('用户名')}>
                <Input onChange={this.changeUsr}
                  placeholder={t('请输入用户名')}
                />
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={t('系统 Id')}>
                <Input onChange={this.changeSysId}
                  placeholder={t('请输入系统 Id')}
                />
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} style={{width: '100%'}} label={t('类型')}>
                <Select defaultValue="role" onChange={this.changeType}>
                  <Option value="role">{t('角色')}</Option>
                  <Option value="flag">{t('标记位')}</Option>
                  <Option value="region">{t('地区')}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row className="row-container">
            <Col span={6}>
              <FormItem>
                <Button className="act-btn"
                  type="primary"
                  onClick={this.search}>
                  {t('查询')}
                </Button>
                <Button
                  type="primary"
                  onClick={this.refresh}>
                  {t('刷内容到缓存')}
                </Button>
              </FormItem>
            </Col>
          </Row>
          
          <Row>
            <Col className="json-output">
              <div>{jsonData}</div>
            </Col>
          </Row>
          </Form>
        </Card>

      </div>
    );
  }
}
 
export default connect()(Form.create()(ServiceCache));