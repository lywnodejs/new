/**
 * 选择子系统的Select组件
 */

import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { translate } from 'react-i18next';
import './index.less'
import { BUSINESSMANAGE } from '@routes/config';
import _ from 'lodash'

const { Option, OptGroup } = Select;

class SystemList extends React.Component {

  state = {
    defaultValue: undefined
  }

  componentWillReceiveProps(nextProps){
    const { value, needDefaultValue, footprint, isGlobalAppId, needFootprint } = nextProps
    let defaultValue

    const apps = this.currentAppsList()

    if(value){//change事件进入value有值
      defaultValue = value
      if(isGlobalAppId) this.setGlobalAppId(value)
    }else if(needDefaultValue && apps && apps.length > 0 && needFootprint && footprint){
      defaultValue = needFootprint ? (footprint.length > 0 ? footprint[0].appId : apps[0].appId) : apps[0].appId
      if(isGlobalAppId) this.setGlobalAppId(defaultValue)
    }

    this.setState({defaultValue})
  }

  componentDidMount(){
    const { needFootprint, dispatch, footprint, value } = this.props

    this.setState({
      defaultValue: value
    })

    if(needFootprint && !footprint){
      //需要访问足迹必须等到userInfo请求到后获取userId
      const timer = setInterval(() => {
        const { userInfo } = this.props

        if(userInfo.id){
          clearInterval(timer)
          dispatch({
            type: 'global/getFootprint',
            payload: {
              userId: userInfo.id
            }
          })
        }
      }, 100)
    }
  }

  setGlobalAppId(globalAppId){
    const { dispatch } = this.props
    dispatch({
      type: 'global/setGlobalAppId',
      payload: {globalAppId}
    })
  }

  getGroupOptions = (apps, label, needFootprint, footprint) => {
    let [...cloneApps] = apps

    if(needFootprint && footprint && footprint.length > 0){
      footprint.map(item => {
        cloneApps.splice(cloneApps.findIndex(v => v.appId == item.id), 1)
      })
    }

    return (
      <OptGroup label={label}>
      {
        this.getOptions(cloneApps)
      }
      </OptGroup>
    )
  }

  getOptions = apps => {
    return (
      apps.map(item => {
        return (
          <Option key={item.appId} value={item.appId}>{item.appName}</Option>
        )
      })
    )
  }

  // 如果是header里面，/businessmanage取business的数据，其他路由都取apps
  // 非header都取apps的数据
  currentAppsList = () => {
    const { apps, businessSystemList, ifHeader, showAll } = this.props
    const all = {appId: -1, appName: '全部'}
    const appsClone = _.cloneDeep(apps)

    // 只有main页面的header需要加
    if (showAll && appsClone.length) {
      appsClone.unshift(all)
    }
    const reg = new RegExp(`${BUSINESSMANAGE}`)
    return (reg.test(location.pathname) && !!ifHeader) ? businessSystemList : appsClone
  }

  render() {
    const { showSystemList, onChange, t, style, footprint, needFootprint, allowClear, disabled } = this.props;

    const apps = this.currentAppsList()

    return (
      showSystemList?
      <Select
        disabled={disabled}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        placeholder={t('请选择系统')}
        onChange={onChange}
        className="system-list-wrapper"
        style={style}
        value={this.state.defaultValue}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        showSearch
        allowClear={ allowClear === undefined ? true : !!allowClear }
      >
        {
          footprint && needFootprint ? this.getGroupOptions(footprint, t('我的足迹')) : null
        }
        {
          needFootprint ? this.getGroupOptions(apps, t('推荐系统'), needFootprint, footprint) : this.getOptions(apps)
        }
      </Select>
      :''
    );
  }
}

SystemList.defaultProps = {
  disabled: false
};

export default translate()(connect(({ global, userInfo }) => {
  const { apps, footprint, businessSystemList, showSystemList } = global;

  return {
    apps,
    businessSystemList,
    userInfo,
    footprint,
    showSystemList
  };
})(SystemList));
