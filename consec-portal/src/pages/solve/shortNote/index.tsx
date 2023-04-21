import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolveShorNote extends React.Component<IBase, IState> {
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
      <div className="solve-shortNote">
        <div className="solve-shortNote__banner">
          <img src={require('../../../assets/short_push.png')} alt="" />
        </div>
        <div className="solve-shortNote__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/short_bg.png')} alt="" />
        </div>

        <div className="solve-shortNote__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon02.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-shortNote__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('服务功能类')}
          </li>
          <li
            className={tabIndex === 1 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(1) }}
          >
            {t('营销运营类')}
          </li>
        </div>
        <div className="solve-shortNote__main-Content">
          <div className="solve-shortNote__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>{t('用于连接服务功能运行的短信、push和消息通知，端内为主，一般为有模版的固定内容，如系统通知乘客“车已到达”等')}</p>
            <div className="solve-shortNote__main--info solve-shortNote__main--info-left">
              <img src={require('../../../assets/user_fuwu.png')} alt="" />
              <li>
                <i></i>
                <span>{t('机器审核')}</span>
                <span>
                  {t('提供机器审核能力，响应时效快、审核成本低')}
                </span>
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
                <span>
                  {t('提供质量检测服务，对质检不通过的内容进行下线处理')}
                </span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>
                  {t('根据国家法规及公司要求，为业务线定制重保方案')}
                </span>
              </li>
            </div>
          </div>

          <div className="solve-shortNote__main"
            style={{ display: tabIndex === 1 ? 'block' : 'none' }}
          >
            <p>{t('商业营销短信、push和消息通知，端内外均有涉及')}</p>
            <div className="solve-shortNote__main--info solve-shortNote__main--info-right">
              <img src={require('../../../assets/user_yinxiao.png')} alt="" />
              <li>
                <i></i>
                <span>{t('机器审核')}</span>
                <span>
                  {t('提供机器审核能力，响应时效快、审核成本低')}
                </span>
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
                <span>
                  {t('提供质量检测服务，对质检不通过的内容进行下线处理')}
                </span>
              </li>
              <li>
                <i></i>
                <span>{t('重大保障期要求')}</span>
                <span>
                  {t('根据国家法规及公司要求，为业务线定制重保方案')}
                </span>
              </li>
            </div>
          </div>


        </div>
        <div className="solve-shortNote__clientCase">
          <div className="solve-shortNote__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/didiicon.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolveShorNote
