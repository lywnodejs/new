import Cookies from 'js-cookie';
const KEY_CONSTANT = {
  NameKey: 'gateway-m-sso-username',
  SSOTokenKey: 'gateway-m-sso-ticket',
  // NameKey: 'username',
  // SSOTokenKey: 'SSO_AS_SUB_TICKET',
};

const { NameKey, SSOTokenKey } = KEY_CONSTANT;

export function getSSOToken() {
  return Cookies.get(SSOTokenKey);
}

export function setSSOToken(token) {
  return Cookies.set(SSOTokenKey, token);
}

/**
 * 从cookies获取username
 */
export function getUserName() {
  return Cookies.get(NameKey);
}
/**
 * 保存username到cookies
 * @param {*} name
 */
export function setUserName(name) {
  return Cookies.set(NameKey, name);
}
/**
 * 从cookies移除username
 */
export function removeUserName() {
  return Cookies.remove(NameKey);
}

// 查找指定标识位是否有权限
export function getAuthDataByFlag(flagName: string, authFlags = []) {
  // 没有authFlags标识位数据，默认都有权限，接口请求那块有做权限，即兜底方案
  if (!authFlags || !authFlags.length) return true;
  return (authFlags || []).some(
    (flag: { name: string }) => flag.name === flagName,
  );
}
