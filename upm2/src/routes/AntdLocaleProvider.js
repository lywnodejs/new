/*
 * @Author: GuoTeng
 * @Date: 2020-09-22 11:02:49
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-09-22 16:03:56
 */
/**
 * 对antd的LocaleProvider进行封装
 * 使当i18n的语言变化时，可以同时变更antd的locale
 */

import React from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';

import { LocaleProvider, ConfigProvider } from 'antd';
import { languageList } from '../i18n/Switcher';

class AntdLocaleProvider extends React.Component {
  render() {
    const { i18n } = this.props;
    const { language } = i18n;

    let locale = null;

    const lang = languageList[language];
    if (!_.isEmpty(lang)) {
      locale = lang.antd;
      // 切换moment的语言
      moment.locale(lang.moment);
    }

    return (
      <ConfigProvider locale={locale}>{this.props.children}</ConfigProvider>
    );
  }
}

export default translate()(AntdLocaleProvider);
