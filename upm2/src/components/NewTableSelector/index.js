/**
 * 申请新权限：角色，标识位选择
 */
import React from 'react';
// import Trigger from 'rc-trigger';
import {
  Input,
  Table,
  Form,
  Row,
  Col,
  Button,
  Select,
  Tag,
  Checkbox,
  Modal
} from 'antd';
import _ from 'lodash';
// import { rcTriggerBuiltinPlacements } from '../config';
import InputTag from '../InputTag';
import './index.less';
import { echoMessage } from '@utils/notice';
import request from '@utils/request';
import DataRescourceSearchForm from '../../components/DataSearchForm/searchForm';

const FormItem = Form.Item;
const Option = Select.Option;

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, item => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

// 等级隐射
const levelMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

const useRiskLevelResourceTypeIds = ['role', 'data', 'flag'];

class TableSelector extends React.Component {
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
    projectName: '', // 项目
    modalVisible: false,
    oldData: null,
    searchForm: {
      // 查询表单
      page: 0,
      size: 10
    },
    dataType: [], // 数据类型
    businessList: [] //业务线列表
  };

  componentDidMount() {
    const { value, dataType, businessList } = this.props;
    // if (!_.isEmpty(value)) {
    this.setState({
      // selectedRows: value||[],
      inputSelectedRows: value || [],
      selectedRowKeys: [],
      dataType,
      businessList,
      businessId: '',
      resourceKey: '',
      resourceName: '',
      projectName: ''
    });
    // }
  }

  //切换申请类型清空报表或者目标选择的数据
  componentWillReceiveProps(nextProps) {
    const { value, dataType, businessList } = nextProps;
    // console.log(value)
    this.setState({
      // selectedRows: value || [],
      inputSelectedRows: value || [],
      dataType,
      businessList
    });
    if (nextProps.resourceTypeId === this.props.resourceTypeId) return;
    this.setState({
      businessId: '',
      resourceKey: '',
      resourceName: '',
      projectName: ''
    });
  }

  handleFetch = page => {
    const {
      businessId,
      resourceName,
      resourceKey,
      dataApp,
      labelId,
      site,
      projectName,
      searchForm
    } = this.state;
    const {
      resourceTypeId,
      handleFetchResource,
      appId,
      resourceTypeList
    } = this.props;
    const params = {
      page,
      resourceName,
      resourceKey,
      resourceTypeId,
      businessId,
      appId,
      id: resourceKey,
      nameZh: resourceName,
      permissionId: resourceKey + '',
      permissionName: resourceName + '',
      projectName
    };
    if (resourceTypeId == 'bigdata_indicator') {
      params.dataApp = dataApp ? 1 : 0;
    }
    if (this.isFunctionRole()) {
      params.labelId = labelId;
    }
    if (resourceTypeId == 'tableau_workbook') {
      params.site = site;
    }
    if (resourceTypeId == 'data') {
      params.fuzzySearch = searchForm.fuzzySearch;
      params.businessIdList = searchForm.businessIdList;
      params.resourceTypeIdList = searchForm.resourceTypeIdList;
      params.riskLevelList = searchForm.riskLevelList;
      params.page = page || 1;
    }
    this.setState({
      current: page,
      selectedRowKeys: []
    });
    return handleFetchResource(params);
  };

  handleFormItemChange = name => e => {
    e.preventDefault();
    this.setState({
      [name]: e.target.value
    });
  };

  handleBusinessChange = businessId => {
    this.setState(
      {
        businessId
      },
      () => {
        this.handleFetch();
      }
    );
  };

  handleProjectChange = projectName => {
    this.setState(
      {
        projectName
      },
      () => {
        this.handleFetch();
      }
    );
  };

  handleFetchProject = projectName => {
    this.props.handleFetchProjectList(projectName);
  };

  handleSiteChange = site => {
    this.setState(
      {
        site
      },
      () => {
        this.handleFetch();
      }
    );
  };

  handleLabelIdChange = labelId => {
    this.setState(
      {
        labelId
      },
      () => {
        this.handleFetch();
      }
    );
  };

  handlePageChange = page => {
    this.handleFetch(page);
  };

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

  onInputTagChange = (e, item) => {
    const { onChange, handleChange } = this.props;
    let { selectedRowKeys, inputSelectedRows } = this.state;
    selectedRowKeys = _.filter(selectedRowKeys, key => key != item.key);
    inputSelectedRows = _.filter(inputSelectedRows, row => row.key != item.key);
    this.setState(
      {
        selectedRowKeys,
        inputSelectedRows
      },
      () => {
        onChange(this.state.inputSelectedRows);
        if (handleChange && typeof handleChange === 'function') {
          handleChange(this.state.inputSelectedRows);
        }
      }
    );
  };

  getTableColumns = () => {
    // value为实际表单项数据，label提供inputTag展示。
    const { resourceTypeId, isPackage, t } = this.props;

    if (this.isFunctionRole() && isPackage) {
      return [
        {
          title: t('角色分类'),
          dataIndex: 'labels',
          width: 120,
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
          width: 100
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
          title: t('敏感级'),
          dataIndex: 'riskLevel',
          width: 100
        }
      ];
    }
    switch (resourceTypeId) {
      case 'role':
        return [
          {
            title: t('角色分类'),
            dataIndex: 'labels',
            width: 120,
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
            width: 100
          },
          {
            title: t('角色名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('角色描述'),
            dataIndex: 'description',
            width: 400
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          },
          {
            title: t('敏感级'),
            dataIndex: 'riskLevel',
            width: 100
          }
        ];
      case 'data':
        return [
          {
            title: t('数据资源ID'),
            dataIndex: 'resourceKey',
            width: 200
          },
          {
            title: t('数据资源名称'),
            dataIndex: 'resourceName',
            width: 300
          },
          {
            title: t('数据类型'),
            dataIndex: 'resourceTypeName',
            width: 200
          },
          {
            title: t('数据敏感级'),
            dataIndex: 'riskLevel',
            width: 100
          },
          {
            title: t('业务线'),
            dataIndex: 'businessName',
            width: 200
          }
        ];
      case 'flag':
        return [
          {
            title: t('标识位ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('标识位名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          },
          {
            title: t('敏感级'),
            dataIndex: 'riskLevel',
            width: 100
          }
        ];
      case 'bigdata_extraction_tool':
        return [
          {
            title: t('模板ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('模板名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          },
          {
            title: t('敏感级'),
            dataIndex: 'level',
            width: 100
          }
        ];
      case 'bigdata_report':
        return [
          {
            title: t('报表ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('报表名称'),
            dataIndex: 'label',
            width: 300
            // }, {
            //   title: t('业务线'),
            //   dataIndex: 'business',
            //   width: 200,
          },
          {
            title: t('项目名称'),
            dataIndex: 'projectName',
            width: 200
          },
          {
            title: t('敏感级'),
            dataIndex: 'level',
            width: 100
          }
        ];
      case 'bigdata_indicator':
        return [
          {
            title: t('指标ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('指标名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          }
        ];
      case 'wide_table': // 服务化宽表
        return [
          {
            title: t('宽表ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('宽表名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('宽表说明'),
            dataIndex: 'ext'
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          }
        ];
      case 'tableau_workbook':
        return [
          {
            title: t('工作簿ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('工作簿名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('工作簿项目'),
            dataIndex: 'workbookProject',
            width: 200
          },
          {
            title: t('站点'),
            dataIndex: 'site',
            width: 200
          }
        ];
      case 'bigdata_data_set':
        return [
          {
            title: t('数据集ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('数据集名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('项目名称'),
            dataIndex: 'projectName',
            width: 200
          },
          {
            title: t('敏感级'),
            dataIndex: 'level',
            width: 100
          }
        ];
      default:
        return [
          {
            title: t('报表ID'),
            dataIndex: 'resourceKey',
            width: 100
          },
          {
            title: t('报表名称'),
            dataIndex: 'label',
            width: 300
          },
          {
            title: t('业务线'),
            dataIndex: 'business',
            width: 200
          }
        ];
    }
  };

  getTableData = records => {
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
      data.riskLevel = levelMapping[record.riskLevel] || '';

      data.level = level.length > 0 ? levelMapping[level[0].attrValue] : '';
      _.each(record.properties, property => {
        const { attrName, attrValue } = property;
        data[attrName] = record.hasOwnProperty(attrName)
          ? record[attrName]
          : attrValue;
      });
      data.business = data.business || record.businessName;
      data.resourceTypeName = data.resourceTypeName || record.resourceTypeName;
      data.resourceName = data.resourceName || record.resourceName;
      // 项目名称
      if (record.properties && record.properties.length > 0) {
        record.properties.forEach(item => {
          if (item.attrName == 'projectName') {
            // 项目名称
            data.projectName = item.attrValue;
          }

          if (item.attrName == 'applyAreaBusinessLines') {
            data.applyAreaBusinessLines = item.attrValue;
          }
        });
      } else {
        data.projectName = '';
        data.applyAreaBusinessLines = '';
      }
      dataList.push(data);
    });
    return dataList;
  };

  getLabel = param => {
    const { resourceTypeId, resourceTypeList } = this.props;
    if (param == 'business') {
      let name = '业务线名称';
      if (resourceTypeId == 'bigdata_extraction_tool') {
        name = '业务线名称';
      }

      return name;
    }
    if (param == 'name') {
      switch (resourceTypeId) {
        case 'bigdata_extraction_tool':
          return '模板名称';
        case 'bigdata_indicator':
          return '指标名称';
        case 'wide_table': // 服务化宽表
          return '宽表名称';
        case 'flag':
          return '标识位名称';
        case 'role':
          return '角色名称';
        case 'tableau_workbook':
          return '工作簿名称';
        case 'bigdata_data_set':
          return '数据集名称';
        default:
          return '报表名称';
      }
    } else if (param == 'id') {
      switch (resourceTypeId) {
        case 'bigdata_extraction_tool':
          return '模板ID';
        case 'bigdata_indicator':
          return '指标ID';
        case 'wide_table': // 服务化宽表
          return '宽表ID';
        case 'flag':
          return '标识位ID';
        case 'role':
          return '角色ID';
        case 'tableau_workbook':
          return '工作簿ID';
        case 'bigdata_data_set':
          return '数据集ID';
        default:
          return '报表ID';
      }
    }
  };

  /**
   * 检查数组中是否是都是同一业务线，false为失败
   */
  checkSameBusiness = arr => {
    if (arr.lenth < 1) return true;
    for (let i = 1, len = arr.length; i < len; i++) {
      if (arr[0].businessId != arr[i].businessId) {
        return false;
      }
    }
    return true;
  };

  isFunctionRole = () => {
    const { resourceTypeId, roleType } = this.props;

    // 是角色并且是功能角色
    return resourceTypeId == 'role' && roleType == 0;
  };

  getFirstSearch = () => {
    let { businessId, labelId, site, projectName } = this.state;
    const {
      t,
      allBusiness,
      roleLabelList,
      resourceTypeId,
      siteList,
      projectList
    } = this.props;
    if (this.isFunctionRole()) {
      // 如果是数易报表的功能角色，则显示角色分类
      return (
        <FormItem label={t('角色分类')}>
          <Select
            value={labelId}
            showSearch
            optionFilterProp="children"
            onChange={this.handleLabelIdChange}
            style={{ width: '100%' }}
            allowClear>
            {roleLabelList.map(bus => (
              <Option key={bus.id} value={bus.id}>
                {bus.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      );
    } else if (resourceTypeId == 'tableau_workbook') {
      // 如果是tableau工作簿，则显示站点搜索
      return (
        <FormItem label={t('站点名称')}>
          <Select
            value={site}
            showSearch
            optionFilterProp="children"
            onChange={this.handleSiteChange}
            style={{ width: '100%' }}
            allowClear>
            {siteList.map(bus => (
              <Option key={bus.name} value={bus.name}>
                {bus.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      );
    } else if (
      resourceTypeId == 'bigdata_report' ||
      resourceTypeId == 'bigdata_data_set'
    ) {
      // 数易-报表 -- 数易-数据集
      return (
        <FormItem label={t('项目名称')}>
          <Select
            showSearch
            value={projectName}
            filterOption={false}
            optionFilterProp="children"
            onChange={this.handleProjectChange}
            onSearch={this.handleFetchProject}
            style={{ width: '100%' }}
            allowClear>
            {projectList.map(pro => (
              <Option key={pro.name} value={pro.name}>
                {pro.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      );
    } else {
      return (
        <FormItem label={t(this.getLabel('business'))}>
          <Select
            value={businessId}
            showSearch
            optionFilterProp="children"
            onChange={this.handleBusinessChange}
            style={{ width: '100%' }}
            allowClear>
            {allBusiness.map(bus => (
              <Option key={bus.id} value={bus.id}>
                {bus.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      );
    }
  };

  // 如果组件传了 allSelectHandle，则显示一键全选按钮，会将取回的结果渲染到已选择列表
  allSelectHandle = () => {
    const { resourceTypeId } = this.props;
    let { resourceName, resourceKey } = this.state;
    let requestUrl = null;

    switch (resourceTypeId) {
      case 'role':
        requestUrl = '/v2/nopermission/role/list/all';
        break;
      case 'flag':
        requestUrl = '/v2/nopermission/flag/list/all';
        break;
    }
    if (requestUrl) {
      request(
        `${requestUrl}?appId=${this.props.appId}&nameZh=${resourceName}&id=${resourceKey}`
      ).then(res => {
        this.setState({
          selectedRows: this.getTableData(res)
        });
      });
    }
  };

  // 每次点击进入列表需要先清空查询条件，再请求列表数据
  handleSelectChange = () => {
    this.handleReset();
    this.handleFetch();
  };

  getMenus = () => {
    let {
      selectedRows,
      businessId,
      resourceName,
      resourceKey,
      dataApp,
      labelId
    } = this.state;
    const {
      t,
      resourceList,
      resourceTypeId,
      needShowCloseBtn,
      resourceTypeList,
      allBusiness,
      onChange,
      handleChange,
      roleLabelList,
      noFirstSearch,
      isPackage,
      allSelect
    } = this.props;
    const { records, size, total } = resourceList;
    const data = resourceTypeId ? this.getTableData(records) : [];
    const columns = this.getTableColumns();
    const rowSelection = {
      // selectedRowKeys: selectedRows && selectedRows.map(item =>
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

          if (
            !isPackage &&
            !this.checkSameBusiness(
              this.state.selectedRows.concat(validSelectedRows)
            ) &&
            resourceTypeId != 'bigdata_report' &&
            resourceTypeId != 'bigdata_data_set'
          ) {
            if (
              resourceTypeId ==
              getIdByIdentifying(resourceTypeList, 'tableau_workbook')
            ) {
              return echoMessage(t('只能选择同一站点的资源'), 'error');
            }
            return echoMessage(t('只能选择同一业务线的资源'), 'error');
          }
          this.setState(
            {
              selectedRows: [...this.state.selectedRows, ...validSelectedRows]
            },
            () => {
              // onChange(this.state.selectedRows);
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
      <div className="content-area">
        {this.props.resourceTypeId == 'data' ? (
          <Row gutter={24}>
            <DataRescourceSearchForm
              form={this.state.searchForm}
              data={this.state}
              leaveChange={this.leaveChange}
              dataTypeChange={this.dataTypeChange}
              businessChange={this.businessChange}
              searchChange={this.searchChange}
              search={() => this.handleFetch()}
              handleReset={this.handleReset}
              t={t}
              ref="child"
            />
          </Row>
        ) : (
          <Row gutter={24}>
            {noFirstSearch ? null : (
              <Col span={7} className="search-fields">
                {this.getFirstSearch()}
              </Col>
            )}
            <Col span={7} className="search-fields">
              <FormItem label={t(this.getLabel('name'))}>
                <Input
                  value={resourceName}
                  onChange={this.handleFormItemChange('resourceName')}
                />
              </FormItem>
            </Col>
            <Col span={7} className="search-fields">
              <FormItem label={t(this.getLabel('id'))}>
                <Input
                  value={resourceKey}
                  onChange={this.handleFormItemChange('resourceKey')}
                />
              </FormItem>
            </Col>
            <Col span={3} className="search-button">
              <FormItem label="">
                <Button type="primary" onClick={() => this.handleFetch()}>
                  {t('搜索')}
                </Button>
              </FormItem>
            </Col>
            {allSelect ? (
              <Col span={3} className="search-button">
                <FormItem label="">
                  <Button type="primary" onClick={() => this.allSelectHandle()}>
                    {t('一键全选')}
                  </Button>
                </FormItem>
              </Col>
            ) : null}

            {resourceTypeId == 'bigdata_indicator' ? (
              <Col span={24} className="search-button">
                <Checkbox
                  value={dataApp}
                  onChange={e => {
                    this.setState({ dataApp: e.target.checked }, () => {
                      this.handleSelectChange();
                    });
                  }}>
                  {t('指标超市')}
                </Checkbox>
              </Col>
            ) : (
              ''
            )}
          </Row>
        )}

        <Table
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          scroll={{ y: 300 }}
          pagination={{
            current: this.state.current || 1,
            pageSize: size,
            // hideOnSinglePage: true,
            total,
            onChange: this.handlePageChange
          }}></Table>
        <div className="selected-wrap">
          <label className="title">{t('已选：')}</label>
          <div>
            {selectedRows.map(item => (
              <Tag
                key={item.value}
                closable
                onClose={() => {
                  this.deleteSelectdRows(item);
                }}>{`${item.label}（${this.getRiskLevel(
                resourceTypeId,
                item
              )})`}</Tag>
            ))}
          </div>
        </div>
      </div>
    );
  };
  getRiskLevel = (resourceTypeId, item) => {
    if (useRiskLevelResourceTypeIds.includes(resourceTypeId)) {
      return item.riskLevel || '-';
    } else {
      const list = ['C1', 'C2', 'C3', 'C4'];
      if (list.findIndex(str => str === item.level) > 0) {
        return item.level || '-';
      }
      return levelMapping[item.level] || '-';
    }
  };

  onClose = isCancel => {
    // 初始化搜索条件和列表
    this.setState(
      {
        businessId: '',
        resourceName: '',
        resourceKey: '',
        modalVisible: false,
        projectName: '',
        searchForm: {
          page: 1,
          size: 10
        },
        inputSelectedRows:
          isCancel === true ? this.state.oldData : this.state.selectedRows
      },
      () => {
        if (isCancel !== true) {
          typeof this.props.onChange === 'function' &&
            this.props.onChange(this.state.inputSelectedRows);
        }
      }
    );
  };

  onOpen = () => {
    const { inputSelectedRows } = this.state;
    // const { value, resourceList } = this.props;
    // const { records } = resourceList;
    this.handleFetch().then(() => {
      // const selecteds = records && records.filter(item => value && value.findIndex(val => val.value === item.id))
      // const list = this.getTableData(selecteds)
      this.setState({
        modalVisible: true,
        oldData: inputSelectedRows,
        selectedRows: inputSelectedRows
        // selectedRows: list
      });
    });
  };

  // 选择敏感级
  leaveChange = level => {
    let form = this.state.searchForm,
      realLevel = [];
    if (level.length > 1) {
      for (let index in level) {
        if (level[index] > 0) {
          realLevel.push(level[index]);
        }
      }
      if (level[level.length - 1] === '') {
        realLevel = [''];
      }
    } else {
      realLevel = level;
    }
    form.riskLevelList = realLevel;
    this.setState({
      searchForm: form
    });
  };

  // 选择数据类型
  dataTypeChange = type => {
    let form = this.state.searchForm,
      realType = [];
    if (type.length > 1) {
      for (let index in type) {
        if (type[index] > 0) {
          realType.push(type[index]);
        }
      }
      if (type[type.length - 1] === '') {
        realType = [''];
      }
    } else {
      realType = type;
    }
    form.resourceTypeIdList = realType;
    this.setState({
      searchForm: form
    });
  };

  // 选择业务线
  businessChange = value => {
    let form = this.state.searchForm;
    form.businessIdList = value;
    this.setState({
      searchForm: form
    });
  };

  // 搜索框
  searchChange = e => {
    let form = this.state.searchForm;
    form.fuzzySearch = e.target.value;
    this.setState({
      searchForm: form
    });
  };

  // 清空form
  handleReset = () => {
    this.refs.child.resetFields();
    let form = this.state.searchForm;
    form.riskLevelList = '';
    form.resourceTypeIdList = '';
    form.businessIdList = '';
    form.fuzzySearch = '';
    this.setState({
      searchForm: form
    });
  };

  render() {
    const { inputSelectedRows, modalVisible } = this.state;
    const { title, t, disabled, resourceTypeId } = this.props;

    if (disabled) {
      return (
        <Select
          value={inputSelectedRows.map(item => item.value)}
          mode="multiple"
          disabled={true}>
          {inputSelectedRows.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      );
    }
    return (
      <div>
        <InputTag
          resourceTypeId={resourceTypeId}
          value={inputSelectedRows}
          onChange={this.onInputTagChange}
          tagClosable={true}
          onClick={this.onOpen}
          disableInput={disabled}
          placeholder="点击这里进行选择"
        />
        <Modal
          title={title}
          visible={modalVisible}
          wrapClassName="new-table-selector-modal"
          onCancel={() => {
            this.onClose(true);
          }}
          onOk={this.onClose}
          width={900}>
          {this.getMenus()}
        </Modal>
      </div>
    );
  }
}

export default TableSelector;
