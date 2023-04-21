import React from 'react';
import { Button, Form, Row, Col, Select, Input } from 'antd';

const FormItem = Form.Item;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const{t, data, leaveChange, dataTypeChange, businessChange, searchChange, search, handleReset,form} = this.props
    return(
      <Form>
        <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('数据类型')}>
              <Select value={form.resourceTypeIdList} style={{width: '100%'}} placeholder={t('请选择')} mode="multiple" onChange={dataTypeChange} showSearch optionFilterProp="children">
                <Select.Option value='' key = {-1}>
                  {t('全部')}
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
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('数据敏感级')}>
              <Select value={form.riskLevelList} style={{width: '100%'}} mode="multiple" placeholder={t('请选择')} onChange={leaveChange} showSearch optionFilterProp="children">
                <Select.Option value='' key={-1}>
                {t('全部')}
                </Select.Option>
                <Select.Option value="1">C1</Select.Option>
                <Select.Option value="2">C2</Select.Option>
                <Select.Option value="3">C3</Select.Option>
                <Select.Option value="4">C4</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('业务线')}>
              <Select  value={form.businessIdList} style={{width: '100%'}} placeholder={t('请选择')} mode="multiple" onChange={businessChange} showSearch optionFilterProp="children">
              <Select.Option value='' key = {-1}>
              {t('全部')}
                </Select.Option>
                {
                  data.businessList ? data.businessList.map((business) => {
                      return (
                      <Select.Option value={`${business.id}`} key = {business.id}>
                        {business.name}
                      </Select.Option>
                      )
                  }) :''
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={t('搜索')}>
              <Input ref={(ref)=>{this.myInput = ref}} style={{width: '100%'}} placeholder={t('请输入数据资源ID、数据资源名称')} onChange={searchChange} />
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
