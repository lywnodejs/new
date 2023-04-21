import React from 'react';
import { Icon } from 'antd-mobile';
import './style.less';

export const Success = props => {

  return (
    <div className='success'>
      <img src={require('@/assets/img/success.png')} alt="" />
      <h2>账号注册成功</h2>
      <br />
      <p>
        账号名：{props.location.query.availableName}<br />
        密码：{decodeURIComponent(props.location.query.password)}
      </p>
      <br />
      <br />
      <p>
        账号密码已短信发送给您<br />
        若您未收到短信<br />
        也可直接通过手机号+验证码的方式登录系统
      </p>
      <button
        className='next-but'
        onClick={() => {
          window.history.go(-2);
        }}
      >返回
      </button>
    </div>
  );
};

export default Success;
