import { request } from '@/utils/api/request';
import { addBaseHostPrefix } from '@/utils/data';
import { ApiCacheService } from '@/utils/api-cache-service';

const API = addBaseHostPrefix({
  getRuleParamValueSource: '',
});

export const ParamValueSourceRequestService = new ApiCacheService<any>(
  (url: string) => {
    return request.get(API.getRuleParamValueSource + url).then(data => {
      return data.data;
    });
  },
  (url: string) => url,
);
