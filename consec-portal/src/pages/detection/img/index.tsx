import * as React from 'react'
import { message, Modal } from 'antd'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import { randomImg, randomImgCheck } from '../../../services/consec'

import './style'

interface IState {
  disabled: boolean,
  randomImg: any // 随机图片地址
}

class DetectionImg extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      disabled: true,
      randomImg: require('../../../assets/imgBG.png')
    }
  }

  componentDidMount() {

  }


  // 获取随机图片
  getRandomText = () => {
    randomImg().then((res: any) => {
      if (res.code === 0) {
        this.setState({
          randomImg: res.data,
          disabled: false
        })
      } else {
        message.error('接口异常了，请稍后再试～');
      }
    })
  }

  // 验证文字
  textCheck = () => {
    const { randomImg } = this.state;
    const data = {
      url: randomImg
    }
    randomImgCheck(data).then((res: any) => {
      if (res.code === 0 && res.data) {
        Modal.info({
          title: '检测结果',
          content: (
            <div style={{ marginTop: "10px" }}>
              <p>{res.data}</p>
            </div>
          ),
        });
      } else {
        message.error('接口异常了，请稍后再试～');
      }
    })
  }


  render() {
    const { randomImg, disabled } = this.state;
    return (
      <div className="project-detection-img">

        <h3>{t('在线图片检测')}</h3>

        <p className="project-detection-img-introduce">
          {t('通过外采、自建等方式构建图片识别能力，对图片内容中出现的政治、 低俗、色情、广告、暴恐等8大类违法违规图片精准识别，并提供个性化定制检测方案。')}
        </p>
        <div className="hr"></div>
        <div className="project-detection-img-content">
          <div className="project-detection-img-content-header">
            <span>{t('图片识别检测')}</span>
            <button
              onClick={this.getRandomText}
            >
              {t('+ 随机添加图片')}
            </button>
          </div>
          <div className="project-detection-img-content-img">
            <div className="project-detection-img-content-img-content">
              <img src={randomImg} alt="" />
            </div>
            <button
              onClick={this.textCheck}
              disabled={disabled}
            >
              {t('开始检测')}
            </button>
          </div>
        </div>
      </div >
    )
  }
}

export default DetectionImg
