import React from 'react';
import { Card, Row, Col, Form, Input, Button } from 'antd';
import './index.less';
import connect from '@utils/translateConnect';
import { apiHost } from '@config/apiConfig';
import AvailableApps from '../../../components/AvailableApps/index';

const FormItem = Form.Item;

class PermissionImport extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSystemChange = () => {

  }

  export = (type) => {
    window.open(`${apiHost}/export/${type}/export?appId=${this.props.appId}`);
  }

  render () {
    const { t } = this.props;
    return (
      <div >
        <div className="my-import">
          <label>{t('系统选择：')}</label>
          <AvailableApps
            style={{ width: 200 }}
            changeCallBack={this.handleSystemChange}
          />
        </div>
        <div className="my-import">
          <Card title="用户权限关系导出">
            <Button className="export-button" type="primary" onClick={() => this.export('userrolegroup')}>{t('用户-角色组')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('roleuser')}>{t('用户-角色')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('userarea')}>{t('用户-地区')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('fouser')}>{t('用户-标识位')}</Button>
          </Card>
        </div>
        <div className="my-import">
          <Card title="其他关系导出">
            <Button className="export-button" type="primary" onClick={() => this.export('rolefeature')}>{t('角色-功能')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('rolegroup')}>{t('角色组-角色')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('featuregrouprole')}>{t('角色-功能组')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('featuregrouprealtion')}>{t('功能组-功能')}</Button>
            <Button className="export-button" type="primary" onClick={() => this.export('forole')}>{t('标识位-角色')}</Button>
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => {
  return {
    appId: global.managingApp
  };
})(PermissionImport);