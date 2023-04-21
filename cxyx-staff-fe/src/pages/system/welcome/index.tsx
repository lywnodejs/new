import React, { PureComponent } from 'react';
import style from './index.less';

class Welcome extends PureComponent {
  render() {
    return (
      <div className={style.welcomeContainer}>
        <h2 className={style.welcomeHeader}>欢迎使用</h2>
        <img
          className={style.welcomeImg}
          src={require('@/assets/img/welcome.png')}
          alt="welcome"
        />
      </div>
    );
  }
}
export default Welcome;
