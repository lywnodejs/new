/*
 * @Author: Meng Hao
 * @Date: 2018-09-12 11:23:57
 * @Last Modified by: Meng Hao
 * @Last Modified time: 2018-09-15 11:41:03
 */
import React,{Fragment} from 'react';
import PermissionList from './'

export default function PermissionValid(props) {
  return (
    <Fragment>
      {/* 0:使用中  30:将要过期  -1:已过期 */}
      <PermissionList expire={0}/>
    </Fragment>
  )
}
