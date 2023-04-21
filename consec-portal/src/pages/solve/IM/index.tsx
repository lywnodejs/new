import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolveIM extends React.Component<IBase, IState> {
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
      <div className="solve-IM">
        <div className="solve-IM__banner">
          <img src={require('../../../assets/IMbg.png')} alt="" />
        </div>
        <div className="solve-IM__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/IMbg02.png')} alt="" />
        </div>

        <div className="solve-IM__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon02.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-IM__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('群')}
          </li>
          <li
            className={tabIndex === 1 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(1) }}
          >
            {t('一对一即时消息')}
          </li>
          <li
            className={tabIndex === 2 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(2) }}
          >
            {t('在线客服（IM机器人/人工）')}
          </li>
        </div>
        <div className="solve-IM__main-Content">
          <div className="solve-IM__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>{t('多名用户组建的聊天群组中产生的内容信息')}</p>
            <div className="solve-IM__main--info solve-IM__main--info-left">
              <img src={require('../../../assets/IMqun.png')} alt="" />
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
                <span>{t('管理制度备案')}</span>
                <span>{t('根据国家合规要求，协助业务线制定具体管理制度并向互联网信息办公室备案')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('分级分类管理')}</span>
                <span>{t('协助业务线对内容生产群体进行分级分类管理，完善建群、入群等审核验证功能')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('安全评估')}</span>
                <span>{t('协助业务线根据国家法规要求，对业务线提供的信息服务开展安全评估 ')}</span>
              </li>
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
                <span>{t('用户管控')}</span>
                <span>{t('提供用户管控功能，对部分恶意用户进行禁言、封号等处置动作')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('投诉举报')}</span>
                <span>{t('提供投诉举报审核功能，对用户的投诉举报进行核查处置')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>{t('根据国家法规及公司要求，为业务线定制重保方案')}</span>
              </li>
            </div>
          </div>

          <div className="solve-IM__main"
            style={{ display: tabIndex === 1 ? 'block' : 'none' }}
          >
            <p>{t('用户与用户之间的1对1消息中产生的内容信息')}</p>
            <div className="solve-IM__main--info solve-IM__main--info-center">
              <img src={require('../../../assets/IMjishi.png')} alt="" />
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
                <span>{t('机器审核')}</span>
                <span>{t('提供机器审核能力，响应时效快、审核成本低')}</span>
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

          <div className="solve-IM__main"
            style={{ display: tabIndex === 2 ? 'block' : 'none' }}
          >
            <p>{t('人工客服人员或者机器客服在处置问题中产生的内容信息')}</p>
            <div className="solve-IM__main--info solve-IM__main--info-right">
              <img src={require('../../../assets/IMkefu.png')} alt="" />
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
                <span>{t('机器审核')}</span>
                <span>{t('提供机器审核能力，响应时效快、审核成本低')}</span>
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


        </div>
        <div className="solve-IM__clientCase">
          <div className="solve-IM__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/sijibuluo.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolveIM
