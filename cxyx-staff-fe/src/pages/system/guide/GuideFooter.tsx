import { Row, Col } from 'antd';
import React from 'react';

import style from '@/style/system/guide/index.less';
const GuideFooter = () => {
  return (
    <Row className={style.guideRowDesc}>
      <Col span={8}>
        <Row>
          <img
            src={require('@/assets/img/empowerment.png')}
            alt="孙权系统-按需赋权"
            className={style.guideImg}
          />
          <div className={style.guideTextBox}>
            <div className={style.guideTitle}>按需赋权</div>
            <div className={style.guideContent}>
              <div>根据您的工作职责（岗位）</div>
              <div>开通对应的系统权限</div>
            </div>
            <div className={style.guideContent}>
              自发申请/上级赋权/管理员赋权/自动赋权
            </div>
          </div>
        </Row>
      </Col>
      <Col span={8} push={1}>
        <Row>
          <img
            src={require('@/assets/img/thirdParty.png')}
            alt="孙权系统-第三方"
            className={style.guideImg}
          />
          <div className={style.guideTextBox}>
            <div className={style.guideTitle}>第三方人员账号管理</div>
            <div className={style.guideContent}>
              管理人员对应合作方及其人员账号权限
            </div>
          </div>
        </Row>
      </Col>
      <Col span={8} push={1}>
        <Row>
          <img
            src="//z.didi.cn/4Xt61"
            alt="孙权系统-用户资讯全"
            className={style.guideImg}
          />
          <div className={style.guideTextBox}>
            <div className={style.guideTitle}>欢迎扫码入群咨询</div>
          </div>
        </Row>
      </Col>
    </Row>
  );
};

export default GuideFooter;
