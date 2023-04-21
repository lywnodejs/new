import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/es/button';
import _ from 'lodash';

type IPermissionButton = {
  disabled: boolean,
  title?: string,
  text: string,
  placement?: string,
} & ButtonProps;

/**
 * 权限按钮，根据 URL 确定是否有权限，无权限则不显示
 * @param props
 * @constructor
 */
const TooltipPermissionBtn = (props: IPermissionButton) => {
  const { title, text, placement, ...elseProps } = props;


  return (
    <Tooltip placement={placement || "top"} title={title || '如需权限，请联系当前管理员进行添加，成为合作方管理员后您将可以维护当前合作方的账号职责'}>
      <Button
        {...elseProps}
      >
        {text}
      </Button>
    </Tooltip>
  )
};

export default TooltipPermissionBtn;
