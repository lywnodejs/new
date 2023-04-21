import * as React from 'react'
import { observer } from 'mobx-react'
import { t } from '@/utils'
import dinject from 'decorates/inject'
import { IBase } from '@/interfaces'
import './style'

interface Istate {
  capacityList: any
  schemeList: any
}

@dinject('router', 'app')

@observer
class ContentInfo extends React.Component<IBase, Istate> {
  constructor(props: any) {
    super(props)
    this.state = {
      capacityList: [ // 产品能力列表数据
        {
          icon: require('../../../assets/home_text.png'),
          title: t('文本审核'),
          url: '/capacity/text',
          content: t('基于海量样本数据，定制过审策略，高效过滤色情、广告、涉政、暴恐等多类违规违法文本信息')
        },
        {
          icon: require('../../../assets/home_ing.png'),
          title: t('图片审核'),
          url: '/capacity/img',
          content: t('多类图片识别能力，精准识别高效过滤色情、广告、涉政、暴恐等多类违规违法图片信息')
        },
        {
          icon: require('../../../assets/hoome_audio.png'),
          title: t('音频审核'),
          url: '/capacity/audio',
          content: t('语音识别技术结合反垃圾文本过滤规则体系，精准、高效分析识别违规音频')
        },
        {
          icon: require('../../../assets/home_video.png'),
          title: t('视频审核'),
          url: '/capacity/video',
          content: t('机器切帧审核结合人工审核，有效对各类场景视频进行审核检测，保障视频内容安全')
        },
        {
          icon: require('../../../assets/home_rengong.png'),
          title: t('人工审核'),
          url: '/capacity/person',
          content: t('专业内容审核团队，基于内容安全审核系统，提供内容安全及内容质量审核服务')
        },
        {
          icon: require('../../../assets/home_user1.png'),
          title: t('用户管控'),
          url: '/capacity/user',
          content: t('对用户进行风险等级分类并进行管控，从源头控制内容安全风险，符合国家内容安全合规要求')
        },
        {
          icon: require('../../../assets/home_tousu.png'),
          title: t('投诉申诉'),
          url: '/capacity/complaint',
          content: t('提供用户投诉、申诉实时处置能力，构建业务线生态治理自闭环，持续提升内容生态环境')
        },
      ],
      schemeList: [ // 解决方案列表数据
        {
          icon: require('../../../assets/home_pgc.png'),
          title: t('PGC场景'),
          content: t('针对以公司立场对外发送的内容，提供合规解决方案'),
          url: '/solve/PGC'
        },
        {
          icon: require('../../../assets/home_ugc.png'),
          title: t('UGC场景'),
          content: t('针对用户生产发送的内容，提供合规解决方案'),
          url: '/solve/UGC'
        },
        {
          icon: require('../../../assets/home_im.png'),
          title: t('IM消息'),
          content: t('针对即时通讯产生的内容，提供合规解决方案'),
          url: '/solve/IM'
        },
        {
          icon: require('../../../assets/home_user.png'),
          title: t('用户信息'),
          content: t('针对个人或商户的基础身份信息内容，提供合规解决方案'),
          url: '/solve/user'
        },
        {
          icon: require('../../../assets/home_info.png'),
          title: t('消息通知'),
          content: t('针对端内端外的短信、push、消息通知内容，提供合规解决方案'),
          url: '/solve/shorNote'
        },
        {
          icon: require('../../../assets/home_file.png'),
          title: t('文件存储'),
          content: t('针对文件存储服务，提供内容合规解决方案'),
          url: '/solve/file'
        },
      ]
    }
  }

  handleClickJournalism = (url) => {
    window.open(url)
  }
  toPage = (url) => {
    this.props.router!.push(url)
  }

