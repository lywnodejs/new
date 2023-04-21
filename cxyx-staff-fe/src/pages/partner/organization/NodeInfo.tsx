import React, { useEffect, useState, useRef } from 'react';
import {
  Collapse,
  Card,
  Space,
  Button,
  Row,
  Col,
  Tooltip,
  message,
  Tag,
  Form
} from 'antd';
import { CaretRightOutlined, RedoOutlined } from '@ant-design/icons';
import style from './style.less';
import JobTypeSelect from '@/components/JobTypeSelect';
import StaffJobTable from './component/StaffJobTable';
import WarehouseManage from './component/WarehouseManager';
import { fetchOrganizationNode } from '@/utils/api/organization';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import _, { floor } from 'lodash';
import {
  addTableParams,
  setTableParams,
} from '@/components/EasyTable/EasyParamStore';
import StaffBindModal from './component/StaffBindModal';
import ExternalPersonSelect from '@/components/ExternalPersonSelect';
import { writeOrganizationNode } from '@/utils/api/organization';
import { getResponseData } from '@/utils/api/path';
import { updateWarehouseManager } from '@/utils/api/common';
import { OPERATE_TYPE } from '@/pages/partner/organization/constant';
const { Panel } = Collapse;


const gutter = {
  gutter: 24,
  style: {
    marginBottom: '10px'
  }
}
const gutterNoMagin = {
  gutter: 24,
}

