import React,{Fragment} from 'react';
import PermissionList from './'

export default function PermissionValid(props) {
  return (
    <Fragment>
      {/* 0:使用中  30:将要过期  -1:已过期 */}
      <PermissionList expire={30}/>
    </Fragment>
  )
}