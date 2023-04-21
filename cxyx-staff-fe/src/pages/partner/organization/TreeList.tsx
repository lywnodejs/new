import React, { useEffect, useState, useRef } from 'react';
import { Tree, Card, Input, Button, message, Space, Modal, Form } from 'antd';
import {
  BankOutlined,
  ShopOutlined,
  TableOutlined,
  ExclamationCircleOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import style from './style.less';
import {
  deleteOrganizationNode,
  fetchOrganizationList,
} from '@/utils/api/organization';
import NodeAddModal from './component/NodeAddModal';
import TreeTable from './component/TreeTable';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import {
  addTableParams,
  watchTableParams,
} from '@/components/EasyTable/EasyParamStore';

const { confirm } = Modal;

const TreeList = props => {
  const treeRef: any = useRef()
  const [treeData, setTreeData] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>();
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [changedParent, setChangedParent] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<any>(['0']);
  const [searchTxt, setSearchTxt] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [orgType, setOrgType] = useState<any>('GW');

  useEffect(() => {
    setCardLoading(true);
    fetchData(-1, 'GW').finally(() => {
      setCardLoading(false);
    });
    watchTableParams(params => {
      const id = _.get(params, 'changedParentId');
      const parent = { id };
      id && setChangedParent(parent);
    }, 'node_tree');
  }, []);

  useEffect(() => {
    changedParent && fetchData(changedParent.id);
  }, [changedParent]);

  useEffect(() => {
    'function' === typeof props.onChange && props.onChange(selectedNode);
  }, [selectedNode]);

  // 递归为某个节点添加一层子节点
  function updateTreeData(tree, key, children) {
    if (0 === tree.length) {
      return children;
    }
    return tree.map(node => {
      if (node.key == key) {
        children.forEach(item => {
          if (item.key !== key) {
            // 新增的时候排除父节点为自己的情况
            // 保留已经展开的子集
            const res = _.find(node.children, { key: item.key });
            res && (item.children = res.children);
          }
        });
        return {
          ...node,
          children,
        };
      } else if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  }

  // 格式化全量树
  const formatTreeData = (parentOrgId, dataList) => {
    const tree = [];
    Array.isArray(dataList) &&
      dataList.forEach(item => {
        if (item.parentOrgId == parentOrgId) {
          tree.push({
            title: item.orgName,
            key: item.orgId,
            type: item.orgType,
            relAreaCode: item.relAreaCode,
          });
        }
      });
    tree.forEach(item => {
      const res = formatTreeData(item.key, dataList);
      if (res.length > 0) {
        item.children = [...item.children, ...res];
      }
    });
    return tree;
  };

  const formatItem = (item, father) => {
    let icon;
    switch (item.orgType) {
      case NODE_TYPE_MAP.WAREHOUSE.key:
        icon = <BankOutlined style={{ color: 'blue' }} />;
        break;
      case NODE_TYPE_MAP.LITTLE_STORE.key:
        icon = <ShopOutlined style={{ color: 'orange' }} />;
        break;
      case NODE_TYPE_MAP.GRID_WAREHOUSE.key:
        icon = <TableOutlined style={{ color: 'green' }} />;
        break;
      default:
        icon = <PartitionOutlined />;
    }

    const node: any = {
      title: item.orgName,
      key: item.orgId,
      type: item.orgType,
      relAreaCode: item.relAreaCode,
      father,
      disabled: item.childrenNum !== 0
    };

    icon && (node.icon = icon);
    if (0 == item.childrenNum) {
      node.isLeaf = true;
    } else {
      node.isLeaf = false;
    }
    return node;
  };

  const orgTypeChange = (val) => {
    // setTreeData([]);
    setSearchTxt('');
    setSearchVal('');
    setOrgType(val);
    setSelectedNode({});
    setExpandedKeys([])
    fetchData(-1, val);
  }

  // 获取某一层数据
  const fetchData = (parentId, val?) => {
    let params = {
      orgType: val,
      parentId
    }
    return fetchOrganizationList(params).then(res => {
      if (res) {
        if (0 == res.errno) {
          const data = _.get(res, 'data', []);
          const children = [];
          data.map(item => {
            item.disabled = item.childrenNum === 0
            children.push(formatItem(item, parentId))
          });
          const newTree = updateTreeData(
            -1 === parentId ? [] : treeData,
            parentId, children);

          setTreeData(newTree);
        } else {
          message.error(res.errmsg);
        }
      }
      return Promise.resolve();
    });
  };

  const handleLoadData = param => {
    console.log(param);
    const { key, children } = param;

    return new Promise(resolve => {
      if (children) {
        resolve();
        return;
      }
      fetchData(key).finally(() => {
        resolve();
      });
    });
  };

  const onSelect = (selectedKeys, info) => {
    if (info.selected) {
      setSelectedNode(info.node);
    } else {
      setSelectedNode({});
    }

    // if (info.selected) {
    //   if (info.node.isDisabled === true) {
    //     // handleExpand([info.key])
    //     handleLoadData(info.node);
    //     // setExpandedKeys(info.key);

    //     let arr = expandedKeys;
    //     arr.push(info?.node.key);
    //     setExpandedKeys(arr);
    //     setSelectedNode({});

    //   } else {
    //     setSelectedNode(info.node);
    //   }
    // } else {
    //   setSelectedNode({});
    // }
  };

  const handleExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const findNodeByTitle = (name, tree) => {
    const res = [];
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.title.toString().indexOf(name) > -1) {
        res.push(node.key);
      }
      if (node.children) {
        res.push(...findNodeByTitle(name, node.children));
      }
    }
    return res;
  };

  const handleSearchChange = value => {
    setSearchTxt(searchVal);
    // if(!value) {
    //   let expandedKeys = findNodeByTitle(value, treeData);
    //   setExpandedKeys(expandedKeys);
    //   setAutoExpandParent(true);
    // }
  };

  const handleDeleteNode = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <h3>删除节点「{selectedNode.title}」</h3>
          <p>将删除该节点及下挂所有节点信息，不能恢复，是否确认删除？</p>
        </>
      ),
      onOk() {
        deleteOrganizationNode(selectedNode.key).then(res => {
          if (0 == res.errno) {
            message.success('删除节点成功');
            addTableParams(
              { changedParentId: selectedNode.father },
              'node_tree',
            );
          } else {
            message.error(res.errmsg);
          }
        });
      },
      onCancel() { },
    });
  };
  const clickTableItem = item => {
    setSelectedNode({
      ...item,
      title: item.orgName,
      key: item.orgId,
      type: item.orgType,
      relAreaCode: item.relAreaCode,
    });
  };

  return (
    <Card loading={cardLoading}>
      <span>实体类型：</span>
      <NodeTypeSelect
        style={{ 'width': '76%', marginBottom: '10px' }}
        onChange={(val) => { orgTypeChange(val) }}
        defaultValue={'GW'}
      />

      {/* 暂时不完全去掉 先屏蔽 */}
      {/* <Button
            // disabled={_.isEmpty(selectedNode) || !!searchTxt}
            size={'small'}
            type={'primary'}
            onClick={() => setAddModalVisible(true)}
          >
            添加
          </Button>
          <Button
            disabled={_.isEmpty(selectedNode) || !!searchTxt}
            size={'small'}
            type={'primary'}
            danger={true}
            onClick={handleDeleteNode}
          >
            删除
          </Button> */}
      {/* </Space> */}
      {/* </div> */}
      <div className={style.searchLine}>
        <Input.Search placeholder="查找节点" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onSearch={handleSearchChange} />
      </div>

      {
        searchTxt ? (
          <TreeTable txt={searchTxt} onClick={clickTableItem} orgType={orgType} />
        ) : (
          <Tree
            ref={treeRef}
            style={{ maxHeight: 'calc(100vh - 230px)', overflow: 'auto' }}
            key={JSON.stringify(treeData)}
            showLine={{ showLeafIcon: false }}
            showIcon={true}
            onSelect={onSelect}
            // @ts-ignore
            loadData={handleLoadData}
            treeData={treeData}
            onExpand={handleExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          />
        )
      }
      <NodeAddModal
        node={selectedNode}
        isModalVisible={addModalVisible}
        closeModal={() => {
          setAddModalVisible(false);
        }}
      />
    </Card >
  );
};

export default TreeList;
