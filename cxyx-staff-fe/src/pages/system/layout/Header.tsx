import React from 'react';
import User from '@/pages/system/layout/User';
import style from './style.less';

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.notice}>
        <span className={style.NoticeContent}>
          通过对本页数据进行截图拍照或其他方式外发等方式泄露公司保密信息的行为，违反《滴滴诚信合规行为守则》，触犯公司《高压线政策》，若以此谋利还涉嫌违法，会被予以解除或移送司法机关。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过对本页数据进行截图拍照或其他方式外发等方式泄露公司保密信息的行为，违反《滴滴诚信合规行为守则》，触犯公司《高压线政策》，若以此谋利还涉嫌违法，会被予以解除或移送司法机关。
        </span>
      </div>
      &nbsp;&nbsp;
      <div className={style.user}>
        <User />
      </div>
    </div>
  );
};

export default Header;
