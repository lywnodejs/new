import React from 'react';
import connect from '@utils/translateConnect';
import { trackEvent } from '@utils/omega';
import { routerRedux } from 'dva/router';
import { MAIN } from '../../../routes/config';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Select,
  Table,
  Tree,
  Spin,
  Modal,
  DatePicker,
  Affix
} from 'antd';
import CBreadcrumb from '@components/Breadcrumb';
import request, { postJSON } from '../../../utils/request';
import { getSystemList } from '../../../services/global';
import { echoMessage } from '../../../utils/notice';
import './index.less';

import {
  TOOLS_PAGE_VIEW_ROLE_SEARCH,
  TOOLS_PAGE_VIEW_ROLE_APPLY,
  TOOLS_PAGE_VIEW_ROLE_SUBMIT
} from '@config/omega';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const { Column } = Table;

class Tools extends React.Component {
  constructor(props) {
    super(props);

    let appId = '';
    if (location.search) {
      const arr = location.search
        .split('?')[1]
        .split('&')
        .reduce((total, i) => {
          total[i.split('=')[0]] = i.split('=')[1];
          return total;
        }, {});
      appId = Number(arr.appId);
    }
    // 设置 initial state
    this.state = {
      input: '',
      select: '',
      data: [],
      result: [],
      loading: false,
      modalVisible: false,
      modalInfo: { role: {} },
      modalInput: '',
      deleteCacheKey: '',
      modalInputEmpty: false,
      canRenderSelect: false, // 因为defaultValue只有第一次渲染有效，所以等到有数据再渲染组件
      expires: Date.now() + 180 * 24 * 60 * 60 * 1000 // 默认失效日期
    };

    getSystemList().then(res => {
      res.length
        ? this.setState({
            data: res,
            select: appId || res[0].appId,
            canRenderSelect: true
          })
        : this.setState({ data: res, canRenderSelect: true });
    });
  }

  handleFetch() {
    if (!this.state.select) {
      echoMessage(t('目标系统不允许为空'), 'warning');
      return;
    }
    trackEvent(TOOLS_PAGE_VIEW_ROLE_SEARCH);
    this.setState({ loading: true });

    const urlKeyword = encodeURIComponent(this.state.input);
    request(
      `/v2/tools/getRoleByUrl?appId=${this.state.select}&url=${urlKeyword}`
    ).then(
      res => {
        const result = res.map((item, i) => {
          return {
            key: i + '',
            ...item
          };
        });
        this.setState({
          result: result,
          loading: false
        });
      },
      err => {
        this.setState({ loading: false });
      }
    );
  }

  cacheSerchChange = e => {
    this.setState({
      deleteCacheKey: e.target.value
    });
  };

  // handleDeleteCacheByKey(){
  //   const { deleteCacheKey } = this.state
  //   if(deleteCacheKey === '' || deleteCacheKey === undefined){
  //     echoMessage('请输入cache的key', 'warning')
  //     return
  //   }
  //   postJSON('/cache/deleteCacheByKey', {
  //     appId: 888,
  //     key: deleteCacheKey
  //   }).then((data) => {
  //     console.log(data)
  //   })
  // }

  handleSelectChange(value) {
    console.log(typeof value);
    this.setState({ select: value });
  }

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  handleModalIunputChange(e) {
    this.setState({
      modalInput: e.target.value,
      modalInputEmpty: e.target.value === ''
    });
  }

  handleClkApply(e, record) {
    trackEvent(TOOLS_PAGE_VIEW_ROLE_APPLY);
    const { dispatch, t } = this.props;
    const params = {
      groupIds: [],
      appId: record.role.appId,
      roleIds: [record.role.id]
    };
    postJSON('/v2/strategy/findStrByRoles', params).then(res => {
      if (res.roleStrategyOutDto.length) {
        echoMessage(t('该角色需要填写策略'));
        dispatch(
          routerRedux.push({
            pathname: `${MAIN}/new-apply`,
            search: `?appId=${record.role.appId}&id=${record.role.id}`
          })
        );
      } else {
        this.setState({
          modalVisible: true,
          modalInfo: record,
          modalInput: ''
        });
      }
    });
  }

  handleOk = e => {
    const { userInfo, dispatch } = this.props;

    if (this.state.modalInput === '') {
      this.setState({
        modalInputEmpty: true
      });
      return;
    }

    trackEvent(TOOLS_PAGE_VIEW_ROLE_SUBMIT);
    const params = {
      appId: this.state.modalInfo.role.appId,
      areaList: [],
      expireTime: this.state.expires,
      remark: this.state.modalInput,
      roles: [
        {
          dimeNodeList: [],
          refId: this.state.modalInfo.role.id,
          strategyId: null,
          type: 2,
          typeId: ''
        }
      ],
      type: 1,
      userNames: [userInfo.username]
    };
    postJSON('/v2/apply/add', params).then(res => {
      dispatch(routerRedux.push(`${MAIN}/apply`));
    });
  };

  handleCancel = e => {
    this.setState({
      modalVisible: false,
      modalInputEmpty: false
    });
  };

