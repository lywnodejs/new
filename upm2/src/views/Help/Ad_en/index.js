import React from 'react';
import { connect } from 'dva';
import { Anchor } from 'antd';
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
import img037 from './static/image037.png';
import img039 from './static/image039.png';
import img041 from './static/image041.png';
import img043 from './static/image043.png';
import img045 from './static/image045.png';
import img047 from './static/image047.png';
import img049 from './static/image049.png';
import img051 from './static/image051.png';
import img053 from './static/image053.png';
import img055 from './static/image055.png';
import img057 from './static/image057.png';
import img059 from './static/image059.png';
import img061 from './static/image061.png';
import img063 from './static/image063.png';
import img065 from './static/image065.png';
import img067 from './static/image067.png';
import img069 from './static/image069.png';
import img071 from './static/image071.png';
import img073 from './static/image073.png';
import img075 from './static/image075.png';
import img077 from './static/image077.png';
import img079 from './static/image079.png';
import img081 from './static/image081.png';
import img083 from './static/image083.png';
import img085 from './static/image085.png';
import img087 from './static/image087.png';
import img089 from './static/image089.png';
import img091 from './static/image091.png';
import img093 from './static/image093.png';
import img095 from './static/image095.png';
import img097 from './static/image097.png';
import img099 from './static/image099.png';
import img101 from './static/image101.png';
import img103 from './static/image103.png';
import img105 from './static/image105.png';
import img107 from './static/image107.png';
import img109 from './static/image109.png';


import '../style.less';
const { Link } =  Anchor;

class App_en extends React.Component {
  render() {
    return (
      <div className="helpdocs">
        <div style={{width: 240}}>
          <Anchor className="helpdocs-anchor">
            <Link href="#anchor-1" title="System homepage">
              <Link href="#anchor-1-1" title="Page introduction" />
              <Link href="#anchor-1-2" title="Operation guide">
                <Link href="#anchor-1-2-1" title="Apply for new permissions" />
                <Link href="#anchor-1-2-2" title="My application" />
                <Link href="#anchor-1-2-3" title="My approval" />
                <Link href="#anchor-1-2-4" title="My permissions" />
                <Link href="#anchor-1-2-5" title="Gadgets" />
                <Link href="#anchor-1-2-6" title="Management System" />
              </Link>
            </Link>
            <Link href="#anchor-2" title="Function menu">
              <Link href="#anchor-2-1" title="Page introduction" />
              <Link href="#anchor-2-2" title="Operation guide">
                <Link href="#anchor-2-2-1" title="Function management" />
                <Link href="#anchor-2-2-2" title="Function group management" />
              </Link>
            </Link>
            <Link href="#anchor-3" title="Role menu">
              <Link href="#anchor-3-1" title="Page introduction" />
              <Link href="#anchor-3-2" title="Operation guide">
                <Link href="#anchor-3-2-1" title="Role management" />
                <Link href="#anchor-3-2-2" title="Role group management" />
              </Link>
            </Link>
            <Link href="#anchor-4" title="User menu">
              <Link href="#anchor-4-1" title="Page introduction" />
              <Link href="#anchor-4-2" title="Operation guide">
                <Link href="#anchor-4-2-1" title="Add users" />
                <Link href="#anchor-4-2-2" title="Delete users" />
                <Link href="#anchor-4-2-3" title="Find users" />
                <Link href="#anchor-4-2-4" title="User and region binding" />
                <Link href="#anchor-4-2-5" title="User and role binding" />
                <Link href="#anchor-4-2-6" title="User bound to the flag" />
              </Link>
            </Link>
            <Link href="#anchor-5" title="Workflow manage">
              <Link href="#anchor-5-1" title="Page introduction">
                <Link href="#anchor-5-1-1" title="Workflow introduction" />
                <Link href="#anchor-5-1-2" title="Workflow content analysis" />
              </Link>
              <Link href="#anchor-5-2" title="Operation guide">
                <Link href="#anchor-5-2-1" title="Add workflow" />
                <Link href="#anchor-5-2-2" title="Edit workflow" />
                <Link href="#anchor-5-2-3" title="Delete workflow" />
                <Link href="#anchor-5-2-4" title="Enable&Disable workflow" />
                <Link href="#anchor-5-2-5" title="Copy workflow" />
                <Link href="#anchor-5-2-6" title="Workflow priority" />
              </Link>
            </Link>
            <Link href="#anchor-6" title="System manage">
              <Link href="#anchor-6-1" title="Page introduction" />
              <Link href="#anchor-6-2" title="Operation guide">
                <Link href="#anchor-6-2-1" title="Administrator management" />
                <Link href="#anchor-6-2-2" title="System details" />
              </Link>
            </Link>
          </Anchor>
        </div>
        <div className="helpdocs-content">
          <h1>UPM Operation Manual (for admin)</h1>
          <h1 id="anchor-1">1.0 System homepage</h1>
          <hr/>
          <h1 id="anchor-1-1">I、Page introduction</h1>
          <p>As shown in the figure below, there are 7 functions in this menu page</p>
          <p className="helpdocs-center"><img src={img001} alt="" /></p>
          <h1 id="anchor-1-2">II、Operation guide</h1>
          <h2 id="anchor-1-2-1">1. Apply for new permissions</h2>
          <p>Function: Applying permission to the connected subsystem.</p>
          <p>Address: URL address of the permission application：
            <a href="https://upm.didiglobal.com/upm2-static/main/newapply">https://upm.didiglobal.com/upm2-static/main/newapply</a></p>
          <p>Steps: 4 steps in total</p>
          <p className="helpdocs-center"><img src={img003} alt="" /></p>
          <h3>a. Select the target subsystem</h3>
          <p className="helpdocs-center"><img src={img005} alt="" /></p>
          <h3>b1. Select permission type</h3>
          <p>[role]: The collection of permission points is created and maintained by the system administrator.</p>
          <p>[Region]: The area/city dimension involved in the use of rights</p>
          <p>
            <span style={{textDecoration: 'line-through'}}>[signature]</span></p>
          <p className="helpdocs-center"><img src={img007} alt="" /></p>
          <h3>b2. Select the role type</h3>
          <p>[Function role]: For the role established by the individual [permission/function point], it is applicable to the authorization and management of sensitive rights.</p>
          <p>[Post role]: According to the role established by the staff [post/function], it belongs to the collection of [permission/function point] (non-sensitive authority), which is applicable to post authorization and standardization management.</p>
          <p className="helpdocs-center"><img src={img009} alt="" /></p>
          <h3>b3. Select a role</h3>
          <p>Click the character box and pop up the role check box.</p>
          <p className="helpdocs-center"><img src={img011} alt="" /></p>
          <p>Check the desired role and click OK.</p>
          <p className="helpdocs-center"><img src={img013} alt="" /></p>
          <h3>c-d. Submit the reason for the application and submit</h3>
          <p>Click the submit after filling in the reason for the application.</p>
          <p className="helpdocs-center"><img src={img015} alt="" /></p>
          <p>[View Approval Process] button allows you to view the approval flow. After the process application is completed, it will be notified to the immediate superior or the person in charge by email.</p>
          <p className="helpdocs-center"><img src={img017} alt="" /></p>
          <h2 id="anchor-1-2-2">2. My application</h2>
          <p>This application can be performed by the corresponding operation button [Detail] [Copy] [Withdrawal]</p>
          <h3>a. [Details]</h3>
          <p>In [My Application], you can view the relevant application content and progress (as shown below)</p>
          <p className="helpdocs-center"><img src={img019} alt="" /></p>
          <p>[Detail]: You can view the approval flow and progress of the current application.</p>
          <p className="helpdocs-center"><img src={img021} alt="" /></p>
          <h3>b.
            <span style={{textDecoration: 'line-through'}}>[Copy]</span>&amp; [Apply for others]</h3>
          <p>
            <span style={{textDecoration: 'line-through'}}>Click [Copy] and then jump to the application page, and automatically select the same content according to the application content.</span>You can apply for the same content for other users by checking the [Apply for others].</p>
          <p>Remarks: After submitting an application on behalf of another person, [applicant] can not view the approval content of the application, and only through the [applicant] to view it in the system.</p>
          <p className="helpdocs-center"><img src={img023} alt="" /></p>
          <p className="helpdocs-center"><img src={img025} alt="" /></p>
          <h3>c. [Cancel]</h3>
          <p>After the operation, you can voluntarily revoke this application.</p>
          <h2 id="anchor-1-2-3">3. My approval</h2>
          <p>[My Approval] can view the content that needs to be approved for the current login account.</p>
          <p className="helpdocs-center"><img src={img027} alt="" /></p>
          <h2 id="anchor-1-2-4">4. My permissions</h2>
          <p>[My privilege] can view the various privilege roles that the currently logged in user already has, and the action of deleting the privilege can be initiated by the user.</p>
          <p className="helpdocs-center"><img src={img029} alt="" /></p>
          <h2 id="anchor-1-2-5">5. Gadgets</h2>
          <p>Query the corresponding URL and role according to the typed target</p>
          <p className="helpdocs-center"><img src={img031} alt="" /></p>
          <h2 id="anchor-1-2-6">6-7. Management System</h2>
          <p>
            <strong>[Management System] Please refer to the manual 1.2-1.9</strong></p>
          <p>&nbsp;</p>
          <p className="helpdocs-center"><img src={img033} alt="" /></p>
          <p>[System administrator]</p>
          <p className="helpdocs-center"><img src={img035} alt="" /></p>
          <p>&nbsp;[Business Line administrator]</p>
          <p className="helpdocs-center"><img src={img036} alt="" /></p>
          <p>&nbsp;</p>
          <h1 id="anchor-2">1.1 Function menu</h1>
          <h1 id="anchor-2-1">I、Page introduction</h1>
          <p>Through this page, the function management of the subsystem can be performed. The page is mainly divided into two parts, the left side shows [function list] (permission structure) for easy point management, and the right side is [details] for correspondingly editing.</p>
          <p>This page can add, delete, edit individual function points, or upload edited templates, add function points in batches, and modify function points in batches.</p>
          <p>Restrictions on function of frequency can be used.</p>
          <p className="helpdocs-center"><img src={img037} alt="" /></p>
          <h1 id="anchor-2-2">II、Operation guide</h1>
          <h2 id="anchor-2-2-1">1. Function management</h2>
          <h3>1.1 Add a single function point</h3>
          <p>Create [Permission Structure] and [Permission Point] configuration by clicking the [Add Root Node] and [Add Sub-node to Selected Nodes] buttons on the page.</p>
          <p>As shown below:</p>
          <p>Picture 1</p>
          <p className="helpdocs-center"><img src={img039} alt="" /></p>
          <p>Picture 2</p>
          <p className="helpdocs-center"><img src={img041} alt="" /></p>
          <p>a: You can add the [Function Name] language of the currently edited node through the language bar [English] [Portugu&ecirc;s] [espa&ntilde;a] [Japanese] (Figure 2)</p>
          <p>Note: In the language selection page of the UPM system page, if the [function name] corresponding to [Language] is entered in the permission point in the structure tree, it will be consistent with the page language selection. Currently, [English] switching is supported.</p>
          <p>b: [Function name] Fill in the [Function Name] of the permission point. You can add a multi-language input box through [a] to perform multi-language identification.</p>
          <p>c: [Corresponding URL] fill in the URL corresponding to the function, which needs to be confirmed by the developer.</p>
          <p>d: [Note] Remarks permission point information for future maintenance</p>
          <p>e: [Yes/No Menu] Select whether to create a menu for the permission, menu permission, Y, non-menu permission, select N</p>
          <p>f: [Parent node] Select the level at which the node is created in the left structure. The default is level 0.</p>
          <p>After the corresponding configuration, click [Save] to complete the created permission point.&nbsp;</p>
          <h3>1.2 Add function points in batches</h3>
          <p>It should be noted that the batch addition needs to download the template added in batches, enter the function to be added in the template file, and then upload the template file to complete the addition.</p>
          <p>As shown in the figure below, when you move the mouse to the &ldquo;Bulk Add&rdquo; button, the button shown in the red box will appear above, click &ldquo;Upload Template Download&rdquo; to download the upload template.</p>
          <p className="helpdocs-center"><img src={img043} alt="" /></p>
          <h3>1.3 Modifying function points in batches</h3>
          <p>Click on the "Modify Template Download" button after clicking the "Batch Edit" button as shown below.</p>
          <p className="helpdocs-center"><img src={img045} alt="" /></p>
          <h3>1.4 Delete function points</h3>
          <p>Select the corresponding function point in the function list on the left side of the page and click the delete button to confirm.</p>
          <h3>1.5 Edit function points</h3>
          <p>On the left [Permission Structure Display] area, select the function points that need to be edited.</p>
          <p>In the [Detailed Edit] on the right, modify the content and click [Save].&nbsp;</p>
          <h3>1.6 Frequency limit</h3>
          <p>After selecting the function point to be set on the left side, click the [Frequency Limit] button on the right side to set the frequency in the pop-up page.</p>
          <p className="helpdocs-center"><img src={img047} alt="" /></p>
          <p>
            <strong>Remarks: [Restricted person] The restriction for not adding an account is a unified restriction. If you add an account and add it, you can set a separate limit for the corresponding account.</strong></p>
          <p className="helpdocs-center"><img src={img049} alt="" /></p>
          <h2 id="anchor-2-2-2">2. Function group management</h2>
          <p>Can bind multiple functions to one function group (omitted)</p>
          <h1 id="anchor-3">1.2 Role menu</h1>
          <h1 id="anchor-3-1">I、Page introduction</h1>
          <p>This page management role and role group；</p>
          <p>Also management the relationship between role and function point;</p>
          <p>Can add、edit、delete roles,also can edit the user bound under the role；</p>
          <p>Edit the relationship between role and function point, and relationship with users;</p>
          <p className="helpdocs-center"><img src={img051} alt="" /></p>
          <h1 id="anchor-3-2">II、Operation guide</h1>
          <h2 id="anchor-3-2-1">1.&nbsp;Role management</h2>
          <h3>1.1 Add new roles</h3>
          <p>【
            <strong>note：After adding roles need to send email to RD ,the RD will add national attribute with role in the Global UPM】</strong></p>
          <p>Add new roles：[Role identification] and [Role name] are required，description is optional。Role identification is system unique,can&rsquo;t repeat,can&rsquo;t edit.After add a language in the language selection bar,the role name will add a new language entry bar.</p>
          <p className="helpdocs-center"><img src={img053} alt="" /></p>
          <p>a:We can add the new create role name English language by the language bar.</p>
          <p>[Portugu&ecirc;s][Espa&ntilde;a][Japanese]as(Image 2)</p>
          <p>b:Role identification,system unique,can&rsquo;t repeat,can&rsquo;t edit.</p>
          <p>c:Role name,can be edit.</p>
          <p>d:Character description,fill in the note can be easy to maintain.</p>
          <p>(Picture 2)</p>
          <p className="helpdocs-center"><img src={img055} alt="" /></p>
          <p>&nbsp;</p>
          <h3>1.2 Bind function for role</h3>
          <p>Click the [Functional allocation] in the role management menu, choose the permission for the role in the pop-up window，and then click save button.</p>
          <p className="helpdocs-center"><img src={img057} alt="" /></p>
          <p className="helpdocs-center"><img src={img059} alt="" /></p>
          <p>a:We can find permission point by index bar.</p>
          <p>b:Select the [permission point] for the [role].</p>
          <p>c:See the selected [permission point].</p>
          <p>d:Click save button to complete distribution.&nbsp;</p>
          <h3>1.3 Binding users in the roles</h3>
          <p>&nbsp;</p>
          <p>Click the [User binding] in the role management menu, and enter full account number in the pop-up window，and then binding related users.</p>
          <p>&nbsp;(Picture 1)</p>
          <p className="helpdocs-center"><img src={img061} alt="" /></p>
          <p>(Picture 2)</p>
          <p className="helpdocs-center"><img src={img063} alt="" /></p>
          <p>(Picture 3)</p>
          <p className="helpdocs-center"><img src={img065} alt="" /></p>
          <h3>
            <span style={{textDecoration: 'line-through'}}>1.4 Binding role group（not suggested）</span></h3>
          <p>Click the [role group] in the role management menu，choose in the pop-up window，and then click save button.</p>
          <h2 id="anchor-3-2-2">
            <span style={{textDecoration: 'line-through'}}>2. Role group management（not suggested）</span></h2>
          <h3>
            <span style={{textDecoration: 'line-through'}}>2.1 Add new role group</span></h3>
          <p>Click add button for role group.The role group identification and role group name is required, can&rsquo;t repeat.&nbsp;</p>
          <h3>
            <span style={{textDecoration: 'line-through'}}>2.2 Binding role</span></h3>
          <p>Click the [role] in the role management menu，choose in the pop-up window，and then click save button.</p>
          <h1 id="anchor-4">1.3 User menu</h1>
          <h1 id="anchor-4-1">I、Page introduction</h1>
          <p>[User Manage] page is used for two types of users</p>
          <ol>
            <li>Basic operations are used to add, delete, and query accounts (can&rsquo;t edit user&rsquo;s account)</li></ol>
          <p>Have to be aware of is，user data in the UPM is synchronized from the SSO system (StarGate),so user can&rsquo;t edit,only can [Add][Delete][Look over]</p>
          <p>2.Can use [Copy][Delete][Regional Binding][Flag][Role Assignments] to configuration;</p>
          <p>At present, user permission are mainly achieved through distribution [area]&amp;[role] to fulfill; And the [flag] not used in China, currently used [Strategy/ Dimension] to fulfill</p>
          <p className="helpdocs-center"><img src={img067} alt="" /></p>
          <p>&nbsp;</p>
          <h1 id="anchor-4-2">II、Operation guide</h1>
          <h2 id="anchor-4-2-1">
            <strong>1. Add users</strong></h2>
          <p className="helpdocs-center"><img src={img069} alt="" /></p>
          <p>Click the [Add a user] button, a [Add] dialog box will pop up (as shown below), enter the user name you want to add in the dialog box(mailbox prefix), it should be noted that the new user account must be the company's existing employee information.</p>
          <p>When the addition is complete, the user account and the subsystem complete the binding relationship, you can see the new user information under the subsystem.</p>
          <p className="helpdocs-center"><img src={img071} alt="" /></p>
          <h2 id="anchor-4-2-2">
            <strong>2. Delete users</strong></h2>
          <p>Completed in four steps:</p>
          <p>1 Select target system；</p>
          <p>2 Enter the account you need to delete；</p>
          <p>3 View found user information；</p>
          <p>4 Click the delete button.</p>
          <p>Same as add user,the user info not deleted from the UPM,just unbind the relationship with user and subsystem.</p>
          <p>As follows,after delete the user from [专车MIS], unbind the relationship with user and [专车MIS].</p>
          <p className="helpdocs-center"><img src={img073} alt="" /></p>
          <h2 id="anchor-4-2-3">
            <strong>3. Find users</strong></h2>
          <p>We can use the account、name and email to find user, support fuzzy query.</p>
          <h2 id="anchor-4-2-4">
            <strong>4. User and region binding</strong></h2>
          <p>To find the user who needs to be configured in the target system, and then click the [Regional binding page] in the menu to configuration.</p>
          <p className="helpdocs-center"><img src={img075} alt="" /></p>
          <p className="helpdocs-center"><img src={img077} alt="" /></p>
          <p>a.Slect the [area] content in the area list;</p>
          <p>b.Check the selected area is correct；</p>
          <p>c.Click save button；</p>
          <h2 id="anchor-4-2-5">
            <strong>5. User and role binding</strong></h2>
          <p>Find the user who needs to be configured in the [User Management] page.</p>
          <p>Click the [Role Assignment] button to configuration in the pop-up page.</p>
          <p className="helpdocs-center"><img src={img079} alt="" /></p>
          <p>
            <strong>After clicking in the character box, select the role you want to bind to the user in the drop-down page and click submit, after the page prompts successfully, it will automatically jump to [User Management] page.</strong></p>
          <p>
            <strong>Subsystems with more roles can use Chrome lookup(Shift+F) to implement a simple query</strong></p>
          <p className="helpdocs-center"><img src={img081} alt="" /></p>
          <p>The permission default expired time is 1 year,we can edit expired time after choose the role.</p>
          <p className="helpdocs-center"><img src={img083} alt="" /></p>
          <p>&nbsp;</p>
          <h2 id="anchor-4-2-6">
            <strong>
              <span style={{textDecoration: 'line-through'}}>6. User bound to the flag</span></strong>
            <strong>
              <span style={{textDecoration: 'line-through'}}>（not used）</span></strong>
          </h2>
          <p>Eg</p>
          <p>&nbsp;</p>
          <h1 id="anchor-5">1.4 Workflow manage</h1>
          <h1 id="anchor-5-1">I、Page introduction</h1>
          <p>The workflow management page is the management of the target system and the application process.</p>
          <p>Can manage the workflow,by [Add] [Modify] [Delete] [Enable/Disable] for the workflow.</p>
          <p>Achieve online automation from user application to approval</p>
          <h2 id="anchor-5-1-1">1.&nbsp;Workflow introduction</h2>
          <h3>1.1 What is the workflow?</h3>
          <p>The workflow is the approval process that the user needs to apply for permission.</p>
          <p>When the user initiates an application，approval process is required to be performed by the set approval process.</p>
          <p>Approval by entering the next node, approval does not pass the direct rejection of user application.</p>
          <h3>1.2 Why we need have an workflow？</h3>
          <p>Workflow is for the convenience of users to obtain permissions.</p>
          <p>You can get permission after the approver [approval].</p>
          <p>Increase the efficiency of application authorization，also the application record is saved in the system for traceability.</p>
          <h3>1.3 How can we use workflow？</h3>
          <p>By creating an approval process in the management system. Select the corresponding attribute. When the user approves the corresponding attribute after the approval flow is enabled, the system performs the requested node by the set approval process.</p>
          <h2 id="anchor-5-1-2">2.&nbsp;Workflow content analysis</h2>
          <p>The workflow is divided into [workflow information] and [approvor node]</p>
          <p>The workflow information includes [workflow type (permission type)] [associated attribute (specific authority)] [status (enabled status)]</p>
          <p>Approver node contains [Approver Type (Approver Name)].</p>
          <p>A workflow can be approved by multiple approver nodes.</p>
          <h1 id="anchor-5-2">II、Operation guide</h1>
          <h2 id="anchor-5-2-1">1.Add workflow</h2>
          <p>The workflow configuration requires the [Subsystem Administrator] permission.</p>
          <p>Enter the workflow management menu, Select the target system that needs to be managed. The following figure takes [misp] as an example.</p>
          <p className="helpdocs-center"><img src={img085} alt="" /></p>
          <p>After selecting the target system, click [Add workflow]</p>
          <p>Click the Add Workflow button to configure the workflow in the pop-up page.</p>
          <p className="helpdocs-center"><img src={img087} alt="" /></p>
          <p className="helpdocs-center"><img src={img089} alt="" /></p>
          <p>a: Type the workflow name</p>
          <p>b: Select [Workflow Type] which includes:[role] [business line] [region] etc.</p>
          <p>c: Select the associated attribute, [Associated Attributes] is the specific content of [Approval Flow Type]; Select a role like type，Then the associated attributes can be selected in the associated attributes.</p>
          <p>d: Increase the approval level by adding approval nodes</p>
          <p>Select [Node Properties]</p>
          <p>Physical superior: physical superior in the HR system.</p>
          <p>Fixed interface person: You can enter the account of the designated person (mailbox prefix).</p>
          <p>Fixed interface person list: Multiple people can be entered, separated by commas.</p>
          <p>After the configuration is complete, click Confirm to see the created workflow on the workflow page.</p>
          <p className="helpdocs-center"><img src={img091} alt="" /></p>
          <h2 id="anchor-5-2-2">2.Edit workflow</h2>
          <p>※Modifying the workflow currently in use will invalidate some of the applications that have already been generated. Please be cautious!</p>
          <p>Click the edit button corresponding to the entry</p>
          <p>Same as add workflow，modify the corresponding attribute</p>
          <p className="helpdocs-center"><img src={img093} alt="" /></p>
          <h2 id="anchor-5-2-3">3.Delete workflow</h2>
          <p>&nbsp;Click the delete button corresponding to the list item.</p>
          <p className="helpdocs-center"><img src={img095} alt="" /></p>
          <h2 id="anchor-5-2-4">4.Enable&amp;Disable workflow&nbsp;</h2>
          <p>&nbsp;Click the enable&amp;disable button corresponding to the list item.</p>
          <p className="helpdocs-center"><img src={img097} alt="" /></p>
          <h2 id="anchor-5-2-5">5.Copy workflow</h2>
          <p>Can currently select the item as the base data,open a create page(Automatically populate the selected item data).</p>
          <p>Click save button to create a new workflow data.</p>
          <h2 id="anchor-5-2-6">6.Workflow priority</h2>
          <table>
            <tbody>
              <tr>
                <td width="56">
                  <p>Workflow</p>
                  <p>Type</p>
                </td>
                <td width="53">
                  <p>
                    <strong>Hit scene</strong></p>
                </td>
                <td width="305">
                  <p>
                    <strong>priority</strong></p>
                </td>
              </tr>
              <tr>
                <td width="56">
                  <p>role</p>
                </td>
                <td width="53">
                  <p>Application role</p>
                </td>
                <td width="305">
                  <p>Workflow flow type is role + associated attribute is the Workflow of role id &gt; a Workflow type is role + associated attribute is all Workflow &gt; all default &gt; global default (superior -&gt; subsystem administrator)</p>
                </td>
              </tr>
              <tr>
                <td width="56">
                  <p>area</p>
                </td>
                <td width="53">
                  <p>Application area</p>
                </td>
                <td width="305">
                  <p>The approval flow with the approval flow type is the region + association attribute is the area id &gt; the approval flow type is the area + the associated attribute is the approval flow for all &gt; the approval flow type is the service line area + the associated attribute is the approval flow of the service line id corresponding to the area id &gt;Approval flow type is line of business area + associated attribute is all approval flow &gt; all default &gt; global default (superior -&gt; subsystem administrator)</p>
                </td>
              </tr>
              <tr>
                <td width="56">
                  <p>Flag</p>
                </td>
                <td width="53">
                  <p>Application mark</p>
                </td>
                <td width="305">
                  <p>The approval flow type is the identification bit + the associated attribute is the approval flow of the identification bit id &gt; the approval flow type is the identification bit + the associated attribute is all the approval flow &gt; all default &gt; global default (superior -&gt; subsystem administrator)</p>
                </td>
              </tr>
              <tr>
                <td width="56">
                  <p>ALL</p>
                </td>
                <td width="53">
                  <p>Application role, region, logo</p>
                </td>
                <td width="305">
                  <p>Higher than global, lower than all others</p>
                </td>
              </tr>
              <tr>
                <td width="56">
                  <p>Global</p>
                </td>
                <td width="53">
                  <p>Application role, region, logo</p>
                </td>
                <td width="305">
                  <p>The lowest, if no hit, use this rule</p>
                </td>
              </tr>
            </tbody>
          </table>
          <p>&nbsp;</p>
          <h1 id="anchor-6">1.5 System manage</h1>
          <h1 id="anchor-6-1">I、Page introduction</h1>
          <p>The page is divided into two parts；</p>
          <p>a: Administrator management: Perform system administrator management of the target system；[Global Super Administrator]＞[Subsystem Super Administrator]＞[Subsystem Administrator]＞[Small Privilege Administrator]</p>
          <p>[Global Super Administrator]：[Global Super Administrator] can authorize management to [Subsystem Super Administrator] and other users.</p>
          <p>[Subsystem Super Administrator]：The [super administrator] of the target system can operate the authorization management to the [subsystem administrator] and other users.</p>
          <p>[Subsystem Administrator]:[Administrator] of the target system can perform operation management to [User]</p>
          <p>[Small Privilege Administrator]：The administrator who obtains the permission by himself; only can authorize the rights owned by [user]</p>
          <p>[Big Data Line Manager]:Independent of the above administrators，Service line administrators who report only for big data needs</p>
          <p>b: System details：Operate the subsystem information accessing the UPM, Completion / modification [binding business line]</p>
          <p className="helpdocs-center"><img src={img099} alt="" /></p>
          <h1 id="anchor-6-2">II、Operation guide</h1>
          <h2 id="anchor-6-2-1">1.Administrator management</h2>
          <p>Administrator management is used to set the binding relationship between the user and the target subsystem, set the user binding to the administrator of the target subsystem.</p>
          <p>There are two steps as follows：</p>
          <h3>a.Select the target subsystem</h3>
          <p className="helpdocs-center"><img src={img101} alt="" /></p>
          <h3>b.User binding to subsystem</h3>
          <p>Set the user liuxingtong to misp [subsystem super administrator] as an example. As shown below, first click the [Subsystem Super Administrator] button to open the dialog box that pops up the user.</p>
          <p>Enter the username(liuxingtong) on the bind user dialog,click the [Bind User] button</p>
          <p className="helpdocs-center"><img src={img103} alt="" /></p>
          <p>Description: The addition and modification of the administrator role (as shown in the following figure) needs to be contacted by the UPM system administrator.</p>
          <p>[Login
            <a href="http://bpm.didichuxing.com/process/list">http://bpm.didichuxing.com/process/list</a>to fill in the corresponding application(internal)]</p>
          <p className="helpdocs-center"><img src={img105} alt="" /></p>
          <p>N
            <strong>otice</strong>:
            <strong>When adding various administrators to the [Administrator Management] page</strong>,o
            <strong>nly users who already exist in the [Target Subsystem] can be bound to the administrator.</strong></p>
          <p>
            <strong>If the user to be bound as an administrator does not exist in the [target subsystem]</strong>,y
            <strong>ou need to select the corresponding [target subsystem] in the [User Management Menu] to add the user before you can operate the binding.</strong></p>
          <h2 id="anchor-6-2-2">2.System details</h2>
          <h3>a. Subsystem information modification</h3>
          <p>The relevant information of the subsystem is shown in the figure below.</p>
          <p className="helpdocs-center"><img src={img107} alt="" /></p>
          <p>SSO APPKEY：Will get when you submit your access in BPM</p>
          <p>Callback address：When StarGate calls back the subsystem，for details, see the
            <a href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=30542962">Web SSO Access Process Description</a>.</p>
          <p>Home address：Subsystem home page；</p>
          <p>Style：An icon, when displaying subsystems in UPM；</p>
          <p>Login type：Default SSO login.</p>
          <h3>b. Binding of subsystems to business lines</h3>
          <p>After selecting the subsystem to be bound，clicking the "Business Line" button, the distribution service line selection box pops up, multiple business lines can be selected in the selection box.</p>
          <p className="helpdocs-center"><img src={img109} alt="" /></p>
        </div>
      </div>
    );
  }
}

export default connect()(App_en);
