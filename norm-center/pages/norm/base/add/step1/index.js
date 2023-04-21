import {useContext, useEffect, useState} from 'react'
import {Card, Button} from 'antd'
import InterFace from './interFace'
import DataBase from './data'
import {BaseAddContext} from '../index'
import Router from 'next/router'
import styles from './index.less'

const tabList = [
  {
    key: 'interFace',
    tab: '接口',
  },
  {
    key: 'data',
    tab: '数据库',
  },
]

export default function Step1(props) {
  // data interFace
  const [key, setKey] = useState()
  const context = useContext(BaseAddContext)

  const onTabChange = (key) => {
    setKey(key)
    context.removeSelect()
  }

  useEffect(() => {
    // console.log(context.selectedItem)
    // console.log(Router.router.query.type)
    let type =
      (context.selectedItem && context.selectedItem.type) ||
      Router.router.query.type ||
      'interFace'
    setKey(type)
    // if (context.selectedItem) {
    //   setKey(context.selectedItem.type)
    // } else {
    //   setKey('interFace')
    // }
  }, [])

  return (
    <div className={'all'}>
      <Card
        className={styles.stepCard}
        tabList={tabList}
        activeTabKey={key}
        onTabChange={(key) => onTabChange(key)}
      >
        {key === 'interFace' && <InterFace />}
        {key === 'data' && <DataBase />}
        <div className={styles.footer}>
          <Button type="primary" onClick={props.nextStep}>
            下一步
          </Button>
        </div>
      </Card>
    </div>
  )
}
