import React from 'react';
import { Button, Form, Card, Row, Col, Select, Input, Table } from 'antd';

const FormItem = Form.Item;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount (){
  }
  render(){
    const{t, data, leaveChange, bindChange, attrValuesChange, dataTypeChange, businessChange, searchChange, search, handleReset,form} = this.props
    return(
      <Form>
        <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('数据类型：')}>
              {form.getFieldDecorator('数据类型')(<Select style={{width: '100%'}} placeholder="请选择" mode="multiple" onChange={dataTypeChange} showSearch optionFilterProp="children">
                <Select.Option value={''} key = {''}>
                  全部
                </Select.Option>
                {
                  data.dataType ? data.dataType.map((type) => {
                      return (
                      <Select.Option value={`${type.id}`} key = {type.id}>
                        {type.name}
                      </Select.Option>
                      )
                  }) :''
                }
              </Select>)}  
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('数据敏感级：')}>
              {form.getFieldDecorator('数据敏感级')(<Select style={{width: '100%'}} mode="multiple" placeholder="请选择" onChange={leaveChange} showSearch optionFilterProp="children">
                <Select.Option value=''>
                  全部
                </Select.Option>
                <Select.Option value="1">C1</Select.Option>
                <Select.Option value="2">C2</Select.Option>
                <Select.Option value="3">C3</Select.Option>
                <Select.Option value="4">C4</Select.Option>
              </Select>)} 
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('业务线：')}>
              {form.getFieldDecorator('业务线')(<Select style={{width: '100%'}} placeholder="请选择" mode="multiple" onChange={businessChange} showSearch optionFilterProp="children">
                {
                  data.businessList ? data.businessList.map((business) => {
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

          <Col span={6}>
            <FormItem label={t('是否已绑定：')}>
              {form.getFieldDecorator('是否已绑定')(<Select style={{width: '100%'}} placeholder="请选择" onChange={bindChange}  optionFilterProp="children">
                <Select.Option value={'1'} key = {'1'}>
                  已绑定
                </Select.Option>
                <Select.Option value={'0'} key = {'0'}>
                  未绑定
                </Select.Option>
              </Select>)} 
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={t('搜索：')}>
              {form.getFieldDecorator('search')(<Input ref={(ref)=>{this.myInput = ref}} style={{width: '100%'}} placeholder="请输入数据资源ID、数据资源名称" onChange={searchChange} />)}
            </FormItem>
          </Col>
          <Col span={6}>
              <FormItem>
                <Button type="primary" onClick={search} >
                  {t('查询')}
                </Button>
                <Button className="btn" onClick={handleReset}>
                  {t('清空')}
                </Button>
              </FormItem>
            </Col>
        </Row>
      </Form>
    )
  }
}

const DataRescourceSearchForm = Form.create({name: 'dataRescource_searchForm'})(SearchForm)
export default DataRescourceSearchForm;
