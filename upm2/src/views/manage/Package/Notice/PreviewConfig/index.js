import React, { Component } from 'react';
import {
  Button, Form, Input, Checkbox, Card,
  Select, Col, Row, Icon
} from 'antd';
import connect from '@utils/translateConnect';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class PreviewConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noticeHtml: ''
    };
  }
  closePreview = () => {
    const { history } = this.props;
    history.goBack();
  }
  componentDidMount() {
    const { history } = this.props;
    const { location } = history;

    if (location.state) {
      let { formData } = location.state;
      let noticeHtml = formData.introduce || '';

      this.setState({
        noticeHtml,
      });

      // 缓存表单内容
      window.sessionStorage.setItem('cacheFormData', JSON.stringify(formData));
    }
    
  }
  render() { 
    const { t } = this.props;
    const { noticeHtml } = this.state;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };

    return (
      <div className="apply-notice-preview">
        <Card title={t('申请新权限')} bordered={false}>
          <Form>
            <Row>
              <Col span={11}>
                <FormItem {...formItemLayout} label={t('申请人邮箱前缀')} required={true}>
                  <Row>
                  <Col span={16} >
                    <FormItem>
                      <Input
                        disabled
                        value="admin"
                      />
                    </FormItem>
                  </Col>
                  <Col span={7} offset={1} >
                    <FormItem>
                      <Checkbox disabled>{t('代他人申请')}</Checkbox>
                    </FormItem>
                  </Col>
                  </Row>
                </FormItem>

                <FormItem {...formItemLayout} label={t('需要申请访问的系统')} required={true}>
                  <Select defaultValue="-1" disabled>
                    <Option value="-1">{t('请选择系统')}</Option>
                  </Select>
                </FormItem>

                <FormItem {...formItemLayout} label={t('权限的失效日期')} required={true}>
                  <Input
                    disabled
                    placeholder={t('请选择日期')}
                    suffix={
                      <Icon type="calendar" style={{color: 'rgba(0,0,0,.2)'}} />
                    }
                  />
                </FormItem>

                <FormItem {...formItemLayout} label={t('您申请权限的理由')} required={true}>
                  <TextArea disabled rows={4} />
                </FormItem>

                <FormItem wrapperCol={{ offset: 4 }} >
                    <Button disabled className="action-btn" type="primary" size="default" htmlType="submit" >{t('提交')}</Button>
                    <Button disabled className="action-btn">{t('查看审批流程')}</Button>
                    <Button type="primary" onClick={this.closePreview}>{t('关闭预览')}</Button>
                </FormItem>
              </Col>

              <Col span={12} offset={1}>
                <div className="preview-container" dangerouslySetInnerHTML={{
                  __html: noticeHtml
                }}>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(() => {
  return {
  };
})(PreviewConfig);