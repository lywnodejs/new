import React, { PureComponent } from 'react';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import {
  Input,
  Tabs,
  Button,
  Popconfirm,
  message,
  Form,
  Table,
  Select,
  Col,
  Row,
  Divider
} from 'antd';
import { MAIN } from '@routes/config';
const FormItem = Form.Item;
const Option = Select.Option;
const tabIdNameMapping = {
  1: '地区',
  2: '角色',
  7: '标识位',
  100: '数据资源'
};
const riskLevels = ['C1', 'C2', 'C3', 'C4'];

class FilterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataTypes: []
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // 保证目标系统列表是最新状态
    dispatch({
      type: 'global/fetchAvailableApps'
    });
    // 保证业务线列表是最新状态
    dispatch({
      type: 'global/getAllBusiness'
    });
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    const {
      form: { validateFields },
      search
    } = this.props;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const keys = Object.keys(values);
      const newParams = keys.reduce((obj, key) => {
        if (Array.isArray(values[key]) && values[key].length === 0) {
          obj[key] = '';
        } else {
          obj[key] = values[key];
        }
        return obj;
      }, {});

      search(newParams);
    });
  };

  /**
   * 重置
   */
  handleReset = () => {
    this.props.form.resetFields();
    this.props.reset();
  };

  /**
   * 目标系统更改
   * @param {number} appId
   */
  handleChangeOnApp = appId => {
    const { permissionType, form } = this.props;
    //仅在数据资源tab下，动态加载数据类型
    if (permissionType == 100) {
      if (appId !== '') {
        this.props
          .dispatch({
            type: 'dataResource/getDataType',
            payload: { appId: appId }
          })
          .then(res => {
            this.setState({
              dataTypes: res
            });
          });
      } else {
        //目标系统选择 全部
        form.setFieldsValue({ resourceTypeIdList: [] });
        this.setState({
          dataTypes: []
        });
      }
    }
  };

  render() {
    const { dataTypes } = this.state;
    const { t, form, permissionType, apps, allBusiness } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const loopForApps = apps => {
      const defaultOption = (
        <Option key={-1} value={''}>
          {t('全部')}
        </Option>
      );
      let options = [];
      if (apps && apps.length > 0) {
        options = apps.map(item => (
          <Select.Option key={item.appId} value={item.appId}>
            {item.appName}
          </Select.Option>
        ));
      }
      return [defaultOption, ...options];
    };
    const loopForAllBusiness = allBusiness => {
      const defaultOption = (
        <Option key={-1} value={''}>
          {t('全部')}
        </Option>
      );
      let options = [];
      if (allBusiness && allBusiness.length > 0) {
        options = allBusiness.map(business => (
          <Select.Option key={business.id} value={business.id}>
            {business.name}
          </Select.Option>
        ));
      }
      return [defaultOption, ...options];
    };
    const loopForDataType = dataTypes => {
      let options = [];
      if (dataTypes && dataTypes.length > 0) {
        options = dataTypes.map(dataType => (
          <Select.Option key={dataType.id} value={dataType.id}>
            {dataType.name}
          </Select.Option>
        ));
      }
      return options;
    };
    const loopForRiskLevel = riskLevels => {
      return riskLevels.map((riskLevel, index) => (
        <Select.Option key={index} value={index + 1 + ''}>
          {riskLevel}
        </Select.Option>
      ));
    };
    const IsAllOnAppId = getFieldValue('appId') === '';

    // 筛选条件布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    // 筛选条件，操作按钮布局
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        }
      }
    };

    return (
      <Form {...formItemLayout}>
        <Row gutter={24} className="filter-fields">
          {/* <Row gutter={24}> */}
          <Col xs={8} sm={8} md={8} lg={8} xl={8}>
            <FormItem label={t('目标系统：')}>
              {getFieldDecorator('appId', {
                rules: [],
                initialValue: ''
              })(
                <Select
                  placeholder={t('请选择')}
                  // onChange={(value) => this.setState({appId: value})}
                  onChange={value => {
                    this.handleChangeOnApp(value);
                  }}
                  className="form-select"
                  showSearch
                  optionFilterProp="children">
                  {loopForApps(apps)}
                </Select>
              )}
            </FormItem>
          </Col>
          {permissionType != 100 ? ( //非数据资源
            <span>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem
                  label={t(tabIdNameMapping[permissionType] + '名称') + ':'}>
                  {getFieldDecorator('permissionName', {
                    rules: [],
                    initialValue: ''
                  })(<Input />)}
                </FormItem>
              </Col>
            </span>
          ) : (
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <FormItem label={t('模糊搜索：')}>
                {getFieldDecorator('fuzzySearch', {
                  rules: [],
                  initialValue: ''
                })(
                  <Input
                    ref={ref => {
                      this.myInput = ref;
                    }}
                    // style={{width: '100%'}}
                    placeholder={t('请输入数据资源ID / 数据资源名称')}
                    // onChange={searchChange}
                  />
                )}
              </FormItem>
            </Col>
          )}
          <Col xs={8} sm={8} md={8} lg={8} xl={8}>
            <FormItem label={t('业务线：')}>
              {getFieldDecorator('businessId', {
                rules: [],
                initialValue: ''
              })(
                <Select
                  showSearch
                  placeholder={t('全部')}
                  // mode="multiple"
                  // maxTagCount={1}
                  // maxTagTextLength={4}
                  // allowClear
                  // value={businessId}
                  // onChange={(value) => this.setState({businessId: value})}
                  className="form-select"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }>
                  {loopForAllBusiness(allBusiness)}
                </Select>
              )}
            </FormItem>
          </Col>
          {permissionType == 100 ? ( // 数据资源
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <FormItem label={t('数据类型：')}>
                {getFieldDecorator('resourceTypeIdList', {
                  rules: [],
                  initialValue: []
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={t('全部')}
                    mode="multiple"
                    allowClear
                    // maxTagCount={1}
                    // maxTagTextLength={4}
                    disabled={IsAllOnAppId}
                    // onChange={dataTypeChange}
                    showSearch
                    optionFilterProp="children">
                    {loopForDataType(dataTypes)}
                  </Select>
                )}
              </FormItem>
            </Col>
          ) : null}
          <Col xs={8} sm={8} md={8} lg={8} xl={8}>
            <FormItem label={t('数据敏感级：')}>
              {getFieldDecorator('riskLevelList', {
                rules: [],
                initialValue: []
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  // maxTagCount={1}
                  // maxTagTextLength={4}
                  placeholder={t('全部')}
                  // onChange={leaveChange}
                  showSearch
                  optionFilterProp="children">
                  {loopForRiskLevel(riskLevels)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col
            xs={permissionType != 100 ? 16 : 8}
            sm={permissionType != 100 ? 16 : 8}
            md={permissionType != 100 ? 16 : 8}
            lg={permissionType != 100 ? 16 : 8}
            xl={permissionType != 100 ? 16 : 8}
            className="filter-fields-option">
            <FormItem {...tailFormItemLayout}>
              <span className="filter-options-wrapper">
                <Button onClick={this.handleReset}>{t('重置')}</Button>
                <Button
                  icon="search"
                  type="primary"
                  onClick={this.handleSearch}>
                  {t('搜索')}
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(
  connect(({ global }) => {
    return {
      apps: global.apps,
      allBusiness: global.allBusiness
    };
  })(FilterForm)
);
