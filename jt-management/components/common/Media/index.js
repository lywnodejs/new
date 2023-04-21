import {Col, Image, Modal, Carousel} from 'antd'
import styles from './index.less'
import React, {useEffect, useState} from 'react'

export default function (props) {
  const [visible, setVisible] = useState(false)

  const showDetail = () => {
    setVisible(props.type !== 'image')
  }

  return (
    <div className={styles.mediaBox}>
      <a className={styles.mediaBtn} onClick={showDetail}>
        查看详情
      </a>
      {props.type == 'image' && (
        <Image.PreviewGroup>
          {props.data.map((src, i) => (
            <Image
              key={i}
              className={styles.antImage}
              width={60}
              height={22}
              src={src}
            />
          ))}
        </Image.PreviewGroup>
      )}
      <Modal
        visible={visible}
        bodyStyle={{paddingBottom: 50}}
        destroyOnClose
        footer={null}
        onCancel={() => setVisible(false)}
        title={props.type === 'video' ? '视频' : '音频'}
      >
        {props.type === 'video' && (
          <Carousel dots={{className: styles.dots}}>
            {props.data.map((src, i) => {
              return (
                <div>
                  <video
                    controls
                    key={i}
                    className={styles.video}
                    autoPlay={true}
                  >
                    <source src={src} type="video/mp4" />
                    <source src={src} type="video/ogg" />
                    您的浏览器不支持Video标签。
                  </video>
                </div>
              )
            })}
          </Carousel>
        )}

        {props.type === 'voice' && (
          <Carousel dots={{className: styles.dots}}>
            {props.data.map((src, i) => {
              return (
                <div>
                  <audio controls key={i} className={styles.video}>
                    <source src={src} type="audio/ogg" />
                    <source src={src} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                  </audio>
                </div>
              )
            })}
          </Carousel>
        )}
      </Modal>
    </div>
  )
}
