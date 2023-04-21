import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Space,
  Input,
  Modal,
  Form,
  Col,
  Row,
  Statistic,
  message,
} from 'antd';
import { useSafeState } from '@didi/cx-react-hooks';
import { ModleSelect, PermissionTypesSelect, PermissionIDSelect, StrategyTypeSelect } from '../selectModules/index';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { PackClass, PackName } from '../../../permission/component/allSelect';
import _ from 'lodash';
import moment from 'moment';
import exportExcel from '@/utils/excel';
import {
  queryExecuteCount,
  insertOrUpdate,
  getStrategyQueryDetail,
  queryExecuteNames
} from '@/utils/api/manageLog';
import {
  RuleCompose,
  createNewGroup,
  convertFormDataToValue,
  convertValueToFormData,
} from './RuleCompose';
import { getResponseData } from '@/utils/api/path';
import { WorkSelect } from '@/components/WorkObligation';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const colLayout = {
  span: 24,
};
const PERMISSION_TYPE_ID = 0; // 权限包
const PERMISSION_JOB_ID = 100; // 工作职责
const STRATEGY_TYPE = 2; // 策略类型

export const EditModal = props => {
  const [form] = Form.useForm();
  const packNameFormRef: any = useRef();
  const [title, setTitle] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [checkPersonLoad, setCheckPersonLoad] = useState(false);
  const [packNameDisabled, setpackNameDisabled] = useState(true);
  const [searchPersonLoad, setSearchPersonLoad] = useState(false);
  const [statusDisabled, setStatusDisabled] = useState(true);
  const [strategyType, setStrategyType] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [personCurrent, setPersonCurrent] = useState('？？？');
  const [PermissionType, setPermissionType] = useState(Number);

  // 初始的规则数据，优先从 record 中取，没取到则默认创建一个空分组
  const [strategyConfigs, setStrategyConfigs] = useSafeState(() => {
    // return props.record && props.record.strategyConfigs
    //   ? convertFormDataToValue(props.record.strategyConfigs)
    //   : [createNewGroup()];
    return [createNewGroup()];
  });

  useEffect(() => {
    setFormVisible(false);
    if (props.type === 'New') {
      setTitle('新增策略');
    } else if (props.type === 'edit') {
      setTitle('编辑策略');
    } else if (props.type === 'Copy') {
      setTitle('复制策略');
    } else if (props.type === 'check') {
      setTitle('查看策略');
      setpackNameDisabled(true);
      setFormVisible(true);
    }
  }, [props.type])

  useEffect(() => {
    if (props.visible) {
      if (props.type === 'New') {
        form.setFieldsValue({
          onstatus: 0,
        });
      } else {
        resetModal();
        let params = {
          strategyId: props?.record?.strategyId,
        };

        // 获取策略详情
        getStrategyQueryDetail(params).then(res => {
          if (res && res.errno === 0 && !_.isEmpty(res.data)) {
            form.setFieldsValue({
              name: res.data.name,
              strategyDesc: res.data.strategyDesc,
              onstatus: props.type === 'Copy' ? 0 : res.data.onstatus,
              typeId: res.data.typeId,
              strategyType: res.data.strategyType,
              strategyOrder: res.data.strategyOrder,
              appid: res.data.appid
            }); // 设置上部分表单值

            if (props.type !== 'check') {
              res.data.strategyType === STRATEGY_TYPE && setStatusDisabled(false);
            }

            //设置执行顺序展开
            setStrategyType(res.data.strategyType);

            if (Array.isArray(res.data.packages) && !_.isEmpty(res.data.packages)) {
              let packageOne = res.data.packages[0];
              // 处理权限包
              if (packageOne.typeId === PERMISSION_TYPE_ID) {
                props.type !== 'check' && setpackNameDisabled(false);
                const arrValue = res.data.packages.map(item => {
                  return {
                    label: item.name,
                    value: item.permissionId + '',
                    key: item.permissionId + '',
                  };
                });
                form.setFieldsValue({
                  packages: packageOne.categoryId,
                  typeId: packageOne.typeId,
                  packagesName: arrValue,
                });
                packNameFormRef?.current?.getList(packageOne.categoryId);
              } else {
                // 其他类型单独处理
                const arrValue = res.data.packages.map(item => {
                  return item.permissionId
                });
                setPermissionType(packageOne.typeId)
                form.setFieldsValue({
                  typeId: packageOne.typeId,
                  permissionId: arrValue,
                });
              }
            }



            // 人员策略配置
            setStrategyConfigs(
              convertFormDataToValue(res.data.strategyConfigs),
            );

            // 设置命中人数
            props.type !== 'Copy' && setPersonCurrent(res.data.hitCount);

          }
        });
      }
    }
  }, [props.visible]);

  const packClassChange = val => {
    form?.setFieldsValue({
      packagesName: []
    })
    if (val) {
      packNameFormRef.current.getList(val);

      setpackNameDisabled(false);
    } else {
      setpackNameDisabled(true);
    }
  };

  const RuleComposeRef = React.useRef<any>();

  const ok = async type => {
    Promise.all([form.validateFields(), RuleComposeRef.current.validate()])
      .then(([formData, groups]) => {
        // 规则组
        const strategyConfigs = convertValueToFormData(groups);
        let params: any = {
          ...formData,
          strategyConfigs: strategyConfigs,
          strategyId: props?.record?.strategyId,
          packages: [],
        };
        delete params?.typeId;
        // 处理权限type权限包
        if (formData.typeId === PERMISSION_TYPE_ID) {
          formData.packagesName &&
            formData.packagesName.map(item => {
              params.packages.push({
                permissionId: item.value,
                name: item.label,
                categoryId: formData.packages,
                typeId: formData.typeId
              });
            });

          delete params?.packagesName;
        } else {

          // 其他情况
          if (formData.permissionId && Array.isArray(formData.permissionId)) {
            formData.permissionId &&
              formData.permissionId.map(item => {
                params.packages.push({
                  permissionId: item,
                  typeId: formData.typeId,
                })

              })
          } else {
            formData.permissionId && params.packages.push({
              permissionId: formData.permissionId,
              typeId: formData.typeId,
            })
          }
          delete params?.permissionId;
        }


        if (props.type === 'Copy' || props.type === 'New') {  // 复制时 不要id
          delete params.strategyId;
        }

        if (type === 'submit') { // 点击提交
          // 查看时 点击确定不需要请求
          if (props.type === 'check') {
            props.setIsVisible(false);
            resetModal();
            return
          }
          handelSubmit(params);
        } else if (type === 'checkPerson') { // 查看名单
          handelCheckPerson(params);
        } else if (type === 'scope') { // 查看范围
          handelScope(params);
        }
      })
      .catch(console.error);
  };

  // 点击提交
  const handelSubmit = params => {
    setConfirmLoading(true);
    insertOrUpdate(params).then(res => {
      if (res && res.errno === 0) {
        message.success(props.type === 'New' ? '新建成功' : props.type === 'Copy' ? '复制成功' : '修改成功');
        addTableParams({}, 'manage_empower_table');
        resetModalVal();
      } else {
        message.error(res.errmsg);
      }
    }).finally(() => {
      setConfirmLoading(false);
    })
  }

  const resetModalVal = () => {
    props.setIsVisible(false);
    resetModal();
  }

  const resetModal = () => {
    form.resetFields();
    setPersonCurrent('？？？');
    setStatusDisabled(true);
    setStrategyConfigs([createNewGroup()])
  }

  // 查看名单
  const handelCheckPerson = params => {
    setCheckPersonLoad(true);
    queryExecuteNames(params).then(res => {
      if (res && Array.isArray(res.data)) {
        tableToExcel(res.data)
      } else {
        message.error(res.errmsg);
      }
    }).finally(() => {
      setCheckPersonLoad(false);
    })
  };

  const tableToExcel = (json: Array<any>) => {
    if (json.length === 0) {
      message.error('无人员名单');
      return false;
    } else {
      const processList = json.map(rowData => {
        const row = {
          '账号': rowData.ldap,
          '姓名': rowData.name,
          '0级部门': rowData.deptName0,
          '1级部门': rowData.deptName1,
          '2级部门': rowData.deptName2,
          '3级部门': rowData.deptName3,
          '4级部门': rowData.deptName4,
          '5级部门': rowData.deptName5,
          '6级部门': rowData.deptName6,
          '岗位': rowData.post,
          '城市': rowData.locationName,
        };
        return row;
      });
      exportExcel(processList, '命中人员名单' + moment().format('-YYYYMMDD-HHmmss'));
    }
  }

  // 获取范围
  const handelScope = params => {
    setSearchPersonLoad(true);
    queryExecuteCount(params)
      .then(res => {
        if (res && res.errno === 0) {
          setPersonCurrent(_.get(res, 'data.hitCount', 0));
        } else {
          message.error(res.errmsg);
        }
      })
      .finally(() => {
        setSearchPersonLoad(false);
      });
  };
  const handelValuesChange = () => {
    setPersonCurrent('？？？');
  }

  return (
    <>
      <Modal
        title={title}
        width={800}
        visible={props.visible}
        onOk={() => {
          ok('submit');
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          props.setIsVisible(false);
          if (props.type !== 'New') {
            resetModal()
          }
        }}
      >
        <Form
          form={form}
          name="form_in_modal"
          layout={'horizontal'}
          {...layout}
          scrollToFirstError
          onValuesChange={handelValuesChange}
        >
          <Row>
            <Col {...colLayout}>
              <Form.Item
                label="策略名称"
                name="name"
                rules={[{ required: true, message: '请输入策略名称!' }]}
              >
                <Input
                  maxLength={50}
                  placeholder={'请输入'}
                  disabled={formVisible}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item
                label="策略描述"
                name="strategyDesc"
                rules={[{ required: true, message: '请输入策略描述!' }]}
              >
                <Input.TextArea
                  rows={4}
                  showCount
                  maxLength={300}
                  placeholder={'请输入'}
                  disabled={formVisible}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="策略状态" name="onstatus">
                <ModleSelect disabled={statusDisabled} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item
                label="策略类型"
                name="strategyType"
                rules={[{ required: true, message: '请选择策略类型!' }]}
              >
                <StrategyTypeSelect
                  disabled={formVisible}
                  onChange={val => {
                    if (val === STRATEGY_TYPE) {
                      setStatusDisabled(false);
                    } else {
                      setStatusDisabled(true);
                      form.setFieldsValue({
                        onstatus: 0
                      })
                    }
                    setStrategyType(val);
                    form.setFieldsValue({
                      strategyOrder: null,
                      appid: null
                    })
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          {
            strategyType === STRATEGY_TYPE && (<>
              <Row>
                <Col {...colLayout}>
                  <Form.Item
                    label="appid"
                    name="appid"
                    rules={[{ required: true, message: '请输入执行顺序!' }]}
                  >
                    <Input
                      placeholder="请输入"
                      disabled={formVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col {...colLayout}>
                  <Form.Item
                    label="执行顺序"
                    name="strategyOrder"
                    rules={[{ required: true, message: '请输入执行顺序!' }]}
                  >
                    <Input
                      type={'number'}
                      placeholder="请输入"
                      disabled={formVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>)
          }

          <Row>
            <Col {...colLayout}>
              <Form.Item
                label="权限类型"
                name="typeId"
                rules={[{ required: true, message: '请选择权限类型!' }]}
              >
                <PermissionTypesSelect
                  disabled={formVisible}
                  placeholder={'请选择'}
                  onChange={val => {
                    setPermissionType(form.getFieldValue('typeId'))
                    form.setFieldsValue({
                      permissionId: [],
                      packages: null,
                      packagesName: []
                    })
                    setpackNameDisabled(true);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          {
            PermissionType === PERMISSION_TYPE_ID &&
            (<>
              <Row>
                <Col {...colLayout}>
                  <Form.Item
                    label="权限包分类"
                    name="packages"
                    rules={[{ required: true, message: '请选择权限包分类!' }]}
                  >
                    <PackClass
                      onChange={packClassChange}
                      placeholder={'请选择'}
                      disabled={formVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col {...colLayout}>
                  <Form.Item
                    label="权限包名称"
                    name="packagesName"
                    rules={[{ required: true, message: '请选择权限包名称!' }]}
                  >
                    <PackName
                      labelInValue
                      mode="multiple"
                      ref={packNameFormRef}
                      disabled={packNameDisabled}
                      placeholder={'请选择'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>)
          }
          {
            PermissionType === PERMISSION_JOB_ID &&
            (<Row>
              <Col {...colLayout}>
                <Form.Item
                  label="工作职责"
                  name="permissionId"
                  rules={[{ required: true, message: '请输入工作职责!' }]}
                >
                  <WorkSelect
                    placeholder={'请选择'}
                    disabled={formVisible}
                  />
                </Form.Item>
              </Col>
            </Row>)
          }
          {
            (PermissionType !== PERMISSION_TYPE_ID && PermissionType !== PERMISSION_JOB_ID) &&
            (<Row>
              <Col {...colLayout}>
                <Form.Item
                  label="权限ID"
                  name="permissionId"
                  rules={[{ required: true, message: '请输入权限ID!' }]}
                >
                  <PermissionIDSelect
                    placeholder={'请输入'}
                    notFoundContent={'请输入'}
                    disabled={formVisible}
                  />
                </Form.Item>
              </Col>
            </Row>)
          }

          <Row>
            <Col {...colLayout}>
              <Form.Item label="人员配置">
                <RuleCompose
                  ref={RuleComposeRef}
                  disabled={formVisible}
                  value={strategyConfigs}
                  onChange={val => {
                    setStrategyConfigs(val)
                    setPersonCurrent('？？？');
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              span="24"
              style={{ borderTop: '1px solid #d9d9d9', paddingTop: '10px' }}
            >
              {/* <Form.Item> */}

              <Statistic
                className="editModal__statistic-num"
                title="命中范围："
                value={personCurrent}
                suffix={'人'}
              />
              <p className="editModal__statistic-num-right">
                <Button
                  type={'link'}
                  loading={checkPersonLoad}
                  disabled={form.getFieldValue('onstatus') === 2}
                  onClick={() => {
                    ok('checkPerson');
                  }}
                >
                  查看名单
                </Button>
                <Button
                  size={'small'}
                  type={'primary'}
                  loading={searchPersonLoad}
                  disabled={form.getFieldValue('onstatus') === 2}
                  onClick={() => {
                    ok('scope');
                  }}
                >
                  获取范围
                </Button>
              </p>

              {/* </Form.Item> */}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditModal;
