import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Select } from 'antd';
import SystemList from '@components/SystemList';
import config from '@config/style';

const FormItem = Form.Item;
const Option = Select.Option;
const { searchForm } = config;

// class ApplicantSelect extends React.Component {
//   render() {
//     const { value, onChange, applicant } = this.props;
//     return (
//       <Select
//         showSearch
//         allowClear
//         {...this.props}
//         value={value}
//         onChange={onChange}
//         filterOption={(input, option) => {
//           const { children } = option.props;
//           return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
//         }}
//       >
//         {_.map(applicant, ({ name, id }) => {
//           return (
//             <Option
//               key={id}
//               value={id}
//             >{name}</Option>
//           );
//         })}
//       </Select>
//     );
//   }
// }

class SearchForm extends React.Component {
  onNameChange = (e) => {
    this.props.onValuesChange({
      applyUsername: e.target.value
    });
  }

  onAppIdChange = (appId) => {
    this.props.onValuesChange({
      appId
    });
  }

  onStatusChange = (status) => {
    this.props.onValuesChange({
      status
    });
  }

  initState = () => {
    const { tabIndex, enumMap, t } = this.props;
    if (enumMap.workflowenums) {
      const { approveStatus } = enumMap.workflowenums;
      const statusList = Object.keys(approveStatus).slice(0, -1); // 忽略驳回状态
      let approveStatusPortion = [];
      switch (tabIndex) {
      case '1':
        approveStatusPortion = statusList.slice();
        break;
      case '2':
        approveStatusPortion = statusList.slice(0, 1);
        break;
      case '3':
        approveStatusPortion = statusList.slice(1);
        break;
      default:
        approveStatusPortion = statusList.slice();
      }
      return _.map(approveStatusPortion, (value) => {
        return (<Option key={value} value={value}>{t(approveStatus[value])}</Option>);
      });
    }
  }

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="upm-form">
        <Row gutter={12}>
          <Col span={8}>
            <FormItem label={t('目标系统')} {...searchForm}>{getFieldDecorator('appId', {})(<SystemList onChange={this.onAppIdChange}/>)}</FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('申请人')} {...searchForm}>
              {getFieldDecorator('applyUsername', {})(<Input placeholder={t('输入关键字回车进行搜索')} onPressEnter={this.onNameChange}/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('流程状态')} {...searchForm}>
              {getFieldDecorator('status', {})(
                <Select onChange={this.onStatusChange}>
                  {this.initState()}
                </Select>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.fields, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    // props.onValuesChange(values);
  }
})(SearchForm);

export default connect(({ global }) => {
  return {
    enumMap: global.enumMap
  };
})(SearchFormWrapper);
