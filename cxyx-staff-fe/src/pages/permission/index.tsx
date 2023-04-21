import React, { PureComponent } from 'react';
import style from './index.less';

class Permission extends PureComponent {
  render() {
    return <>{this.props.children}</>;
  }
}
export default Permission;
