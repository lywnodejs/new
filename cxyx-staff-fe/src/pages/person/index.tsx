import React, { PureComponent } from 'react';
import style from './index.less';

class Person extends PureComponent {
  render() {
    return <>{this.props.children}</>;
  }
}
export default Person;
