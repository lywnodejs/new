import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolvePGC extends React.Component<IBase, IState> {
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
      <div className="solve-PGC">
        <div className="solve-PGC__banner">
          <img src={require('../../../assets/bannerPGC.png')} alt="" />
        </div>
        <div className="solve-PGC__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/PgcBg.jpg')} alt="" />
          <img src={require('../../../assets/PgcBg02.png')} alt="" />
        </div>

        <div className="solve-PGC__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon02.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-PGC__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('基础功能型PGC')}
          </li>
          <li
            className={tabIndex === 1 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(1) }}
          >
            {t('运营类PGC')}
          </li>
          <li
            className={tabIndex === 2 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(2) }}
          >
            {t('第三方PGC')}
          </li>
        </div>
        <div className="solve-PGC__main-Content">
          <div className="solve-PGC__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>{t('平台内部人员产生，用于支撑基础功能运行的内容或功能')}</p>
            <div className="solve-PGC__main--info solve-PGC__main--info-left">
              <img src={require('../../../assets/PGC_icon01.png')} alt="" />
              <li>
                <i></i>
                <span>{t('机器审核')}</span>
                <span>{t('提供机器审核能力，响应时效快、审核成本低')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('先审后发')}</span>
                <span>{t('先审后发机制，多层审核兜底，最大限度保障内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('存量回扫')}</span>
                <span>{t('提供对已上线且未审核的存量内容进行机审+人审回扫服务，保障存量内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>{t('根据国家法规及公司要求，为业务线定制重保方案')}</span>
              </li>
            </div>
          </div>

          <div className="solve-PGC__main"
            style={{ display: tabIndex === 1 ? 'block' : 'none' }}
          >
            <p>{t('平台内容人员产生，用于各类运营和营销的内容')}</p>
            <div className="solve-PGC__main--info solve-PGC__main--info-center">
              <img src={require('../../../assets/PGC_icon02.png')} alt="" />
              <li>
                <i></i>
                <span>{t('先审后发')}</span>
                <span>{t('先审后发机制，多层审核流程，人工审核兜底，最大限度保障内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('先发后审')}</span>
                <span>{t('先发后审机制，适应业务线高时效要求的内容审查，兼顾用户体验与内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('前台巡查')}</span>
                <span>{t('提供前台巡查服务，及时发现和处置违法违规信息')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('质量检测')}</span>
                <span>{t('提供质量检测服务，对质检不通过的内容进行下线处理')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>{t('根据国家法规及公司要求，为业务线定制重保方案')}</span>
              </li>
            </div>
          </div>

          <div className="solve-PGC__main"
            style={{ display: tabIndex === 2 ? 'block' : 'none' }}
          >
            <p>{t('由平台合作方，或其他第三方企业、商户等以滴滴或滴滴合作方名义发布的运营类内容')}</p>
            <div className="solve-PGC__main--info solve-PGC__main--info-right">
              <img src={require('../../../assets/PGC_icon03.png')} alt="" />
              <li>
                <i></i>
                <span>{t('用户协议')}</span>
                <span>{t('协助制定并公开管理规则和平台公约，完善用户协议，并依法依约履行相应管理职责')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('身份认证')}</span>
                <span>{t('协助业务线进行真实身份信息认证，符合国家政策法规')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('先审后发')}</span>
                <span>{t('先审后发机制，多层审核流程，人工审核兜底，最大限度保障内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('前台巡查')}</span>
                <span>{t('提供前台巡查服务，及时发现和处置违法违规信息')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('质量检测')}</span>
                <span>{t('提供质量检测服务，对质检不通过的内容进行下线处理')}</span>
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
        <div className="solve-PGC__clientCase">
          <div className="solve-PGC__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/PGC_icon04.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolvePGC
