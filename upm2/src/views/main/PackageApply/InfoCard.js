import React from 'react';
export default class InfoCard extends React.Component {
  render() {
    const red = {
      color: 'red',
    };
    return (
      <div style={this.props.style}>
        <h3 style={{ color: 'red', marginBottom: '20px' }}>
          {this.props.title}
        </h3>
        <div>
          <h4>【适用人群】</h4> <p>新入职网约车区域运营新员工</p>
          <h4>【快速了解】</h4>
          <p>
            小桔大礼包分为
            <span style={red}>策略类礼包</span>和
            <span style={red}>数据类礼包</span>，
            包含MIS、Insight、实时监控、数易报表、SQL模板、Pope乘客和Pope司机 基础权限
          </p>
          <p>
            具体权限list&审批流 点我一键直达：
            <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=169590752">
              http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=169590752
            </a>
          </p>
          <h4>【操作Tips】</h4>
          <p>请各位新同学根据自己所属区域以及所需要礼包权限进行勾选。</p>
          <p>礼包丰富更新迭代中，敬请期待。</p>
        </div>
      </div>
    );
  }
}
