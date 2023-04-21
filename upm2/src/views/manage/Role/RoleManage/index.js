/**
 * 角色管理页面
 * by zhangdi
 *
 */
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import connect from '@utils/translateConnect';
import { translate } from 'react-i18next';
import { Row, Col, Form, Input, Select, Button, Table, Modal, Popover, Switch, Upload, message } from 'antd';
import AvailableApps from '@components/AvailableApps';
import config from '@config/style';
import { isOversea } from '@config/env';
import { MANAGE } from '@routes/config';
import isBigData from '@utils/isBigData';
import { apiHost } from '@config/apiConfig';
import EditModal from './EditModal'; // 角色编辑页面
import StrategyModal from './StrategyModal'; // 分配角色组页面
import FeatureModal from './FeatureModal'; // 功能分配页面
import FlagModal from './FlagModal'; // 功能分配页面
import UserModal from './UserModal'; // 关联用户页面
import RoleGroupModal from './RoleGroupModal'; // 分配角色组页面
import FeatureGroupModal from './FeatureGroupModal'; // 分配角色组页面
import ProductLineModal from './ProductLineModal';
import TagModal from './TagModal';

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const Option = Select.Option;
const TableStyle = {
  buttonSize: 'small'
};
const TAGS_OBJ = {
  [1]: '安全客服'
};

/**
 * 角色条件查询
 * @param {*} props
 */
