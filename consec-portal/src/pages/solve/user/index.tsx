import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolveUser extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0
    }
  }

  componentDidMount() {

  }

  //tab切换点击
  tabClick = (index) => {
    this.setState({
      tabIndex: index
    })
  }


  render() {
    const { tabIndex } = this.state
    const tabClick = this.tabClick
    return (
      <div className="solve-user">
        <div className="solve-user__banner">
          <img src={require('../../../assets/banner_user.png')} alt="" />
        </div>
        <div className="solve-user__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/userBg01.png')} alt="" />
          <img src={require('../../../assets/userBg02.png')} alt="" />
        </div>

        <div className="solve-user__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon02.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-user__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('个人（商户）信息')}
          </li>

        </div>
        <div className="solve-user__main-Content">
          <div className="solve-user__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>
              {t('用户产生，在注册账号时使用的名称、头像和简介等，属于个人（商户）信息。较典型的场景包括passport、didi park个人信息等')}
            </p>
            <div className="solve-user__main--info solve-user__main--info-left">
              <img src={require('../../../assets/user_info01.png')} alt="" />
              <li>
                <i></i>
                <span>{t('用户协议')}</span>
                <span>{t('协助制定并公开管理规则和平台公约，完善用户协议，并依法依约履行相应管理职责')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('实名认证')}</span>
                <span>{t('协助业务线进行真实身份信息认证，符合国家政策法规')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('先审后发')}</span>
                <span>{t('先审后发机制，多层审核流程，人工审核兜底，最大限度保障内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('投诉举报')}</span>
                <span>{t('提供投诉举报审核功能，对用户的投诉举报进行核查处置')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('用户管控')}</span>
                <span>{t('提供用户管控功能，对部分恶意用户进行禁言、封号等处置动作')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>{t('根据国家法规及公司要求，为业务线定制重保方案')}</span>
              </li>
            </div>
          </div>



        </div>
        <div className="solve-user__clientCase">
          <div className="solve-user__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/didikuaiche.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolveUser
