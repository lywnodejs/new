import React from 'react';

import './index.less';

const TextButton = (props = {}) => {
  return (
    <a
      className="text-button"
      href="javascript:void(0);"
      onClick={props.onClick}
    >{props.children}</a>
  );
};

export default TextButton;
