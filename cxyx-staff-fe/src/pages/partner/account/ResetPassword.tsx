import React, { useState } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { resetPassword } from '@/utils/api/staff';
import { getResponseData } from '@/utils/api/path';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// 倒计时秒次以及速度
const BUTTON_DISABLED_SECONDS = 59;
const BUTTON_DISABLED_SPEED = 1000;
const BtnIcon = props => {
  const { isSuccess, loading, clickCount } = props;
  return (
    clickCount > 0 &&
    !loading &&
    (isSuccess ? (
      <CheckCircleOutlined style={{ color: 'green' }} />
    ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ))
  );
};

const ResetPassword = props => {
  const [isDisableReset, setIsDisableReset] = useState(false);
  const [count, setCount] = useState(59);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { record } = props;
  const { employeeId } = record;
  const confirmResetPassword = () => {
    setLoading(true);
    setClickCount(clickCount + 1);
    resetPassword(employeeId)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }
      })
      .finally(() => {
        setLoading(false);
        setIsDisableReset(true);
        countDown(BUTTON_DISABLED_SECONDS, BUTTON_DISABLED_SPEED);
      });
  };

  const countDown = (seconds, speed) => {
    let id = setInterval(() => {
      const s = seconds--;
      setCount(s);
      if (seconds === 0) {
        setIsDisableReset(false);
        setClickCount(0);
        clearInterval(id);
      }
    }, speed);
  };

  // <CloseOutlined />
  return isDisableReset ? (
    <>
      <Button
        danger
        size={'small'}
        icon={
          <BtnIcon
            clickCount={clickCount}
            loading={loading}
            isSuccess={isSuccess}
          />
        }
        disabled
      >
        重置密码 {count}{' '}
      </Button>
    </>
  ) : (
      <Popconfirm
        placement="topLeft"
        title="确定需要重置密码吗？"
        onConfirm={confirmResetPassword}
        okText="确定"
        cancelText="取消"
        disabled={props.disabled}
      >
        <Button
          disabled={props.disabled}
          size={'small'}
          danger
          icon={
            <BtnIcon
              clickCount={clickCount}
              loading={loading}
              isSuccess={isSuccess}
            />
          }
          loading={loading}
        >
          重置密码
      </Button>
      </Popconfirm>
    );
};

export default ResetPassword;
