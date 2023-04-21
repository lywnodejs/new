import * as React from 'react'
import { inject } from 'mobx-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { IBase } from '@/interfaces'
import Ugc from './UGC'
import Pgc from './PGC'
import IM from './IM'
import User from './user'
import ShorNote from './shortNote'
import File from './file'

import './style'

interface IState {

}
// const Loading = () => <div />
@inject('router')

class Solve extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)

  }

  render() {
    return (
      <div className="project-solve">
        <Switch>
          <Route
            path="/solve/UGC"
            exact
            component={Ugc}
          />
          <Route
            path="/solve/PGC"
            exact
            component={Pgc}
          />
          <Route
            path="/solve/IM"
            exact
            component={IM}
          />
          <Route
            path="/solve/user"
            exact
            component={User}
          />
          <Route
            path="/solve/shorNote"
            exact
            component={ShorNote}
          />
          <Route
            path="/solve/file"
            exact
            component={File}
          />
          <Redirect
            from="/detection"
            to="/detection/text"
          />
        </Switch>
      </div>
    )
  }
}

export default Solve
