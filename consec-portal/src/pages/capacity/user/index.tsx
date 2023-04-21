import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityUser extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('UGC社区用户'),
          img: require('../../../assets/user_UGC.png')
        },
        {
          name: t('IM用户'),
          img: require('../../../assets/user_IM.png')
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
      <div className="capacity-user">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-user__introduce">
          {t('通过对用户内容生产的行为进行分析，对用户进行风险分级及管控，从源头控制内容安全风险，满足国家对内容安全监管的合规性要求。')}
        </p>

        {/* 审核能力 */}
        <div className="capacity-user__title">
          {t('基本功能')}
        </div>
        <div className="capacity-user__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/user_yonghu.png')} alt="" />
            </dt>
            <dd>
              {t('用户分层')}
            </dd>
            <dd>
              {t('通过对用户在业务线场景下的内容生产行为进行分析，对用户进行精细化风险分层，描绘业务线用户生态画像')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/user_zhibiao.png')} alt="" />
            </dt>
            <dd>
              {t('指标定制')}
            </dd>
            <dd>
              {t('支持定制管控指标及自定义管控指标，精准定义业务线风险用户，数据驱动改善内容生态')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/user_xianshang.png')} alt="" />
            </dt>
            <dd>
              {t('实时处置')}
            </dd>
            <dd>
              {t('基于用户风险分层，实现对不同等级的风险用户进行包括禁言、警告、封禁等实时处罚动作，降低高风险用户的内容违规风险')}
            </dd>
          </dl>
        </div>

        {/* 运维策略能力 */}
        <div className="capacity-user__title">
          {t('运维策略能力')}
        </div>
        <div className="capacity-user__operation">
          <dl>
            <dt>
              {t('管控策略调优')}
            </dt>
            <dd>
              {t('制定业务线用户管控策略，并根据线上效果进行实时调优，兼顾用户体验和内容安全')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('高危用户告警')}
            </dt>
            <dd>
              {t('对业务线频繁违规的高危用户进行识别核验，并向业务线反馈情况进行针对性处置')}
            </dd>
          </dl>
          <dl></dl>
        </div>

        {/* 自定义功能能力 */}
        <div className="capacity-user__title">
          {t('自定义功能能力')}
        </div>
        <div className="capacity-user__operation">
          <dl>
            <dt>
              {t('自定义管控指标')}
            </dt>
            <dd>
              {t('支持业务线根据自身需要确定核心管控指标，并设计对应的管控策略')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('自定义处置动作')}
            </dt>
            <dd>
              {t('支持业务线根据自身管控处置需求，自定义用户管控的处置动作')}
            </dd>
          </dl>
          <dl></dl>
        </div>

        {/* 应用场景 */}
        <h3>{t('应用场景')}</h3>
        <TabMenus
          tabData={tabData}
          style={style}
        />

        {/* 核心优势 */}
        <h3>{t('核心优势')}</h3>
        <div className="capacity-user__kernel">
          <dl>
            <dt>{t('支持管控指标定制')}</dt>
            <dd>{t('定制管控指标，精准定位内容高危用户')}</dd>
          </dl>
          <dl>
            <dt>{t('支持处置动作定制')}</dt>
            <dd>{t('定制处置动作，适应不同业务线场景的不同处置需求')}</dd>
          </dl>
          <dl>
            <dt>{t('人工复核精准处置')}</dt>
            <dd>{t('人工复核管控意见，减少和避免错判、漏判')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityUser
