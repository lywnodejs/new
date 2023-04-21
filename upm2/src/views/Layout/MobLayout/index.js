import React from 'react';
import { connect } from 'dva';

import { Switch, Route } from 'dva/router';

import MobApproveDetail from '../../mob/ApproveDetail';
import Main from '../../mob/Main';
import Header from './Header';

import './index.less';
class MobLayout extends React.Component {

  componentDidMount() {
  }

  render() {
    let { match } = this.props;

    return (
      <div className="upm-mob-layout">
        <Header />
        <div className="mb-body">
          <Switch>
            <Route path={`${match.url}/approve-detail/:approveId`} exact component={MobApproveDetail} />
            <Route path={`${match.url}/main`} exact component={Main} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect()(MobLayout);
