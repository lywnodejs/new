/**
 *  @author hhx
 *  @date 2020-07-21 17:42
 */
import React, {Component} from 'react'
import {withRouter} from 'next/router'

class ScrollTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.router.pathname !== prevProps.router.pathname) {
      document.querySelector('#primaryLayout').scrollTo({top: 0})
    }
  }
  render() {
    return this.props.children
  }
}

export default withRouter(ScrollTop)
