import * as React from 'react'

import { observer } from 'mobx-react'
import dinject from 'decorates/inject'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import './style'


@dinject('router', 'app')

@observer
class Footer extends React.Component<IBase> {
  constructor(props: any) {
    super(props)
  }

  // 菜单点击跳转
  toPage = (param: any) => {
    if (param.url === '/help/interface') {
      this.props.router!.push('/help/interface/machine')
      return
    }
    if (!param.undone) {
      this.props.router!.push(param.url)
    }
  }

  render() {
    const { menus } = this.props!.app!
    const toPage = this.toPage
    return (
      <footer className={'project-footer'}>
        <div className={'project-footer-container'}>
          {
            menus.map(item => {
              return (
                <ul key={item.title}>
                  <p>{item.title}</p>
                  {
                    item.list.map(itemB => {
                      return (
                        <li
                          key={itemB.url}
                        >
                          <a
                            href="javascript:;"
                            onClick={() => { return toPage(itemB) }}
                          >
                            {itemB.text}
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
              )
            })
          }
          <dl>
            <dt>{t('联系我们')}</dt>
            <dd>
              <img src={require('@/assets/relation.jpg')} alt="" />
            </dd>
          </dl>
        </div>
        <div className="bottomInfo">
          {t('让平台的所有信息合法，纯净，文明')}
        </div>
      </footer>
    )
  }
}
export default Footer
