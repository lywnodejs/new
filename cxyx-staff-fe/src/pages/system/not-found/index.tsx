import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import style from './index.less';

const NotFoundPage = () => {
  return (
    <div className={style.systemError}>
      <img src={require('@/assets/img/error.png')} alt="error"></img>
      <div className={style.errorContainer}>抱歉，你访问的页面不存在</div>
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    </div>
  );
};
export default NotFoundPage;
