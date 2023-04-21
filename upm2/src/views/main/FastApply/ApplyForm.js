import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { translate } from 'react-i18next';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  TreeSelect,
  message,
  Row,
} from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const FormItem = Form.Item;
const { TextArea } = Input;
// DFS找出所有该属性的值
function findAllAttrInChildren(attr, arr, childrenName) {
  let result = [];
  for (const cur of arr) {
    if (cur.hasOwnProperty(attr)) {
      result.push(cur[attr]);
    }
    if (cur.hasOwnProperty(childrenName) && Array.isArray(cur[childrenName])) {
      let next = cur[childrenName];
      result = result.concat(findAllAttrInChildren(attr, next, childrenName));
    }
  }
  return result;
}
function findChildren(arr, srcArr) {
  // TODO: 优化
  let result = [];
  // console.log('src', srcArr);
  for (const cur of srcArr) {
    // 如果有全国，则直接返回全国
    if (cur.name == '全国' && arr.indexOf(cur.id+'') !== -1) {
      return arr;
    }
    if (arr.indexOf(cur.id+'') !== -1) {
      // console.log('found', cur);
      result.push(cur.id);
      if (cur.hasOwnProperty('children') && cur.children) {
        result = result.concat(
          findAllAttrInChildren('id', cur.children, 'children'),
        );
      }
    } else {
      if (cur.hasOwnProperty('children') && cur.children) {
        // console.log('into', cur);

        result = result.concat(findChildren(arr, cur.children));
      }
    }
  }
  return result;
}
class ApplyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailPrefix: this.props.emailPrefix,
      pack: null,
      city: null,
      origionCity: [],
      reason: '',
      package: [],
      modalVisiable: false,
      isWorkflowLoading: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fastApply/getCities',
    });
    dispatch({
      type: 'fastApply/getUserInfo',
    });
    dispatch({
      type: 'fastApply/getPackage',
    });
  }

  onEmailChange = e => {
    this.setState({
      emailPrefix: e.target.value,
    });
  };
  onPacChange = e => {
    this.setState({
      pack: e,
    });
  };
  onCityChange = e => {
    this.setState({
      city: e,
    });
  };
  onReasonChange = e => {
    this.setState({
      reason: e.target.value,
    });
  };
  onForOthersChange = e => {
    const checked = e.target.checked;
    const { form, emailPrefix } = this.props;
    form.setFieldsValue({
      emailPrefix: checked ? '' : emailPrefix,
    });
  };
  onCheckWorkflow = () => {
    // TODO: 审批流的查看
    this.setState({ isWorkflowLoading: true });
    this.setState({
      modalVisiable: true,
    });
  };
  hideWorkflow = () => {
    this.setState({ modalVisiable: false });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        const { dispatch, origionCity } = this.props;
        // console.log('all', findChildren(this.state.city, origionCity));

        const postCities = findChildren(this.state.city, origionCity);
        dispatch({
          type: 'fastApply/apply',
          payload: {
            areaIdList: postCities,
            bagIdList: this.state.pack,
            remark: this.state.reason,
          },
        }).then(data => {
          const { t } = this.props;
          if (data.success) {
            message.success(t('提交成功'), () => {
              location.href = '/upm2-static/main/apply';
            });
          } else {
            message.error(t(data.result));
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { t } = this.props;

    return (
      <Form onSubmit={this.onSubmit}>
        <Row>
          <FormItem {...formItemLayout} label={t('申请人邮箱前缀')}>
            {this.props.emailPrefix}
          </FormItem>
        </Row>
        <FormItem {...formItemLayout} label={t('申请人姓名')}>
          {this.props.name}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请人所在部门')}>
          {this.props.department}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请数据系统')} required={true}>
          <div style={{ color: '#ff7d4c' }}>小桔礼包，为部分系统的权限集合</div>
          {getFieldDecorator('pac', {
            rules: [
              {
                required: true,
                message: '必填项',
              },
            ],
          })(
            <CheckboxGroup onChange={this.onPacChange}>
              {this.props.package.map((ele, index) => (
                <Row key={index}>
                  <Checkbox value={ele.value} disabled={ele.disabled}>
                    {ele.label}
                  </Checkbox>
                </Row>
              ))}
            </CheckboxGroup>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('选择城市')}>
          {getFieldDecorator('city', {
            rules: [
              {
                required: true,
                message: '必填项',
              },
            ],
          })(
            <TreeSelect
              treeData={this.props.cities}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              multiple={true}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              onChange={this.onCityChange}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('申请理由')} required>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: '必填项',
              },
            ],
          })(<TextArea rows={4} onChange={this.onReasonChange} />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 4 }}>
          <Col span={4}>
            <Button
              className="new-apply-form-button"
              type="primary"
              size="default"
              htmlType="submit"
            >
              {t('提交')}
            </Button>
          </Col>
          <Col span={16}>
            <Button
              className="new-apply-form-button"
              onClick={this.onCheckWorkflow}
            >
              {t('查看审批流程')}
            </Button>
          </Col>
        </FormItem>
      </Form>
    );
  }
}

export default connect(({ fastApply, global }) => {
  return {
    ...fastApply,
    enumMap: global.enumMap,
  };
})(
  Form.create({
    mapPropsToFields(props) {
      let fields = {};
      _.each(props.params, (value, key) => {
        if (value != null) {
          fields[key] = Form.createFormField({ value });
        }
      });
      return fields;
    },
  })(translate()(ApplyForm)),
);
