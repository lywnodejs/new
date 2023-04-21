import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityComplaint extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('IM消息'),
          img: require('../../../assets/complaint_IM.jpg')
        },
        {
          name: t('帖子评论'),
          img: require('../../../assets/complaint_tianzi.png')
        },
        {
          name: t('判罚争议'),
          img: require('../../../assets/complaint_panfa.png')
        }
      ]
    }
  }


  render() {
    const style = {
      'width': '33.333%'
    }
    const { tabData } = this.state
    return (
      <div className="capacity-complaint">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-complaint__introduce">
          {t('提供对用户的投诉、申诉进行人工审核并实时处置的能力，构建业务线生态治理自闭环，持续提升内容生态环境。')}
        </p>

        {/* 基本功能 */}
        <div className="capacity-complaint__title">
          {t('基本功能')}
        </div>
        <div className="capacity-complaint__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/complation_neirong.png')} alt="" />
            </dt>
            <dd>
              {t('内容投诉审核')}
            </dd>
            <dd>
              {t('提供对内容投诉进行人工审核的能力，帮助业务线实现搭建内容投诉举报渠道的合规要求，全方位保障内容安全')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/complation_yingji.png')} alt="" />
            </dt>
            <dd>
              {t('用户投诉审核')}
            </dd>
            <dd>
              {t('提供对用户投诉进行人工审核的能力，帮助业务线及时发现并处置违规用户，从内容源头上保障内容安全')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/complation_zhiliang.png')} alt="" />
            </dt>
            <dd>
              {t('申诉审核')}
            </dd>
            <dd>
              {t('提供对内容或用户的管控申诉进行人工审核的能力，帮助业务线实现投诉申诉反馈闭环，保障用户体验')}
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
        <div className="capacity-complaint__kernel">
          <dl>
            <dt>{t('多类型内容投诉审核')}</dt>
            <dd>{t('支持文本、图片、音视频的内容安全投诉审核')}</dd>
          </dl>
          <dl>
            <dt>{t('多维度优化内容生态')}</dt>
            <dd>{t('支持从内容、用户等维度提升业务线场景的内容安全生态')}</dd>
          </dl>
          <dl>
            <dt>{t('提升用户体验')}</dt>
            <dd>{t('提供用户对于平台处置动作的投诉申诉审核，避免因为恶意投诉而导致的用户体检问题')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityComplaint
