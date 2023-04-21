import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Tree, Card, Input, Descriptions, Tag, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import JurisdictionPersonSelect from './JurisdictionPersonSelect';
import style from './style.less';
import _ from 'lodash';
import PermissionButton from '@/components/PermissionButton';
import { getStaffDept, getManagerBydeptID, isStaffSystemSuperOrInnerManagerRole, addDeptAgent } from '@/utils/api/internals';

export const Internals = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [butLoading, setButLoading] = useState(false);
  const [jurisdictionButLoading, setJurisdictionButLoading] = useState(false);

  const [bigAgentLdaps, setBigAgentLdaps] = useState(false); // 显示影藏
  const [bigAgentLdapsVal, setBigAgentLdapsVal] = useState([]); //选择值
  const [bigAgentLdapsDefault, setBigAgentLdapsDefault] = useState([]); //  选项

  const [smallAgentLdaps, setSmallAgentLdaps] = useState(false);
  const [smallAgentLdapsVal, setSmallAgentLdapsVal] = useState([]);
  const [smallAgentLdapsDefault, setSmallAgentLdapsDefault] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(true);
  const [lastValue, setLastValue] = useState('');
  const [dataList, setDataList] = useState([]);
  const [details, setDetails] = useState({
    managername: '',
    managerid: '',
    ldap: '',
    bigAgentLdaps: [],
    smallAgentLdaps: [],
    jobDutys: []
  });
  const { Search } = Input;

  useEffect(() => {
    getStaffDept().then(res => {
      setTreeData(res.data.children);
      generateList(res.data.children);
      setLoading(false);
    });
    // 查询接口是否有权限编辑
    // isStaffSystemSuperOrInnerManagerRole().then(res => {
    //   if (res) { setIsGlobal(res.data) }
    // })
  }, []);

  // tree组件

  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { value } = node;
      let arr: any = dataList;
      arr.push({ key: value, title: node.title });
      setDataList(arr);
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  // 选择节点
  const onSelect = (selectedKeys, info) => {
    if (lastValue !== info.node.key) {
      // 判断上一次点击的值 防抖
      setLastValue(info.node.key);
      setBigAgentLdaps(false);
      setSmallAgentLdaps(false);
      setIsLoading(true);
      getManagerBydeptID({ deptId: info.node.key }).then(res => {
        setDetails(res.data);
        setIsLoading(false);
      });
    }
  };
  const resetData = () => {
    setIsLoading(true);
    getManagerBydeptID({ deptId: lastValue }).then(res => {
      setDetails(res.data);
      setIsLoading(false);
      setBigAgentLdapsVal([]);
      setBigAgentLdapsDefault([]);
      setSmallAgentLdapsVal([]);
      setSmallAgentLdapsDefault([]);
    });
  }

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // 找父节点
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.value === key)) {
          parentKey = node.value;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 搜索
  const onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // 搜索创建变色节点
  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={style.site}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.value, children: loop(item.children) };
      }

      return {
        title,
        key: item.value,
      };
    });

  const addJurisdictionPerson = type => {
    if (type === 1) {
      setButLoading(true);
    } else {
      setJurisdictionButLoading(true);
    }
    let params = {
      agentType: type,
      deptId: lastValue,
      ldaps: ''
    };
    if (type === 1) {
      params.ldaps = bigAgentLdapsVal.join(',')
    } else {
      params.ldaps = smallAgentLdapsVal.join(',')
    }
    addDeptAgent(params).then(res => {
      if (res && res.errno === 0) {
        message.success('添加成功');
        setBigAgentLdaps(false);
        setSmallAgentLdaps(false);
        resetData();
      } else {
        message.error(res.errmsg)
      }
    }).finally(() => {
      setButLoading(false);
      setJurisdictionButLoading(false);
    })
  }

  const setAgentLdaps = val => {
    if (Array.isArray(val) && val.length !== 0) {
      return val.map(item => {
        return <span style={{ marginRight: '5px', marginTop: '4px' }}> {item.name} ( {item.ldap} ) </span>

      })
    } else {
      return '-'
    }
  }

  return (
    <Spin tip="节点信息加载中..." spinning={loading}>
      <Row gutter={24} className={style.mainContent}>
        <Col span={8}>
          <Card>
            <Search
              style={{ marginBottom: 8 }}
              placeholder="请输入"
              onChange={onChange}
            />
            <Tree
              style={{ maxHeight: 'calc(100vh - 190px)', overflow: 'auto' }}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(treeData)}
              showLine={true}
              onSelect={onSelect}
              showIcon={false}
            />
          </Card>
        </Col>
        <Col span={16} style={{ paddingLeft: 0 }}>
          <Card loading={isLoading} title="详情">
            {details.managername == '' &&
              details.managerid == '' &&
              details.ldap == '' ? null : (
              <Descriptions column={1}>
                <Descriptions.Item label="负责人">
                  {details.managername}
                </Descriptions.Item>
                <Descriptions.Item label="工号">
                  {details.managerid}
                </Descriptions.Item>
                <Descriptions.Item label="账号">
                  {details.ldap}
                </Descriptions.Item>

                <Descriptions.Item
                  label="权限代理人"
                  labelStyle={{ lineHeight: '30px' }}
                >
                  {
                    !bigAgentLdaps ?
                      <div>
                        {setAgentLdaps(details.bigAgentLdaps)}
                        {isGlobal &&
                          <PermissionButton
                            permissionUrl={'/employeeDept/addDeptAgent'}
                            type="link"
                          >
                            <EditOutlined
                              className={style.editIcon}
                              onClick={() => {
                                setBigAgentLdaps(true);
                                if (Array.isArray(details.bigAgentLdaps)) {
                                  let _default = details.bigAgentLdaps.map(item => {
                                    return item.ldap
                                  })
                                  setBigAgentLdapsVal(_default);
                                  setBigAgentLdapsDefault(details.bigAgentLdaps);
                                }
                              }}
                            />
                          </PermissionButton>
                        }
                      </div>
                      :
                      <>
                        <JurisdictionPersonSelect
                          className={style.external_person_select}
                          getData={val => {
                            setBigAgentLdapsVal(val)
                          }}
                          data={bigAgentLdapsDefault}
                          defaultValue={bigAgentLdapsVal}
                        />
                        <Button
                          style={{ margin: '0 10px' }}
                          onClick={() => {
                            setBigAgentLdaps(false);
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          loading={butLoading}
                          type={'primary'}
                          onClick={() => addJurisdictionPerson(1)}
                        >
                          保存
                        </Button>

                      </>
                  }

                </Descriptions.Item>


                <Descriptions.Item
                  label="小权限代理人"
                  labelStyle={{ lineHeight: '30px' }}
                >
                  {
                    !smallAgentLdaps ?
                      <div>
                        {setAgentLdaps(details.smallAgentLdaps)}
                        {isGlobal &&
                          <PermissionButton
                            permissionUrl={'/employeeDept/addDeptAgent'}
                            type="link"
                          >
                            <EditOutlined
                              className={style.editIcon}
                              onClick={() => {
                                setSmallAgentLdaps(true);
                                if (Array.isArray(details.smallAgentLdaps)) {
                                  let _default = details.smallAgentLdaps.map(item => {
                                    return item.ldap
                                  })
                                  setSmallAgentLdapsVal(_default);
                                  setSmallAgentLdapsDefault(details.smallAgentLdaps);
                                }
                              }}
                            />

                          </PermissionButton>
                        }
                      </div>
                      :
                      <>
                        <JurisdictionPersonSelect
                          className={style.external_person_select}
                          getData={val => {
                            setSmallAgentLdapsVal(val)
                          }}
                          data={smallAgentLdapsDefault}
                          defaultValue={smallAgentLdapsVal}
                        />
                        <Button
                          style={{ margin: '0 10px' }}
                          onClick={() => {
                            setSmallAgentLdaps(false);
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          loading={jurisdictionButLoading}
                          type={'primary'}
                          onClick={() => addJurisdictionPerson(2)}
                        >
                          保存
                        </Button>

                      </>
                  }

                </Descriptions.Item>



                <Descriptions.Item label="工作职责">
                  <div>
                    {
                      !_.isEmpty(details.jobDutys) ?
                        details.jobDutys.map(item => {
                          return (
                            <Tag
                              style={{ marginBottom: '4px' }}
                              color="warning"
                            >
                              {item.jobDutyName}
                            </Tag>
                          )
                        })
                        :
                        '-'
                    }
                  </div>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Internals;
