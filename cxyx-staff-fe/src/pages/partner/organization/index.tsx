import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import NodeInfo from '@/pages/partner/organization/NodeInfo';
import TreeList from '@/pages/partner/organization/TreeList';
import style from './style.less';

export const Organization = () => {
  const [selectedNode, setSelectedNode] = useState<any>();
  const [loading, setLoading] = useState(false);
  const handleTreeChange = node => {
    setSelectedNode(node);
  };
  return (
    <Spin tip="节点信息加载中..." spinning={loading}>
      <Row gutter={24} className={style.mainContent}>
        <Col span={8}>
          <TreeList onChange={handleTreeChange} />
        </Col>
        <Col span={16} style={{ paddingLeft: 0 }}>
          <NodeInfo
            selectedNode={selectedNode}
            setLoading={value => setLoading(value)}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Organization;
