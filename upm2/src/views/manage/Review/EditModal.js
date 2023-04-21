import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Checkbox, Button, Form, Input, Select, Modal, Tooltip, TreeSelect, message, Icon, Radio, Collapse } from 'antd';
const FormItem = Form.Item;
import request from '@utils/request';
import TableSelector from '@components/NewTableSelector';

import './index.less';
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
const resourceTypeList = [
  { id: 10086, appId: 12, name: "角色", identifying: "role" },
  { id: 10087, appId: 12, name: "地区", identifying: "area" },
  { id: 10088, appId: 12, name: "标识位", identifying: "flag" },
  { id: 10089, appId: 12, name: "数据资源", identifying: "data" }

];
class ReviewEdit extends React.Component {

  state = {
    tmpReviewObj: {
      name: '',
      reviewTargetType: 0
    },
    dataType: [],
    businessList: [],
    halfCheckedKeys: [], // 地区树节点的父节点
    btnLoadding: false
  };
  /**
  * 获取资源
  */
  handleFetchResource = (params) => {
    const { dispatch } = this.props;
    let type = null;

    switch (params.resourceTypeId) {
      case 'role':
        type = 'manageReview/fetchRoleListNew';
        params.resourceTypeId = 10086;
        params.applicable=2
        break;
      case 'area':
        type = 'manageReview/fetchRoleListNew';
        params.resourceTypeId = 10087;
        break;
      case 'flag':
        type = 'manageReview/fetchFlagList';
        params.resourceTypeId = 10088;
        params.applicable=2
        break;
      case 'data':
        type = 'manageReview/getQueryList';
        params.resourceTypeId = 10089;
    }

    this.props.getDataType({appId: params.appId}).then((res) => {
      this.setState({
        dataType: res
      })
    })
    this.props.getBusiness().then((res) => {
      this.setState({
        businessList: res
      })
    })

    return dispatch({
      type,
      payload: { params }
    });
  }

