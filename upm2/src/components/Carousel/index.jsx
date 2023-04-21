import React from 'react';
import { Carousel, Button } from 'antd';

import './index.less';

export default class UCarousel extends React.Component {

  constructor(props) {
    super(props)

    this.carouselRef = React.createRef()
  }

  handlePre = () => {
    this.carouselRef.current.prev()
  }

  handleNext = () => {
    this.carouselRef.current.next()
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <div className="upm-carousel">
        <Carousel {...rest} ref={this.carouselRef}>
          {children}
        </Carousel>
        {
          React.Children.count(children) > 1 ? (
            <React.Fragment>
              <div className="upm-carousel__button upm-carousel__button--left" onClick={this.handlePre}>
                <Button shape="circle" icon="left" />
              </div>
              <div className="upm-carousel__button upm-carousel__button--right" onClick={this.handleNext}>
                <Button shape="circle" icon="right" />
              </div>
            </React.Fragment>
          ) : null
        }

      </div>
    )
  }
}
