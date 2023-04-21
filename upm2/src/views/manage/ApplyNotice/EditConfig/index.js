import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Select,
  message,
  Col,
  Row,
  Popover,
  Icon
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import connect from '@utils/translateConnect';
// import SystemList from '@components/SystemList';
import AvailableApps from '@components/AvailableApps/index';
import {
  searchOneNotice,
  newNotice,
  updateNotice
} from '@services/applyNotice';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class EditConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: null,
      actType: 'new' // 编辑类型，默认为新增
    };

    this.noticeHtml = ''; // 编辑器内容
    this.previewFormData = null; // 缓存表单数据
    this.configId = null; // 配置 id
  }
  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };
  submitForm = e => {
    const { form, appId, t } = this.props;
    const { actType } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        this.updateNoticeHtml(); // 弥补 blur 事件不触发的情况，如添加链接

        // console.log('Received values of form: ', values);

        let postData = {};

        // 新增
        if (actType === 'new') {
          postData = {
            appId,
            ...values,
            appIdRel: appId,
            default: values.default === '0' ? false : true
          };

          newNotice({
            ...postData
          })
            .then(() => {
              message.success(t('添加配置成功！'));
              window.setTimeout(() => {
                this.gotoList();
              }, 1000);
            })
            .catch(err => {
              console.log('newNotice err', err);
            });
        } else if (actType === 'edit') {
          // 编辑
          postData = {
            appId,
            ...values,
            appIdRel: parseInt(values.appIdRel),
            configId: this.configId,
            default: values.default === '0' ? false : true
          };

          updateNotice({
            ...postData
          })
            .then(() => {
              message.success(t('修改配置成功！'));
              window.setTimeout(() => {
                this.gotoList();
              }, 1000);
            })
            .catch(err => {
              console.log('updateNotice err', err);
            });
        }
      }
    });
  };
  // 更新编辑器参数值
  updateNoticeHtml = () => {
    const { editorState } = this.state;
    const { setFieldsValue } = this.props.form;
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    // 验证 HTML 是否真有内容，默认为：<p>回车符</p>
    const validHtml = function() {
      const frag = document.createElement('div');
      frag.innerHTML = html;
      let text = frag.textContent.replace(/^(\r|\n)/g, '');
      return !!text;
    };

    if (validHtml(html)) {
      // console.log('updateNoticeHtml', html);

      setFieldsValue({
        content: html
      });
      this.noticeHtml = html;
    }
  };
  // 返回列表页面
  gotoList = () => {
    const { history } = this.props;
    history.goBack();
  };
  preview = () => {
    const { history, match, form } = this.props;

    let formData = form.getFieldsValue();
    formData.configId = this.configId; // 缓存配置 id
    formData.actType = this.state.actType; // 保存原来的操作类型
    // console.log('formData', formData)

    let thisUrl = match.url.replace(
      /\/(new-notice|edit-notice)/,
      '/preview-notice'
    );
    history.push(thisUrl, {
      formData
    });
  };
  // 编辑器赋初值
  initEditor = () => {
    const { setFieldsValue } = this.props.form;

    let noticeHtml = this.noticeHtml;
    if (noticeHtml) {
      setFieldsValue({
        content: noticeHtml
      });

      const contentBlock = htmlToDraft(noticeHtml);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState
        });
      }
    }
  };
  componentDidMount() {
    const { history, appId, form } = this.props;
    const { setFieldsValue } = form;

    // 获取缓存表单数据
    let cacheFormData = window.sessionStorage.getItem('cacheFormData');

    // 从预览页恢复
    if (cacheFormData) {
      cacheFormData = JSON.parse(cacheFormData);
      // 清除缓存数据
      window.sessionStorage.removeItem('cacheFormData');

      // console.log('cacheFormData', cacheFormData)

      // 初始化编辑器内容
      this.noticeHtml = cacheFormData.content;
      this.initEditor();

      this.setState({
        actType: cacheFormData.actType // 恢复操作类型
      });
      this.configId = cacheFormData.configId;

      // 恢复表单数据
      // 目标系统参数赋值
      setFieldsValue({
        appIdRel: cacheFormData.appIdRel
      });
      setFieldsValue({
        name: cacheFormData.name
      });
      setFieldsValue({
        permissionConsultant: cacheFormData.permissionConsultant
      });
      setFieldsValue({
        consultGroup: cacheFormData.consultGroup
      });
      setFieldsValue({
        default: cacheFormData.default
      });

      return;
    }

    const { location } = history;
    // 默认为新增，router 里面有 configData 参数则为编辑操作
    if (location.state && location.state.configData) {
      const { configData } = location.state;
      this.setState({
        actType: 'edit'
      });

      // console.log('edit page componentDidMount', configData);

      searchOneNotice({
        appId,
        configId: configData.id
      })
        .then(result => {
          this.noticeHtml = result.content;
          this.configId = result.id;
          const arr = result.permissionConsultant.map(item => item.username);
          this.setState({
            permissionConsultant: arr.join(','),
            consultGroup: result.consultGroup
          });

          // 初始化编辑器内容
          this.initEditor();
        })
        .catch(err => {
          console.log('searchOneNotice err', err);
        });
    }
  }
  // onSystemChange = (val) => {
  //   // console.log('onSystemChange', val)

  //   const { form} = this.props;
  //   const { setFieldsValue } = form;

  //   // 目标系统参数赋值
  //   setFieldsValue({
  //     'appIdRel': val+ '',
  //   });
  // }
  render() {
    const { t, form, history } = this.props;
    const { getFieldDecorator } = form;
    const { editorState, actType } = this.state;
    const { location } = history;

    // console.log('edit page this.state', this.state)

    const formItemLayout = {
      labelCol: {
        span: 6
      }
    };

    const toolbarOpts = {
      options: [
        'inline',
        'blockType',
        'fontSize',
        'list',
        'textAlign',
        'colorPicker',
        'link',
        'embedded',
        'image',
        'remove',
        'history'
      ],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
      }
    };

    // 渲染目标系统
    const renderTagetSys = () => {
      if (actType === 'new') {
        // 新增
        return (
          <FormItem {...formItemLayout} label={t('目标系统')} required>
            <AvailableApps />
            {/* {
              getFieldDecorator('appIdRel', {
                rules: [{
                  required: true,
                  message: t('请选择目标系统!')
                }],
              })(
                <SystemList t={t} onChange={this.onSystemChange}/>
              )
            } */}
          </FormItem>
        );
      } else if (actType === 'edit') {
        // 编辑

        const { configData } = location.state;
        // console.log('edit configData', configData)

        // Option key 只能是字符串
        const appId = configData.appId + '';
        return (
          <FormItem {...formItemLayout} label={t('目标系统')} required>
            {getFieldDecorator('appIdRel', {
              initialValue: appId
            })(
              <Select disabled>
                <Option key={appId}>{configData.appName}</Option>
              </Select>
            )}
          </FormItem>
        );
      }
    };

    // 配置名称
    let configName = '';
    if (location.state && location.state.configData) {
      const { configData } = location.state;
      configName = configData.name;
    }

    // 默认配置
    let isDefault = '0';
    if (location.state && location.state.configData) {
      const { configData } = location.state;
      isDefault = configData.default ? '1' : '0';
    }

    return (
      <div className="edit-notice-config">
        <Card title={t('申请页管理')} bordered={false}>
          <Form layout="inline" onSubmit={this.submitForm}>
            <Row gutter={20}>
              <Col span={12}>{renderTagetSys()}</Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={t('配置名称')} required>
                  {getFieldDecorator('name', {
                    initialValue: configName,
                    rules: [
                      {
                        required: true,
                        message: t('请填写配置名称!')
                      }
                    ]
                  })(
                    <Input
                      placeholder={t('请输入唯一的配置名称')}
                      className="search-input"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={t('默认配置')} required>
                  {getFieldDecorator('default', {
                    initialValue: isDefault
                  })(
                    <Select>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={t('系统咨询群')}>
                  {getFieldDecorator('consultGroup', {
                    initialValue: this.state.consultGroup
                    // rules: [{
                    //   required: true,
                    //   message: t('请填写系统咨询群链接!')
                    // }]
                  })(
                    <Input
                      placeholder={t('请输入咨询群链接')}
                      className="search-input"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={13}>
                <FormItem
                  {...formItemLayout}
                  label={
                    <Popover
                      placement="right"
                      content={
                        <p style={{ width: '200px' }}>
                          {t(
                            '请输入系统权限申请相关问题答疑接口人，输入后该用户名字将显示在权限申请页上方'
                          )}
                        </p>
                      }>
                      <span>
                        {t('权限申请咨询人')} <Icon type="question-circle-o" />
                      </span>
                    </Popover>
                  }>
                  {getFieldDecorator('permissionConsultant', {
                    initialValue: this.state.permissionConsultant
                    // rules: [{
                    //   // required: true,
                    //   message: t('请填写权限申请咨询人!')
                    // }]
                  })(
                    <Input
                      placeholder={t('请输入员工邮箱前缀')}
                      className="search-input"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24} className="editor-wrap">
                <FormItem label={t('自定义内容')} required>
                  {getFieldDecorator('content', {
                    rules: [
                      {
                        required: true,
                        message: t('请填写配置内容!')
                      }
                    ]
                  })(<Input type="hidden" />)}
                  <Editor
                    wrapperClassName="notice-wrap"
                    editorClassName="notice-editor"
                    toolbarClassName="notice-toolbar"
                    toolbar={toolbarOpts}
                    localization={{
                      locale: 'zh'
                    }}
                    editorState={editorState}
                    onBlur={() => {
                      this.updateNoticeHtml();
                    }}
                    onEditorStateChange={this.onEditorStateChange}
                  />
                </FormItem>
              </Col>
            </Row>
            <div className="action-btn">
              <Button type="primary" onClick={this.preview}>
                {t('预览')}
              </Button>
              <Button type="primary" className="act-btn" htmlType="submit">
                {t('确认')}
              </Button>
              <Button className="act-btn" onClick={this.gotoList}>
                {t('取消')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { global } = state;

  return {
    appId: global.managingApp
  };
};

export default connect(mapStateToProps)(Form.create()(EditConfig));
