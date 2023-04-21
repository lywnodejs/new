import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityImg extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('头像'),
          img: require('../../../assets/img_touxiang.png')
        },
        {
          name: t('留言评论'),
          img: require('../../../assets/img_pinglun.png')
        },
        {
          name: t('IM消息'),
          img: require('../../../assets/img_IM.png')
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
      <div className="capacity-img">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-img__introduce">
          {t('多类图片识别检测能力，通过定制策略组合，精准过滤色情、政治、暴恐、广告等多种类型的违法违规图片')}
        </p>

        {/* 检测能力 */}
        <div className="capacity-img__title">
          {t('检测能力')}
        </div>
        <div className="capacity-img__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/img_shehuang.png')} alt="" />
            </dt>
            <dd>
              {t('涉黄图片')}
            </dd>
            <dd>
              {t('提供色情人物、卡通色情、臀部、性行为等多种类型的色情图片识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/img_shezheng.png')} alt="" />
            </dt>
            <dd>
              {t('涉政图片')}
            </dd>
            <dd>
              {t('提供涉政人物、涉政旗帜、涉政标识、涉政场景等多种类型的涉政图片识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/img_baokong.png')} alt="" />
            </dt>
            <dd>
              {t('暴恐图片')}
            </dd>
            <dd>
              {t('提供暴恐人物、暴恐旗帜、暴恐场景等多种类型的暴恐图片识别拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/img_guanggao.png')} alt="" />
            </dt>
            <dd>
              {t('广告图片')}
            </dd>
            <dd>
              {t('提供二维码、色情广告、推广广告、广告法违规等多种类型的广告图片识别拦截能力')}
            </dd>
          </dl>
        </div>

        {/* 运维能力 */}
        <div className="capacity-img__title">
          {t('运维策略能力')}
        </div>
        <div className="capacity-img__operation">
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

        {/* 自定义功能能力 */}
        <div className="capacity-img__title">
          {t('自定义功能能力')}
        </div>
        <div className="capacity-img__usercustom">
          <dl>
            <dt>
              {t('图片黑名单管理')}
            </dt>
            <dd>
              {t('支持根据业务现需要定制黑图库，精准识别过滤风险图片')}
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
        <div className="capacity-img__kernel">
          <dl>
            <dt>{t('标准灵活定制')}</dt>
            <dd>{t('支持业务线定制审核标准，不同场景采取不同审核标准')}</dd>
          </dl>
          <dl>
            <dt>{t('模型贴合业务')}</dt>
            <dd>{t('服务于滴滴各条业务线，积累海量出行场景数据，更贴合业务需求')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityImg
