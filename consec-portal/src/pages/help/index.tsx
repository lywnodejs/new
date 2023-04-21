import * as React from 'react'
import { inject } from 'mobx-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import ChildMenu from '../../components/ChildrenMenu'
import HelpMachine from './interface/machine'
import HelpProblem from './problem'
import HelpPerson from './interface/preson'
import HelpUserControl from './interface/userControl'
import HelpComplain from './interface/complain'
import HelpAppeal from './interface/appeal'
import HelpJoinFlow from './joinFlow'
import Page404 from '../../errors/Page404'
import './style'

interface IState {
  navList: any
}
// const Loading = () => <div />
@inject('router')

class Help extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      navList: [
        {
          name: t('接入流程'),
          icon: require('../../assets/help1.png'),
          url: '/help/joinFlow'
        },
        {
          name: t('接口说明'),
          icon: require('../../assets/help2.png'),
          url: '/help/interface',
          children: [
            {
              name: t('机器审核'),
              url: '/help/interface/machine',
            },
            {
              name: t('人工审核结果回调'),
              url: '/help/interface/preson',
            },
            {
              name: t('用户管控'),
              url: '/help/interface/usercontrol',
            },
            {
              name: t('投诉'),
              url: '/help/interface/complain',
            },
            {
              name: t('申诉'),
              url: '/help/interface/appeal',
            }
          ]
        },
        {
          name: t('常见问题'),
          icon: require('../../assets/help3.png'),
          url: '/help/problem'
        },
      ]
    }
  }

  render() {
    const { navList } = this.state
    const { router } = this.props
    return (
      <div className="project-help">
        <ChildMenu
          navList={navList}
          router={router}
        />

        {/* 右侧内容区域 */}
        <div className="project-help-content right-content">
          <Switch>
            <Route
              path="/help/interface/machine"
              exact
              component={HelpMachine}
            />
            <Route
              path="/help/interface/preson"
              exact
              component={HelpPerson}
            />
            <Route
              path="/help/interface/userControl"
              exact
              component={HelpUserControl}
            />
            <Route
              path="/help/interface/complain"
              exact
              component={HelpComplain}
            />
            <Route
              path="/help/interface/appeal"
              exact
              component={HelpAppeal}
            />

            <Route
              path="/help/problem"
              exact
              component={HelpProblem}
            />
            <Route
              path="/help/joinFlow"
              exact
              component={HelpJoinFlow}
            />

            <Route component={Page404} />

            <Redirect
              from="/help/interface"
              to="/help/interface/machine"
            />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Help
