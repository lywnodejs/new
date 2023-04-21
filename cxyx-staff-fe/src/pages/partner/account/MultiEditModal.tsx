import React, { useEffect, useState, useRef } from 'react';
import { Menu, message, Modal } from 'antd';
import Former from '@/components/EasyTable/Form';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { updateEmployBatch } from '@/utils/api/staff';
import StaffTypeSelect from '@/components/StaffTypeSelect';
import JobTypeSelect from '@/components/JobTypeSelect';
import CitySelect from '@/components/CitySelect';
import CompanySelect from '@/components/CompanySelect';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import EntitySelect from '@/components/EntitySelect';
import _ from 'lodash';
import PersonSelect from '@/components/PersonSelect';
import { syncStaffEmployeeStatusBySSO } from '@/utils/api/staff';
import StatusSelect from './components/StatusSelect';
import ClientIdSelect from './components/ClientIdSelect';
import {
  queryCompanyServiceEntity
} from '@/utils/api/staff';

const MultiEditModal = props => {
  const formRef: any = useRef();
  const [modalTitle, setModalTitle] = useState('');
  const [dataList, setDataList] = useState(props.dataList);
  // const [formItems, setFormItems] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedOrgType, setSelectOrgType] = useState();
  const [cityName, setCityName] = useState('');
  const [selectedOrgList, setSelectOrgList] = useState([]);

  const formItems = [
    '类型' === props.type
      ? {
        name: 'jobModeId',
        label: '合作方员工类型',
        content: <StaffTypeSelect />,
        rules: [{ required: true, message: '请选择合作方员工类型' }],
      }
      : null,
    '城市' === props.type
      ? {
        name: 'cityCode',
        label: '城市',
        content: (
          <CitySelect
            onNameChange={name => {
              setCityName(name);
            }}
          />
        ),
        rules: [{ required: true, message: '请选择城市' }],
      }
      : null,
    ...('实体' === props.type
      ? [
        {
          name: 'companyId',
          label: '所属合作方',
          content: <CompanySelect
            onChange={value => {
              if (value) {
                queryCompanyServiceEntity({ companyId: value }).then(res => {
                  if (res && res.data && !_.isEmpty(res.data)) {
                    formRef.current.getForm().setFieldsValue({
                      entityType: res.data[0]?.orgTypeCode
                    })
                    setSelectOrgType(res.data[0]?.orgTypeCode);
                    setSelectOrgList(res.data);
                    formRef?.current?.getForm()?.resetFields(['clientId', 'jobTypeId']);
                  }
                })
              }

            }}
          />,
          rules: [{ required: true, message: '请选择所属合作方' }],
        }, {
          label: '实体类型',
          name: 'entityType',
          content: (
            <NodeTypeSelect
              disabled={true}
            // onChange={value => {
            // setSelectOrgType(value);
            // formRef?.current?.getForm()?.resetFields(['clientId', 'jobTypeId']);
            // }}
            />
          ),
        }, {
          name: 'clientId',
          label: '关联实体',
          content: (
            <ClientIdSelect
              List={selectedOrgList}
              disabled={_.isEmpty(selectedOrgType)}
              placeholder={'请选择'}
            />
          ),
        }, {
          name: 'jobTypeId',
          label: '工作职责',
          content: <JobTypeSelect
            entityType={selectedOrgType}
            disabled={_.isEmpty(selectedOrgType)}
            placeholder={'请选择'} />,
        }
      ]
      : []),
    '上级' === props.type
      ? {
        name: 'leaderId',
        label: '上级',
        content: <PersonSelect style={{ width: '100%' }} />,
        rules: [{ required: true, message: '请选择上级' }],
      }
      : null,
    '状态' === props.type
      ? {
        name: 'status',
        label: '账号状态',
        content: <StatusSelect style={{ width: '100%' }} />,
      }
      : null,
  ].filter(Boolean);

  useEffect(() => {
    let title = '批量修改';
    // let columns = [];
    switch (props.type) {
      case '类型':
        title += '合作方员工类型';
        // columns.push({
        //   name: 'jobModeId',
        //   label: '合作方员工类型',
        //   content: <StaffTypeSelect />,
        //   rules: [{ required: true, message: '请选择合作方员工类型' }],
        // });
        break;
      // case '职责':
      //   title += '工作职责';
      // columns.push({
      //   name: 'jobTypeId',
      //   label: '工作职责',
      //   content: <JobTypeSelect />,
      //   rules: [{ required: true, message: '请选择工作职责' }],
      // });
      // break;
      case '城市':
        title += '城市';
        // columns.push({
        //   name: 'cityCode',
        //   label: '城市',
        //   content: <CitySelect />,
        //   rules: [{ required: true, message: '请选择城市' }],
        // });
        break;
      case '实体':
        title += '修改合作方&实体&职责';
        // columns = [
        //   {
        //     name: 'companyId',
        //     label: '所属合作方',
        //     content: <CompanySelect />,
        //     rules: [{ required: true, message: '请选择所属合作方' }],
        //   },
        //   {
        //     name: 'entityType',
        //     label: '实体类型',
        //     content: (
        //       <NodeTypeSelect
        //         onChange={value => {
        //           setSelectOrgType(value);
        //           formRef.current.getForm().resetFields(['entityName']);
        //         }}
        //       />
        //     ),
        //   },
        //   {
        //     name: 'entityName',
        //     label: '关联实体',
        //     content: (
        //       <EntitySelect
        //         orgType={selectedOrgType}
        //         disabled={_.isEmpty(selectedOrgType)}
        //       />
        //     ),
        //   },
        // ];
        break;
      case '上级':
        title += '上级';
      // columns.push({
      //   name: 'leaderId',
      //   label: '上级',
      //   content: <PersonSelect style={{ width: '100%' }} />,
      //   rules: [{ required: true, message: '请选择上级' }],
      // });
      case '状态':
        title += '账号状态';
        break;
    }



    setModalTitle(title);
    // setFormItems(columns);
  }, [props.type]);

  useEffect(() => {
    if (props.visible) {
      let params = [];
      props.dataList.map(item => {
        params.push({
          ...item,
          mobile: ''
        })
      })
      syncStaffEmployeeStatusBySSO(params).then(res => {
        console.log(res);
        let data = []
        res.data.map(item => {
          if (item.status === 0) {
            data.push(item);
          }
        })
        setDataList(data);
      })
    }
  }, [props.visible])

  const formerProps = {
    colCount: 1,
    onFinish: values => {
      const multiChangeList = []; // 待修改列表
      dataList.forEach(item => {
        const newItem = { ...item };
        for (const key in values) {
          newItem[key] = values[key];
          if ('cityCode' === key) {
            newItem['cityName'] = cityName;
          }
        }
        const clientId = _.get(newItem, 'entityMap.clientId');
        if (clientId) {
          newItem['clientId'] = clientId;
        }
        multiChangeList.push(newItem);
      });
      setButtonLoading(true);
      multiChangeList.map(item => {
        item.mobile = null
      })
      updateEmployBatch(multiChangeList)
        .then(res => {
          const data = getResponseData(res);
          if (data !== false) {
            message.success(`${modalTitle}成功`);
            if (typeof props.closeModal === 'function') {
              props.closeModal();
            }
            formRef.current.getForm().resetFields();
            addTableParams({}, 'partner_account_table');
          }
        })
        .finally(() => setButtonLoading(false));
    },
  };

  const handleOk = () => {
    formRef.current?.getForm().submit();
  };

  return (
    <Modal
      visible={props.visible}
      title={modalTitle}
      onOk={handleOk}
      onCancel={() => {
        props.closeModal();
        formRef.current.getForm().resetFields();
      }}
      okButtonProps={{ loading: buttonLoading }}
    >
      <div style={{ marginRight: 80 }}>
        <Former {...formerProps} formItems={formItems} ref={formRef}></Former>
      </div>
    </Modal>
  );
};

export default MultiEditModal;
