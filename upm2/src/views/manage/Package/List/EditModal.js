import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import PackageStrategySetter from '@components/PackageStrategySetter';
import TableSelector from '@components/NewTableSelector';
// import AreaSelector from '@components/AreaSelector';
// import InputTreeTag from '@components/InputTreeTag';
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

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const required = { required: true, message: '必填' };
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const resourceTypeList = [
  { id: 10086, appId: 12, name: '角色', identifying: 'role' },
  { id: 10087, appId: 12, name: '地区', identifying: 'area' },
  { id: 10088, appId: 12, name: '标识位', identifying: 'flag' }
];
/**
 * 编辑页面
 * @param {*} props
 */
class PackageEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // strategy: {},
    };
  }

  /**
   * 选择的系统变化时
   */
  changeSystems = systems => {
    const { dispatch, packageParams } = this.props;
    const { appsData, resourceTypeObj } = packageParams;
    setTimeout(() => {
      // 获取已选系统的权限类型列表
      systems.map(item => {
        const index = Object.keys(resourceTypeObj).findIndex(
          i => i == item.key
        );
        if (index == -1) {
          dispatch({
            type: 'managePackage/fetchResourceType',
            payload: { appId: item.key }
          });
        }
      });
    }, 0);
    dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        appsData: systems.reduce((total, item) => {
          if (appsData[item.key]) {
            total[item.key] = appsData[item.key];
          } else {
            dispatch({
              type: 'managePackage/getAppBindedBusiness',
              payload: { appId: item.key }
            });
            total[item.key] = {
              role: [],
              area: [],
              flag: [],
              resource: []
            };
            Object.keys(resourceTypeObj).map(i => {
              total[item.key][i] = [];
            });
          }
          return total;
        }, {})
      }
    });
  };

  /**
   * 格式化提交数据
   */
  formatParams = () => {
    const { packageParams, oper, id, t } = this.props;
    const {
      country,
      appsData,
      name,
      desc,
      packageCategoryId,
      apps,
      appsTypes,
      businessId,
      resourceTypeObj
    } = packageParams;
    const roleVOS = {};
    const flagVOS = {};
    const areaVOS = {};
    const resourceVOS = {};

    apps.forEach(item => {
      if (!appsTypes[item.key] || appsTypes[item.key].length === 0) {
        throw new Error(t('请完善所选系统权限后，进行提交'));
      }
      resourceVOS[item.key] = [];
      appsTypes[item.key].forEach(i => {
        switch (i) {
          case 'role':
            if (appsData[item.key].role.length === 0) {
              throw new Error(t('请完善所选系统权限后，进行提交'));
            }
            roleVOS[item.key] = appsData[item.key].role.map(j => {
              // const dimenodeIdArr = [];
              // const roleDetail = appsData[item.key].strategy[j.value];
              const dimeNodeList = [];
              appsData[item.key].strategy[j.value] &&
                _.map(appsData[item.key].strategy[j.value], (value, tagId) => {
                  for (let prop in value) {
                    // 对存在未完善角色策略情况，进行提示
                    // if (Object.keys(value[prop]).length === 0) {
                    //   throw new Error(t('请完善角色策略后，进行提交'));
                    // }
                    for (let dimeId in value[prop]) {
                      dimeNodeList.push({
                        tagId: tagId,
                        dimenodeId: dimeId
                      });
                    }
                  }
                });
              const roleItem = appsData[item.key].strategyList.find(
                roleStraregy => roleStraregy.roleId === j.value
              );
              return {
                appId: item.key,
                id: j.value,
                // dimeNodeList:
                // strategyId
                dimeNodeList,
                strategyId: roleItem ? roleItem.strategyDto.id : ''
              };
            });
            break;
          case 'area':
            if (appsData[item.key].area.length === 0) {
              throw new Error(t('请完善所选系统权限后，进行提交'));
            }
            areaVOS[item.key] = [
              {
                appId: item.key,
                businessId: businessId[item.key],
                packageAreaList: appsData[item.key].area.map(j => {
                  return {
                    id: j
                  };
                })
              }
            ];
            break;
          case 'flag':
            if (appsData[item.key].flag.length === 0) {
              throw new Error(t('请完善所选系统权限后，进行提交'));
            }
            flagVOS[item.key] = appsData[item.key].flag.map(j => {
              return {
                appId: item.key,
                id: j.value
              };
            });
            break;
          default:
            if (!appsData[item.key][i] || appsData[item.key][i].length === 0) {
              throw new Error(t('请完善所选系统权限后，进行提交'));
            }
            let list = appsData[item.key][i].map(j => {
              return {
                id: j.value,
                appId: item.key,
                resourceTypeId: resourceTypeObj[item.key].find(
                  typeItem => typeItem.identifying === i
                ).id
              };
            });
            resourceVOS[item.key].push(...list);
        }
      });
    });

    const result = {
      country,
      name,
      desc,
      packageCategoryId,
      apps: apps.map(item => {
        return {
          id: item.key
        };
      }),
      roleVOS,
      flagVOS,
      areaVOS,
      resourceVOS
    };

    if (oper === 'update') {
      result.id = id;
    }

    return result;
  };

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    const { form, oper, dispatch, t, handleOk } = this.props;
    form.validateFieldsAndScroll(err => {
      if (!err) {
        try {
          const payload = this.formatParams();
          // 更新数据之后关闭模态框
          dispatch({
            type:
              oper === 'create'
                ? 'managePackage/addPackage'
                : 'managePackage/updatePackage',
            payload: payload
          }).then(({ success, result }) => {
            message.destroy();
            if (success) {
              // 提示成功，2秒
              message.success(t('提交成功'), 2, () => {});
              handleOk();
            } else {
              message.error(t(result));
            }
          });
        } catch (error) {
          message.error(error.message);
        }
      }
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  };

  /**
   * 获取资源
   */
  handleFetchResource = params => {
    const { dispatch, packageParams } = this.props;
    const { resourceTypeObj } = packageParams;
    let type = null;
    const id = resourceTypeObj[params.appId].find(
      item => item.identifying == params.resourceTypeId
    ).id;
    switch (params.resourceTypeId) {
      case 'role':
        type = 'managePackage/fetchRoleListNew';
        break;
      case 'area':
        type = 'managePackage/fetchRoleListNew';
        break;
      case 'flag':
        type = 'managePackage/fetchFlagList';
        break;
      default:
        type = 'managePackage/fetchResourceList';
    }
    params.resourceTypeId = id;
    return dispatch({
      type,
      payload: { params }
    });
  };

  // 表格数据变化时获取策略
  tableChange = (data, appId, resourceTypeId) => {
    const { dispatch, packageParams, form } = this.props;
    const roleIds = data.map(item => item.value);
    const groupIds = [];
    dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        appsData: {
          ...packageParams.appsData,
          [appId]: {
            ...packageParams.appsData[appId],
            [resourceTypeId]: data
          }
        }
      }
    });
    if (resourceTypeId !== 'role') return;
    dispatch({
      type: 'managePackage/fetchPackageStrategyList',
      payload: {
        appId,
        roleIds,
        groupIds
      }
    });
    form.setFieldsValue({
      ['strategy' + appId]: packageParams.appsData[appId].strategy
    });
  };

  /**
   * 申请的权限类型变化时更新逻辑
   */
  handleResourceTypeChange = (appId, value) => {
    const {
      resourceTypeList,
      params,
      form,
      packageParams,
      dispatch
    } = this.props;
    const { appsTypes, projectList } = packageParams;
    dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        appsTypes: {
          ...appsTypes,
          [appId]: value
        }
      }
    });
    // 如果store中拿到了列表，则不重复发请求
    if (projectList[appId]) return;
    if (
      value.indexOf('bigdata_report') > -1 ||
      value.indexOf('bigdata_data_set') > -1
    ) {
      dispatch({
        type: 'managePackage/fetchProjectList',
        payload: { appId: appId, attrName: 'projectName', attrValue: '' }
      });
    }
  };

  /**
   * 权限选择-表格
   */
  getTableItem = config => {
    const { form, t, packageParams, params, allBusiness } = this.props;
    const { resourceList, projectList } = packageParams;
    const { appId, labelName, resourceTypeId } = config;
    // const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        {this.props.resourceLoading[appId] == true ? null : (
          <FormItem {...formItemLayout} label={labelName}>
            {/* {getFieldDecorator(`appsData.${appId+''}.${resourceTypeId}`, {
            rules: [{required: true}],
          })( */}
            <TableSelector
              value={packageParams.appsData[appId][resourceTypeId]}
              title={labelName}
              handleResourceTypeChange={this.handleResourceTypeChange}
              // resource={params.resource}
              t={t}
              isPackage={true}
              // ref={this.setTextInputRef}
              appId={appId}
              resourceList={resourceList[appId] || []}
              resourceTypeList={resourceTypeList}
              resourceTypeId={resourceTypeId}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              projectList={projectList[appId] || []}
              // handleChange={this.needShowArea(resourceTypeId)}
              handleFetchProjectList={projectName =>
                this.handleFetchProjectList(projectName, appId)
              }
              mask={true}
              // noFirstSearch={true}
              allBusiness={allBusiness}
              onChange={role => {
                this.tableChange(role, appId, resourceTypeId);
              }}
            />
            {/* )} */}
          </FormItem>
        )}
      </React.Fragment>
    );
  };

  // 获取项目列表
  handleFetchProjectList = (projectName, appId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'managePackage/fetchProjectList',
      payload: {
        appId: appId,
        attrName: 'projectName',
        attrValue: projectName
      }
    });
  };

  /**
   * 权限选择-地区
   */
  getAreaTableItem = config => {
    const { form, t, packageParams, handleBusinessChange } = this.props;
    // const { getFieldDecorator } = form;
    const { appbindedbusiness, treeData, businessId } = packageParams;
    const { appId, resourceTypeId } = config;

    // 如果是地区则显示地区列表项
    return this.props.resourceLoading[appId] == true ? null : (
      <div>
        <FormItem {...formItemLayout} label={t('业务线名称')}>
          {/* {getFieldDecorator('businessId', {
          rules: [{required: true}],
        })( */}
          <Select
            value={businessId[appId]}
            showSearch
            optionFilterProp="children"
            onChange={businessId => {
              handleBusinessChange(businessId, appId);
            }}
            style={{ width: '100%' }}>
            {appbindedbusiness[appId] instanceof Array &&
              appbindedbusiness[appId].map(bus => (
                <Option key={bus.id} value={bus.id}>
                  {bus.name}
                </Option>
              ))}
          </Select>
          {/* )} */}
        </FormItem>

        <FormItem {...formItemLayout} label={t('选择地区')}>
          {/* {getFieldDecorator(`resource_${config.resourceTypeId}`, {
          rules: [{required: true}],
        })( */}
          <TreeSelect
            value={packageParams.appsData[appId][resourceTypeId]}
            filterTreeNode={(inputValue, TreeNode) =>
              TreeNode.props.title.indexOf(inputValue) != -1
            }
            treeData={treeData[appId]}
            showSearch={true}
            // onChange={this.onAreaChange}
            onChange={area => {
              this.tableChange(area, appId, resourceTypeId);
            }}
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          />
          {/* )} */}
        </FormItem>
      </div>
    );
  };

  /**
   * 渲染角色相关的表单项
   */
  renderRole = appId => {
    const { t } = this.props;
    const config = {
      resourceTypeId: 'role',
      labelName: t('角色'),
      appId
    };
    return (
      <div key={'role'}>
        {this.getTableItem(config)}
        {this.getStrategyFormItem(config)}
      </div>
    );
  };

  /**
   * 渲染地区相关的表单项
   */
  renderArea = appId => {
    const { t } = this.props;
    const config = {
      resourceTypeId: 'area',
      labelName: t('地区'),
      appId
    };
    return <div key={'area'}>{this.getAreaTableItem(config)}</div>;
  };

  /**
   * 渲染标识位相关的表单项
   */
  renderFlag = appId => {
    const { t } = this.props;
    const config = {
      resourceTypeId: 'flag',
      labelName: t('标识位'),
      appId
    };
    return <div key={'flag'}>{this.getTableItem(config)}</div>;
  };

  // 渲染资源相关的表单项
  renderDefault = (appId, type) => {
    const { t, packageParams } = this.props;
    const { resourceTypeObj } = packageParams;
    const resourceType =
      resourceTypeObj[appId] &&
      resourceTypeObj[appId].find(item => item.identifying == type);
    const label = resourceType && resourceType.name;
    const config = {
      resourceTypeId: type,
      labelName: t(label),
      appId
    };
    return (
      <div className="aaaa" key={type}>
        {this.getTableItem(config)}
        {type == 'role' ? this.getStrategyFormItem(config) : null}
      </div>
    );
  };
  // 根据所选的系统渲染表单项
  renderItems = appId => {
    const { packageParams } = this.props;
    const { appsTypes } = packageParams;

    return (
      <div>
        {appsTypes[appId]
          ? appsTypes[appId].map(type => {
              switch (type) {
                case 'role':
                  return this.renderRole(appId);
                case 'area':
                  return this.renderArea(appId);
                case 'flag':
                  return this.renderFlag(appId);
                default:
                  return this.renderDefault(appId, type);
              }
            })
          : null}
      </div>
    );
  };

  getTables = () => {
    const { t, packageParams } = this.props;
    const { apps, appsTypes, resourceTypeObj } = packageParams;

    const options = {};
    for (let prop in resourceTypeObj) {
      options[prop] = resourceTypeObj[prop].map(item => {
        return {
          label: t(item.name),
          value: item.identifying
        };
      });
    }
    return apps.length
      ? apps.map((system, index) => {
          const appId = system.key;

          return (
            <Card
              className="ant-card-small"
              key={index}
              title={system.label}
              // loading={this.props.resourceLoading[appId]}
            >
              {this.props.resourceLoading[appId] == true ? (
                <FormItem label={t('申请的权限类型')} {...formItemLayout}>
                  <span>
                    <Icon type="loading" />
                    {t('正在加载..')}
                  </span>
                </FormItem>
              ) : (
                <FormItem {...formItemLayout} label={t('申请的权限类型')}>
                  <CheckboxGroup
                    value={appsTypes[appId]}
                    onChange={value => {
                      this.handleResourceTypeChange(appId, value);
                    }}
                    options={options[appId] || []}
                  />
                </FormItem>
              )}
              {this.renderItems(appId)}
            </Card>
          );
        })
      : null;
  };

  /**
   * 获取角色策略
   */
  getStrategyFormItem(config) {
    const {
      form,
      loading,
      dimensionIdMap,
      t,
      productLineList,
      resourceTypeList,
      params,
      packageParams
    } = this.props;
    const { getFieldDecorator } = form;
    const { resourceTypeId, appId } = config;
    const { strategyList, strategy } = packageParams.appsData[appId];
    const roleIdToNameMap = packageParams.appsData[appId][
      resourceTypeId
    ].reduce((total, item) => {
      total[item.value] = item.label;
      return total;
    }, {});
    // console.log(packageParams.appsData[appId]);
    // const { loadingStrategy } = loading;

    // if (params.resourceType.indexOf('role') === -1 || !params.resource_role || !params.resource_role.length) {
    //   return null;
    // }
    // // 显示正在加载
    // if (loadingStrategy) {
    //   return (
    //     <FormItem
    //       label={t('角色策略')}
    //       {...formItemLayout2}
    //     >
    //       <span><Icon type="loading" />{t('正在加载..')}</span>
    //     </FormItem>
    //   );
    // }
    if (!packageParams.appsData[appId][resourceTypeId].length) {
      return null;
    }
    const isNeedStrategy = !_.isEmpty(strategyList);
    // 显示具体的 输入框 || 无需填写提示
    return (
      <React.Fragment>
        {this.props.resourceLoading[appId] == true ? null : (
          <FormItem label={t('角色策略')} {...formItemLayout}>
            {getFieldDecorator('strategy' + appId, {
              // rules: isNeedStrategy ? [required] : undefined
            })(
              isNeedStrategy ? (
                <PackageStrategySetter
                  strategyList={strategyList}
                  dimensionIdMap={dimensionIdMap}
                  strategy={strategy}
                  closeModalBack={this.closeModalBack}
                  appId={appId}
                  roleIdToNameMap={roleIdToNameMap}
                  t={t}
                />
              ) : (
                <Popover
                  placement="right"
                  title={t('提示：')}
                  content={
                    <span>{t('当前申请的角色，不需要填写策略。')}</span>
                  }>
                  <span>
                    {t('忽略')} <Icon type="question-circle-o" />
                  </span>
                </Popover>
              )
            )}
          </FormItem>
        )}
      </React.Fragment>
    );
  }

  closeModalBack = appId => {
    const { form, packageParams } = this.props;
    const { setFieldsValue } = form;
    const strategy = packageParams.appsData[appId].strategy;
    setFieldsValue({
      ['strategy' + appId]: strategy
    });
  };

  render() {
    const { t, optionApps, countryList, allCategory } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={
          this.props.oper === 'create' ? t('新建权限礼包') : t('编辑权限礼包')
        }
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loading}
            onClick={this.handleOk}>
            {t('确定')}
          </Button>
        ]}>
        <Form>
          <FormItem {...formItemLayout} label={t('适用国家')} required={true}>
            {getFieldDecorator('country', { rules: [required] })(
              <Select onChange={this.handleCountryChange} showSearch>
                {_.map(countryList, (item, index) => {
                  return (
                    <Option key={index} value={item.name}>
                      {t(`${item.name}`)}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={t('礼包分类')} required={true}>
            {getFieldDecorator('packageCategoryId', { rules: [required] })(
              <Select placeholder={t('请选择')} allowClear>
                {_.map(allCategory, ({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('权限礼包名称')}
            required={true}>
            {getFieldDecorator('name', { rules: [required] })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('权限礼包描述')}
            required={true}>
            {getFieldDecorator('desc', { rules: [required] })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={t('选择系统')} required={true}>
            {getFieldDecorator('apps', { rules: [required] })(
              <Select
                showSearch
                allowClear
                labelInValue={true}
                mode="multiple"
                optionFilterProp="children"
                placeholder={t('输入关键字检索')}
                // dropdownClassName="apply-auth-dropdown"
                onChange={systems => {
                  this.changeSystems(systems);
                }}
                // onSelect={this.selectSystem}
              >
                {optionApps.map(item => (
                  <Option key={item.appId} value={item.appId}>
                    {item.appName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {this.getTables()}
        </Form>
      </Modal>
    );
  }
}

const PackageEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.packageParams, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    _.each(props.packageParams.apps, item => {
      const strategy =
        props.packageParams.appsData[item.key] &&
        props.packageParams.appsData[item.key].strategy;
      fields['strategy' + item.key] = Form.createFormField({ value: strategy });
    });
    return fields;
  },

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    props.dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        ...values
      }
    });
  }
})(PackageEdit);

export default connect(({ managePackage, global }) => {
  return {
    packageParams: managePackage.package,
    appId: global.managingApp,
    optionApps: global.apps,
    allBusiness: global.allBusiness,
    dimensionIdMap: managePackage.dimensionIdMap,
    resourceLoading: managePackage.package.resourceLoading
  };
})(PackageEditPage);
