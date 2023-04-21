import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { getFunctionItem } from '@/utils/api/common';
import { getResponseData } from '@/utils/api/path';
import _ from 'lodash';

type IPermissionButton = {
  permissionUrl: string; // 对应的权限 URL
} & ButtonProps;

/**
 * 权限按钮，根据 URL 确定是否有权限，无权限则不显示
 * @param props
 * @constructor
 */
const PermissionButton = (props: IPermissionButton) => {
  const { permissionUrl, ...elseProps } = props;
  const [hasPermission, setHasPermission] = useState(true);
  useEffect(() => {
    getFunctionItem().then(res => {
      const data = getResponseData(res);
      if (Array.isArray(data)) {
        const foundItem = data.find(item => item.url === permissionUrl);
        if (_.isEmpty(foundItem)) {
          setHasPermission(false);
        }
      }
    });
  }, []);
  return <Button disabled={!hasPermission} {...elseProps}>{props.children}</Button>
  // return hasPermission ? (
  //   <Button {...elseProps}>{props.children}</Button>
  // ) : (
  //     <></>
  //   );
};

export default PermissionButton;
