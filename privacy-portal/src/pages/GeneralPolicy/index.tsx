import * as React from 'react'
import { observer } from 'mobx-react'
import { Tree, BackTop } from 'antd'
import dinject from 'decorates/inject'
import Skeleton from 'components/skeleton'
// import Skeleton from 'antd'

import { IExample, IGetContentModel } from '../../interfaces'
import './style'
import './quill.snow'
import './quill.core'
import './quill.bubble'
// import { any } from 'prop-types'
interface IState {
  // renderList: any,
  content: any,
  isFirst: any
}
const { TreeNode } = Tree
@dinject('getContent')
@observer
class GeneralPolicy extends React.Component<IExample&IGetContentModel, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      content: '',
      isFirst: true
      // renderList: [],
    }
  }
  componentDidMount() {

    window.addEventListener('scroll', this.handleScroll)
    // if (document.getElementById('scroll')!.className == 'privacy-generalPolicy-container__left-scrollBottom') {
    //   document.getElementById('scroll')!.classList.remove('privacy-generalPolicy-container__left-scrollBottom')// 否则就移除样式
    //   document.getElementById('scroll')!.classList.add('privacy-generalPolicy-container__left')  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    // }else if(document.getElementById('scroll')!.className == 'privacy-generalPolicy-container__left-scroll'){
    //   document.getElementById('scroll')!.classList.remove('privacy-generalPolicy-container__left-scroll') // 否则就移除样式
    //   document.getElementById('scroll')!.classList.add('privacy-generalPolicy-container__left')  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    // }
    // document.getElementById('scroll')!.className = 'privacy-generalPolicy-container__left'


    setTimeout(() => {
      // document.getElementById('scroll')!.style!.height = document.documentElement.clientHeight-82 + 'px !important'
      document.getElementById('scroll') && (document.getElementById('scroll')!.className = 'privacy-generalPolicy-container__left')
    }, 50)


    const lang = this.props.app!.language
    this.props.getContent!.getContent({type: 3,lang:lang}).then(res=> {
       if (res) {
         this.setState({
           content: res.content
         })
       }
    })

  }
  parseHtml(str:any) {
    let nodes:any = [], lastLevel1:any = null, lastLevel2:any = null, lastLevel3:any = null, _this = this;
    // /<(h1|h2|h3|h4)(?:\s+[a-zA-Z]+=".*")*>(?:[\s\S]*?)<\/\1>/g
    (str.match(/<(h[1-4]).*?>(.*?)<\/\1>/g) || []).map(function(html:any) {
      let arr = html.match(/<(h[1-4]).*?>(.*?)<\/\1>/).slice(1, 3)
      arr[1] = arr[1].replace(/<strong>|<\/strong>|<br>|<em>|<\/em>|<u>|<\/u>/g, '')
      return arr
    }).forEach(function(node:any, index:any) {
        let level = _this.getLevel(node)
        let catalog:any = {
          tag: node[0],
          title: _this.trim(node),
          children: [],
          markId: 'mark-' + node[0] + '-' + index.toString(),
          // key: '0-' + index.toString()
        }
        if (level == 1) {
          lastLevel1 = catalog
          nodes.push(catalog)
        } else if (level == 2) {
          lastLevel2 = catalog
          lastLevel1.children.push(catalog)
        } else if (level == 3) {
          lastLevel3 = catalog
          lastLevel2.children.push(catalog)
        } else {
          lastLevel3.children.push(catalog)
        }
    })
    return nodes
  }

  trim(node:any) {
    return node[1].replace(/(^[\s\r\n\t]*)|([\s\r\n\t]*$)/g,'').replace(/(&nbsp;)/g,'  ').replace(/<span\s*[^>]*>(.*?)<\/span>/ig,"$1")
  }

  getLevel(node:any) {
    return node[0].slice(1)
  }

  contentToHtml(content:any){
    let objE:any = document.createElement('div')
    objE.innerHTML = content
    let domHtml:any = objE.childNodes
    if (domHtml.length > 0) {
      let headH = [ 'H1', 'H2', 'H3', 'H4' ]
      let sum = -1
      domHtml.forEach((domItem) => {
        if (headH.indexOf(domItem.nodeName.toUpperCase()) != -1 ) {
          sum++
          domItem.setAttribute('id', 'mark-' + domItem.nodeName.toLowerCase() + '-' + sum.toString())
        }
      })
    }
    return objE.innerHTML
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleScroll =(e)=>{
    const header = document.getElementById('scroll') // 定义一个dom节点为'header'的header变量
    if(window.pageYOffset >= 594 && window.pageYOffset < document.documentElement.scrollHeight-178-document.documentElement.clientHeight && header){  // if语句判断window页面y方向的位移是否大于或者等于导航栏的height像素值
      if(header!.className== 'privacy-generalPolicy-container__left'){header!.classList.remove('privacy-generalPolicy-container__left')}  // 否则就移除样式
      if(header!.className== 'privacy-generalPolicy-container__left-scrollBottom'){header!.classList.remove('privacy-generalPolicy-container__left-scrollBottom')}// 否则就移除样式
      if(header !== null){header!.classList.add('privacy-generalPolicy-container__left-scroll')}  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    }else if(window.pageYOffset >= document.documentElement.scrollHeight-178-document.documentElement.clientHeight && header){

      if(header!.className== 'privacy-generalPolicy-container__left'){header!.classList.remove('privacy-generalPolicy-container__left')}  // 否则就移除样式
      if(header!.className== 'privacy-generalPolicy-container__left-scroll'){header!.classList.remove('privacy-generalPolicy-container__left-scroll')} // 否则就移除样式
      if(header !== null){header!.classList.add('privacy-generalPolicy-container__left-scrollBottom')}  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    }else if(window.pageYOffset < 594 && header) {
      if(header!.className== 'privacy-generalPolicy-container__left-scrollBottom'){header!.classList.remove('privacy-generalPolicy-container__left-scrollBottom')}// 否则就移除样式
      if(header!.className== 'privacy-generalPolicy-container__left-scroll'){header!.classList.remove('privacy-generalPolicy-container__left-scroll')} // 否则就移除样式
      if(header !== null){header!.classList.add('privacy-generalPolicy-container__left')}  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    }


  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.markId}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode {...item} key/>
  })
  // 点击右侧滚动到可视区域内
  onSelect = (selectedKeys) => {
    if (selectedKeys[0]) {
      let domElement:any = document.getElementById(selectedKeys[0])
      document.documentElement.scrollTop = domElement.offsetTop+594-39
      // domElement.scrollIntoView()
    }
  }

  renderSkeleton = () => {
    return (
      <div style={{width:'1280px'}}>
        <div style={{width:'280px',float:'left'}}>
          <Skeleton width={200} />
          <Skeleton width={200} />
          <Skeleton width={250} />
          <Skeleton width={220} />
          <Skeleton width={220} />
          <Skeleton width={250} />
        </div>
        <div style={{width:'1000px',float:'left'}}>
          <Skeleton width={800} />
          <Skeleton width={800} />
          <Skeleton width={1000} />
          <Skeleton width={900} />
          <Skeleton width={900} />
          <Skeleton width={1000} />
        </div>
      </div>
    )
  }

  render() {
    const treeData:any = this.parseHtml(this.state.content)
    this.contentToHtml(this.state.content)
    return (

      <div className="privacy-generalPolicy">
        {this.state.content ?
          (<div className="privacy-generalPolicy-container">
            <div id='scroll' className="privacy-generalPolicy-container__left">
              {!treeData.length ?
                 '' : <Tree onSelect={this.onSelect} defaultExpandAll={true}>
                  {this.renderTreeNodes(treeData)}
                </Tree>
              }
            </div>
            <div className="privacy-generalPolicy-container__right ql-container ql-snow" >
              <div className="ql-editor" dangerouslySetInnerHTML={{__html: this.contentToHtml(this.state.content)}}>

              </div>
            </div>
            <BackTop />
          </div>) : this.renderSkeleton()
        }
      </div>
    )
  }
}

export default GeneralPolicy
