import { message, Modal, Result, Form, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import {
  getDutyInfoByLdap,
  getIsInnerEmployee,
  queryJobDutyList,
  isApplayDuty,
  applyJobDuty,
} from '@/utils/api/permission';
import style from '@/style/system/guide/index.less';
import DutyLists from './components/dutyLists';
import OtherDes from '@/components/OtherDes';
import { getUserName } from '@/utils/auth';
import _ from 'lodash';
import { dutyIsOther } from '@/utils/tools';
import {
  Response,
  ModalType,
  OTHERNAME,
  IsApply,
  joinDcUrl,
  myApplyUrl,
  reportBpmUrl,
  Duty,
} from '@/utils/constant';
import DutyModal from '@/components/DutyModal';
import { ExclamationCircleFilled } from '@ant-design/icons';

interface IGuideText {
  style?: object;
  showCard?: boolean; // 是否展示 card
}
type DutysDatas = Record<string, any>[];

const { success, confirm } = Modal;

const GuideText = (props: IGuideText) => {
  const [dutysDatas, setDutysData] = useState<DutysDatas>([]);
  const [selectKey, setSelectKey] = useState<string>('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentUserDuty, setCurrentUserDuty] = useState(null);
  const [modalType, setModalType] = useState('');
  const [dutyVisible, setDutyVisible] = useState(false);
  const [isInnerEmployee, setIsInnerEmployee] = useState(false);
  const [modalForm] = Form.useForm();

  const dutyModalRef: any = useRef();

  const showOtherTip = props => {
    const onOk = () => {
      const params = {
        dutyType: Duty.Other,
        ldap: getUserName(),
        dutyId: props?.jobDutyId,
        dutyName: props?.jobDutyName,
      };
      applyJobDuty(params).then(res => {
        closeModal();
        if (res.errno === Response.Success) {
          message.success('申请权限成功～');
          getCurrentUserDuty();
          return;
        }
        message.error(res.errmsg);
      });
    };

    confirm({
      icon: '',
      centered: true,
      okText: '知道了',
      cancelText: '返回',
      onOk: onOk,
      content: (
        <Result
          status="success"
          icon={
            <ExclamationCircleFilled
              style={{ fontSize: '36px', color: '#C92A29', marginRight: 20 }}
            />
          }
          title={
            <div style={{ fontSize: 14 }}>
              <p>找不到合适的？</p>
              <p>我们会尽快联系您核实情况</p>
              <div style={{ fontSize: 14 }}>
                <span>您也可以</span>
                <a target="_blank" href={reportBpmUrl}>
                  职责上报
                </a>
                <span>或</span>
                <a target="_blank" href={joinDcUrl}>
                  入群咨询
                </a>
              </div>
            </div>
          }
        />
      ),
    });
  };
  const fetchDutysData = () => {
    queryJobDutyList.fetch().then(res => {
      if (res?.errno === Response.Success) {
        const { data } = res;
        const filterIsapply = arr =>
          arr.filter(duty => duty.isApply === IsApply.ApplyAbled) ?? []; // 过滤可展示职责
        const mapOther = arr =>
          arr.map(row => {
            return !dutyIsOther(row.jobDutyName)
              ? row
              : { ...row, des: OtherDes };
          });
        const compose = _.flowRight([mapOther, filterIsapply]);
        const applyDutyLists = compose(data ?? []);
        setDutysData(applyDutyLists);
      }
    });
  };

  const getCurrentUserDuty = () => {
    getDutyInfoByLdap().then(res => {
      if (res?.errno === Response.Success) {
        const { data } = res;
        setCurrentUserDuty(data);
        setSelectKey(data?.dutyId);
      }
    });
  };

  // 判断是否是内部员工，若是外部员工，则提示对应业务人员来开通权限
  const fetchIsInnerEmployee = () => {
    getIsInnerEmployee().then(res => {
      if (res.errno === Response.Success) {
        setIsInnerEmployee(res.data || false);
      }
    });
  };

  // 判断是否有正在申请中的权限
  const fetchIsApplayDuty = () => {
    return isApplayDuty().then(res => {
      if (res.errno === Response.Success) {
        return res.data;
      }
      return true;
    });
  };

  const clickDuty = async props => {
    setConfirmLoading(true);
    const isMyApplyDuty = await fetchIsApplayDuty();
    setConfirmLoading(false);
    const { jobDutyId, jobDutyName } = props;
    if (!isMyApplyDuty) {
      success({
        icon: '',
        centered: true,
        okText: '知道了',
        content: (
          <Result
            status="success"
            icon={
              <ExclamationCircleFilled
                style={{ fontSize: '36px', color: '#C92A29', marginRight: 20 }}
              />
            }
            title={
              <div style={{ fontSize: 14 }}>
                <p>你有申请中的审批单，如需申请新的工作职责</p>
                <p>请先撤回后再尝试发起</p>
                <div style={{ fontSize: 14 }}>
                  <span>点击</span>
                  <a target="_blank" href={myApplyUrl}>
                    查看详情
                  </a>
                </div>
              </div>
            }
          />
        ),
      });
      return;
    }
    if (OTHERNAME.includes(jobDutyName)) {
      showOtherTip(props);
      return false;
    }
    setSelectKey(jobDutyId);
    setModalType(ModalType.APPLY);
    setDutyVisible(true);
  };

  const closeModal = () => {
    setDutyVisible(false);
  };

  const viewDuty = fromModal => {
    if (fromModal) {
      Modal.destroyAll();
    }
    setSelectKey(currentUserDuty.dutyId);
    setModalType(ModalType.VIEW);
    setDutyVisible(true);
  };

  useEffect(() => {
    fetchDutysData();
    getCurrentUserDuty();
    fetchIsInnerEmployee();
  }, []);

  const hasMyDuty = currentUserDuty?.duty && currentUserDuty?.duty != '无职责';
  const isOtherDuty = dutyIsOther(currentUserDuty?.duty);
  return (
    <div className={style.MainGuide} style={props.style}>
      <Row align="middle" justify="space-between">
        <p style={{ fontSize: 24, fontWeight: 500 }}>
          欢迎来到「孙权」橙心账号权限管理系统
        </p>
        <div>
          您已申请？查看
          <a target="_blank" href={myApplyUrl}>
            {' '}
            我的申请{' '}
          </a>
        </div>
      </Row>
      <p style={{ fontSize: 16, color: '#000', marginTop: '16px' }}>
        根据岗位快速赋权·管理合作方临时工
      </p>
      {isInnerEmployee && props.showCard && dutysDatas.length ? (
        <div className={style.dutyRecommendBox}>
          <div className={style.dutyRecommend}>
            <div>
              <p className={style.tipContent}>职责推荐：</p>
              <DutyLists
                dutysDatas={dutysDatas}
                selectKey={selectKey}
                onClickDuty={clickDuty}
                confirmLoading={confirmLoading}
              ></DutyLists>
            </div>
          </div>
          <Row>
            <h3 className={style.tipContent} style={{ fontWeight: 500 }}>
              您当前的工作职责是：{hasMyDuty ? currentUserDuty?.duty : '--'}
              {/* {hasMyDuty && (
                <Button type="link" onClick={viewDuty}>
                  查看详情
                </Button>
              )} */}
            </h3>
          </Row>
          {isOtherDuty && <>{OtherDes}</>}
          {!isOtherDuty && hasMyDuty && (
            <h3>工作职责描述：{currentUserDuty?.des}</h3>
          )}
          {!isOtherDuty && !hasMyDuty && (
            <div>快申请开通自己的工作职责吧～</div>
          )}
        </div>
      ) : !props.showCard ? (
        <>
          <h3>集团人员账号权限管理</h3>
          <p>
            成为物理上级后，您将可以在孙权系统为下属分配岗位职责，下属即可获得职责对应基础权限
          </p>
          <h3>合作方账号权限管理</h3>
          <p>
            若您的业务有大量第三方员工（未与公司签订合约的第三方临时工，如仓库搬运工等）需要进行账号权限的开通
          </p>
          <p>
            您可以借助孙权系统的能力，为第三方员工开通_cxyx_p账号，并分配权限
          </p>
          <p>从而实现第三方人员账号权限的管理</p>
        </>
      ) : !isInnerEmployee ? (
        <h3 className={style.noPermission}>
          <ExclamationCircleFilled
            style={{ fontSize: '36px', color: '#C92A29', marginRight: 20 }}
          />
          <span>
            <p>您当前还没有孙权系统权限</p>
            <p>请联系您的业务对接同学为您开通</p>
          </span>
        </h3>
      ) : null}

      {dutyVisible && (
        <DutyModal
          visible={dutyVisible}
          type={modalType}
          form={modalForm}
          dutysDatas={dutysDatas}
          selectKey={selectKey}
          ref={dutyModalRef}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default GuideText;
