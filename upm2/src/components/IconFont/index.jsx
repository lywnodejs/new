// http://www.iconfont.cn/
// 在页面上以 font class 的形式，引入css

import React from 'react';
import './index.less';

const IconFont = (props) => {

  return (
    <i className={`icon iconfont ${props.type}`} />
  );
};

export default IconFont;
