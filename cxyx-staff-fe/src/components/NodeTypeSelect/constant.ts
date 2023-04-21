import { easyConstMap } from '@/utils/data';

export const NODE_TYPE_MAP = easyConstMap({
  WAREHOUSE: {
    key: 'WH',
    name: '中心DC仓',
  },
  GRID_WAREHOUSE: {
    key: 'GW',
    name: '网格仓',
  },
  LITTLE_STORE: {
    key: 'LS',
    name: '小店',
  },
  // CITY: {
  //   key: 'CS',
  //   name: '城市',
  // },
  GENERAL: {
    key: 'GE',
    name: '城市',
  },
});

export const NODE_TYPE_MAP_ORGANIZATION = easyConstMap({
  WAREHOUSE: {
    key: 'WH',
    name: '中心DC仓',
  },
  GRID_WAREHOUSE: {
    key: 'GW',
    name: '网格仓',
  },
  // LITTLE_STORE: {
  //   key: 'LS',
  //   name: '小店',
  // },
  // CITY: {
  //   key: 'CS',
  //   name: '城市',
  // },
  GENERAL: {
    key: 'GE',
    name: '城市',
  },
});
