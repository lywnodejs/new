import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityVideo extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('IM消息'),
          img: require('../../../assets/video_IM.png')
        },
        {
          name: t('点播视频'),
          img: require('../../../assets/video_dianbo.png')
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
      <div className="capacity-video">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-video__introduce">
          {t('支持各类场景中的视频文件过检，机器切帧结合图片识别、人工审核，准确过滤视频中存在的色情、政治、暴恐、广告等多种类型的内容风险。')}
        </p>

        {/* 检测能力 */}
        <div className="capacity-video__title">
          {t('检测能力')}
        </div>
        <div className="capacity-video__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/video_shehuang.png')} alt="" />
            </dt>
            <dd>
              {t('涉黄视频')}
            </dd>
            <dd>
              {t('提供色情、性感、低俗、污秽、色情动漫、视爱等多种类型的色情视频识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/video_shezheng.png')} alt="" />
            </dt>
            <dd>
              {t('涉政视频')}
            </dd>
            <dd>
              {t('提供恶搞领导人物、反动人物、国旗国徽、军装等多种类型的涉政视频识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/video_baokong.png')} alt="" />
            </dt>
            <dd>
              {t('暴恐视频')}
            </dd>
            <dd>
              {t('提供暴恐人物、暴恐旗帜、暴恐场景等多种类型的暴恐视频识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/video_guanggao.png')} alt="" />
            </dt>
            <dd>
              {t('广告视频')}
            </dd>
            <dd>
              {t('提供二维码、色情广告、营销广告、广告法违规等多种类型的广告视频识别拦截能力')}
            </dd>
          </dl>
        </div>

        {/* 运维能力 */}
        <div className="capacity-video__title">
          {t('运维策略能力')}
        </div>
        <div className="capacity-video__operation">
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
        <div className="capacity-video__kernel">
          <dl>
            <dt>{t('识别能力多样')}</dt>
            <dd>{t('具备组合多种类型的机器算法能力和人工审核能力，提升视频识别准确率')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityVideo
