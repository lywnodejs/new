import React from 'react';
import { Card } from 'antd';
import GuideText from './GuideText';
import GuideFooter from './GuideFooter';

const GuidePage = () => {
  return (
    <Card
      style={{ padding: '20px', background: '#F8F8F8', marginBottom: '20px' }}
    >
      <GuideText showCard />
      <GuideFooter />
    </Card>
  );
};

export default GuidePage;
