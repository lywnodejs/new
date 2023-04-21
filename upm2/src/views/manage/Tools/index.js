import React from 'react';
import connect from '@utils/translateConnect';

import ResetTool from './Reset';
import CacheTool from './Cache';
import ServiceCache from './ServiceCache';

import './index.less';

class Tools extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { t } = this.props

    return (
      <div className="my-tools">
        <div className="my-tools__tool">
          <ResetTool t={t} />
        </div>
        <div className="my-tools__tool">
          <CacheTool t={t} />
        </div>
        <div className="my-tools__tool">
          <ServiceCache t={t} />
        </div>
      </div>
    );
  }
}

// export default Tools;
export default connect(({ Tools }) => {
  return {
  };
})(Tools);
