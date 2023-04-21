import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getUserName } from '@/utils/auth';
import { logoutSSO } from '@/utils/api/common';
const User = () => {
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        logoutSSO();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">退出</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button>
        {getUserName()} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default User;
