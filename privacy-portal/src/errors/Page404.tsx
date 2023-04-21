import * as React from 'react'
import './style'

class Page404 extends React.Component<{}, {}> {

  render() {
    return (
      <div className="wrap dsrc-error">
        <div className="img"></div>
        <p className="help-text">
          抱歉，您访问的页面找不到了，您可以<br />
          <span className="nav-wrap">
            <a className="nav" href="javascript:history.go(-1);">返回上一页</a>
            或
            <a className="nav" href="https://sec.didichuxing.com/">返回首页</a>
          </span>
        </p>
      </div>
    )
  }
}

export default Page404
