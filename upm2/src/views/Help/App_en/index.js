import React from 'react';
import { connect } from 'dva';
import { Anchor } from 'antd';
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
          </Anchor>
        </div>
        <div className="helpdocs-content">
          <h1>UPM Operation Manual (for applicant)</h1>
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
        </div>
      </div>
    );
  }
}

export default connect()(App_en);
