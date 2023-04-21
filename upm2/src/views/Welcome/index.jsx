import React from 'react';
import { connect } from 'dva';
import uaParser from '@utils/uaParser.js';
// import { Button, DatePicker } from 'antd';

import './index.less';

class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome" >
        {!uaParser.isMobile()&&'404'}
      </div>
    );
  }
}

export default connect()(Welcome);
