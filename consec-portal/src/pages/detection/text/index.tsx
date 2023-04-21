import * as React from 'react'
import { message, Input, Modal } from 'antd'
import { IBase } from '@/interfaces'
import { t } from '@/utils'
import { randomText, randomTextCheck } from '../../../services/consec'

import './style'

interface IState {
  disabled: boolean
  randomText: any // 随机文本
}

class DetectionText extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      disabled: true,
      randomText: ''
    }
  }

  componentDidMount() {

  }


  // 获取随机文本
  getRandomText = () => {
    randomText().then((res: any) => {
      if (res.code === 0) {
        this.setState({
          disabled: false,
          randomText: res.data
        })
      } else {
        message.error('接口异常了，请稍后再试～');
      }
    })
  }

  // 验证文字
  textCheck = () => {
    const { randomText } = this.state;
    const data = {
      text: randomText
    }
    randomTextCheck(data).then((res: any) => {
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
    const { randomText, disabled } = this.state
    return (
      <div className="project-detection-text">

        <h3>{t('在线文本检测')}</h3>

        <p className="project-detection-text-introduce">
          {t('基于滴滴业务进行迭代的敏感词词库，对政治、低俗、色情、广告、暴恐等8大类违法违规词汇精准识别，并提供个性化定制检测方案。')}
        </p>
        <div className="hr"></div>
        <div className="project-detection-text-content">
          <div className="project-detection-text-content-header">
            <span>{t('文本识别检测')}</span>
            <button
              onClick={this.getRandomText}
            >
              {t('+ 随机添加文本')}
            </button>
          </div>
          <div className="project-detection-text-content-text">
            {/* <textarea
              ref={'randomtext'}
              placeholder={t('这里输入或粘贴要检测的文字，限500字哦')}
            > */}
            <Input.TextArea
              disabled
              placeholder={t('点击按钮添加随机文字')}
              value={randomText}
            >
            </Input.TextArea>
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

export default DetectionText
