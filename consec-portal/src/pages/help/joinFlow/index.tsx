import * as React from 'react'
import { IBase } from '@/interfaces'
import { t } from '@/utils'

import './style'

interface IState {

}

class HelpJoinFlow extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {

    }
    // t('')
  }

  render() {
    // const tabClick = this.tabClick;
    return (
      <div className="project-help-joinFlow">
        <h3>{t('接入流程')}</h3>

        <div className="project-help-joinFlow__step">
          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step1</div>
            <div className="project-help-joinFlow__step--item-arrows">
              <img src={require('../../../assets/flow_iocn07.png')} alt="" />
            </div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon01.png')} alt="" />
                <span>{t('场景风险咨询')}</span>
              </dt>
              <dd>
                {t('下载并填写《内容安全场景清单》，')}<br />
                {t('并发送至内容安全部邮箱')}<br />
                {t('infosec-consec@didiglobal.com')}
              </dd>
            </dl>
          </div>

          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step2</div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon02.png')} alt="" />
                <span>{t('建立场景档案')}</span>
              </dt>
              <dd>
                {t('与内容安全部对接运营同学确认安全合规要求、识别能力接入、审核流程规划、策略应用等项目，建立业务场景档案')}
              </dd>
            </dl>
          </div>

          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step3</div>
            <div className="project-help-joinFlow__step--item-arrows">
              <img src={require('../../../assets/flow_iocn07.png')} alt="" />
            </div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon03.png')} alt="" />
                <span>{t('确认过审方案')}</span>
              </dt>
              <dd>
                {t('内容安全部根据场景档案，')}<br />
                {t('为业务线定制场景过审方案，')}<br />
                {t('并同业务方确认')}
              </dd>
            </dl>
          </div>

          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step4</div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon04.png')} alt="" />
                <span>{t('确认开发排期')}</span>
              </dt>
              <dd>
                {t('内容安全部发送邮件同步接口开发及')}<br />
                {t('上线的排期，')}<br />
                {t('双方确认研发周期')}
              </dd>
            </dl>
          </div>

          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step5</div>
            <div className="project-help-joinFlow__step--item-arrows">
              <img src={require('../../../assets/flow_iocn07.png')} alt="" />
            </div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon05.png')} alt="" />
                <span>{t('联调上线')}</span>
              </dt>
              <dd>
                {t('场景接入信息校对')}<br />
                {t('确认安全服务生效')}
              </dd>
            </dl>
          </div>

          <div className="project-help-joinFlow__step--item">
            <div className="project-help-joinFlow__step--item-icon">Step6</div>
            <dl>
              <dt>
                <img src={require('../../../assets/flow_icon06.png')} alt="" />
                <span>{t('持续运营')}</span>
              </dt>
              <dd>
                {t('正式接入后对场景健康状态')}<br />
                {t('持续监控，')}<br />
                {t('并根据场景需求提供服务报表数据')}
              </dd>
            </dl>
          </div>

        </div>
      </div>
    )
  }
}

export default HelpJoinFlow

