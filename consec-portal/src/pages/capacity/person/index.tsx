import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityPerson extends React.Component<IBase, IState> {
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

    return (
      <div className="capacity-person">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-person__introduce">
          {t('拥有专业内容审核团队，基于内容安全审核系统，重大安全保障时期提供7x24小时全天候人工审核支持，严格保障内容安全。')}
        </p>

        {/* 审核能力 */}
        <div className="capacity-person__title">
          {t('审核能力')}
        </div>
        <div className="capacity-person__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/person_neirong.png')} alt="" />
            </dt>
            <dd>
              {t('内容安全审核')}
            </dd>
            <dd>
              {t('提供文本、图片及音视频等多种内容类型的人工审核能力，有效过滤涉政、色情、低俗、暴恐等多种类型的违规内容')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/person_yinji.png')} alt="" />
            </dt>
            <dd>
              {t('应急响应审核')}
            </dd>
            <dd>
              {t('提供实时接收审核要求，快速接入、快速布控、快速审核的应急响应能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/person_zhiliang.png')} alt="" />
            </dt>
            <dd>
              {t('内容质量审核')}
            </dd>
            <dd>
              {t('提供文本、图片及音视频等多种类型内容的质量审核，调性管控，能够根据业务需要有效识别出各场景下的优质内容，优化业务线内容生态环境')}
            </dd>
          </dl>
        </div>

        {/* 组织 */}
        <div className="capacity-person__title">
          {t('组织能力')}
        </div>
        <div className="capacity-person__operation">
          <dl>
            <dt>
              {t('重大保障时期响应')}
            </dt>
            <dd>
              {t('为业务线提供重大安全保障时期或业务线特殊要求时期的全天候内容安全护航，保障业务内容安全')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('业务定制标准落地')}
            </dt>
            <dd>
              {t('根据业务线需要，定制化人工审核标准，并形成资料进行及时的审核标准培训')}
            </dd>
          </dl>
          <dl></dl>
        </div>

        {/* 应用场景 */}
        <h3>{t('应用场景')}</h3>
        <div className="capacity-person__use">
          <dl>
            <dt>{t('重大保障时期响应')}</dt>
            <dd>{t('对于风险等级高，传播范围大的场景，人工审核能够有效降低内容安全风险，提供更加准确的内容安全审核能力，并进行线上管控，及时止损')}</dd>
          </dl>
          <dl>
            <dt>{t('定制化需求')}</dt>
            <dd>{t('对于风险保障和用户体验兼顾的场景，人工审核能够通过个性化标准设置，把握内容审核管控的尺度，在不伤害用户体验的情况下，降低内容安全事件发生概率')}</dd>
          </dl>
          <dl>
            <dt>{t('内容质量及调性审核')}</dt>
            <dd>{t('对于优质内容甄别和筛选，人工审核能够根据业务方活动或平台调性的要求，高效的筛选出符合业务方需要的优质内容，助力业务发展')}</dd>
          </dl>
        </div>

        {/* 核心优势 */}
        <h3>{t('核心优势')}</h3>
        <div className="capacity-person__kernel">
          <dl>
            <dt>{t('专业审核团队')}</dt>
            <dd>{t('拥有从招聘、培训、考试、晋升等全流程体系的审核团队，具备完善的审核流程及应急响应机制')}</dd>
          </dl>
          <dl>
            <dt>{t('支持标准定制')}</dt>
            <dd>{t('支持审核策略个性化定制，满足业务线的特殊需求')}</dd>
          </dl>
          {/* <dl>
            <dt>{t('7*24小时服务')}</dt>
            <dd>{t('提供7*24小时人工审核服务（含节假日），科学排版无缝衔接')}</dd>
          </dl> */}
          <dl>
            <dt>{t('多重审核流程')}</dt>
            <dd>{t('具备人审+质检+巡检三道内容安全机制，具备短时间高精度的人工审核能力')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityPerson
