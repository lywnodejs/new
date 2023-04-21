import React, { useState, useEffect, useRef } from 'react';
import { Button, message, notification } from 'antd';
import { updateOnStatus } from '@/utils/api/manageLog';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import _ from 'lodash';

const STRATEGY_TYPE = 2; // 策略类型

export const StatusBtn = props => {
  const [loading, setLoading] = useState(false);
  const { record } = props;

  const setStatus = (data, type) => {
    let params = {
      strategyId: data.strategyId,
      onstatus: type
    }
    setLoading(true);
    updateOnStatus(params).then(res => {
      if (res && res.errno === 0) {
        if (type === 1) {
          notification.info({
            message: '提示',
            description: '您的任务已启动，预计最长用时五分钟 请耐心等待策略执行完毕！',
          });
        }
        message.success(type === 1 ? '启用成功' : '停用成功')
      } else {
        message.error(res?.errmsg)
      }
      addTableParams({}, 'manage_empower_table');
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <>
      {
        record.onstatus === 0 && record.strategyType !== STRATEGY_TYPE ?
          <Button
            size={'small'}
            type={'primary'}
            loading={loading}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed', textShadow: 'none' }}
            onClick={() => {
              setStatus(record, 1);
            }}
          >
            启用
          </Button>
          :
          null
      }
      {
        record.onstatus === 1 ?
          <Button
            size={'small'}
            type={'primary'}
            loading={loading}
            style={{ color: '#f5222d', borderColor: '#ffa39e', background: '#fff1f0', textShadow: 'none' }}
            onClick={() => {
              setStatus(record, 2);
            }}
          >
            停用
        </Button>
          :
          null
      }
    </>
  );
};

export default StatusBtn;