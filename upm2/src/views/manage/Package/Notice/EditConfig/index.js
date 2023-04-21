import React, { Component } from 'react';
import {
  Button, Form, Input, Card,
  Select, message,
  Col, Row
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import connect from '@utils/translateConnect';
// import SystemList from '@components/SystemList';
// import AvailableApps from '@components/AvailableApps/index';
import {
  // searchOneNotice,
  newNotice,
  updateNotice,
} from '@services/packageNotice';
import {
  fetchAllCategory
} from '@services/managePackage';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class EditConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allCategory: [],
      editorState: null,
      actType: 'new', // 编辑类型，默认为新增
    };

    this.noticeHtml = '';  // 编辑器内容
    this.previewFormData = null;  // 缓存表单数据
    this.configId = null; // 配置 id
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  submitForm = (e) => {
    const { form, appId, t } = this.props;
    const { actType } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        this.updateNoticeHtml();  // 弥补 blur 事件不触发的情况，如添加链接

        // console.log('Received values of form: ', values);

        let postData = {};

        // 新增
        if (actType === 'new') {
          postData = {
            ...values,
            appId: 888
            // isDefault: values.default
          };

          newNotice({
            ...postData
          }).then(() => {
            message.success(t('添加配置成功！'));
            window.setTimeout(() => {
              this.gotoList();
            }, 1000);

          }).catch((err) => {
            console.log('newNotice err', err);
          });
        } else if (actType === 'edit') {  // 编辑
          postData = {
            appId: 888,
            ...values,
            id: this.configId
          };

          updateNotice({
            ...postData
          }).then(() => {
            message.success(t('修改配置成功！'));
            window.setTimeout(() => {
              this.gotoList();
            }, 1000);

          }).catch((err) => {
            console.log('updateNotice err', err);
          });
        }

      }
    });
  }
  // 更新编辑器参数值
  updateNoticeHtml = () => {
    const { editorState } = this.state;
    const { setFieldsValue } = this.props.form;
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    // 验证 HTML 是否真有内容，默认为：<p>回车符</p>
    const validHtml = function () {
      const frag = document.createElement('div');
      frag.innerHTML = html;
      let text = frag.textContent.replace(/^(\r|\n)/g, '');
      return !!text;
    };

    if (validHtml(html)) {
      // console.log('updateNoticeHtml', html);

      setFieldsValue({
        introduce: html,
      });
      this.noticeHtml = html;
    }
  }
  // 返回列表页面
  gotoList = () => {
    const { history } = this.props;
    history.goBack();
  }
  preview = () => {
    const { history, match, form } = this.props;

    let formData = form.getFieldsValue();
    formData.configId = this.configId;  // 缓存配置 id
    formData.actType = this.state.actType;  // 保存原来的操作类型
    // console.log('formData', formData)

    let thisUrl = match.url.replace(/\/(new-notice|edit-notice)/, '/preview-notice');
    history.push(thisUrl, {
      formData,
    });
  }
  // 编辑器赋初值
  initEditor = () => {
    const { setFieldsValue } = this.props.form;

    let noticeHtml = this.noticeHtml;
    if (noticeHtml) {
      setFieldsValue({
        introduce: noticeHtml,
      });

      const contentBlock = htmlToDraft(noticeHtml);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
        });
      }
    }
    
  }
  componentDidMount() {
    const { history, appId, form } = this.props;
    const { setFieldsValue } = form;

    fetchAllCategory({
      appId: 888
    }).then(allCategory => {
      this.setState({
        allCategory
      })
    })

    // 获取缓存表单数据
    let cacheFormData = window.sessionStorage.getItem('cacheFormData');

    // 从预览页恢复
    if (cacheFormData) {
      cacheFormData = JSON.parse(cacheFormData);
      // 清除缓存数据
      window.sessionStorage.removeItem('cacheFormData');

      // console.log('cacheFormData', cacheFormData)

      // 初始化编辑器内容
      this.noticeHtml = cacheFormData.introduce;
      this.initEditor();

      this.setState({
        actType: cacheFormData.actType  // 恢复操作类型
      });
      this.configId = cacheFormData.configId;

      // 恢复表单数据
      // 目标系统参数赋值
      setFieldsValue({
        'categoryId': cacheFormData.categoryId,
      });
      setFieldsValue({
        'configName': cacheFormData.configName,
      });
      setFieldsValue({
        'isDefault': cacheFormData.isDefault,
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
      this.configId = configData.id;
      // console.log('edit page componentDidMount', configData);

      this.noticeHtml = configData.introduce;
      // 初始化编辑器内容
      this.initEditor();
      // searchOneNotice({
      //   categoryId: configData.categoryId
      // }).then((result) => {
      //   this.noticeHtml = result;
      //   // 初始化编辑器内容
      //   this.initEditor();
        
      // }).catch((err) => {
      //   console.log('searchOneNotice err', err);
      // });

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
    const { editorState, actType, allCategory } = this.state;
    const { location } = history;

    // console.log('edit page this.state', this.state)

    const formItemLayout = {
      labelCol: {
        span: 5,
      }
    };

    const toolbarOpts = {
      options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough'],
      }
    };

    // 渲染礼包分类
    const renderTagetSys = () => {
      if (actType === 'new') {  // 新增
        return (
          <FormItem {...formItemLayout} label={t('礼包分类')} required>
            {
              getFieldDecorator('categoryId', {
                // initialValue: appId, 
              })(
                <Select placeholder={t('请选择')} allowClear >
                  {_.map(allCategory, ({ id, name }) =>
                    <Select.Option key={id} value={id} >{name}</Select.Option>
                  )}
                </Select>
              )
            }
          </FormItem>
        );
      } else if (actType === 'edit') {  // 编辑

        const { configData } = location.state;
        // console.log('edit configData', configData)

        // Option key 只能是字符串
        const categoryId = configData.categoryId + '';
        return (
          <FormItem {...formItemLayout} label={t('礼包分类')} required>
            {
              getFieldDecorator('categoryId', {
                initialValue: categoryId, 
              })(
                <Select disabled>
                  <Option key={categoryId}>{configData.categoryName}</Option>
                </Select>
                // <Select placeholder={t('请选择')} allowClear >
                //   {_.map(allCategory, ({ id, name }) =>
                //     <Select.Option key={id} value={id} >{name}</Select.Option>
                //   )}
                // </Select>
              )
            }
          </FormItem>
        );
      }
    };

    // 配置名称
    let configName = '';
    if (location.state && location.state.configData) {
      const { configData } = location.state;
      configName = configData.configName;
    }

    // 默认配置
    let isDefault = '0';
    if (location.state && location.state.configData) {
      const { configData } = location.state;
      isDefault = configData.isDefault ? '1' : '0';
    }

    return (
      <div className="edit-notice-config">
        <Card title={t('申请页管理')} bordered={false}>
          <Form layout="inline" onSubmit={this.submitForm}>
            <Row gutter={20}>
              <Col span={12}>
                { renderTagetSys() }
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={t('配置名称')} required>
                  {getFieldDecorator('configName', {
                    initialValue: configName,
                    rules: [{
                      required: true,
                      message: t('请填写配置名称!')
                    }],
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
                  {getFieldDecorator('isDefault', {
                    initialValue: isDefault
                  })(
                    <Select>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={24} className="editor-wrap">
                <FormItem label={t('自定义内容')} required>
                  {getFieldDecorator('introduce', {
                    rules: [{
                      required: true,
                      message: t('请填写配置内容!')
                    }],
                  })(
                    <Input type='hidden' />
                  )}
                  <Editor 
                    wrapperClassName="notice-wrap"
                    editorClassName="notice-editor"
                    toolbarClassName="notice-toolbar"
                    toolbar={toolbarOpts}
                    localization={{
                      locale: 'zh',
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
              <Button
                type="primary"
                onClick={this.preview}
              >
                {t('预览')}
              </Button>
              <Button
                type="primary"
                className="act-btn"
                htmlType="submit"
              >
                {t('确认')}
              </Button>
              <Button
                className="act-btn"
                onClick={this.gotoList}
              >
                {t('取消')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { global } = state;
  
  return {
    appId: global.managingApp,
  };
};

export default connect(
  mapStateToProps,
)(Form.create()(EditConfig));