import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolveUGC extends React.Component<IBase, IState> {
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
      <div className="solve-UGC">
        <div className="solve-UGC__banner">
          <img src={require('../../../assets/banner_UGC.jpg')} alt="" />
        </div>
        <div className="solve-UGC__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/UgcBgImg.png')} alt="" />
        </div>

        <div className="solve-UGC__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-UGC__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('基础功能型UGC')}
          </li>
          <li
            className={tabIndex === 1 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(1) }}
          >
            {t('发帖评论类UGC')}
          </li>
        </div>
        <div className="solve-UGC__main-Content">
          <div className="solve-UGC__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>{t('用户生成，基于平台基础性功能，用于改善平台功能、提升自身体验等的功能性内容，为客观描述、不含观点（如司机语音输入功能，可用于导航、生成订单、上报反馈），一般为平台员工可见或用户自己可见')}</p>
            <div className="solve-UGC__main--info">
              <img src={require('../../../assets/info_UGC.png')} alt="" />
              <li>
                <i></i>
                <span>{t('机器审核')}</span>
                <span>{t('提供机器审核能力，响应时效快、审核成本低')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('申诉反馈')}</span>
                <span>{t('提供申诉反馈渠道，保护用户使用体验')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>{t('根据国家法规及公司要求，为业务线定制重保方案')}</span>
              </li>
            </div>
          </div>

          <div className="solve-UGC__main"
            style={{ display: tabIndex === 1 ? 'block' : 'none' }}
          >
            <p>{t('用户生成，以跟帖评论为主，除客观描述外，通常含有观点，能够表达情感，内容形式（如图、文、语音、视频、外部链接）丰富、可见范围大、用户规模大，安全风险高')}</p>
            <div className="solve-UGC__main--info solve-UGC__main--info-right">
              <img src={require('../../../assets/info_pinlun.png')} alt="" />
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
                <span>{t('先审后发机制，多层审核兜底，最大限度保障内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('申诉反馈')}</span>
                <span>{t('提供申诉反馈渠道，保护用户使用体验')}</span>
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
        <div className="solve-UGC__clientCase">
          <div className="solve-UGC__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/didipaotui.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolveUGC
