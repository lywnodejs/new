// 切换整个系统语言的组件

import React from 'react';
import _ from 'lodash';
import { Dropdown, Menu, Icon } from 'antd';
import { translate } from 'react-i18next';
import { syncLanguage } from '../../services/i18n';
import { echoMessage } from '@utils/notice';
import './index.less';

const { Item } = Menu;

// antd的语言包
import zhCN from 'antd/lib/locale-provider/zh_CN';

// 注意保证 key 与 value 的相同
const languageList = {
  zhCN: { label: '中文', value: 'zhCN', antd: zhCN, moment: 'zh-cn' },
  enUS: { label: 'English', value: 'enUS', antd: null, moment: 'en' }
};


class Switcher extends React.Component {

  handleMenuClick = ({ key }) => {
    const { i18n } = this.props;
    const { language } = i18n;

    if (language !== key) {
      i18n.changeLanguage(key);
    }

    // 向后端同步 语言
    syncLanguage(key).catch(error => {
      echoMessage(error.message, 'error');
    }).then(() => {
      window.location.reload();
    });
  };

  getLocaleMenu() {
    return (
      <Menu onClick={this.handleMenuClick} >
        {_.map(languageList, ({ label }, key) =>
          <Item key={key} >{label}</Item>
        )}
      </Menu>
    );
  }

  render () {
    const { i18n } = this.props;
    const { language } = i18n;

    return (
      <Dropdown overlay={this.getLocaleMenu()} >
        <span className="locale-label" >
          {languageList[language].label}
          <Icon type="down" />
        </span>
      </Dropdown>
    );
  }
}

export default translate()(Switcher);

export {
  languageList,
};
