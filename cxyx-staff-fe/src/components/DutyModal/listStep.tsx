import React, { useState } from 'react';
import { Skeleton } from 'antd';
import style from '@/style/system/guide/listStep.less';

const ListStep = props => {
  const { title, loading = false } = props;

  return (
    <div className={style.listStep}>
      <div className={style.titleBox}>{title}</div>
      <div className={style.content}>
        <Skeleton active loading={loading}>
          {props.children}
        </Skeleton>
      </div>
    </div>
  );
};

export default ListStep;
