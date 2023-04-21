import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form,
  Table, Card, Modal,
  Button, Input, Divider,
  Tag, message
} from 'antd';
import SystemList from '../../../components/SystemList';
import TextButton from '../../../components/TextButton';
import _ from 'lodash';

import './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class MyRolePermission extends React.Component {

  state = {
    isModalVisible: false,
    appId: '',
    name: '',
    currentRole: ''
  };

  fetchRoleList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permissionList/fetchRoleList',
      payload: { ...params }
    });
  };

  handleSearchFieldChange = (key, value='') => {
    this.setState({
      [key]: value
    });
  };

  handleFetch = (page) => {
    const { appId, name } = this.state;
    this.fetchRoleList({ appId, roleName: name, page });
  };

  handleDelete = (record) => {
    const { appId } = this.state;
    const { dispatch, t, roleSearches } = this.props;

    dispatch({
      type: 'permissionList/removeRolePermission',
      payload: {
        appId,
        roleId: record.roleId
      }
    }).then(() => {
      this.handleFetch(roleSearches.current);
    });
  };

  handelDisplayDetail = (record) => {
    const { appId } = this.state;
    const { roleMap } = this.props;
    const roleId = record.roleId;
    if (!roleMap[roleId]) {
      this.props.dispatch({
        type: 'permissionList/fetchRoleDetail',
        payload: {
          roleId,
          appId
        }
      });
    }

    this.setState({
      isModalVisible: true,
      currentRole: roleId
    });
  };

  handleOk = () => {
    this.setState({
      isModalVisible: false,
      currentRole: ''
    });
  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      currentRole: ''
    });
  }

  confirmDelete = (record) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录?'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleDelete(record)
    });
  }

  getStrategy(roleStrategyOutDtos, userTags, strategyName) {
    const { t } = this.props;

    if (_.isEmpty(roleStrategyOutDtos)) {
      return t('无');
    }

    return (
      <div className="sheet-strategy" >
        <h4>{t('名称')}：{strategyName}</h4>
        {_.map(userTags, userTag => {
          const tags = userTag.tagDimes;

          return _.map(tags, tag => {
            return (
              <div key={tag.tagId} className="sheet-tag" >
                <div>{tag.tagName}</div>
                {_.map(tag.dimes, dimension =>
                  <div key={dimension.dimeId} className="sheet-dimension-detail" >
                    <div className="dimension-label">{dimension.dimeName}：</div>
                    <div className="dimension-content" >
                      {dimension.nodes && dimension.nodes.length > 0 ?
                        _.map(dimension.nodes, dimeNode =>
                          <Tag key={dimeNode.dimeNodeId} >{dimeNode.dimeNodeName}</Tag>
                        ) : (
                          <span>{t('无')}</span>
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    );
  }

  getColumns = () => {
    const { t } = this.props;
    const columns = [{
      title: t('ID'),
      dataIndex: 'roleId',
    }, {
      title: t('系统'),
      dataIndex: 'appName',
    }, {
      title:  t('申请角色'),
      dataIndex: 'roleName',
    }, {
      title:  t('创建时间'),
      dataIndex: 'createdAt',
    },{
      title:  t('到期时间'),
      dataIndex: 'expireTime',
    },{
      title:  t('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div>
            <TextButton
              onClick={() => this.handelDisplayDetail(record)}
            >
              {t('详情')}
            </TextButton>
            <Divider type="vertical" />
            <TextButton
              onClick={() => this.confirmDelete(record)}
            >
              {t('删除')}
            </TextButton>
          </div>
        );
      }
    }];
    return columns;
  };

  handlePageChange = (page) => this.handleFetch(page);

  componentWillUnmount() {
    this.props.dispatch({
      type: 'permissionList/resetRole'
    });
  }

  render() {
    const { t, roleList, roleSearches, roleMap } = this.props;
    const { appId, isModalVisible, currentRole } = this.state;

    let roleName = '', roleStrategyOutDtos = [], msg = '', userTags = [], strategyName = '';

    const roleDetail = roleMap[currentRole];
    if (roleDetail) {
      roleName = t(roleDetail.roleName);
      roleStrategyOutDtos = roleDetail.roleStrategyOutDtos;
      msg = roleDetail.msg;
      userTags = roleDetail.userTags;
      strategyName = roleDetail.strategyName;
    }

    const { current, size, total } = roleSearches;

    return (
      <Card title={t('我拥有的角色权限')} className="RolePermission-page">
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
                label={t('角色名') + ':'}
              >
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  onChange={(e) => this.handleSearchFieldChange('name', e.target.value)}
                  style={{width: '100%'}}
                />
              </FormItem>
            </Col>
            <Col span={3} className="search-button">
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handleFetch()}>
                  {t('搜索')}
                </Button>
              </FormItem>
            </Col>
          </Row>

          <Table
            size="small"
            className="upm-table"
            rowKey="roleId"
            columns={this.getColumns()}
            dataSource={roleList}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </div>
        <Modal
          width={620}
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="sheet-detail">
            <div className="detail-block role-block" >
              <div className="block-title" >{t('申请角色信息')}</div>
              <div className="block-content" >
                <div className="apply-rolename" >
                  {roleName}
                </div>
                <div className="apply-reason" >
                  {t('备注')}：{msg}
                </div>
              </div>
            </div>
            <div className="detail-block strategy-block" >
              <div className="block-title" >{t('申请策略信息')}</div>
              <div className="block-content" >
                {this.getStrategy(roleStrategyOutDtos, userTags, strategyName)}
              </div>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }
}

export default connect(({ permissionList }) => {
  return {
    roleList: permissionList.roleList,
    roleSearches: permissionList.roleSearches,
    roleMap: permissionList.roleMap,
  };
})(MyRolePermission);