function SearchForm ({ t, form, roleDimeList, handleSearch, renderRickLevelType, handleAdd, renderLabelIdType, handleCheckChange, appId, renderAllowApply }) {
  const { getFieldDecorator } = form;
  const SHEET_TYPE = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const propsForUpdateUpload = {
    name: 'file',
    accept: SHEET_TYPE,
    action: apiHost + '/v2/roleManage/list/import',
    headers: {},
    withCredentials: true,
    data: {
      appId
    },
    onChange (info) {
      const {
        file: {
          status,
          response
        }
      } = info;

      if (status === 'done') {
        if (response.code >= 200 && response.code <= 300) {
          message.success(t('批量修改成功！'));
        } else {
          message.error(response.msg);
        }
      } else if (status === 'error') {
        // 服务端返回 error 显示需要在 info.event 寻找
        message.error(t('批量添加失败！'));
      }
    },
  };
  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('目标系统')} {...searchForm}>
            <AvailableApps hideClosed={true} changeCallBack={handleSearch} />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('角色唯一标识')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('角色名称')} {...searchForm}>
            {getFieldDecorator('nameZh', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...searchForm} label={t('角色分类')}>
            {getFieldDecorator('labelIds')(
              <Select mode="multiple"  >
                {renderLabelIdType()}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...searchForm} label={t('敏感级')}>
            {getFieldDecorator('riskLevel', {
              initialValue: '',
            })(
              <Select   >
                <Option value="" key="-1">{t('全部')}</Option>
                {renderRickLevelType()}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...searchForm} label={t('可申请')}>
            {getFieldDecorator('isApplicable', {
              initialValue: '',
            })(
              <Select   >
                <Option value="" key="-1">{t('全部')}</Option>
                {renderAllowApply()}
              </Select>
            )}
          </FormItem>
        </Col>

        {isOversea && <Col span={8} >
          <FormItem
            label={t('国家')}
            {...searchForm}
          >
            {getFieldDecorator('dimeNodeId', {})(
              <Select placeholder={t('国家')} allowClear >
                {_.map(roleDimeList, ({ id, dimeNodeName }) =>
                  <Select.Option key={id} value={id} >{dimeNodeName}</Select.Option>
                )}
              </Select>
            )}
          </FormItem>
        </Col>}
        <Col span={8}>
          <FormItem {...searchForm}>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleAdd}>{t('新增')}</Button>
            <Button
              type="primary"
              href={apiHost + '/v2/roleManage/list/export?appId=' + appId}>
              {t('导出')}
            </Button>
            <Upload {...propsForUpdateUpload} className="add-uploader">
              <Button
                className="btn"
                disabled={!appId}>
                {t('批量导入')}
              </Button>
            </Upload>
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Col  >
          <span>待完善角色</span>{getFieldDecorator('imperfect', {})(<Switch onChange={handleCheckChange} checkedChildren="1" unCheckedChildren="0" />)}
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 角色查询组件
 */
const SearchFormWrapper = translate()(Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields ({ params }) {
    let fields = {};
    _.each(params, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange (props, values) {
    props.handleValueChange(values);
  }
})(SearchForm));

/**
 * 角色管理组件
 * 包括查询和列表展示功能
 */
class RoleManage extends React.PureComponent {
  imperfect = false
  // 设置查询参数
  state = {
    // 查询参数
    params: {
      name: '', // 标识
      nameZh: '', // 名称
      produceLineId: '0', // 产品线
      riskLevel: '',//敏感级,
      labelIds: [],
      appId: 0
    },
    // 模态框设置
    modal: {
      type: 'edit', // 模态框类型
      style: {}, // 模态框
      visible: false, // 模态框状态
      loading: false // 加载状态
    },
    oper: 'create', // 角色操作类型 create，新增 update，编辑
    current: 1, // 表格当前页
  };

  renderRickLevelType = () => {
    return ['C1', 'C2', 'C3', 'C4'].map(entity => <Option key={entity} value={entity}>{entity}</Option>);
  };
  renderAllowApply = () => {
    return [{ value: 1, name: '是' }, { value: 0, name: '否' }].map(entity => <Option key={entity.value} value={entity.value}>{entity.name}</Option>);
  };
  renderLabelIdType = () => {
    const { allRolelabelList } = this.props;
    if (allRolelabelList.length == 0) {
      return null;
    }
    return allRolelabelList.map(entity => <Select.Option key={entity.id} value={entity.id}>{entity.name}</Select.Option>);
  }
  render () {
    const { t, roleDimeList, appId } = this.props;
    const {
      records: datas,
      size: pageSize, total,
    } = this.props.roleList;
    const { current } = this.state;

    const isBigDataApp = isBigData(appId);

    return (
      <div className="upm-content">
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          roleDimeList={roleDimeList}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          renderRickLevelType={this.renderRickLevelType}
          handleAdd={this.createRole}
          renderLabelIdType={this.renderLabelIdType}
          handleCheckChange={this.handleCheckChange}
          appId={this.props.appId}
          renderAllowApply={this.renderAllowApply}
        />
        <Table className="upm-table"
          dataSource={datas}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}>
          <Column title={t('角色编号')} dataIndex="id" />
          <Column title={t('角色唯一标识')} dataIndex="name" />
          <Column title={t('角色名称')} dataIndex="commonName" />
          <Column title={t('角色描述')} dataIndex="description" ellipsis="true" />
          <Column title={t('可申请')} dataIndex="isApplicable" render={text => text ? '是' : '否'} />
          {isOversea && <Column title={t('国家')} dataIndex="dimeNodeName" />}
          <Column
            title={t('创建时间')}
            dataIndex="createdAt"
            width={200}
            render={(text, record) => {
              if (record.createdAt) {
                return moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss');
              }
            }}
          />
          <Column
            title={t('所属分类')}
            dataIndex="labels"
            render={(text, record) => {
              if (record.labels && _.isArray(record.labels)) {
                return record.labels.map((item) => {
                  return item.name;
                }).join(',');
              }
            }}
          />
          <Column title={t('敏感级')} dataIndex="riskLevel" />
          <Column
            title={t('操作')}
            key="action"
            width={100}
            render={(text, record) => {
              const content = (
                <span>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.updateRole(record)}>{t('编辑')}</Button>
                  <Button className="upm-popover__button" type="danger"
                    size={TableStyle.buttonSize}
                    onClick={() => this.removeRole(record)}
                  >
                    {t('删除')}
                  </Button>
                  <Button className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.copyRole(record)}
                  >
                    {t('复制')}
                  </Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.configStrategy(record)}>{t('策略维度')}</Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.distrFeature(record)}>{t('功能分配')}</Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.distrIdentify(record)}>{t('标识位')}</Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.relevantUser(record)}>{t('用户绑定')}</Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.relevantGroup(record)}>{t('角色组')}</Button>
                  <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.relevantFeatureGroup(record)}>{t('功能组')}</Button>
                </span>
              );

              return (
                <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={content} placement="topRight" trigger="click">
                  <Button size={TableStyle.buttonSize}>{t('操作')}</Button>
                </Popover>
              );
            }}
          />
        </Table>
        {this.createModal()}
      </div>
    );
  }
  getLabelslist = () => {
    const { dispatch, appId } = this.props;
    dispatch({
      type: 'role/fetchRolelabelListALL',
      payload: {
        appId,
      }
    });
  }
  componentDidMount () {
    this.search();
    const { dispatch, appId } = this.props;
    if (isOversea) {
      dispatch({
        type: 'role/fetchRoleDimeList',
        payload: {
          appId,
        },
      });
    }
  }
  /**
   * 动态创建模态框
   */
  createModal = () => {
    const ModalMap = {
      'edit': <EditModal {...this.state.modal} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'strategy': <StrategyModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'rele': <UserModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'feature': <FeatureModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'flag': <FlagModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'group': <RoleGroupModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'featureGroup': <FeatureGroupModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'productLine': <ProductLineModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'setTags': <TagModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} idType={2} />,
      'removeTags': <TagModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} isRemove idType={2} />
    };

    return ModalMap[this.state.modal.type];
  };

  trim = (data) => {
    const result = {};
    for (let key in data) {
      result[key] = _.trim(data[key]);
    }
    return result;
  }

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.setState({
      params: {
        ...this.state.params,
        ...state
      }
    });
  };

  /**
   * 搜索
   */
  search = (page = 1) => {
    this.props.dispatch({
      type: 'role/fetchRole',
      payload: {
        ...this.state.params,
        imperfect: this.imperfect,
        appId: this.props.appId,
        page
      }
    });
  }
  handleCheckChange = (checked) => {
    this.imperfect = checked;
    this.search();
  }
  /**
   * 查询操作
   */
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { appId, dispatch } = this.props;
    this.getLabelslist();
    if (isBigData(appId)) {
      dispatch({
        type: 'newApply/fetchProductLine',
        payload: {
          appId: appId,
        }
      });
    }
    this.search();
  };

  /**
   * 分页操作
   */
  handlePageChange = current => {
    this.setState({
      current
    }, () => {
      this.search(current);
    });
  }

  /**
   * 点击模态框确认按钮
   */
  handleOk = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    });

    // 刷新页面
    this.search();
  };

  /**
   * 设置/删除标签
   */
  // showTags = (role, type) => {
  //   this.setCurrent(role)
  //   this.openModal(type)
  // }

  /**
   * 点击模态框关闭按钮
   */
  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    });
  }

  /**
   * 打开模态框
   */
  openModal = (type, oper) => {
    this.setState({
      modal: {
        ...this.state.modal,
        type,
        visible: true
      },
      oper
    });
  };

  /**
   * 设置当前选中角色
   */
  setCurrent = (role) => {
    // 更新角色信息
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: role
    });
  };

  /**
   * 添加角色
   */
  createRole = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  };

  /**
   * 修改角色
   */
  updateRole = (role) => {
    this.setCurrent(role);
    this.openModal('edit', 'update');
  };
  // 复制角色
  copyRole = (role) => {
    this.setCurrent(role);
    this.openModal('edit', 'copy');
  }

  /**
   * 删除角色
   */
  removeRole = (role) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'role/removeRole',
          payload: {
            id: role.id,
            appId: role.appId
          }
        }).then(() => {
          this.search();
        });
      }
    });
  };

  /**
   * 配置策略
   */
  configStrategy = (role) => {
    this.setCurrent(role);
    this.props.dispatch(routerRedux.push(`${MANAGE}/strategy/update/${this.props.appId}/${role.id}`));
  };

  /**
   * 分配功能
   */
  distrFeature = (role) => {
    this.setCurrent(role);

    // 获取功能全集
    this.props.dispatch({
      type: 'feature/fetch',
      payload: {
        appId: role.appId
      }
    });

    // 获取绑定功能
    this.props.dispatch({
      type: 'role/fetchRelevantFeature',
      payload: {
        appId: role.appId,
        id: role.id
      }
    }).then(() => this.openModal('feature'));
  };

  bindProductLine = (role) => {
    this.setCurrent(role);

    this.openModal('productLine');
  };

  /**
   * 分配标识位
   */
  distrIdentify = (role) => {
    this.setCurrent(role);

    // 获取标识位全集
    this.props.dispatch({
      type: 'flags/fetch',
      payload: role.appId
    });

    // 获取绑定标识位
    this.props.dispatch({
      type: 'role/fetchRelevantFlag',
      payload: {
        appId: role.appId,
        id: role.id
      }
    }).then(() => this.openModal('flag'));
  };

  /**
   * 关联用户
   */
  relevantUser = (role) => {
    this.setCurrent(role);
    this.props.dispatch({
      type: 'role/fetchRelevantUser',
      payload: {
        id: role.id,
        appId: role.appId
      }
    }).then(() => this.openModal('rele'));
  };

  /**
   * 关联角色组
   */
  relevantGroup = (role) => {
    this.setCurrent(role);
    Promise.all([
      this.props.dispatch({
        type: 'role/fetchRelevantGroup',
        payload: {
          id: role.id,
          appId: role.appId
        }
      }),
      this.props.dispatch({
        type: 'role/fetchRoleGroupAll',
        payload: {
          appId: role.appId
        }
      })
    ]).then(() => {
      this.openModal('group');
    });
  };
  /**
   * 关联功能组
   */
  relevantFeatureGroup = (role) => {
    this.setCurrent(role);
    Promise.all([
      // 获取角色关联功能组
      this.props.dispatch({
        type: 'role/fetchRelevantFeatureGroup',
        payload: {
          id: role.id,
          appId: role.appId
        }
      }),
      // 获取所有功能组
      this.props.dispatch({
        type: 'role/fetchFeatureGroupAll',
        payload: {
          appId: role.appId
        }
      })
    ]).then(() => {
      this.openModal('featureGroup');
    });
  };
}


export default connect(({ role, global }) => {
  return {
    roleList: role.roleList,
    roleDimeList: role.roleDimeList,
    allRolelabelList: role.allRolelabelList,
    appId: global.managingAvailableApp
  };
})(RoleManage);
