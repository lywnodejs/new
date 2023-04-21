import * as React from 'react'
import { Carousel, BackTop } from 'antd'
import { observer, inject } from 'mobx-react'
import ContentInfo from './contentInfo'
import { IHomePage } from 'interfaces'
import './style'


interface IState {
  renderList: any
  history?: any
}

@inject('home')
@observer
class Home extends React.Component<IHomePage, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      renderList: []
    }
  }

  componentDidMount() {


  }




  render() {
    const { list } = this.props!.home!

    return (
      <div>
        <div className="project-banner">
          <Carousel >
            {
              list && list.length !== 0 ?

                list.map((item) => {
                  return (
                    item.hyperlink ?
                      <a href={item.hyperlink} target="_black">
                        <img src={item.url} alt="" />
                      </a>
                      :
                      <img src={item.url} alt="" />
                  )
                })
                :
                <img src={require('../../assets/homeBanner.png')} alt="" />
            }
          </Carousel>
        </div>
        <ContentInfo />

        <BackTop />
      </div>
    )
  }
}

export default Home
