import * as React from 'react'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'

import { IExample, IGetContentModel, IDisplayedAppsModel } from '../../interfaces'
import './style'
import TreeContent from '../../components/treeContent'
import Skeleton from 'components/skeleton'

interface IState {
  appList: any
  content: any
  isSelect: any
}
@dinject('getContent','displayedApps')
@observer
class Policy extends React.Component<IExample&IGetContentModel&IDisplayedAppsModel, IState> {
  params: any
  constructor(props: any) {
    super(props)
    this.state = {
      isSelect:0,
      appList:[],
      content: ''
    }
    this.params = {
      type: 1,
      appId: 2,
    }
    this.setAct = this.setAct.bind(this)
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    setTimeout(() => {
      let query = document.getElementById('scrollPolicy')
      query && query.classList.remove('scrollBottom')
      query && query.classList.remove('scrollCenter')
    }, 50)
    const lang = this.props.app!.language

    this.props.displayedApps!.displayedApps({type: 1, lang: lang}).then(res => {
      this.params.appId = res.length ? res[0].id : null
      this.params.lang = lang
      res.length && this.props.getContent!.getContent(this.params).then(res => {
        if (res) {
          this.setState({
            content: res.content
          })
        }
      })
      this.setState({
        appList:res
      })
    })
    
  }
  setAct(e:any){
    const lang = this.props.app!.language
    this.params.appId = Number(e.currentTarget.getAttribute('data-appId'))
    this.params.lang = lang
    this.props.getContent!.getContent(this.params).then(res=> {
       if (res) {
         this.setState({
           content: res.content
         })
       }
    })
    this.setState({
      isSelect:Number(e.currentTarget.getAttribute('data-index'))
    })
  }

  handleScroll =()=>{

    const scroll = document.getElementById('scrollPolicy') // 定义一个dom节点为'header'的header变量
    if(window.pageYOffset >= 554 && window.pageYOffset < document.documentElement.scrollHeight-178-document.documentElement.clientHeight && scroll !== null){  // if语句判断window页面y方向的位移是否大于或者等于导航栏的height像素值
      scroll!.classList.remove('scrollBottom')
      scroll!.classList.add('scrollCenter') // 当y方向位移大于554px时，定义的变量增加一个新的样式
    }else if(window.pageYOffset >= document.documentElement.scrollHeight-178-document.documentElement.clientHeight && scroll !== null){
      scroll!.classList.remove('scrollCenter') // 当y方向位移大于554px时，定义的变量增加一个新的样式
      scroll!.classList.add('scrollBottom')
    }else if(window.pageYOffset < 554 && scroll !== null) {
      scroll!.classList.remove('scrollCenter')
      scroll!.classList.remove('scrollBottom') // 当y方向位移大于554px时，定义的变量增加一个新的样式
    }
    
    
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
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
      <div className="privacy-policy">
        {this.state.content ?
          <div className="privacy-policy-container ">
            <div id='scrollPolicy' style={{height: a}} className="privacy-policy-container-listContainer">
              <div className="privacy-policy-container-listContainer__list"  >
                <ul className="privacy-policy-container-listContainer__list-container">
                  {this.state.appList.map((appList,index) => {return (
                    <li key={index} data-index={index} data-appId={appList.id} className={this.state.isSelect === index ? 'privacy-policy-container-listContainer__list-container-item-active' : 'privacy-policy-container-listContainer__list-container-item'}
                        onClick={this.setAct}>
                      {appList.name}
                    </li>
                  )})}
                </ul>
              </div>
            </div>
            <div className="privacy-policy-container__content ">
              <TreeContent content= {this.state.content}/>
            </div>
          </div> : this.renderSkeleton()
        }
      </div>
    )
  }
}

export default Policy
