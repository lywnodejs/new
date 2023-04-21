import * as React from 'react'

import { t } from '@/utils'
import { IBase } from '@/interfaces'
import TabMenus from '@/components/TabMenus'

import './style'

interface IState {
  tabData: Array<any>
}

class CapacityText extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabData: [
        {
          name: t('IM消息'),
          img: require('../../../assets/IMxiaoxi.png')
        },
        {
          name: t('留言评论'),
          img: require('../../../assets/liuyepinlun.png')
        },
        {
          name: t('帖子文章'),
          img: require('../../../assets/tianziwenzhang.png')
        },
        {
          name: t('昵称签名'),
          img: require('../../../assets/nicheng.png')
        }
      ]
    }
  }



  render() {
    const style = {
      'width': '25%'
    }
    const { tabData } = this.state
    return (
      <div className="capacity-text">

        <h3>{t('产品介绍')}</h3>

        <p className="capacity-text__introduce">
          {t('基于海量样本数据，定制检测及审核策略，高效识别并过滤色情、政治、暴恐、低俗、广告等多种类型的违法违规内容。')}
        </p>

        {/* 检测能力 */}
        <div className="capacity-text__title">
          {t('检测能力')}
        </div>
        <div className="capacity-text__detection">
          <dl>
            <dt>
              <img src={require('../../../assets/shehuang.png')} alt="" />
            </dt>
            <dd>
              {t('涉黄文本')}
            </dd>
            <dd>
              {t('提供色情描述、色情传播、违法性行为、非正常性行为等多种类型的涉黄文本审核拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/shezheng.png')} alt="" />
            </dt>
            <dd>
              {t('涉政文本')}
            </dd>
            <dd>
              {t('提供敏感事件、高危反动、正面人物负向信息、集体事件等多种类型的涉政文本审核拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/baokong.png')} alt="" />
            </dt>
            <dd>
              {t('暴恐文本')}
            </dd>
            <dd>
              {t('提供恐怖主义、危害公共安全、暴力犯罪等多种类型的暴恐文本审核拦截能力')}
            </dd>
          </dl>
          <dl>
            <dt>
              <img src={require('../../../assets/disu.png')} alt="" />
            </dt>
            <dd>
              {t('低俗文本')}
            </dd>
            <dd>
              {t('提供侮辱言行、淫秽低俗、低俗文化等多种类型的低俗文本审核拦截能力')}
            </dd>
          </dl>
        </div>

        {/* 运维能力 */}
        <div className="capacity-text__title">
          {t('运维策略能力')}
        </div>
        <div className="capacity-text__operation">
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

        {/* 自动义能力 */}
        <div className="capacity-text__title">
          {t('自定义功能能力')}
        </div>
        <div className="capacity-text__operation">
          <dl>
            <dt>
              {t('关键词管理')}
            </dt>
            <dd>
              {t('支持根据业务需要或重大保障时期上下线关键词，配置灵活便捷')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('业务定制词库')}
            </dt>
            <dd>
              {t('个性化定制业务线专有词库，规避业务场景特有内容风险')}
            </dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>
              {t('黑白灰名单')}
            </dt>
            <dd>
              {t('多类敏感词命中策略组合，最大限度保障业务线内容安全与用户体验')}
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
        <div className="capacity-text__kernel">
          <dl>
            <dt>{t('标准灵活定制')}</dt>
            <dd>{t('支持业务线定制审核标准，不同场景采取不同审核标准')}</dd>
          </dl>
          <dl>
            <dt>{t('自然语言处理')}</dt>
            <dd>{t('通过语义分析构建智能机器学习算法，高效过滤复杂变种文本')}</dd>
          </dl>
          <dl>
            <dt>{t('模型贴合业务')}</dt>
            <dd>{t('训练数据源取自业务线数据，模型效果更佳')}</dd>
          </dl>
          <dl>
            <dt>{t('企业底线词库')}</dt>
            <dd>{t('公司内部底线词库，安全一站兜底')}</dd>
          </dl>
        </div>
      </div>
    )
  }
}

export default CapacityText
