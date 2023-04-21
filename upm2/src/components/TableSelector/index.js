import React from 'react';
import Trigger from 'rc-trigger';
import {
  Input, Table, Card,
  Form, Row, Col,
  Button
} from 'antd';
import _ from 'lodash';
import { rcTriggerBuiltinPlacements } from '../config';
import InputTag from '../InputTag';

import './index.less';

const FormItem = Form.Item;

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, (item) => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

class TableSelector extends React.Component {

  state = {
    selectedRowKeys: [],
    selectedRows: [],
    resourceName: '',
    resourceKey: ''
  }

  componentDidMount() {
    const { value } = this.props;
    // if (!_.isEmpty(value)) {
      this.setState({
        selectedRows: value,
        selectedRowKeys: []
      });
    // }
  }

  //切换申请类型清空报表或者目标选择的数据
  componentWillReceiveProps(nextProps){
    const { value,current } = nextProps
    this.setState({
      selectedRows: value,
      current
    });
  }

  handleFetch = (page) => {
    const { resourceName, resourceKey } = this.state;
    const { resourceTypeId, handleFetchResource, businessId, appId } = this.props;
    handleFetchResource({page, resourceName, resourceKey, resourceTypeId, businessId, appId});
    this.setState({
      current: page,
      selectedRowKeys: []
    })
  }

  handleFormItemChange = (name) => (e) => {
    e.preventDefault();
    this.setState({
      [name]: e.target.value,
    });
  }

