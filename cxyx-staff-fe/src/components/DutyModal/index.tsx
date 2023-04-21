import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Modal,
  Form,
  Tooltip,
  TreeSelect,
  Tag,
  Button,
  Result,
  message,
  Collapse,
  Card,
} from 'antd';
import _ from 'lodash';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Response, Duty } from '@/utils/constant';
import DutyAbledSelect from '@/components/DutyAbledSelect';
import { WorkSelect } from '@/components/WorkObligation';
import style from '@/style/system/guide/index.less';
import { modalTitleMap, sourceKeyMap } from './config';
import ListStep from './listStep';
import listStepStyle from '@/style/system/guide/listStep.less';
import { getQueryPackageInfo, updateEmployeeDuty } from '@/utils/api/formal';
import { applyJobDuty, queryJobDutyList } from '@/utils/api/permission';
import { renderOptionsByMap } from '@/utils/data';
import {
  ModalType,
  joinDcUrl,
  myApplyUrl,
  reportBpmUrl,
  useManualUrl,
} from '@/utils/constant';
import { formatTree } from '@/utils/tools';
import { getUserName } from '@/utils/auth';
import { dutyIsOther } from '@/utils/tools';
const { Panel } = Collapse;

type DutysDatas = Record<string, any>[];

const DutyModal = (props, ref) => {
  const { visible, type, form, closeModal, selectKey, record } = props;
  const isOnlyRead = type === ModalType.VIEW;
  useImperativeHandle(ref, () => ({
    packageInfoMap,
  }));

  const [curDuty, setCurDuty] = useState(null);
  const [permissionLoaing, setPermissionLoaing] = useState(false);
  const [permissionList, setPermissionList] = useState([]);
  // 选中信息打包存储
  const [packageInfoMap, setPackageInfoMap] = useState({});
  const [dutysDatas, setDutysData] = useState<DutysDatas>([]);
  const [submitIng, setSubmitIng] = useState(false);

  const fetchDutysData = async () => {
    const res = await queryJobDutyList.fetch();
    const { data } = res;
    setDutysData(data);
  };

  const fetchQueryPackageInfo = (dutyId, city?, _flags?) => {
    const params = {
      city: city || null,
      dutyId: dutyId,
      warehouses: _flags,
      ldap: getUserName(),
    };
    setPermissionLoaing(true);
    getQueryPackageInfo(params)
      .then(res => {
        if (res.errno === Response.Success) {
          const { data } = res;
          setPermissionList(data || []);
        }
      })
      .finally(() => {
        setPermissionLoaing(false);
      });
  };

  const dutyChange = dutyId => {
    const duty = dutysDatas.find(duty => duty.jobDutyId === dutyId);
    fetchQueryPackageInfo(dutyId);
    setCurDuty(duty);
  };

  /**
   * 各种选择框的选中事件
   * @param code 选中的值，多选为选中值的集合
   * @param option 选中的option，树为选中的 label 集合
   * @param source 权限资源数据
   * @param sourceKey 权限资源数据的 key
   */
  const selectChange = (code, option, source, sourceKey) => {
    const key = `${source.id}_${source.name}_${sourceKey}`;
    if (['areaInfo'].includes(sourceKey)) {
      const areas = option.map((item, index) => {
        return {
          id: code[index],
          name: item,
        };
      });
      packageInfoMap[key] = {
        showValue: [...option],
        data: {
          business: source[sourceKey]?.business,
          areas,
        },
      };
      setPackageInfoMap({ ...packageInfoMap });
      return;
    }
    if (['cityInfo', 'gwFlags', 'whFlags'].includes(sourceKey)) {
      packageInfoMap[key] = {
        showValue: [...option],
        data: [...code],
      };
      setPackageInfoMap({ ...packageInfoMap });
      return;
    }
    if (['goodsTypes'].includes(sourceKey)) {
      packageInfoMap[key] = {
        showValue: option.map(item => {
          return item.label;
        }),
        data: option?.map(item => item?.sourse),
      };
      setPackageInfoMap({ ...packageInfoMap });
      return;
    }
    packageInfoMap[key] = {
      showValue: option.map(item => {
        return item.label;
      }),
      data: [...code],
    };
    setPackageInfoMap({ ...packageInfoMap });
  };
  const init = async visible => {
    await fetchDutysData();
    if (visible) {
      form.setFieldsValue({
        dutyId: selectKey,
      });
    }
  };
  useEffect(() => {
    if (selectKey && !curDuty && dutysDatas?.length) {
      dutyChange(selectKey);
    }
  }, [dutysDatas]);

  useEffect(() => {
    init(visible);
  }, [visible]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  // 地区选择
  const areaInfoComp = (source, sourceKey) => {
    const treeData = formatTree(source?.areaInfo?.areasTree, 'id', 'name');
    return (
      <TreeSelect
        multiple
        showSearch
        treeData={treeData}
        treeNodeFilterProp="title"
        dropdownMatchSelectWidth={false}
        placeholder="请选择"
        allowClear
        disabled={isOnlyRead}
        onChange={(val, option) => selectChange(val, option, source, sourceKey)}
      ></TreeSelect>
    );
  };

  // 城市选择
  const cityInfoComp = (source, sourceKey) => {
    return (
      <TreeSelect
        multiple
        showSearch
        treeData={source?.cityInfo?.allCity?.children || []}
        treeNodeFilterProp="title"
        dropdownMatchSelectWidth={false}
        placeholder="请选择"
        allowClear
        disabled={isOnlyRead}
        onChange={(val, option) => selectChange(val, option, source, sourceKey)}
      ></TreeSelect>
    );
  };

  // 网格站标示位选择
  const gwFlagsComp = (source, sourceKey) => {
    const treeData = formatTree(
      source?.gwFlags?.orgInfos,
      'relEntity',
      'orgName',
    );
    return (
      <TreeSelect
        multiple
        showSearch
        treeData={treeData}
        treeNodeFilterProp="title"
        dropdownMatchSelectWidth={false}
        placeholder="请选择"
        allowClear
        disabled={isOnlyRead}
        onChange={(val, option) => selectChange(val, option, source, sourceKey)}
      ></TreeSelect>
    );
  };

  // 中心仓标示位选择
  const whFlagsComp = (source, sourceKey) => {
    const treeData = formatTree(
      source?.whFlags?.orgInfos,
      'relEntity',
      'orgName',
    );
    return (
      <TreeSelect
        multiple
        showSearch
        treeData={treeData}
        treeNodeFilterProp="title"
        dropdownMatchSelectWidth={false}
        placeholder="请选择"
        allowClear
        disabled={isOnlyRead}
        onChange={(val, option) => selectChange(val, option, source, sourceKey)}
      ></TreeSelect>
    );
  };

  // 商品选择
  const goodsTypesComp = (source, sourceKey) => {
    return renderOptionsByMap(
      source?.goodsTypes?.goodsTypesInfo || [],
      'goodsTypeId',
      'goodsTypeName',
      {
        mode: 'multiple',
        disabled: isOnlyRead,
        onChange: (val, option) => selectChange(val, option, source, sourceKey),
      },
      {
        needSourse: true,
      },
    );
  };

  const compMap = new Map([
    ['areaInfo', areaInfoComp],
    ['cityInfo', cityInfoComp],
    ['gwFlags', gwFlagsComp],
    ['whFlags', whFlagsComp],
    ['goodsTypes', goodsTypesComp],
  ]);

  const submitKeyMap = new Map([
    ['areaInfo', 'area'],
    ['cityInfo', 'cityCodes'],
    ['gwFlags', 'gwFlags'],
    ['whFlags', 'whFlags'],
    ['goodsTypes', 'staffEmployeeGoodsTypeVOS'],
  ]);

  const submit = () => {
    if (!curDuty?.jobDutyId) {
      message.info('请选择工作职责～');
      return;
    }
    setSubmitIng(true);
    const permission = [];
    const permissionKeys = [];
    permissionList.forEach(item => {
      permission.push({
        id: item.id,
        name: item.name,
        flags: [],
        area: {},
        staffEmployeeGoodsTypeVOS: [],
        cityCodes: [],
        whFlags: [],
        gwFlags: [],
      });
      permissionKeys.push(item.name);
    });
    // 整合字段
    const packageKeys = Object.keys(packageInfoMap);
    packageKeys.forEach(item => {
      const splits = item?.split('_');
      const appName = splits?.[1];
      const index = permissionKeys.indexOf(appName);
      const permissionItem = {
        [submitKeyMap.get(splits?.[2])]: packageInfoMap[item]?.data,
      };
      permission[index] = {
        ...permission[index],
        ...permissionItem,
      };
    });
    const params = {
      dutyDes: curDuty?.des,
      dutyType: dutyIsOther(curDuty?.jobDutyName) ? Duty.Other : Duty.Normal,
      ldap: getUserName(),
      dutyId: curDuty?.jobDutyId,
      dutyName: curDuty?.jobDutyName,
      permission,
    };
    if (type === ModalType.EMPOWER) {
      const _params = {
        ...params,
        employType: record.employType,
        ldap: record.ldap,
      };
      updateEmployeeDuty(_params).then(res => {
        closeModal();
        if (res.errno === Response.Success) {
          message.success('赋权成功～');
          return;
        }
        message.error(res.errmsg);
      });
      return;
    }
    applyJobDuty(params)
      .then(res => {
        closeModal();
        if (res.errno === Response.Success) {
          const { data } = res;
          Modal.success({
            icon: '',
            title: '申请职责权限',
            okText: '知道了',
            content: (
              <Result
                status="success"
                title={
                  <div style={{ fontSize: 14 }}>
                    <p>申请成功</p>
                    <p>
                      当前审批人{data?.managerName || '--'}(
                      {data?.managerLdap || '--'})
                    </p>
                    <p>审批通过可获取对应权限</p>
                    <a target="_blank" href={myApplyUrl}>
                      {'>> 查看详情 >>'}
                    </a>
                  </div>
                }
              />
            ),
          });
          return;
        }
        message.error(res.errmsg);
      })
      .finally(() => setSubmitIng(false));
  };

  const modalFooters = [
    <Button key="back" onClick={closeModal}>
      返回
    </Button>,
    !isOnlyRead && (
      <Button loading={submitIng} key="submit" type="primary" onClick={submit}>
        确认提交
      </Button>
    ),
  ];
  return (
    <Modal
      title={
        <>
          <span>{modalTitleMap.get(type)}</span>&nbsp;
          <Tooltip title="点击查看使用手册">
            <a target="_blank" href={useManualUrl}>
              <QuestionCircleOutlined />
            </a>
          </Tooltip>
        </>
      }
      visible={visible}
      width={800}
      destroyOnClose={true}
      onCancel={() => {
        setPackageInfoMap({});
        setCurDuty({});
        closeModal();
      }}
      footer={modalFooters}
      className={style.dutyModal}
    >
      <div className={style.noDutyTips}>
        <span>找不到职责/权限不对？ 请</span>
        <a target="_blank" href={reportBpmUrl}>
          上报
        </a>
        <span>或</span>
        <a target="_blank" href={joinDcUrl}>
          入群咨询
        </a>
      </div>
      <Form {...layout} form={form} preserve={false}>
        <ListStep
          title={
            <>
              <span className={listStepStyle.title}>Step1 选择工作职责 </span>
              <span className={listStepStyle.titleDes}>
                根据工作职责开通所需系统权限
              </span>
            </>
          }
        >
          <Form.Item
            style={{ marginBottom: '10px' }}
            name="dutyId"
            label="工作职责"
            rules={[{ required: true, message: '请选择工作职责' }]}
          >
            {type === ModalType.APPLY ? (
              <DutyAbledSelect onChange={dutyChange} />
            ) : (
              <WorkSelect
                labelInValue
                disabled={isOnlyRead}
                onChange={params => {
                  dutyChange(params?.value);
                }}
              />
            )}
          </Form.Item>
          <div style={{ padding: '0 0 0 200px' }}>
            职责描述：{curDuty?.des || '-'}
          </div>
        </ListStep>
        <ListStep
          title={
            <>
              <span className={listStepStyle.title}>Step2 选择地区/仓库</span>
            </>
          }
          loading={permissionLoaing}
        >
          {permissionList.length ? (
            permissionList.map((source, index) => {
              const sourceKeys = Object.keys(source);
              return sourceKeys.map((sourceKey, idx) => {
                const comp = compMap.get(sourceKey);
                if (!comp) {
                  return null;
                }
                const label = `${source.name}-${source[sourceKey].resourceName}`;
                return (
                  // 匹配到展示字段 且 展示字段中存在数据
                  sourceKeyMap.includes(sourceKey) &&
                    (source[sourceKey].areasTree?.length > 0 ||
                      source[sourceKey].allCity?.children?.length > 0 ||
                      source[sourceKey].goodsTypesInfo?.length > 0 ||
                      source[sourceKey].orgInfos?.length > 0) ? (
                    <Form.Item
                      style={{ marginBottom: '10px' }}
                      name={`${source.id}_${source.name}_${sourceKey}`}
                      key={`${source.id}_${source.name}_${sourceKey}`}
                      label={
                        <Tooltip
                          title={label}
                          className={listStepStyle.sourceName}
                        >
                          {label}
                        </Tooltip>
                      }
                    >
                      {comp(source, sourceKey)}
                    </Form.Item>
                  ) : null
                );
              });
            })
          ) : (
            <p className={style.noData}>暂无地区/仓库可选择</p>
          )}
        </ListStep>
        <Collapse
          bordered={false}
          expandIcon={null}
          style={{ background: '#fff' }}
        >
          <Panel
            className={style.panelStep3}
            header={
              <>
                <span
                  style={{ fontSize: '14px', color: '#000' }}
                  className={listStepStyle.title}
                >
                  Step3 权限明细{' '}
                </span>
                <span style={{ fontSize: '12px', color: '#000' }}>
                  分配成功后，将为您开通一下系统的权限点
                </span>
              </>
            }
            key="1"
          >
            <div>
              {permissionList?.length > 0 ? (
                permissionList.map((row, index) => {
                  const formData = form.getFieldsValue();
                  const curKeys = Object.keys(formData).filter(formDataKey => {
                    const appName = formDataKey?.split('_')?.[1];
                    return (
                      appName === row.name && formData[formDataKey]?.length > 0
                    );
                  });
                  return (
                    <Card
                      key={`step3${index}`}
                      title={row.name}
                      style={{ marginBottom: '10px' }}
                      size="small"
                    >
                      <Form.Item
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="角色"
                        style={{ marginBottom: 0 }}
                      >
                        {row?.roleInfos?.length
                          ? row?.roleInfos?.map(role => (
                              <Tag key={role.id}>{role.name}</Tag>
                            ))
                          : '-'}
                      </Form.Item>
                      {curKeys.map(formKey => {
                        const keySplit = formKey.split('_'); // 分割 key 例如： areaInfo_yyt-test_4_7
                        const sourceKey = keySplit[2];
                        return (
                          <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            style={{ marginBottom: 0 }}
                            label={row[sourceKey]?.resourceName}
                            key={formKey}
                          >
                            {packageInfoMap[formKey]?.showValue?.map(
                              (item, index) => {
                                return (
                                  <Tag key={`${item}_${index}`}>{item}</Tag>
                                );
                              },
                            )}
                          </Form.Item>
                        );
                      })}
                    </Card>
                  );
                })
              ) : (
                <p className={style.noData}>暂无权限明细</p>
              )}
            </div>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  );
};

export default forwardRef(DutyModal);
