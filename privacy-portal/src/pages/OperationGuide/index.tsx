import * as React from 'react'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'

import { IExample, IGetContentModel, IDisplayedAppsModel } from '../../interfaces'
import './style'
import TreeContet from '../../components/treeContent'
import Skeleton from 'components/skeleton'

interface IState {
  appList: any
  content: any
  isSelect: any
  logo: any
}
@dinject('getContent','displayedApps')
@observer
class OperationGuide extends React.Component<IExample&IGetContentModel&IDisplayedAppsModel, IState> {
  params: any
  constructor(props: any) {
    super(props)
    this.state = {
      isSelect:0,
      appList:[],
      content: '',
      logo:''
    }
    this.params = {
      type: 2,
      appId: 1,
    }
    this.setAct = this.setAct.bind(this)
  }
  componentDidMount() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)

    setTimeout(() => {
      const query = document.getElementById('scrollOperationGuide')
      query && query.classList.remove('scrollBottom')
      query && query.classList.remove('scrollCenter')
    }, 50)

    const lang = this.props.app!.language
    this.params.lang = lang
    this.props.displayedApps!.displayedApps({type: 2, lang: lang}).then(res => {
      this.params.appId = res[0].id
      this.props.getContent!.getContent(this.params).then(res1 => {
        if (res1) {
          this.setState({
            content: res1.content
          })
        }
      })
      this.setState({
        appList: res,
        logo: res[0].logo
      })
    })

  }
  setAct(e:any){
    const lang = this.props.app!.language
    this.params.lang = lang
    this.params.appId = Number(e.currentTarget.getAttribute('data-appId'))
    this.props.getContent!.getContent(this.params).then(res=> {
      if (res) {
        this.setState({
          content: res.content
        })
      } else {
        this.setState({
          content: ''
        })
      }
    })
    this.setState({
      logo:String(e.currentTarget.getAttribute('data-logo')),
      isSelect:Number(e.currentTarget.getAttribute('data-index'))
    })
  }

  handleScroll =()=>{
    const scroll = document.getElementById('scrollOperationGuide') // 定义一个dom节点为'header'的header变量
    if(window.scrollY >= 554 && window.pageYOffset < document.documentElement.scrollHeight-178-document.documentElement.clientHeight && scroll !== null){  // if语句判断window页面y方向的位移是否大于或者等于导航栏的height像素值
      scroll!.classList.remove('scrollBottom')
      scroll!.classList.add('scrollCenter') // 当y方向位移大于554px时，定义的变量增加一个新的样式
    }else if(window.scrollY >= document.documentElement.scrollHeight-178-document.documentElement.clientHeight && scroll !== null){
      scroll!.classList.remove('scrollCenter') // 当y方向位移大于554px时，定义的变量增加一个新的样式
      scroll!.classList.add('scrollBottom')
    }else if(window.scrollY < 554 && scroll !== null) {
      scroll!.classList.remove('scrollCenter')
      scroll!.classList.remove('scrollBottom') // 当y方向位移大于554px时，定义的变量增加一个新的样式
    }
  }

  renderSkeleton = () => {
    return (
      <div style={{width:'1280px'}}>
        <div style={{width:'200px',float:'left'}}>
          <Skeleton width={140} />
          <Skeleton width={140} />
          <Skeleton width={190} />
          <Skeleton width={160} />
          <Skeleton width={160} />
          <Skeleton width={190} />
        </div>
        <div style={{width:'280px',float:'left'}}>
          <Skeleton width={200} />
          <Skeleton width={200} />
          <Skeleton width={250} />
          <Skeleton width={220} />
          <Skeleton width={220} />
          <Skeleton width={250} />
        </div>
        <div style={{width:'800px',float:'left'}}>
          <Skeleton width={680} />
          <Skeleton width={680} />
          <Skeleton width={780} />
          <Skeleton width={720} />
          <Skeleton width={720} />
          <Skeleton width={780} />
        </div>
      </div>
    )
  }

  render() {
    let a = document.documentElement.clientHeight-82
    return (
      <div className="privacy-operationGuide">
          {this.state.appList.length ?
          <div className="privacy-operationGuide-container">
            <div id='scrollOperationGuide' style={{height: a}} className="privacy-operationGuide-container-listContainer">
              <div className="privacy-operationGuide-container-listContainer__list">
                <ul className="privacy-operationGuide-container-listContainer__list-container">
                  {this.state.appList.map((appList,index) => {return (
                    <li key={index} data-index={index} data-appId={appList.id} data-logo={appList.logo} className={this.state.isSelect === index ? 'privacy-operationGuide-container-listContainer__list-container-item-active' : 'privacy-operationGuide-container-listContainer__list-container-item'}
                        onClick={this.setAct}>
                      {appList.name}
                    </li>
                  )})}
                </ul>
              </div>
            </div>
            <div className="privacy-operationGuide-container__content">
              <TreeContet content= {this.state.content}/>
            </div>
          </div> : this.renderSkeleton()
          }
      </div>
    )
  }
}

export default OperationGuide
