import React, { PureComponent } from 'react';
import style from './index.less';

class Partner extends PureComponent {
  render() {
    return <>{this.props.children}</>;
  }
}
export default Partner;
