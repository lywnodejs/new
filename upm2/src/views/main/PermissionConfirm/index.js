/*
 * @Author: Meng Hao
 * @Date: 2018-09-12 11:23:57
 * @Last Modified by: Meng Hao
 * @Last Modified time: 2018-09-15 11:41:03
 */
// TO DO: 重新申请的跳转还没做
import React from 'react';
import _, { transform } from 'lodash';
import connect from '@utils/translateConnect';
import {
  Input,
  Tabs,
  Button,
  Popconfirm,
  Modal,
  message,
  Form,
  Table,
  Select,
  Col,
  Row,
  Divider,
  Tag,
  Layout,
  Icon,
  Menu,
  Steps,
  Tooltip,
  Card
} from 'antd';
import './index.less';
import TextButton from '../../../components/TextButton';
import moment from 'moment';
import { InfoCircleFilled } from '@ant-design/icons';
import IconFont from '../../../components/IconFont';
import FilterForm from './components/FilterForm';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const { Column } = Table;
const { Step } = Steps;

const tabIdNameMapping = {
  1: '地区',
  2: '角色',
  7: '标识位',
  100: '数据资源'
};
const riskLevelNameMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

class PermissionConfirm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expire: '0',
      username: null,
      usernameZh: null,
      tableSelectedRows: {
        '2': [], // 角色
        '1': [], //地区
        '7': [], //标识位
        '100': [] // 数据资源
      },
      currentPage: 1,
      permissionType: 2,
      filterParams: {
        appId: '',
        permissionName: '',
        businessId: '',
        resourceTypeIdList: '',
        riskLevelList: '',
        fuzzySearch: ''
      },
      reservedList: {
        '2': [], // 角色
        '1': [], //地区
        '7': [], //标识位
        '100': [] // 数据资源
      },
      total: '',
      pageSize: 10,
      userNameList: [],
      currentStep: 0,
      stepStatus: {},
      stepToPermissionType: {}
    };
  }

  componentDidMount() {
    const { dispatch, otherpermission } = this.props;
    const { stepStatus, stepToPermissionType } = this.state;
    //判断是否为跳转过来的，url是否带参
    const urlParams = location.search.split('?')[1]
      ? location.search.split('?')[1].split('&')
      : null;
    let userName = '';
    urlParams &&
      urlParams.some(str => {
        if (str.split('=')[0] === 'userName') {
          userName = str.split('=')[1];
          return true;
        }
      });

    dispatch({
      type: 'permissionList/fetchTransferUserTodoList'
    }).then(res => {
      this.setState({
        userNameList: [...res]
      });
      if (userName !== '') {
        res.map(user => {
          if (user.username === userName) {
            this.setState({
              username: user.username,
              usernameZh: user.usernameZh
            });
          }
        });
      } else if (res.length > 0) {
        this.setState({
          username: res[0].username,
          usernameZh: res[0].usernameZh
        });
      }
      //微任务，setState为同步状态
      this.searchNumber();
    });
  }

  // 初始化步骤条
  setSteps = () => {
    const { otherpermission } = this.props;
    const { stepToPermissionType } = this.state;
    let _stepStatus = {};
    const permissionNumber = {
      '2': otherpermission.roleCount,
      '1': otherpermission.areaCount,
      '7': otherpermission.flagCount,
      '100': otherpermission.resourceCount
    };

    for (let prop in permissionNumber) {
      if (permissionNumber[prop] && permissionNumber[prop] > 0) {
        _stepStatus[prop] = {
          isWatched: false,
          status: 'wait',
          lastStaus: 'wait'
        };
      }
    }
    let permissionType = 2;
    if (Object.keys(_stepStatus)[0]) {
      _stepStatus[Object.keys(_stepStatus)[0]] = {
        isWatched: true,
        status: 'process',
        lastStaus: 'process'
      };
      permissionType = Object.keys(_stepStatus)[0];
    }
    Object.keys(_stepStatus).map((prop, index) => {
      stepToPermissionType[index] = prop;
    });
    this.setState(
      {
        stepStatus: {
          ..._stepStatus
        },
        permissionType
      },
      () => {
        this.search();
      }
    );
  };

  // componentWillReceiveProps (nextProps) {
  //   // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
  //   if (nextProps.global.globalAppId !== this.props.global.globalAppId) {
  //     setTimeout(() => {
  //       this.search();
  //     }, 0);
  //   }
  // }

  //获取待确认权限数量
  searchNumber = () => {
    const { dispatch } = this.props;
    const { username } = this.state;
    dispatch({
      type: 'entrance/fetchOtherPermission',
      payload: {
        who: username
      }
    }).then(() => {
      this.setSteps();
    });
  };

  handleSearchFromFilterForm = filterParams => {
    this.setState(
      {
        pageCurrent: 1,
        filterParams: {
          ...this.state.filterParams,
          ...filterParams
        }
      },
      () => {
        this.search();
      }
    );
  };

  // 请求列表统一的入口
  search = () => {
    const { dispatch } = this.props;
    const {
      username,
      reservedList,
      pageSize,
      currentPage,
      expire,
      permissionType,
      filterParams
    } = this.state;
    const baseParams = {
      page: currentPage,
      permissionType: permissionType,
      who: username,
      expire: expire,
      reservedList,
      size: pageSize
    };
    let params = {};
    if (permissionType == 100) {
      //数据资源
      params = {
        ...baseParams,
        appId: filterParams.appId,
        resourceTypeIdList: filterParams.resourceTypeIdList,
        riskLevelList: filterParams.riskLevelList,
        businessId: filterParams.businessId,
        fuzzySearch: filterParams.fuzzySearch
      };
    } else {
      //其他tab
      params = {
        ...baseParams,
        appId: filterParams.appId,
        permissionName: filterParams.permissionName,
        businessId: filterParams.businessId
      };
    }

    // // appId为-1的时候，就是选择【全部】
    // if (appId !== -1) {
    //   params.appId = appId;
    // }

    // if (businessId !== '0') {
    //   params.businessId = Number(businessId);
    // }

    // if (expire !== '-1') {
    //   params.expire = Number(expire);
    // }

    // if (permissionName) {
    //   params.permissionName = permissionName;
    // }

    // if (permissionStatus) {
    //   params.permissionStatus = permissionStatus;
    // }

    // 数易数据集
    // if (permissionType == 13) {
    //   params.projectName = projectName
    //   params.resourceKey = resourceKey
    //   params.riskLevel = riskLevel
    // }

    dispatch({
      type: 'permissionList/fetchOtherPermissionList',
      payload: params
    });
  };

  handlePermissionTypeChange = (value = '') => {
    this.filterForm.resetFields();
    this.setState(
      {
        permissionType: value,
        currentPage: 1,
        filterParams: {
          appId: '',
          permissionName: '',
          businessId: '',
          resourceTypeIdList: '',
          riskLevelList: '',
          fuzzySearch: ''
        }
      },
      () => {
        this.search();
      }
    );
  };

  handlePageChange = page => {
    this.setState(
      {
        currentPage: page
      },
      () => {
        this.search();
      }
    );
  };
  onShowSizeChange = (current, size) => {
    this.setState(
      {
        currentPage: current,
        pageSize: size
      },
      () => {
        this.search();
      }
    );
  };

  // 操作列的render
  // getActions = (text, record) => {
  //   const { t } = this.props;

  //   return (
  //     <div>
  //       <TextButton
  //         onClick={() => { message.error('还没做！') }}
  //       >{t('重新申请')}</TextButton>
  //       <Divider type="vertical" />
  //       <Popconfirm
  //           placement="top"
  //           title={t('确定关闭权限？')}
  //           onConfirm={() => this.close(record)}
  //           okText={t('确定')}
  //           cancelText={t('取消')}>
  //           <TextButton>
  //             {t('关闭权限')}
  //           </TextButton>
  //         </Popconfirm>
  //     </div>
  //   )
  // }

  // batchClose = () => {
  //   const { dispatch, t } = this.props;
  //   if (!this.state.selectedRows.length) {
  //     message.error(t('请选择至少一条记录'));
  //     return
  //   }
  //   const params = this.state.selectedRows.map(i => ({
  //     appId: i.appId,
  //     permissionType: Number(this.state.permissionType),
  //     targetId: i.id
  //   }))

  //   dispatch({
  //     type: 'permissionList/permissionClose',
  //     payload: params
  //   })
  //   .then((result) => {
  //     if (result) {
  //       message.error(result);
  //     } else {
  //       message.success(t('操作成功'))
  //     }
  //     this.search()
  //   })
  // }

  confirmRemain = () => {
    const { t, otherpermission } = this.props;
    const { usernameZh, reservedList, username } = this.state;
    if (!username) {
      message.error('请选择要修改的人');
      return;
    }

    const permissionNumber = {
      '2': otherpermission.roleCount,
      '1': otherpermission.areaCount,
      '7': otherpermission.flagCount,
      '100': otherpermission.resourceCount
      // '3': otherpermission.reportCount,
      // '4': otherpermission.templateCount,
      // '5': otherpermission.indicatorCount,
      // '13': otherpermission.dataSetCount
    };
    let records = [];
    for (let prop in permissionNumber) {
      if (permissionNumber[prop] !== 0) {
        let deleteNum = permissionNumber[prop];
        if (reservedList[prop]) {
          deleteNum = permissionNumber[prop] - reservedList[prop].length;
        }
        records.push({
          permissionTypeName: tabIdNameMapping[prop],
          reserveNum: reservedList[prop] ? reservedList[prop].length : 0,
          deleteNum,
          totalNum: permissionNumber[prop]
        });
      }
    }

    confirm({
      // title: `${usernameZh}${t('的转岗权限review')}`,
      title: t('权限变更详情'),
      width: 550,
      content: (
        <div>
          <p>{usernameZh + t('的转岗权限review：')}</p>
          <Table
            style={{ border: '0' }}
            dataSource={records}
            pagination={false}
            // size="small"
            className="upm-table"
            rowKey="permissionTypeName">
            <Column
              title={t('权限类型')}
              dataIndex="permissionTypeName"
              key="permissionTypeName"
            />
            <Column
              title={t('删除权限')}
              dataIndex="deleteNum"
              key="deleteNum"
              render={text => {
                return (
                  <span style={{ fontWeight: 'bold', color: 'red' }}>
                    {text}
                  </span>
                );
              }}
            />
            <Column
              title={t('保留权限')}
              dataIndex="reserveNum"
              key="reserveNum"
            />
            <Column title={t('原有权限')} dataIndex="totalNum" key="totalNum" />
          </Table>
        </div>
      ),
      okText: t('确认'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.doubleConfirm();
      }
    });
  };

  doubleConfirm = () => {
    const { t } = this.props;
    confirm({
      title: t('请确认是否提交？'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.batchRemain();
      }
    });
  };

  batchRemain = () => {
    const { dispatch, match, t, userInfo } = this.props;
    const { reservedList, username } = this.state;
    // const { username } = match.params;
    const postData = {
      who: username
    };
    let isPostDataEmpty = true;

    _.forOwn(reservedList, (value, key) => {
      if (!_.isEmpty(value)) {
        isPostDataEmpty = false;
        postData[key] = value.map(item => {
          return {
            appId: item.appId,
            targetId: item.relId
          };
        });
      }
    });

    dispatch({
      type: 'permissionList/permissionSaveOther',
      payload: postData
    }).then(result => {
      if (result) {
        message.error(result);
      } else {
        message.success(t('操作成功'));
        this.setState({
          reservedList: {
            '2': [], // 角色
            '1': [], //地区
            '7': [], //标识位
            '100': [] //数据资源
            // '3': [], //报表
            // '4': [], //模板
            // '5': [], //指标
            // '13': [] // 数易-数据集
          },
          tableSelectedRows: {
            '2': [], // 角色
            '1': [], //地区
            '7': [], //标识位
            '100': [] //数据资源
          },
          username: null,
          usernameZh: null
        });
      }
      dispatch({
        type: 'permissionList/fetchTransferUserTodoList'
      }).then(res => {
        if (res.length > 0) {
          this.setState({
            username: res[0].username,
            usernameZh: res[0].usernameZh
          });
        }
        this.setState(
          {
            userNameList: res,
            currentPage: 1
          },
          () => {
            this.search();
            this.searchNumber();
          }
        );
      });
    });
  };

  // close = (records) => {
  //   const { dispatch, t } = this.props;
  //   const params = {
  //     appId: records.appId,
  //     permissionType: Number(this.state.permissionType),
  //     targetId: records.id
  //   };

  //   dispatch({
  //     type: 'permissionList/permissionClose',
  //     payload: [params]
  //   })
  //     .then((result) => {
  //       if (result) {
  //         message.error(result);
  //       } else {
  //         message.success(t('操作成功'));
  //       }
  //       this.setState({
  //         // currentPage: 1
  //       },()=>{
  //         this.search();
  //         this.searchNumber();
  //       })
  //     });
  // }

  deleteSelectdRows = (key, value) => {
    let { tableSelectedRows } = this.state;

    if (_.isArray(value)) {
      value.forEach(item => {
        _.remove(tableSelectedRows[key], i => item === i.relId);
      });
    } else {
      _.remove(tableSelectedRows[key], i => value == i.relId);
    }

    this.setState({
      tableSelectedRows: {
        ...tableSelectedRows,
        [key]: [...tableSelectedRows[key]]
      }
    });
  };

  // getKeep = () => {
  //   const { t } = this.props;
  //   const { tableSelectedRows } = this.state;
  //   const result = [];

  //   _.forOwn(tableSelectedRows, (value, key) => {
  //     if (!_.isEmpty(value)) {
  //       result.push(<div>
  //         <label>{t(tabIdNameMapping[key]) + '：'}</label>
  //         {value.map(j => <Tag key={j.relId} closable onClose={() => { this.deleteSelectdRows(key, j.relId); }}>{j.name}</Tag>)}
  //       </div>);
  //     }
  //   });

  //   return result;
  // }

  changeUsername = (username, usernameZh) => {
    if (username == this.state.username) return;
    this.setState(
      {
        username,
        usernameZh,
        reservedList: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] // 数易-数据集
        },
        tableSelectedRows: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] //数据资源
        },
        currentPage: 1,
        currentStep: 0
      },
      () => {
        this.search();
        this.searchNumber();
      }
    );
  };

  // emptyInput = () => {
  //   this.setState({
  //     appId: '',
  //     permissionName: '',
  //     businessId: '0'
  //   });
  //   this.permissionNameInput.state.value = '';
  // }

  //设置为保留
  setReserved = () => {
    let { tableSelectedRows, reservedList, permissionType } = this.state;
    // if (JSON.stringify(tableSelectedRows) === '{}') {
    //   message.error('请至少选择一条数据');
    //   return;
    // }
    if (reservedList[permissionType].length > 0) {
      //已经待保留的，不重复添加状态
      tableSelectedRows[permissionType].map(item => {
        if (
          reservedList[permissionType].findIndex(
            row => item.relId === row.relId
          ) < 0
        ) {
          reservedList[permissionType].push(item);
        }
      });
    } else {
      reservedList[permissionType].push(...tableSelectedRows[permissionType]);
    }

    // for (let prop in tableSelectedRows) {
    //   if (reservedList[prop].length > 0) {
    //     //已经待保留的，不重复添加状态
    //     tableSelectedRows[prop].map(item => {
    //       if (reservedList[prop].findIndex(row => item.relId === row.relId) < 0) {
    //         reservedList[prop].push(item);
    //       }
    //     });
    //   } else {
    //     reservedList[prop].push(...tableSelectedRows[prop]);
    //   }
    // }
    this.setState(
      {
        reservedList: { ...reservedList },
        tableSelectedRows: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] //数据资源
        }
        // currentPage: 1,
      },
      () => {
        this.search();
      }
    );
  };

  //设置为删除
  setDeleted = () => {
    let { tableSelectedRows, reservedList, permissionType } = this.state;
    let selectedList = [];
    // if (JSON.stringify(tableSelectedRows) === '{}') {
    //   message.error('请至少选择一条数据');
    //   return;
    // }
    for (let prop in tableSelectedRows) {
      selectedList.push(...tableSelectedRows[prop]);
    }
    //从待保留列表中删除已选列表
    // for (let prop in reservedList) {
    let laterList = reservedList[permissionType].filter(item => {
      return selectedList.findIndex(row => row.relId === item.relId) === -1;
    });
    reservedList[permissionType] = [...laterList];
    // }
    this.setState(
      {
        reservedList: { ...reservedList },
        tableSelectedRows: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] //数据资源
        }
      },
      () => {
        this.search();
      }
    );
  };

  //放弃修改
  giveupChanges = () => {
    const { username } = this.state;
    const { t } = this.props;
    if (!username) {
      message.error('请选择要修改的人');
      return;
    }
    confirm({
      title: t('确认是否放弃本次修改？'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.emptyState();
      }
    });
  };

  //清空页面状态
  emptyState = () => {
    this.setState(
      {
        reservedList: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] //数据资源
          // '3': [], //报表
          // '4': [], //模板
          // '5': [], //指标
          // '13': [] // 数易-数据集
        },
        tableSelectedRows: {
          '2': [], // 角色
          '1': [], //地区
          '7': [], //标识位
          '100': [] //数据资源
        },
        currentStep: 0
      },
      () => {
        this.onStepChange(0);
        this.search();
        this.searchNumber();
      }
    );
  };

  //模糊搜索
  fuzzySearch = e => {
    const value = e.target.value;
    const { userNames } = this.props;
    if (value == '') {
      this.setState({
        userNameList: [...userNames]
      });
      return;
    }
    let arr = [];
    let { userNameList } = this.state;
    for (let i = 0; i < userNameList.length; i++) {
      if (
        userNameList[i].usernameZh.indexOf(value) >= 0 ||
        userNameList[i].username.indexOf(value) >= 0
      ) {
        arr.push(userNameList[i]);
      }
    }
    this.setState({
      userNameList: [...arr]
    });
  };

  getReminder = () => {
    const { t, otherpermission } = this.props;
    const paramNameMapping = {
      roleCount: '角色',
      areaCount: '地区',
      // indicatorCount: '指标',
      flagCount: '标识位',
      resourceCount: '数据资源'
      // templateCount: '模板',
      // reportCount: '报表',
      // dataSetCount: '数据集'
    };
    const permissionNumber = {
      '2': otherpermission.roleCount,
      '1': otherpermission.areaCount,
      '7': otherpermission.flagCount,
      '100': otherpermission.resourceCount
    };
    const permissionTypes = {
      '2': 'roleCount',
      '1': 'areaCount',
      '7': 'flagCount',
      '100': 'resourceCount'
    };
    let validKeysForOtherPermission = [];
    Object.keys(permissionNumber).map(key => {
      if (permissionNumber[key]) {
        validKeysForOtherPermission.push(permissionTypes[key]);
      }
    });
    return (
      <div
        style={{
          height: '100%',
          marginLeft: '17px',
          position: 'relative'
        }}>
        <span
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: '50%',
            transform: 'translate(0, -50%)'
          }}>
          {t(
            validKeysForOtherPermission
              .map(validKey => paramNameMapping[validKey])
              .join('、')
          )}
          {validKeysForOtherPermission.length > 1
            ? t(
                '等各类权限需要分别确认，请您耐心操作。审核完成后请务必提交结果'
              )
            : t('审核完成后请务必提交结果')}
        </span>
      </div>
    );
  };

  getColumns = () => {
    const { t } = this.props;
    const { permissionType } = this.state;
    const customColumns =
      permissionType != '100'
        ? [
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name'
            }
          ]
        : [
            {
              title: t('数据资源ID'),
              dataIndex: 'resourceKey',
              key: 'resourceKey'
            },
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: t('数据类型'),
              dataIndex: 'resourceTypeName',
              key: 'resourceTypeName'
            },
            {
              title: t('数据敏感级'),
              dataIndex: 'riskLevel',
              key: 'riskLevel',
              render: riskLevel => (
                <span>{riskLevelNameMapping[riskLevel]}</span>
              )
            }
          ];
    return [
      {
        title: t('系统名称'),
        dataIndex: 'appName',
        key: 'appName',
        width: 180,
        fixed: 'left'
      },
      ...customColumns,
      {
        title: t('业务线'),
        dataIndex: 'businessName',
        key: 'businessName'
      },
      {
        title: t('申请时间'),
        dataIndex: 'applyDate',
        key: 'applyDate',
        render: time => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '')
      },
      {
        title: t('过期时间'),
        dataIndex: 'expireDate',
        key: 'expireDate',
        render: time => {
          if (time) {
            if (time < Date.now()) {
              return (
                <span style={{ color: 'red' }}>
                  {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              );
            } else {
              return moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
          } else {
            return '';
          }
        }
      },
      {
        title: t('权限状态'),
        dataIndex: 'permissionStatus',
        key: 'permissionStatus',
        width: 80,
        fixed: 'right',
        render: value => {
          return value == 1 ? (
            <span style={{ color: 'green' }}>{t('待保留')}</span>
          ) : (
            <span style={{ color: 'red' }}>{t('待删除')}</span>
          );
        }
      }
    ];
  };
  // 点击步骤条回调
  onStepChange = currentStep => {
    const { stepStatus, stepToPermissionType } = this.state;

    const type = stepToPermissionType[currentStep];
    // 当前点击变为正在查看，并且状态改为已经浏览
    for (let prop in stepStatus) {
      if (type == prop) {
        stepStatus[prop].status = 'process';
        stepStatus[prop].isWatched = true;
      } else {
        stepStatus[prop].status = 'wait';
      }
    }
    this.filterForm.resetFields();

    this.setState(
      {
        permissionType: type || '',
        currentPage: 1,
        filterParams: {
          appId: '',
          permissionName: '',
          businessId: '',
          resourceTypeIdList: '',
          riskLevelList: '',
          fuzzySearch: ''
        },
        currentStep,
        stepStatus: {
          ...stepStatus
        }
      },
      () => {
        setTimeout(() => {
          this.search();
        }, 200);
      }
    );
    // this.setState({ currentStep });
  };

  // 点击下一步
  nextStep = () => {
    const { stepToPermissionType } = this.state;
    // 如果是最后一个则什么都不做
    const lastType = Object.keys(stepToPermissionType)[
      Object.keys(stepToPermissionType).length - 1
    ];

    if (this.state.currentStep == lastType) return;
    this.onStepChange(this.state.currentStep + 1);
  };

  render() {
    const {
      t,
      otherpermission,
      // global = {},
      otherPermissionData = {},
      loading
    } = this.props;

    const {
      // businessId,
      // expire,
      tableSelectedRows,
      permissionType,
      reservedList,
      userNameList,
      currentStep,
      stepStatus,
      stepToPermissionType
    } = this.state;

    const {
      // current,
      // size,
      total,
      records
    } = otherPermissionData;
    const permissionNumber = {
      '2': otherpermission.roleCount,
      '1': otherpermission.areaCount,
      '7': otherpermission.flagCount,
      '100': otherpermission.resourceCount
      // '3': otherpermission.reportCount,
      // '4': otherpermission.templateCount,
      // '5': otherpermission.indicatorCount,
      // '13': otherpermission.dataSetCount
    };
    const permissionTypes = {
      '2': '角色',
      '1': '地区',
      '7': '标识位',
      '100': '数据资源'
    };

    let deleteNumer = '';
    if (reservedList[permissionType]) {
      deleteNumer =
        permissionNumber[permissionType] - reservedList[permissionType].length;
    } else {
      deleteNumer = permissionNumber[permissionType];
    }

    const rowSelection = {
      selectedRowKeys: tableSelectedRows[permissionType]
        ? tableSelectedRows[permissionType].map(item => item.relId)
        : [],
      // onChange: (selectedRowKeys, selectedRows) => {
      //   console.log(selectedRows)
      //   if (selectedRows.length) {
      //     const validSelectedRows = _.filter(selectedRows, (item) => {
      //       return _.findIndex(tableSelectedRows[permissionType] || [], i => i.relId === item.relId) === -1;
      //     });

      //     this.setState({
      //       tableSelectedRows: {
      //         ...tableSelectedRows,
      //         [permissionType]: [
      //           ...(tableSelectedRows[permissionType] || []),
      //           ...validSelectedRows
      //         ]
      //       }
      //     });
      //   } else {
      //     this.deleteSelectdRows(permissionType, records.map(i => i.relId));
      //   }
      // },
      onSelect: (record, selected) => {
        if (selected) {
          const newTableSelectedRows = JSON.parse(
            JSON.stringify(this.state.tableSelectedRows)
          );
          newTableSelectedRows[permissionType].push(record);
          this.setState({
            tableSelectedRows: newTableSelectedRows
          });
        } else {
          this.deleteSelectdRows(permissionType, record.relId);
        }
      },
      onSelectAll: selected => {
        if (selected) {
          this.setState({
            tableSelectedRows: {
              ...tableSelectedRows,
              [permissionType]: [
                ...(tableSelectedRows[permissionType] || []),
                ...records
              ]
            }
          });
        } else {
          this.deleteSelectdRows(permissionType, records.map(i => i.relId));
        }
      }
    };
    // const tabName = tabIdNameMapping[this.state.permissionType];
    const hasSelected = tableSelectedRows[permissionType].length > 0;
    const stepStyle = {
      boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      fontSize: '16px'
    };

    const lastType = Object.keys(stepToPermissionType)[
      Object.keys(stepToPermissionType).length - 1
    ];
    let isShowSubmitBtn = true;

    for (let prop in stepStatus) {
      if (stepStatus[prop].status == 'process') {
        stepStatus[prop].lastStatus = 'process';
      } else {
        if (stepStatus[prop].isWatched) {
          stepStatus[prop].lastStatus = 'finish';
        } else {
          stepStatus[prop].lastStatus = 'wait';
        }
      }
      if (stepStatus[prop].lastStatus == 'wait') {
        isShowSubmitBtn = false;
      }
    }

    return (
      <Layout style={{ overflow: 'hidden' }}>
        <Sider
          theme="light"
          width="205"
          style={{ marginRight: '16px', padding: '4px' }}>
          <Search placeholder="搜索" onChange={this.fuzzySearch} />
          <Menu
            className="main-menu"
            mode="inline"
            defaultOpenKeys={['user']}
            selectedKeys={[this.state.username]}>
            <Menu.SubMenu
              key="user"
              title={
                <span>
                  <IconFont type="icon-quanxianguanli" />
                  <span>{t('待审核')}</span>
                </span>
              }>
              {userNameList &&
                userNameList.map(item => {
                  return (
                    <Menu.Item
                      key={item.username}
                      onClick={() =>
                        this.changeUsername(item.username, item.usernameZh)
                      }>
                      {item.usernameZh}
                    </Menu.Item>
                  );
                })}
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Row
            gutter={24}
            style={{
              position: 'relative',
              height: '48px',
              width: '100%',
              margin: 0,
              fontSize: '14px',
              background: '#FEFBE6',
              border: '1px solid #FCE58F'
            }}>
            <Col
              span={15}
              style={{
                position: 'relative',
                height: '48px'
              }}>
              <span
                className="iconfont iconzhuyishixiang_f"
                style={{
                  color: '#ff7d4c',
                  position: 'absolute',
                  left: '12px',
                  top: '12px'
                }}></span>
              {this.state.username ? (
                this.getReminder()
              ) : (
                <span
                  style={{
                    position: 'absolute',
                    left: '32px',
                    top: '12px'
                  }}>
                  {t('无待审核人')}
                </span>
              )}
            </Col>

            <div style={{ position: 'absolute', right: '0px', top: '8px' }}>
              {Object.keys(stepStatus).length > 1 &&
              this.state.currentStep != lastType ? (
                <Button
                  type="primary"
                  style={{ marginRight: '8px' }}
                  onClick={this.nextStep}>
                  {t('下一步')}
                </Button>
              ) : null}
              <Button
                style={{ marginRight: '8px', background: '#FEFBE6' }}
                onClick={this.giveupChanges}>
                {t('放弃修改')}
              </Button>
              <Tooltip
                placement="bottom"
                arrowPointAtCenter
                title={
                  !isShowSubmitBtn
                    ? this.state.currentStep != lastType
                      ? t('您还有尚未审核的权限，请点击下一步进行操作')
                      : t('您还有尚未审核的权限类型')
                    : null
                }
                overlayClassName="submitTootip">
                <Button
                  type="primary"
                  style={{ marginRight: '24px' }}
                  onClick={this.confirmRemain}
                  ghost={!isShowSubmitBtn}
                  disabled={!isShowSubmitBtn}>
                  {t('提交结果')}
                </Button>
              </Tooltip>
            </div>
          </Row>
          <div className="permission-confirm">
            <Card style={{ marginBottom: '24px', border: 0 }}>
              <div className="header-steps">
                <Steps
                  type="navigation"
                  size="small"
                  current={currentStep}
                  onChange={value => this.onStepChange(value)}
                  style={Object.keys(stepStatus).length > 0 ? stepStyle : null}>
                  {Object.keys(stepStatus).map(item => {
                    return (
                      <Step
                        key={item}
                        status={stepStatus[item] && stepStatus[item].lastStatus}
                        title={
                          t(permissionTypes[item]) +
                          `(${permissionNumber[item] || 0})`
                        }
                      />
                    );
                  })}
                </Steps>
              </div>
              <div className="content-area">
                <FilterForm
                  ref={ref => {
                    this.filterForm = ref;
                  }}
                  permissionType={permissionType}
                  search={this.handleSearchFromFilterForm}
                />
              </div>
            </Card>

            <div className="content-area content-table">
              <div className="batch-options">
                <div style={{ position: 'absolute', right: '0px', top: '0px' }}>
                  <span style={{ color: 'red', marginRight: '20px' }}>
                    {t('修改权限状态')}
                  </span>
                  <Button
                    type="primary"
                    onClick={this.setReserved}
                    disabled={!hasSelected}
                    ghost={!hasSelected}>
                    {t('设置为保留')}
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.setDeleted}
                    disabled={!hasSelected}
                    ghost={!hasSelected}>
                    {t('设置为删除')}
                  </Button>
                </div>
              </div>
              <div>
                <Tag
                  style={{
                    height: '40px',
                    fontSize: '14px',
                    background: '#FEFBE6',
                    lineHeight: '40px',
                    width: '100%',
                    border: '1px solid #FCE58F'
                  }}>
                  <span
                    className="iconfont iconzhuyishixiang_f"
                    style={{ color: '#ff7d4c' }}></span>
                  {t('原有')}
                  {tabIdNameMapping[permissionType]}
                  {t('类型权限共')}
                  <span style={{ color: '#ff7d4c' }}>
                    {permissionNumber[permissionType] || 0}
                  </span>
                  {t('条 | 待保留权限')}
                  <span style={{ color: '#ff7d4c' }}>
                    {reservedList[permissionType]
                      ? reservedList[permissionType].length
                      : 0}
                  </span>
                  {t('条，待删除权限')}
                  <span style={{ color: '#ff7d4c' }}>{deleteNumer || 0}</span>
                  {t('条')}
                </Tag>
              </div>
              <Table
                dataSource={records}
                // size="small"
                // scroll={{ x: 900 }}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showSizeChanger: true,
                  total,
                  onChange: this.handlePageChange,
                  onShowSizeChange: this.onShowSizeChange,
                  showTotal: total => `共 ${total} 条`,
                  showQuickJumper: true,
                  pageSizeOptions: ['10', '20', '50']
                }}
                className="upm-table"
                rowKey="relId"
                loading={loading}
                rowSelection={rowSelection}
                columns={this.getColumns()}
              />
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  ({ entrance, global, permissionList, userInfo, newApply }) => {
    return {
      // global,
      // ...entrance,
      // appId: global.globalAppId,
      // permissionData: permissionList.permissionData,
      otherpermission: entrance.otherpermission,
      otherPermissionData: permissionList.otherPermissionData,
      loading: permissionList.loading,
      apps: global.apps,
      // userInfo,
      userNames: permissionList.userNames
      // projectList: newApply.projectList
    };
  }
)(PermissionConfirm);
