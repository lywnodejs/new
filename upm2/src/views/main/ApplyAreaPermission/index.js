import React from 'react';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Input, Button, Row, Col, Modal, Checkbox } from 'antd';
import moment from 'moment';
import ContentCard from '../../../components/ContentCard';

import './index.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 18 },
  }
};

import InputTreeTag from '../../../components/InputTreeTag';

const initState = {
  businessId: '',
  areas: [], // 已有地区
  newAreas: {}, // 新申请的地区
  applyType: 1 // type 2 代他人申请
};

const REG_businessId = /businessId=([^\&]+)/;
const REG_areaList = /areaList=([^\&]+)/;

class ApplyAreaPermission extends React.Component {
  state = initState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.areas) {
      if (!_.isEqual(this.props.areas, nextProps.areas)) {
        // 有 props 更新
        this.setState({
          areas: nextProps.areas.map((area) => area.id)
        });
      }
      // else {
      //   // 没有更新
      //   if (!_.isEqual(this.props.areas, this.state.areas)) {
      //
      //   }
      // }
    }
  }

  componentDidMount() {
    const { location: { search }, form } = this.props;
    if (REG_businessId.test(search)) {
      const businessId = search.match(REG_businessId)[1];
      this.handleBusinessChange(businessId);

      form.setFieldsValue({
        businessLine: +businessId
      });
    }
    if (REG_areaList.test(search)) {
      const areaList = search.match(REG_areaList)[1].split(',');
      let newAreas = {}
      areaList.map(item => {
        newAreas[item] = true
      })
      this.setState({
        newAreas
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'applyArea/reset'
    });
  }

  onFormChange = (id, value) => {
    const { dispatch, match, params } = this.props;
    const { roleId } = match.params;
    const oldValue = params.strategy[roleId];

    dispatch({
      type: 'newApply/updateParamStrategy',
      payload: {
        [roleId]: {
          ...oldValue,
          [id]: value,
        },
      }
    });
  };

  onSave = () => {
    this.props.history.goBack();
  };

  handleAreasChange = (newAreas) => {
    this.setState({
      areas: newAreas
    });
  };

  handleBusinessChange = (businessId) => {
    const { appId } = this.props.match.params;
    this.props.dispatch({
      type: 'applyArea/getAreas',
      payload: {
        appId,
        businessId
      }
    });
    this.setState({
      businessId,
      newAreas: {}
    });
  };

  handleNewAreaChange = (area) => {
    this.setState({
      newAreas: area
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      match,
      userInfo,
      form,
      dispatch,
    } = this.props;
    const { appId } = match.params;
    const { businessId, newAreas, applyType } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const {
        expireTime,
        remark,
        userNames
      } = fieldsValue;

      dispatch({
        type: 'applyArea/applyNewArea',
        payload: {
          appId,
          businessId,
          roles: [...Object.keys(newAreas)].map((areaId) => ({
            refId: areaId,
            type: 4
          })),
          expireTime: expireTime.valueOf(),
          remark,
          type: applyType,
          userNames: applyType === 1 ? [userInfo.username] : userNames.split(',')
        }
      }).then(() => {
        // 跳转到申请页
        form.resetFields();
        this.setState(initState);
        dispatch(
          routerRedux.push('../apply'),
        );
        dispatch({
          type: 'applyArea/reset'
        });
      });
    });
  };

  handleTypeChange = (event) => {
    this.setState({
      applyType: event.target.checked ? 2 : 1
    });
  };

  handleCancel = () => {
    const { t, dispatch } = this.props;
    confirm({
      title: t('确定取消？'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => dispatch(routerRedux.push('../apply'))
    });
  };

  render() {
    const {
      match,
      allBusiness,
      allAreas,
      areaIdMap,
      userInfo,
      form,
      t,
    } = this.props;
    const { getFieldDecorator } = form;
    const { businessId, areas, newAreas, applyType } = this.state;

    return (
      <ContentCard className="apply-area-page" title={t('申请地区权限')}>
        <p><span style={{color: 'rgb(255, 0, 0)'}}>{t('【实时监控】地区权限申请，请跳转到')}</span>：<a href="http://upm.xiaojukeji.com/index.html#/apply/apply?id=6468" target="_blank">http://upm.xiaojukeji.com/index.html#/apply/apply?id=6468</a></p>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={t('业务线') + ':'}
          >
            {getFieldDecorator('businessLine', {
              rules: [{
                required: true,
                message: t('请选择子产品')
              }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                onChange={this.handleBusinessChange}
                style={{width: '100%'}}
              >
                {allBusiness.map((bus) => (
                  <Option
                    key={bus.id}
                    value={bus.id}
                  >
                    {bus.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <div className="applicant">
            <Row>
              <Col span={16}>
                {applyType === 1 ? (
                  <FormItem
                    {...formItemLayout1}
                    label={t('申请人')}
                  >
                    <Input value={`${userInfo.username}(${userInfo.usernameZh})`} disabled/>
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout1}
                    label={t('申请人：')}
                  >
                    {getFieldDecorator('userNames', {
                      rules: [{ required: true, message: '必填' }]
                    })(
                      <Input
                        placeholder={t('请输入公司邮箱前缀，多个时请用英文逗号分隔')}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col span={4}>
                <Checkbox
                  className="applicant-switcher"
                  checked={applyType === 2}
                  onChange={this.handleTypeChange}
                >
                  {t('代他人申请')}
                </Checkbox>
              </Col>
            </Row>
          </div>

          <FormItem
            {...formItemLayout}
            label={t('已有地区') + ':'}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              // placeholder={t("请选择地区")}
              value={areas}
              onChange={this.handleAreasChange}
              disabled
            >
              {/*不受form控制的表单项，提交时跟state里的新增地区合并数据*/}
              {this.props.areas.map((area) => {
                return (
                  <Option key={area.id} value={area.id}>
                    {area.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('新增地区') + ':'}
          >
            <InputTreeTag
              options={allAreas}
              value={newAreas}
              idMap={areaIdMap}
              onChange={v => this.handleNewAreaChange(v)}
              placeholder=""
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('权限失效日期') + ':'}
          >
            {getFieldDecorator('expireTime', {
              rules: [{
                type: 'object',
                required: true,
                message: 'Please select time!'
              }],
              initialValue: moment().add(1, 'year')
            })(
              <DatePicker
                style={{width: '100%'}}
                disabledDate={(date) => date && (
                  date.isBefore(moment(Date.now()).subtract(1, 'days')) ||
                  date.isAfter(moment(Date.now()).add(1, 'years'))
                )}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={t('申请理由')}
          >
            {getFieldDecorator('remark', {
              rules: [{
                required: true,
                message: t('请输入申请理由')
              }],
            })(
              <TextArea rows={4} placeholder={t('请输入申请理由')}/>
            )}
          </FormItem>

          <FormItem wrapperCol={{ offset: 4 }} >
            <Col span={4} >
              <Button
                className="new-apply-form-button"
                type="primary"
                htmlType="submit"
                disabled={businessId === ''}
              >
                {t('提交')}
              </Button>
            </Col>
            <Col span={16} >
              <Button
                className="new-apply-form-button"
                size="default"
                onClick={this.handleCancel}
              >
                {t('取消')}
              </Button>
            </Col>
          </FormItem>
        </Form>
      </ContentCard>
    );
  }
}

const WrappedTimeRelatedForm = Form.create()(ApplyAreaPermission);

export default connect(({ global, applyArea, userInfo }) => {
  const {
    areaIdMap,
    areas,
    allAreas
  } = applyArea;
  return {
    allBusiness: global.allBusiness,
    areas,
    userInfo,
    allAreas,
    areaIdMap
  };
})(WrappedTimeRelatedForm);
