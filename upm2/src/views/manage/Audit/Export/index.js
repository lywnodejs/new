import React from 'react';
import connect from '@utils/translateConnect';
import SystemList from '@components/SystemList';
import _ from 'lodash';
import { Form, Button, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Export extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currTab: '1'
    }
  }

  handleSearchFieldChange = (payload) => {
    this.props.dispatch({
      type: 'audit/update',
      payload
    })
  }

  open(url) {
    url && window.open(`${url}?appId=${this.props.appId}`);
  }

  render () {
    const { t, appId } = this.props;
    const tabDatas = [{
      title: '用户关系导出',
      key: '1',
      buttons: [{
          name: '用户-角色组',
          url: '/export/userrolegroup/export',
        }, {
          name: '用户-角色',
          url: '/export/roleuser/export',
        }, {
          name: '用户-区域',
          url: '/export/userarea/export',
        }, {
          name: '用户-标识位',
          url: '/export/fouser/export',
        }
      ]
    }, {
      title: '其他关系导出',
      key: '2',
      buttons: [
        {
          name: '角色-功能',
          url: '/export/rolefeature/export'
        }, {
          name: '角色组-角色',
          url: '/export/rolegroup/export'
        }, {
          name: '角色-功能组',
          url: '/export/featuregrouprole/export'
        }, {
          name: '功能组-功能',
          url: '/export/featuregrouprealtion/export'
        }, {
          name: '标识位-角色',
          url: '/export/forole/export'
        }
      ]
    }];

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };

    const formItemLayout2 = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
 
    return (
      <Tabs
        defaultActiveKey={tabDatas[0].key}
        onChange={(currTab) => this.handleSearchFieldChange({currTab})}
        style={{backgroundColor: '#fff', minHeight: 600}}
      >
        {tabDatas.map((tab) => (
          <TabPane tab={t(tab.title)} key={tab.key}>
            <Form layout="horizontal">
                <FormItem label={t('目标系统')} {...formItemLayout}>
                  <SystemList
                    value={appId}
                    onChange={(appId) => this.handleSearchFieldChange({ appId })}
                    style={{width: '100%'}}
                  />
                </FormItem>
                <FormItem label={t('操作')} {...formItemLayout2}>
                  {tab.buttons.map((btn, index) => (
                    <Button key={index} size="large" type="primary" style={{marginRight: 10}} onClick={() => this.open(btn.url)}>{t(btn.name)}</Button>
                  ))}
                </FormItem>
              </Form>
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default connect(({ audit }) => {
  return {
    ...audit
  };
})(Export);