  changeAppId = (e) => {
    const { form, mergeReviewObj, getAppBindedBusiness,getAppBindedBusinessAll } = this.props;
    let hasALL = false
    let saveAll = false
    let arrayApp = []
    for (let index in e) {
      if (e[index] === 0) {
        hasALL = true
      } else {
        arrayApp.push(e[index]);
      }
    }

    //只保留全部 系统筛选
    if (e.length > 1 && e[e.length - 1] == 0 || (e.length === 1 && e[e.length - 1] == 0)) {
      saveAll = true;
    }
    if (saveAll) {
      setTimeout(() => {
        mergeReviewObj({
          appIdList: [0],
          permissionList: []
        });
        this.props.form.setFieldsValue({
          appId: [0],
          allRole: 0,
          allFlag: 0,
          allArea: 0,
          allData: 0
        });
      }, 0);
    } else if (e.length === 1) {
      mergeReviewObj({
        appIdList: arrayApp
      });
      getAppBindedBusinessAll({appId: arrayApp});
    }
    else if (e.length > 1) {
      setTimeout(() => {
        mergeReviewObj({
          appIdList: arrayApp,
          permissionList: []
        })
        this.props.form.setFieldsValue({
          appId: arrayApp,
          allRole: 0,
          allFlag: 0,
          allArea: 0,
          allData: 0,
          flagList: [],
          roleList: [],
          businessId: '',
          areaIdList: [],
          dataList: []
        });
      }, 0);

    } else if (e.length === 0) {
      setTimeout(() => {
        this.props.form.setFieldsValue({
          appId: arrayApp,
          allRole: 0,
          allFlag: 0,
          allArea: 0,
          allData: 0,
          flagList: [],
          roleList: [],
          businessId: '',
          areaIdList: [],
          dataList: []
        });
        mergeReviewObj({
          appIdList: arrayApp,
          permissionList: []
        })
      }, 0);
    }


  }
  customEnable = () => {
    const { form } = this.props
    const appId = form.getFieldValue('appId')
    if (appId && appId.length && appId.length === 1 && appId[0] !== 0) {
      return false;
    }
    if (appId && appId != '' && !appId.length) {
      return false;
    }
    return true;
  }
  handleTreeSelect = (value, node, extra) => {
    this.setState({
      halfCheckedKeys: extra.halfCheckedKeys
    })
  }
  renderArea = (appIdList, config) => {
    const {
      form, t, appbindedbusiness,appbindedbusinessAll
    } = this.props;
    const { getFieldDecorator } = form;
    const { treeData } = this.state;
    let areaList = []
    if (config.permissionList) {
      config.permissionList.forEach((res) => {
        if (res.permissionType === 1 && res.permissionId > 0 && res.areaSelectStatus != 1) {
          areaList.push(res.permissionId);
        }
      });
    }
    let allArea = config.businessId !== 0 && areaList.length > 0 ? 1 : 0;

    // 如果是地区则显示地区列表项
    return (
      <React.Fragment>
        <FormItem  {...formItemLayout} label={t('业务线名称')} >
          {getFieldDecorator('allArea', {
            initialValue: allArea
          })(
            <Radio.Group name='areaRadioGroup' onChange={(val) => { this.props.getAppBindedBusinessAll({ appId: config.appIdList[0] }) }} disabled={!!this.props.editingId}>
              <Radio value={0}>{t('全部')}</Radio>
              <Radio value={1} disabled={this.customEnable()}>{t('自定义')}{this.customEnable() ? t('(若权限类型选择多个/全部系统，则此项不可选)') : ''}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout} label={t('请选择业务线')} style={form.getFieldValue('allArea') == 1 && !this.customEnable() ? { display: 'block' } : { display: 'none' }} >
          {getFieldDecorator('businessId', {
            initialValue: config.businessId === 0 ? '' : config.businessId,
            rules: [{ required: form.getFieldValue('allArea') == 1, message: t('请选择业务线') }]
          })(

            <Select
              style={{ width: '100%' }}
              disabled={!!this.props.editingId}
              showSearch
              optionFilterProp="children"
              onChange={(businessId) => { this.handleBusinessChange(businessId, config.appIdList[0]) }}
            >
              {appbindedbusinessAll ? appbindedbusinessAll.map((bus) => (
                <Option
                  key={bus.id}
                  value={bus.id}
                >
                  {bus.name}
                </Option>
              )) : null}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('选择地区')} style={form.getFieldValue('allArea') == 1 && !this.customEnable() ? { display: 'block', width: '100%' } : { display: 'none', width: '100%' }} >
          {getFieldDecorator('areaIdList', {
            initialValue: areaList,
            rules: [{ required: form.getFieldValue('allArea') == 1, message: t('请选择地区') }]
          })(
            <TreeSelect
              disabled={!!this.props.editingId}
              filterTreeNode={(inputValue, TreeNode) => TreeNode.props.title.indexOf(inputValue) != -1}
              treeData={treeData}
              showSearch={true}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              style={{ width: '100%' }}
              onSelect={this.handleTreeSelect}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
          )}
        </FormItem>
      </React.Fragment>
    );
  }
  getTableItemRole = (config) => {


    const {
      t, form, allBusiness, resourceList
    } = this.props;

    const { getFieldDecorator } = form;
    const { labelName, resourceTypeId, allSelect } = config;
    let roleList = []
    if (config.permissionList) {
      config.permissionList.forEach((res) => {
        if (res.permissionType === 2 && res.permissionId > 0) {
          roleList.push({
            resourceKey: res.permissionId,
            label: res.permissionName,
            value: res.permissionId
          });
        }
      });
    }
    let allRole = roleList[0] ? (roleList[0].resourceKey === 0 ? 0 : 1) : 0;

    return (
      <div>
        <FormItem  {...formItemLayout} label={labelName} >
          {getFieldDecorator('allRole', {
            initialValue: allRole
          })(
            <Radio.Group name='roleRadioGroup' disabled={!!this.props.editingId}  >
              <Radio value={0}>{t('全部')}</Radio>
              <Radio value={1} disabled={this.customEnable()}>{t('自定义')}{this.customEnable() ? t('(若权限类型选择多个/全部系统，则此项不可选)') : ''}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('请选择角色')} style={form.getFieldValue('allRole') == 1 ? { display: 'block' } : { display: 'none' }}>
          {getFieldDecorator('roleList', {
            initialValue: roleList,
            rules: [{ required: form.getFieldValue('allRole') == 1, message: t('请选择角色') }]

          })(
            <TableSelector
              allSelect={allSelect}
              disabled={!!this.props.editingId}
              title={labelName}
              handleResourceTypeChange={this.typeChange}
              t={t}
              isPackage={true}
              appId={this.props.reviewObj.appIdList[0]}
              resourceList={resourceList}
              resourceTypeList={resourceTypeList}
              resourceTypeId={resourceTypeId}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              mask={true}
              noFirstSearch={true}
              allBusiness={allBusiness}
            />
          )}
        </FormItem>
      </div>
    );
  }

  // 数据资源
  getTableItemData = (config) => {
    const {
      t, form, allBusiness, resourceList
    } = this.props;

    const { getFieldDecorator } = form;
    const { labelName, resourceTypeId, allSelect } = config;
    let dataList = []
    if (config.permissionList) {
      config.permissionList.forEach((res) => {
        if (res.permissionType === 100 && res.permissionId > 0) {
          dataList.push({
            resourceKey: res.permissionId,
            label: res.permissionName,
            value: res.permissionId
          });
        }
      });
    }
    let allData = dataList[0] ? (dataList[0].resourceKey === 0 ? 0 : 1) : 0;
    return (
      <div>
        <FormItem  {...formItemLayout} label={labelName} >
          {getFieldDecorator('allData', {
            initialValue: allData
          })(
            <Radio.Group name='roleRadioGroup' disabled={!!this.props.editingId}  >
              <Radio value={0}>{t('全部')}</Radio>
              <Radio value={1} disabled={this.customEnable()}>{t('自定义')}{this.customEnable() ? t('(若权限类型选择多个/全部系统，则此项不可选)') : ''}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('请选择数据资源')} style={form.getFieldValue('allData') == 1 ? { display: 'block' } : { display: 'none' }}>
          {getFieldDecorator('dataList', {
            initialValue: dataList,
            rules: [{ required: form.getFieldValue('allData') == 1, message: t('请选择数据资源') }]
          })(
            <TableSelector
              allSelect={allSelect}
              disabled={!!this.props.editingId}
              title={labelName}
              handleResourceTypeChange={this.typeChange}
              t={t}
              isPackage={true}
              appId={this.props.reviewObj.appIdList[0]}
              resourceList={resourceList}
              resourceTypeList={resourceTypeList}
              resourceTypeId={resourceTypeId}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              mask={true}
              noFirstSearch={true}
              allBusiness={allBusiness}
              dataType={this.state.dataType}
              businessList={this.state.businessList}
            />
          )}
        </FormItem>
      </div>
    );
  }

  getTableItemFlag = (config) => {
    const {
      t, form, allBusiness, resourceList
    } = this.props;
    const { getFieldDecorator } = form;
    const { labelName, resourceTypeId, allSelect } = config;
    let flagList = []
    if (config.permissionList) {
      config.permissionList.forEach((res) => {
        if (res.permissionType === 7 && res.permissionId > 0) {
          flagList.push({
            resourceKey: res.permissionId,
            label: res.permissionName,
            value: res.permissionId
          });
        }
      });
    }
    let allFlag = flagList[0] ? (flagList[0].resourceKey === 0 ? 0 : 1) : 0;
    return (
      <div>
        <FormItem  {...formItemLayout} label={labelName} >
          {getFieldDecorator('allFlag', {
            initialValue: allFlag
          })(
            <Radio.Group name='flagRadioGroup' disabled={!!this.props.editingId}  >
              <Radio value={0}>{t('全部')}</Radio>
              <Radio value={1} disabled={this.customEnable()}>{t('自定义')}{this.customEnable() ? t('(若权限类型选择多个/全部系统，则此项不可选)') : ''}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('请选择标识位')} style={form.getFieldValue('allFlag') == 1 ? { display: 'block' } : { display: 'none' }}>
          {getFieldDecorator('flagList', {
            initialValue: flagList,
            rules: [{ required: form.getFieldValue('allFlag') == 1, message: t('请选择标识位') }]
          })(
            <TableSelector
              allSelect={allSelect}
              disabled={!!this.props.editingId}
              title={labelName}
              handleResourceTypeChange={this.typeChange}
              t={t}
              isPackage={true}
              appId={config.appIdList[0]}
              resourceList={resourceList}
              resourceTypeList={resourceTypeList}
              resourceTypeId={resourceTypeId}
              handleFetchResource={this.handleFetchResource}
              needShowCloseBtn={true}
              mask={true}
              noFirstSearch={true}
              allBusiness={allBusiness}
            />
          )}
        </FormItem>
      </div>

    );
  }
  debouncedDeptSearch = _.debounce(this.props.fetchDept, 500)
  getDeptName = (item) => {
    let result = item.deptName;
    let now = item;

    while (now.parentDept) {
      result = now.parentDept.deptName + '/' + result;
      now = now.parentDept;
    }

    return result;
  }
  /**
    * 格式化成树状结构
    */
  formatTree = (data) => {
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        data[i].title = data[i].name;
        data[i].value = data[i].id + '';
        data[i].key = data[i].id + '';
        if (data[i].children && data[i].children.length) {
          this.formatTree(data[i].children);
        }
      }
    }
    return data;
  }
  handleModalOk = () => {
    const { form, addReview, t, permissionReviewEdit, reviewObj, handleOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { name, purpose, appId, permissionType, usernames, deptList, threshold, thresholdSelf, businessId, reviewDays, reviewTargetType, defaultPermissionStatus, approveUser, approveDaysRadio } = fieldsValue;
      let permissionList = [];
      //说明有多个系统
      if (err) {
        return;
      }
      permissionList = this.getFormItemPermissionList(fieldsValue);
      let depListTmp = deptList;
      const params = {
        name,
        purpose,
        appIds: !appId.length ? [appId] : appId,
        id: reviewObj.id == 0 ? null : reviewObj.id,
        permissionTypes: permissionType,
        usernames: usernames ? usernames.split(',') : [],
        deptList: depListTmp,
        threshold: threshold === -1 ? thresholdSelf : Number(threshold),
        permissionList: permissionList,
        businessId: businessId,
        reviewTargetType: reviewTargetType,
        permissionRiskLevelList: this.props.reviewObj.riskLevelList,//checkbox 去不到form的值，这里就曲线救国了
        reviewDays: reviewDays,
        defaultPermissionStatus: defaultPermissionStatus,
        approveUser: approveUser,
        approveDays: approveDaysRadio
      }
      this.setState({
        btnLoadding: true
      })
      if (reviewObj.id > 0) {
        permissionReviewEdit(params).then(({ success, result }) => {
          this.setState({
            btnLoadding: false
          })
          message.destroy();
          if (success) {
            // 提示成功，2秒
            message.success(t('提交成功'), 2, () => { });
            this.closeModalInner();
            handleOk(1);
          } else {
            message.error(result, 5);
          }
        });
      } else {
        addReview(params).then(({ success, result }) => {
          this.setState({
            btnLoadding: false
          })
          message.destroy();
          if (success) {
            // 提示成功，2秒
            message.success(t('提交成功'), 2, () => { });
            this.closeModalInner();
            handleOk(1);
          } else {
            message.error(result, 5);
          }
        })
      }

    });
  };
  fetchBusinessArea = (businessId,appId) =>{
    const {form,reviewObj} = this.props
    request(`/area/select/tree?businessId=${businessId}&appId=${appId}`)
      .then(res => {
        if(reviewObj.businessId&&reviewObj.businessId!=businessId){
          form.setFieldsValue({areaIdList:[]});
        }
        this.setState({
          treeData: this.formatTree(res)
        })
      })
  }
  /**
  * 业务线变化时候的处理逻辑
  */
  handleBusinessChange = (businessId, appId) => {
    const {mergeReviewObj} = this.props;
    mergeReviewObj({businessId:businessId});
  }
  getFormItemPermissionList = (fieldsValue) => {
    const { areaIdList, flagList, roleList, dataList, allFlag, allRole, allArea, allData } = fieldsValue;
    let permissionList = [];
    if (allFlag === 0) {
      permissionList.push({
        permissionId: 0,
        permissionType: 7
      });
    } else if (flagList) {
      flagList.map(item => {
        return {
          permissionId: item.resourceKey,
          permissionType: 7
        };
      }).forEach(v => permissionList.push(v));

    }
    if (allArea === 0) {
      permissionList.push({
        permissionId: 0,
        permissionType: 1
      });
    } else if (areaIdList) {
      let nodes = this.findChildren(areaIdList, this.state.treeData)

      // 将父节点半选状态的也放进去
      // 全选状态
      nodes && nodes.map(item => {
        return {
          permissionId: item,
          permissionType: 1,
          areaSelectStatus: 0,
        };
      }).forEach(v => permissionList.push(v));
      // 半选状态
      this.state.halfCheckedKeys && this.state.halfCheckedKeys.map(item => {
        return {
          permissionId: item,
          permissionType: 1,
          areaSelectStatus: 1,
        }
      }).forEach(v => permissionList.push(v));
    }

    if (allRole === 0) {
      permissionList.push({
        permissionId: 0,
        permissionType: 2
      });
    } else if (roleList) {
      roleList.map(item => {
        return {
          permissionId: item.resourceKey,
          permissionType: 2
        };
      }).forEach(v => permissionList.push(v));
    }

    if (allData === 0) {
      permissionList.push({
        permissionId: 0,
        permissionType: 100
      });
    } else if (dataList) {
      dataList.map(item => {
        return {
          permissionId: item.value,
          permissionType: 100
        };
      }).forEach(v => permissionList.push(v));
    }
    return permissionList;
  }
  indexInt = (arr, id) => {
    for (let arrKey in arr) {
      if (arr[arrKey] == id) {
        return true
      }
    }
    return false
  }
  findChildren = (arr, srcArr) => {
    let result = [];
    for (const cur of srcArr) {
      if (this.indexInt(arr, cur.id)) {  // 如果arr里有当前遍历到的id，那就放进去并且把子节点的所有id都放进去
        result.push(cur.id);
        if (cur.hasOwnProperty('children') && cur.children) {
          result = result.concat(
            this.findAllAttrInChildren('id', cur.children, 'children'),
          );
        }
      } else {  // 没有的时候，有children属性就遍历children
        if (cur.hasOwnProperty('children') && cur.children) {
          result = result.concat(this.findChildren(arr, cur.children));
        }
      }
    }

    return result;
  }
  // DFS找出所有该属性的值
  findAllAttrInChildren = (attr, arr, childrenName) => {
    let result = [];
    for (const cur of arr) {
      if (cur.hasOwnProperty(attr)) {
        result.push(cur[attr]);
      }
      if (cur.hasOwnProperty(childrenName) && Array.isArray(cur[childrenName])) {
        let next = cur[childrenName];
        result = result.concat(this.findAllAttrInChildren(attr, next, childrenName));
      }
    }
    return result;
  }
  userDeptChange = (val) => {

    const { form, mergeReviewObj } = this.props;
    if (val === 0) {
      form.setFieldsValue({
        allBu: ''
      });
      mergeReviewObj({ reviewTargetType: val })
    } else {
      form.setFieldsValue({
        allBu: 1
      });
      mergeReviewObj({ deptType: val, reviewTargetType: val })
    }
  }
  onDaysChange = (e) => {
    const { mergeReviewObj } = this.props
    mergeReviewObj({ reviewDays: e.target.value })
  }
  renderItems = (config, needType) => {
    for (let index in config.permissionTypeList) {
      // 2角色、3地区、4标识位
      let type = config.permissionTypeList[index];
      if (type === needType) {
        if (type === 2) {

          return this.renderRole(config.appIdList, config);
        }
        if (type === 1) {
          return this.renderArea(config.appIdList, config);
        }
        if (type === 7) {
          return this.renderFlag(config.appIdList, config);
        }
        if (type === 100) {
          return this.renderData(config.appIdList, config);
        }
      }
    }
  }
  renderRole = (appIdList, reviewObj) => {

    const { t } = this.props;
    const config = {
      resourceTypeId: 'role',
      labelName: t('角色'),
      allSelect: true,
      ...reviewObj
    };
    return this.getTableItemRole(config);
  }

  renderData = (appIdList, reviewObj) => {
    const { t } = this.props;
    const config = {
      resourceTypeId: 'data',
      labelName: t('数据资源'),
      allSelect: true,
      ...reviewObj
    };
    return this.getTableItemData(config);
  }

  renderFlag = (appIdList, reviewObj) => {

    const { t } = this.props;
    const config = {
      resourceTypeId: 'flag',
      labelName: t('标识位'),
      allSelect: true,
      ...reviewObj
    };
    return this.getTableItemFlag(config);
  }

  permissionRiskLeveChange = (e) => {
    const { mergeReviewObj } = this.props;
    mergeReviewObj({ riskLevelList: e });

  }
  changeRole = (e) => {
    this.setState({
      radioRole: e.target.value
    });
  }
  changeBu = (e) => {
    this.setState({
      radioBu: e.target.value
    });
  }

  changeFlag = (e) => {
    this.setState({
      radioFlag: e.target.value
    });
  }
  componentWillReceiveProps(nextProps) {
    const { reviewObj, mergeDept } = nextProps;
    if (reviewObj.businessId > 0) {
      this.fetchBusinessArea(reviewObj.businessId, reviewObj.appIdList[0]);
    }
  }

  typeChange = (type) => {
    const { getAppBindedBusiness, getAppBindedBusinessAll, form, mergeReviewObj } = this.props;
    let realType = [];
    if (!type) {
      return
    }
    if (type.length > 1) {
      for (let index in type) {
        if (type[index] > 0) {
          realType.push(type[index]);
        }
      }
      if (type[type.length - 1] === 0) {
        realType = [0];
      }
      setTimeout(() => {
        form.setFieldsValue({ permissionType: realType });
      }, 0)
    } else {
      realType = type
    }
    for (let index in type) {
      // 地区
      if (type[index] === 1 && !this.customEnable()) {
        if (!form.getFieldValue('appId').length || form.getFieldValue('appId').length == 1) {
          getAppBindedBusinessAll({ appId: form.getFieldValue('appId') })
        }
      }
    }
    mergeReviewObj({ permissionTypeList: realType });

  }
  closeModalInner = () => {
    const { closeModal, form, saveReviewObj } = this.props;
    closeModal();
    form.resetFields();
    saveReviewObj(this.state.tmpReviewObj);
  }

  render() {
    const {
      form,
      t,
      availableApps,
      departments,
      reviewObj,
      modalVisible,
      editingId
    } = this.props;
    const { getFieldDecorator } = form;
    const { Panel } = Collapse;

    let usernames = reviewObj.reviewTargetType === 0 && !reviewObj.deptType ? reviewObj.reviewTarget : '';

    let depList = []
    if (reviewObj.deptList) {
      depList = reviewObj.reviewTargetType == 1 && reviewObj.deptType == 1 ? reviewObj.deptList.map(item => { return item.deptId; }) : [];
    }

    if (!reviewObj.id || reviewObj.id <= 0) {
      if (!reviewObj.appIdList || reviewObj.appIdList.length === 0) {
        let idTmp = availableApps && availableApps[1] ? [availableApps[1].id] : undefined;
        reviewObj.appIdList = []
        if (idTmp) {
          reviewObj.appIdList = idTmp
        }
      }

      if (!reviewObj.reviewTargetType) {
        reviewObj.reviewTargetType = 0
      }
    }

    let addAllSystem = [];
    let upmAdmin = false
    availableApps.forEach(item => {
      if (item.id === 888) {
        upmAdmin = true
      }
    });

    if (upmAdmin) {
      addAllSystem.push({ id: 0, name: t('全部') });
    }
    for (let index in availableApps) {
      addAllSystem.push(availableApps[index])
    }
    const isviewing = !!editingId;

    // 新增
    let defaultPermissionStatus = reviewObj.defaultPermissionStatus || 0,
        approveUser = reviewObj.approveUser,
        approveDaysRadio = 15,
        reviewDays = 15, // 单选按钮
        threshold = 15, // 权限获得天数
        thresholdSelf = '', // 自定义权限获得天数
        riskLevelList = reviewObj.riskLevelList || [0]

    // 设置权限获得天数，原权限触发天数
    if (reviewObj.threshold && reviewObj.threshold == 15) {
      threshold = 15
    } else if (reviewObj.threshold && reviewObj.threshold == 30) {
      threshold = 30
    } else if (reviewObj.threshold && reviewObj.threshold != 15 && reviewObj.threshold != 30 && reviewObj.threshold > 0) {
      threshold = -1
      thresholdSelf = reviewObj.threshold
    } else {
      threshold = 15
      thresholdSelf = ''
    }

    let panelHeader = <h3 className="section-info">{t('设置权限审核人')}</h3>

    return (
      <Modal
        title={isviewing ? t('权限审核详情') : t('自定义发起权限审核')}
        visible={modalVisible}
        onOk={this.handleModalOk}
        onCancel={this.closeModalInner}
        width={800}
        footer={isviewing ? [
          <Button key="back" onClick={this.closeModalInner}>
            {t('取消')}
          </Button>
        ] : [
            <Button key="back" onClick={this.closeModalInner}>
              {t('取消')}
            </Button>,
            <Button key="submit" type="primary" loading={this.state.btnLoadding} onClick={this.handleModalOk}>
              {t('配置权限审核')}
            </Button>,
          ]}
      >
        <Form className="edit-form">
          <FormItem
            {...formItemLayout}
            label={t('权限审核名称')}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: t('请输入权限审核名称') }, { max: 255, message: t('最多输入255个字符') }],
              initialValue: reviewObj.name
            })(
              <Input
                disabled={isviewing}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                {t('权限审核目的')}&nbsp;
              <Tooltip title={t('权限审核目的会通过邮件/Dchat的形式通知用户')}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('purpose', {
              rules: [{ required: true, message: t('请输入权限审核目的') }, { max: 255, message: t('最多输入255个字符') }],
              initialValue: reviewObj.purpose,
              getValueFromEvent: e => {
                return e.target.value.trim()
              }
            })(
              <TextArea
                rows={4}
                disabled={isviewing}
              />
            )}
          </FormItem>
          <h3 className="section-info">{t('设置权限审核逾期策略')}</h3>

