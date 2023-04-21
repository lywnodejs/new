/**
 * 用户编辑 角色对应的策略
 * 常用在 用户申请的过程中，选择要申请的角色
 */

import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import PackageStrategyPanel from '../PackageStrategyPanel';

import './index.less';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  Card,
  Checkbox,
  TreeSelect,
  message,
  Popover,
  Icon
} from 'antd';
import EditStrategy from '../EditStrategy';

class PackageStrategySetter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      params: {},
      strategy: {}
    };
  }

  handleOk = () => {
    const { dispatch, match, packageParams, appId } = this.props;
    // const { params, id, value } = this.state;
    // const { roleId } = params;
    // const { appsData } = packageParams;
    // const strategy = packageParams.appsData[appId].strategy;
    // const oldValue = strategy[roleId];
    // setFieldsValue
    this.setState(
      {
        visible: false
      },
      () => {
        this.props.closeModalBack(appId);
      }
    );
  };
  handleCancel = () => {
    const { dispatch, match, packageParams, appId } = this.props;
    const { params, id, value, strategy } = this.state;
    const { roleId } = params;
    const { appsData } = packageParams;
    this.setState(
      {
        visible: false
      },
      () => {
        // dispatch({
        //   type: 'managePackage/mergePackage',
        //   payload: {
        //     appsData: {
        //       ...appsData,
        //       [appId]: {
        //         ...appsData[appId],
        //         strategy: {
        //           ...strategy
        //         }
        //       }
        //     }
        //   }
        // });
        this.props.closeModalBack(appId);
      }
    );
  };
  openModal = params => {
    this.setState((state, props) => {
      return {
        visible: true,
        params,
        strategy: props.strategy
      };
    });
  };
  render() {
    /**
     * value 格式为：
     * {
        roleId1: {
          tagId1: {
            dimeId1: [value1-1, value1-2],
            dimeId2: [value2-1]
          },
          tagId2: {
            dimeId1: [value1-2],
            dimeId3: [value3-1],
          }
          ...
        },
        roleId2: {...},
        ...
     * }
     */
    const {
      strategyList,
      dimensionIdMap,
      value,
      t,
      appId,
      roleIdToNameMap
    } = this.props;
    return (
      <div className="strategy-setter">
        {_.map(strategyList, ({ roleId, strategyDto, tagDimeList }, index) => (
          <PackageStrategyPanel
            data={{
              roleId,
              strategyDto,
              tagDimeList
            }}
            dimesionValue={value[roleId] || {}}
            dimensionIdMap={dimensionIdMap}
            key={`${roleId}-${index}`}
            t={t}
            roleIdToNameMap={roleIdToNameMap}
            openModal={this.openModal}
          />
        ))}
        <Modal
          title={t('角色策略配置')}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          width={650}
          footer={[
            // <Button key="back" onClick={this.handleCancel}>
            //   {t('取消')}
            // </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.props.loading}
              onClick={this.handleOk}>
              {t('保存')}
            </Button>
          ]}>
          <EditStrategy params={this.state.params} appId={appId} />
        </Modal>
      </div>
    );
  }
}

export default connect(({ managePackage }) => {
  return {
    packageParams: managePackage.package
  };
})(PackageStrategySetter);
