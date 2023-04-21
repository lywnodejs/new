import React, { useRef, useState, useImperativeHandle } from 'react';
import { Button, Modal, Row, message, Tooltip } from 'antd';
import ObligationForm from './ObligationForm';
import ObligationFormNext from './ObligationFormNext';
import { updateEmployeeDuty } from '@/utils/api/formal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.less';

/**
 * @description 分配职责公共组件
 */

export interface AllotObligationChildProps<RecordType> {
  data: any; // 分配对象
  reloadTable: Function // reloadtable
}

const AllotObligationChild = <RecordType extends object = any>(
  props: AllotObligationChildProps<RecordType>,
  ref,
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submiting, setSubmiting] = useState(false);
  const [formData, setFormData] = useState<any>({
    city: [],
    warehouses: [],
    dutyId: {},
    staffEmployeeGoodsTypeVOS: []
  });
  const { data } = props;
  const formRef: any = useRef();
  const nextFormRef: any = useRef();

  useImperativeHandle(ref, () => ({
    setModalVisible: bool => {
      //外部打开组件方法
      setModalVisible(bool);
    },
  }));

  // 不同步骤不同按钮
  const Buttons = ({ step }) => {
    return step === 0 ? (
      <>
        <p
          style={{ display: 'inline-block', marginRight: '10px', marginBottom: '0' }}>
          更多其他问题？
          <a
            target="_blank"
            href="https://page.xiaojukeji.com/active/ddPage_0sQWmhhA.html"
          >
            点击这里
          </a>
          反馈
        </p>
        <Button
          onClick={() => {
            setModalVisible(false);
            formRef.current.formReset(); // 重置表单
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            formRef.current.formSubmit(); //下一步表单提示验证
          }}
        >
          下一步
        </Button>
      </>
    ) : (
      <div className="footerButtons">
        {/* <div className="shadow"></div> */}
        <Button onClick={() => setCurrentStep(0)}>上一步</Button>
        <Button
          type="primary"
          loading={submiting}
          onClick={() => {
            nextFormRef.current.formSubmit();
          }}
        >
          确定提交
        </Button>
      </div>
    );
  };
  const modalBodyStyle: any = {
    minHeight: '220px',
    paddingTop: currentStep == 0 ? '' : '10px'
    // maxHeight: '400px',
    // overflowY: 'auto',
  };

  const getFormData = (val) => {
    let params = {
      permission: val, //分配职责数据
      cityCodes: formData.city || [], //城市数据
      warehouseCodes: formData.warehouses || [], // 仓库数据
      employType: data.employType, // 列表数据
      ldap: data.ldap, // 列表数据
      dutyId: formData.dutyId.value, // 工作职责id
      duty: formData.dutyId.label, // 工作职责名称
      staffEmployeeGoodsTypeVOS: formData.staffEmployeeGoodsTypeVOS
    }
    params.staffEmployeeGoodsTypeVOS = formData.staffEmployeeGoodsTypeVOS.map(item => {
      item.ldap = data.ldap;
      return item;
    })



    setSubmiting(true);
    console.log('传给后端的数据为', params);
    updateEmployeeDuty(params).then(res => {
      props.reloadTable();
      setModalVisible(false);
      setSubmiting(false);
      if (res.errno === 0) {
        message.success('操作成功');
        setCurrentStep(0); // 初始化步骤
        formRef.current.formReset(); // 清空表单数据
      } else {
        message.success(res.errmsg)
      }
    });
  };

  return (
    <Modal
      title={[
        <>
          分配职责权限&nbsp;
          <Tooltip title="点击查看使用手册">
            <a
              target="_blank"
              href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=514986439">
              <QuestionCircleOutlined />
            </a>
          </Tooltip>
        </>
      ]}
      wrapClassName="obligationModal"
      bodyStyle={modalBodyStyle}
      width={800}
      keyboard={false}
      maskClosable={false}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => {
        setModalVisible(false);
        setCurrentStep(0);
        formRef.current.formReset();
      }}
      footer={[<Buttons key="buttons" step={currentStep} />]}
    >
      <Row style={{ display: currentStep == 0 ? 'block' : 'none' }}>
        <ObligationForm
          ref={formRef}
          setFormData={data => setFormData(data)}
          setCurrentStep={setCurrentStep}
        />
      </Row>
      <Row>
        {currentStep === 1 ? (
          <ObligationFormNext
            ref={nextFormRef}
            nextData={formData}
            ldap={data.ldap}
            getFormVal={getFormData}
          />
        ) : null}
      </Row>
    </Modal>
  );
};

const AllotObligation = React.forwardRef(AllotObligationChild);

export default AllotObligation;
