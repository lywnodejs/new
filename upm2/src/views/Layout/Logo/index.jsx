import React from 'react';
import connect from '@utils/translateConnect';

import { MAIN } from '@routes/config';

import './index.less';

const goHomePage = () => {
  window.location.href = MAIN;
};

const Logo = props => {
  return (
    <div className="logo-wrapper" onClick={props.goIndex}>
      <span className="content">
        <img
          className="logo"
          src={require('../../../assets/logo.png')}
          alt="logo"
        />
        {props.t('UPM 权限系统')}
      </span>
      {/* <div className="logo-image" ></div>
      <div className="logo-text" >{props.t('权限系统')}</div> */}
    </div>
  );
};

export default connect()(Logo);
