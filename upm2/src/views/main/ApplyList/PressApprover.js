import React, { Component } from 'react';
import {
  Popover, Checkbox, Row, Col, Button, message, Modal
} from 'antd';
import TextButton from '@components/TextButton';
import connect from '@utils/translateConnect';

import './index.less';

const CheckboxGroup = Checkbox.Group;

import { pressApprover as pressApproverApi } from '@services/apply';

class PressApprover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkedApprovers: [] // 选中审批人
    };

    const {t} = props;
    this.noteTip = t('小提醒：未审批情况下，每1小时可以发送一次催办提醒。');
    // this.noteTip = t('已向审批人发送邮件/D-Chat催办通知，紧急情况建议直接联系审批人')
  }
  onPressApprover = () => {
    const { t, record } = this.props;

    // console.log('onPressApprover', record)

    let permNameArr = record.applyRoleDtos.map(it => {
      return it.refName;
    });
    let apprNames = [];
    if (record.approveNames.length === 1) {
      apprNames = [record.approveNames[0]];
    } else {
      apprNames = this.state.checkedApprovers;
    }
    if (!apprNames.length) {
      message.error(t('请至少选择一个审批人'));
      return;
    }
    const data = {
      approverNames: apprNames,
      appName: record.appName,
      permissionName: permNameArr.join(','),
      applyId: record.id,
      appId: 888
    };
    pressApproverApi(data, { silent: false }).then(() => {
      this.setState({
        visible: false,
        checkedApprovers: []
      });

      Modal.success({
        title: t('已向审批人发送邮件/D-Chat催办通知，紧急情况建议直接联系审批人'),
        content: (
          <span style={{color: 'red'}}>{this.noteTip}</span>
        ),
      });
    }).catch(err => {
      this.setState({
        visible: false,
        checkedApprovers: []
      });

      if (err.message === '请不要频繁催办哦~') {
        Modal.warning({
          title: t('请不要频繁催办哦~'),
          content: (
            <span style={{color: 'red'}}>{this.noteTip}</span>
          ),
        });
      }
    });
  }
  checkApprovor = (checkedValue) => {
    // console.log('checkApprovor', checkedValue)

    this.setState({
      checkedApprovers: checkedValue
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });

    if (visible === false) {
      this.setState({
        checkedApprovers: []
      });
    }
  }
  render() {
    const { t, record } = this.props;
    const { checkedApprovers } = this.state;

    let approveNames = record.approveNames;

    // for test
    // approveNames = approveNames.concat(['aaa', 'bbb', 'ccc', 'ddd'])

    const popContent = (
      <div className="pop-press-approver">
        <h4>{t('请选择需要催办的审批人')}</h4>
        <CheckboxGroup onChange={this.checkApprovor} value={checkedApprovers} style={{width: '100%'}}>
          <Row>
            {
              approveNames.map((it, index) => {
                let checked = false;
                if (checkedApprovers.includes(it)) {
                  checked = true;
                }
                return (
                  <Col span={8} key={index}><Checkbox checked={checked} value={it}>{it}</Checkbox></Col>
                );
              })
            }
          </Row>
        </CheckboxGroup>
        <p className="note">
          {this.noteTip}
        </p>
        <div className="btns">
          <Button type="primary" onClick={this.onPressApprover}>{t('确定催办')}</Button>
        </div>
      </div>
    );

    // 催办功能
    let pressApproverComp = null;
    // 多个审批人
    if (approveNames.length > 1) {
      pressApproverComp = (
        <Popover placement="left"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          content={popContent} title={t('审批人催办')} trigger="click">
          <TextButton>{t('催办')}</TextButton>
        </Popover>
      );
    } else if (approveNames.length === 1){
      pressApproverComp = (
        <TextButton
          onClick={this.onPressApprover}
        >{t('催办')}</TextButton>
      );
    }
    return (
      <span>
        {pressApproverComp}
      </span>
    );
  }
}

export default connect()(PressApprover);
