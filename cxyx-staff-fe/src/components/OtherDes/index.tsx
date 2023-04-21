import React from 'react';
import { joinDcUrl, reportBpmUrl } from '@/utils/constant';
import style from '@/style/system/guide/index.less';

const otherDes = (
  <div className={style.tipContent}>
    <div>找不到合适的？</div>
    <div>我们会尽快联系您核实情况。</div>
    <div>
      您也可以{' '}
      <a target="_blank" href={reportBpmUrl}>
        点此上报
      </a>
      或
      <a target="_blank" href={joinDcUrl}>
        入群咨询
      </a>
    </div>
  </div>
);

export default otherDes;