          <FormItem
            {...formItemLayout}
            colon={false}
            label=" ">
            {getFieldDecorator('defaultPermissionStatus', { initialValue: defaultPermissionStatus })(
              <Radio.Group name='roleRadioGroup' disabled={!!this.props.editingId} onChange={this.changeBu} >
                <Radio value={0}>{t('保留权限')}</Radio>
                <Radio value={1}>{t('删除权限')}</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <h3 className="section-info">{t('选择审核权限范围')}</h3>
          <FormItem
            {...formItemLayout}
            label={t('目标系统')}
          >
            {getFieldDecorator('appId', {
              rules: [{ required: true, message: t('请选择目标系统') }],
              initialValue: reviewObj.appIdList
            })(
              <Select
                mode="multiple"
                disabled={isviewing}
                showSearch
                allowClear
                optionFilterProp="children"
                dropdownClassName="apply-auth-dropdown"
                onChange={this.changeAppId}
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                {addAllSystem.map((app) => {
                  return (
                    <Option value={app.id} key={app.id}>
                      {app.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('权限敏感级')}
          >
            <Checkbox.Group disabled={!!this.props.editingId} onChange={this.permissionRiskLeveChange} value={riskLevelList} >
              <Checkbox value={0} disabled={riskLevelList.indexOf(3) != -1 || riskLevelList.indexOf(4) != -1}>{t('全部')}</Checkbox>
              <Checkbox value={3} disabled={riskLevelList.indexOf(0) != -1 }>C3</Checkbox>
              <Checkbox value={4} disabled={riskLevelList.indexOf(0) != -1 }>C4</Checkbox>
            </Checkbox.Group>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={t('权限类型')}
          >
            {getFieldDecorator('permissionType', {
              normalize: this.changePermissionType,
              rules: [{ required: true, message: t('请选择权限类型') }],
              initialValue: reviewObj.permissionTypeList
            })(
              <Select
                mode="multiple"
                disabled={isviewing}
                onChange={this.typeChange}
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                <Option value={0}>{t('全部')}</Option>
                <Option value={2}>{t('角色')}</Option>
                <Option value={1}>{t('地区')}</Option>
                <Option value={7}>{t('标识位')}</Option>
                <Option value={100}>{t('数据资源')}</Option>
              </Select>
            )}
          </FormItem>
          {this.renderItems(reviewObj, 2)}
          {this.renderItems(reviewObj, 1)}
          {this.renderItems(reviewObj, 7)}
          {this.renderItems(reviewObj, 100)}

          {/* 权限获得天数 */}
          <Form.Item
            {...formItemLayout}
            label={
              <span>
                {t('权限获得天数')}&nbsp;
                <Tooltip title={t('设置触发时间后，获得权限时间超过触发时间的用户将会被发起权限权限审核（例：假设触发时间为30天，则获得权限30天及以上的用户将会被发起权限权限审核，否则不会）')}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            style={{ marginBottom: 0 }}>
            <Form.Item style={{ display: 'inline-block', width: 'calc(60%)' }} >
            {getFieldDecorator('threshold', {
              rules: [{ required: true, message: t('请输入权限获得天数') }],
              initialValue: threshold
            })(
              <Radio.Group disabled={isviewing}>
                <Radio value={15}>{ t('大于') + '15' + t('天')}</Radio>
                <Radio value={30}>{ t('大于') + '30' + t('天')}</Radio>
                <Radio value={-1}>{t('自定义')}</Radio>
              </Radio.Group>
            )}
            </Form.Item>
            <Form.Item style={{ display: form.getFieldValue('threshold') == -1 ? 'inline-block' : 'none', width: 'calc(40%)' }}>
              {getFieldDecorator('thresholdSelf', { initialValue: thresholdSelf, rules: [{ required: true, message: t('请输入权限获得天数') }], hidden: form.getFieldValue('threshold') !== -1})(
                <Input
                type="number"
                disabled={isviewing}
                onInput={e => { e.target.value = e.target.value.replace(/\-/g, "").replace(/^0+/, '') }}
                addonBefore={t('大于')}
                addonAfter={t('天')}/>
              )}
            </Form.Item>
          </Form.Item>
          <h3 className="section-info">{t('选择审核用户范围')}</h3>

          <FormItem
            {...formItemLayout}
            label={t('选择用户范围')}
          >
            {/* <span>（2选1）</span> */}
            {getFieldDecorator('reviewTargetType', {
              rules: [{ required: true, message: t('请选择用户范围') }],
              initialValue: reviewObj.reviewTargetType
            })(
              <Radio.Group disabled={!!this.props.editingId}>
                <Radio value={0}>{ t('按用户选择')}</Radio>
                <Radio value={1}>{ t('按部门选择')}</Radio>
                <Radio value={2}>{t('全部用户')}</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={form.getFieldValue('reviewTargetType') == 0 ? { display: 'block' } : { display: 'none' }}
            label={
              <span>{t('用户名')}</span>
            }
          >
            {getFieldDecorator('usernames', {
              rules: [{ required: form.getFieldValue('reviewTargetType') == 0, message: t('请输入用户名') }],
              initialValue: usernames,
              hidden: form.getFieldValue('reviewTargetType') == 1
            })(
              <Input
                disabled={isviewing || !!this.props.editingId}
                placeholder={t('多人用英文逗号分隔')}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('请选择部门')}
            style={form.getFieldValue('reviewTargetType') == 1 ? { display: 'block' } : { display: 'none' }}
          >
            {getFieldDecorator('deptList', {
              rules: [{ required: form.getFieldValue('reviewTargetType') == 1, message: t('请选择部门') }],
              hidden: form.getFieldValue('reviewTargetType') == 0,
              initialValue: depList
            })(
              <Select
                disabled={isviewing}
                placeholder={t('请输入文字搜索部门')}
                mode="multiple"
                dropdownMatchSelectWidth={false}
                showSearch
                onSearch={(word) => { word ? this.debouncedDeptSearch({ word, appId: 888 }) : '' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >

                {departments && departments.map((item, index) => (
                  <Option key={index} value={item.deptId}>
                    {this.getDeptName(item)}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <Collapse bordered={false} defaultActiveKey={['0']} >
            <Panel header={panelHeader} key="1" className="site-collapse-custom-panel">

            <Form.Item
            {...formItemLayout}
            label={
              <span>
                {t('物理上级审核天数')}
              </span>
            }>
            {getFieldDecorator('reviewDays', {
              rules: [{ required: true, message: t('请输入物理上级审核天数') }],
              initialValue: reviewDays
            })(
              <Input
                type="number"
                disabled={isviewing}
                addonAfter={t('天')}/>
              )}
          </Form.Item>

          <FormItem
            {...formItemLayout}
            label={t('审核人账号')}>
              {/* rules: [{ required: true, message: t('请输入权限审核人') }], */}
            {getFieldDecorator('approveUser', { initialValue: approveUser})(
              <Input
              disabled={isviewing}
              placeholder={t('邮箱前缀，可以是本人；不允许是实习生或者外包')}
            />
            )}
          </FormItem>

          <Form.Item {...formItemLayout} label={t('审批人审核天数')}>
            {getFieldDecorator('approveDaysRadio', { rules: [{ required: !!form.getFieldValue('approveUser'), message: t('请输入审批人审核天数') }], initialValue: approveDaysRadio })(
              <Input
              type="number"
              disabled={isviewing}
              addonAfter={t('天')}/>
            )}
          </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ manageReview, global }) => {
  return {
    data: manageReview.list,
    reviewObj: manageReview.reviewObj,
    departments: manageReview.departments,
    availableApps: global.availableApps,
    appbindedbusiness: manageReview.appbindedbusiness,
    appbindedbusinessAll: manageReview.appbindedbusinessAll,
    // reviewAppList: manageReview.reviewAppList
    // reviewDetail: manageReview.reviewDetail
  };
}, (dispatch) => ({
  dispatch(params) {
    return dispatch(params);
  },
  mergeReviewObj(params) {
    return dispatch({
      type: 'manageReview/mergeReviewObj',
      payload: params
    });
  },
  saveReviewObj(params) {
    dispatch({
      type: 'manageReview/saveReviewObj',
      payload: params
    });
  },
  mergeDept(params) {
    dispatch({
      type: 'manageReview/mergeDept',
      payload: params
    });
  },

  fetchDept(params) {
    dispatch({
      type: 'manageReview/fetchDept',
      payload: params
    })
  },
  saveDept(params) {
    dispatch({
      type: 'manageReview/saveDept',
      payload: params
    })
  },
  permissionReviewEdit(params) {
    return dispatch({
      type: 'manageReview/editPermissionReview',
      payload: params
    })
  },

  getAppBindedBusiness(params) {
    dispatch({
      type: 'manageReview/getAppBindedBusiness',
      payload: params
    })
  },
  getAppBindedBusinessAll(params) {
    dispatch({
      type: 'manageReview/getAppBindedBusinessAll',
      payload: params
    })
  },

  addReview(params) {
    return dispatch({
      type: 'manageReview/addReview',
      payload: params
    });
  },
  getBusiness() {
    return dispatch({
      type: 'manageReview/getBusiness'
    })
  },
  getDataType(params) {
    return dispatch({
      type: 'manageReview/getDataType',
      payload: params
    });
  }

}))(Form.create(

)(ReviewEdit));
