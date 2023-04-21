import { translate } from 'react-i18next';
import { connect } from 'dva';

// i18n的translate + redux的connect 语法糖
export default (mapStateToProps, mapDispatchToProps) => (component) => {
  return translate(/* namespace */)(
    connect(mapStateToProps, mapDispatchToProps)(component)
  );
};
