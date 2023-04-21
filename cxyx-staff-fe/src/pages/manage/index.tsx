import React, { PureComponent } from 'react';
import style from './index.less';

class Manage extends PureComponent {
  render() {
    return <>{this.props.children}</>;
  }
}
export default Manage;
