import React, { useImperativeHandle, forwardRef } from 'react';
import { Form, Col, Row } from 'antd';
import './style.less';

//表单
function MyForm(props, ref) {
  const {
    formItems,
    tail,
    colCount = 3,
    labelCol,
    wrapperCol,
    tailLayout,
    tailStyle,
    flowLayout = true,
    ...elseProps
  } = props;
  //参数
  const [form] = Form.useForm();

  const onFinish = values => {
    props.onFinish && props.onFinish(values);
  };

  useImperativeHandle(ref, () => ({
    getForm: () => {
      return form;
    },
  }));

  function renderComp(content) {
    if (typeof content === 'string' || typeof content === 'object') {
      return content;
    }

    return content && content();
  }

  const tailContent = tail && tail();
  const groupLen = Math.ceil(formItems.length / colCount);
  const group: Array<any> = [];
  for (let i = 0; i < groupLen; i++) {
    const groupContent: Array<any> = formItems.slice(
      i * colCount,
      (i + 1) * colCount,
    );
    group.push(groupContent);
  }

  let _formItemLayout, _tailLayout, _tailStyle;

  _formItemLayout = {
    labelCol: labelCol || { span: 10 },
    wrapperCol: wrapperCol || { span: 14 },
  };
  _tailLayout = tailLayout || {
    wrapperCol: { span: 18, offset: 6 },
  };
  _tailStyle = tailStyle || { textAlign: 'right' };

  function renderTail() {
    if (!tailContent) {
      return null;
    }

    if (colCount === 1) {
      return (
        <Row>
          <Col span={24} style={_tailStyle}>
            <Form.Item {..._tailLayout}>{tailContent}</Form.Item>
          </Col>
        </Row>
      );
    } else {
      if (flowLayout) {
        return <Row justify="end">{tailContent}</Row>;
      }
      return tailContent;
    }
  }

  return (
    <Form
      className="g-from"
      form={form}
      onFinish={onFinish}
      {..._formItemLayout}
      {...elseProps}
    >
      {group.map((groupItem, ind) => {
        return (
          <Row key={`row_${ind}`}>
            {groupItem.map((item, index) => {
              const { content, ...itemProps } = item;
              return (
                <Col span={Math.floor(24 / colCount)} key={`col_${index}`}>
                  <Form.Item {...itemProps}>{renderComp(content)}</Form.Item>
                </Col>
              );
            })}
          </Row>
        );
      })}
      {renderTail()}
    </Form>
  );
}

export default forwardRef(MyForm);
