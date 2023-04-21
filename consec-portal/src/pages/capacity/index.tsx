import * as React from 'react'
import { inject } from 'mobx-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import ChildMenu from '../../components/ChildrenMenu'
import CapacityText from './text'
import CapacityImg from './img'
import CapacityVideo from './video'
import CapacityAudio from './audio'
import CapacityPerson from './person'
import CapacityUser from './user'
import CapacityComplaint from './complaint'

import './style'

interface IState {
  navList: any
}
// const Loading = () => <div />
@inject('router')

class Capacity extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      navList: [
        {
          name: t('文本审核'),
          icon: require('../../assets/c_text.svg'),
          url: '/capacity/text'
        },
        {
          name: t('图片审核'),
          icon: require('../../assets/c_img.svg'),
          url: '/capacity/img'
        },
        {
          name: t('音频审核'),
          icon: require('../../assets/c_audio.svg'),
          url: '/capacity/audio'
        },
        {
          name: t('视频审核'),
          icon: require('../../assets/c_video.svg'),
          url: '/capacity/video'
        },
        {
          name: t('人工审核'),
          icon: require('../../assets/c_rengong.svg'),
          url: '/capacity/person'
        },
        {
          name: t('用户管控'),
          icon: require('../../assets/c_user.svg'),
          url: '/capacity/user'
        },
        {
          name: t('投诉申诉'),
          icon: require('../../assets/c_tousu.svg'),
          url: '/capacity/complaint'
        }
      ]
    }
  }


  render() {
    const { navList } = this.state
    const { router } = this.props
    return (
      <div className="project-capacity">

        <ChildMenu
          navList={navList}
          router={router}
        />

        {/* 右侧内容区域 */}
        <div className="project-capacity-content right-content">
          <Switch>
            <Route
              path="/capacity/text"
              exact
              component={CapacityText}
            />
            <Route
              path="/capacity/img"
              exact
              component={CapacityImg}
            />
            <Route
              path="/capacity/video"
              exact
              component={CapacityVideo}
            />
            <Route
              path="/capacity/audio"
              exact
              component={CapacityAudio}
            />
            <Route
              path="/capacity/person"
              exact
              component={CapacityPerson}
            />
            <Route
              path="/capacity/user"
              exact
              component={CapacityUser}
            />
            <Route
              path="/capacity/complaint"
              exact
              component={CapacityComplaint}
            />
            <Redirect
              from="/capacity"
              to="/capacity/text"
            >

            </Redirect>
          </Switch>
        </div>
      </div>
    )
  }
}

export default Capacity
