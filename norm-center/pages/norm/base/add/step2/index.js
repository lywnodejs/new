import InterFace from './interFace'
import Data from './data'
import styles from './index.less'
import {useContext, useEffect, useState} from 'react'
import {BaseAddContext} from '../index'
import fetch from '~/utils/fetch'

export default function Step2(props) {
  const context = useContext(BaseAddContext)
  const [json, setJson] = useState(null)
  const [configs, setConfigs] = useState(null)
  const [groups, setGroups] = useState(null)

  useEffect(() => {
    const datasourceId = context.selectedItem.item.id
    const datasourceType = context.selectedItem.dataSourceType
    getData({datasourceType, datasourceId})
    getGroups()
    getNormConfig({datasourceType, datasourceId})
  }, [])

  const getData = async (params) => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getleftdata',
      [params],
    )
    if (code == 0) {
      setJson(JSON.parse(data))
    }
  }

  const getNormConfig = async (params) => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getindicators',
      [params],
    )
    if (code == 0) {
      setConfigs(data)
    }
  }

  const getGroups = async () => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      [],
    )
    if (code == 0) {
      setGroups(data)
    }
  }

  const onSearch = (params) => {
    const datasourceId = context.selectedItem.item.id
    const datasourceType = context.selectedItem.dataSourceType
    getNormConfig({datasourceType, datasourceId, ...params})
  }

  return (
    <>
      <div className={styles.step2box}>
        {props.type === 'interFace' && (
          <InterFace
            data={json}
            configs={configs}
            groups={groups}
            getGroups={getGroups}
          />
        )}
        {props.type === 'data' && (
          <Data
            configs={configs}
            data={json}
            groups={groups}
            getGroups={getGroups}
            search={onSearch}
          />
        )}
      </div>
    </>
  )
}
