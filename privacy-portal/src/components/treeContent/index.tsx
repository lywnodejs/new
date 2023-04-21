import * as React from 'react'
import { observer } from 'mobx-react'
import { Tree, BackTop } from 'antd'
// import PropTypes from 'prop-types'

// import { IExample } from '../../interfaces'
import './style'
import './quill.snow'
import './quill.core'
import './quill.bubble'

interface IProps {
  content: any
}
interface IState {
  // renderList: any,
  content: any,
  // appList:any
}
const { TreeNode } = Tree
// @inject('router')
@observer
class TreeContent extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      content: '',
    }
  }


  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
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
    return node[1].replace(/(^[\s\r\n\t]*)|([\s\r\n\t]*$)/g, '').replace(/(&nbsp;)/g,'  ').replace(/<span\s*[^>]*>(.*?)<\/span>/ig,"$1")
  }

  getLevel(node:any) {
    return node[0].slice(1)
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.children && item.title) {
      return (
        <TreeNode title={item.title.replace(/(&nbsp;)/g,'  ')} key={item.markId}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode {...item} key/>
  })
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
  onSelect = (selectedKeys) => {
    if (selectedKeys[0]) {
      let domElement:any = document.getElementById(selectedKeys[0])
      document.documentElement.scrollTop = domElement.offsetTop+594-39
      // domElement.scrollIntoView()
    }
  }

  handleScroll =(e)=>{
    const scroll = document.getElementById('scrollTree') // 定义一个dom节点为'header'的header变量
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


  backTop = () => {
    return window
  }

  render() {
    const treeData:any = this.parseHtml(this.props.content)
    let a = document.documentElement.clientHeight-82

    return (

      <div className="privacy-treeContent">
        <div className="privacy-treeContent-container ql-container ql-snow">
          <div style={{height: a}} id='scrollTree' className={treeData.length != 0 ? "privacy-treeContent-container__left" : "privacy-treeContent-container__left-noTree"}>
            {treeData.length ?
            <Tree onSelect={this.onSelect} defaultExpandAll={true}>
              {this.renderTreeNodes(treeData)}
            </Tree> : ''
            }
          </div>

          <div className={treeData.length != 0 && this.props.content.length ? "privacy-treeContent-container__right" : "privacy-treeContent-container__right-noTree" } >
            <div className="ql-editor" dangerouslySetInnerHTML={{__html: this.contentToHtml(this.props.content)}}>

            </div>
          </div>


        </div>
        <BackTop target={this.backTop} />
      </div>
    )
  }
}

export default TreeContent
