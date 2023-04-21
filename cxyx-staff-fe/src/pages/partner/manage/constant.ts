import { easyConstMap } from '@/utils/data';

export const PARTNER_STATUS = easyConstMap({
  CLOSE: {
    key: 0,
    name: '禁用',
  },
  OPEN: {
    key: 1,
    name: '启用',
  },
});


export const COMPANYTYPE = [
  {
    name: '中心厂',
    value: '',
  },
  {
    name: '网格站',
    value: '',
  },
  {
    name: '其他',
    value: '',
  },
]