  handlePageChange = (page) => {
    this.handleFetch(page);
    this.setState({
      selectedRowKeys: []
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { onChange, handleChange } = this.props;

    let targetKeys = [];
    let targetRows = [];
    if (selectedRowKeys.length > 1) {
      targetKeys.push(selectedRowKeys.pop());
      let index = selectedRows.findIndex(item => item.key == targetKeys[0])
      targetRows.push(selectedRows[index]);
      selectedRows.splice(index, 0)
    } else {
      targetKeys = selectedRowKeys;
      targetRows = selectedRows;
    }

    this.setState({
      selectedRowKeys: targetKeys,
      selectedRows: targetRows,
    }, () => {
      onChange(targetRows)
      if(handleChange && typeof handleChange === 'function'){
        handleChange(targetRows)
      }
      selectedRowKeys = []
      selectedRows = []
    });
  }

  onInputTagChange = (e, item) => {
    const { onChange } = this.props;
    let { selectedRowKeys, selectedRows } = this.state;
    selectedRowKeys = _.filter(selectedRowKeys, (key) => key != item.key);
    selectedRows = _.filter(selectedRows, (row) => row.key != item.key);
    this.setState({
      selectedRowKeys,
      selectedRows
    }, () => {
      onChange(selectedRows);
    });
  }

  getTableColumns = () => {
    // value为实际表单项数据，label提供inputTag展示。
    const { resourceTypeId, resourceTypeList, t } = this.props;

    switch(resourceTypeId) {
      case getIdByIdentifying(resourceTypeList, "bigdata_extraction_tool"):
        return [{
          title: t('模板ID'),
          dataIndex: 'resourceKey',
        }, {
          title: t('模板名称'),
          dataIndex: 'label',
        }, {
          title: t('业务线'),
          dataIndex: 'business',
        }, {
          title: t('创建人'),
          dataIndex: 'creator',
        }];
      case getIdByIdentifying(resourceTypeList, "tableau_workbook"):
        return [{
          title: t('工作簿ID'),
          dataIndex: 'resourceKey',
          width: 100,
        }, {
          title: t('工作簿名称'),
          dataIndex: 'label',
          width: 300,
        }, {
          title: t('工作簿项目'),
          dataIndex: 'workbookProject',
          width: 200,
        }, {
          title: t('站点'),
          dataIndex: 'site',
          width: 200,
        }];
      default:
        return [{
          title: t('报表ID'),
          dataIndex: 'resourceKey',
        }, {
          title: t('报表名称'),
          dataIndex: 'label',
        }, {
          title: t('业务线'),
          dataIndex: 'business',
        }, {
          title: t('创建人'),
          dataIndex: 'creator',
        }];
    }
  }

  getTableData = (records) => {
    const dataList = [];
    _.each(records, (record, index) => {
      const data = {};
      data.key = index;
      data.value = record.id;
      data.label = record.resourceName;
      data.resourceKey = record.resourceKey;
      _.each(record.properties, (property) => {
        const { attrName, attrValue } = property;
        data[attrName] = attrValue;
      });
      dataList.push(data);
    });
    return dataList;
  }

  getLabel = (param) => {
    const { resourceTypeId, resourceTypeList } = this.props;
    if (param == 'name') {
      let name = '报表名称';
      if (resourceTypeId == getIdByIdentifying(resourceTypeList, "bigdata_extraction_tool")) {
        name = '模板名称';
      } else if (resourceTypeId == getIdByIdentifying(resourceTypeList, "tableau_workbook")) {
        name = '工作簿名称';
      }
     
      return name;
    }
    else if (param == 'id') {
      let id = '报表ID';
      if (resourceTypeId == getIdByIdentifying(resourceTypeList, "bigdata_extraction_tool")) {
        id = '模板ID';
      } else if (resourceTypeId == getIdByIdentifying(resourceTypeList, "tableau_workbook")) {
        id = '工作簿ID';
      }
      
      return id;
    }
  }

  getMenus = () => {
    const { t, resourceList, resourceTypeId, selectType = 'checkbox', needShowCloseBtn, resourceTypeList, value } = this.props;
    let { selectedRowKeys, resourceName, resourceKey } = this.state;
    if(value.length === 0){
      selectedRowKeys = []
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: selectType,
    };
    const { size, total } = resourceList;
    const data = resourceTypeId ? this.getTableData(resourceList.records) : [];
    const columns = this.getTableColumns();

    return (
      <Card className="content-area">
        <Row gutter={24}>
          <Col span={10} className="search-fields">
            <FormItem
              label={t(this.getLabel('name'))}
            >
              <Input
                value={resourceName}
                onChange={this.handleFormItemChange('resourceName')}
              />
            </FormItem>
          </Col>
          <Col span={10} className="search-fields">
            <FormItem
              label={t(this.getLabel('id'))}
            >
              <Input
                value={resourceKey}
                onChange={this.handleFormItemChange('resourceKey')}
                placeholder={t(resourceTypeId == getIdByIdentifying(resourceTypeList, "bigdata_extraction_tool") ? '模板ID' : '报表ID')}
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
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          scroll={{y: 300}}
          pagination={{
            current: this.state.current || 1,
            pageSize: size,
            hideOnSinglePage: true,
            total,
            onChange: this.handlePageChange
          }}
        >
        </Table>
        {// July 28, 2018 wujianjian add
          needShowCloseBtn && (
            <Col span={3} className="search-button close-button">
              <Button
                type="primary"
                onClick={this.closePopup}
                >
                {t('关闭')}
              </Button>
            </Col>
          )
        }
      </Card>
    );
  }

  closePopup = (e) => {//rc-trigger没有提供主动关闭窗体的api 
    document.getElementsByClassName('rc-trigger-popup')[0].className += 'rc-trigger-popup-hidden'
    const mask = document.getElementsByClassName('rc-trigger-popup-mask')[0]
    if(mask){
      mask.className += 'rc-trigger-popup-mask-hidden'
    }
    // 初始化搜索条件和列表
    this.setState({
      businessId: '',
      resourceName: '',
      resourceKey: ''
    }, () => {
      this.handleFetch();
    });
  }

  render() {
    const { selectedRows } = this.state;
    return (
      <div>
        <Trigger
          action={['click']}
          popupPlacement="center"
          builtinPlacements={rcTriggerBuiltinPlacements}
          popup={this.getMenus()}
          mask={this.props.mask}
        >
          {
            <InputTag
              value={selectedRows}
              onChange={this.onInputTagChange}
              tagClosable={true}
            />
          }
        </Trigger>
      </div>
    );
  }
}

export default TableSelector;
