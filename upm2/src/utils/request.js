import fetch from 'dva/fetch';
import _ from 'lodash';
// import { message, Modal } from 'antd'
import ClipboardJS from 'clipboard';

import { fixUriPrefix } from './url';
import checkLogin from './checkLogin';
import { echoMessage } from './notice';

function parseJSON(response, isEchoMessage, returnAll = false) {
  return response.json().then(({ code, data, msg }) => {
    checkLogin({ code, data });

    // 如果需要提示（例如post）
    if (isEchoMessage && !_.isEmpty(msg)) {
      echoMessage(msg);
    }
    if (code === 705015) {
      ('申请失败提示');
      let errMsg = {
        msg,
        data,
        code
      };
      return errMsg;
    }
    if (code < 200 || (code >= 300 && !_.includes([120001], code))) {
      // let msgData = JSON.parse(msg);
      // function genContent () {
      //   return (
      //     <div>
      //       <p>
      //       <b>{msgData.applyUserNameZh}</b>，抱歉，检测到您的审批流程出现异常
      //       </p>
      //       <p>
      //         {
      //           msgData.bpmExceptionType == 1
      //             ? <span><b>{msgData.appName}</b>系统使用BPM进行审批流跟踪</span>
      //             : <span><b>{msgData.appName}</b>系统没有在BPM配置审批流</span>
      //         }
      //       </p>
      //       {
      //         msgData.bpmExceptionType == 1
      //           ? (<div>
      //             问题反馈信息：
      //             <p>{msgData.traceId}|{msgData.processInstanceId}</p>
      //             <p style={{ textAlign: 'right' }}><a className="copy1" data-clipboard-text={msgData.traceId + '|' + msgData.processInstanceId}>复制问题反馈信息</a></p>
      //             <b>请复制问题反馈信息，并提供给，以便尽快解决该问题</b>
      //           </div>)
      //           : null
      //       }
      //     </div>
      //   );
      // }
      // message.error(`这里出错了${msgData.applyUserNameZh}呵呵呵呵`);
      // Modal.error({
      //   width: 780,
      //   centered: true,
      //   title: '',
      //   content: genContent() ,
      //   okText: '确定'
      // });
      // new ClipboardJS('.copy1');
      ('审批的流程奥');
      throw new Error(msg);
    }
    if (returnAll) {
      return {
        code,
        data,
        msg
      };
    } else {
      return data;
    }
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// 拼接get的参数 + 根据开发环境，修改path
const fixUrl = (url, options = {}) => {
  const { params, method } = options;

  let fixedUrl = fixUriPrefix(url);

  // 如果是GET请求，则拼接 params 到 url
  if (!_.isEmpty(params) && (!method || method.toLowerCase() === 'get')) {
    let query = _.map(params, (value, key) => {
      return `${key}=${value}`;
    }).join('&');

    fixedUrl += '?' + query;
  }
  return fixedUrl;
};

// 纯净的fetch封装，只检查http response code
const pureFetch = (url, options) => {
  return fetch(url, options).then(checkStatus);
};

// 对url进行修正，并且加上cookie
const fixUrlFetch = (url, options = {}) => {
  const fixedUrl = fixUrl(url, options);

  if (!options.credentials) {
    options.credentials = 'include';
  }
  // 增加 X-Requested-With头，让后端识别为ajax请求
  // 然后可以走正常的sso判断逻辑（response里返回需要跳转，而不是直接302）
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest'
  };

  return pureFetch(fixedUrl, options);
};

// 通用的get方式
const request = (url, options = {}, isEchoMessage) => {
  return fixUrlFetch(url, options).then(res => {
    return parseJSON(res, isEchoMessage);
  });
};
export default request;

// 同request，函数名更语义化
export function get(url, params) {
  return request(url, { params });
}

// post json方式
// silent为true时，对于response里的msg不做提示
// returnAll为true时，返回response；默认为false，返回response里的data数据
export function postJSON(url, params, config = {}) {
  let { silent, returnAll = false } = config;
  if (silent === undefined) {
    silent = true;
  }
  return fixUrlFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(response => parseJSON(response, !silent, returnAll));
}
