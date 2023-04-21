import React from 'react';
import { connect } from 'dva';
import img001 from '../App_en/static/image001.png';
import img003 from '../App_en/static/image003.png';
import img005 from '../App_en/static/image005.png';
import img007 from '../App_en/static/image007.png';
import img009 from '../App_en/static/image009.png';
import img011 from '../App_en/static/image011.png';
import img013 from '../App_en/static/image013.png';
import img015 from '../App_en/static/image015.png';
import img017 from '../App_en/static/image017.png';
import img019 from '../App_en/static/image019.png';
import img021 from '../App_en/static/image021.png';
import img023 from '../App_en/static/image023.png';
import img025 from '../App_en/static/image025.png';
import img027 from '../App_en/static/image027.png';
import img029 from '../App_en/static/image029.png';
import img031 from '../App_en/static/image031.png';
import img033 from '../App_en/static/image033.png';
import img035 from '../App_en/static/image035.png';
import img036 from '../App_en/static/image036.png';
import img037 from '../Ad_en/static/image037.png';
import img039 from '../Ad_en/static/image039.png';
import img041 from '../Ad_en/static/image041.png';
import img043 from '../Ad_en/static/image043.png';
import img045 from '../Ad_en/static/image045.png';
import img047 from '../Ad_en/static/image047.png';
import img049 from '../Ad_en/static/image049.png';
import img051 from '../Ad_en/static/image051.png';
import img053 from '../Ad_en/static/image053.png';
import img055 from '../Ad_en/static/image055.png';
import img057 from '../Ad_en/static/image057.png';
import img059 from '../Ad_en/static/image059.png';
import img061 from '../Ad_en/static/image061.png';
import img063 from '../Ad_en/static/image063.png';
import img065 from '../Ad_en/static/image065.png';
import img067 from '../Ad_en/static/image067.png';
import img069 from '../Ad_en/static/image069.png';
import img071 from '../Ad_en/static/image071.png';
import img073 from '../Ad_en/static/image073.png';
import img075 from '../Ad_en/static/image075.png';
import img077 from '../Ad_en/static/image077.png';
import img079 from '../Ad_en/static/image079.png';
import img081 from '../Ad_en/static/image081.png';
import img083 from '../Ad_en/static/image083.png';
import img085 from '../Ad_en/static/image085.png';
import img087 from '../Ad_en/static/image087.png';
import img089 from '../Ad_en/static/image089.png';
import img091 from '../Ad_en/static/image091.png';
import img093 from '../Ad_en/static/image093.png';
import img095 from '../Ad_en/static/image095.png';
import img097 from '../Ad_en/static/image097.png';
import img099 from '../Ad_en/static/image099.png';
import img101 from '../Ad_en/static/image101.png';
import img103 from '../Ad_en/static/image103.png';
import img105 from '../Ad_en/static/image105.png';
import img107 from '../Ad_en/static/image107.png';
import img109 from '../Ad_en/static/image109.png';

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
        <h1>1.1 功能菜单</h1>
        <h1>一、页面介绍</h1>
        <p>通过本页面可进行子系统的功能管理，页面主要分为左右两部分，左侧展示【功能列表】(权限结构)方便点选管理，右侧为【详情】可进行相应的编辑。</p>
        <p>此页面可以添加、删除、编辑单个功能点，也可以通过上传编辑好的模板，批量添加功能点，批量修改功能点。</p>
        <p>针对于功能可以进行使用频次的限制</p>
        <p className="helpdocs-center"><img src={img037} alt="" /></p>
        <h1>二、操作指南</h1>
        <h2>1. 功能管理</h2>
        <h3>1.1 添加单个功能点</h3>
        <p>通过点击页面上的【新增根节点】和【给选中节点增加子节点】按钮，进行创建【权限结构】及【权限点】配置</p>
        <p>如下图所示：</p>
        <p>图1</p>
        <p className="helpdocs-center"><img src={img039} alt="" /></p>
        <p>图2</p>
        <p className="helpdocs-center"><img src={img041} alt="" /></p>
        <p>a:通过语言栏可以添加当前所编辑节点的【功能名称】语言【English】【Portugu&ecirc;s】【espa&ntilde;a】【日本語】（如图2）</p>
        <p>注：在UPM系统页面选择语言处，如结构树中权限点录入了对应【语言】的【功能名称】则会与页面语言选择处一致，目前支持【English】切换</p>
        <p>b:【Function name】填写权限点的【功能名称】可以通过 【a】 处添加多语言输入框体，进行多语言标识</p>
        <p>c:【Corresponding URL】填写功能对应的URL，需与研发人员确认</p>
        <p>d:【Note】备注权限点信息，方便日后维护</p>
        <p>e:【Yes/No Menu】为创建的权限选择是否为菜单，菜单权限选择Y 非菜单权限选择N</p>
        <p>f:【Parent node】选择创建节点在左侧结构中的层级，默认为0级</p>
        <p>进行相应配置后点击【保存】，完成创建的权限点。</p>
        <h3>1.2 批量添加功能点</h3>
        <p>需要注意的是，批量添加需要首先下载批量添加的模板，在模板文件里面录入待添加的功能，之后将模板文件上传完成添加。</p>
        <p>如下图所示，将鼠标移动到&ldquo;批量添加&rdquo;按钮时，会在上方出现如下红框所示的按钮，点击&ldquo;上传模板下载&rdquo;即可下载上传模板。</p>
        <p className="helpdocs-center"><img src={img043} alt="" /></p>
        <h3>1.3 批量修改功能点</h3>
        <p>如下所示，点击&ldquo;批量修改&rdquo;按钮后在点击&ldquo;修改模板下载&rdquo;按钮。</p>
        <p className="helpdocs-center"><img src={img045} alt="" /></p>
        <h3>1.4 删除功能点</h3>
        <p>页面左侧功能列表中选中相应功能点后点击删除按钮，确认即可。</p>
        <h3>1.5 编辑功能点</h3>
        <p>左侧【权限结构展示】区域选中需要编辑的功能点，</p>
        <p>在右侧【详细编辑】中修改内容后点击【保存】即可</p>
        <h3>1.6 频次限制</h3>
        <p>左侧选中需要设置的功能点后，点击右侧【频次限制】按钮，可在弹出的页面中进行频次设置。</p>
        <p className="helpdocs-center"><img src={img047} alt="" /></p>
        <p>
          <strong>备注：【被限制人】不填写账号添加的限制为统一限制，输入账号后添加则可以对相应账户进行单独限制标准。</strong></p>
        <p className="helpdocs-center"><img src={img049} alt="" /></p>
        <h2>2. 功能组管理</h2>
        <p>可以绑定多个功能为一个功能组（略）</p>
        <h1>1.2 角色菜单</h1>
        <h1>一、页面介绍</h1>
        <p>本页面可管理角色 及 角色组；管理角色与功能点的关系</p>
        <p>可添加、编辑、删除角色；</p>
        <p>编辑角色与功能点关系、及与用户的关系</p>
        <p>可添加、编辑、删除角色；并编辑角色下绑定的用户</p>
        <p className="helpdocs-center"><img src={img051} alt="" /></p>
        <h1>二、操作指南</h1>
        <h2>1.&nbsp;角色管理</h2>
        <h3>1.1 新增角色 【
          <strong>注：国际化新增角色后需要发邮件联系RD为角色增加国家属性】</strong></h3>
        <p>新增角色：【角色标识】和【角色名称】是必填项，描述选填。角色标识是系统唯一的不能重复，创建后不可修改。语言框增加语言种类后会添加对角色名称的语言录入框</p>
        <p className="helpdocs-center"><img src={img053} alt="" /></p>
        <p>a:通过语言栏可以添加当前所新建的角色的【角色名称】语言【English】【Portugu&ecirc;s】【espa&ntilde;a】【日本語】如（图2）</p>
        <p>b:Role identification 【角色标识】创建后不可修改，唯一值</p>
        <p>c:Role name 【角色名称】创建后可以进行修改</p>
        <p>d:Character description 填写备注便于后续维护标记</p>
        <p>(图2)</p>
        <p className="helpdocs-center"><img src={img055} alt="" /></p>
        <p>&nbsp;</p>
        <h3>1.2 为角色绑定功能</h3>
        <p>点击角色管理菜单中的【功能分配】在弹出框中点选需要为角色分配的权限，</p>
        <p>然后点击保存进行完成分配</p>
        <p className="helpdocs-center"><img src={img057} alt="" /></p>
        <p className="helpdocs-center"><img src={img059} alt="" /></p>
        <p>a:可以通过索引栏查找功能结构中的权限点</p>
        <p>b:选中需要为【角色】绑定的【权限点】</p>
        <p>c:查看已选中的【权限点】</p>
        <p>d:点击保存完成分配</p>
        <p>&nbsp;</p>
        <h3>1.3 角色里面绑定用户</h3>
        <p>点击角色管理菜单中的用户绑定，在弹出框中输入完整账号，点击关联用户进行关联</p>
        <p>（图一）</p>
        <p className="helpdocs-center"><img src={img061} alt="" /></p>
        <p>（图二）</p>
        <p className="helpdocs-center"><img src={img063} alt="" /></p>
        <p>（图三）</p>
        <p className="helpdocs-center"><img src={img065} alt="" /></p>
        <h3>
          <span style={{textDecoration: 'line-through'}}>1.4 绑定角色组（不建议使用）</span></h3>
        <p>点击角色管理菜单中的角色组，在弹出框中勾选，点击确定进行关联</p>
        <h2>
          <span style={{textDecoration: 'line-through'}}>2. 角色组管理（不建议使用）</span></h2>
        <h3>
          <span style={{textDecoration: 'line-through'}}>2.1 新增角色组</span></h3>
        <p>添加新增按钮，进行角色组的新增，新增角色组 标识和名称是必填项，父级选填。标识是系统唯一的，不能重复</p>
        <p>&nbsp;</p>
        <h3>
          <span style={{textDecoration: 'line-through'}}>2.2 绑定角色</span></h3>
        <p>点击角色组管理菜单中的角色，在弹出框中勾选，点击确定进行关联</p>
        <p>&nbsp;</p>
        <h1>1.3 用户菜单</h1>
        <h1>一、页面介绍</h1>
        <p>【用户管理】页面主要实现对用户进行两类操作</p>
        <p>1.基本操作用来实现账号的增加、删除和查询(没有编辑修改用户账号的功能)；</p>
        <p>需要注意，在权限系统UPM里的用户数据是从SSO系统(StarGate)同步过来的，因此在用户的基本操作中没有【编辑】功能，只有【新增】【删除】【查看】</p>
        <p>2.可用通过【复制】【删除】【地区绑定】【标识】【分配角色】进行相应配置；</p>
        <p>目前用户权限实现主要通过为其配置【地区】&amp;【角色】来实现；其中：【标识位 】国内已不使用，目前是通过【策略/维度】进行管控</p>
        <p className="helpdocs-center"><img src={img067} alt="" /></p>
        <h1>二、操作指南</h1>
        <h2>
          <strong>1.</strong>
          <strong>增加用户</strong></h2>
        <p className="helpdocs-center"><img src={img069} alt="" /></p>
        <p>点击【新增】按钮后，会弹出一个【新增】对话框(如下图)，在对话框中输入要新增的用户名称(邮箱前缀)，需要注意的是新增用户账号必须是公司已存在的员工信息。</p>
        <p>当新增完成后，用户账号与子系统就完成了绑定关系，在子系统下面就可以看到新增的用户信息了。</p>
        <p className="helpdocs-center"><img src={img071} alt="" /></p>
        <p>&nbsp;</p>
        <h2>
          <strong>2.</strong>
          <strong>删除用户</strong></h2>
        <p>删除操作，通过四步完成，1选择目标系统；2输入需要删除账号；3查看查找到的用户信息；4点击删除按钮</p>
        <p>同新增用户一样，删除一个用户后，用户信息并非真正从UPM权限系统删除掉，而是将用户与子系统解除了绑定关系。</p>
        <p>如下所示，将选中的用户和所选子系统【专车MIS】进行删除操作后，【用户】与子系统【专车MIS】解除了绑定关系。</p>
        <p className="helpdocs-center"><img src={img073} alt="" /></p>
        <p>&nbsp;</p>
        <h2>
          <strong>3.</strong>
          <strong>查询用户</strong></h2>
        <p>查询条件支持：账号、姓名和邮箱，查询条件支持模糊查询。</p>
        <h2>
          <strong>4.</strong>
          <strong>用户与地区绑定</strong></h2>
        <p>在目标系统中查找到需要配置的用户，选择地区绑定进行配置。</p>
        <p className="helpdocs-center"><img src={img075} alt="" /></p>
        <p className="helpdocs-center"><img src={img077} alt="" /></p>
        <p>a.在地区列表中选择选择需要为用户添加的【地区】内容；</p>
        <p>b.查看选中地区是否正确；</p>
        <p>c.点击保存完成；</p>
        <h2>
          <strong>5.</strong>
          <strong>用户与角色绑定</strong></h2>
        <p>
          <strong>在【用户管理】页面查找到需要进行配置的用户；</strong></p>
        <p>
          <strong>点击用户对应的【分配角色】按钮在弹出的配置页面中进行操作。</strong></p>
        <p className="helpdocs-center"><img src={img079} alt="" /></p>
        <p>
          <strong>点入角色框体后在下拉页面中勾选需要为用户绑定的角色后点击提交即可，页面提示成功后自动转跳至【用户管理】页面</strong></p>
        <p>
          <strong>角色较多的子系统可以通过Chrome的查找功能（Shift+F）实现简单的查询</strong></p>
        <p className="helpdocs-center"><img src={img081} alt="" /></p>
        <p>权限时效日期默认为1年，在勾选完成需要配置的角色后，可以进行权限失效日期的配置。</p>
        <p className="helpdocs-center"><img src={img083} alt="" /></p>
        <p>&nbsp;</p>
        <h2>
          <strong>
            <span style={{textDecoration: 'line-through'}}>6.</span></strong>
          <strong>
            <span style={{textDecoration: 'line-through'}}>用户与标识位绑定 （已不使用）</span></strong>
        </h2>
        <p>略</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h1>1.4 审批流管理 Workflow manage</h1>
        <h1>一、页面介绍</h1>
        <p>审批流管理页面是对目标系统，申请流程的管理</p>
        <p>可以进行审批流的管理，通过对审批流进行【新增】【修改】【删除】【启用/停用】的操作</p>
        <p>达到从用户申请至审批授权的线上自动化</p>
        <h2>1.&nbsp;审批流介绍</h2>
        <h3>1.1 什么是审批流？</h3>
        <p>审批流为用户申请权限需要经由的审批流程。</p>
        <p>当用户发起申请时，需由设置好的审批流程来执行审批操作。</p>
        <p>审批通过进入下一个节点，审批不通过直接驳回用户申请。</p>
        <h3>1.2 为什么要有审批流？</h3>
        <p>审批流是为了方便用户获取权限。经由审批人【审批】后即可获得权限。</p>
        <p>提高申请授权的效率，同时在系统中保存申请记录以供追溯。</p>
        <h3>1.3 怎样使用审批流程?</h3>
        <p>通过在管理系统中创建一条审批流程。选择对应的属性。</p>
        <p>审批流启用后用户申请对应属性时，系统按照设置好的审批流程来执行申请的节点。</p>
        <h2>2.&nbsp;审批流内容解析</h2>
        <p>审批流分为【审批流信息】和【审批人节点】</p>
        <p>审批流信息包含【审批流类型（权限类型）】【关联属性（具体权限）】【状态（启用状态）】</p>
        <p>审批人节点包含【审批人类型（审批人名称）】</p>
        <p>一条审批流可经由多个审批人节点，进行审批</p>
        <h1>二、操作指南</h1>
        <h2>1.新增审批流</h2>
        <p>进行审批流配置需要为【子系统的管理员】权限</p>
        <p>进入审批流管理菜单，选择需要进行管理的目标系统，下图以【misp】为例</p>
        <p className="helpdocs-center"><img src={img085} alt="" /></p>
        <p>选择好目标系统后，点击【新增审批流】</p>
        <p>点击新增审批流按钮后在弹出的页面中进行审批流配置</p>
        <p className="helpdocs-center"><img src={img087} alt="" /></p>
        <p className="helpdocs-center"><img src={img089} alt="" /></p>
        <p>a:键入审批流名称</p>
        <p>b:选择【审批流类型】其中包括：【角色】【业务线】【地区】等等</p>
        <p>c:选择关联属性；【关联属性】为【审批流类型】的具体内容；如类型选择角色，则关联属性中就可以选需要关联的角色内容</p>
        <p>d:通过增加审批节点可以增加审批层级</p>
        <p>选择【节点属性】</p>
        <p>物理上级：HR系统中的物理上级</p>
        <p>固定接口人：可以录入指定人员的账号（邮箱前缀）</p>
        <p>固定接口人列表：可以录入多名人员，账号以逗号分隔</p>
        <p>&nbsp;</p>
        <p>配置完成后点击确认可在审批流页面看到已创建的审批流</p>
        <p className="helpdocs-center"><img src={img091} alt="" /></p>
        <h2>2.编辑审批流&nbsp;※修改当前正在使用的审批流会使当前已经产生的部分申请失效，请谨慎操作！</h2>
        <p>&nbsp;点击条目对应的编辑按钮</p>
        <p>和新增一致，修改对应的属性提交即可</p>
        <p className="helpdocs-center"><img src={img093} alt="" /></p>
        <h2>3.删除审批流</h2>
        <p>&nbsp;点击列表条目对应的删除按钮即可</p>
        <p className="helpdocs-center"><img src={img095} alt="" /></p>
        <h2>4.启用&amp;停用 审批流&nbsp;</h2>
        <p>&nbsp;点击列表条目对应的启用/停用按钮即可</p>
        <p className="helpdocs-center"><img src={img097} alt="" /></p>
        <h2>5.复制审批流</h2>
        <p>可以当前选择条目为基础数据，打开一个创建页面（自动填充所选条目数据）</p>
        <p>点击保存即可创建一条新的审批流数据</p>
        <p>&nbsp;</p>
        <h2>6.审批流优先级</h2>
        <table>
          <tbody>
            <tr>
              <td width="78">
                <p>
                  <strong>审批流类型</strong></p>
              </td>
              <td width="120">
                <p>
                  <strong>命中场景</strong></p>
              </td>
              <td width="806">
                <p>
                  <strong>优先级</strong></p>
              </td>
            </tr>
            <tr>
              <td width="78">
                <p>角色</p>
              </td>
              <td width="120">
                <p>申请角色</p>
              </td>
              <td width="806">
                <p>审批流类型为角色+关联属性为角色id的审批流&gt;审批流类型为角色+关联属性为全部的审批流&gt;全部默认&gt;全局默认(上级-&gt;子系统管理员)</p>
              </td>
            </tr>
            <tr>
              <td width="78">
                <p>地区</p>
              </td>
              <td width="120">
                <p>申请地区</p>
              </td>
              <td width="806">
                <p>审批流类型为地区+关联属性为地区id的审批流&gt;审批流类型为地区+关联属性为全部的审批流&gt;审批流类型为业务线地区+关联属性为地区id对应的业务线id的审批流&gt;审批流类型为业务线地区+关联属性为全部的审批流&gt;全部默认&gt;全局默认(上级-&gt;子系统管理员)&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td width="78">
                <p>标识位</p>
              </td>
              <td width="120">
                <p>申请标识位</p>
              </td>
              <td width="806">
                <p>审批流类型为标识位+关联属性为标识位id的审批流&gt;审批流类型为标识位+关联属性为全部的审批流&gt;全部默认&gt;全局默认(上级-&gt;子系统管理员)</p>
              </td>
            </tr>
            <tr>
              <td width="78">
                <p>全部</p>
              </td>
              <td width="120">
                <p>申请角色、地区、标识位</p>
              </td>
              <td width="806">
                <p>比全局高，比其他所有都低</p>
              </td>
            </tr>
            <tr>
              <td width="78">
                <p>全局</p>
              </td>
              <td width="120">
                <p>申请角色、地区、标识位</p>
              </td>
              <td width="806">
                <p>最低，如都无命中，使用此规则</p>
              </td>
            </tr>
          </tbody>
        </table>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h1>1.5 系统管理 System manage</h1>
        <h1>一、页面介绍</h1>
        <p>页面分为两部分内容；</p>
        <p>a:管理员管理：进行目标系统的系统管理员管理；【全局超级管理员】＞【子系统超级管理员】＞【子系统管理员】＞【小权限管理员】</p>
        <p>【全局超级管理员】：UPM【全局最高管理权限】可向【子系统超级管理员】及其他用户操作授权管理</p>
        <p>【子系统超级管理员】：目标系统的【超级管理员】可向【子系统管理员】及其他用户操作授权管理</p>
        <p>【子系统管理员】：目标系统的【管理员】可向【用户】进行操作管理</p>
        <p>【小权限管理员】：自己获取权限的管理者；仅可向【用户】授权自身拥有的权限</p>
        <p>【大数据业务线管理员】：独立与以上管理员，只针对于大数据需求，进行报表的业务线管理员使用</p>
        <p>b:系统详情：对接入UPM的子系统信息进行操作，完成/修改【绑定业务线】</p>
        <p className="helpdocs-center"><img src={img099} alt="" /></p>
        <h1>二、操作指南</h1>
        <h2>1.&nbsp;管理员管理</h2>
        <p>管理员管理用来设置用户和目标子系统的绑定关系，将用户绑定设置为目标子系统的管理员</p>
        <p>共如下两个步骤：</p>
        <h3>a.选择目标子系统</h3>
        <p className="helpdocs-center"><img src={img101} alt="" /></p>
        <h3>b.用户与子系统进行绑定</h3>
        <p>以用户 liuxingtong 设置为misp的【子系统超级管理员】为例，如下图所示，首先点击【子系统超级管理员】按钮，在弹出绑定用户的对话框进行操作。</p>
        <p>在绑定用户对话框上输入用户名 liuxingtong 点击【绑定用户】按钮</p>
        <p className="helpdocs-center"><img src={img103} alt="" /></p>
        <p>说明：管理员角色(如下图所示)的添加和修改需要联系UPM系统管理员进行添加/删除【登录
          <a href="http://bpm.didichuxing.com/process/list">http://bpm.didichuxing.com/process/list</a>&nbsp;填写相应申请（国内）】</p>
        <p className="helpdocs-center"><img src={img105} alt="" /></p>
        <p>
          <strong>注意：在【管理员管理】页面中添加各类管理员时，只能将已经存在于【目标子系统】中的用户进行绑定管理员操作。</strong></p>
        <p>
          <strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;如待绑定为管理员的用户不存在于</strong>【目标子系统】
          <strong>，则需要先在【用户管理菜单】中选择对应【目标子系统】进行添加用户后才可以操作绑定。</strong></p>
        <h2>2.&nbsp;系统详情</h2>
        <h3>a.子系统信息修改</h3>
        <p>子系统的相关信息，如下图所示。</p>
        <p className="helpdocs-center"><img src={img107} alt="" /></p>
        <p>SSO APPKEY：BPM中提交接入时会获取</p>
        <p>回调地址：StarGate回调子系统时的地址，其作用详见
          <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=30542962">Web SSO接入流程说明</a>；</p>
        <p>主页地址：子系统的主页；</p>
        <p>样式：一个图标，在权限系统UPM中展示子系统时的图标；</p>
        <p>登陆类型：默认选择SSO登陆。</p>
        <p>&nbsp;</p>
        <h3>b.子系统与业务线的绑定</h3>
        <p>选择待绑定的子系统后，点击&ldquo;业务线&rdquo;按钮后弹出分配业务线选择框，在选择框中可复选多个业务线。</p>
        <p className="helpdocs-center"><img src={img109} alt="" /></p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        {/* </div> */}
      </div>
    );
  }
}

export default connect()(App_cn);
