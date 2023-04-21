import React from 'react';
import ContentCard from '../../../components/ContentCard';
import connect from '@utils/translateConnect';
import ApplyForm from './ApplyForm';
import InfoCard from './InfoCard';

const FORMWIDTH = 650;

class FastApply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, wikiHost } = this.props;

    return (
      <ContentCard title={t('网约车区域系统权限申请')} promptInfo={t('待提交')}>
        <div style={{ width: FORMWIDTH, float: 'left' }}>
          <ApplyForm />
        </div>
        <div style={{ marginLeft: FORMWIDTH }}>
          <InfoCard
            style={{
              border: '1px solid red',
              borderRadius: '5px',
              wordBreak: 'break-word',
              padding: '10px',
            }}
            title={t('小桔大礼包使用说明')}
            wikiHost={wikiHost}
          />
        </div>
      </ContentCard>
    );
  }
}

export default connect(({ global }) => {
  return {
    wikiHost: global.wikiHost,
  };
})(FastApply);
