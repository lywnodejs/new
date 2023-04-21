import React, {useState, useEffect} from 'react'
import {Checkbox} from 'antd'
import fetch from '~/utils/fetch'

const CheckboxItem = (props) => {
  const {code, desc, enable} = props
  const [checked, setChecked] = useState(enable)

  // Api 1
  const save = async () => {
    let postData = {
      code: code,
      enable: !checked,
      desc: desc,
    }

    try {
      const {
        data: {data, code, desc},
      } = await fetch(
        'fincloud.basics.indicators.center.api.alarm.indalarmmanageservice.savestrategy',
        [postData],
      )
      if (code === 0) {
        console.log(desc)
        return data
      }
      return []
    } catch (err) {
      console.log(err)
      return []
    }
  }

  const onChangeStatus = (e) => {
    setChecked(e.target.checked)
    save()
  }

  return (
    <>
      <Checkbox onChange={onChangeStatus} checked={checked}>
        {desc}
      </Checkbox>
      <br />
    </>
  )
}

export default CheckboxItem
