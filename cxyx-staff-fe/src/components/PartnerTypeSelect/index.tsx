import { renderOptionsByMap } from '@/utils/data';


/**
 * 节点类型选择组件
 * @param props
 * @constructor
 */
const PartnerTypeSelect = props => {
  const { companyCategory } = props;
  return renderOptionsByMap(companyCategory, 'code', 'desc', props);
};

export default PartnerTypeSelect;
