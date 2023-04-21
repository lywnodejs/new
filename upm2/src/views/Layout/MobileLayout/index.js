/*
 * @Author: GuoTeng
 * @Date: 2020-10-26 10:02:16
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-10-26 11:45:02
 */
import React from 'react';
import { connect } from 'dva';

import { Switch, Route, Redirect } from 'dva/router';

import ApproveDetail from '@views/mobile/ApproveDetail';
import ApproveList from '@views/mobile/ApproveList';

import './index.less';
class MobileLayout extends React.Component {

  componentDidMount() {
  }

  render() {
    let { match } = this.props;
    return (
      <div className="upm-mobile-layout">
        <Switch>
          <Route path={`${match.url}`} exact strict component={ApproveList} />
          <Redirect
                from={`${match.url}/`}
                exact
                strict
                to={`${match.url}`}
              />
          <Route path={`${match.url}/approve-detail/:approveId`} exact component={ApproveDetail} />
        </Switch>
      </div>
    );
  }
}

export default connect()(MobileLayout);