import { BIG_DATA_APP_ID } from '@config/bigData';

const isBigData = (appId) => !!BIG_DATA_APP_ID[appId];

export default isBigData;
