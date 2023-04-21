import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Space } from 'antd';
import Former from './Form';
import _ from 'lodash';

const EasySearch = (props: any) => {
  const { handleSearch, handleReset, formProps } = props;
  const formRef: any = useRef();
  const [formItems, setFormItems] = useState([]);

  const handleFinish = (values: any) => {
    handleSearch && handleSearch(values);
  };

  const handleSubmit = () => {
    formRef.current.getForm().submit();
  };

  const formerProps = {
    ...formProps,
    onFinish: handleFinish,
    colCount: props.searchColCount || 4,
    tail() {
      return props.formButtons ? (
        props.formButtons({
          ResetButton: <Button onClick={handleReset}>重置</Button>,
          SubmitButton: (
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          ),
          handleReset,
          handleSubmit,
          formRef,
        })
      ) : (
        <Space>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      );
    },
  };

  useEffect(() => {
    const columns: any = [];
    if (props.searchColumns) {
      setFormItems(props.searchColumns);
    } else {
      Array.isArray(props.columns) &&
        props.columns.forEach((item: any) => {
          if (item.search) {
            columns.push({
              name: _.get(item, 'search.name', item.dataIndex),
              label: _.get(item, 'search.label', item.title),
              content: _.get(
                item,
                'search.content',
                <Input placeholder={'请输入'} allowClear />,
              ),
              initialValue: _.get(item, 'search.initialValue'),
            });
          }
        });
      setFormItems(columns);
    }
  }, [props.columns, props.searchColumns]);

  useEffect(() => {
    formRef && props.onRef(formRef);
  }, []);

  return (
    <>
      {formItems.length > 0 && (
        <Former {...formerProps} formItems={formItems} ref={formRef} />
      )}
    </>
  );
};

export default EasySearch;
