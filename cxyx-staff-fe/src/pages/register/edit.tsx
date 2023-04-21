// @ts-nocheck
import React from 'react';
import { List, InputItem, WhiteSpace, Button, Toast, Flex, ImagePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import request from 'umi-request';
import { API } from '@/utils/api/staff';
import {
  appNewEmployee,
  sendValidCode,
} from '@/utils/api/staff';
import './style.less';
import { v4 as uuidv4 } from 'uuid';


const CLIENTTYPE = 'WH';  // 为WH  则不进行实名认证
class BasicInputExampleEdit extends React.Component {
  state = {
    canSendVerifyCodeSencond: 0,
    files: [],
    filename: null,
    uuid: '',
    isSuccess: undefined,
    message: '',
    type: ''
  };
  componentDidMount() {
    this.getUId();
    this.setState({
      type: this.props.location.query.orgType
    })

    this.props.form.setFieldsValue({
      inviteCode: this.props.location.query.inviteCode,
      companyId: this.props.location.query.companyId,
      clientId: this.props.location.query.clientId ? this.props.location.query.clientId[0] : ''
    })
    const verifyCodeSendTime = window.localStorage.getItem(
      'VERIFYCODE_SEND_TIME',
    );
    if (verifyCodeSendTime && Date.now() - verifyCodeSendTime < 60 * 1000) {
      this.setState({
        canSendVerifyCodeSencond:
          60 - Math.ceil((Date.now() - verifyCodeSendTime) / 1000),
      });
      this.count();
    }
    // this.autoFocusInst.focus();
  }
  handleClick = () => {
    this.inputRef.focus();
  };

  // 函数封装 获取8位数uuid
  getUId = () => {
    this.setState({
      uuid: uuidv4()
    })
  }

  count = () => {
    let intervalId = setInterval(() => {
      let canSendVerifyCodeSencond = this.state.canSendVerifyCodeSencond - 1;
      if (canSendVerifyCodeSencond <= 0) {
        clearInterval(intervalId);
      }

      this.setState({
        canSendVerifyCodeSencond,
      });
    }, 1000);
  };

  submit = async () => {
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        // this.setState({
        //   errors: Object.keys(errors),
        // });
        // } else {
        appNewEmployee({
          ...values,
          jobModeId: 'T',
          realNameStatusEnum: this.state.type === CLIENTTYPE ? 'SUCCESS_REAL' : 'NO_REAL',
          mobile: values.mobile.replace(/\s+/g, '')
        }).then(res => {
          if (res && res.errno === 0) {
            Toast.success('报名成功！');
            this.props.history.push({
              pathname: '/h5/success',
              query: {
                availableName: res.data?.availableName,
                password: res.data?.password
              }
            })
          } else {
            Toast.info(res.errmsg);
          }
        })
      }
    });
  };

  validateMobile = (rule, value, callback) => {
    const regexp = /^(1[3-9]\d{9}$)/;
    const form = this.props.form;
    // console.log(regexp.exec(form.getFieldValue('mobile').replace(/\s+/g, '')));
    if (regexp.exec(form.getFieldValue('mobile').replace(/\s+/g, ''))) {
      callback();
    } else {
      callback('手机号码格式不正确');
    }
  };

  validateIdCard = (rule, value, callback) => {
    const regexp = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    const form = this.props.form;
    if (regexp.exec(form.getFieldValue('idCardNo').replace(/\s+/g, ''))) {
      callback();
    } else {
      callback('身份证号码格式不正确');
    }
  };

  //图片先压缩  如果压缩后  还大于9M  直接提示文件过大
  onChange = (files, type) => {
    this.setState({
      files: files,
    });
    if (type === 'add') {
      let thas = this;
      let file = files[0].file;
      if (file.size > 1000000) {
        let rate = 0.2;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let img = new Image();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        img.onload = function () {
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          // 文件大小KB
          const fileSizeKB = Math.floor(file.size / 1024);
          // 配置rate和maxSize的关系
          if (fileSizeKB * rate > 3027) {
            rate = Math.floor((3027 / fileSizeKB) * 10) / 30;
          }
          // 缩放比例，默认0.5
          let targetW = (canvas.width = this.width * rate);
          let targetH = (canvas.height = this.height * rate);
          context.clearRect(0, 0, targetW, targetH);
          context.drawImage(img, 0, 0, targetW, targetH);
          canvas.toBlob((blob) => {
            const newImage = new File([blob], file.name, {
              type: file.type,
            });
            if (file.size > 9000000) {
              Toast.info('文件过大，请上传小于10M的文件');
              return
            }

            // console.log(newImage.size / 1024, "kb");
            // 图片上传接口
            thas.upload(newImage);
          });
        };
      } else {
        // 图片没有超限则直接上传
        this.upload(files[0].file);
      }
      this.props.form.setFieldsValue({
        name: null,
        idCardNo: null
      })
      this.setState({
        isSuccess: undefined
      })
    }
  }

  upload = (data) => {
    let fileName = this.state.filename ? this.state.filename : this.state.uuid + data.name
    let file = new File([data], fileName, {
      type: data.type
    })
    Toast.loading('识别中', 100, null, true);
    let formData = new FormData();
    formData.append("file", file);
    request.post(API.getIDCardCertificationResult, {
      body: formData,
    }).then(res => {
      if (res.errno === 0 && !_.isEmpty(res.data)) {
        this.props.form.setFieldsValue({
          name: res.data.name,
          idCardNo: res.data.identity
        })
        this.getUId();
        this.setState({
          filename: null,
          isSuccess: true
        });
        // setTimeout(() => {
        // Toast.success('实名认证成功！');
        // }, 500)
      } else {
        this.setState({
          filename: this.state.uuid + data.name,
          files: [],
          isSuccess: false,
          message: res.errmsg
        });
        // setTimeout(() => {
        // Toast.info(res.errmsg);
        // }, 500)

      }
    }).finally(() => {
      Toast.hide();
    })
  }

  render() {
    const {
      getFieldProps,
      onFieldsChange,
      getFieldValue,
      setFieldsValue,
      getFieldError,
    } = this.props.form;
    const formatInputProps = () => ({
      labelNumber: 6,
      // error: this.state.errors.includes(name),
    });
    return (
      <div>
        <List renderHeader={() => '填写报名信息'}>

          <input
            type="text"
            hidden
            {...getFieldProps('inviteCode')}
          />
          <input
            type="text"
            hidden
            {...getFieldProps('companyId')}
            name="companyId"
          />
          <input
            type="text"
            hidden
            {...getFieldProps('clientId')}
            name="clientId"
          />
          {
            this.state.type === CLIENTTYPE ?
              <List.Item>
                <font style={{ color: 'red' }}>*</font>实名认证
              <ImagePicker
                  files={this.state.files}
                  onChange={this.onChange}
                  accept="image/jpeg,image/jpg,image/png"
                  onImageClick={(index, fs) => console.log(index, fs)}
                  multiple={false}
                  selectable={this.state.files.length === 0}
                />
                <h4
                  style={{
                    fontSize: '14px',
                    position: 'absolute',
                    top: '54px',
                    left: '120px'
                  }}
                >
                  {
                    this.state.isSuccess === true ?
                      <>
                        <img
                          style={{ float: 'left', marginTop: '0px', marginRight: '6px' }}
                          src={require('@/assets/img/solid-circle-success.png')} alt=""
                        />
                        认证成功
                      </>
                      :
                      this.state.isSuccess === false ?
                        <>
                          <img
                            style={{ width: '20px', height: 'auto', float: 'left', margin: '0px 6px 4px 0' }}
                            src={require('@/assets/img/errorinfo.png')} alt=""
                          />
                          认证失败
                          <span style={{ display: 'block', color: 'red' }}>{this.state.message}</span>
                        </>
                        :
                        null
                  }

                </h4>
                <p
                  style={{
                    fontSize: '12px',
                    // position: 'absolute',
                    top: '54px',
                    right: '20px'
                  }}
                >
                  上传身份证正面照片<br />系统会为您自动识别姓名和身份证号码<br />若识别错误，请重新上传
                   </p>
              </List.Item>
              :
              null
          }

          {/* </ImagePicker> */}

          <InputItem
            {...getFieldProps('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '姓名必填',
                },
              ],
            })}
            type="name"
            disabled={this.state.type === CLIENTTYPE}
            {...formatInputProps('name')}
            placeholder={this.state.type === CLIENTTYPE ? '请上传身份证正面照片' : "请输入"}
          >
            <font style={{ color: 'red' }}>*</font>姓名
          </InputItem>


          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('name') || []).join(', ')}
          </div>
          <InputItem
            {...getFieldProps('idCardNo', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '身份证号码必填',
                },
                { validator: this.validateIdCard },
              ],
            })}
            type="text"
            placeholder={this.state.type === CLIENTTYPE ? '请上传身份证正面照片' : "请输入"}
            disabled={this.state.type === CLIENTTYPE}
            {...formatInputProps('idCardNo')}
          >
            <font style={{ color: 'red' }}>*</font>身份证号码
          </InputItem>
          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('idCardNo') || []).join(', ')}
          </div>
          <Flex>
            <Flex.Item style={{ flex: 3 }}>
              <InputItem
                {...getFieldProps('mobile', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '联系电话必填',
                    },
                    {
                      validator: this.validateMobile,
                    },
                  ],
                })}
                type="phone"
                placeholder="请输入"
                {...formatInputProps('mobile')}
              >
                <font style={{ color: 'red' }}>*</font>联系电话
              </InputItem>
            </Flex.Item>
            <Flex.Item>
              <Button
                inline
                size="small"
                className="verify-code"
                disabled={
                  !(
                    getFieldValue('mobile') &&
                    !getFieldError('mobile') &&
                    !this.state.canSendVerifyCodeSencond
                  )
                }
                onClick={async () => {
                  const { errmsg, errno } = await sendValidCode({
                    companyId: getFieldValue('companyId'),
                    mobile: getFieldValue('mobile').replace(/\s+/g, ''),
                  });
                  if (errno === 0) {
                    Toast.info('验证码发送成功！');
                    window.localStorage.setItem(
                      'VERIFYCODE_SEND_TIME',
                      Date.now(),
                    );
                    this.setState({
                      canSendVerifyCodeSencond: 60,
                    });
                    this.count();
                  } else {
                    Toast.info(errmsg);
                  }
                }}
              >{`获取验证码${this.state.canSendVerifyCodeSencond
                ? `(${this.state.canSendVerifyCodeSencond}s)`
                : ''
                }`}</Button>
            </Flex.Item>
          </Flex>
          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('mobile') || []).join(', ')}
          </div>
          <InputItem
            {...getFieldProps('verifyCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '验证码必填',
                },
              ],
            })}
            type="number"
            placeholder="发送验证码需填写联系电话"
            maxLength={4}
            {...formatInputProps('verifyCode')}
          >
            <font style={{ color: 'red' }}>*</font>验证码
          </InputItem>
          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('verifyCode') || []).join(', ')}
          </div>
        </List>
        <WhiteSpace />
        <button className={'next-but'} onClick={this.submit}>
          注册合作方账号
        </button>
      </div>
    );
  }
}

export default createForm()(BasicInputExampleEdit);
