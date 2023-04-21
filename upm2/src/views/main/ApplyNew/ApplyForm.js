import React from 'react';
// import ReactDOM from 'react-dom';
import ClipboardJS from 'clipboard';
import _ from 'lodash';
import moment from 'moment';
import connect from '@utils/translateConnect';
import { translate } from 'react-i18next';
// import SystemList from '../../../components/SystemList';
import StrategySetter from '../../../components/StrategySetter';
import TableSelector from '../../../components/NewTableSelector';
// import AreaSelector from '../../../components/AreaSelector';
import InputTreeTag from '../../../components/InputTreeTag';
import SearchSysAdmin from '@components/SearchSysAdmin';
import UserSelector from '@components/UserSelector';
import UserSelectorBatch from '@components/UserSelectorBatch';
import request from '../../../utils/request';
import { MAIN } from '@routes/config';
import { hasClass } from '@utils/classOp';
import { routerRedux } from 'dva/router';
// import { bpmHost } from '@config/apiConfig';
import { saveRef } from '@components/util';

import { trackEvent } from '@utils/omega';

import {
  APPLY_PAGE_VIEW_ROLE_TYPE,
  APPLY_PAGE_VIEW_ROLE,
  APPLY_PAGE_VIEW_SUBMIT
} from '@config/omega';

import SysAdmin from './SysAdmin';
import Footprint from './Footprint';

import introJs from '@/lib/intro.js';
import ForecastGraph from '@components/ForecastGraph';

const Logo = require('@assets/didiLogo.png');

// 前端足迹
const footprintInstance = new Footprint();
footprintInstance.getData();

import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Spin,
  Col,
  Icon,
  DatePicker,
  Popover,
  Modal,
  message,
  Collapse,
  Steps,
  TreeSelect,
  Card,
  Divider,
  Row,
  Tooltip
} from 'antd';
import NSTreeSelect from '../../../components/NSTreeSelect';
import { reportNewApply } from '@services/stat.js';

import './ApplyForm.less';

const sysIdArr = [2120, 2114, 2126, 2278, 2304];

const isMonitorSysId = sysId => sysIdArr.includes(sysId);

const { Panel } = Collapse;
const { Step } = Steps;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { TreeNode } = TreeSelect;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  wrapperCol: { offset: 6, span: 16 }
};
const formItemLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
const formItemLayout3 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const required = { required: true, message: '必填' };
// 对表单的rule中的提示，进行统一的语言转换
// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying, attr = 'id') => {
  const data = _.filter(list, item => item.identifying == identifying)[0];
  return data ? data[attr] : -1;
};
const spaceItemLayout = {
  labelCol: {
    span: 6,
    offset: 0
  },
  wrapperCol: {
    span: 16,
    offset: 0
  }
};

const permissionLayout = {
  labelCol: {
    span: 4,
    offset: 0
  },
  wrapperCol: {
    span: 18,
    offset: 0
  }
};
const levelEnum = ['role', 'namespace', 'region', 'approver'];
const validateStatusEnum = [
  'success',
  'success',
  'warning',
  'error',
  'validating'
];
const permissionHelpEnum = ['', '请添加权限'];
const typeEnum = ['standard', 'custom'];

const defaultState = {
  allAreas: [],
  idMap: {},
  ifShowArea: false,
  modalVisiable: false,
  businessId: '',
  treeData: [],
  hasAreas: [],
  // labelId: '',
  roleType: '0',
  // formValue: {}
  permissions: [],
  help: '',
  permissionValidateStatus: [],
  odinApproverLists: [],
  nstreeModelIndex: -1,
  recommandRoles: [],
  recommandFlags: [],
  ifShowBigdataReportHint: false, // 是否展示数易报表提示
  bigdataReportHint: '' // 数易报表提示
};

const GUIDE_DATA = {
  appId: 280, // 申请系统
  resourceType: ['role', 'area'] // 权限类型
};

// 等级隐射
const levelMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

class ApplyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allAreas: [],
      idMap: {},
      ifShowArea: false,
      modalVisiable: false,
      recommand: {
        recommandVis: { display: 'none' },
        recommandList: [],
        appName: ''
      },
      // businessId: '',
      treeData: [],
      hasAreas: [],
      // labelId: '',
      roleType: '0',
      // formValue: {}
      permissions: [],
      help: '',
      permissionValidateStatus: [],
      odinApproverLists: [],
      isOpenSys: true, // 是否开放申请
      hasFootprint: false, // 是否有足迹
      searchValue: '',
      recommandRoles: [],
      recommandFlags: [],
      btnLoading: false,
      areaList: [], //woater 新增城市 已有地区
      ifShowBigdataReportHint: false, // 是否展示数易报表提示
      bigdataReportHint: '', // 数易报表提示
      workflowItems: [],
      activeKeysOnCollapse: []
    };
    this.refTableSelector = null;
    this.refselect = null;
    this.selectedSystem = {}; // 当前选中系统
  }

  groupOptions = [];
  sysOptions = [];
  odinRoleOptions = [];
  woatorRegionNodes = [];
  woatorRoleOptions = [];
  bamaiRoleOptions = [];

  // componentWillMount() {
  //   this.getRecommand()
  // }

  componentDidMount() {
    // 判断是否需要开启新手向导
    this.props
      .dispatch({
        type: 'userInfo/getUserGuide'
      })
      .then(res => {
        // res = true;
        if (res) {
          this.showIntro();
        } else {
          this.getRecommand();
        }
      });
    // 足迹功能
    // let footprint = window.localStorage.getItem('FE_Footprint') || '[]';
    // footprint = JSON.parse(footprint);
    if (footprintInstance.footprint.length) {
      this.setState({ hasFootprint: true });
    }

    // 从快速申请跳转过来

    // 多权限类型-初始化，根据info字段判断是否为多权限类型(单权限也支持)
    // info示例(分隔符为'-' ':' ',')：info=bigdata_data_set:ds202051220,ds202051222-bigdata_report:rp202051220,rp202051222
    if (location.search !== '' && location.search.indexOf('info') > 0) {
      const { dispatch } = this.props;
      const pathParams = location.search
        .split('?')[1]
        .split('&')
        .reduce((total, i) => {
          total[i.split('=')[0]] = i.split('=')[1];
          return total;
        }, {});
      const appId = Number(pathParams.appId);
      const info = pathParams.info;
      const permissions = info.split('-').reduce((rstObj, item) => {
        const identifyingAndIds = item.split(':');
        rstObj[identifyingAndIds[0]] = identifyingAndIds[1];
        return rstObj;
      }, {});
      dispatch({
        type: 'newApply/setParams', // 增量设置state中的params（表单数据）
        payload: { appId, resourceType: Object.keys(permissions) } //appI的：申请访问的系统，resourceType：申请的权限类型
      });
      // if (Object.keys(permissions).includes('area')) {
      //area类型权限，需要业务线数据
      dispatch({
        type: 'admin/getAppBindedBusiness', // 获取该系统-业务线列表
        payload: { appId }
      });
      // }
      dispatch({
        type: 'newApply/fetchResourceType', // 获取resourceTypeList，得到resourceType的id与name(role,flag,area,bigdata_data_set等)对应
        payload: { appId }
      }).then(() => {
        const { resourceTypeList } = this.props;

        dispatch({
          type: 'newApply/fetchInitialValueWithIdentifyings', // 获取地址栏所带权限信息的具体内容
          payload: { appId, info }
        }).then(() => {
          const { initialFieldsValue } = this.props;
          if (!initialFieldsValue || !Object.keys(initialFieldsValue).length) {
            message.warning(t('URL参数错误, 请联系管理员'));
          }
          const formItemParams = {};
          Object.keys(initialFieldsValue).forEach(identifying => {
            const resourceTypeId =
              identifying && getIdByIdentifying(resourceTypeList, identifying);
            // 获取相关资源dataResource
            this.handleFetchResource({
              appId: appId,
              resourceTypeId,
              size: 10
            });

            formItemParams['resource_' + identifying] = [];
            const seletedItems = initialFieldsValue[identifying];
            // 对于role，flag，area和bigdata相关，所取字段不一样
            if (['role', 'flag', 'area'].includes(identifying)) {
              // area权限，触发业务线选择
              if (identifying === 'area') {
                const businessId = seletedItems[0].businessId;
                formItemParams['businessId'] = businessId;
                this.handleBusinessChange(businessId);
              }
              const paramsArr = [];
              for (let i = 0; i < seletedItems.length; i++) {
                formItemParams['resource_' + identifying].push(
                  identifying == 'area'
                    ? seletedItems[i].id + ''
                    : {
                        key: i,
                        label: seletedItems[i].nameZh,
                        value: seletedItems[i].id,
                        businessId: seletedItems[i].businessId,
                        riskLevel: seletedItems[i].riskLevel
                      }
                );
                paramsArr.push({
                  key: i,
                  label: seletedItems[i].nameZh,
                  value: seletedItems[i].id,
                  businessId: seletedItems[i].businessId
                });
              }
              this.tableChange(paramsArr); //策略相关
            } else {
              formItemParams['resource_' + identifying] = seletedItems.map(
                item => {
                  return {
                    label: item.resourceName,
                    value: item.resourceId,
                    businessId: item.businessId,
                    level: item.riskLevel
                  };
                }
              );
            }
          });
          dispatch({
            type: 'newApply/updateParams', //增量设置state中的params
            payload: formItemParams
          });
        });
      });

      // dispatch({
      //   type: 'newApply/fetchResourceType', // 获取resourceTypeList，id,identifying(bigdata_data_set),name
      //   payload: { appId }
      // }).then(() => {
      //   Object.keys(permissions).forEach(identifying => {
      //     if (['role', 'flag', 'area'].includes(identifying)) {
      //       const { resourceTypeList } = this.props;
      //       const resourceTypeId =
      //         identifying && getIdByIdentifying(resourceTypeList, identifying);
      //       this.handleFetchResource({
      //         // 获取相关资源dataResource
      //         appId: appId,
      //         resourceTypeId,
      //         size: 10
      //       });
      //       const ids = permissions[identifying];
      //       dispatch({
      //         type: 'newApply/fetchInitialValue', //获取该identifying权限类型的id（可多个，由','分隔）对应权限信息
      //         payload: { appId, id: ids, identifying }
      //       }).then(() => {
      //         const { initialFieldsValue } = this.props;
      //         if (!initialFieldsValue || !initialFieldsValue.length) {
      //           message.warning(t('URL参数错误, 请联系管理员'));
      //         }
      //         const businessId = initialFieldsValue[0].businessId;
      //         // this.getAreaItem(appId); // 控制“权限地区”formItem是否显示
      //         this.needShowArea(resourceTypeId)(null, this.getAreas);
      //         const payload = {
      //           businessId
      //         };
      //         this.handleBusinessChange(businessId);
      //         payload['resource_' + identifying] = [];
      //         let paramsArr = [];
      //         for (let i = 0; i < initialFieldsValue.length; i++) {
      //           payload['resource_' + identifying].push(
      //             identifying == 'area'
      //               ? initialFieldsValue[i].id + ''
      //               : {
      //                   key: i,
      //                   label: initialFieldsValue[i].nameZh,
      //                   value: initialFieldsValue[i].id,
      //                   businessId: initialFieldsValue[i].businessId
      //                 }
      //           );
      //           paramsArr.push({
      //             key: i,
      //             label: initialFieldsValue[i].nameZh,
      //             value: initialFieldsValue[i].id,
      //             businessId: initialFieldsValue[i].businessId
      //           });
      //         }
      //         dispatch({
      //           type: 'newApply/updateParams', //设置state中的params
      //           payload
      //         });
      //         this.tableChange(paramsArr); //策略相关
      //         this.getAreaItem(appId, businessId); // 控制“权限地区”formItem是否显示
      //       });
      //     } else {
      //       const { resourceTypeList } = this.props;
      //       const resourceTypeId =
      //         identifying && getIdByIdentifying(resourceTypeList, identifying);
      //       this.handleFetchResource({
      //         // 获取相关资源dataResource
      //         appId: appId,
      //         resourceTypeId
      //       });
      //       const ids = permissions[identifying];
      //       dispatch({
      //         type: 'newApply/fetchInitialFieldsValue',
      //         payload: { appId, type: identifying, resourceKey: ids }
      //       }).then(() => {
      //         const { initialFieldsValue } = this.props;
      //         if (!initialFieldsValue || !initialFieldsValue.length) {
      //           message.warning(t('URL参数错误, 请联系管理员'));
      //         }
      //         const businessId = initialFieldsValue[0].businessId;
      //         this.needShowArea(resourceTypeId)(null, this.getAreas);
      //         const payload = {
      //           appId
      //           // resourceType: [initialFieldsValue[0].typeIdentifying]
      //         };
      //         payload['resource_' + identifying] = initialFieldsValue.map(v => {
      //           return {
      //             label: v.resourceName,
      //             value: v.resourceId,
      //             businessId: v.businessId
      //           };
      //         });
      //         dispatch({
      //           type: 'newApply/updateParams',
      //           payload
      //         });
      //         this.getAreaItem(appId, businessId);
      //       });
      //     }
      //   });
      // });
      return;
    }

    // 单一权限类型-初始化

    // role,flag,area权限类型地址栏信息解析
    if (
      location.search !== '' &&
      location.search.indexOf('appId') > 0 &&
      location.search.indexOf('id') > 0
    ) {
      const { dispatch, resourceTypeList } = this.props;
      const arr = location.search
        .split('?')[1]
        .split('&')
        .reduce((total, i) => {
          total[i.split('=')[0]] = i.split('=')[1];
          return total;
        }, {});
      const appId = Number(arr.appId);
      const id = arr.id;
      const identifying = arr.identifying || 'role';
      const _businessId = arr.businessId;
      const resourceTypeId = arr.identifying
        ? getIdByIdentifying(resourceTypeList, identifying)
        : 10086;
      dispatch({
        type: 'admin/getAppBindedBusiness', // 获取该系统，业务线列表
        payload: { appId }
      });
      dispatch({
        type: 'newApply/fetchResourceType', // 获取resourceTypeList，id,identifying(bigdata_data_set),name
        payload: { appId }
      }).then(() => {
        dispatch({
          type: 'newApply/setParams', //设置state中的params
          payload: { appId, resourceType: [identifying] } //设置“申请的权限类型”勾选项
        }).then(() => {
          this.handleFetchResource({
            // 获取相关资源dataResource
            appId: appId,
            resourceTypeId,
            size: 10
          }).then(() => {
            if (id) {
              dispatch({
                // type: 'newApply/fetchInitialRoleValue',
                type: 'newApply/fetchInitialValue', //获取该identifying权限类型的id（可多个，由','分隔）对应权限信息
                payload: { appId, id, identifying }
              }).then(() => {
                const { initialFieldsValue } = this.props;
                const {
                  nameZh,
                  id,
                  businessId: ibusinessId
                } = initialFieldsValue[0];
                const businessId =
                  _businessId == undefined ? ibusinessId : +_businessId;
                // const businessId = ibusinessId
                this.getAreaItem(appId); // 控制“权限地区”formItem是否显示
                this.needShowArea(resourceType)(null, this.getAreas);
                const payload = {
                  businessId
                };
                this.handleBusinessChange(businessId);
                payload['resource_' + identifying] = [];
                let paramsArr = [];
                for (let i = 0; i < initialFieldsValue.length; i++) {
                  payload['resource_' + identifying].push(
                    identifying == 'area'
                      ? initialFieldsValue[i].id + ''
                      : {
                          key: i,
                          label: initialFieldsValue[i].nameZh,
                          value: initialFieldsValue[i].id,
                          businessId: initialFieldsValue[i].businessId,
                          riskLevel: initialFieldsValue[i].riskLevel
                        }
                  );
                  paramsArr.push({
                    key: i,
                    label: initialFieldsValue[i].nameZh,
                    value: initialFieldsValue[i].id,
                    businessId: initialFieldsValue[i].businessId
                  });
                }
                // payload['resource_'+identifying] = identifying=='area'?[id+'']:[{label: nameZh, value: id, businessId}];
                dispatch({
                  type: 'newApply/updateParams', //设置state中的params
                  payload
                });
                this.tableChange(paramsArr); //策略相关
                initialFieldsValue &&
                  initialFieldsValue[0] &&
                  initialFieldsValue[0] &&
                  this.getAreaItem(appId, businessId); // 控制“权限地区”formItem是否显示
              });
            } else {
              const { initialFieldsValue } = this.props;

              // const { nameZh, id, businessId: ibusinessId } = initialFieldsValue[0]||{};
              const { businessId: ibusinessId } = initialFieldsValue[0] || {};
              const businessId =
                _businessId == undefined ? ibusinessId : +_businessId;
              // const businessId = ibusinessId
              this.getAreaItem(appId);
              this.needShowArea(resourceType)(null, this.getAreas);
              const payload = {
                businessId
              };
              this.handleBusinessChange(businessId);
              payload['resource_' + identifying] = [];
              let paramsArr = [];
              for (let i = 0; i < initialFieldsValue.length; i++) {
                payload['resource_' + identifying].push(
                  identifying == 'area'
                    ? initialFieldsValue[i].id + ''
                    : {
                        key: i,
                        label: initialFieldsValue[i].nameZh,
                        value: initialFieldsValue[i].id,
                        businessId: initialFieldsValue[i].businessId,
                        riskLevel: initialFieldsValue[i].riskLevel
                      }
                );
                paramsArr.push({
                  key: i,
                  label: initialFieldsValue[i].nameZh,
                  value: initialFieldsValue[i].id,
                  businessId: initialFieldsValue[i].businessId
                });
              }
              // payload['resource_'+identifying] = identifying=='area'?[id+'']:[{label: nameZh, value: id, businessId}];
              dispatch({
                type: 'newApply/updateParams', //更新到params中
                payload
              });
              this.tableChange(paramsArr);
              initialFieldsValue &&
                initialFieldsValue[0] &&
                initialFieldsValue[0] &&
                this.getAreaItem(appId, businessId);
            }
          });
        });
      });

      return;
    }

    // bigdata数易权限类型地址栏信息解析
    const { match, dispatch, t } = this.props;
    const { resourceType, resourceKey } = match.params;
    const appId = Number(match.params.appId);
    if (resourceType && resourceKey && appId) {
      dispatch({
        type: 'admin/getAppBindedBusiness',
        payload: { appId }
      });
      dispatch({
        type: 'newApply/fetchInitialFieldsValue',
        payload: { appId, type: resourceType, resourceKey: resourceKey }
      }).then(() => {
        const { initialFieldsValue } = this.props;
        if (!initialFieldsValue || !initialFieldsValue.length) {
          message.warning(t('URL参数错误, 请联系管理员'));
        }
        // const { typeId, resourceName, resourceId } = initialFieldsValue;
        Promise.all([
          dispatch({
            type: 'newApply/fetchResourceType',
            payload: { appId }
          }),
          this.handleFetchResource({
            resourceTypeId: initialFieldsValue[0].typeId,
            appId
          })
        ]).then(() => {
          this.getAreaItem(appId);
          this.needShowArea(resourceType)(null, this.getAreas);
          const payload = {
            appId,
            resourceType: [initialFieldsValue[0].typeIdentifying]
            // resource: initialFieldsValue.map((v) => {
            //   return {label: v.resourceName, value: v.resourceId, businessId: v.businessId};
            // }),
            // resource: [{label: resourceName, value: resourceId}],
          };
          payload[
            'resource_' + initialFieldsValue[0].typeIdentifying
          ] = initialFieldsValue.map(v => {
            return {
              label: v.resourceName,
              value: v.resourceId,
              businessId: v.businessId,
              level: v.riskLevel
            };
          });
          dispatch({
            type: 'newApply/updateParams',
            payload
          });
          initialFieldsValue &&
            initialFieldsValue[0] &&
            initialFieldsValue[0] &&
            this.getAreaItem(appId, initialFieldsValue[0].businessId);
        });
      });
    } else if (appId && resourceType) {
      dispatch({
        type: 'admin/getAppBindedBusiness',
        payload: { appId }
      });
      dispatch({
        type: 'newApply/fetchResourceType',
        payload: { appId }
      })
        .then(() => {
          const resourceTypeId = getIdByIdentifying(
            this.props.resourceTypeList,
            resourceType
          );

          if (resourceTypeId == -1) {
            message.warning(t('URL参数错误, 请联系管理员'));
          }
          this.handleFetchResource({ resourceTypeId, appId });
        })
        .then(() => {
          dispatch({
            type: 'newApply/updateParams',
            payload: {
              appId,
              resourceType: [resourceType]
            }
          });
        });
    } else if (appId) {
      dispatch({
        type: 'admin/getAppBindedBusiness',
        payload: { appId }
      });
      dispatch({
        type: 'newApply/updateParams',
        payload: {
          appId
        }
      });
      dispatch({
        type: 'newApply/fetchResourceType',
        payload: { appId }
      });
    } else {
      const { params } = this.props;
      const { appId } = params;
      if (appId) {
        dispatch({
          type: 'newApply/fetchResourceType',
          payload: { appId }
        });
      }
    }

    if (resourceType === 'tableau_workbook') {
      this.props.dispatch({
        type: 'newApply/fetchSiteList'
      });
    }
    this.fetchMonitor();
    // const { userInfo } = this.props;
    // this.props.dispatch({
    //   type: 'newApply/updateParams',
    //   payload: {
    //     username: {
    //       key: userInfo.id || '',
    //       label: userInfo.username || ''
    //     }
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.userInfo.introApplyNewShow !=
      this.props.userInfo.introApplyNewShow
    ) {
      if (nextProps.userInfo.introApplyNewShow) {
        this.showIntro();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.appId != this.props.params.appId) {
      this.getAreaItem(this.props.params.appId * 1);
      this.needShowArea(null, this.getAreas);
    }
  }

  componentWillUnmount() {
    this.selectedSystem = {};

    // this.props.form.setFieldsValue({
    //   groups: [],
    //   expireAt: null,
    //   reason: '',
    //   groupType: 0
    // });
    // this.changeAppId('');

    this.clipboard && this.clipboard.destroy();
  }

  showIntro = () => {
    // 获取滴滴数据平台指引数据
    this.props
      .dispatch({
        type: 'newApply/fetchResourceType',
        payload: { appId: GUIDE_DATA.appId }
      })
      .then(() => {
        Promise.all([
          this.getRecommand(true),
          this.props.dispatch({
            type: 'newApply/setParams',
            payload: GUIDE_DATA
          })
        ]).then(() => {
          const { t } = this.props;

          // 初始化指引
          introJs()
            .setOptions({
              disableInteraction: true,
              exitOnOverlayClick: false,
              nextLabel: t('下一步'),
              prevLabel: t('上一步'),
              skipLabel: t('跳过'),
              doneLabel: t('完成'),
              steps: [
                {
                  element: '#intro-step1',
                  intro: `
                  ${t('选择申请开通权限的系统')}<br/>
                  ${t(
                    '1、猜你想要的系统（根据您最近的鉴权记录为您推荐可能想要申请的系统）'
                  )}<br/>
                  ${t('2、通过检索，获取要开通权限的系统')}`,
                  position: 'right'
                },
                {
                  element: '#intro-step2',
                  intro: `
          ${t(
            '选择要开通的权限（以“滴滴数据平台”为例），可按照报表、模板、角色、地区申请权限。'
          )}<br/>
          ${t(
            'tips：此步骤可选择的权限内容随申请开通权限的系统而变化，详见该系统权限使用说明或询问系统管理员。'
          )}`,
                  position: 'right'
                },
                {
                  element: '#intro-step3',
                  intro: `
          ${t('管理员在这里哦！点击查看')}`,
                  position: 'right'
                },
                {
                  element: '#intro-step4',
                  intro: `${t('设置权限的失效日期')}`,
                  position: 'right'
                },
                {
                  element: '#intro-step5',
                  intro: `
          ${t('填写权限申请的理由')}<br/>
          ${t('tips：尽可能详细的说明申请理由，会提高审批通过率哦~')}`,
                  position: 'right'
                }
              ]
            })
            .start()
            .onexit(() => {
              Promise.all([
                this.props.dispatch({
                  type: 'userInfo/save',
                  payload: { introApplyNewShow: false }
                }),
                this.props.dispatch({
                  type: 'userInfo/postUserGuided'
                })
              ]).then(() => {
                window.location.reload();
              });
            });
        });
      });
  };

  // getResourceId = name => {
  //   return getIdByIdentifying(this.props.resourceTypeList, name);
  // };

  setTextInputRef = e => {
    this.refTableSelector = e;
  };

  tableChange = role => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newApply/fetchStrategyList',
      payload: { role }
    });
  };

  // 获取大数据平台相关报表资源
  handleFetchResource = params => {
    const { dispatch } = this.props;
    let type = null;

    // 兼容新版本，不是数字的时候换成数字
    if (!/^\d+$/.test(params.resourceTypeId)) {
      params.resourceTypeId = getIdByIdentifying(
        this.props.resourceTypeList,
        params.resourceTypeId
      );
    }
    switch (params.resourceTypeId) {
      case getIdByIdentifying(this.props.resourceTypeList, 'role'):
        type = 'newApply/fetchRoleListNew';
        params.type = this.state.roleType;
        break;
      case getIdByIdentifying(this.props.resourceTypeList, 'area'):
        type = 'newApply/fetchRoleListNew';
        break;
      case getIdByIdentifying(this.props.resourceTypeList, 'flag'):
        type = 'newApply/fetchFlagList';
        break;
      default:
        type = 'newApply/fetchResourceList';
    }
    return dispatch({
      type,
      payload: { params }
    });
  };

  /**
   * 业务线变化时候的处理逻辑
   */
  handleBusinessChange = businessId => {
    if (businessId) {
      this.props.dispatch({
        type: 'newApply/updateParams',
        payload: {
          resource_area: []
        }
      });
      Promise.all([
        request(
          `/area/select/tree?businessId=${businessId}&appId=${this.props.params.appId}`
        ),
        request(
          `/v2/apply/getUserAreas?businessId=${businessId}&appId=${this.props.params.appId}`
        )
      ]).then(res => {
        let data = [];
        if (res[1]) {
          res[1].map(item => {
            data.push(item.name);
          });
        }
        this.setState({
          businessId,
          treeData: this.formatTree(res[0], res[1])
        });
      });
    }
  };

  // areaSelectChange = (value) => {
  //   console.log(value);
  // }
  handleClickAdd = () => {
    this.addNewPermission();
    this.setPermissionsHelp(0);
  };

  handleClickDelete = index => {
    this.deletePermission(index);
    this.setPermissionsHelp(0);
  };

  handleChangeSys = (id, index) => {
    this.changeSys(id, index);
    this.setPermissionsHelp(0);
  };

  handleChangeLevel = (value, type, index) => {
    this.changeLevel(value, type, index);
    this.setPermissionsHelp(0);
  };

  handleClickCancel = () => {
    this.redirectTo('../monitorPermissionGroup');
  };

  handleOdinSearch = search => {
    this.setOdinSearchStatus(true);
    this.fetchOdinTree(search);
  };

  handleGroupTypeChange = () => {
    const state = {
      ...this.state,
      permissions: [],
      help: '',
      permissionValidateStatus: [],
      odinApproverLists: []
    };
    this.setState(state);

    this.props.form.setFieldsValue({
      groups: []
    });
  };

  handleNSSelectClick = index => {
    const state = {
      ...this.state,
      nstreeModelIndex: index
    };
    this.setState(state);
  };

  handleNSModalOK = (nsList, index) => {
    this.handleChangeLevel(
      nsList,
      'namespace',
      index !== undefined ? index : this.state.nstreeModelIndex
    );

    const state = {
      ...this.state,
      nstreeModelIndex: -1
    };
    this.setState(state);
  };

  handleNSModalCancel = () => {
    const state = {
      ...this.state,
      nstreeModelIndex: -1
    };
    this.setState(state);
  };

  setOptions = props => {
    const { odinRoles, sysList } = props;
    this.sysOptions = this.getOptions(sysList);
    this.odinRoleOptions = this.getOptions(odinRoles);
  };

  addNewPermission = () => {
    let {
      permissions,
      permissionValidateStatus,
      odinApproverLists
    } = this.state;
    const { sysList } = this.props;

    const newPermission = {
      sysId: sysList[0].id,
      params: {}
    };
    permissions.push(newPermission);

    let newPermissionValidateStatus = levelEnum.map(() => 0);
    permissionValidateStatus.push(newPermissionValidateStatus);

    odinApproverLists.push([]);

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  };

  deletePermission = index => {
    let {
      permissions,
      permissionValidateStatus,
      odinApproverLists
    } = this.state;

    permissions.splice(index, 1);
    permissionValidateStatus.splice(index, 1);
    odinApproverLists.splice(index, 1);

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  };

  redirectTo = path => {
    const { dispatch } = this.props;

    const action = {
      type: 'monitorPermissionGroup/redirect',
      payload: {
        path
      }
    };
    dispatch(action);
  };

  changeLevel = (value, type, index) => {
    const {
      permissions,
      permissionValidateStatus,
      odinApproverLists
    } = this.state;

    let permission = permissions[index];
    if (permission.params.approver) {
      permission.params.approver = '';
    }
    permission.params = {
      ...permission.params,
      [type]: value
    };

    permissionValidateStatus[index][levelEnum.indexOf(type)] = 0;

    odinApproverLists[index] = [];

    const state = {
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);

    if (
      type !== 'approver' &&
      permission.sysId == 182 &&
      permission.params.role &&
      permission.params.namespace
    ) {
      this.fetchApproverList(
        permission.params.role,
        permission.params.namespace,
        index
      );
    }
  };

  changeSys = (id, index) => {
    const {
      permissions,
      permissionValidateStatus,
      odinApproverLists
    } = this.state;

    let permission = permissions[index];
    permission.sysId = parseInt(id);
    permission.params = {};

    permissionValidateStatus[index] = levelEnum.map(() => 0);
    permissionValidateStatus[index].unshift(0);

    odinApproverLists[index] = [];

    const state = {
      ...this.state,
      permissions,
      permissionValidateStatus,
      odinApproverLists
    };
    this.setState(state);
  };

  setPermissionsHelp = helpParam => {
    let help = '';
    if (typeof helpParam === 'number') {
      help = permissionHelpEnum[helpParam] || '';
    } else if (typeof helpParam === 'string') {
      help = helpParam;
    }
    const state = {
      ...this.state,
      help
    };
    this.setState(state);
  };

  fetchMonitor = () => {
    this.fetchGroupList();
    this.fetchWoaterRR();
    this.fetchBamaiRoleList();

    this.setOptions(this.props);
  };

  fetchWoaterRR = () => {
    const { dispatch, woaterRoleList, woaterRegionTree, sysList } = this.props;
    if (
      !woaterRoleList ||
      !woaterRoleList.length ||
      woaterRoleList.length === 0
    ) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[1].id,
          key: 'role'
        }
      };
      dispatch(action).then(newwoaterRoleList => {
        this.woatorRoleOptions = this.getOptions(newwoaterRoleList);
      });
    } else {
      this.woatorRoleOptions = this.getOptions(woaterRoleList);
    }
    if (
      !woaterRegionTree ||
      !woaterRegionTree.length ||
      woaterRegionTree.length === 0
    ) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[1].id,
          key: 'region'
        }
      };
      dispatch(action).then(newwoaterRegionTree => {
        this.woatorRegionNodes = this.getNodes(newwoaterRegionTree);
      });
    } else {
      this.woatorRegionNodes = this.getNodes(woaterRegionTree);
    }
  };

  fetchBamaiRoleList = () => {
    const { dispatch, bamaiRoles, sysList } = this.props;
    if (!bamaiRoles || !bamaiRoles.length || bamaiRoles.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchSysSub',
        payload: {
          sysId: sysList[2].id,
          key: 'role'
        }
      };
      dispatch(action).then(newBamaiRoles => {
        this.bamaiRoleOptions = this.getOptions(newBamaiRoles);
      });
    } else {
      this.bamaiRoleOptions = this.getOptions(bamaiRoles);
    }
  };

  fetchGroupList = () => {
    const { dispatch, groupList } = this.props;
    if (!groupList || groupList.length === 0) {
      const action = {
        type: 'monitorPermissionGroup/fetchList',
        payload: {}
      };
      dispatch(action).then(newGroupList => {
        this.groupOptions = this.getOptions(newGroupList);
      });
    } else {
      this.groupOptions = this.getOptions(groupList);
    }
  };

  fetchApproverList = (role, nsList, index) => {
    const { dispatch } = this.props;
    const action = {
      type: 'monitorPermissionGroup/fetchOdinApprover',
      payload: {
        role: this.getOdinRoleMark(role),
        nsList: nsList.join('%0A')
      }
    };
    dispatch(action).then(res => {
      const { odinApproverLists } = this.state;
      odinApproverLists[index] = res;
      const state = {
        ...this.state,
        odinApproverLists
      };
      this.setState(state);
    });
  };

  getOdinRoleMark = id => {
    const { odinRoles } = this.props;
    for (let i = 0; i < odinRoles.length; i++) {
      if (odinRoles[i].id == id) return odinRoles[i].mark;
    }
    return '';
  };

  getNodes = (tree, value = 'id', title = 'name') => {
    return tree.map((item, index) => (
      <TreeNode
        key={index}
        value={item[value]}
        key={item[value]}
        title={item[title]}>
        {item.children && this.getNodes(item.children, value, title)}
      </TreeNode>
    ));
  };

  getOptions = (list, value = 'id', title = 'name') => {
    return list.map((item, index) => {
      return (
        <Option key={index} value={item[value]} url={item.homePage}>
          {item[title]}
        </Option>
      );
    });
  };

  isValidOdinPermission = (params, index) => {
    let { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
    }
    if (
      !(
        params.namespace &&
        typeof params.namespace.length === 'number' &&
        params.namespace.length > 0
      )
    ) {
      permissionValidateStatus[index][levelEnum.indexOf('namespace')] = 3;
    }
    if (!params.approver) {
      permissionValidateStatus[index][levelEnum.indexOf('approver')] = 3;
    }

    const state = {
      ...this.state,
      permissionValidateStatus
    };
    this.setState(state);

    return (
      params &&
      (params.namespace &&
        typeof params.namespace.length === 'number' &&
        params.namespace.length > 0) &&
      params.role &&
      params.approver
    );
  };

  isValidWoatorPermission = (params, index) => {
    const { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
    }
    if (!params.region) {
      permissionValidateStatus[index][levelEnum.indexOf('region')] = 3;
    }

    const state = {
      ...this.state,
      permissionValidateStatus
    };
    this.setState(state);

    return params && params.role && params.region;
  };

  isValidBamaiPermission = (params, index) => {
    const { permissionValidateStatus } = this.state;

    if (!params.role) {
      permissionValidateStatus[index][levelEnum.indexOf('role')] = 3;
      const state = {
        ...this.state,
        permissionValidateStatus
      };
      this.setState(state);
    }

    return params && params.role;
  };

  isValidPermission = (permission, index) => {
    const map = {
      182: this.isValidOdinPermission,
      685: this.isValidWoatorPermission,
      302: this.isValidBamaiPermission
    };
    return permission.sysId && map[permission.sysId](permission.params, index);
  };

  getInvalidPermissions = permissions => {
    let list = [];
    permissions.forEach((item, index) => {
      if (!this.isValidPermission(item, index)) {
        list.push(index + 1);
      }
    });
    return list;
  };

  /**
   * 格式化成树状结构
   */
  formatTree = (data, hasAreas) => {
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        data[i].title = `${data[i].name}（${
          data[i].riskLevel ? data[i].riskLevel : '-'
        }）`;
        data[i].value = data[i].id + '';
        data[i].key = data[i].id + '';
        for (let j = 0; j < hasAreas.length; j++) {
          if (hasAreas[j].id == data[i].id) {
            // data[i].disableCheckbox = true;
            data[i].title += this.props.t('(已有该地区权限)');
            break;
          }
        }
        if (data[i].children && data[i].children.length) {
          this.formatTree(data[i].children, hasAreas);
        }
      }
    }
    return data;
  };

  /**
   * 选择地区值变化时候的处理逻辑
   */
  onAreaChange = (value, label) => {
    // let result = [];
    // if (value && value.length) {
    //   for (let i = 0; i < value.length; i ++) {
    //     result.push({
    //       value: value[i],
    //       label: label[i],
    //       businessId: this.state.businessId
    //     })
    //   }
    // }
    this.props.dispatch({
      type: 'newApply/updateParams',
      payload: {
        businessId: this.state.businessId
      }
    });
  };
  /**
   * 获取角色类型
   */
  getRoleLabel = () => {
    const { t, params: curSystem } = this.props;

    // console.log('getRoleLabel', curSystem)

    // 针对滴滴数据平台
    if (curSystem.appId === 280) {
      return (
        <FormItem label={t('角色类型')} {...formItemLayout2}>
          <Select
            value={this.state.roleType}
            onChange={value => {
              this.setState({ roleType: value });
              this.props.form.setFieldsValue(
                {
                  resource_role: []
                },
                () => {
                  // console.log(this.props.params)
                }
              );
            }}
            style={{ width: '100%' }}>
            <Option key="0" value="0">
              {t('功能角色')}
            </Option>
            <Option key="1" value="1">
              {t('岗位角色')}
            </Option>
          </Select>
        </FormItem>
      );
    } else {
      return null;
    }
  };
  /**
   * 报表选择，已废弃？？？
   */
  getTableSelectorItem = resourceType => {
    const {
      form,
      t,
      resourceList,
      resourceTypeList,
      params,
      allBusiness
    } = this.props;
    const { appId } = params;
    const { getFieldDecorator } = form;
    // const resourceType = form.getFieldValue('resourceType');
    let shouldItemRender = true;
    let itemLabelName = t('具体需要申请的权限');

    if (_.isEmpty(resourceList)) {
      return null;
    }

    switch (resourceType) {
      case getIdByIdentifying(resourceTypeList, 'role'):
        itemLabelName = t('角色选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'bigdata_report'):
        itemLabelName = t('报表选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'bigdata_extraction_tool'):
        itemLabelName = t('模板选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'bigdata_indicator'):
        itemLabelName = t('指标选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'flag'):
        itemLabelName = t('标识位选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'area'):
        itemLabelName = t('地区选择');
        shouldItemRender = true;
        break;
      case getIdByIdentifying(resourceTypeList, 'tableau_workbook'):
        itemLabelName = t('工作簿选择');
        shouldItemRender = true;
        break;
      default:
        shouldItemRender = false;
    }
    // 如果是地区则显示地区列表项
    if (getIdByIdentifying(resourceTypeList, 'area') == resourceType) {
      return shouldItemRender ? (
        <div>
          <FormItem {...formItemLayout2} label={t('业务线名称')}>
            {getFieldDecorator('businessId', {
              rules: [{ required: true }]
            })(
              <Select
                // value={this.state.businessId}
                showSearch
                optionFilterProp="children"
                onChange={this.handleBusinessChange}
                style={{ width: '100%' }}>
                {this.props.appbindedbusiness.map(bus => (
                  <Option key={bus.id} value={bus.id}>
                    {bus.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout2} label={t('地区')}>
            {getFieldDecorator('resource', {
              rules: [{ required: true }]
            })(
              <TreeSelect
                filterTreeNode={(inputValue, TreeNode) =>
                  TreeNode.props.title.indexOf(inputValue) != -1
                }
                treeData={this.state.treeData}
                showSearch={true}
                // onChange={this.onAreaChange}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout2} label={t('已有地区')}>
            {getFieldDecorator('hasAreas', {})(
              <Input
                disabled={true}
                mode="tags"
                style={{ width: '100%' }}></Input>
            )}
          </FormItem>
        </div>
      ) : (
        ''
      );
    } else {
      return shouldItemRender ? (
        <FormItem {...formItemLayout2} label={itemLabelName}>
          {getFieldDecorator('resource', {
            rules: [{ required: true }]
          })(
            <TableSelector
              roleType={this.state.roleType}
              roleLabelList={this.props.roleLabelList}
              siteList={this.props.siteList}
              resource={params.resource}
              t={t}
              ref={this.setTextInputRef}
              appId={appId}
              resourceList={resourceList}
              resourceTypeList={resourceTypeList}
              resourceTypeId={resourceType}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              handleChange={this.needShowArea}
              mask={true}
              allBusiness={allBusiness}
              projectList={this.props.projectList}
              handleFetchProjectList={this.handleFetchProjectList}
              onChange={this.tableChange}
            />
          )}
        </FormItem>
      ) : null;
    }
  };

  /**
   * 获取角色策略
   */
  getStrategyFormItem() {
    const {
      form,
      loading,
      strategyList,
      dimensionIdMap,
      t,
      productLineList,
      resourceTypeList,
      params
    } = this.props;
    const { getFieldDecorator } = form;
    const { loadingStrategy } = loading;
    // const resource = form.getFieldValue('resource');
    // const resourceType = form.getFieldValue('resourceType');
    // // 如果还未选择角色，则不显示策略
    // if (_.isEmpty(resource)) {
    //   return null;
    // }

    // // 如果是大数据平台，且申请的不是角色
    // // if (!_.isEmpty(productLineList)) {
    //   if (resourceType != getIdByIdentifying(resourceTypeList, 'role')) {
    //     return null;
    //   }
    // // }

    if (
      params.resourceType.indexOf('role') === -1 ||
      !params.resource_role ||
      !params.resource_role.length
    ) {
      return null;
    }
    const roleIdNameMap = {};
    params.resource_role.forEach(role => {
      roleIdNameMap[role.value] = role.label;
    });
    // for (let roleId in role) {
    //   roleIdNameMap[roleId] = role[roleId].label;
    // }
    // 显示正在加载
    if (loadingStrategy) {
      return (
        <FormItem label={t('角色策略')} {...formItemLayout2}>
          <span>
            <Icon type="loading" />
            {t('正在加载..')}
          </span>
        </FormItem>
      );
    }

    const isNeedStrategy = !_.isEmpty(strategyList);
    // 显示具体的 输入框 || 无需填写提示
    return (
      <FormItem label={t('角色策略')} {...formItemLayout2}>
        {getFieldDecorator('strategy', {
          // rules: isNeedStrategy ? [required] : undefined
        })(
          isNeedStrategy ? (
            <StrategySetter
              strategyList={strategyList}
              dimensionIdMap={dimensionIdMap}
              roleIdNameMap={roleIdNameMap}
              t={t}
            />
          ) : (
            <Popover
              placement="right"
              title={t('提示：')}
              content={<span>{t('当前申请的角色，不需要填写策略。')}</span>}>
              <span>
                {t('忽略')} <Icon type="question-circle-o" />
              </span>
            </Popover>
          )
        )}
      </FormItem>
    );
  }

  /**
   * 获取地区
   */
  getRegionItem = () => {
    if (this.state.ifShowArea) {
      const { t, form } = this.props;
      const { getFieldDecorator } = form;
      let { allAreas, idMap } = this.state;
      return (
        <div style={{ position: 'relative' }}>
          <FormItem {...formItemLayout2} label={t('新增城市')}>
            {getFieldDecorator('region', {})(
              <InputTreeTag
                options={allAreas}
                idMap={idMap}
                onChange={v => this.handleNewAreaChange(v)}
              />
            )}
            {/* style={{ position: 'absolute', top: '35px', left: '167px' }} */}
            <label>{t('如下方“已有地区”中已获授权，无需添加')}</label>
          </FormItem>
        </div>
      );
    } else {
      return null;
    }
  };

  /**
   * 地区变化时的处理
   */
  handleNewAreaChange = area => {
    const { form } = this.props;
    form.setFieldsValue({ region: area });
  };

  getAreasItem = () => {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;

    if (this.state.ifShowArea) {
      return (
        <div style={{ position: 'relative' }}>
          <FormItem {...formItemLayout2} label={t('已有地区')}>
            {getFieldDecorator('currentArea', {})(
              <Input
                disabled={true}
                mode="tags"
                style={{ width: '100%' }}></Input>
            )}
            {/* style={{ position: 'absolute', top: '35px', left: '167px', color: 'red' }} */}
            <label style={{ color: 'red' }}>
              {t('如需更多城市权限，请在上方”新增城市“处添加')}
            </label>
          </FormItem>
        </div>
      );
    } else {
      return null;
    }
  };

  getAreas = record => {
    const { params, form } = this.props;
    const { appId } = params;
    if (this.state.ifShowArea && appId) {
      request(
        `/v2/apply/getUserAreas?appId=${appId}&businessId=${
          record && record.length > 0
            ? record[0].businessId
            : this.getBusinessId()
        }`
      ).then(res => {
        let data = [];
        if (res && res.length) {
          res.map(item => {
            data.push(item.name);
          });
          form.setFieldsValue({
            currentArea: data.join() || ''
          });
        }
      });
    }
  };

  getInitalArea(data) {
    return data && data.hasOwnProperty('appId') && data.properties
      ? data.properties.some(
          pro => pro.attrName === 'applyArea' && pro.attrValue === '1'
        )
      : false;
  }

  needShowArea = resourceTypeId => {
    return (record, callback) => {
      const {
        resourceList,
        params,
        initialFieldsValue,
        allBusiness
      } = this.props;
      if (record && record.length > 0) {
        this.setState(
          {
            ifShowArea: record[0].applyArea == 1
          },
          () => {
            if (this.state.ifShowArea) {
              this.getAreaItem(this.props.params.appId, record[0].businessId);
              this.getAreas(record);
            }
          }
        );

        if (resourceTypeId == 'bigdata_report') {
          // 数易报表业务线提示
          // 获取涉及业务线id
          let businessIds = [];
          record.forEach(item => {
            if (item.applyAreaBusinessLines) {
              // 业务线id去重
              businessIds.push(...item.applyAreaBusinessLines.split(','));
              businessIds = [...new Set(businessIds)];
            }
          });

          if (businessIds.length > 0) {
            this.setState(
              {
                ifShowBigdataReportHint: true
              },
              () => {
                // 拼接显示名称
                let hint = '';
                businessIds.forEach(item => {
                  let business = _.find(allBusiness, { id: +item });
                  if (business && business.id) {
                    hint += business.name + '、';
                  }
                });

                if (hint.length > 0) {
                  hint = `您勾选的报表涉及${hint.substring(
                    0,
                    hint.length - 1
                  )}业务线的地区权限，建议一并申请`;

                  this.setState({
                    bigdataReportHint: hint
                  });
                }
                return;
              }
            );
          } else {
            this.setState({
              ifShowBigdataReportHint: false
            });
          }
        }
        return;
      }
      // const { resource } = params
      const needRenderCities =
        params &&
        params.applyRoleDtos &&
        params.applyRoleDtos.length &&
        params.applyRoleDtos[0].areaDtos &&
        params.applyRoleDtos[0].areaDtos.length > 0;

      // 选中的resource，同时在resourceList.records[].properties[].applyArea为1才显示，如果是0则不显示
      // resource里面的value和resourceList.records[].id相对应
      const recordsHash = {};
      params[`resource_${resourceTypeId}`] &&
        params[`resource_${resourceTypeId}`].forEach(val => {
          recordsHash[val.value] = val;
        });

      const ifShowArea =
        this.getInitalArea(initialFieldsValue) ||
        (resourceList
          ? resourceList.records
            ? resourceList.records.some(val => {
                if (val.properties) {
                  return val.properties.some(
                    pro => pro.attrName === 'applyArea' && pro.attrValue === '1'
                  );
                }
                return false;
              })
            : false
          : false) ||
        needRenderCities;

      this.setState({ ifShowArea }, () => {
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    };
  };

  getBusinessId() {
    const { initialFieldsValue } = this.props;
    if (initialFieldsValue && initialFieldsValue.properties) {
      return (
        initialFieldsValue.properties.find(
          item => item.attrName == 'businessId'
        ).attrValue * 1
      );
    }
    return '';
  }

  getAreaItem = (appId, businessId) => {
    if (!businessId) {
      businessId = this.getBusinessId();
      if (!businessId) return;
    }
    request(`/area/select/tree?appId=${appId}&businessId=${businessId}`).then(
      res => {
        const { value, form } = this.props; //初始化城市
        form.setFieldsValue({
          region: []
        });
        this.setState({ idMap: {}, allAreas: [] }, () => {
          const { idMap } = this.formatAreasForInputTag(res);
          this.setState({ idMap, allAreas: res });
          if (
            value &&
            value.applyRoleDtos &&
            value.applyRoleDtos.length &&
            value.applyRoleDtos[0].areaDtos
          ) {
            let cities = {};
            value.applyRoleDtos[0].areaDtos.map(item => {
              cities[item.id] = true;
            });

            form.setFieldsValue({
              region: cities
            });
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  };

  formatAreasForInputTag = root => {
    const idMap = {};
    if (!root) {
      return { root, idMap };
    }

    const patchParent = (node, parent) => {
      const { id, idStr, name } = node;
      node.parent = parent;
      node.value = id;
      node.label = name;
      node.key = idStr;

      idMap[id] = node;

      _.each(node.children, child => patchParent(child, node));
    };
    _.each(root, node => patchParent(node, null));

    return { root, idMap };
  };

  /**
   * 当类型为报表时增加是查看还是编辑权限
   */
  getOpt = () => {
    const { t, form } = this.props;
    const options = [
      { label: t('查看'), value: 1, disabled: true },
      { label: t('编辑'), value: 2 }
    ];

    return (
      <FormItem {...formItemLayout}>
        {form.getFieldDecorator('opt', {
          rules: [required],
          initialValue: [1]
        })(<CheckboxGroup options={options} />)}
      </FormItem>
    );
  };

  /**
   * 代他人申请时清空申请人，反之设置为登录名
   */
  changForOthers = e => {
    const { form, userInfo } = this.props;

    form.setFieldsValue({
      username: e.target.checked
        ? []
        : { key: userInfo.id, label: userInfo.username }
    });
    this.props.dispatch({
      type: 'newApply/save',
      payload: { isBatchForUserSelector: false }
    });
  };

  /**
   * 申请系统变化时更新权限类型列表
   */
  changeAppId = nextAppId => {
    const {
      dispatch,
      form: { setFieldsValue },
      params: { appId },
      userInfo: { username = '' }
    } = this.props;
    this.setState({ searchValue: '' });
    this.props.dispatch({
      type: 'newApply/updateParams',
      payload: {
        businessId: ''
      }
    });
    if (!nextAppId) {
      return;
    }

    if (isMonitorSysId(appId)) {
      setFieldsValue({
        resourceType: ''
      });
    }

    if (!isMonitorSysId(nextAppId)) {
      const resetProperties = Object.keys(this.props.params)
        .filter(p => {
          return /^resource_/.test(p);
        })
        .reduce((total, p) => {
          total[p] = [];
          return total;
        }, {});
      this.props.dispatch({
        type: 'newApply/updateParams',
        payload: Object.assign(
          {
            resourceType: [],
            businessId: ''
          },
          resetProperties
        )
      });
    } else {
      setFieldsValue({ username, isApplyForOthers: false });
    }

    dispatch({
      type: 'newApply/fetchResourceType',
      payload: { appId: nextAppId }
    });
    dispatch({
      type: 'admin/getAppBindedBusiness',
      payload: { appId: nextAppId }
    });
  };

  /**
   * 申请的权限类型变化时更新逻辑
   */
  handleResourceTypeChange = resourceType => {
    const { resourceTypeList, dispatch, params, form } = this.props;
    this.setState({
      ifShowArea: false
    });
    form.setFieldsValue({
      resource: [],
      region: []
      // businessId: ''
      // opt: resourceType == getIdByIdentifying(resourceTypeList, 'bigdata_report')?[1]:[]
    });
    this.handleFetchResource({
      appId: params.appId,
      resourceTypeId: getIdByIdentifying(resourceTypeList, resourceType),
      size: 10
    });
    if (resourceType.indexOf('role') > -1) {
      // 如果选中角色，获取推荐角色
      dispatch({
        type: 'role/recommendRoles',
        payload: { appId: params.appId }
      }).then(data => {
        const newData = data.map(item => {
          item.riskLevel = levelMapping[item.riskLevel] || '';
          return item;
        });
        this.setState({
          recommandRoles: newData
        });
      });
      dispatch({
        type: 'newApply/fetchRoleLabelList',
        payload: { appId: params.appId }
      });
    }
    if (resourceType.indexOf('tableau_workbook') > -1) {
      dispatch({
        type: 'newApply/fetchSiteList'
      });
    }
    if (resourceType.indexOf('flag') > -1) {
      dispatch({
        type: 'newApply/recommendFlags',
        payload: { appId: params.appId }
      }).then(data => {
        const newData = data.map(item => {
          item.riskLevel = levelMapping[item.riskLevel] || '';
          return item;
        });
        this.setState({
          recommandFlags: newData
        });
      });
    }

    if (
      resourceType.indexOf('bigdata_report') > -1 ||
      resourceType.indexOf('bigdata_data_set') > -1
    ) {
      dispatch({
        type: 'newApply/fetchProjectList',
        payload: { appId: params.appId, attrName: 'projectName', attrValue: '' }
      });
    }
  };

  // 获取项目列表
  handleFetchProjectList = projectName => {
    const { dispatch, params } = this.props;
    dispatch({
      type: 'newApply/fetchProjectList',
      payload: {
        appId: params.appId,
        attrName: 'projectName',
        attrValue: projectName
      }
    });
  };

  /**
   * 提交后的处理逻辑
   */
  handleSubmit = () => {
    const { dispatch, strategyList, params, t } = this.props;
    // 去除角色策略验证
    // 仅在选择“角色”情况下，对策略进行验证。否则，在出现“角色策略”后，取消“角色”选择后，会导致多余验证
    // if (this.props.form.getFieldValue('resourceType').indexOf('role') > -1) {
    // 角色策略-选择完成-验证策略
    // const { strategy } = params;
    // let isStrategyOk = true;
    // if (!_.isEmpty(strategyList)) {
    // 所有角色策略必填验证
    // for (const strategyBase of strategyList) {
    //   if (!strategy[strategyBase.roleId]) {
    //     isStrategyOk = false;
    //     break;
    //   } else {
    //     for (const tagDime of strategyBase.tagDimeList) {
    //       if (
    //         !strategy[strategyBase.roleId][tagDime.tag.id] ||
    //         Object.keys(strategy[strategyBase.roleId][tagDime.tag.id])
    //           .length === 0
    //       ) {
    //         isStrategyOk = false;
    //         break;
    //       } else {
    //         for (const dimeDto of tagDime.dimeDtoList) {
    //           if (
    //             !strategy[strategyBase.roleId][tagDime.tag.id][
    //               dimeDto.id
    //             ] ||
    //             Object.keys(
    //               strategy[strategyBase.roleId][tagDime.tag.id][dimeDto.id]
    //             ).length === 0
    //           ) {
    //             isStrategyOk = false;
    //             break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // End 所有角色策略必填验证
    // isStrategyOk = !_.isEmpty(strategy);
    // }

    // if (!isStrategyOk) {
    //   // 埋点
    //   reportNewApply({
    //     uri: 'new-apply',
    //     applyStatus: 0
    //   }).catch();

    //   message.destroy();
    //   message.warning(t('请编辑策略后，再提交申请！'));
    //   this.setState({
    //     btnLoading: false
    //   });
    //   return;
    // }
    // }

    // console.log('测测测测试',dispatch({
    //   type: 'newApply/addApply',
    // }));
    dispatch({
      type: 'newApply/addApply'
    }).then(({ success, result, error }) => {
      // console.log(success, result);
      message.destroy();
      if (success) {
        // 埋点
        reportNewApply({
          uri: 'new-apply',
          applyStatus: 1
        }).catch();

        // 侧边栏我的审批count进行刷新
        dispatch({
          type: 'approveList/fetchApprove2',
          payload: { size: 0 }
        });

        // 提示成功，2秒后，跳转走
        message.success(t('提交成功'), 5, () => {
          dispatch(routerRedux.push(`${MAIN}/apply`));
          dispatch({
            type: 'newApply/reset'
          });
        });
        // message.success(t('提交成功'))
        // dispatch(
        //   routerRedux.push(`${MAIN}/apply`),
        // );
        // dispatch({
        //   type: 'newApply/reset',
        // });
      } else {
        // 埋点
        reportNewApply({
          uri: 'new-apply',
          applyStatus: 0
        }).catch();

        // 由于无法确定返回数据类型，认为JSON.parse异常即为普通字符串
        try {
          // console.log('我是result',result);
          const {
            bpmExceptionType,
            appName,
            applyUserNameZh,
            isBPM,
            processInstanceId,
            traceId,
            errorMessage
          } = JSON.parse(result);
          // console.log('申请的流程');
          function genContent() {
            return (
              <div>
                <p>
                  {bpmExceptionType == 1 ? (
                    <span>
                      <b>{appName}</b>审批流出现问题
                    </span>
                  ) : (
                    <span>
                      <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                    </span>
                  )}
                </p>
                {bpmExceptionType == 1 ? (
                  <div>
                    问题反馈信息：
                    <p>
                      {traceId}|{errorMessage}|{processInstanceId}
                    </p>
                    <p style={{ textAlign: 'right' }}>
                      <a
                        className="copy"
                        data-clipboard-text={
                          traceId + '|' + errorMessage + '|' + processInstanceId
                        }>
                        复制问题反馈信息
                      </a>
                    </p>
                    <b>
                      请复制问题反馈信息，并提供给
                      信息安全小助手，以便尽快解决该问题
                    </b>
                  </div>
                ) : null}
              </div>
            );
          }

          if (isBPM) {
            Modal.error({
              width: 780,
              centered: true,
              title:
                bpmExceptionType == 1 ? (
                  <span>{applyUserNameZh}，抱歉，检测到您的审批流出现异常</span>
                ) : (
                  '权限申请提交失败'
                ),
              content: genContent(),
              okText: t('确定')
            });

            if (!this.clipboard) {
              this.clipboard = new ClipboardJS('.copy');
            }
          } else {
            Modal.error({
              centered: true,
              title: t(result),
              content: (
                <span>
                  {t('详情请咨询')}
                  <a
                    href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                    target="_blank">
                    {t('信息安全小助手')}
                  </a>
                </span>
              ),
              okText: t('确定')
            });
          }
        } catch (error) {
          Modal.error({
            centered: true,
            title: (
              <div>
                {t(result.msg || result)}
                {error && result.data && result.data.length !== 0
                  ? result.data.map(item => {
                      return (
                        <a
                          key={item.username}
                          target="_blank"
                          href={
                            'https://im.xiaojukeji.com/contact?name=' +
                            item.username
                          }>
                          {' '}
                          {item.usernameZh}{' '}
                        </a>
                      );
                    })
                  : null}
              </div>
            ),
            content: (
              <span>
                {t('详情请咨询')}
                <a
                  href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                  target="_blank">
                  {t('信息安全小助手')}
                </a>
              </span>
            ),
            okText: t('确定')
          });
        }
      }
      this.setState({
        btnLoading: false
      });
    });
  };

  checkHavingPermission = () => {
    const { permissions } = this.state;

    const hasPermission = permissions.length > 0;
    if (!hasPermission) {
      this.setPermissionsHelp(1);
    }

    return hasPermission;
  };

  validatePermissions = () => {
    const { permissions } = this.state;

    const hasPermission = this.checkHavingPermission();
    let isValid = hasPermission;

    if (hasPermission) {
      const validStatusArr = this.getInvalidPermissions(permissions);
      isValid = validStatusArr.length === 0;
      if (!isValid) {
        this.setPermissionsHelp(
          t('请修改第{{ num }}条信息', { num: validStatusArr.join(',') })
        );
      }
    }

    return isValid;
  };

  validateForm = (isValid, success) => {
    const {
      form: { validateFields },
      params: { groupType },
      userInfo
    } = this.props;
    const { permissions } = this.state;
    validateFields((err, { expireAt, groups, reason }) => {
      if (!err && isValid) {
        success(
          userInfo.username,
          typeEnum[groupType],
          groups,
          new Date(expireAt.toDate()).getTime(),
          reason,
          permissions
        );
      }
    });
  };

  validateWorkflowForm = (isValid, success) => {
    const {
      form: { validateFields },
      params: { groupType },
      userInfo
    } = this.props;
    const { permissions } = this.state;
    validateFields(['username', 'appId', 'groups'], (err, { groups }) => {
      if (!err && isValid) {
        success(userInfo.username, typeEnum[groupType], groups, permissions);
      }
    });
  };

  submitApply = (
    username,
    type,
    groupIds,
    expireAt,
    reason,
    customPrivileges
  ) => {
    const { dispatch, t } = this.props;

    let permissions = [];

    customPrivileges.forEach(item => {
      if (item.params.namespace && item.params.namespace.map) {
        permissions = permissions.concat(
          item.params.namespace.map(nsItem => ({
            ...item,
            params: {
              ...item.params,
              namespace: nsItem
            }
          }))
        );
      } else {
        permissions = permissions.concat(item);
      }
    });

    const action = {
      type: 'newApply/monitorApply',
      payload: {
        username,
        type,
        groupIds: groupIds || [],
        expireAt,
        reason,
        customPrivileges: permissions || []
      }
    };
    dispatch(action).then(() => {
      message.success(t('申请成功'), 2, () => {
        this.setState(defaultState);
        dispatch(routerRedux.push(`${MAIN}/apply`));
        dispatch({
          type: 'newApply/reset'
        });
      });
    });
  };

  handleMonitorSubmit = () => {
    const {
      params: { groupType }
    } = this.props;
    const isValid = groupType === 1 ? this.validatePermissions() : true;
    this.validateForm(isValid, this.submitApply);
  };

  /**
   * 表单提交逻辑
   */
  onSubmit = e => {
    e.preventDefault();
    const {
      form,
      params,
      resourceTypeList,
      params: { appId }
    } = this.props;

    if (isMonitorSysId(appId)) {
      this.handleMonitorSubmit();
      return;
    }
    // if (form.getFieldValue('resourceType') == getIdByIdentifying(resourceTypeList, 'role')) {//角色申请
    //   const businessId =  params.resource[0].businessId || this.getBusinessId();
    //   form.setFieldsValue({
    //     businessId: businessId * 1
    //   });
    // }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          btnLoading: true
        });
        trackEvent(APPLY_PAGE_VIEW_SUBMIT);
        const { expireTime, ...others } = values;
        this.handleSubmit({
          expireTime: expireTime.valueOf(),
          ...others
        });
      } else {
        // 埋点
        reportNewApply({
          uri: 'new-apply',
          applyStatus: 0
        }).catch();
      }
    });
  };

  handleCheckMonitorWorkFlow = () => {
    const {
      params: { groupType }
    } = this.props;
    const isValid = groupType === 1 ? this.validatePermissions() : true;
    this.validateWorkflowForm(isValid, this.checkMonitorWorkFlow);
  };

  checkMonitorWorkFlow = (username, type, groupIds, customPrivileges) => {
    const { dispatch } = this.props;

    let permissions = [];

    customPrivileges.forEach(item => {
      if (item.params.namespace && item.params.namespace.map) {
        permissions = permissions.concat(
          item.params.namespace.map(nsItem => ({
            ...item,
            params: {
              ...item.params,
              namespace: nsItem
            }
          }))
        );
      } else {
        permissions = permissions.concat(item);
      }
    });

    const action = {
      type: 'newApply/fetchMonitorWorkflow',
      payload: {
        username,
        type,
        groupIds,
        customPrivileges: permissions || []
      }
    };
    dispatch(action).then(() => {
      this.setState({
        modalVisiable: true
      });
    });
  };

  // 显示审批流程弹窗
  handleCheckWorkflow = () => {
    const { t, params, userInfo, resourceTypeList } = this.props;
    const { username, isApplyForOthers, resourceType } = params;
    // 未选权限类型，不让预览审批流
    if (!resourceType || !resourceType.length) {
      message.destroy();
      message.warning(t('还没有选择要申请的资源'));
      return;
    }
    // 未填申请人，不让预览审批流
    if (isApplyForOthers && _.isEmpty(username)) {
      message.destroy();
      message.warning(t('还没有填写申请人'));
      return;
    }
    let workflowItems = [];
    for (let rt of resourceType) {
      const applyTypeIsRole = rt == 'role';
      const applyTypeIsFlag = rt == 'flag';
      const applyTypeIsArea = rt == 'area';
      if (applyTypeIsRole) {
        if (_.isEmpty(params.resource_role)) {
          message.warning(t('还没有选择要申请的角色'));
          return;
        }
      } else if (applyTypeIsArea) {
        if (params.businessId === '') {
          message.warning(t('还没有选择要申请的业务线'));
          return;
        }
        if (_.isEmpty(params[`resource_${rt}`])) {
          message.warning(t('还没有选择要申请的地区'));
          return;
        }
      } else if (applyTypeIsFlag) {
        if (_.isEmpty(params[`resource_${rt}`])) {
          message.warning(t('还没有选择要申请的标识位'));
          return;
        }
      } else {
        if (_.isEmpty(params[`resource_${rt}`])) {
          message.warning(t('还没有选择要申请的资源'));
          return;
        }
      }

      if (isApplyForOthers) {
        //批量申请，username:[{key,label}]
        for (let usernameItem of username) {
          workflowItems.push({
            username: usernameItem.label,
            resourceType: rt
          });
        }
      } else {
        workflowItems.push({
          username: userInfo.username,
          resourceType: rt
        });
      }
    }
    this.setState(
      {
        workflowItems,
        modalVisiable: true
      },
      () => {
        if (this.state.workflowItems.length === 1) {
          this.setState(
            {
              activeKeysOnCollapse: ['0']
            },
            () => {
              this.getWorkflow();
            }
          );
        }
      }
    );
  };

  // 获取审批流程，并打开审批流的弹窗
  handleFetchWorkflow = () => {
    const { params, dispatch, userInfo, t, resourceTypeList } = this.props;
    const {
      appId,
      username,
      isApplyForOthers,
      resourceType,
      resource
    } = params;
    const fetchWorkflowPayload = [];
    let showworkflow = true;

    // 未选权限类型，不让预览审批流
    if (!resourceType || !resourceType.length) {
      message.destroy();
      message.warning(t('还没有选择要申请的资源'));
      showworkflow = false;
      return;
    }
    // 未填申请人，不让预览审批流
    if (isApplyForOthers && _.isEmpty(username)) {
      message.destroy();
      message.warning(t('还没有填写申请人'));
      return;
    }

    _.each(resourceType, rt => {
      const applyTypeIsRole = rt == 'role';
      const applyTypeIsFlag = rt == 'flag';
      const applyTypeIsArea = rt == 'area';

      // 如果是代申请
      let usernames = [];
      if (isApplyForOthers) {
        usernames = username.map(item => {
          return item.label;
        });
      }
      if (applyTypeIsRole) {
        if (_.isEmpty(params.resource_role)) {
          message.destroy();
          message.warning(t('还没有选择要申请的角色'));
          showworkflow = false;
          return;
        }
        // dispatch({
        //   type: 'newApply/fetchWorkflow',
        //   payload: {
        //     appId,
        //     role: params.resource_role,
        //     username: isApplyForOthers ? username : userInfo.username,
        //   }
        // }).then(() => {
        //   this.setState({
        //     modalVisiable: true,
        //   });
        // });

        fetchWorkflowPayload.push({
          type: rt,
          appId,
          role: params.resource_role,
          username: isApplyForOthers ? usernames : userInfo.username
        });
      } else if (applyTypeIsArea) {
        fetchWorkflowPayload.push({
          type: 'area',
          resource: params.resource_area,
          appId,
          applyTypeIsArea,
          username: isApplyForOthers ? usernames : userInfo.username
        });
      } else {
        if (_.isEmpty(params[`resource_${rt}`])) {
          message.destroy();
          message.warning(t('还没有选择要申请的资源'));
          showworkflow = false;
          return;
        }
        // dispatch({
        //   type: 'newApply/fetchWorkflow',
        //   payload: {
        //     appId, resource:params[`resource_${rt}`],
        //     applyTypeIsFlag,
        //     username: isApplyForOthers ? username : userInfo.username,
        //   }
        // }).then(() => {
        //   this.setState({
        //     modalVisiable: true,
        //   });
        // });
        fetchWorkflowPayload.push({
          type: rt,
          appId,
          resource: params[`resource_${rt}`],
          applyTypeIsFlag,
          username: isApplyForOthers ? usernames : userInfo.username
        });
      }
    });
    if (showworkflow) {
      dispatch({
        type: 'newApply/fetchWorkflowGroup',
        payload: fetchWorkflowPayload
      }).then(({ success, result }) => {
        if (success) {
          this.setState({
            modalVisiable: true
          });
        } else {
          try {
            const {
              bpmExceptionType,
              appName,
              applyUserNameZh,
              isBPM,
              processInstanceId,
              traceId,
              errorMessage
            } = JSON.parse(result);

            function genContent() {
              return (
                <div>
                  <p>
                    {bpmExceptionType == 1 ? (
                      <span>
                        <b>{appName}</b>审批流出现问题
                      </span>
                    ) : (
                      <span>
                        <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                      </span>
                    )}
                  </p>
                  {bpmExceptionType == 1 ? (
                    <div>
                      问题反馈信息：
                      <p>
                        {traceId}|{errorMessage}|{processInstanceId}
                      </p>
                      <p style={{ textAlign: 'right' }}>
                        <a
                          className="copy"
                          data-clipboard-text={
                            traceId +
                            '|' +
                            errorMessage +
                            '|' +
                            processInstanceId
                          }>
                          复制问题反馈信息
                        </a>
                      </p>
                      <b>
                        请复制问题反馈信息，并提供给
                        信息安全小助手，以便尽快解决该问题
                      </b>
                    </div>
                  ) : null}
                </div>
              );
            }

            if (isBPM) {
              Modal.error({
                width: 780,
                centered: true,
                title:
                  bpmExceptionType == 1 ? (
                    <span>
                      {applyUserNameZh}，抱歉，检测到您的审批流出现异常
                    </span>
                  ) : (
                    '审批流预览失败'
                  ),
                content: genContent(),
                okText: t('确定')
              });

              if (!this.clipboard) {
                this.clipboard = new ClipboardJS('.copy');
              }
            } else {
              Modal.error({
                centered: true,
                title: result,
                content: (
                  <span>
                    {t('详情请咨询')}
                    <a
                      href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                      target="_blank">
                      {t('信息安全小助手')}
                    </a>
                  </span>
                ),
                okText: t('确定')
              });
            }
          } catch (error) {
            Modal.error({
              centered: true,
              title: result,
              content: (
                <span>
                  {t('详情请咨询')}
                  <a
                    href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                    target="_blank">
                    {t('信息安全小助手')}
                  </a>
                </span>
              ),
              okText: t('确定')
            });
          }
        }
      });
    }
  };

  // 关闭审批流的弹窗
  hideWorkflow = () => {
    this.setState({
      activeKeysOnCollapse: [],
      modalVisiable: false
    });
  };
  // 根据所选的系统渲染表单项
  renderItems = () => {
    const { form, resourceTypeObj } = this.props;
    const resourceType = form.getFieldValue('resourceType') || [];
    return (
      <div>
        {resourceType.map(type => {
          switch (type) {
            case 'role':
              return this.renderRole(type);
            case 'area':
              return this.renderArea(type);
            case 'bigdata_report':
              return this.renderReport(type);
            case 'flag':
              return this.renderFlag(type);
            case 'woater_monitor':
              return this.renderWoaterRealtime(type);
            default:
              return this.renderDefault(type);
          }
        })}
      </div>
    );
  };

  /**
   * 渲染标识相关的表单项
   */
  renderFlag = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    const formItemLayout2 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    const { recommandFlags } = this.state;
    const { t } = this.props;
    return (
      <div key={type}>
        {recommandFlags.length ? (
          <FormItem {...formItemLayout2} label={t('猜你想要的标识位')}>
            {recommandFlags.map(item => (
              <Button
                style={{ marginRight: '2px' }}
                key={item.id}
                onClick={() => this.handleRecommendFlag(item)}>{`${
                item.nameZh
              }（${item.riskLevel || '-'})`}</Button>
            ))}
            <Tooltip
              title={t(
                '根据您最近的鉴权记录和岗位信息为您推荐可能想要申请的标识位'
              )}>
              <Icon className="apply-recommend-icon" type="question-circle-o" />
            </Tooltip>
          </FormItem>
        ) : null}
        {this.getTableItem(config)}
      </div>
    );
  };

  /**
   * 渲染角色相关的表单项
   */
  renderRole = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    const formItemLayout2 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    const { recommandRoles } = this.state;
    const { t } = this.props;

    function renderPopover(item) {
      return (
        <Form style={{ width: '180px' }}>
          {item.labelName.length > 0 ? (
            <FormItem style={{ marginBottom: 0 }} label={t('分类')}>
              {item.labelName.join(', ')}
            </FormItem>
          ) : null}
          <FormItem style={{ marginBottom: 0 }} label={t('描述')}>
            {item.description}
          </FormItem>
        </Form>
      );
    }

    return (
      <div key={type}>
        {recommandRoles.length ? (
          <FormItem {...formItemLayout2} label={t('猜你想要的角色')}>
            {recommandRoles.map(item => {
              if (item.labelName.length > 0 || item.description)
                return (
                  <Popover
                    placement="top"
                    content={renderPopover(item)}
                    key={item.id}>
                    <Button
                      style={{ marginRight: '2px' }}
                      key={item.id}
                      onClick={() => this.handleRecommendRole(item)}>{`${
                      item.nameZh
                    }（${item.riskLevel || '-'})`}</Button>
                  </Popover>
                );
              return (
                <Button
                  style={{ marginRight: '2px' }}
                  key={item.id}
                  onClick={() => this.handleRecommendRole(item)}>{`${
                  item.nameZh
                }（${item.riskLevel || '-'})`}</Button>
              );
            })}
            <Tooltip
              title={t(
                '根据您最近的鉴权记录和岗位信息为您推荐可能想要申请的角色'
              )}>
              <Icon className="apply-recommend-icon" type="question-circle-o" />
            </Tooltip>
          </FormItem>
        ) : null}
        {this.getRoleLabel()}
        {this.getTableItem(config)}
        {this.getStrategyFormItem()}
      </div>
    );
  };

  /**
   * 渲染地区相关的表单项
   */
  renderArea = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    return <div key={type}>{this.getAreaTableItem(config)}</div>;
  };

  /**
   * 渲染报表相关的表单项
   */
  renderReport = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    return (
      <div key={type}>
        {this.getTableItem(config)}
        {/* {this.getRegionItem()} */}
        {/* {this.getAreasItem()} */}
        {/* {this.getOpt()} */}
      </div>
    );
  };

  /**
   * 滴滴数据平台，报表选择后提示
   */
  getReportHint = type => {};

  /**
   * 渲染 woater 实时监控
   */
  renderWoaterRealtime = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    return (
      <div key={type}>
        {this.getTableItem(config)}
        {/* {this.getRegionItem()}
        {this.getAreasItem()}
        {this.getOpt()} */}
      </div>
    );
  };

  /**
   * 渲染默认的表单项
   */
  renderDefault = type => {
    const config = {
      resourceTypeId: type,
      labelName: this.getTableLabelName(type)
    };
    return <div key={type}>{this.getTableItem(config)}</div>;
  };

  /**
   * 根据权限类型，返回表单项的label名
   */
  getTableLabelName = resourceType => {
    const { t, resourceTypeList } = this.props;
    let name = null;
    for (let i = 0, len = resourceTypeList.length; i < len; i++) {
      if (resourceTypeList[i].identifying == resourceType) {
        let temp = (resourceTypeList[i].name + '').split('-');
        name = temp[temp.length - 1];
        break;
      }
    }
    // return t(name) + t('选择');
    return t(name);
  };

  /**
   * 权限选择-表格
   */
  getTableItem = config => {
    const {
      form,
      t,
      resourceList,
      resourceTypeList,
      params,
      allBusiness,
      history
    } = this.props;

    const { appId } = params;
    const { getFieldDecorator } = form;

    // if (_.isEmpty(resourceList)) {
    //   return null;
    // }

    const goRoleTool = () => {
      trackEvent(APPLY_PAGE_VIEW_ROLE);
      history.push(`/upm2-static/main/tools?appId=${appId}`);
    };
    // 角色工具提示
    let RoleTip = null;
    if (config.resourceTypeId === 'role') {
      RoleTip = (
        <Col offset={6}>
          <div className="role-tool-tip">
            {t('不知道选什么角色？试试')}{' '}
            <a href="javascript:;" onClick={goRoleTool}>
              {t('角色定位工具')}
            </a>
          </div>
        </Col>
      );
    }

    let ReportTip = null;
    if (
      config.resourceTypeId === 'bigdata_report' &&
      this.state.ifShowBigdataReportHint
    ) {
      ReportTip = (
        <Col offset={6}>
          <div
            style={{ color: 'rgb(255, 0, 0)' }}
            className="bigdata-report-tip">
            {this.state.bigdataReportHint}
          </div>
        </Col>
      );
    }

    // console.log('getFieldsValue', form.getFieldsValue())

    return (
      <React.Fragment>
        <FormItem {...formItemLayout2} label={config.labelName}>
          {getFieldDecorator(`resource_${config.resourceTypeId}`, {
            rules: [{ required: true }]
          })(
            <TableSelector
              title={config.labelName}
              handleResourceTypeChange={this.handleResourceTypeChange}
              roleType={this.state.roleType}
              roleLabelList={this.props.roleLabelList}
              siteList={this.props.siteList}
              resource={params.resource}
              t={t}
              ref={this.setTextInputRef}
              appId={appId}
              resourceList={resourceList}
              resourceTypeList={resourceTypeList}
              resourceTypeId={config.resourceTypeId}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              handleChange={this.needShowArea(config.resourceTypeId)}
              mask={true}
              allBusiness={allBusiness}
              projectList={this.props.projectList}
              handleFetchProjectList={this.handleFetchProjectList}
              isPackage={config.resourceTypeId === 'role'}
              onChange={
                config.resourceTypeId == 'role' ? this.tableChange : null
              }
            />
          )}
        </FormItem>
        {RoleTip}
        {ReportTip}
      </React.Fragment>
    );
  };

  /**
   * 权限选择-地区
   */
  getAreaTableItem = config => {
    const {
      form,
      t,
      resourceList,
      resourceTypeList,
      params,
      allBusiness
    } = this.props;
    const { appId } = params;
    const { getFieldDecorator } = form;

    // if (_.isEmpty(resourceList)) {
    //   return null;
    // }
    // 如果是地区则显示地区列表项
    return (
      <div>
        {/* <FormItem {...formItemLayout2} label={t('业务线名称')}>
        <Select
          value={this.state.businessId}
          showSearch
          optionFilterProp="children"
          onChange={this.handleBusinessChange}
          style={{width: '100%'}}
          allowClear
        >
          {this.props.appbindedbusiness.map((bus) => (
            <Option
              key={bus.id}
              value={bus.id}
            >
              {bus.name}
            </Option>
          ))}
        </Select>
      </FormItem> */}
        <FormItem {...formItemLayout2} label={t('业务线名称')}>
          {getFieldDecorator('businessId', {
            rules: [{ required: true }]
          })(
            <Select
              // value={this.state.businessId}
              showSearch
              optionFilterProp="children"
              onChange={this.handleBusinessChange}
              style={{ width: '100%' }}>
              {this.props.appbindedbusiness.map(bus => (
                <Option key={bus.id} value={bus.id}>
                  {bus.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout2} label={t('地区')}>
          {getFieldDecorator(`resource_${config.resourceTypeId}`, {
            rules: [{ required: true }]
          })(
            <TreeSelect
              filterTreeNode={(inputValue, TreeNode) =>
                TreeNode.props.title.indexOf(inputValue) != -1
              }
              treeData={this.state.treeData}
              showSearch={true}
              onChange={this.onAreaChange}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
          )}
        </FormItem>

        {/* <FormItem {...formItemLayout2} label={t('已有地区')} >
        {getFieldDecorator('hasAreas', {
        })(
          <Input
            disabled={true}
            mode='tags'
            style={{ width: '100%' }}
          >
          </Input>
        )}
      </FormItem> */}
      </div>
    );
  };

  getBamaiPermissionSelect = (permissionItem, index) => {
    const { t, bamaiRoleList } = this.props;
    const { permissionValidateStatus } = this.state;
    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('role')]
            ]
          }>
          <Select
            showSearch
            optionFilterProp="children"
            size="small"
            className="select"
            placeholder={t('请选择')}
            value={permissionItem.params.role}
            onChange={value => this.handleChangeLevel(value, 'role', index)}>
            {bamaiRoleList && this.bamaiRoleOptions}
          </Select>
        </FormItem>
      </React.Fragment>
    );
  };

  getWoaterPermissionSelect = (permissionItem, index) => {
    const { t, woaterRoleList, woaterRegionTree } = this.props;
    const { permissionValidateStatus } = this.state;
    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('role')]
            ]
          }>
          <Select
            showSearch
            optionFilterProp="children"
            size="small"
            className="select"
            key="woaterlist"
            placeholder={t('请选择')}
            onChange={value => this.handleChangeLevel(value, 'role', index)}>
            {woaterRoleList && this.woatorRoleOptions}
          </Select>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('权限地区')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('region')]
            ]
          }>
          <TreeSelect
            showSearch
            treeNodeFilterProp="title"
            key="woatertree"
            value={permissionItem.params.region}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={t('请选择')}
            size="small"
            source={woaterRegionTree}
            nodeValue="id"
            nodeTitle="name"
            className="select"
            onChange={value => this.handleChangeLevel(value, 'region', index)}>
            {woaterRegionTree && this.woatorRegionNodes}
          </TreeSelect>
        </FormItem>
      </React.Fragment>
    );
  };

  getOdinPermissionSelect = (permissionItem, index) => {
    const { t, odinRoles } = this.props;
    const { odinApproverLists, permissionValidateStatus } = this.state;
    return (
      <React.Fragment>
        <FormItem
          {...permissionLayout}
          label={t('NS')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('namespace')]
            ]
          }>
          <div
            className="odin_ns_select_container"
            onClick={e => {
              if (!hasClass(e.target, 'ant-select-selection__choice__remove')) {
                this.handleNSSelectClick(index);
              }
            }}>
            <Select
              size="small"
              mode="multiple"
              placeholder={t('请选择')}
              className="select"
              value={permissionItem.params.namespace}
              onChange={value => this.handleNSModalOK(value, index)}
              open={false}></Select>
            {/* <NsSelect></NsSelect> */}
            {/* <div
              className="odin_ns_select_mask"
              onClick={() => handleNSSelectClick(index)}
            ></div> */}
          </div>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('权限角色')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('role')]
            ]
          }>
          <Select
            size="small"
            className="select"
            placeholder={t('请选择')}
            key="odinlist"
            value={permissionItem.params.role}
            onChange={value => this.handleChangeLevel(value, 'role', index)}>
            {odinRoles && this.odinRoleOptions}
          </Select>
        </FormItem>
        <FormItem
          {...permissionLayout}
          label={t('审批人')}
          validateStatus={
            validateStatusEnum[
              permissionValidateStatus[index][levelEnum.indexOf('approver')]
            ]
          }>
          <Select
            allowClear
            showSearch
            size="small"
            className="select"
            placeholder={t('请选择')}
            key="odinApproverLists"
            value={permissionItem.params.approver}
            onChange={value =>
              this.handleChangeLevel(value, 'approver', index)
            }>
            {odinApproverLists &&
              odinApproverLists[index] &&
              odinApproverLists[index].map &&
              odinApproverLists[index].map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
          </Select>
        </FormItem>
      </React.Fragment>
    );
  };

  getPermissionSelect = (permissionItem, index) => {
    const { t, sysList } = this.props;
    const getMap = {
      182: this.getOdinPermissionSelect,
      685: this.getWoaterPermissionSelect,
      302: this.getBamaiPermissionSelect
    };
    return (
      <div key={index} gutter={24} className="permission">
        <FormItem {...permissionLayout} label={t('系统名称')}>
          <Select
            size="small"
            value={permissionItem.sysId}
            onChange={value => this.handleChangeSys(value, index)}>
            {sysList && this.sysOptions}
          </Select>
        </FormItem>
        {getMap[permissionItem.sysId](permissionItem, index)}
        <Icon
          className="close"
          onClick={() => this.handleClickDelete(index)}
          type="close"
        />
      </div>
    );
  };

  getGroupType = () => {
    const {
      form,
      t,
      groupList,
      params: { groupType }
    } = this.props;
    const { permissions, help, nstreeModelIndex } = this.state;
    const options = {
      name: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: t('请输入权限组名称')
          }
        ]
      },
      description: {
        initialValue: ''
      },
      groups: {
        initialValue: [],
        rules: [
          {
            required: true,
            message: t('请选择权限组')
          }
        ]
      },
      expireAt: {
        initialValue: null,
        rules: [
          {
            required: true,
            message: t('请选择失效日期')
          }
        ]
      },
      reason: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: t('请输入申请理由')
          }
        ]
      }
    };
    const { getFieldDecorator } = form;
    if (groupType === 0) {
      return (
        <FormItem {...formItemLayout2} label={t('申请权限组')}>
          {getFieldDecorator('groups', options.groups)(
            <Select mode="multiple" showSearch optionFilterProp="children">
              {groupList && this.groupOptions}
            </Select>
          )}
        </FormItem>
      );
    } else {
      return (
        <FormItem
          required
          help={help}
          {...formItemLayout3}
          label={t('定义权限组')}>
          <Card className="card">
            <p className="tip">
              {t(
                '权限组是 ODIN、ODIN SRM、Woator 实时监控、TPCC 工单监控、把脉的聚合权限。'
              )}
            </p>
            <div className="customContainer">
              {permissions &&
                permissions.map &&
                permissions.map((permissionItem, index) => {
                  return this.getPermissionSelect(permissionItem, index);
                })}
              <Button
                type="primary"
                className="add"
                ghost
                onClick={this.handleClickAdd}>
                {t('新增')}
              </Button>
            </div>

            <NSTreeSelect
              visible={
                typeof nstreeModelIndex === 'number' && nstreeModelIndex !== -1
              }
              onOk={this.handleNSModalOK}
              onCancel={this.handleNSModalCancel}
              value={
                permissions[nstreeModelIndex] &&
                permissions[nstreeModelIndex].params.namespace
              }
            />
          </Card>
        </FormItem>
      );
    }
  };

  getForm = () => {
    const {
      form,
      t,
      // i18n,
      resourceTypeList,
      params: { appId, groupType } // 当前选择系统的一些信息
    } = this.props;
    // const { language } = i18n;
    const options = {
      name: {
        rules: [
          {
            required: true,
            message: t('请输入权限组名称')
          }
        ]
      },
      description: {},
      expireAt: {
        initialValue: moment().add(1, 'year'),
        rules: [
          {
            required: true,
            message: t('请选择失效日期')
          }
        ]
      },
      reason: {
        rules: [
          {
            required: true,
            message: t('请输入申请理由')
          }
        ]
      }
    };
    let isOpenSystem = true;
    let sysName = '';
    if (this.props.params.appId) {
      const appId = this.props.params.appId;
      const selectedSystem = this.props.apps.find(item => {
        return item.appId === appId;
      });

      // 判断是否未开放申请
      if (selectedSystem && selectedSystem.isOpenApply == 2) {
        isOpenSystem = false;
        sysName = selectedSystem.appName || '';
      }
    }

    const { getFieldDecorator, getFieldValue } = form;
    // if (isMonitorSysId(appId)) {
    //   return (
    //     <React.Fragment>
    //       <FormItem {...formItemLayout2} label={t('申请类型')}>
    //         {getFieldDecorator('groupType', {
    //           rules: [
    //             {
    //               required: true
    //             }
    //           ],
    //           initialValue: groupType
    //         })(
    //           <Select onChange={this.handleGroupTypeChange}>
    //             <Select.Option key={0} value={0}>
    //               {t('标准权限组')}
    //             </Select.Option>
    //             <Select.Option key={1} value={1}>
    //               {t('自定义权限组')}
    //             </Select.Option>
    //           </Select>
    //         )}
    //       </FormItem>

    //       {this.getGroupType()}

    //       <FormItem {...formItemLayout2} label={t('权限失效日期')}>
    //         {getFieldDecorator('expireAt', options.expireAt)(
    //           <DatePicker
    //             showToday={false}
    //             disabledDate={function(current) {
    //               return current && current < moment().endOf('day');
    //             }}></DatePicker>
    //         )}
    //       </FormItem>
    //       <FormItem {...formItemLayout2} label={t('申请理由')}>
    //         {getFieldDecorator('reason', options.reason)(
    //           <TextArea
    //             placeholder={t(
    //               '尽可能详细的说明申请理由，会提高审批通过率哦～'
    //             )}></TextArea>
    //         )}
    //       </FormItem>
    //       <FormItem wrapperCol={{ offset: 6 }}>
    //         <Col span={4}>
    //           <Button
    //             type="primary"
    //             className="new-apply-form-button"
    //             htmlType="submit"
    //             loading={this.state.btnLoading}>
    //             {t('提交')}
    //           </Button>
    //         </Col>
    //         <Col span={16}>
    //           <Button onClick={this.handleCheckMonitorWorkFlow}>
    //             {t('审批流预览')}
    //           </Button>
    //         </Col>
    //       </FormItem>
    //     </React.Fragment>
    //   );
    // } else {

    // 未开放申请
    if (!isOpenSystem || !this.state.isOpenSys) {
      sysName = sysName ? sysName : this.selectedSystem.sysName || '';
      const system = isOpenSystem
        ? this.selectedSystem
        : { appId: this.props.params.appId };
      return (
        <React.Fragment>
          <div className="unopen-system">
            <strong>{sysName}</strong>
            {t('系统未开放自助权限申请，请联系管理员进行授权。')}
          </div>
          <SysAdmin system={system} />
        </React.Fragment>
      );
    }

    let authTypeOptions = [];
    resourceTypeList.forEach(item => {
      // 滴滴数据平台，去掉标识位
      if (appId === 280 && item.identifying === 'flag') {
        return false;
      } else {
        authTypeOptions.push({
          label: t(item.name),
          value: item.identifying
        });
      }
    });

    //无可申请权限
    const isShow = form.getFieldsValue().appId;
    if (isShow != undefined && !resourceTypeList.length) {
      return (
        <React.Fragment>
          <div className="unopen-system">
            <SearchSysAdmin
              inline
              btnText={
                <span>
                  {t('系统暂无可申请权限，如需申请请咨询 ')}
                  <a href="" className="upm-warning">
                    {t('系统管理员')}
                  </a>
                </span>
              }
              placement="bottom"
              appId={appId}
              clearable={false}
              disabled>
              <span className="upm-warning">
                {t('注意：咨询前请先认真阅读右方申请说明')}
              </span>
            </SearchSysAdmin>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {resourceTypeList.length && getFieldValue('appId') ? (
          <div id="intro-step2">
            <FormItem
              {...formItemLayout2}
              label={t('申请的权限类型')}
              style={{ marginBottom: '0' }}>
              {getFieldDecorator('resourceType', {
                initialValue: [],
                rules: [required]
              })(
                // <Select onChange={this.handleResourceTypeChange}>
                //   {_.map(resourceTypeList, (rt, index) => {
                //     return (
                //       <Option key={index} value={rt.id}>
                //       {t(`${rt.name}`)}
                //       </Option>
                //     );
                //   })}
                // </Select>
                <CheckboxGroup
                  onChange={this.handleResourceTypeChange}
                  options={authTypeOptions}
                />
                // <Checkbox.Group style={{ width: '100%' }}>
                //   <Row>
                //     {_.map(resourceTypeList, (rt) => {
                //       return <Col span={8}><Checkbox value={rt.id+''}>{rt.name}</Checkbox></Col>
                //     })}
                //   </Row>
                // </Checkbox.Group>
              )}
              <div
                id="intro-step3"
                style={{ height: '40px', marginTop: '-12px' }}>
                <SearchSysAdmin
                  inline
                  btnText={
                    <span>
                      {t('不知道怎么选？咨询 ')}
                      <a href="" className="upm-warning">
                        {t('管理员')}
                      </a>
                    </span>
                  }
                  placement="bottom"
                  appId={appId}
                  clearable={false}
                  disabled>
                  <span className="upm-warning">
                    {t('注意：咨询前请先认真阅读右方申请说明')}
                  </span>
                </SearchSysAdmin>
              </div>
            </FormItem>
            {this.renderItems()}
          </div>
        ) : null}

        {/* {this.getRoleLabel()}
          {this.getTableSelectorItem(this.props.form.getFieldValue('resourceType')[0])}
          {this.getStrategyFormItem()} */}
        {/* {this.getRegionItem()}
          {this.getAreasItem()}
          {this.getOpt()} */}
        <div id="intro-step4">
          <FormItem {...formItemLayout2} label={t('权限的失效日期')}>
            {getFieldDecorator('expireTime', {
              rules: [
                {
                  required: true,
                  message: t('必填')
                }
              ]
              // initialValue: moment().add(1, 'year')
            })(
              <DatePicker
                style={{ width: '100%' }}
                showToday={false}
                disabledDate={function(current) {
                  return current && current < moment().endOf('day');
                }}
                // disabledDate={this.setDisabledDate}
              />
            )}
          </FormItem>
        </div>

        <div id="intro-step5">
          <FormItem {...formItemLayout2} label={t('申请理由')}>
            {getFieldDecorator('reason', {
              rules: [
                required,
                {
                  max: 100,
                  message: t('最大 100 个字符')
                }
              ]
            })(
              <TextArea
                rows={4}
                placeholder={t(
                  '尽可能详细的说明申请理由，会提高审批通过率哦～'
                )}
              />
            )}
          </FormItem>
        </div>

        <FormItem wrapperCol={{ offset: 6 }}>
          {/* <Col span={language === 'zhCN' ? 5 : 8}> */}
          <Button
            className="new-apply-form-button"
            onClick={this.handleCheckWorkflow}
            // onClick={this.handleFetchWorkflow}
          >
            {t('审批流预览')}
          </Button>
          {/* </Col> */}
          {/* <Col span={10}> */}
          <Button
            style={{ marginLeft: '12px' }}
            className="new-apply-form-button"
            type="primary"
            size="default"
            htmlType="submit"
            loading={this.state.btnLoading}>
            {t('提交')}
          </Button>
          {/* </Col> */}
        </FormItem>
      </React.Fragment>
    );
  };

  selectSystem = (value, option) => {
    const selectedSystem = this.props.apps.find(item => {
      return item.appId === value;
    });
    this.selectedSystem = selectedSystem;

    // console.log('selectedSystem', selectedSystem)

    // 未开放申请
    // if (this.selectedSystem.isLoginType === 2) {
    if (this.selectedSystem && this.selectedSystem.isOpenApply == 2) {
      this.setState({
        isOpenSys: false,
        hasFootprint: true
      });
    } else {
      // 已开放申请
      // 记录足迹
      footprintInstance.setData(this.selectedSystem);
      this.setState({
        isOpenSys: true,
        hasFootprint: true
      });
    }
  };
  getGroupOptions = (apps, label, needFootprint) => {
    let [...cloneApps] = apps;

    if (needFootprint) {
      let footprint = footprintInstance.getData();
      footprint.forEach(item => {
        // 删除重复项
        cloneApps.splice(cloneApps.findIndex(v => v.appId == item.appId), 1);
      });
    }

    // console.log('getGroupOptions', cloneApps)
    return (
      <OptGroup label={label}>
        {this.getOptions(cloneApps, 'appId', 'appName')}
      </OptGroup>
    );
  };

  getRecommand = (isStatic = false) => {
    if (window.location.pathname !== '/upm2-static/main/newapply') {
      return;
    }
    if (isStatic) {
      return Promise.resolve().then(() => {
        this.setState({
          recommand: {
            recommandVis: { display: 'block' },
            recommandList: [{ id: GUIDE_DATA.appId, name: '滴滴数据平台' }]
          }
        });
      });
    }

    return request('/v2/data/recommend').then(res => {
      if (res && res.length > 0) {
        this.setState({
          recommand: {
            recommandVis: { display: 'block' },
            recommandList: res
          }
        });
      }
    });
  };
  recommandHandler = appId => {
    if (!this.props.apps) {
      return;
    }
    this.topAppChange(appId);
  };
  topAppChange = appId => {
    this.props.dispatch({
      type: 'newApply/updateParams',
      payload: { appId }
    });
    this.selectSystem(appId);
    this.changeAppId(appId);
    // this.refselect.blur();
    document.querySelectorAll('input').forEach(i => {
      i.blur();
    });
  };

  /**
   * 处理推荐角色的点击事件
   */
  handleRecommendRole = role => {
    const { params, dispatch } = this.props;
    const { id: value, nameZh: label, isGroup, riskLevel, businessId } = role;

    // 已经选中，直接返回
    if (params.resource_role && _.find(params.resource_role, ['value', value]))
      return;

    const _roles = params.resource_role || [];
    const roles = _.uniqBy(
      _roles.concat({
        value,
        label,
        key: value,
        isGroup,
        riskLevel,
        businessId
      }),
      'value'
    );
    // 更新申请modle
    dispatch({
      type: 'newApply/updateParams',
      payload: {
        resource_role: roles
      }
    });
    // 获取策略
    dispatch({
      type: 'newApply/fetchStrategyList',
      payload: { role: roles }
    });
  };

  handleRecommendFlag = flag => {
    const { params, dispatch } = this.props;
    const { id: value, nameZh: label, isGroup, riskLevel } = flag;

    // 已经选中，直接返回
    if (params.resource_flag && _.find(params.resource_flag, ['value', value]))
      return;

    const _flags = params.resource_flag || [];
    const flags = _.uniqBy(
      _flags.concat({ value, label, key: value, isGroup, riskLevel }),
      'value'
    );

    // 更新申请modle
    dispatch({
      type: 'newApply/updateParams',
      payload: {
        resource_flag: flags
      }
    });
  };

  setBatchForUserSelector = flag => {
    if (flag) {
      this.usernameCache = this.props.form.getFieldValue('username') || [];
      this.props.form.setFieldsValue({
        username: []
      });
    } else {
      this.props.form.setFieldsValue({
        username: this.usernameCache
      });
      this.usernameCache = [];
    }
    this.props.dispatch({
      type: 'newApply/save',
      payload: { isBatchForUserSelector: flag }
    });
  };
  handleConfirmForUserSelectorBatch = () => {
    this.userSelectorBatch.handleConfirm();
  };
  handleUsernameCheck = (rule, value, callback) => {
    if (Array.isArray(value) && value.length === 0) {
      callback('必填');
    } else if (value == -1) {
      callback('部分信息错误或不存在，请检查');
    } else if (value == -2) {
      callback('批量信息尚未验证，请验证');
    } else {
      callback();
    }
  };

  handleChangeOnCollapse = activeKeys => {
    this.setState(
      {
        activeKeysOnCollapse: activeKeys.slice(-1)
      },
      () => {
        this.getWorkflow();
      }
    );
  };
  getWorkflow = () => {
    const { t } = this.props;
    const { activeKeysOnCollapse, workflowItems } = this.state;
    if (activeKeysOnCollapse.length > 0) {
      // 打开折叠板
      let index = parseInt(activeKeysOnCollapse[0]);
      if (!workflowItems[index].workflowInfos) {
        let newWorkflowItems = _.cloneDeep(workflowItems);
        this.props
          .dispatch({
            type: 'newApply/fetchWorkflowForecast',
            payload: { workflowItem: workflowItems[index] }
          })
          .then(({ success, result }) => {
            if (success) {
              const { code, data, msg } = result;
              if (code === 200) {
                newWorkflowItems[index].workflowInfos = data[0].workflowInfos;
              } else {
                newWorkflowItems[index].workflowInfos = msg;
              }
              this.setState({
                workflowItems: newWorkflowItems
              });
            } else {
              // 由于无法确定返回数据类型，认为JSON.parse异常即为普通字符串
              try {
                // console.log('我是result',result);
                const {
                  bpmExceptionType,
                  appName,
                  applyUserNameZh,
                  isBPM,
                  processInstanceId,
                  traceId,
                  errorMessage
                } = JSON.parse(result);
                // console.log('申请的流程');
                function genContent() {
                  return (
                    <div>
                      <p>
                        {bpmExceptionType == 1 ? (
                          <span>
                            <b>{appName}</b>审批流出现问题
                          </span>
                        ) : (
                          <span>
                            <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                          </span>
                        )}
                      </p>
                      {bpmExceptionType == 1 ? (
                        <div>
                          问题反馈信息：
                          <p>
                            {traceId}|{errorMessage}|{processInstanceId}
                          </p>
                          <p style={{ textAlign: 'right' }}>
                            <a
                              className="copy"
                              data-clipboard-text={
                                traceId +
                                '|' +
                                errorMessage +
                                '|' +
                                processInstanceId
                              }>
                              复制问题反馈信息
                            </a>
                          </p>
                          <b>
                            请复制问题反馈信息，并提供给
                            信息安全小助手，以便尽快解决该问题
                          </b>
                        </div>
                      ) : null}
                    </div>
                  );
                }

                if (isBPM) {
                  Modal.error({
                    width: 780,
                    centered: true,
                    title:
                      bpmExceptionType == 1 ? (
                        <span>
                          {applyUserNameZh}，抱歉，检测到您的审批流出现异常
                        </span>
                      ) : (
                        '权限申请提交失败'
                      ),
                    content: genContent(),
                    okText: t('确定')
                  });

                  if (!this.clipboard) {
                    this.clipboard = new ClipboardJS('.copy');
                  }
                } else {
                  Modal.error({
                    centered: true,
                    title: t(result),
                    content: (
                      <span>
                        {t('详情请咨询')}
                        <a
                          href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                          target="_blank">
                          {t('信息安全小助手')}
                        </a>
                      </span>
                    ),
                    okText: t('确定')
                  });
                }
              } catch (error) {
                Modal.error({
                  centered: true,
                  title: t(result),
                  content: (
                    <span>
                      {t('详情请咨询')}
                      <a
                        href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                        target="_blank">
                        {t('信息安全小助手')}
                      </a>
                    </span>
                  ),
                  okText: t('确定')
                });
              }
            }
          });
      }
    }
  };

  render() {
    const {
      form,
      t,
      userInfo,
      apps,
      loading,
      workflow,
      enumMap,
      params: { appId },
      resourceTypeList,
      topApps,
      dispatch,
      bpmHost,
      isBatchForUserSelector
    } = this.props;
    const { getFieldDecorator } = form;
    const isApplyForOthers = form.getFieldValue('isApplyForOthers');

    const {
      hasFootprint,
      searchValue,
      recommand,
      workflowItems,
      activeKeysOnCollapse
    } = this.state;
    // 申请访问的系统
    let ApplySystem = [];
    let FootprintSystem = [];
    if (!hasFootprint) {
      ApplySystem = this.getOptions(apps, 'appId', 'appName');
    } else {
      // 前端足迹
      let footprint = footprintInstance.getData(apps);
      if (footprint.length) {
        // FootprintSystem = this.getGroupOptions(footprint, t('我的足迹'));
        FootprintSystem = footprint;
      }
      // ApplySystem = this.getGroupOptions(apps, t('所有系统'), true);
      ApplySystem = this.getOptions(apps, 'appId', 'appName');
    }

    /**
     * 自定义过滤方法
     * 根据系统name和url进行过滤
     * @param {*} inputValue
     * @param {*} param1
     */
    function filterOption(inputValue, { props }) {
      const { children: name = '', url = '' } = props;
      const _value = inputValue.toLowerCase();
      const _name = name.toString().toLowerCase();
      const _url = url.toString().toLowerCase();

      return (
        _name.includes(_value) ||
        _url.includes(_value) ||
        (!!url && _value.includes(_url))
      );
    }

    const getBpm = forecastByBpm => {
      try {
        let workflowInfo = JSON.parse(forecastByBpm);
        return <ForecastGraph workflowInfo={workflowInfo} />;
      } catch (error) {
        return <div>{forecastByBpm}</div>;
      }
    };
    const getSteps = steps => {
      return (
        <Steps className="workflow-steps">
          {_.map(steps, (step, stepIndex) => (
            <Step
              key={stepIndex}
              status="wait"
              title={t(enumMap.workflowenums.stepType[step.type])}
              description={_.map(step.approveUsers, ({ accountName }) => {
                return accountName;
              }).join(',')}
            />
          ))}
        </Steps>
      );
    };
    return (
      <Form
        onSubmit={this.onSubmit}
        // value={this.state.formValue}
        className="apply_form">
        <FormItem
          {...formItemLayout2}
          label={t('申请人邮箱前缀')}
          required={true}>
          <Col span={17}>
            <FormItem>
              {getFieldDecorator('username', {
                // rules: [required],
                rules: [{ validator: this.handleUsernameCheck }],
                initialValue: {
                  key: userInfo.id || '',
                  label: userInfo.username || ''
                }
              })(
                // <Input
                //   disabled={!isApplyForOthers}
                //   placeholder={t('请输入公司邮箱前缀，多人用英文逗号分隔')}
                // />
                isBatchForUserSelector ? (
                  <UserSelectorBatch
                    ref={saveRef(this, 'userSelectorBatch')}
                    disabled={!isApplyForOthers}
                    t={t}
                  />
                ) : (
                  <UserSelector
                    placeholder={t('请输入公司邮箱前缀')}
                    disabled={!isApplyForOthers}
                  />
                )
              )}
              {isApplyForOthers ? (
                <div className="batch_options">
                  {isBatchForUserSelector ? (
                    <span>
                      <Button
                        type="link"
                        className="option"
                        onClick={() => {
                          this.handleConfirmForUserSelectorBatch();
                        }}>
                        {t('名单校验')}
                      </Button>
                      <Button
                        type="link"
                        className="option"
                        onClick={() => {
                          this.setBatchForUserSelector(false);
                        }}>
                        {t('取消批量添加')}
                      </Button>
                    </span>
                  ) : (
                    <Button
                      type="link"
                      className="option"
                      onClick={() => {
                        this.setBatchForUserSelector(true);
                      }}>
                      批量添加
                    </Button>
                  )}
                </div>
              ) : null}
            </FormItem>
          </Col>
          <Col span={6} offset={1}>
            <FormItem>
              {!isMonitorSysId(appId) &&
                getFieldDecorator('isApplyForOthers', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox
                    style={{ whiteSpace: 'nowrap' }}
                    onChange={this.changForOthers}>
                    {t('代他人申请')}
                  </Checkbox>
                )}
            </FormItem>
          </Col>
        </FormItem>
        <div id="intro-step1">
          <div style={recommand.recommandVis}>
            <FormItem {...formItemLayout2} label={t('猜你想要的系统')}>
              {getFieldDecorator('recommandSystem')(
                <div>
                  {this.state.recommand.recommandList.map(item => (
                    <Button
                      style={{ marginRight: '2px' }}
                      key={item.id}
                      onClick={() => this.recommandHandler(item.id)}>
                      {item.name}
                    </Button>
                  ))}
                  <Tooltip
                    title={t('根据您最近的鉴权记录为您推荐可能想要申请的系统')}>
                    <Icon
                      className="apply-recommend-icon"
                      type="question-circle-o"
                    />
                  </Tooltip>
                </div>
              )}
            </FormItem>
          </div>
          <FormItem {...formItemLayout2} label={t('申请访问的系统')}>
            {getFieldDecorator('appId', {
              rules: [required]
              // initialValue: this.props.params.appId
            })(
              <Select
                ref={s => (this.refselect = s)}
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={filterOption}
                notFoundContent={searchValue ? t('无匹配结果') : ''}
                dropdownMatchSelectWidth={!!searchValue || !!appId}
                placeholder={t('输入关键字或系统网址检索')}
                getPopupContainer={triggerNode => triggerNode.parentElement}
                dropdownClassName="apply-auth-dropdown"
                onChange={this.changeAppId}
                onSelect={this.selectSystem}
                onSearch={value => {
                  this.setState({ searchValue: value });
                }}
                onFocus={() => {
                  if (appId) {
                    this.setState({ searchValue: '' });
                  }
                }}
                dropdownRender={menu => {
                  return (
                    <div className="apps-wrap">
                      {searchValue || appId ? null : (
                        <div
                          style={{ padding: '8px', cursor: 'pointer' }}
                          onMouseDown={e => e.preventDefault()}
                          // onClick={() => console.log('click')}
                        >
                          {FootprintSystem && FootprintSystem.length ? (
                            <div className="top-app-wrap">
                              <div
                                className="top-app-label"
                                onMouseDown={e => e.preventDefault()}>
                                {t('我的足迹')}
                              </div>
                              {FootprintSystem.map((item, index) => {
                                // if (!item) return;
                                let src = item.icon || Logo;
                                return (
                                  <div
                                    className="top-app"
                                    key={index}
                                    onClick={() => {
                                      this.topAppChange(item.appId);
                                    }}>
                                    <div className="top-app-img-wrap">
                                      <img
                                        src={src}
                                        onError={() => {
                                          topApps[index] = {
                                            ...topApps[index],
                                            icon: Logo
                                          };

                                          dispatch({
                                            type: 'global/save',
                                            payload: {
                                              topApps
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="top-app-name-wrap">
                                      <span className="top-app-name">
                                        {item.appName}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                              <Divider style={{ margin: '4px 0' }} />
                            </div>
                          ) : null}
                          {topApps && topApps.length ? (
                            <div className="top-app-wrap">
                              <div
                                className="top-app-label"
                                onMouseDown={e => e.preventDefault()}>
                                {t('热点系统')}
                              </div>
                              {topApps.map((item, index) => {
                                let src = item.icon || Logo;
                                return (
                                  <div
                                    className="top-app"
                                    key={index}
                                    onClick={() => {
                                      this.topAppChange(item.id);
                                    }}>
                                    <div className="top-app-img-wrap">
                                      <img
                                        src={src}
                                        onError={() => {
                                          topApps[index] = {
                                            ...topApps[index],
                                            icon: Logo
                                          };

                                          dispatch({
                                            type: 'global/save',
                                            payload: {
                                              topApps
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="top-app-name-wrap">
                                      <span className="top-app-name">
                                        {item.name}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      )}
                      <div style={{ display: searchValue ? 'block' : 'none' }}>
                        {menu}
                      </div>
                    </div>
                  );
                }}>
                {/* { searchValue ? FootprintSystem:null } */}
                {searchValue || appId ? ApplySystem : null}
              </Select>
              // <SystemList
              //   placeholder={t('请选择要申请权限的目标系统')}
              //   disabled={disabledAppId}
              //   onChange={this.changeAppId}
              // />
            )}
          </FormItem>
        </div>

        {this.getForm()}

        <Modal
          title={t('审批流')}
          visible={this.state.modalVisiable}
          maskClosable={false}
          onCancel={this.hideWorkflow}
          width="90%"
          wrapClassName="new-apply-modal-wrapper"
          footer={
            <Button type="primary" onClick={this.hideWorkflow}>
              {t('确定')}
            </Button>
          }>
          <Collapse
            activeKey={activeKeysOnCollapse}
            onChange={this.handleChangeOnCollapse}
            destroyInactivePanel={true}>
            {_.map(
              workflowItems,
              ({ username, resourceType, workflowInfos }, index) => (
                <Panel
                  key={index}
                  header={t('{{ username }}的审批流 - {{ resourceTypeName }}', {
                    username: username,
                    resourceTypeName: getIdByIdentifying(
                      resourceTypeList,
                      resourceType,
                      'name'
                    )
                  })}>
                  <Spin spinning={this.props.loadingWorkflowForecast}>
                    {workflowInfos && Array.isArray(workflowInfos) ? (
                      workflowInfos.map((workflowInfo, index) => {
                        const {
                          steps,
                          bpmId,
                          bpmKey,
                          forecastByBpm,
                          name,
                          roles,
                          roleGroups,
                          areas,
                          flags,
                          resourceDtos
                        } = workflowInfo;
                        let nameList = [];
                        if (roles)
                          nameList = nameList.concat(
                            roles.map(item => item.nameZh)
                          );
                        if (roleGroups)
                          nameList = nameList.concat(
                            roleGroups
                              .filter(item => !!item)
                              .map(item => item.nameZh)
                          );
                        if (areas)
                          nameList = nameList.concat(
                            areas.map(item => item.name)
                          );
                        if (flags)
                          nameList = nameList.concat(
                            flags.map(item => item.nameZh)
                          );
                        if (resourceDtos && resourceDtos.length > 0)
                          nameList = nameList.concat(
                            resourceDtos.map(item => item.resourceName)
                          );

                        const panelHeader = `${name} ${
                          nameList.length > 0 ? '（' : ''
                        } ${nameList.join('，')} ${
                          nameList.length > 0 ? '）' : ''
                        }`;
                        return (
                          <Collapse
                            key={index}
                            bordered={false}
                            defaultActiveKey={index == 0 ? ['0'] : []}>
                            <Panel header={panelHeader} key={0}>
                              {bpmId && bpmKey
                                ? getBpm(forecastByBpm)
                                : getSteps(steps)}
                            </Panel>
                          </Collapse>
                        );
                      })
                    ) : (
                      <div style={{ minHeight: '40px', padding: '0 20px' }}>
                        {workflowInfos}
                      </div>
                    )}
                  </Spin>
                </Panel>
              )
            )}
          </Collapse>
        </Modal>
        {/* 审批流的查看 */}
        {/* <Modal
          title={t('审批流')}
          visible={this.state.modalVisiable}
          maskClosable={false}
          onCancel={this.hideWorkflow}
          width="90%"
          wrapClassName="new-apply-modal-wrapper"
          footer={
            <Button
              type="primary"
              onClick={this.hideWorkflow}
            >{t('确定')}</Button>
          }
        >
          <Spin
            spinning={loading.loadingWorkflow}
            indicator={<Icon type="loading" style={{ fontSize: 30 }} />}
            size="large"
          >
            <Collapse defaultActiveKey={['0']}>
              {_.map(workflow, ({ userName, workflowInfos, type }, index) =>
                <Panel key={index} header={t('{{ username }}的审批流 - {{ type }}', { username: userName, type: getIdByIdentifying(resourceTypeList, type, 'name') })} >
                  {_.map(workflowInfos, ({ name, roles, roleGroups, steps, bpmId, bpmKey }) => {
                    let panelHeader;
                    if (roles && roles[0] !== null) {
                      const roleNames = _.map(roles, ({ nameZh }) => nameZh);
                      const roleGroupNames = _.map(roleGroups, ({ nameZh }) => nameZh);

                      panelHeader = _.join([
                        ...roleNames, ...roleGroupNames
                      ], ',') + `-${name}`;
                    } else {
                      panelHeader = name;
                    }

                    return (
                      <Collapse key={index} bordered={false} defaultActiveKey={['0']}>
                        <Panel header={panelHeader} key={0}>
                          {bpmId && bpmKey ? <iframe src={bpmHost + `/trace/${bpmId}?taskId=${bpmKey}`} frameBorder="0" width="100%" height="400"></iframe> :
                            <Steps className="workflow-steps" >
                              {_.map(steps, (step, stepIndex) =>
                                <Step
                                  key={stepIndex}
                                  status="wait"
                                  title={t(enumMap.workflowenums.stepType[step.type])}
                                  description={
                                    _.map(step.approveUsers, ({ accountName }) => {
                                      return accountName;
                                    }).join(',')
                                  }
                                />
                              )}
                            </Steps>}

                        </Panel>
                      </Collapse>
                    );
                  })}
                </Panel>
              )}
            </Collapse>
          </Spin>
        </Modal> */}
      </Form>
    );
  }
}

export default connect(
  ({ newApply, userInfo, global, admin, monitorPermissionGroup }) => {
    const {
      odinRoles,
      sysList,
      woaterRegionTree,
      woaterRoleList,
      bamaiRoleList
    } = monitorPermissionGroup;
    return {
      ...newApply,
      loadingWorkflowForecast: newApply.loading.loadingWorkflowForecast,
      userInfo: userInfo,
      enumMap: global.enumMap,
      allBusiness: global.allBusiness,
      appbindedbusiness: admin.appbindedbusiness || [],
      apps: global.apps,
      topApps: global.topApps,
      groupList: monitorPermissionGroup.list,
      odinRoles,
      sysList,
      woaterRegionTree,
      woaterRoleList,
      bamaiRoleList,
      bpmHost: global.bpmHost
    };
  }
)(
  Form.create({
    mapPropsToFields(props) {
      let fields = {};
      _.each(props.params, (value, key) => {
        if (value != null) {
          fields[key] = Form.createFormField({ value });
        }
      });
      return fields;
    },
    onValuesChange(props, values) {
      props.dispatch({
        type: 'newApply/updateParams',
        payload: values
      });
    }
  })(translate()(ApplyForm))
);
