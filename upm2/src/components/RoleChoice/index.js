import React from 'react';
import {
  Input,
  Table,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Tag,
  Checkbox,
  Modal,
  Popconfirm
} from 'antd';
import _ from 'lodash';
import { echoMessage } from '@utils/notice';
import connect from '@utils/translateConnect';
const Option = Select.Option;
const FormItem = Form.Item;

class RoleChoice extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    inputSelectedRows: [],
    resourceName: '',
    resourceKey: '',
    businessId: '',
    dataApp: '', // 指标超市
    labelId: '', // 角色分类
    site: '', // 站点
    // isBindingId: undefined, //是否已绑定
    bind: '',
    oldData: null,
    isBindingList: [
      {
        id: 'false',
        name: '未绑定'
      },
      {
        id: 'true',
        name: '已绑定'
      }
    ],
    bindRoleList: [], //已绑定列表
    tableData: [], //表格数据
    hideOnSinglePage: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      roleAllList,
      type,
      flagBindRoles,
      featureBindRoles,
      groupBindRoles
    } = this.props;
    let data = null;
    if (type === 'flagRoleList') {
      data = flagBindRoles;
    }
    if (type === 'roleList') {
      data = featureBindRoles;
    }
    if (type === 'groupRoleList') {
      data = groupBindRoles;
    }
    this.setState(
      {
        selectedRows: [...this.getTableData(data)]
      },
      () => {
        this.fetchRoleList();
      }
    );
  }

  //获取角色列表
  fetchRoleList = (page = 1) => {
    const {
      resourceName,
      resourceKey,
      resourceTypeId,
      businessId,
      labelId,
      id,
      nameZh,
      bind
    } = this.state;
    const { appId, featureId, flagId, type } = this.props;
    this.setState({
      current: page,
      selectedRowKeys: []
    });
    let params = null;
    if (type == 'flagRoleList') {
      params = {
        appId,
        flagId,
        bind,
        nameZh: resourceName,
        roleId: resourceKey,
        labelIds: labelId ? [labelId] : null,
        page,
        size: 20,
        type: this.props.type
      };
    } else {
      params = {
        appId,
        featureId,
        bind,
        nameZh: resourceName,
        roleId: resourceKey,
        labelIds: labelId ? [labelId] : null,
        page,
        size: 20,
        type: this.props.type
      };
    }
    this.props.fetchRoleList(params);
  };

  //表格数据处理
  getTableData = records => {
    const levelMapping = {
      1: 'C1',
      2: 'C2',
      3: 'C3',
      4: 'C4'
    };
    // console.log(records);
    const dataList = [];
    _.each(records, (record, index) => {
      const data = {};
      let level = _.filter(record.properties, ['attrName', 'riskLevel']);
      data.key = index;
      data.value = record.id;
      data.label = record.commonName || record.resourceName || record.nameZh;
      data.resourceKey = record.resourceKey || record.id;
      data.businessId = record.businessId;
      data.businessName = record.businessName;
      data.description = record.description;
      data.labels = record.labels;
      data.riskLevel = record.riskLevel;
      data.level = level.length > 0 ? levelMapping[level[0].attrValue] : '';
      _.each(record.properties, property => {
        const { attrName, attrValue } = property;
        data[attrName] = record.hasOwnProperty(attrName)
          ? record[attrName]
          : attrValue;
      });
      data.business = data.business || record.businessName;
      dataList.push(data);
    });
    return dataList;
  };

  //表格配置项
  getTableColumns = () => {
    const { t } = this.props;
    return [
      {
        title: t('角色分类'),
        dataIndex: 'labels',
        width: 200,
        render: (text, record) => {
          if (record.labels && _.isArray(record.labels)) {
            return record.labels
              .map(item => {
                return item.name;
              })
              .join(',');
          }
        }
      },
      {
        title: t('角色ID'),
        dataIndex: 'resourceKey',
        width: 200
      },
      {
        title: t('角色名称'),
        dataIndex: 'label',
        width: 300
      },
      {
        title: t('角色描述'),
        dataIndex: 'description',
        width: 300
      },
      {
        title: t('业务线'),
        dataIndex: 'business',
        width: 100
      },
      {
        title: t('敏感级'),
        dataIndex: 'riskLevel',
        width: 100
      }
    ];
  };

  //删除已选，上下同步
  deleteSelectdRows = item => {
    let { selectedRows } = this.state;
    if (_.isArray(item)) {
      item.forEach(item => {
        _.remove(selectedRows, i => item.value === i.value);
      });
    } else {
      _.remove(selectedRows, i => item.value === i.value);
    }
    this.setState({
      selectedRows: [...selectedRows],
      inputSelectedRows: [...selectedRows]
    });
  };

  handleLabelIdChange = labelId => {
    this.setState(
      {
        labelId
      },
      () => {}
    );
  };

  //绑定搜索框的值
  handleFormItemChange = name => e => {
    e.preventDefault();
    this.setState({
      [name]: e.target.value
    });
  };

  handleFetch = page => {
    this.fetchRoleList(page);
  };

  //换页
  handlePageChange = page => {
    this.handleFetch(page);
  };

  //绑定
  bindOnChange = bind => {
    this.setState(
      {
        bind
      },
      () => {}
    );
  };

  reset = () => {
    this.setState({
      resourceName: '',
      resourceKey: '',
      bind: '',
      nameZh: '',
      roleId: '',
      labelIds: null,
      selectedRows: []
    });
  };

  handleOk = () => {
    const { type, appId, flagId, featureId } = this.props;
    const { selectedRows } = this.state;
    let params = null;
    if (type == 'flagRoleList') {
      params = {
        appId,
        flagId,
        selectedRows
      };
    } else {
      params = {
        appId,
        featureId,
        selectedRows
      };
    }
    this.props.submit(params);
    this.reset();
  };

  handleCancel = () => {
    this.reset();
    this.props.onCancel();
  };

  render() {
    let {
      selectedRows,
      businessId,
      resourceName,
      resourceKey,
      dataApp,
      labelId,
      bind,
      isBindingList
    } = this.state;
    const {
      t,
      handleChange,
      roleLabelList,
      modalVisible,
      labelList,
      roleAllList,
      appId,
      featureId,
      flagId
    } = this.props;
    if (roleAllList == undefined) {
      return null;
    }
    const { records, size, total } = roleAllList;
    const data = this.getTableData(records);
    const columns = this.getTableColumns();
    //表格可选配置
    const rowSelection = {
      selectedRowKeys: selectedRows.map(item =>
        _.findIndex(records, function(o) {
          return o.id === item.value;
        })
      ),
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRows.length) {
          let validSelectedRows = _.filter(selectedRows, item => {
            return (
              _.findIndex(
                this.state.selectedRows,
                i => i.value === item.value
              ) === -1
            );
          });
          this.setState(
            {
              selectedRows: [...this.state.selectedRows, ...validSelectedRows]
            },
            () => {
              if (handleChange && typeof handleChange === 'function') {
                handleChange(this.state.selectedRows);
              }
            }
          );
        } else {
          this.deleteSelectdRows(records);
        }
      },
      onSelect: (record, selected) => {
        if (!selected) {
          this.deleteSelectdRows(record);
        }
      },
      onSelectAll: selected => {
        if (!selected) {
          this.deleteSelectdRows(data);
        }
      }
    };

    return (
      <Modal
        title={this.props.title}
        visible={modalVisible}
        confirmLoading={this.props.confirmLoading}
        onCancel={this.handleCancel}
        width={900}
        footer={[
          <Button
            key="back"
            onClick={this.handleCancel}
            style={{ marginRight: '10px' }}>
            {t('取消')}
          </Button>,
          <Popconfirm
            key="secondOk"
            placement="topRight"
            title={t('是否更改角色绑定关系')}
            onConfirm={this.handleOk}
            okText="确认"
            cancelText="取消">
            <Button key="submit" type="primary">
              {t('绑定')}
            </Button>
          </Popconfirm>
        ]}>
        <div className="content-area">
          <Row gutter={24}>
            <Col span={7} className="search-fields">
              <FormItem label={t('角色分类')}>
                <Select
                  value={labelId}
                  showSearch
                  optionFilterProp="children"
                  onChange={this.handleLabelIdChange}
                  style={{ width: '100%' }}
                  allowClear>
                  {roleLabelList &&
                    roleLabelList.map(bus => (
                      <Option key={bus.id} value={bus.id}>
                        {bus.name}
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={7} className="search-fields">
              <FormItem label={t('角色名称')}>
                <Input
                  value={resourceName}
                  onChange={this.handleFormItemChange('resourceName')}
                />
              </FormItem>
            </Col>
            <Col span={7} className="search-fields">
              <FormItem label={t('角色ID')}>
                <Input
                  value={resourceKey}
                  onChange={this.handleFormItemChange('resourceKey')}
                />
              </FormItem>
            </Col>
            <Col span={8} className="search-fields">
              <FormItem label={t('是否已绑定')}>
                <Select
                  value={bind}
                  showSearch
                  optionFilterProp="children"
                  onChange={this.bindOnChange}
                  style={{ width: '100%' }}
                  allowClear>
                  {isBindingList.map(item => (
                    <Option key={item.name} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={3} className="search-button">
              <FormItem label="">
                <Button type="primary" onClick={() => this.handleFetch()}>
                  {t('搜索')}
                </Button>
              </FormItem>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={data}
            rowSelection={rowSelection}
            scroll={{ y: 300 }}
            pagination={{
              current: this.state.current || 1,
              pageSize: size,
              total: this.state.total || total,
              onChange: this.handlePageChange
            }}></Table>
          {/* <div className="selected-wrap" style={{ maxWidth: 800 }}>
            <label>{t('已选：')}</label>
            {selectedRows.map(item => (<Tag key={item.value} closable onClose={() => { this.deleteSelectdRows(item); }}>{item.label}</Tag>))}
          </div> */}
        </div>
      </Modal>
    );
  }
}

export default connect(
  ({ global, role, newApply, feature, defaultauth, flags, featureGroup }) => {
    return {
      appId: global.managingApp,
      roleLabelList: role.allRolelabelList,
      bindRoles: feature.bindRoles,
      roleAllList: feature.roleList,
      flagBindRoles: flags.flagBindRoles,
      featureBindRoles: feature.bindRoles,
      groupBindRoles: featureGroup.groupBindRoles
    };
  },
  dispatch => ({
    fetchRoleList(params) {
      dispatch({
        type: 'feature/fetchRoleList',
        payload: params
      });
    }
  })
)(Form.create()(RoleChoice));
