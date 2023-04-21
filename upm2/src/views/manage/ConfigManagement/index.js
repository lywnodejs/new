import React, { Component } from 'react';

import {
  Button, Form, Input, Card, Modal,
  Select, Checkbox, Table, Popover,
  Col, Row,
  message, Switch } from 'antd';
import connect from '@utils/translateConnect';
// import BusinessModal from '../../../components/BusinessModal';

import './index.less';
import _ from "lodash";

import getFormFields from '../Admin/getFormFields';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class ManageApp extends Component {
  state = {
    id: '',
    name: '',
    businessModalVisible: false,
    editingApp: '',
    business: [],
    formModalVisible: false,
    formType: ''
  };

  render() {
    return (
      <p>test</p>
    );
  };
}

export default connect(({ manageApp, global}) => {
  return {
    appList: manageApp.list,
    searches: manageApp.searches,
    appId: global.managingApp,
    allBusiness: global.allBusiness,
    business: manageApp.business
  };
}, (dispatch) => ({
  // fetchApps(searches) {
  //   dispatch({
  //     type: 'manageApp/fetchApps',
  //     payload: searches
  //   });
  // },
  // enableApp(appId, id) {
  //   dispatch({
  //     type: 'manageApp/enableApp',
  //     payload: {
  //       appId,
  //       id
  //     }
  //   });
  // },
  // disableApp(appId, id) {
  //   dispatch({
  //     type: 'manageApp/disableApp',
  //     payload: {
  //       appId,
  //       id
  //     }
  //   });
  // },
  // getBindBusiness(appId) {
  //   return dispatch({
  //     type: 'manageApp/getBusiness',
  //     payload: {
  //       appId
  //     }
  //   });
  // },
  // updateBusiness(appId, business) {
  //   return dispatch({
  //     type: 'manageApp/updateBusiness',
  //     payload: {
  //       appId,
  //       business
  //     }
  //   });
  // },
  // addApp(appData) {
  //   return dispatch({
  //     type: 'manageApp/addApp',
  //     payload: appData
  //   });
  // },
  // updateApp(appData) {
  //   return dispatch({
  //     type: 'manageApp/updateApp',
  //     payload: appData
  //   });
  // },
  // deleteApp(appId, id) {
  //   return dispatch({
  //     type: 'manageApp/deleteApp',
  //     payload: {
  //       appId,
  //       id
  //     }
  //   });
  // }
}))(Form.create()(ManageApp));
