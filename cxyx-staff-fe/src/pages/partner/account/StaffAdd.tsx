import React, { useEffect, useRef, useState } from 'react';
import { Input, message, Modal, Upload, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Former from '@/components/EasyTable/Form';
import StaffTypeSelect from '@/components/StaffTypeSelect';
import { addStaff, editEmployee, syncStaffEmployeeStatusBySSO } from '@/utils/api/staff';
import _ from 'lodash';
import CompanySelect from '@/components/CompanySelect';
import JobTypeSelect from '@/components/JobTypeSelect';
import { COMMON_API } from '@/utils/api/common';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import CitySelect from '@/components/CitySelect';
import NodeTypeSelect from '@/components/NodeTypeSelect';
// import EntitySelect from '@/components/EntitySelect';
import PersonSelect from '@/components/PersonSelect';
import StatusSelect from './components/StatusSelect';
import ClientIdSelect from './components/ClientIdSelect';
import {
  queryCompanyServiceEntity
} from '@/utils/api/staff';

const StaffAdd = props => {
  const formRef: any = useRef();
  const [fileList, setFileList] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedOrgType, setSelectOrgType] = useState();
  const [selectedOrgList, setSelectOrgList] = useState([]);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    setFileList([]);
  }, []);

  useEffect(() => {
    const form = formRef?.current?.getForm();
    if (!props.isModalVisible) {
      form?.resetFields();
      setFileList([]);
      setSelectOrgType(undefined);
    }
  }, [props.isModalVisible]);

  useEffect(() => {
    if (!_.isEmpty(props.values)) {
      let params = { ...props.values };
      params.mobile = '';

      // 获取最新状态
      syncStaffEmployeeStatusBySSO([params]).then(res => {
        if (!_.isEmpty(res.data)) {
          props.values.status = res.data[0].status;
          // 合作方状态为 2 代表已离职 离职不弹窗 直接提示已离职
          if (res.data[0].status === 2 && props.type == 'edit') {
            message.error('账号已离职');
            addTableParams({}, 'partner_account_table');
            return false;
          } else {
            props.openModal()
          }
        }
        const form = formRef?.current?.getForm();
        const fileList = (props?.values?.healthCertificates || []).map(
          (item, index) => ({
            uid: index,
            status: 'done',
            url: item,
            thumbUrl: item,
          }),
        );
        form?.setFieldsValue({
          ...props.values,
          fileList,
        });
        if (props.type == 'edit') {

          form?.setFieldsValue({
            mobile: null,
          });
          queryCompanyServiceEntity({ companyId: formRef?.current?.getForm().getFieldsValue().companyId }).then(res => {
            if (res && res.data && !_.isEmpty(res.data)) {
              formRef.current.getForm().setFieldsValue({
                entityType: res.data[0]?.orgTypeCode
              })
              setSelectOrgType(res.data[0]?.orgTypeCode);
              setSelectOrgList(res.data);
            }
          })
        }
        setFileList(fileList);
        if (props.values['entityType']) {
          setSelectOrgType(props.values['entityType']);
        }
      })
    }
  }, [props.values]);

  useEffect(() => {
    let title = '';
    switch (props.type) {
      case 'new':
        title = '新增人员';
        break;
      case 'edit':
        title = '编辑人员';
        break;
      case 'view':
        title = '查看人员';
        break;
    }
    setModalTitle(title);
  }, [props.type]);

  const closePreview = () => setPreviewVisible(false);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const getDisableStatus = name => {

    if (props.type === 'view') {
      return true;
    }
    if (props.type === 'edit' && props.values.status !== 0) {
      if (name == 'status') {
        return false;
      }
      return true;
    } else {
      switch (name) {
        case 'idCardNo':
        case 'nameInDidi':
        // case 'jobTypeId':
        case 'source':
        case 'employeeId':
          return props.type === 'edit';

        default:
          return false;
      }
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  const handleOk = async () => {
    if (props.type === 'view') {
      props.closeModal();
      return true;
    }
    const form = formRef?.current?.getForm();
    let completeValues = await form
      ?.validateFields()
      .then((values: any) => {
        return values;
      })
      .catch(info => {
        console.error('Validate Failed:', info);
      });
    if (_.isEmpty(completeValues)) {
      return;
    }
    const healthCertificates = [];
    let fileList = _.get(completeValues, 'healthCertificates.fileList', []);
    Array.isArray(fileList) &&
      fileList.forEach(item => {
        const url = _.get(item, 'url') || _.get(item, 'response.data');
        url && healthCertificates.push(url);
      });
    let request = addStaff;
    if (props?.values?.employeeId) {
      request = editEmployee;
    }
    setButtonLoading(true);
    completeValues.mobile == ''
      ? (completeValues.mobile = null)
      : (completeValues.mobile = completeValues.mobile);
    request({ ...completeValues, healthCertificates, cityName })
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success(`${modalTitle}成功`);
          if (typeof props.closeModal === 'function') {
            props.closeModal();
          }
          addTableParams({}, 'partner_account_table');
        }
      })
      .finally(() => setButtonLoading(false));
  };

  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const formerProps = {
    colCount: 2,
  };

  const formItems = [
    props?.values?.employeeId
      ? {
        name: 'employeeId',
        label: '合作方员工ID',
        content: <Input disabled={getDisableStatus('employeeId')} />,
      }
      : null,
    {
      name: 'name',
      label: '姓名',
      content: (
        <Input placeholder={'请输入'} disabled={getDisableStatus('name')} />
      ),
      rules: [
        { required: true, message: '请输入姓名' },
        { pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]*$/, message: '姓名包含特殊字符' },
      ],
    },
    props?.values?.employeeId
      ? {
        name: 'nameInDidi',
        label: '集团账号',
        content: (
          <Input
            placeholder={'请输入'}
            disabled={getDisableStatus('nameInDidi')}
          />
        ),
      }
      : null,
    {
      name: 'mobile',
      label: '联系电话',
      content: (
        <Input
          placeholder={props?.type == 'edit' ? props.values?.mobile : '请输入'}
          disabled={getDisableStatus('mobile')}
        />
      ),
      rules: [
        {
          required: props.type == 'new' ? true : false,
          message: '请输入联系电话',
        },
        { pattern: /^(1[3-9]\d{9}$)/, message: '手机号码格式不正确' },
      ],
    },
    props.type === 'new'
      ? {
        name: 'idCardNo',
        label: '身份证号',
        content: (
          <Input
            placeholder={'请输入'}
            disabled={getDisableStatus('idCardNo')}
          />
        ),
        rules: [
          { required: true, message: '请输入身份证号' },
          {
            pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([\d|x|X]{1})$/,
            message: '身份证号格式不正确',
          },
        ],
      }
      : null,
    {
      name: 'jobModeId',
      label: '合作方员工类型',
      content: <StaffTypeSelect disabled={getDisableStatus('jobModeId')} />,
      rules: [{ required: true, message: '请选择合作方员工类型' }],
    },
    {
      name: 'cityCode',
      label: '城市',
      content: (
        <CitySelect
          disabled={getDisableStatus('cityCode')}
          onNameChange={name => {
            setCityName(name);
          }}
        />
      ),
    },
    {
      name: 'companyId',
      label: '所属合作方',
      content: <CompanySelect
        disabled={getDisableStatus('companyId')}
        onChange={value => {
          if (value) {
            queryCompanyServiceEntity({ companyId: value }).then(res => {
              if (res && res.data && !_.isEmpty(res.data)) {
                formRef.current.getForm().setFieldsValue({
                  entityType: res.data[0]?.orgTypeCode
                })
                setSelectOrgType(res.data[0]?.orgTypeCode);
                setSelectOrgList(res.data);
                formRef.current.getForm().resetFields(['clientId', 'jobTypeId']);
              }
            })
          }
        }}
      />,
      rules: [{ required: true, message: '请选择所属合作方' }],
    },
    {
      name: 'entityType',
      label: '实体类型',
      content: (
        <NodeTypeSelect
          // onChange={value => {
          // setSelectOrgType(value);
          // formRef.current.getForm().resetFields(['clientId', 'jobTypeId']);
          // }}
          disabled={true}
        />
      ),
    },
    {
      name: 'clientId',
      label: '实体名称',
      content: (
        <ClientIdSelect
          List={selectedOrgList}
          disabled={_.isEmpty(selectedOrgType) || getDisableStatus('clientId')}
          placeholder={(_.isEmpty(selectedOrgType) || getDisableStatus('clientId')) ? '请先选择所属合作方' : '请选择'}
        />
      ),
    },
    {
      name: 'jobTypeId',
      label: '工作职责',
      content: (
        <JobTypeSelect
          entityType={selectedOrgType}
          disabled={_.isEmpty(selectedOrgType) || getDisableStatus('jobTypeId')}
          placeholder={(_.isEmpty(selectedOrgType) || getDisableStatus('jobTypeId')) ? '请先选择所属合作方' : '请选择'}
        />
      ),
    },
    {
      name: 'leaderId',
      label: '上级',
      content: (
        <PersonSelect
          style={{ width: '100%' }}
          allowClear
          disabled={getDisableStatus('leaderId')}
        />
      ),
    },
    {
      name: 'status',
      label: '账号状态',
      content: (
        <StatusSelect
          style={{ width: '100%' }}
          disabled={getDisableStatus('status')}
        />
      ),
    },
    props?.values?.employeeId
      ? {
        name: 'source',
        label: '录入来源',
        content: <Input disabled={getDisableStatus('source')} />,
      }
      : null,
    props?.values?.employeeId
      ? {
        name: '',
        label: '',
        content: <></>,
      }
      : null,
    {
      name: 'healthCertificates',
      label: '证件照片',
      content: (
        <Upload
          accept={'image/*'}
          action={COMMON_API.upload}
          withCredentials={true}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleFileChange}
          disabled={getDisableStatus('healthCertificates')}
        >
          {fileList.length >= 2 ? null : uploadButton}
        </Upload>
      ),
    },
  ].filter(Boolean);

  return (
    <Modal
      width={800}
      title={modalTitle}
      visible={props.isModalVisible}
      onOk={handleOk}
      footer={
        props.type === 'view' ? (
          <Button onClick={handleCancel}>返回</Button>
        ) : (
          undefined
        )
      }
      okText="保存"
      okButtonProps={{ loading: buttonLoading }}
      onCancel={handleCancel}
      cancelText="返回"
    >
      <Former {...formerProps} formItems={formItems} ref={formRef}></Former>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={closePreview}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default StaffAdd;
