import React from 'react';
import { Button, Tooltip } from 'antd';
import style from '@/style/system/guide/index.less';
import { QuestionCircleOutlined } from '@ant-design/icons';

const DutyLists = props => {
  const { dutysDatas, selectKey, onClickDuty, confirmLoading } = props;

  return (
    <>
      <div className={style.dutyList}>
        {dutysDatas.map(row => (
          <Tooltip title={row.des} key={row.jobDutyId}>
            <div className={style.permissionCard}>
              <Button
                loading={confirmLoading}
                className={
                  row.jobDutyId === selectKey ? 'selectedBtn' : 'unSelectedBtn'
                }
                onClick={() => onClickDuty(row)}
                size={'large'}
              >
                {row.jobDutyName}
              </Button>
            </div>
          </Tooltip>
        ))}
        <Tooltip title="根据您的部门提示">
          <QuestionCircleOutlined style={{ color: '#CDCDCD' }} />
        </Tooltip>
      </div>
    </>
  );
};

export default DutyLists;
