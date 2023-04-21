import * as React from 'react'
import { inject } from 'mobx-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import ChildMenu from '../../components/ChildrenMenu'
import DetectionText from './text'
import DetectionImg from './img'

import './style'

interface IState {
  navList: any
}
// const Loading = () => <div />
@inject('router')

class Detection extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      navList: [
        {
          name: t('文本检测'),
          icon: require('../../assets/c_text.svg'),
          url: '/detection/text'
        },
        {
          name: t('图片检测'),
          icon: require('../../assets/c_img.svg'),
          url: '/detection/img'
        },
        {
          name: t('音频检测 (敬请期待)'),
          icon: require('../../assets/c_audio.svg'),
          undone: true
          // url: '/capacity/audio'
        },
        {
          name: t('视频检测 (敬请期待)'),
          icon: require('../../assets/c_video.svg'),
          undone: true
          // url: '/capacity/video'
        }
      ]
    }
  }

  render() {
    const { navList } = this.state
    const { router } = this.props
    return (
      <div className="project-Detection">
        <ChildMenu
          navList={navList}
          router={router}
        />

        {/* 右侧内容区域 */}
        <div className="project-Detection-content right-content">
          <Switch>
            <Route
              path="/detection/text"
              exact
              component={DetectionText}
            />
            <Route
              path="/detection/img"
              exact
              component={DetectionImg}
            />
            <Redirect
              from="/detection"
              to="/detection/text"
            />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Detection
