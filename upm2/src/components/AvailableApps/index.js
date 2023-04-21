import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
// import SuperSelect from '@components/SuperSelect';
import _ from 'lodash';

import './index.less';
const { Option } = Select;

class AvailableApps extends React.Component {
  onChange = value => {
    const { dispatch, changeCallBack, hideClosed } = this.props;

    dispatch({
      type: hideClosed
        ? 'global/selectAvailableAppToManage'
        : 'global/selectAppToManage',
      payload: {
        appId: value
      }
    }).then(() => {
      if (_.isFunction(changeCallBack)) {
        changeCallBack();
      }
    });
  };

  render() {
    const {
      managingApp,
      managingAvailableApp,
      style,
      changeCallBack,
      disabled,
      wolkFlowIsOld,
      wolkFlowIsNew,
      hideClosed
    } = this.props;
    let { availableApps } = this.props;
    if (wolkFlowIsOld) {
      availableApps = availableApps.filter(item => item.isOld);
    } else if (wolkFlowIsNew) {
      availableApps = availableApps.filter(item => !item.isOld);
    }
    if (hideClosed) {
      availableApps = availableApps.filter(item => item.status);
    }
    return (
      <Select
        style={style}
        className="AvailableAppsSelector"
        showSearch
        placeholder=""
        value={hideClosed ? managingAvailableApp : managingApp}
        optionFilterProp="children"
        onChange={this.onChange}
        disabled={disabled}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }>
        {availableApps.map(app => {
          return (
            <Option value={app.id} key={app.id}>
              {app.name}
            </Option>
          );
        })}
      </Select>
    );
  }
}

export default connect(({ global }) => {
  const { availableApps, managingApp, managingAvailableApp } = global;
  return {
    availableApps,
    managingApp,
    managingAvailableApp
  };
})(AvailableApps);
