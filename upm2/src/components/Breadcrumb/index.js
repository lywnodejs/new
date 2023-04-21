import { Breadcrumb } from 'antd'
import { routerRedux } from 'dva/router';
import './index.less'

const CBreadcrumb = props => {
  const { data, dispatch, separator } = props
  const length = data.length

  return(
    <Breadcrumb separator={separator || '>'} className="breadcrumb-layout">
      {
        data.map((item, index) => {
          return( 
            <Breadcrumb.Item key={index}>
              {
                (index + 1 === length) ? item.text : <a href="javascript:void(0);" onClick={() => {dispatch(routerRedux.push(item.url))}}>{item.text}</a>
              }
            </Breadcrumb.Item>
          )
        })
      }
    </Breadcrumb>
  )
}

export default CBreadcrumb