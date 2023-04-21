import * as React from 'react'
import { FormComponentProps } from "antd/lib/form/Form"
import { Modal, Button, Form, Select, Input, Upload, Icon, message } from 'antd'

import {IDropDownModel, IFeedbackModel, IBase} from '../../interfaces'
import './style'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'

interface IFeedbackForm extends FormComponentProps {
  appSelectorList:any,
  questionCategorySelectorList: any,
  imageUrl: any,
  lang: any,
  loading: any,
  onSubmit(),
  handleChangeImg(info: any),
  feedback(paramas: any),
  customRequest(option: any),
  handleChangeApp(value: any),
  handleChangeCategory(value: any),
  onChange(e: any),
  onChangeTel(e: any),
  onRemove(file: any)
}
/**
 * form组件
 * 接受外部组件提供的数据model以及props
 *
 * @param param0
 */

 function FeedbackForm({form, appSelectorList, questionCategorySelectorList, imageUrl, lang, loading, onSubmit, handleChangeImg, feedback, customRequest, handleChangeApp, handleChangeCategory, onChange, onChangeTel, onRemove}: IFeedbackForm) {

  const { getFieldDecorator } = form
  const { Option } = Select
  const { TextArea } = Input
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">{lang == 'zh_CN' ? '上传照片':'Upload pictures'}</div>
    </div>
  )



  function handleSubmit (e: any) {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        // values.imgFile = fileList
        feedback(values).then(res => {
        })
      }
    })
  }

  return(
    <Form onSubmit={handleSubmit} >

      <Form.Item {...layout} label={lang == 'zh_CN' ? "产品名称" : 'Product name'} required={true} >
        {getFieldDecorator('appId',{
          rules:[{
            required: true,
            message: '请选择产品名称'
          }]
        })(
          <Select placeholder={lang == 'zh_CN' ? "请选择" : 'Please choose'} style={{ width: 354 }} onChange={handleChangeApp} >
            {appSelectorList.map((item, index) => {
                return (
                <Option value={item.id} key={index}>{item.name}</Option>
                )
            })}
          </Select>
        )}

      </Form.Item>

      <Form.Item {...layout} label={lang == 'zh_CN' ? "问题类别" : 'Questions or suggestions'} required={true}>
      {getFieldDecorator('categoryId',{
          rules:[{
            required: true,
            message: '请选择问题类别'
          }]
        })(
          <Select placeholder={lang == 'zh_CN' ? "请选择" : 'Please choose'} style={{ width: 354 }} onChange={handleChangeCategory} >
            {questionCategorySelectorList.map((item, index) => {
                return (
                <Option value={item.id} key={index}>{item.name}</Option>
                )
            })}
          </Select>
        )}
      </Form.Item>

      <Form.Item {...layout} label={lang == 'zh_CN' ? "描述" : 'Description'} required={true} >
        {getFieldDecorator('description',{
          rules:[{
            required: true,
            message: '请描述问题类别'
          },
          {
            min: 5,
            message: '最少需要输入5个字符'
          }]
        })(
          <TextArea placeholder="请输入至少五个字符" rows={4} onChange={onChange} />
        )}
      </Form.Item>

      <Form.Item {...layout} label={lang == 'zh_CN' ? '上传照片':'Upload pictures'} extra={lang == 'zh_CN' ? '支持扩展名：.jpg .bmp .png 只能上传一张图片' : 'support extensions: .jpg, .bmp, .png. Only one picture can be uploaded'}>
        {getFieldDecorator('imgFile',{

        })(
          <Upload
            name="imgFile"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={customRequest}
            onChange={handleChangeImg}
            onRemove={onRemove}
          >
            {imageUrl ? <img src={imageUrl} alt="imgFile" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        )}


      </Form.Item>

      <Form.Item {...layout} label={lang == 'zh_CN' ? "联系方式" : 'Contact information'}>
        {getFieldDecorator('contactWay',{

        })(
          <Input name="contactWay" onChange={onChangeTel} placeholder={lang == 'zh_CN' ? "请输入邮箱或电话号码" : 'Please enter your email or mobile phone number so that we can contact you.'}  />
        )}


      </Form.Item>


    </Form>
  )
 }

 const FeedbackFormWrapper = Form.create({

 })(FeedbackForm)


