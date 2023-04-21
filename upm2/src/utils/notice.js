// 整个系统的通知库，提供了多种用户通知工具

import { message } from 'antd';

const echoMessage = (msg, status) => {
  // TODO 判断当前是否是浏览器环境
  if (!window) {
    console.log(status, msg);
    return;
  }

  const funcName = status || 'info';
  message[funcName](msg);
};

export {
  echoMessage,
};
