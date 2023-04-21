// 职责为其他的名称
export const OTHERNAME = ['其他', '其它'];

// 响应
export enum Response {
  Success,
}

// 是否可申请 0 -> 可申请；1 -> 不可申请
export enum IsApply {
  ApplyAbled = '0',
  ApplyDisabled = '1',
}

// Modal 类型
export enum ModalType {
  ADD = 'add', // 新增
  EDIT = 'edit', // 编辑
  VIEW = 'view', // 查看
  APPLY = 'apply', // 申请
  EMPOWER = 'empower', // 赋权
}

export enum Steps {
  FirstStep,
  SecondStep,
  ThirdStep,
}

export enum Duty {
  Normal = '0', // 正常明确的岗位指责
  Other = '1', // “其他”岗位指责
}

// 加入D-Chat”孙权系统-用户咨询群“。
export const joinDcUrl =
  '//im.xiaojukeji.com/channel?uid=164768&token=5f05a7f075cf439174918922f5431724&id=1084897379600082944';

// 我得申请
export const myApplyUrl = '//bpm.didichuxing.com/process/list/self/process';

// 上报
export const reportBpmUrl =
  '//bpm.didichuxing.com/process/form/bykey/cx_sqzzsb?tenantId=cx_sqxt&jumpType=search';

// 使用手册
export const useManualUrl =
  '//wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=514986439';