interface IState {
  submitLoading: any,
  visible: any,
  appSelectorList: any,
  questionCategorySelectorList: any,
  loading: any,
  imageUrl: any,
  formData: any,
  lang: any,
  isSubmit: any,
  isdestroy: any
}


function getBase64(img: any, callback: any) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

@dinject('router', 'dropDown', 'feedback')
@observer
class Footer extends React.Component<IBase & IDropDownModel & IFeedbackModel , IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      submitLoading: false,
      visible: false,
      appSelectorList: [],
      questionCategorySelectorList: [],
      loading: false,
      imageUrl: '',
      formData: new FormData(),
      lang: 'zh_CN',
      isSubmit: false,
      isdestroy: false
    }

  }

  componentDidMount(){
    const lang = this.props.app!.language
    this.setState({
      lang
    })

  }

  // 显示信息反馈表单
  showModal = () => {
    this.setState({
      visible: true,
      isSubmit: false,
      formData: new FormData(),
      isdestroy: true
    })
    // 产品名列表
    this.props.dropDown!.appSelector({lang:this.props.app!.language}).then(res => {
      this.setState({
        appSelectorList: res
      })
    })
    // 反馈问题类型列表
    this.props.dropDown!.questionCategorySelector({lang:this.props.app!.language}).then(res => {
      this.setState({
        questionCategorySelectorList: res
      })
    })
  }
  // 表单提交
  handleOk = () => {
    // const {formData} = this.state
    let formData = this.state.formData
    if(formData.get("appId") != null && formData.get("categoryId") != null && formData.get("description") != null && formData.get("description").length >= 5) {
      // if(formData.get('imgFile') == null){formData.append('imgFile', null) }
      // if(formData.get('contactWay') == null){formData.append('contactWay', '') }
      if(formData.get("contactWay")!= null){
        let telPatt = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        let emailPatt = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if(!telPatt.test(formData.get("contactWay")) && !emailPatt.test(formData.get("contactWay"))){
          message.warning('请填写符合格式要求的联系方式哦～')
        }else{
          this.props.feedback!.feedback(formData).then((res,rej) => {
         }).catch((e) => {
            message.warning(e.msg)
         })
         this.setState({ submitLoading: true })
         message.success('提交成功')
         setTimeout(() => {
         this.setState({ submitLoading: false, visible: false, formData: new FormData(), imageUrl: '' })
            // location.reload()
         }, 1000)
        }

      }else{
        this.props.feedback!.feedback(formData).then((res,rej) => {
       }).catch((e) => {
          message.warning(e.msg)
       })
       this.setState({ submitLoading: true })
       message.success('提交成功')
       setTimeout(() => {
       this.setState({ submitLoading: false, visible: false, formData: new FormData(), imageUrl: '' })
          // location.reload()

       }, 1000)
      }

    }else if(formData.get("appId") == 0 || formData.get("categoryId") == 0){
      message.warning('请选择产品名称及问题类别')
    }else if(formData.get("description") == null || formData.get("appId") == null || formData.get("description") == null){
      message.warning('请选择或填写必填项*')
    }else if(formData.get("description").length < 5) {
      message.warning('描述请输入至少5个字符')
    }
    this.setState({
      isSubmit: true,
    })
  }
  // 关闭、取消
  handleCancel = () => {
    this.setState({
      visible: false,
      formData: new FormData(),
      isdestroy: false,
      imageUrl: ''
    })
    // const m = Modal.info({className:'modal'})
    // m.destroy()


    // location.reload()
  }
  // 产品名
  handleChangeApp = (value) => {
    let formData = this.state.formData
    let flag = true
    if (flag) {
      formData.append('appId', value)
      flag = false
    }
    formData.set('appId', value)

  }
  // 问题类别
  handleChangeCategory = (value) => {
    let formData = this.state.formData
    // formData.categoryId = value
    // this.setState({
    //   formData
    // })
    let flag = true
    if (flag) {
      formData.append('categoryId', value)
      flag = false
    }
    formData.set('categoryId', value)


  }

  // 问题描述
  onChange = (e) => {
    let formData = this.state.formData
    let flag = true
    if (flag) {
      formData.append('description', e.target.value)
      flag = false
    }
    formData.set('description', e.target.value)
  }
  // 联系方式
  onChangeTel = (e) => {
    let formData = this.state.formData
    let flag = true
    if (flag) {
      formData.append('contactWay', e.target.value)
      flag = false
    }
    formData.set('contactWay', e.target.value)


 }

  handleChangeImg = info => {
    getBase64(info.file.originFileObj, imageUrl =>{
      this.setState({
        imageUrl,
        loading: false,
      })
    }
    )

  }

  onFinish = values => {
  }

  onFinishFailed = errorInfo => {
  }
  customRequest = (option) => {
    let formData = this.state.formData
    let flag = true
    if (flag) {
      formData.append('imgFile', option.file)
      flag = false
    }
    formData.set('imgFile', option.file)
    const isJpgOrPng = option.file.type === 'image/jpeg' || option.file.type === 'image/png' || option.file.type === 'image/bmp'
    if (!isJpgOrPng) {
      message.error('仅支持扩展名：.jpg .bmp .png 只能上传一张图片')
    }
    const isLt2M = option.file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片不能大于2MB')
    }
    // const prom = new Promise((resolve, reject) => {})
    // prom.abort = () => {}
    // return isJpgOrPng && isLt2M && prom
    return isJpgOrPng && isLt2M && false


  }
  onRemove = (file) => {
    let formData = this.state.formData
    formData.delete('imgFile')
  }

  render() {
    const { visible, submitLoading } = this.state
    const width = {
      width: '15px'
    }
    return (
      <footer className={'privacy-footer'}>
        <div className="privacy-footer__content">
          <div className="privacy-footer__content-feedback">
            <span onClick={this.showModal}>意见反馈</span>
          </div>
          <p className="privacy-footer__content-copyRight">
            <span><a href={'https://www.didiglobal.com/company-info'} target={"_blank"}>© 2012-2020  北京小桔科技有限公司</a> <a href={'http://www.beian.miit.gov.cn/'} target={"_blank"}>京ICP备12043664号-18</a>　|　增值电信许可：京B2-20192416 B1.B2-20160181</span>
            <span>广播电视节目制作许可：(京）字第15738号　|　<img src="https://website.didiglobal.com/dist/img/beian.d0289dc0.png" style={width} alt=""/><a href={'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002002025'} target={"_blank"}>京公网安备 11000002002025号</a></span>
          </p>
        </div>
        {this.state.isdestroy ?
        <Modal
          className='modal'
          destroyOnClose={true}
          maskClosable={false}
          visible={visible}
          title="意见反馈"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button href="javascript:;" key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button href="javascript:;" key="submit" type="primary" htmlType="submit" loading={submitLoading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          {/* {this.state.visible?

          : null} */}
          <FeedbackFormWrapper
            appSelectorList={this.state.appSelectorList}
            questionCategorySelectorList={this.state.questionCategorySelectorList}
            imageUrl={this.state.imageUrl}
            lang={this.props.app!.language}
            loading={this.state.loading}
            onSubmit={this.handleOk}
            handleChangeImg={this.handleChangeImg}
            feedback={this.props.feedback!.feedback}
            customRequest={this.customRequest}
            handleChangeApp={this.handleChangeApp}
            handleChangeCategory={this.handleChangeCategory}
            onChange={this.onChange}
            onChangeTel={this.onChangeTel}
            onRemove={this.onRemove}
          />


        </Modal>
         : ''}
      </footer>
    )
  }
}
export default Footer
