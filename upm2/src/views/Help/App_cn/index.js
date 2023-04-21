import React from 'react';
import { connect } from 'dva';
import img001 from './static/image001.png';
import img003 from './static/image003.png';
import img005 from './static/image005.png';
import img007 from './static/image007.png';
import img009 from './static/image009.png';
import img011 from './static/image011.png';
import img013 from './static/image013.png';
import img015 from './static/image015.png';
import img017 from './static/image017.png';
import img019 from './static/image019.png';
import img021 from './static/image021.png';
import img023 from './static/image023.png';
import img025 from './static/image025.png';
import img027 from './static/image027.png';
import img029 from './static/image029.png';
import img031 from './static/image031.png';
import img033 from './static/image033.png';
import img035 from './static/image035.png';
import img036 from './static/image036.png';

import '../style.less';

class App_cn extends React.Component {
  render() {
    return (
      <div className="helpdocs">
        {/* <div className="helpdocs-content"> */}
        <h1>UPM系统使用手册-申请端</h1>
          <h1>1.0 系统首页 Home</h1>
          <h1>一、页面介绍</h1>
          <p>如下图所示，本菜单页共有7个功能</p>
          <p className="helpdocs-center"><img src={img001} alt="" /></p>
          <h1>二、操作指南</h1>
          <h2>1.申请新权限</h2>
          <p>功能：给已接入的子系统申请权限。</p>
          <p>地址：权限申请的URL地址：
            <a href="https://upm.didiglobal.com/upm2-static/main/newapply">https://upm.didiglobal.com/upm2-static/main/newapply</a></p>
          <p>步骤：共4步</p>
          <p className="helpdocs-center"><img src={img003} alt="" /></p>
          <h3>a.选择目标子系统</h3>
          <p className="helpdocs-center"><img src={img005} alt="" /></p>
          <h3>b1.选择权限类型</h3>
          <p>【角色】：权限点的合集由系统管理员创建维护</p>
          <p>【地区】：权限使用中涉及的地区/城市维度</p>
          <p>
            <span style={{textDecoration: 'line-through'}}>【标识位】</span></p>
          <p className="helpdocs-center"><img src={img007} alt="" /></p>
          <h3>b2.选择角色类型</h3>
          <p>【功能角色】：针对单独【权限/功能点】建立的角色，适用于敏感权限的授权与管理。</p>
          <p>【岗位角色】：根据人员【岗位/职能】建立的角色，属于【权限/功能点】的合集（非敏感权限），适用于岗位授权和标准化管理。</p>
          <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
          <p className="helpdocs-center"><img src={img009} alt="" /></p>
          <h3>b3.选择角色</h3>
          <p>点击角色框体后弹出角色勾选页面</p>
          <p className="helpdocs-center"><img src={img011} alt="" /></p>
          <p>勾选所需角色后点击确认</p>
          <p className="helpdocs-center"><img src={img013} alt="" /></p>
          <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>
          <p>&nbsp;</p>
          <h3>c-d.填写申请理由后提交</h3>
          <p>填写相应申请理由后点击提交</p>
          <p className="helpdocs-center"><img src={img015} alt="" /></p>
          <p>【查看审批流程】按钮可以查看审批流。流程申请完成后会以邮件的形式通知到直接上级或权限负责人。</p>
          <p className="helpdocs-center"><img src={img017} alt="" /></p>
          <h2>2.我的申请</h2>
          <p>可通过对应操作按钮【详情】【复制】【撤回】进行此条申请的操作</p>
          <h3>a.【详情】</h3>
          <p>在【我的申请】中可以查看相关申请内容及进度(如下图)</p>
          <p className="helpdocs-center"><img src={img019} alt="" /></p>
          <p>&nbsp;</p>
          <p>【详情】：可以查看当前申请的审批流及进度</p>
          <p className="helpdocs-center"><img src={img021} alt="" /></p>
          <h3>b.
            <span style={{textDecoration: 'line-through'}}>【复制】&amp;</span>【代他人申请】</h3>
          <p>
            <span style={{textDecoration: 'line-through'}}>点击【复制】后转跳至申请页面，并按照此条申请内容自动选定相同的内容，</span>可通过勾选【代他人申请】完成为其他用户申请与此条申请相同的内容。</p>
          <p>备注：代他人申请提交后，【代申请人】无法查看到申请的审批内容，只通过【申请人】自己在系统中进行查看。</p>
          <p className="helpdocs-center"><img src={img023} alt="" /></p>
          <p className="helpdocs-center"><img src={img025} alt="" /></p>
          <h3>c.【撤销】</h3>
          <p>操作后则可以主动撤销此条申请</p>
          <h2>3.我的审批</h2>
          <p>【我的审批】可以查看流转至当前登录账户需要审批的内容</p>
          <p className="helpdocs-center"><img src={img027} alt="" /></p>
          <h2>4.我的权限</h2>
          <p>【我的权限】可以查看当前登录用户已拥有的各类权限角色，并可由用户主动发起删除权限的动作。</p>
          <p className="helpdocs-center"><img src={img029} alt="" /></p>
          <h2>5.小工具</h2>
          <p>可根据键入的目标查询相应的URL及角色</p>
          <p className="helpdocs-center"><img src={img031} alt="" /></p>
          <h2>6-7.管理系统</h2>
          <p>
            <strong>【管理系统】请查看使用手册1.2-1.9</strong></p>
          <p className="helpdocs-center"><img src={img033} alt="" /></p>
          <p>【系统管理员】</p>
          <p className="helpdocs-center"><img src={img035} alt="" /></p>
          <p>【业务线管理员】</p>
          <p className="helpdocs-center"><img src={img036} alt="" /></p>
        {/* </div> */}
      </div>
    );
  }
}

export default connect()(App_cn);