const NodeInfo = props => {
  const NODETYPE = 'WH';
  const formRef: any = useRef();
  const warehouseformRef: any = useRef();
  const [nodeDetail, setNodeDetail] = useState<any>();
  const [showTable, setShowTable] = useState(false);
  const [operateType, setOperateType] = useState(OPERATE_TYPE.SHOW);
  const [finishing, setFinishing] = useState(false);
  const [bindModalVisible, setBindModalVisible] = useState(false);
  const [detailVal, setDetailVal] = useState([]);
  const [warehouseDetailVal, setWarehouseDetailVal] = useState({
    name: '2323',
    ldap: '3232333'
  });
  const [selectedJobTypeId, setSelectedJobTypeId] = useState();
  const [warehouseManageShow, setWarehouseManageShow] = useState(false);
  const [warehouseManageLoad, setWarehouseManageLoad] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(props.selectedNode)) {
      setOperateType(OPERATE_TYPE.SHOW);
      setWarehouseManageShow(false);
      props.setLoading(true);
      fetchOrganizationNode(props.selectedNode.key)
        .then(res => {
          if (res) {
            if (0 == res.errno) {
              setNodeDetail(_.get(res, 'data', {}));
              getorgManager(res.data?.orgManager);
              setWarehouseDetailVal(res.data?.warehouseManager)
              formRef?.current?.setFieldsValue({
                orgManager: getorgManager(res.data?.orgManager)
              })
              warehouseformRef?.current?.setFieldsValue({
                warehouseManage: res.data?.warehouseManager || null
              })
            } else {
              message.error(res.errmsg);
            }
          }
        })
        .finally(() => {
          props.setLoading(false);
        });
    } else {
      setNodeDetail({});
      setDetailVal([])
      formRef?.current.resetFields();
    }
  }, [props.selectedNode]);

  const getorgManager = (val) => {
    if (val) {
      let arr = [];
      let str = val;
      let dataList = [];
      str.split(',').map(item => {
        arr.push(item.split(':')[0])
        dataList.push({
          value: item.split(':')[0],
          label: item.split(':')[0] + ' ' + item.split(':')[1]
        })
      })
      setDetailVal(dataList);
      return arr
    } else {
      setDetailVal([]);
      return []
    }


  }

  useEffect(() => {
    if (!_.isEmpty(nodeDetail)) {
      setSelectedJobTypeId(undefined);
      setTableParams(
        { page: 1, size: 5, orgId: nodeDetail.orgId },
        'staff_job_table',
      );
      setTableParams(
        { page: 1, size: 10, orgId: nodeDetail.orgId },
        'staff_bind_table',
      );
      setShowTable(true);
    }
  }, [nodeDetail]);

  const handleEditFinish = () => {
    let orgManager = formRef?.current?.getFieldValue('orgManager').join(',');
    let params = {
      operatorType: 1,
      orgId: nodeDetail.orgId,
      orgManager: orgManager || null,
      orgName: nodeDetail.orgName,
      orgType: nodeDetail.orgType,
      parentId: nodeDetail.parentOrgId,
      relEntity: nodeDetail.relEntity,
    }
    handleSubmitting(true);
    writeOrganizationNode(params)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success('编辑节点成功');
          // console.log(props.node);

          const changedParentId = nodeDetail.parentOrgId;
          addTableParams({ changedParentId }, 'node_tree');
        }
      })
      .finally(() => {
        handleSubmitting(false);
      });

  };

  const handleSubmitting = loading => {
    setFinishing(loading);
    if (!loading) {
      setOperateType(OPERATE_TYPE.SHOW);
    }
  };
  const handleEditManage = () => {
    let ldap = warehouseformRef?.current?.getFieldValue('warehouseManage') || ''
    let params = {
      ldap: ldap || null,
      orgId: props.selectedNode.key
    }
    setWarehouseManageLoad(true);
    updateWarehouseManager(params).then(res => {
      if (res && res.errno === 0) {
        message.success('编辑成功');
        setWarehouseManageShow(false);
      } else {
        message.error(res.errmsg);
      }
    }).finally(() => {
      setWarehouseManageLoad(false);
    })
  }

  return (
    <Card bodyStyle={{ padding: 15 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Collapse
          collapsible="header"
          defaultActiveKey={['0']}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel header={<div style={{ width: '100%' }}>基础信息</div>} key="0">
            <Row {...gutter}>
              <Col span='12'><span className={style.info_label}>孙权ID：</span><span>{nodeDetail?.orgId}</span></Col>
              <Col span='12'><span className={style.info_label}>实体类型：</span><span>{NODE_TYPE_MAP[_.get(nodeDetail, 'orgType')]}</span></Col>
            </Row>
            <Row {...gutter}>
              <Col span='12'><span className={style.info_label}>实体名称：</span><span>{nodeDetail?.orgName}</span></Col>
              <Col span='12'><span className={style.info_label}>实体ID：</span><span>{nodeDetail?.relEntity}</span></Col>
            </Row>
            <Row {...gutter}>
              <Col span='24'>
                <div style={{ display: 'flex' }}>
                  <span className={style.info_label} style={{ minWidth: '86px' }}>关联合作方：</span>
                  <div>
                    {
                      nodeDetail?.companyBaseInfos && nodeDetail?.companyBaseInfos.map(item => {
                        return (
                          <Tag
                            style={{ marginBottom: '4px' }}
                            color="warning"
                          >
                            {item.companyName}
                          </Tag>
                        )
                      })
                    }
                  </div>
                </div>
              </Col>
            </Row>
            {
              nodeDetail?.orgType === NODETYPE &&
              <Row {...gutterNoMagin}>
                <Col span='18' className={style.warehouseBox}>
                  <Form name='warehouseReForm' ref={warehouseformRef}>
                    <Form.Item
                      label={'仓库经理'}
                      name="warehouseManage"
                      labelAlign={'right'}
                    >
                      {
                        !_.isEmpty(nodeDetail) ?
                          <WarehouseManage
                            style={{ width: '100%' }}
                            className={style.external_person_select}
                            disabled={!warehouseManageShow}
                            placeholder={'请输入仓库经理'}
                            data={warehouseDetailVal}
                          />
                          :
                          <></>
                      }
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={2} offset={3} className={style.editInfoBtn}>
                  {!_.isEmpty(props.selectedNode) &&
                    (!warehouseManageShow ? (
                      <Button
                        onClick={() => {
                          setWarehouseManageShow(true);
                        }}
                      >
                        编辑
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        loading={warehouseManageLoad}
                        onClick={handleEditManage}
                      >
                        完成
                      </Button>
                    ))}
                </Col>
              </Row>
            }


            <Row {...gutterNoMagin}>
              <Col span='18'>
                <Form name='Form' ref={formRef}>
                  <Form.Item label={'实体管理员'} name="orgManager">
                    {
                      !_.isEmpty(nodeDetail) ?
                        <ExternalPersonSelect
                          // style={{ width: '500px' }}
                          className={style.external_person_select}
                          disabled={[OPERATE_TYPE.SHOW].includes(operateType)}
                          mode={'multiple'}
                          entity={nodeDetail?.relEntity}
                          placeholder={'请输入管理员'}
                          detailVal={detailVal}
                        />
                        :
                        <></>
                    }
                  </Form.Item>
                </Form>
              </Col>
              <Col span={2} offset={3} className={style.editInfoBtn}>
                {!_.isEmpty(props.selectedNode) &&
                  (OPERATE_TYPE.SHOW === operateType ? (
                    <Button onClick={() => setOperateType(OPERATE_TYPE.UPDATE)}>
                      编辑
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      loading={finishing}
                      onClick={handleEditFinish}
                    >
                      完成
                    </Button>
                  ))}
              </Col>
            </Row>

          </Panel>
        </Collapse>
        <Collapse
          collapsible="header"
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ display: _.isEmpty(props.selectedNode) ? 'none' : 'block' }}
        >
          {showTable && (
            <Panel
              header={<div style={{ width: '100%' }}>岗位人员</div>}
              key="1"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className={style.TableButtons}>
                  <Space>
                    <Button
                      size={'small'}
                      type={'primary'}
                      disabled={_.isEmpty(selectedJobTypeId)}
                      onClick={() => setBindModalVisible(true)}
                    >
                      添加
                    </Button>
                    <JobTypeSelect
                      labelInValue
                      value={selectedJobTypeId}
                      onChange={val => {
                        setSelectedJobTypeId(val);
                        addTableParams({ jobTypeId: val?.value }, 'staff_job_table');
                        if (val) {
                          addTableParams(
                            { jobTypeId: val?.value },
                            'staff_bind_table'
                          );
                        }

                      }}
                      placeholder={'请选择岗位'}
                      org={_.get(nodeDetail, 'orgId')}
                    />
                  </Space>
                  <Tooltip title="刷新列表">
                    <Button
                      shape="circle"
                      icon={<RedoOutlined />}
                      onClick={() => addTableParams({}, 'staff_job_table')}
                    />
                  </Tooltip>
                </div>
                <StaffJobTable />
              </Space>
            </Panel>
          )}
        </Collapse>
      </Space>
      <StaffBindModal
        job={selectedJobTypeId}
        node={props.selectedNode}
        isModalVisible={bindModalVisible}
        closeModal={() => {
          setBindModalVisible(false);
          addTableParams({}, 'staff_job_table');
        }}
      />
    </Card >
  );
};

export default NodeInfo;
