import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'

import {Steps, Card, message, Row, Col} from 'antd'

import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'

const Context = React.createContext()

const breadcrumbs = [{text: '指标管理'}, {text: '基础指标'}, {text: '新增指标'}]

function body(props) {
  const [selectedItem, setItem] = useState(null)
  // const [selectedItem, setItem] = useState({
  //   dataSourceType: 'sql', type: 'data',
  //   item: {
  //     createTime: "2020-11-30 15:54:44",
  //     databaseName: "xysl_bank",
  //     databaseType: "MySQL",
  //     hostname: "192.168.26.150",
  //     id: 11,
  //     name: "xysl_bank",
  //     port: "3306",
  //     updateTime: "2020-12-09 14:39:59",
  //     userName: "jdq_test",
  //   }
  // })
  let [step, setStep] = useState(0)

  useEffect(() => {
    // upListener()
    // console.log(step)
    // upListener(step)
  }, [step])
  const beforeunloadFunc = (e) => {
    var e = window.event || e
    e.returnValue = '确定离开当前页面吗？'
  }

  const selectDataSource = (type, item, e) => {
    if (
      !e.target.checked &&
      selectedItem &&
      type == selectedItem.type &&
      item.id == selectedItem.item.id
    ) {
      setItem(null)
    } else {
      const dataSourceType = type == 'interFace' ? 'http' : 'sql'
      setItem({dataSourceType, type, item})
    }
  }

  const removeSelect = () => {
    setItem(null)
  }

  const upListener = () => {
    if (step == 1) {
      window.addEventListener('beforeunload', beforeunloadFunc, false)
    } else {
      window.removeEventListener('beforeunload', beforeunloadFunc, false)
    }
  }

  const nextStep = () => {
    if (step == 0 && !selectedItem) {
      return message.error('请先选择数据源')
    }
    const new_step = step + 1
    setStep(new_step)
    // upListener()
  }

  const preStep = () => {
    const new_step = step - 1
    setStep(new_step)
    // upListener()
  }

  return (
    <Layout breadcrumbs={breadcrumbs} isShows={true} notShowTitle>
      <Context.Provider
        value={{
          interFace: props.data || [],
          selectedItem,
          selectDataSource,
          removeSelect,
          preStep,
          nextStep,
        }}
      >
        <Card style={{marginBottom: 30}}>
          <Row>
            <Col flex="1">
              <h1 style={{marginBottom: 0}}>新增指标</h1>
            </Col>
            <Col flex="1">
              <Steps
                current={step}
                style={{
                  width: '80%',
                  margin: '0 auto',
                }}
              >
                <Steps.Step title="选择数据源" />
                <Steps.Step title="配置指标" />
                <Steps.Step title="完成" />
              </Steps>
            </Col>
          </Row>
        </Card>

        {step === 0 && <Step1 nextStep={nextStep} />}

        {step === 1 && (
          <Step2
            nextStep={nextStep}
            preStep={preStep}
            type={selectedItem.type}
          />
        )}

        {step === 2 && <Step3 nextStep={nextStep} preStep={preStep} />}
      </Context.Provider>
    </Layout>
  )
}

export default body
export const BaseAddContext = Context
