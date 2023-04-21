/**
 * 用户选择 角色 的组件
 * 常用在 用户申请的过程中，选择要申请的角色
 */

import React from 'react';
import _ from 'lodash';

import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import { Input, Checkbox, Select, Row, Col } from 'antd';

import { rcTriggerBuiltinPlacements } from '../config';
import InputTag from '../InputTag';
import './index.less';
import { BIG_DATA_APP_ID } from '../../config/bigData';

class RoleSelector extends React.Component {
  onCheckboxChange = (e, type, option) => {
    const { value, onChange, appId } = this.props;
    const { checked } = e.target;
    const id = option.value;
    if (value && value.hasOwnProperty(undefined)) {
      delete value.undefined;
    }
    option.isGroup = type === 'roleGroup';

    const newValue = _.pickBy(
      {
        ...value,
        [id]: checked ? option : false
      },
      checked => !!checked
    );

    onChange(newValue);
    // console.log(newValue)
  };

  onInputTagChange = (e, option) => {
    const { value, onChange } = this.props;
    const id = option.value;
    const newValue = _.omit(value, id);
    onChange(newValue);
  };

  getRoleRows(options, value) {
    const { appId } = this.props;
    if (!options.role) return;

    if (BIG_DATA_APP_ID[appId]) {
      //大数据要分类显示角色
      const roles = {};

      options.role.map(item => {
        if (item.labelName != null) {
          roles[item.labelName] = roles[item.labelName] || [];
          roles[item.labelName].push(item);
        }
      });

      return Object.keys(roles).map(key => {
        const role = roles[key];
        return (
          <Row key={key}>
            <p className="role-group-name">{key}</p>
            {_.map(role, option => (
              <Col key={option.value} span={6}>
                <Checkbox
                  checked={!!value[option.value]}
                  onChange={e => this.onCheckboxChange(e, 'role', option)}>
                  {option.label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        );
      });
    } else {
      return (
        <Row>
          {_.map(options.role, option => (
            <Col key={option.value} span={6}>
              <Checkbox
                checked={!!value[option.value]}
                onChange={e => this.onCheckboxChange(e, 'role', option)}>
                {option.label}
              </Checkbox>
            </Col>
          ))}
        </Row>
      );
    }
  }

  getMenus() {
    const { options, value = {}, appId } = this.props;

    return (
      <div className="role-selector-menu">
        {!BIG_DATA_APP_ID[appId] ? (
          <div className="role-group-select-area">
            <div className="select-area-title">角色组快捷选择</div>
            <div className="checkbox-block">
              <Row>
                {_.map(options.roleGroup, option => (
                  <Col key={option.value} span={6}>
                    <Checkbox
                      checked={!!value[option.value]}
                      onChange={e =>
                        this.onCheckboxChange(e, 'roleGroup', option)
                      }>
                      {option.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="role-select-area">
          <div className="select-area-title">全部可选角色</div>
          <div className="checkbox-block">
            {this.getRoleRows(options, value)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { disabled, placeholder, disabledPlaceholder } = this.props;
    let { value } = this.props;

    if (value && value.hasOwnProperty(undefined)) {
      delete value.undefined;
    }

    return (
      <div className="role-selector">
        <Trigger
          action={['click']}
          popupPlacement="bottomLeft"
          builtinPlacements={rcTriggerBuiltinPlacements}
          popup={this.getMenus()}>
          {disabled ? (
            <Input disabled={disabled} placeholder={disabledPlaceholder} />
          ) : (
            <InputTag
              value={value}
              onChange={this.onInputTagChange}
              tagClosable={true}
              placeholder={placeholder}
            />
          )}
        </Trigger>
      </div>
    );
  }
}

export default RoleSelector;
