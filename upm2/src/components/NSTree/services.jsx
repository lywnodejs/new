// import Sso from '@didi/dd-rc-sso';
import request, { postJSON } from '../../utils/request';

const TIMEOUT = 10000;

export function transferXhrToPromise(xhr, processDone, processFail) {
  return new Promise(function (resolve, reject) {
    xhr.done(res => {
      if (_.isFunction(processDone)) {
        resolve(processDone(res));
      } else {
        resolve(res);
      }
      delete xhr.responseJSON;
      delete xhr.responseText;
    }).fail(res => {
      if (_.isFunction(processFail)) {
        reject(processFail(res));
      } else {
        reject(res);
      }
    });
  });
}

export async function getTreeXhr(treeApi, data) {
  return await request(`/v2/privilegeGroup/monitor/findOdinTree`,{ params: data })
}

export async function getAllTreeXhr(treeApi, data) {
  return await request(`/v2/privilegeGroup/monitor/findOdinTree`,{ params: data })
}

export function getCollectListXhr(treeApi) {
  return request(`${treeApi}/auth/v2/ns/collect/list`, {
    dataType: 'json',
    timeout: TIMEOUT,
    error: () => {},
  });
}

export function collectNs(treeApi, ns, type) {
  return postJSON(`${treeApi}/auth/v2/ns/collect/add`, { ns, default: type });
}

export function cancelCollectNs(treeApi, ns) {
  return postJSON(`${treeApi}/auth/v2/ns/collect/delete`, { ns });
}
