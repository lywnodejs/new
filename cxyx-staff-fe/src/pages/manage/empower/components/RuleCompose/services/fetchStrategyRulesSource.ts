import { request } from '@/utils/api/request';
import { addBaseHostPrefix } from '@/utils/data';
import { ApiCacheService } from '@/utils/api-cache-service';
import { IStrategyRule } from '../interface';

const API = addBaseHostPrefix({
  getParamRuleSource: '/staff/strategy/getParamRuleSource',
});

export const StrategyRulesRequestService = new ApiCacheService<IStrategyRule[]>(
  () => {
    return request.get(API.getParamRuleSource).then((data: any) => {
      return data.data;
    });
  },
  () => 'AlwaysHitCache',
);
