import React from 'react';
import connect from '@utils/translateConnect';

import './index.less';

class Blank extends React.Component {

  render() {
    const { t } = this.props;

    return (
      <div className="manage-blank" >
        <p className="blank-hint" >{t('请在左侧菜单列表中选择具体的管理项')}</p>
      </div>
    );
  }
}

export default connect()(Blank);
