import React from 'react';
import { Button, Form, Card, Row, Col, Select, Input, Table } from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '@components/AvailableApps';
const FormItem = Form.Item;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTypes: []
    }

  }
  componentDidMount (){
    const {managingApp} = this.props;
    if(managingApp) {
      this.getDataTypes(managingApp);
    }
    // const { dispatch } = this.props;
    // // 保证目标系统列表是最新状态
    // dispatch({
    //   type: 'global/fetchAvailableApps'
    // });
    // // 保证业务线列表是最新状态
    // dispatch({
    //   type: 'global/getAllBusiness'
    // });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.managingApp !== this.props.managingApp) {
      this.getDataTypes(nextProps.managingApp);
      this.props.form.resetFields();
    }
  }
  getDataTypes = (appId) => {
    let newAppId;
    if(appId) {
      newAppId = appId;
    } else {
      const { managingApp } = this.props;
      if(!managingApp) {
        return;
      }
      newAppId = managingApp;
    }
    
    this.props.dispatch({
      type: 'dataResource/getDataType',
      payload: { appId: newAppId }
    })
    .then(res => {
      this.setState({
        dataTypes: res
      });
    });
  }

  /**
   * 目标系统更改
   * @param {number} appId
   */
  // handleChangeOnApp = () => {
    // this.getDataTypes();
    // this.handleReset();
  // };

  /**
   * 查询
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
      const newValues = Object.keys(values).reduce((rstObj,item)=>{
        rstObj[item] = Array.isArray(values[item])?values[item].join(','):values[item]
        return rstObj;
      },{})
      search(newValues);
    });
  };

  /**
   * 清空
   */
  handleReset = () => {
    this.props.form.resetFields();
    this.props.reset();
  };

  render(){
    const{t, allBusiness, form} = this.props
    const { dataTypes } = this.state
    return(
      <Form>
        <Row gutter={24} className="search-fields">
          <Col span={6}>
            <FormItem label={t('目标系统：')}>
              {/* <AvailableApps changeCallBack={this.handleChangeOnApp}/> */}
              <AvailableApps />
            </FormItem>
          </Col>
          {/* <Col span={6}>
            <FormItem label={t('项目：')}>
              {form.getFieldDecorator('项目')(<Select style={{width: '100%'}}
               placeholder="请选择" 
               mode="multiple" 
               onChange={attrValuesChange} 
               optionFilterProp="children" 
               >
                {
                  data.attrValues && data.attrValues.map((attr) => {
                      return (
                      <Select.Option value={`${attr.name}`} key = {attr.name}>
                        {attr.name}
                      </Select.Option>
                      )
                  })
                }
              </Select>)}  
            </FormItem>
          </Col> */}
          <Col span={6}>
            <FormItem label={t('数据类型：')}>
              {form.getFieldDecorator('resourceTypeIdList',{
                rules: [],
                initialValue: []
              })(<Select style={{width: '100%'}} placeholder="请选择" mode="multiple" showSearch optionFilterProp="children">
                <Select.Option value={''} key = {-1}>
                  全部
                </Select.Option>
                {
                  dataTypes.map((type) => {
                      return (
                      <Select.Option value={`${type.id}`} key = {type.id}>
                        {type.name}
                      </Select.Option>
                      )
                  })
                }
              </Select>)}  
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={t('数据敏感级：')}>
              {form.getFieldDecorator('riskLevelList',{
                rules: [],
                initialValue: []
              })(<Select style={{width: '100%'}} mode="multiple" placeholder="请选择" showSearch optionFilterProp="children">
                <Select.Option value='' key={-1}>
                  全部
                </Select.Option>
                <Select.Option value="1">C1</Select.Option>
                <Select.Option value="2">C2</Select.Option>
                <Select.Option value="3">C3</Select.Option>
                <Select.Option value="4">C4</Select.Option>
              </Select>)} 
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={t('业务线：')}>
              {form.getFieldDecorator('businessIdList',{
                rules: [],
                initialValue: []
              })(<Select style={{width: '100%'}} placeholder="请选择" mode="multiple" showSearch optionFilterProp="children">
                {
                  allBusiness ? allBusiness.map((business) => {
                      return (
                      <Select.Option value={`${business.id}`} key = {business.id}>
                        {business.name}
                      </Select.Option>
                      )
                  }) :''
                }
              </Select>)}  
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={t('搜索：')}>
              {form.getFieldDecorator('fuzzySearch',{
                rules: [],
                initialValue: ''
              })(<Input ref={(ref)=>{this.myInput = ref}} style={{width: '100%'}} placeholder="请输入数据资源ID、数据资源名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
              <FormItem>
                <Button type="primary" onClick={this.handleSearch} >
                  {t('查询')}
                </Button>
                <Button className="btn" onClick={this.handleReset}>
                  {t('清空')}
                </Button>
              </FormItem>
            </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(
  connect(({ global }) => {
    return {
      managingApp: global.managingApp,
      allBusiness: global.allBusiness
    };
})(SearchForm)
);
