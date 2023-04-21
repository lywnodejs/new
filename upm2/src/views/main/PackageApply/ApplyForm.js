import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import connect from '@utils/translateConnect';
// import { bpmHost } from '@config/apiConfig';
import { translate } from 'react-i18next';
import { MAIN } from '@routes/config';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Select,
  message,
  DatePicker,
  Row,
  Modal,
  Spin,
  Collapse,
  Icon,
  Steps
} from 'antd';
import { saveRef } from '@components/util';
import UserSelector from '@components/UserSelector';
import UserSelectorBatch from '@components/UserSelectorBatch';
import './ApplyForm.less';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
const { Panel } = Collapse;
const { Step } = Steps;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const required = { required: true, message: '必填' };
const types = {
  2: '角色',
  3: '地区',
  4: '标识位',
  6: '资源'
};

class ApplyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisiable: false,
      currentWorkflowName: null,
      btnLoading: false,
      isBatchForUserSelector: false // 用户名批量录入标记
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'packageApply/getPackageCountries',
      payload: {
        appId: 888
      }
    });
    this.handleCountryChange();
  }

  /**
   * 代他人申请时清空申请人，反之设置为登录名
   */
  changForOthers = e => {
    const { form, userInfo } = this.props;

    form.setFieldsValue({
      username: e.target.checked
        ? []
        : { key: userInfo.username, label: userInfo.username }
    });
    this.setState({
      isBatchForUserSelector: false
    });
  };

  /**
   * 国家变更时候的处理逻辑
   */
  handleCountryChange = country => {
    const { dispatch } = this.props;

    dispatch({
      type: 'packageApply/getCategoriesByCountry',
      payload: {
        appId: 888,
        country: country || this.props.params.country
      }
    }).then(() => {
      dispatch({
        type: 'packageApply/updateParams',
        payload: {
          categoryId: '',
          packageId: ''
        }
      });
    });
  };

  /**
   * 礼包分类变更时候的处理逻辑
   */
  handleCategoryChange = categoryId => {
    const { dispatch, params } = this.props;
    const { country } = params;

    dispatch({
      type: 'packageApply/getPackageByCondition',
      payload: {
        appId: 888,
        country,
        categoryId
      }
    }).then(() => {
      dispatch({
        type: 'packageApply/updateParams',
        payload: {
          packageId: ''
        }
      });
    });
  };

  onCheckWorkflow = () => {
    const { params, dispatch, userInfo, t } = this.props;
    const { username, isApplyForOthers, packageId, categoryId } = params;
    const fetchWorkflowPayload = [];
    let showworkflow = true;

    // 未选权限类型，不让预览审批流
    if (!categoryId) {
      message.destroy();
      message.warning(t('还没有选择要申请的礼包'));
      showworkflow = false;
      return;
    }

    dispatch({
      type: 'packageApply/getPermissionsByPackageId',
      payload: {
        appId: 888,
        id: packageId
      }
    }).then(() => {
      this.setState({
        modalVisiable: true
      });
    });
    // .then((res) => {
    //   if (res.success) {
    //     console.log(res);
    //     _.each(res.permissions, (rt) => {
    //       const applyTypeIsRole = rt == 2; // 角色 role
    //       const applyTypeIsFlag = rt == 4; // 标识位 flag

    //       if (isApplyForOthers && _.isEmpty(username)) {
    //         message.destroy();
    //         message.warning(t('还没有填写申请人'));
    //         return;
    //       }
    //       if (applyTypeIsRole) {
    //         fetchWorkflowPayload.push({
    //           type: rt,
    //           appId,
    //           role: params.resource_role,
    //           username: isApplyForOthers ? username : userInfo.username,
    //         })
    //       } else {
    //         fetchWorkflowPayload.push({
    //           type: rt,
    //           appId, resource:params[`resource_${rt}`],
    //           applyTypeIsFlag,
    //           username: isApplyForOthers ? username : userInfo.username,
    //         })
    //       }
    //     })
    //     if (showworkflow) {
    //       dispatch({
    //         type: 'packageApply/fetchWorkflowGroup',
    //         payload: fetchWorkflowPayload
    //       }).then(() => {
    //         this.setState({
    //           modalVisiable: true,
    //         });
    //       });
    //     }

    //   }
    // })
  };

  renderWorkflow = index => {
    const { params, dispatch, userInfo, t, permissions } = this.props;
    const { username, isApplyForOthers, packageId, categoryId } = params;
    const fetchWorkflowPayload = [];
    // let showworkflow = true;
    // const workflowData = {}
    // permissions.forEach(i => {
    //   if (workflowData[i.appId]) {
    //     if (workflowData[i.appId][i.bindType]) {
    //       workflowData[i.appId][i.bindType].push(i.entityId);
    //     } else {
    //       workflowData[i.appId][i.bindType] = [i.entityId];
    //     }
    //   } else {
    //     workflowData[i.appId] = {
    //       [i.bindType]: [i.entityId]
    //     };
    //   }
    // })
    // _.each(Object.keys(workflowData[appId]||{}), (rt) => {
    const rt = permissions[index].bindType;
    const appId = permissions[index].appId;
    const applyTypeIsRole = rt == 2; // 角色 role
    const applyTypeIsFlag = rt == 4; // 标识位 flag
    const applyTypeIsArea = rt == 3; // 地区 area
    const applyTypeIsData = rt == 6; // 资源 data
    const getUsernames = users => {
      return users.map(userItem => userItem.label).join(',');
    };
    if (isApplyForOthers && _.isEmpty(username)) {
      message.destroy();
      message.warning(t('还没有填写申请人'));
      return;
    }
    if (applyTypeIsRole) {
      fetchWorkflowPayload.push({
        type: 'role',
        appId,
        role: [permissions[index].entityId],
        username: isApplyForOthers ? getUsernames(username) : userInfo.username
      });
    } else if (applyTypeIsFlag) {
      fetchWorkflowPayload.push({
        type: 'flag',
        appId,
        resource: [permissions[index].entityId],
        applyTypeIsFlag,
        username: isApplyForOthers ? getUsernames(username) : userInfo.username
      });
    } else if (applyTypeIsArea) {
      fetchWorkflowPayload.push({
        type: 'area',
        resource: [permissions[index].entityId],
        appId,
        applyTypeIsArea,
        username: isApplyForOthers ? getUsernames(username) : userInfo.username
      });
    } else if (applyTypeIsData) {
      fetchWorkflowPayload.push({
        type: 'data',
        resource: [permissions[index].entityId],
        appId,
        applyTypeIsData,
        username: isApplyForOthers ? getUsernames(username) : userInfo.username
      });
    }
    // })
    // if (showworkflow) {
    dispatch({
      type: 'packageApply/fetchWorkflowGroup',
      payload: fetchWorkflowPayload
    }).then(() => {
      this.setState({
        modalVisiable: true
      });
    });
    // }
  };

  hideWorkflow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'packageApply/save',
      payload: {
        workflow: []
      }
    });
    this.setState({ modalVisiable: false });
  };

  onSubmit = e => {
    e.preventDefault();
    // console.log(this.props.form.getFieldValue('username'))
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        const { dispatch } = this.props;
        this.setState({
          btnLoading: true
        });
        dispatch({
          type: 'packageApply/addPackage'
        })
          .then(data => {
            const { t } = this.props;
            if (data.success) {
              message.success(t('提交成功'), 5, () => {
                location.href = '/upm2-static/main/apply';
                dispatch(routerRedux.push(`${MAIN}/apply`));
                dispatch({
                  type: 'packageApply/reset'
                });
              });
              // message.success(t('提交成功'))
              // dispatch(
              //   routerRedux.push(`${MAIN}/apply`),
              // );
              // dispatch({
              //   type: 'packageApply/reset',
              // });
            } else {
              message.error(t(data.result));
            }
          })
          .finally(() => {
            this.setState({
              btnLoading: false
            });
          });
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
    this.setState({
      isBatchForUserSelector: flag
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentWorkflowName, isBatchForUserSelector } = this.state;
    const {
      t,
      params,
      userInfo,
      packageCategories,
      packageList,
      packageCountries,
      workflow,
      permissions,
      loading,
      enumMap,
      bpmHost
    } = this.props;
    const { isApplyForOthers } = params;
    const workflowData = {};
    const workflowOptions = [];
    permissions.forEach(i => {
      if (workflowData[i.appId]) {
        workflowData[i.appId].push(i);
      } else {
        workflowData[i.appId] = [i];
        workflowOptions.push({
          data: i.appId,
          appName: i.appName
        });
      }
    });
    const { i18n } = this.props;
    const { language } = i18n;

    return (
      <Form onSubmit={this.onSubmit} className="apply_form">
        <FormItem
          {...formItemLayout}
          label={t('申请人邮箱前缀')}
          required={true}>
          <Col span={17}>
            <FormItem>
              {/* {getFieldDecorator('username', {
                rules: [required],
                initialValue: userInfo.username
              })(
                <Input
                  disabled={!isApplyForOthers}
                  placeholder={t('请输入公司邮箱前缀，多人用英文逗号分隔')}
                />
              )} */}
              {getFieldDecorator('username', {
                rules: [{ validator: this.handleUsernameCheck }],
                initialValue: {
                  key: userInfo.username || '',
                  label: userInfo.username || ''
                }
              })(
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
                      {t('批量添加')}
                    </Button>
                  )}
                </div>
              ) : null}
            </FormItem>
          </Col>
          <Col span={6} offset={1}>
            <FormItem>
              {getFieldDecorator('isApplyForOthers', {
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
        <FormItem {...formItemLayout} label={t('选择国家或地区')}>
          {getFieldDecorator('country', {
            // initialValue: 'China',
            rules: [required]
          })(
            <Select
              onChange={country => {
                this.handleCountryChange(country);
              }}
              showSearch>
              {_.map(packageCountries, (item, index) => {
                return (
                  <Option key={index} value={item}>
                    {t(`${item}`)}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请的礼包分类')}>
          {getFieldDecorator('categoryId', {
            // initialValue: [],
            rules: [required]
          })(
            <Select
              onChange={value => {
                this.handleCategoryChange(value);
              }}>
              {_.map(packageCategories, (item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {t(`${item.name}`)}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请的礼包名称')}>
          {getFieldDecorator('packageId', {
            rules: [required]
          })(
            <Select>
              {_.map(packageList, (item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {t(`${item.name}`)}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('权限的失效日期')}>
          {getFieldDecorator('expireTime', {
            rules: [required]
            // initialValue: moment().add(1, 'year')
          })(
            <DatePicker
              style={{ width: '100%' }}
              // disabledDate={this.setDisabledDate}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请理由')} required>
          {getFieldDecorator('remark', {
            rules: [required]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }}>
          {/* <Col span={language === 'zhCN' ? 6 : 10}> */}
          <Button
            className="new-apply-form-button"
            onClick={this.onCheckWorkflow}>
            {t('查看审批流程')}
          </Button>
          {/* </Col> */}
          {/* <Col span={10}> */}
          <Button
            className="new-apply-form-button"
            style={{ marginLeft: '12px' }}
            type="primary"
            size="default"
            htmlType="submit"
            loading={this.state.btnLoading}>
            {t('提交')}
          </Button>
          {/* </Col> */}
        </FormItem>

        <Modal
          title={t('审批流')}
          visible={this.state.modalVisiable}
          maskClosable={false}
          destroyOnClose={true}
          onCancel={this.hideWorkflow}
          width="90%"
          wrapClassName="new-apply-modal-wrapper"
          footer={
            <Button type="primary" onClick={this.hideWorkflow}>
              {t('确定')}
            </Button>
          }>
          <Form>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('审批流选择')}>
                  <Select
                    onChange={value => {
                      this.setState({ currentWorkflowName: value.label });
                      this.renderWorkflow(value.key);
                    }}
                    defaultValue={{ key: '', label: t('请选择') }}
                    labelInValue>
                    {/* <Option value="">{t('请选择')}</Option> */}
                    {_.map(permissions, (item, index) => {
                      return (
                        <Option key={index} value={index}>
                          {t(`${types[item.bindType]}`) + '-' + item.entityName}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  {/* <Button
                    // className="new-apply-form-button"
                    type="primary"
                    size="default"
                    htmlType="submit"
                  >
                    {t('查询')}
                  </Button> */}
                  <Button type="primary" onClick={this.hideWorkflow}>
                    {t('关闭')}
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          {workflow.length ? (
            <Spin
              spinning={loading.loadingWorkflow}
              indicator={<Icon type="loading" style={{ fontSize: 30 }} />}
              size="large">
              <Collapse defaultActiveKey={['0']}>
                {_.map(workflow, ({ userName, workflowInfos, type }, index) => (
                  <Panel
                    key={index}
                    header={t('{{ username }}的审批流-{{ type }}', {
                      username: userName,
                      type: currentWorkflowName
                    })}>
                    {_.map(
                      workflowInfos,
                      ({ name, roles, roleGroups, steps, bpmId, bpmKey }) => {
                        let panelHeader;
                        if (roles && roles[0] !== null) {
                          const roleNames = _.map(
                            roles,
                            ({ nameZh }) => nameZh
                          );
                          const roleGroupNames = _.map(
                            roleGroups,
                            ({ nameZh }) => nameZh
                          );

                          panelHeader =
                            _.join([...roleNames, ...roleGroupNames], ',') +
                            `-${name}`;
                        } else {
                          panelHeader = name;
                        }

                        return (
                          <Collapse
                            key={index}
                            bordered={false}
                            defaultActiveKey={['0']}>
                            <Panel header={panelHeader} key={0}>
                              {bpmId && bpmKey ? (
                                <iframe
                                  src={
                                    bpmHost + `/trace/${bpmId}?taskId=${bpmKey}`
                                  }
                                  frameBorder="0"
                                  width="100%"
                                  height="400"></iframe>
                              ) : (
                                <Steps className="workflow-steps">
                                  {_.map(steps, (step, stepIndex) => (
                                    <Step
                                      key={stepIndex}
                                      status="wait"
                                      title={t(
                                        enumMap.workflowenums.stepType[
                                          step.type
                                        ]
                                      )}
                                      description={_.map(
                                        step.approveUsers,
                                        ({ accountName }) => {
                                          return accountName;
                                        }
                                      ).join(',')}
                                    />
                                  ))}
                                </Steps>
                              )}
                            </Panel>
                          </Collapse>
                        );
                      }
                    )}
                  </Panel>
                ))}
              </Collapse>
            </Spin>
          ) : null}
        </Modal>
      </Form>
    );
  }
}

export default connect(({ packageApply, global, userInfo }) => {
  return {
    ...packageApply,
    enumMap: global.enumMap,
    userInfo,
    bpmHost: global.bpmHost
  };
})(
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
        type: 'packageApply/updateParams',
        payload: values
      });
    }
  })(translate()(ApplyForm))
);
