import React from 'react';
import connect from '@utils/translateConnect';
import { isOversea } from '@config/env';

import './index.less';
function Header({ t }) {
  return (
    <div className="mb-header">
      <a href="/upm2-static/mob/main">
        <div className="logo"></div>
        <div>权限系统</div>
        <span>{isOversea ? t('国际') : t('国内')}</span>
      </a>
    </div>
  );
}

export default connect()(Header);
