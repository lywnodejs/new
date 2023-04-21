import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'

interface IState {
  tabIndex: number // tab下标
}

class SolveFile extends React.Component<IBase, IState> {
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
      <div className="solve-file">
        <div className="solve-file__banner">
          <img src={require('../../../assets/fileBanner.png')} alt="" />
        </div>
        <div className="solve-file__topMain">
          <h4>
            <img src={require('../../../assets/UGCicon01.png')} alt="" />
            {t('典型场景')}
          </h4>
          <img src={require('../../../assets/fileicon01.png')} alt="" />
        </div>

        <div className="solve-file__centerMain">
          <h4>
            <img src={require('../../../assets/UGCicon02.png')} alt="" />
            {t('合规方案')}
          </h4>
        </div>

        <div className="solve-file__nav">
          <li
            className={tabIndex === 0 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(0) }}
          >
            {t('云盘')}
          </li>
          <li
            className={tabIndex === 1 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(1) }}
          >
            {t('网盘')}
          </li>
          <li
            className={tabIndex === 2 ? 'solve__nav--active' : ''}
            onClick={() => { tabClick(2) }}
          >
            {t('网站')}
          </li>
        </div>
        <div className="solve-file__main-Content">
          <div className="solve-file__main"
            style={{ display: tabIndex === 0 ? 'block' : 'none' }}
          >
            <p>{t('企业或个人生产的数据或代码信息的云存储，一般不用于分享传播')}</p>
            <div className="solve-file__main--info solve-file__main--info-left">
              <img src={require('../../../assets/file_yunpan.png')} alt="" />
              <li>
                <i></i>
                <span>{t('机器审核')}</span>
                <span>{t('在未出过问题的前提下，进行实时机审。机审不通过，即上传失败，进行话术提示。机审通过，内容发布')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('质量检测')}</span>
                <span>{t('对发布内容，由人工进行质量检测，下线违规内容，进行话术提示')}</span>
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

          <div className="solve-PGC__main"
            style={{ display: tabIndex === 1 ? 'block' : 'none' }}
          >
            <p>{t('企业或个人通过云服务存储多媒体文件，并有较大可能性进行文件的分享传播')}</p>
            <div className="solve-file__main--info solve-file__main--info-center">
              <img src={require('../../../assets/file_wangpan.png')} alt="" />
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
                <span>{t('先发后审')}</span>
                <span>{t('先发后审机制，适应业务线高时效要求的内容审查，兼顾用户体验与内容安全')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('质量检测')}</span>
                <span>{t('提供质量检测服务，对质检不通过的内容进行下线处理')}</span>
              </li>
              <li>
                <i></i>
                <span>{t('前台巡查')}</span>
                <span>{t('提供前台巡查服务，及时发现和处置违法违规信息')}</span>
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

          <div className="solve-file__main"
            style={{ display: tabIndex === 2 ? 'block' : 'none' }}
          >
            <p>{t('网站云存储过程中出现的违法违规信息')}</p>
            <div className="solve-file__main--info solve-file__main--info-right">
              <img src={require('../../../assets/file_wangzhan.png')} alt="" />
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
        <div className="solve-file__clientCase">
          <div className="solve-file__clientCase--main">
            <h4>
              <img src={require('../../../assets/UGCicon03.png')} alt="" />
              {t('客户案例')}
            </h4>

            <img src={require('../../../assets/didiyun.png')} alt="" />
          </div>
        </div>

      </div>
    )
  }
}

export default SolveFile