  render() {
    const { capacityList } = this.state
    const { schemeList } = this.state
    return (
      <div className="project-main">
        <div className="project-main-nav">
          <ul>
            <li >{t('文本安全')}</li>
            <li>{t('图片安全')}</li>
            <li>{t('音频安全')}</li>
            <li>{t('视频安全')}</li>
          </ul>
        </div>

        {/* ----------产品能力----------- */}
        <div className="project-main-capacity">
          <h3>{t('七类产品能力,帮助业务线规避内容安全风险')}</h3>
          <div className="capacity-item">
            {
              capacityList.map(item => {
                return (
                  <dl
                    key={item.title}
                    onClick={() => { this.toPage(item.url) }}
                  >
                    <dt>
                      <img src={item.icon} alt="" />
                    </dt>
                    <dd>{item.title}</dd>
                    <dd>{item.content}</dd>
                  </dl>
                )
              })
            }
          </div>
        </div>

        {/* ----------解决方案----------- */}
        <div className="project-main-scheme">
          <div className="project-main-scheme-bg"></div>
          <h3>{t('六类场景解决方案，让平台的信息合法合规')}</h3>
          <div className="scheme-item">
            {
              schemeList.map(item => {
                return (
                  <dl
                    key={item.title}
                    onClick={() => { this.toPage(item.url) }}
                  >
                    <dt>
                      <img
                        src={item.icon}
                      />
                    </dt>
                    <dd>{item.title}</dd>
                    <dd>{item.content}</dd>
                    <button>
                      {t('了解更多')}
                    </button>
                  </dl>
                )
              })
            }
          </div>
        </div>

        {/* ----------舆情新闻----------- */}
        <div className="project-main-journalism">
          <h3>{t('行业动态')}</h3>

          <div className="project-main-journalism--content">
            <dl onClick={() => { this.handleClickJournalism('http://www.cac.gov.cn/2017-09/07/c_1121623889.htm') }}>
              <dt><img src={require('../../../assets/homejournalism.png')} alt="" /></dt>
              <li>
                <dd>{t('互联网群组信息服务管理规定')}</dd>
                <span>{t('2017年09月07日 18:00')}</span>
                <dd>{t('互联网群组信息服务提供者应当落实信息内容安全管理主体责任，配备与服务规模相适应的专业人员和技术能力，建立健全用户注册、信息审核、应急处置、安全防护等管理制度。')}</dd>
              </li>
            </dl>

            <dl onClick={() => { this.handleClickJournalism('http://www.cac.gov.cn/2019-12/20/c_1578375159509309.htm') }}>
              <dt><img src={require('../../../assets/homejournalism_two.png')} alt="" /></dt>
              <li>
                <dd>{t('网络信息内容生态治理规定')}</dd>
                <span>{t('2019年12月20日 14:00')}</span>
                <dd>{t('网络信息内容生态治理，是指政府、企业、社会、网民等主体，以培育和践行社会主义核心价值观为根本，以网络信息内容为主要治理对象，以建立健全网络综合治理体系、营造清朗的网络空间、建设良好的网络生态为目标，开展的弘扬正能量、处置违法和不良信息等相关活动。')}</dd>
              </li>
            </dl>
            <dl onClick={() => { this.handleClickJournalism('http://www.cac.gov.cn/2019-11/29/c_1576561820967678.htm') }}>
              <dt><img src={require('../../../assets/homejournalism02.png')} alt="" /></dt>
              <li>
                <dd>{t('网络音视频信息服务管理规定')}</dd>
                <span>{t('2019年11月29日 14:00')}</span>
                <dd>{t('国家鼓励和指导互联网行业组织加强行业自律，建立健全网络音视频信息服务行业标准和行业准则，推动网络音视频信息服务行业信用体系建设，督促网络音视频信息服务提供者依法提供服务、接受社会监督，提高网络音视频信息服务从业人员职业素养，促进行业健康有序发展。')}</dd>
              </li>
            </dl>
          </div>

        </div>
      </div>
    )
  }
}

export default ContentInfo