  modifyTreeTitle = node => {
    const input = this.state.input;
    const urlArray = node.url.split(input);

    if (urlArray.length <= 1 || input === '') {
      return (
        <span>
          {node.name}: {node.url}
        </span>
      );
    }

    // 高亮输入内容
    const result = [];
    urlArray.forEach(i => {
      result.push(<span>{i}</span>);
      result.push(<span style={{ color: '#ff7d4c' }}>{input}</span>);
    });
    result.pop();
    return (
      <span>
        {node.name}: {result}
      </span>
    );
  };
  changeDatePicker = date => {
    this.setState({
      expires: date.valueOf()
    });
  };
  handleReset = () => {
    this.setState(
      {
        input: '',
        select: this.state.data[0].appId
      },
      () => {
        this.handleFetch();
      }
    );
  };
  render() {
    const { t, dispatch } = this.props;
    const arr = this.state.result;
    const breadcrumbProps = {
      data: [
        // {
        //   text: t('首页'),
        //   url: `${MAIN}`
        // },
        {
          text: t('小工具')
        },
        {
          text: t('角色定位工具')
        }
      ],
      dispatch
    };

    // console.log('history', history.location.state)

    // let defSystemId = this.state.data.length ? this.state.data[0].appId : '';
    // // router 传递当前系统数据
    // if (history.location.state) {
    //   const { selectedSystem } = history.location.state;
    //   defSystemId = selectedSystem.appId;
    // }
    // console.log(this.state.select , 4444)
    return (
      <div className="my-tools">
        <CBreadcrumb {...breadcrumbProps} />
        <div className="tools-header">
          <span className="title">{t('角色定位工具')}</span>
          <span className="info">
            {t('试试看？根据已知的系统URL点击搜索，总有一个角色适合您哦！')}
          </span>
        </div>
        <div className="my-tools__tool">
          <Card className="RolePermission-page" bordered={false}>
            <div className="content-area">
              <Form>
                <Row gutter={48}>
                  <Col span={8} className="search-fields">
                    <FormItem label={t('目标系统')}>
                      {this.state.canRenderSelect ? (
                        <Select
                          style={{ width: '100%' }}
                          showSearch
                          filterOption={(input, option) => {
                            const { children } = option.props;
                            return (
                              children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          allowClear
                          onChange={value => this.handleSelectChange(value)}
                          placeholder={t('请输入需要访问的目标系统')}
                          value={this.state.select}
                          defaultValue={this.state.select}>
                          {this.state.data.map(({ appName, appId }) => {
                            return (
                              <Option key={appId} value={appId}>
                                {appName}
                              </Option>
                            );
                          })}
                        </Select>
                      ) : (
                        <Spin />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10} className="search-fields">
                    <FormItem label={t('url')}>
                      <Input
                        value={this.state.input}
                        onChange={e => this.handleInputChange(e)}
                        placeholder={t(
                          '请输入关键URL信息进行搜索，查找适合我的角色。例如：xiaojukeji'
                        )}
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <FormItem label="">
                      <Button
                        style={{ marginRight: '8px' }}
                        onClick={this.handleReset}>
                        {t('重置')}
                      </Button>
                      <Button
                        type="primary"
                        icon="search"
                        onClick={() => this.handleFetch()}>
                        {t('搜索')}
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row gutter={24}>
                <Col span={24} className="search-fields">
                  <span className="searchinfo">{t('搜索结果')}：</span>
                </Col>
              </Row>
              <Row style={{ marginTop: '16px' }}>
                <Table
                  loading={this.state.loading}
                  rowKey="key"
                  dataSource={arr}>
                  <Column
                    width="45%"
                    title={t('对应角色')}
                    dataIndex="role.id"
                    render={(text, record) => (
                      <span>
                        {record.role.nameZh}
                        <a
                          href="javascript:void(0);"
                          style={{ marginLeft: 10 + 'px' }}
                          onClick={e => this.handleClkApply(e, record)}>
                          {t('快速申请')}
                        </a>
                      </span>
                    )}
                  />
                  <Column
                    title={
                      <span style={{ position: 'relative' }}>
                        {' '}
                        <i className="tabel_header_line"></i>{' '}
                        {t('依据URL搜索内容匹配的结果')}
                      </span>
                    }
                    dataIndex="action"
                    render={(text, record) => (
                      <Tree autoExpandParent={false}>
                        <TreeNode
                          title={`${record.featureDtoList.length}条结果`}>
                          {record.featureDtoList.map(node => {
                            return (
                              <TreeNode
                                selectable={false}
                                key={node.id}
                                title={this.modifyTreeTitle(node)}></TreeNode>
                            );
                          })}
                        </TreeNode>
                      </Tree>
                    )}
                  />
                </Table>
              </Row>
            </div>
          </Card>
          {/* <Card title="去除缓存小工具">
          <Col span={20} className="search-fields">
            <Input onChange={this.cacheSerchChange}/>
          </Col>
          <Col span={3} className="search-button" style={{ marginLeft: '20px' }}>
            <Button
              type="primary"
              onClick={() => this.handleDeleteCacheByKey()}>
              {t('删除')}
            </Button>
          </Col>
        </Card> */}
          <Modal
            title={`申请${this.state.modalInfo.role.nameZh}权限`}
            visible={this.state.modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <Row gutter={24} className="shortcut-apply-row">
              <Col span={6}>
                <span style={{ lineHeight: 32 + 'px' }}>
                  {t('申请理由')} <i className="required">*</i>
                </span>
              </Col>
              <Col span={18}>
                <Input onChange={e => this.handleModalIunputChange(e)} />
                {this.state.modalInputEmpty ? (
                  <span style={{ color: '#f5222d' }}>
                    {t('申请理由不允许为空')}
                  </span>
                ) : (
                  ''
                )}
              </Col>
            </Row>
            <Row gutter={24} className="shortcut-apply-row">
              <Col span={6}>
                <span style={{ lineHeight: 32 + 'px' }}>
                  {t('权限失效日期')}
                </span>
              </Col>
              <Col span={18}>
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={this.changeDatePicker}
                />
              </Col>
            </Row>
          </Modal>
        </div>
        <section className=""></section>
      </div>
    );
  }
}

// export default Tools;
export default connect(({ userInfo }) => {
  return {
    userInfo: userInfo
  };
})(Tools);
