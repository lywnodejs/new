import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import {Space, message, Form, Button, Card, Tabs, Modal} from 'antd'
import Router, {withRouter} from 'next/router'
import BasicSetting from './BasicSetting'
import UiSetting from './UiSetting'
import StrideSetting from './StrideSetting'
import moment from 'moment'

const breadcrumbs = [{text: '营销管理'}, {text: '活动管理'}, {text: '活动配置'}]
const {TabPane} = Tabs

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.activityservice.detail', [{id}])
  if (code == 0) {
    return data
  }
}

const colorArr = [
  'wheelCountBg',
  'wheelCountTextColor',
  'wheelCountNumColor',
  'wheelCountIntroColor',
  'prizeListTextColor',
  'myPrizeTextColor',
  'dialogBgColor',
  'dialogButtonStyle',
  'dialogTextColor',
  'dialogModalText',
]

function body(props) {
  const [basicForm] = Form.useForm()
  const [uiForm] = Form.useForm()
  const [setttingForm] = Form.useForm()
  const [visible, setVisible] = useState(false)
  let colorObj = {}
  const [colors, setColors] = useState(colorObj)

  if (props.id) {
    colorArr.forEach(() => {
      colorObj['wheelCountBg'] = props.data.desc.styles.wheelCountBg.background
      colorObj['wheelCountTextColor'] =
        props.data.desc.styles.wheelCountTextColor.color
      colorObj['wheelCountNumColor'] =
        props.data.desc.styles.wheelCountNumColor.color
      colorObj['wheelCountIntroColor'] =
        props.data.desc.styles.wheelCountIntroColor.color
      colorObj['prizeListTextColor'] =
        props.data.desc.styles.prizeListTextColor.color
      colorObj['myPrizeTextColor'] =
        props.data.desc.styles.myPrizeTextColor.color
      colorObj['dialogBgColor'] =
        props.data.desc.styles.dialogBgColor.background
      colorObj['dialogButtonStyle'] =
        props.data.desc.styles.dialogButtonStyle.background
      colorObj['dialogTextColor'] = props.data.desc.styles.dialogTextColor.color
      colorObj['dialogModalText'] =
        props.data.desc.styles.dialogButtonStyle.color
    })
  }

  useEffect(() => {
    if (props.id) {
      let values = {...props.data}
      basicForm.setFieldsValue({
        ...values,
        startTime: moment(values.startTime),
        endTime: moment(values.endTime),
      })
      setColors({...colors})
      uiForm.setFieldsValue({
        ...values.desc.styles,
        bgImage: values.desc.styles.bgImage.backgroundImage,
        wheelBgImage: values.desc.styles.wheelBgImage.backgroundImage,
        wheelCountBg: values.desc.styles.wheelCountBg.background,
        wheelCountTextColor: values.desc.styles.wheelCountTextColor.color,
        wheelCountNumColor: values.desc.styles.wheelCountNumColor.color,
        wheelCountIntroColor: values.desc.styles.wheelCountIntroColor.color,
        prizeListTextColor: values.desc.styles.prizeListTextColor.color,
        myPrizeTextColor: values.desc.styles.myPrizeTextColor.color,
        dialogTitle: values.desc.styles.dialogTitle,
        dialogBgColor: values.desc.styles.dialogBgColor.background,
        dialogButtonStyle: values.desc.styles.dialogButtonStyle
          ? values.desc.styles.dialogButtonStyle.background
          : '',
        dialogTextColor: values.desc.styles.dialogTextColor.color,
        dialogModalText: values.desc.styles.dialogButtonStyle
          ? values.desc.styles.dialogButtonStyle.color
          : '',
      })
      setttingForm.setFieldsValue({
        ...values,
        shareMaxNum: values.desc.prizes.shareMaxNum,
        applyMaxNum: values.desc.prizes.applyMaxNum,
        items: values.desc.prizes.items,
      })
    }
  }, [props])

  const CheckIsColor = (bgVal) => {
    var type = '^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$'
    var re = new RegExp(type)
    if (bgVal.match(re) == null) {
      type =
        '^[rR][gG][Bb][]([s]∗(2[0−4][0−9]|25[0−5]|[01]?[0−9][0−9]?)[s]∗,)2[s]∗(2[0−4]d|25[0−5]|[01]?dd?)[s]∗[]{1}$'
      re = new RegExp(type)
      if (bgVal.match(re) == null) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const changeColor = (key, value) => {
    if (value) {
      value = (CheckIsColor(value) && value) || 'error'
    }

    setColors({
      ...colors,
      [key]: value,
    })
  }

  useEffect(() => {
    window.current_url = document.URL //保留当前页面地址
    window.addEventListener('popstate', handed)
  }, [])

  const handed = () => {
    setVisible(true)
    Router.push(`/market/activity/detail?id=${props.id}`)
  }

  const handleCancel = () => {
    setVisible(false)
    Router.push(`/market/activity`)
  }
  const handleSave = async () => {
    const values = await basicForm.validateFields()
    const values1 = await uiForm.validateFields()
    const values2 = await setttingForm.validateFields()
    let postData = {
      id: props.id,
      ...values,
      startTime: moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
      action: null,
      templateId: 1,
      desc: {
        tickets: [],
        repeatWin: true,
        styles: {
          headImage: values1.headImage,
          bgImage: {
            backgroundImage: values1.bgImage,
          },
          wheelBgImage: {
            backgroundImage: values1.wheelBgImage,
          },
          wheelButton: values1.wheelButton,
          wheelCountBg: {
            background: values1.wheelCountBg,
          },
          wheelCountTextColor: {
            color: values1.wheelCountTextColor,
          },
          wheelCountNumColor: {
            color: values1.wheelCountNumColor,
          },
          wheelCountIntroColor: {
            color: values1.wheelCountIntroColor,
          },
          shareButton: values1.shareButton,
          loanButton: values1.loanButton,
          prizeListTextColor: {
            color: values1.prizeListTextColor,
          },
          myPrizeTextColor: {
            color: values1.myPrizeTextColor,
          },
          dialogTitle: values1.dialogTitle,
          dialogBgColor: {
            background: values1.dialogBgColor,
          },
          dialogButtonStyle: {
            background: values1.dialogButtonStyle,
            color: values1.dialogModalText,
          },
          dialogTextColor: {
            color: values1.dialogTextColor,
          },
        },
        prizes: {
          ...values2,
        },
      },
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.activityservice.save', [postData])
    if (code == 0) {
      {
        props.id ? message.success('保存成功') : message.success('提交成功')
      }
      setVisible(false)
      Router.push(`/market/activity`)
    } else if (code == -1) {
      setVisible(false)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card>
          <Tabs defaultActiveKey={1}>
            <TabPane tab="基本设置" key={1}>
              <BasicSetting
                {...{
                  basicForm,
                }}
              />
            </TabPane>
            <TabPane tab="页面UI" key={2}>
              <UiSetting
                {...{
                  uiForm,
                  changeColor,
                  colors,
                }}
              />
            </TabPane>
            <TabPane tab="转盘设置" key={3}>
              <StrideSetting
                {...{
                  setttingForm,
                  handleSave,
                }}
              />
            </TabPane>
          </Tabs>

          <Modal visible={visible} onCancel={handleCancel} onOk={handleSave}>
            <p>请确定是否保存该活动配置？</p>
          </Modal>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const id = params.ctx.query.id
  let data = {}
  if (id) {
    data = await getData(id)
  }
  return {data, id}
}

export default withRouter(body)
