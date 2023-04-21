import React from 'react';
import Trigger from 'rc-trigger';
import request from '../../utils/request';
import {
  Card,
  Form, Row, Col,
  Button, Select,
  TreeSelect
} from 'antd';
import _ from 'lodash';
import { rcTriggerBuiltinPlacements } from '../config';
import InputTag from '../InputTag';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, (item) => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

class AreaSelector extends React.Component {

  state = {
    treeData: [],
    value: [],
    selected: [],
    selectedRowKeys: [],
    selectedRows: [],
    resourceName: '',
    resourceKey: '',
    businessId: '',
    allBusiness: [],
    hasAreas: []
  }


  componentWillMount(){
    request(`/v2/nopermission/appbindedbusiness?appId=${this.props.appId}`).then(res => {
      this.setState({
        allBusiness: res||[]
      });
    })
  }
  componentDidMount() {
    const { value } = this.props;
    this.setState({
      value
    });
  }

  //切换申请类型清空报表或者目标选择的数据
  componentWillReceiveProps(nextProps){
    if (nextProps.resourceTypeId === this.props.resourceTypeId) return;
    const { value } = nextProps
    this.setState({
      businessId: ''
    });
  }

  /**
   * 业务线变化时候的处理逻辑
   */
  handleBusinessChange = (businessId) => {
    Promise.all([
      request(`/area/select/tree?businessId=${businessId}&appId=${this.props.appId}`),
      request(`/v2/apply/getUserAreas?businessId=${businessId}&appId=${this.props.appId}`)
    ]).then(res => {
      this.setState({
        businessId,
        treeData: this.formatTree(res[0], res[1]),
        hasAreas: res[1]
      }, () => {
        this.props.onChange(this.state.selected);
      });
    })
  };

  /**
   * 选择地区值变化时候的处理逻辑
   */
  onChange = (value, label) => {
    let result = [];
    if (value && value.length) {
      for (let i = 0; i < value.length; i ++) {
        result.push({
          value: value[i],
          label: label[i],
          businessId: this.state.businessId
        })
      }
    }
    this.setState({
      value,
      selected: result
    }, () => {
      this.props.onChange(this.state.selected);
    });
  }

  /**
   * 地区选择输入框删除元素时的处理逻辑
   */
  onInputTagChange = (e, item) => {
    const { onChange, handleChange } = this.props;
    let { selected, value } = this.state;
    selected = _.filter(selected, (value) => value.value != item.value);
    value = _.filter(value, (i) => i != item.value);
    this.setState({
      value,
      selected
    }, () => {
      onChange(this.state.selected);
      if(handleChange && typeof handleChange === 'function'){
        handleChange(this.state.selectedRows)
      }
    });
  }

  /**
   * 格式化成树状结构
   */
  formatTree = (data, hasAreas) => {
    if (data && data.length) {
      for (let i = 0; i < data.length; i ++) {
        data[i].title = data[i].name;
        data[i].value = data[i].id+'';
        data[i].key = data[i].id;
        for(let j = 0; j < hasAreas.length; j ++) {
          if (hasAreas[j].id == data[i].id) {
            data[i].disableCheckbox = true;
            data[i].title += '(已有该地区权限)';
            break;
          }
        }
        if (data[i].children && data[i].children.length) {
          this.formatTree(data[i].children, hasAreas);
        }
      }
    }
    return data;
  }

  getMenus = () => {
    let { businessId, allBusiness } = this.state;
    const { t, needShowCloseBtn } = this.props;
    
    return (
      <Card className="content-area-s">
        <Row gutter={24}>
          <Col span={14} className="search-fields">
            <FormItem
              label={t('业务线名称')}
            >
              <Select
                value={businessId}
                showSearch
                optionFilterProp="children"
                onChange={this.handleBusinessChange}
                style={{width: '100%'}}
                allowClear
              >
                {allBusiness.map((bus) => (
                  <Option
                    key={bus.id}
                    value={bus.id}
                  >
                    {bus.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} className="search-fields">
            <FormItem
              label={t('选择地区')}
            >
              <TreeSelect
                filterTreeNode={(inputValue, TreeNode)=>TreeNode.props.title.indexOf(inputValue)!=-1}
                treeData={this.state.treeData}
                value={this.state.value}
                onChange={this.onChange}
                treeCheckable={true}
                showCheckedStrategy={SHOW_PARENT}
                style={{width: '100%'}}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              />
            </FormItem>
          </Col>
        </Row>
        {
          needShowCloseBtn && (
            <Col span={3} className="search-button close-button">
              <Button
                type="primary"
                onClick={this.closePopup}
                >
                {t('确定')}
              </Button>
            </Col>
          )
        }
      </Card>
    );
  }

  closePopup = (e) => {
    document.getElementsByClassName('rc-trigger-popup')[0].className += 'rc-trigger-popup-hidden'
    const mask = document.getElementsByClassName('rc-trigger-popup-mask')[0]
    if(mask){
      mask.className += 'rc-trigger-popup-mask-hidden'
    } 
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <Trigger
          action={['click']}
          popupPlacement="center"
          builtinPlacements={rcTriggerBuiltinPlacements}
          popup={this.getMenus()}
          mask={this.props.mask}
          maskClosable={false}
        >
          {
            <InputTag
              value={this.state.selected}
              onChange={this.onInputTagChange}
              tagClosable={true}
            />
          }
        </Trigger>
      </div>
    );
  }
}

export default AreaSelector;