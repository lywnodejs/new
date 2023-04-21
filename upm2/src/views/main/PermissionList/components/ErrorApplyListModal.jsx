import React,{PureComponent} from 'react';
import { translate } from 'react-i18next';
import { Table,Modal,Button,DatePicker } from 'antd';

const { Column } = Table;
class ErrorApplyListModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  handleCancel = () => {
    this.props.handleCancel();
  }
  render() {
    const { t,visible,errorApplyList } = this.props;
    
    return (
      <Modal
        title={t('提交失败')}
        visible={visible}
        width={550}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="submit" type="primary" onClick={this.handleCancel}>
            {t('知道了')}
          </Button>
        ]}
      >
        <h3 style={{marginBottom:'12px'}}>{t('您本次提交的以下权限点已经在申请中，请勿重复提交')}</h3>
        <Table
          dataSource={errorApplyList}
          size="small"
          className="upm-table"
          rowKey="permissionId"
          pagination={false}
        >
          <Column width={200} title={t('系统名称')} dataIndex="appName" key="appName" />
          <Column width={150} title={t('权限名称')} dataIndex="permissionName" key="permissionName" />
        </Table>
      </Modal>
    )
  }
}
export default translate()(ErrorApplyListModal);


