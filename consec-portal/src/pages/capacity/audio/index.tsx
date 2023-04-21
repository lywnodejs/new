import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityAudio extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('IM通信'),
          img: require('../../../assets/audio_IM.png')
        },
        {
          name: t('点播音频'),
          img: require('../../../assets/audio_dianbo.png')
        },
      ]
    }
  }


  render() {
    const style = {
      'width': '50%'
    }
    const { tabData } = this.state

    return (
      <div className="capacity-audio">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-audio__introduce">
          {t('语音识别技术结合反垃圾文本过滤规则体系，精准、高效分析识别色情、政治、低俗、广告等多种类型的违法违规内容。')}
        </p>

        {/* 检测能力 */}
        <div className="capacity-audio__title">
          {t('检测能力')}
        </div>
        <div className="capacity-audio__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/audio_shehuang.png')} alt="" />
            </dt>
            <dd>
              {t('涉黄语音')}
            </dd>
            <dd>
              {t('提供色情、性感、低俗、污秽、色情动漫、视爱等多种类型的色情语音识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/audio_shezheng.png')} alt="" />
            </dt>
            <dd>
              {t('涉政语音')}
            </dd>
            <dd>
              {t('提供领导人相关、邪教迷信、敏感话题、英雄烈士等多种类型的涉政语音识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/audio_disu.png')} alt="" />
            </dt>
            <dd>
              {t('低俗语音')}
            </dd>
            <dd>
              {t('提供谩骂、恐吓、暴恐等多种类型的低俗语音识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/audio_guanggao.png')} alt="" />
            </dt>
            <dd>
              {t('广告语音')}
            </dd>
            <dd>
              {t('提供商业推广、违反广告法等多种类型的广告语音识别拦截能力')}
            </dd>
          </dl>
        </div>

        {/* 运维能力 */}
        <div className="capacity-audio__title">
          {t('运维策略能力')}
        </div>
        <div className="capacity-audio__operation">
          <dl>
            <dt>
              {t('舆情布控同步')}
            </dt>
            <dd>
              {t('每周定期对当前国内外舆情进行监控，定制内容安全布控策略')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('政策法规解读')}
            </dt>
            <dd>
              {t('对国家已颁布或新颁布的政策法规进行专业解读，并有效转化成审核标准')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('审核策略调优')}
            </dt>
            <dd>
              {t('针对不同业务场景需求定制特殊机审、人审策略，不断提升业务线内容安全水准')}
            </dd>
          </dl>
        </div>

        {/* 应用场景 */}
        <h3>{t('应用场景')}</h3>
        <TabMenus
          tabData={tabData}
          style={style}
        />

        {/* 核心优势 */}
        <h3>{t('核心优势')}</h3>
        <div className="capacity-audio__kernel">
          <dl>
            <dt>{t('识别能力多样')}</dt>
            <dd>{t('具备组合多种类型的机器算法能力和人工审核能力，提升语音识别准确率')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityAudio
