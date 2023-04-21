import React, {useState, useEffect} from 'react'
import * as _ from 'lodash'
import dynamic from 'next/dynamic'
import {Button} from 'antd'
import styled from '@emotion/styled'
import {
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'

// cavas 画布组件
const CanvasWidget = dynamic(
  () =>
    import('@projectstorm/react-canvas-core').then(
      (module) => module.CanvasWidget,
    ),
  {ssr: false},
)

const BodyWidget = (props) => {
  const {model, engine, canvasHeight} = props
  const [zoomLevel, setZoomLevel] = useState(70)
  // console.log(canvasHeight)
  // 元素

  useEffect(() => {
    // 禁用 触摸板 双指事件
    const canvasBox = document.querySelector('.canvasBox')
    canvasBox.addEventListener(
      'wheel',
      (event) => {
        // if (event.deltaX % 1 !== 0 || event.deltaY % 1 !== 0) {
        //   // console.log('在放大或缩放')
        //   event.preventDefault()
        // }
        event.preventDefault()
      },
      {
        passive: false,
      },
    )
  })

  return (
    <>
      <div
        className="canvasBox"
        style={{height: 'calc(100vh - 340px)', position: 'relative'}}
      >
        {/* 提示文字 + 复位 */}
        <div className="flow-tool-top">
          <div className="right-tool-box">
            {/* 全局图 */}
            <div
              className="flow-cover"
              onClick={() => {
                engine.zoomToFitSelectedNodes(50)
                let zoomLevel = Math.floor(model.getZoomLevel())
                model.setZoomLevel(zoomLevel - (zoomLevel % 10))
                setZoomLevel(zoomLevel - (zoomLevel % 10))
                engine.setModel(model)
              }}
            >
              <CompressOutlined className="flow-cover-btn" />
            </div>
            {/* 放大缩小 */}
            <div className="flow-zoom">
              <div
                className="zoom-reduce"
                onClick={() => {
                  let zoomLevel = Math.floor(model.getZoomLevel())
                  if (zoomLevel < 20) {
                    model.setZoomLevel(10)
                    setZoomLevel(10)
                  } else {
                    model.setZoomLevel(zoomLevel - (zoomLevel % 10) - 10)
                    setZoomLevel(zoomLevel - (zoomLevel % 10) - 10)
                  }
                  engine.setModel(model)
                }}
                style={{
                  zIndex: '1000',
                }}
              >
                <ZoomOutOutlined />
              </div>
              <div className="zoom-percent">
                <p>{zoomLevel ? zoomLevel + '%' : null}</p>
              </div>
              <div
                className="zoom-inc"
                onClick={() => {
                  let zoomLevel = Math.floor(model.getZoomLevel())
                  model.setZoomLevel(zoomLevel - (zoomLevel % 10) + 10)
                  setZoomLevel(zoomLevel - (zoomLevel % 10) + 10)
                  engine.setModel(model)
                }}
                style={{
                  zIndex: '1000',
                }}
              >
                <ZoomInOutlined />
              </div>
            </div>
          </div>
        </div>
        <Canvas engine={engine} canvasHeight={canvasHeight} />
      </div>
    </>
  )
}

export default BodyWidget

export const Canvas = styled(CanvasWidget)`
  height: 100%;
  /* min-height: ${(p) => `${p.canvasHeight}`}; */
  background-color: rgb(34, 34, 34) !important;
    // $color: rgba(white, 0.05);
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        rgba(255, 255, 255, 0.08) 25%,
        rgba(255, 255, 255, 0.08) 26%,
        transparent 27%,
        transparent 74%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.08) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        rgba(255, 255, 255, 0.08) 25%,
        rgba(255, 255, 255, 0.08) 26%,
        transparent 27%,
        transparent 74%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.08) 76%,
        transparent 77%,
        transparent
      );
    background-size: 30px 30px;

  .pointui {
    fill: rgba(white, 0.5);
  }
  svg {
    overflow: visible;
  }
`
