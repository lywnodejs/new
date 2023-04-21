/**
 * 角色配置页面
 * by wujianjian
 */
import React from 'react';
import _ from 'lodash';
import { isOversea } from '@config/env';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Select, Tooltip, Icon } from 'antd';
import languageList from '@assets/commonData/languageList';
import LanguageInputList from '@components/LanguageInputList';
import { debug } from 'util';
import { PubSub } from 'pubsub-js';

const FormItem = Form.Item;
const Option = Select.Option;
// const availableRiskLevel = ['P1', 'P2', 'P3', 'P4'];

let isDeletedLanguage = false,
  deleteIndex, languageSelectValue;

/**
 * 编辑页面
 * @param {*} props
 */
class RoleEdit extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.appId !== this.props.appId && nextProps.appId) {
      this.props.dispatch({
        type: 'role/fetchAllRolelabelList',
        payload: {
          appId: nextProps.appId
        }
      });
    }
  }
  componentDidMount () {
    if (this.props.appId) {
      this.props.dispatch({
        type: 'role/fetchAllRolelabelList',
        payload: {
          appId: this.props.appId
        }
      });
    }
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const { form, handleOk, oper } = this.props;

    // 更新数据之后关闭模态框
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { id } = this.props.role;
        let { description, name, languageSelectValue, dimeNodeId, riskLevel, labelIds, isApplicable } = values;
        let langNameList = [];

        languageSelectValue.map((item, i) => {
          langNameList.push({
            lang: item,
            name: values['languageItem_' + (i + 1)]
          });
        });

        let dispathType = this.props.oper === 'create' ? 'role/createRole' : 'role/updateRole';
        // 复制角色
        if (oper === 'copy') {
          dispathType = 'role/copyRole';
        }

        const payload = {
          appId: this.props.appId,
          nameZh: values.languageItem_0,
          id,
          name,
          description,
          langNameList,
          dimeNodeId,
          riskLevel,
          labelIds,
          isApplicable
        };
        // 复制角色
        if (oper === 'copy') {
          //   payload.sensiLevel = 'P4'; // 敏感级别
          payload.srcRoleId = id;
        }

        this.props.dispatch({
          type: dispathType,
          payload
        }).then((data) => {
          handleOk();
        });
      }
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  renderDimension = () => {//生成多语言select
    const { t } = this.props;

    return languageList.map(language => {
      return (
        <Select.Option key={language.lang} value={language.lang}>{t(language.name)}</Select.Option>
      );
    });
  }

  onLanguageChange = langList => {//多语言设置框change事件
    const { role, form, oper } = this.props;
    const isCreated = oper === 'create';
    let { langNameList } = role;

    langNameList = isCreated ? [] : (langNameList || []);
    let chineseName = langNameList.find(item => item.lang === 'zh');
    let list = [{
      lang: 'zh',
      name: isCreated ? form.getFieldValue('languageItem_0') : (chineseName ? chineseName.name : ''),
      placeholder: '中文'
    }];

    let step = 0;
    langList.map((lang, i) => {
      if (isDeletedLanguage && deleteIndex === i) {
        step++;
      }
      const temp = langNameList.find(item => item.lang == lang);
      const placeholder = languageList.find(item => item.lang == lang).name;
      const itemLang = form.getFieldValue('languageItem_' + (i + 1 + step));
      list.push({
        lang: lang,
        name: isCreated ? itemLang : (temp ? temp.name : itemLang || ''),
        placeholder: placeholder
      });
    });

    languageSelectValue = langList;

    form.setFieldsValue({
      languageSelectValue
    });

    isDeletedLanguage = false;

    PubSub.publish('languageChange', list);
  }

  /*
  * select删除语言事件先于change事件，用来记录被删的index
  */
  onDeselect = (value) => {
    deleteIndex = languageSelectValue.findIndex(item => item === value);
    isDeletedLanguage = true;
  }

  getPopupContainer = () => document.querySelector('.ant-modal-body')

  render () {
    const { t, roleDimeList, form, languageList, oper, role, allRolelabelList } = this.props;
    const { getFieldDecorator } = form;
    const required = { required: true, message: t('必填') };
    const isCreated = oper === 'create';
    // 复制角色
    const isCopy = oper === 'copy';
    let { name, description, dimeNodeId, nameZh, riskLevel, availableRiskLevel, labels, isApplicable } = role;
    let labelIds = labels.map(item => item.id);
    if (JSON.stringify(labelIds) === '[0]') {
      labelIds = [];
    }
    let initialValue = [],
      langNameList = isCreated ? [] : (this.props.role.langNameList || []);

    if (!isCreated) {
      const zhIndex = langNameList.findIndex(item => item.lang === 'zh');
      if (zhIndex > -1) {//防止有些旧数据中含有中文的设置
        langNameList.splice(zhIndex, 1);
      }
      langNameList.map((language, i) => {
        language.placeholder = languageList.find(item => item.lang === language.lang).name;
        initialValue.push(language.lang);
      });
    } else {
      name = '';
      description = '';
      dimeNodeId = '';
      nameZh = '';
      riskLevel = '';
      isApplicable = '';
      availableRiskLevel = ['C1', 'C2', 'C3', 'C4'];
    }
    langNameList.unshift({
      lang: 'zh',
      name: nameZh,
      placeholder: '中文'
    });

    let modalTitle = isCreated ? t('创建角色') : t('编辑角色');
    if (isCopy) {
      modalTitle = t('复制角色');
    }
    const getRiskLevelTilte = () => {
      return (
        <span>
          {t('敏感级别')}
          <Tooltip title={t('注意：敏感级不能低于所含功能点、标识位的最高敏感级')}>
            &nbsp;<Icon style={{color: 'rgba(0,0,0,.6)'}} type="info-circle" />&nbsp;
          </Tooltip>
        </span>
      )
    }

    return (
      <Modal
        title={modalTitle}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loading}
            onClick={this.handleOk}
          >
            {t('确定')}
          </Button>
        ]}
      >
        <FormItem label={t('输入语言')}>
          {getFieldDecorator('languageSelectValue', {
            initialValue: initialValue
          })(<Select mode="multiple"
            style={{ width: '100%' }}
            placeholder={t('选择输入的语言')}
            onChange={this.onLanguageChange}
            getPopupContainer={this.getPopupContainer}
            onDeselect={this.onDeselect}
          >
            {this.renderDimension()}
          </Select>)}
        </FormItem>
        <FormItem label={t('角色标识')} required={true}>
          {getFieldDecorator('name', {
            rules: [
              { disabled: !isCreated },
              { required: true }
            ],
            initialValue: name
          })(<Input placeholder={t('角色标识')} disabled={!isCreated && !isCopy} />)}
        </FormItem>
        <LanguageInputList
          form={form}
          value={langNameList}
          title={t('角色名称')}
        />
        <FormItem label={t('角色描述')} >
          {getFieldDecorator('description', {
            rules: [
              { required: true }
            ],
            initialValue: description
          })(<Input placeholder={t('角色描述')} />)}
        </FormItem>
        {/* <FormItem label={t('敏感级别')} required={true}> */}
        <FormItem label={getRiskLevelTilte()}>
          {getFieldDecorator('riskLevel', {
            rules: [
              { required: true }
            ],
            initialValue: riskLevel || '',
            // rules: [required]
          })(
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              style={{ width: '100%' }}
            // disabled={isCopy}
            >
              <Option value="">{t('请选择')}</Option>
              {availableRiskLevel && availableRiskLevel.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label={t('可申请')}>
          {getFieldDecorator('isApplicable', {
            rules: [
              { required: true }
            ],
            initialValue: isApplicable >= 0 ? isApplicable : '',
            // rules: [required]
          })(
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              style={{ width: '100%' }} disabled={isCopy}>
              <Option value="">{t('请选择')}</Option>
              {[{ value: 1, name: '是' }, { value: 0, name: '否' }].map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label={t('角色分类')} >
          {getFieldDecorator('labelIds', {
            initialValue: labelIds || []
          })(
            <Select
              mode="multiple"
              placeholder={t('角色分类')}
              allowClear
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              {/* <Select.Option key={0} value={0} >{t('默认')}</Select.Option> */}
              {_.map(allRolelabelList, ({ id, name }) =>
                <Select.Option key={id} value={id} >{name}</Select.Option>
              )}
            </Select>
          )}
        </FormItem>

        {isOversea && <FormItem label={t('国家')} >
          {getFieldDecorator('dimeNodeId', {
            initialValue: dimeNodeId
          })(
            <Select
              placeholder={t('国家')}
              allowClear
              style={{ width: '100%' }}
              getPopupContainer={this.getPopupContainer}
            >
              {_.map(roleDimeList, ({ id, dimeNodeName }) =>
                <Select.Option key={id} value={id} >{dimeNodeName}</Select.Option>
              )}
            </Select>
          )}
        </FormItem>}

        {/* 复制角色 */}
        {/* {isCopy ? (
          <FormItem label={t('敏感级别')} >
            {getFieldDecorator('sensitivityLevel', {
              initialValue: 'P4',
              rules: [
                {required: true}
              ],
            })(<Input placeholder={t('敏感级别')} disabled />)}
          </FormItem>
        ) : null} */}

      </Modal>
    );
  }
}

const RoleEditPage = Form.create({})(RoleEdit);

export default connect(({ role, global }) => {
  return {
    role: role.role,
    roleDimeList: role.roleDimeList,
    allRolelabelList: role.allRolelabelList,
    appId: global.managingAvailableApp,
    languageList: languageList,
  };
})(RoleEditPage);
