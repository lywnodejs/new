import React from 'react';
import { Row, Col, Form, Input, Button, Card } from 'antd';
import { postJSON } from '../../../../utils/request';

const FormItem = Form.Item;

class ResetTool extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      username: ''
    };
  }

  handleUsernameChange (e) {
    this.setState({
      ...this.state,
      username: e.target.value
    })
  }

  handleReset (e) {
    const { username } = this.state

    postJSON(`/permissionOp/recover?username=${username}&appId=888`).then(res => {}, err => {})
  }

  render () {
    const { t } = this.props
    const arr = this.state.result
    return (
      <Card title ={t('一键重置')} >
        <Row gutter={24}>
          <Col span={8} className="search-fields">
            <FormItem label={t('用户名称')} >
              <Input onChange={(value) => this.handleUsernameChange(value)}/>
            </FormItem>
          </Col>
          <Col span={3} offset={12} className="search-button">
            <FormItem label="">
              <Button
                type="primary"
                onClick={() => this.handleReset()}>
                {t('一键恢复权限')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default ResetTool
