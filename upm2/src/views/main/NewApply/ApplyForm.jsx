import React from 'react';
import _ from 'lodash';
import { translate } from 'react-i18next';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Col,
  Icon,
  DatePicker,
  Popover,
  Modal
} from 'antd';
import moment from 'moment';
import SystemList from '../../../components/SystemList';
import RoleSelector from '../../../components/RoleSelector';
import StrategySetter from '../../../components/StrategySetter';
import TableSelector from '../../../components/TableSelector';
import InputTreeTag from '../../../components/InputTreeTag';
import request from '../../../utils/request';
import AvailableApps from '@components/AvailableApps';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};
const formItemLayout2 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const required = { required: true, message: '必填' };
// 对表单的rule中的提示，进行统一的语言转换

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, item => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

class ApplyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allAreas: [],
      idMap: {},
      ifShowArea: false
    };
    this.refTableSelector = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value.appId != this.props.value.appId) {
      this.getAreaItem(this.props.value.appId * 1);
      this.needShowArea(null, this.getAreas);
    }
  }

  setTextInputRef = e => {
    this.refTableSelector = e;
  };

  onSubmit = e => {
    e.preventDefault();

    const { form, handleSubmit, value } = this.props;

    if (Object.keys(value.role).length === 0 && value.resource[0]) {
      //角色申请
      const businessId = value.resource[0].businessId || this.getBusinessId();
      form.setFieldsValue({
        businessId: businessId * 1
      });
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { expireTime, ...others } = values;
        handleSubmit({
          expireTime: expireTime.valueOf(),
          ...others
        });
      }
    });
  };

  getStrategyFormItem() {
    const {
      form,
      loading,
      strategyList,
      dimensionIdMap,
      t,
      productLineList,
      resourceTypeList
    } = this.props;
    const { getFieldDecorator } = form;
    const { loadingStrategy } = loading;
    const role = form.getFieldValue('role');
    const resourceType = form.getFieldValue('resourceType');
    // 如果还未选择角色，则不显示策略
    if (_.isEmpty(role)) {
      return null;
    }
    const roleIdNameMap = {};
    for (let roleId in role) {
      roleIdNameMap[roleId] = role[roleId].label;
    }

    // 如果是大数据平台，且申请的不是角色
    if (!_.isEmpty(productLineList)) {
      if (resourceType != getIdByIdentifying(resourceTypeList, 'role')) {
        return null;
      }
    }

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

  getResourceTypeItem = () => {
    const { form, t, resourceTypeList, disabledResourceType } = this.props;
    if (disabledResourceType) {
      return null;
    }
    const { getFieldDecorator } = form;

    return (
      <FormItem {...formItemLayout} label={t('需要申请的权限类型')}>
        {getFieldDecorator('resourceType', {
          rules: [required]
        })(
          <Select onChange={this.handleResourceTypeChange}>
            {_.map(resourceTypeList, (rt, index) => {
              return (
                <Option key={index} value={rt.id}>
                  {t(`${rt.name}`)}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
    );
  };

  /**
   * 报表选择
   */
  getTableSelectorItem = () => {
    const {
      form,
      t,
      resourceList,
      resourceTypeList,
      handleFetchResource,
      value,
      current
    } = this.props;

    const { getFieldDecorator } = form;
    const resourceType = form.getFieldValue('resourceType');
    let shouldItemRender = false;
    let itemLabelName = '';

    if (_.isEmpty(resourceList)) {
      return null;
    }

    // 如果选择的申请类型是角色要隐藏
    if (resourceType == getIdByIdentifying(resourceTypeList, 'role')) {
      return null;
      // shouldItemRender = true;
      // itemLabelName = t('角色选择');
    }

    if (
      resourceType == getIdByIdentifying(resourceTypeList, 'bigdata_report')
    ) {
      shouldItemRender = true;
      itemLabelName = t('报表选择');
    }

    if (
      resourceType ==
      getIdByIdentifying(resourceTypeList, 'bigdata_extraction_tool')
    ) {
      shouldItemRender = true;
      itemLabelName = t('模板选择');
    }
    return shouldItemRender ? (
      <FormItem {...formItemLayout} label={itemLabelName}>
        {getFieldDecorator('resource', {
          rules: [required]
        })(
          <TableSelector
            t={t}
            ref={this.setTextInputRef}
            appId={value.appId}
            resourceList={resourceList}
            resourceTypeList={resourceTypeList}
            resourceTypeId={resourceType}
            handleFetchResource={handleFetchResource}
            needShowCloseBtn={true}
            handleChange={this.needShowArea}
            current={current}
            mask={true}
          />
        )}
      </FormItem>
    ) : null;
  };

  getAreaItem = (appId, businessId) => {
    if (!businessId) {
      businessId = this.getBusinessId();
      if (!businessId) return;
    }
    const success = res => {
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
    };
    const fail = err => {
      console.log(err);
    };
    request(`/area/select/tree?appId=${appId}&businessId=${businessId}`).then(
      success,
      fail
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

  handleNewAreaChange = area => {
    const { form } = this.props;
    form.setFieldsValue({ region: area });
  };

  handleResourceTypeChange = () => {
    this.setState({
      ifShowArea: false
    });
    this.props.form.setFieldsValue({
      resource: [],
      region: []
    });
    // this.refTableSelector ? this.refTableSelector.handlePageChange(1) : null
  };

  getInitalArea(data) {
    return data && data.hasOwnProperty('appId')
      ? data.properties.some(
          pro => pro.attrName === 'applyArea' && pro.attrValue === '1'
        )
      : false;
  }

  needShowArea = (record, callback) => {
    const { resourceList, value, initialFieldsValue } = this.props;

    if (record && record.length > 0) {
      this.setState(
        {
          ifShowArea: record[0].applyArea == 1
        },
        () => {
          if (this.state.ifShowArea) {
            this.getAreaItem(this.props.value.appId, record[0].businessId);
            this.getAreas(record);
          }
        }
      );
      return;
    }
    const { resource } = value;
    const needRenderCities =
      value &&
      value.applyRoleDtos &&
      value.applyRoleDtos.length &&
      value.applyRoleDtos[0].areaDtos &&
      value.applyRoleDtos[0].areaDtos.length > 0;

    // 选中的resource，同时在resourceList.records[].properties[].applyArea为1才显示，如果是0则不显示
    // resource里面的value和resourceList.records[].id相对应
    const recordsHash = {};
    resource.forEach(val => {
      recordsHash[val.value] = val;
    });

    const ifShowArea =
      this.getInitalArea(initialFieldsValue) ||
      (resourceList
        ? resourceList.records
          ? resourceList.records.some(val => {
              if (val.properties) {
                return (
                  !!recordsHash[val.id] &&
                  val.properties.some(
                    pro => pro.attrName === 'applyArea' && pro.attrValue === '1'
                  )
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

  getRegionItem = () => {
    if (this.state.ifShowArea) {
      const { t, form } = this.props;
      const { getFieldDecorator } = form;
      let { allAreas, idMap } = this.state;
      return (
        <div className="city-wrapper">
          <FormItem {...formItemLayout} label={t('新增城市')}>
            {getFieldDecorator('region', {})(
              <InputTreeTag
                options={allAreas}
                idMap={idMap}
                onChange={v => this.handleNewAreaChange(v)}
              />
            )}
          </FormItem>
          <label className="city-tip">
            {t('如需增加城市数据范围，请添加；如已获授权，无需添加')}
          </label>
        </div>
      );
    } else {
      return null;
    }
  };

  getAreasItem = () => {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;
    const { ifShowArea } = this.state;

    if (ifShowArea) {
      return (
        <div className="city-wrapper">
          <FormItem {...formItemLayout} label={t('已有地区')}>
            {getFieldDecorator('currentArea', {})(
              <Select disabled mode="tags" style={{ width: '100%' }}></Select>
            )}
          </FormItem>
          <label className="city-tip" style={{ color: 'red' }}>
            {t('如需更多城市授权，请在上方“新增城市”选择要查看的城市')}
          </label>
        </div>
      );
    } else {
      return null;
    }
  };

  getAreas = record => {
    const { value, form } = this.props;
    const { appId } = value;
    if (this.state.ifShowArea && appId) {
      request(
        `/v2/apply/getUserAreas?appId=${appId}&businessId=${
          record && record.length > 0
            ? record[0].businessId
            : this.getBusinessId()
        }`
      ).then(res => {
        let data = [];
        if (res) {
          res.map(item => {
            data.push(item.name);
          });
        }
        form.setFieldsValue({
          currentArea: data
        });
      });
    }
  };

  getRoleFormItem = () => {
    const {
      t,
      form,
      roleOptions,
      loading,
      resourceTypeList,
      showRole
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const appId = getFieldValue('appId');
    const resourceType = form.getFieldValue('resourceType');

    if (!showRole) {
      if (resourceType != getIdByIdentifying(resourceTypeList, 'role')) {
        return null;
      }
    }

    return (
      <FormItem {...formItemLayout2} label={t('申请角色')} required={true}>
        {/* <Row> */}
        <Col span={12}>
          <FormItem>
            {getFieldDecorator('role', {
              // rules: [required, {
              //   validator: (rule, value, callback) => {
              //     if (_.isEmpty(value)) {
              //       callback(t('至少选择一个角色'));
              //     }
              //     else {
              //       callback();
              //     }
              //   }
              // }]
            })(
              <RoleSelector
                options={roleOptions}
                placeholder={t('请选择角色')}
                disabledPlaceholder={t('请先选择系统')}
                disabled={_.isUndefined(appId) || loading.loadingRole}
                appId={appId}
              />
            )}
          </FormItem>
        </Col>
        <Col span={5} offset={1}>
          {loading.loadingRole && (
            <span>
              <Icon type="loading" />
              {t('正在加载...')}
            </span>
          )}
        </Col>
        {/* </Row> */}
      </FormItem>
    );
  };

  setDisabledDate = current => {
    const { form } = this.props;
    const productLine = form.getFieldValue('productLine');
    let expireYear = 3;
    if (productLine == 'report') {
      expireYear = 2;
    }

    return (
      current &&
      (current.isBefore(moment(Date.now()).subtract(1, 'days')) ||
        current.isAfter(moment(Date.now()).add(expireYear, 'years')))
    );
  };

  openHelp = () => {
    const { t } = this.props;
    Modal.info({
      title: t('帮助'),
      width: '90%',
      content: (
        <section>
          {/* <p>
            <span style={{fontSize: '16px', fontWeight:'bold'}}>滴滴数据平台访问地址：bigdata.xiaojukeji.com &nbsp; --&gt; &nbsp;</span>
            <a href="http://bigdata.xiaojukeji.com" target="_blank" title="一键直达" style={{textDecoration: 'underline', fontSize: '16px', fontWeight: 'bold'}}>点我一键直达</a>
          </p>
          <p>
            <span style={{fontSize: '16px', fontWeight:'bold'}}>快速了解平台能力和学习使用 --&gt;&nbsp;</span>
            <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=100439589" target="_blank" title="点我了解如何使用" style={{textDecoration: 'underline', fontSize: '16px', fontWeight:'bold'}}>点我查看用户指南</a>
            <span style={{fontSize: '16px', fontWeight:'bold'}}>，有问题可钉我 --&gt;“滴滴数据平台”服务号反馈</span>
          </p>
          <p>
            <span style={{fontSize: '16px'}}>
              <span style={{color: 'rgb(255, 0, 0)'}}>【实时监控】请跳转到</span>：
              <a href="http://upm.xiaojukeji.com/index.html#/apply/apply?id=6468">http://upm.xiaojukeji.com/index.html#/apply/apply?id=6468</a>&nbsp;
              <span style={{color: 'rgb(255, 0, 0)'}}>申请</span>
            </span>
          </p>
          <p style={{fontSize: '14px'}}>【全链路质量监控】、【行为分析及行为分析应用】申请对应的“角色权限”</p>
          <p style={{fontSize: '14px'}}>
            【用户画像】
            <span>国内标签系统权限申请，请查看
              <a href="http://dc.tt/tagfaq" target="_blank">国内申请指南</a>
              ，国际化标签系统权限申请，请查看
              <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=121516542" target="_blank">国际版申请指南</a>
            </span>
          </p>
          <p style={{fontSize: '14px'}}>
            【通用报表（查看）】、【提取工具】的报表或者模板权限前往滴滴数据平台申请(
            <a style={{textDecoration: 'none'}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=118854063" target="_blank">点我查看申请指南</a>
            )
          </p>
          <p style={{fontSize: '14px'}}>
            【通用报表&nbsp;（配置）】无需在权限系统申请，发送邮件至
            <a href="mailto:data.pm@didichuxing.com" style={{textDecoration: 'none'}}>data.pm@didichuxing.com</a>
            申请通用报表开发者权限
          </p>
          <p style={{fontSize: '14px'}}>
            【Tableau】在权限系统申请“地区权限”，在Tableau申请工作簿查看权限（
            <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=100439589" target="_blank" style={{textDecoration: 'underline'}}>点我查看用户指南</a>
            ）
          </p>
          <p style={{fontSize: '14px'}}>
            【滴滴数据APP】拥有PC权限后可直接前往APP端查看（
            <a href="http://zhushou.xiaojukeji.com/h5/originDownload/3808/1492591742587/sso" target="_blank" style={{textDecoration: 'underline'}}>点击下载</a>
            ）
          </p> */}
        </section>
      ),
      onOk() {}
    });
  };

  iconStyle() {
    return this.props.showIcon
      ? 'bigData-help-info show-icon'
      : 'bigData-help-info';
  }

  render() {
    const {
      form,
      t,
      moreButtons,
      /* 支持 disabled 多个表单域 */
      // 是否禁用 子系统选择
      disabledAppId,
      // 是否禁用 代他人申请
      disabledApplyForOthers,
      // 是否禁用 申请理由（如：在管理端直接给用户赋权限时，不需要填理由）
      disabledReason,
      useAvailableApps
    } = this.props;

    const { getFieldDecorator } = form;
    const isApplyForOthers = form.getFieldValue('isApplyForOthers');

    return (
      <Form onSubmit={this.onSubmit}>
        <FormItem
          {...formItemLayout2}
          label={t('申请人邮箱前缀')}
          required={true}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [required]
              })(
                <Input
                  disabled={!isApplyForOthers}
                  placeholder={t('请输入公司邮箱前缀，多人用英文逗号分隔')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3} offset={1}>
            <FormItem>
              {!disabledApplyForOthers &&
                getFieldDecorator('isApplyForOthers', {
                  valuePropName: 'checked'
                })(<Checkbox>{t('代他人申请')}</Checkbox>)}
            </FormItem>
          </Col>
        </FormItem>
        <FormItem {...formItemLayout} label={t('需要申请访问的系统')}>
          {/* <Icon type="info-circle-o" className={ this.iconStyle() } onClick={this.openHelp}/> */}
          {getFieldDecorator('appId', {
            rules: [required]
          })(
            useAvailableApps ? (
              <AvailableApps disabled />
            ) : (
              <SystemList
                placeholder={t('请选择要申请权限的目标系统')}
                disabled={disabledAppId}
                useAvailableApps={useAvailableApps}
              />
            )
          )}
        </FormItem>

        {this.getResourceTypeItem()}
        {this.getTableSelectorItem()}
        {this.getRegionItem()}
        {this.getAreasItem()}

        {this.getRoleFormItem()}
        {this.getStrategyFormItem()}

        <FormItem {...formItemLayout} label={t('权限的失效日期')}>
          {getFieldDecorator('expireTime', {
            rules: [
              {
                required: true,
                message: t('必填')
              }
            ],
            initialValue: moment().add(1, 'year')
          })(
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={this.setDisabledDate}
            />
          )}
        </FormItem>

        {!disabledReason && (
          <FormItem {...formItemLayout} label={t('您申请权限的理由')}>
            {getFieldDecorator('reason', {
              rules: [
                required,
                {
                  max: 100,
                  message: t('最大 100 个字符')
                }
              ]
            })(<TextArea rows={4} />)}
          </FormItem>
        )}

        <FormItem wrapperCol={{ offset: 4 }}>
          <Col span={4}>
            <Button
              className="new-apply-form-button"
              type="primary"
              size="default"
              htmlType="submit">
              {t('提交')}
            </Button>
          </Col>
          <Col span={16}>{moreButtons}</Col>
        </FormItem>
        <FormItem>
          {getFieldDecorator('businessId', {})(<Input type="hidden"></Input>)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.value, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },
  onValuesChange(props, values) {
    props.onChange(values);
  }
})(translate()(ApplyForm));
