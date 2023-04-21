import React from 'react';
import { Modal, Checkbox } from 'antd';
import _ from 'lodash';
import { translate } from 'react-i18next';

const CheckboxGroup = Checkbox.Group;

const convertBusinessData = (data) => {
  return data.map(item => ({
    label: item.name,
    value: item.id
  }));
};

class BusinessModal extends React.Component {
  render() {
    const {
      t,
      visible, value, allBusiness,
      onOk, onCancel, onChange
    } = this.props;

    return (
      <Modal
        title={t('绑定业务线')}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <CheckboxGroup
          options={convertBusinessData(allBusiness)}
          value={value}
          onChange={onChange}
        />
      </Modal>
    );
  }
}

export default translate()(BusinessModal);
