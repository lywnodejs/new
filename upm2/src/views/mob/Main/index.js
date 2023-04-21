import React, { Component } from 'react';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

import ApproveList from '@/views/mob/ApproveList';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeTab = () => {};
  render() {
    return (
      <Tabs defaultActiveKey="1" type="card" onChange={this.changeTab}>
        {/* <TabPane tab="我的申请" key="2">Content of Tab Pane 2</TabPane> */}
        <TabPane tab="我的审批" key="1">
          <ApproveList />
        </TabPane>
      </Tabs>
    );
  }
}

export default Main;
