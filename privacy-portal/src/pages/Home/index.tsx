import * as React from 'react'
import { observer } from 'mobx-react'
import './style'
interface IState {
  renderList: any
}

@observer
class Home extends React.Component<IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      renderList: []
    }
  }

  render() {
    return (
      <div className="privacy-home">
        <div className="privacy-home-container">
          <div className="privacy-home-container-item">
            <div className="privacy-home-container-item__left">
              <p>公开透明</p>
              <span>充分尊重用户，收集个人信息充分告知用户，并取得用户同意</span>
            </div>
            <div className="privacy-home-container-item__right">
              <img src={require('../../assets/home01.png')} />
            </div>
          </div>
          <div className="privacy-home-container-item">
            <div className="privacy-home-container-item__left">
              <p>合法自律</p>
              <span>保证个人信息使用合法、正当，全方位保护用户个人信息是滴滴的基本责任和义务</span>
            </div>
            <div className="privacy-home-container-item__right">
              <img src={require('../../assets/home02.png')} />
            </div>
          </div>
          <div className="privacy-home-container-item">
            <div className="privacy-home-container-item__left">
              <p>最小必要</p>
              <span>收集用户尽可能少的信息，最大限度满足用户的隐私保护和人身安全需求</span>
            </div>
            <div className="privacy-home-container-item__right">
              <img src={require('../../assets/home03.png')} />
            </div>
          </div>
          <div className="privacy-home-container-item">
            <div className="privacy-home-container-item__left">
              <p>持续保护</p>
              <span>不断完善隐私的全生命周期保护，持续用最新的科学技术提升隐私保护能力，用科技让隐私更安全</span>
            </div>
            <div className="privacy-home-container-item__right">
              <img src={require('../../assets/home04.png')} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
