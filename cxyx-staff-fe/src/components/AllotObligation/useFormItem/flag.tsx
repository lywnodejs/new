import React, { useEffect } from 'react';
import { Row, Col, Form } from 'antd';
import { FormSelect } from './Allselect';

/**
 * @description 分配职责标识位
 */

export interface flagChildProps<RecordType> {
  flagObject: any; // 标识位对象
  gridStyleItem: Object; // 样式
  callback: Function; // 当前数据对应ID
}

const Flag = <RecordType extends object = any>(
  props: flagChildProps<RecordType>,
) => {
  const { flagObject, gridStyleItem, callback } = props;

  const inputChange = val => {
    let list = flagObject.allFlags.filter(item => {
      if (val.includes(item.id)) {
        return item;
      }
    });
    callback(list);
  };

  // 输入框设置初始值后 对应数据也需要设置初始值
  useEffect(() => {
    if (Array.isArray(flagObject.ownFlags) && flagObject.ownFlags.length === 0 && flagObject.recommendFlags) {
      callback(flagObject.recommendFlags || [])
    }
  }, []);

  return (
    <Row>
      <Col style={gridStyleItem}>标识位</Col>
      <Col style={gridStyleItem}>
        {Array.isArray(flagObject.ownFlags) && flagObject.ownFlags.length !== 0
          ? flagObject.ownFlags.map(item => {
            return (
              <li style={{ width: '100%' }} key={item.id}>
                {item.name}
              </li>
            );
          })
          : '-'}
      </Col>
      <Col style={gridStyleItem}>
        {!Array.isArray(flagObject.ownFlags) ||
          (Array.isArray(flagObject.ownFlags) &&
            flagObject.ownFlags.length === 0) ? (
            <Form.Item style={{ width: '100%' }} label="标识位">
              <FormSelect
                dataList={flagObject.allFlags}
                selectChange={val => {
                  inputChange(val);
                }}
                defaultValue={() => {
                  if (Array.isArray(flagObject.recommendFlags)) {
                    return flagObject.recommendFlags.map(item => {
                      return item.id;
                    });
                  }
                }}
              />
            </Form.Item>
          ) : (
            '-'
          )}
      </Col>
    </Row>
  );
};

// const Flag = React.forwardRef(flagChild)

export default Flag;
