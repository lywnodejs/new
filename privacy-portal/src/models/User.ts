import { observable, action, runInAction, computed } from 'mobx'
import {
  logoutUser,
  getUserInfo,
  getAuthorState,
  WXLogin,
  WBLogin,
  QQLogin,
  getUserDetailInfo,
  getUserMessageInfo,
  getUserScoreInfo,
  getUserPresentInfo,
  getUserRewardInfo,
  setMessageReaded,
  removeMessage,
  saveUserInfo,
  checkUserName
} from '../services/user'

import {
  getTeamList,
  getUserTeamList,
  verifyTeamName,
  createTeam,
  applyTeam
} from '../services/team'

export interface IUser {
  id?: string
  userName?: string
  nikeName?: string
  realName?: string
  pHome?: string
  sex?: string
  headUrl?: string
  email?: string
  bind?: string
  mobile?: string
  birthday?: string
  qq?: string
  weixin?: string
  team?: string
  addr?: string
  recommender?: string
  allScore?: number
  availScore?: number
  registerTime?: string
  isStudent?: number
  schoolName?: string
  schoolGrade?: string
  schoolMajor?: string
}

export interface IUserModel {
  userInfo: IUser
  userMessageInfo: any
  userScoreInfo: any
  userPresentInfo: any
  userRewardInfo: any
  userTeamInfo: any
  id: string
  name: string
  money: number
  noticeNum: number // 未读message
  allScoreNum: number // 历史总积分
  scoreNum: number // 可用积分
  vulnsNum: number // 漏洞总数
  isLogin: boolean // 标识是否已登录
  ejectUserInfo: number // 判断是否已注册手机号
  oauthState: string
  WXLoginInfo: any
  WBLoginInfo: any
  QQLoginInfo: any
  changeUser(datas: any)
  logout(): any // 退出登录
  getUserInfo(state?: number): any
  saveUserInfo(params: any)
  getUserDetailInfo(): any
  getUserMessageInfo(params: any): any
  setMessageReaded(params?: any): any
  removeMessage(params: any): any
  getUserScoreInfo(params: any): any
  getUserPresentInfo(params: any): any
  getUserRewardInfo(params: any): any
  getAuthorState(): any
  getTeamList(params: any): any
  getUserTeamList(params: any): any
  verifyTeamName(name: string): any
  createTeam(params: any): any
  applyTeam(params: any): any
  WXLogin(params: any): any
  WBLogin(params: any): any // 微博登录接口
  QQLogin(params: any): any // QQ登录接口
  checkUserName(name: string): any
}

export default class User implements IUserModel {
  @observable
  userInfo: IUser = {
    headUrl: ''
  }

  @observable userMessageInfo: any = {}

  @observable userScoreInfo: any

  @observable userPresentInfo: any

  @observable userRewardInfo: any

  @observable userTeamInfo: any = {}

  @observable ejectUserInfo: any = 0

  id: string

  @computed
  get isLogin() {
    return !!this.name
  }

  oauthState: string

  WXLoginInfo: any

  WBLoginInfo: any

  QQLoginInfo: any

  @observable name: string

  @observable money: number

  @observable noticeNum: number
  @observable allScoreNum: number
  @observable scoreNum: number
  @observable vulnsNum: number

  constructor() {
    this.id = ''
    this.name = ''
    this.oauthState = ''
  }

  @action
  changeName(name: string) {
    this.name = name
  }

  @action
  async changeUser(data: IUser) {
    this.userInfo = {
      ...this.userInfo,
      ...data
    }
  }

  @action
  async logout() {
    const data = await logoutUser()

    return data
  }

  /**
   * 获取登录信息
   */
  @action
  async getUserInfo() {
    const data = await getUserInfo()
    runInAction(() => {
      this.name = <string>data.data && data.data.user && data.data.user.nikeName
      this.noticeNum = <number>data.data && data.data.noticeNum
      this.allScoreNum = <number>data.data && data.data.allScoreNum
      this.scoreNum = <number>data.data && data.data.scoreNum
      this.vulnsNum = <number>data.data && data.data.vulnsNum
      this.ejectUserInfo = data.data && data.data.user && data.data.user.ejectUserInfo
      this.userInfo.headUrl = data.data && data.data.user && data.data.user.headUrl
    
    })
  }

  /**
   * 获取个人资料
   */
  @action
  async getUserDetailInfo() {
    const data = await getUserDetailInfo()
    runInAction(() => {
      this.userInfo = data.data
    })
  }

  /**
   * 获取消息中心
   */
  @action
  async getUserMessageInfo(params: any) {
    const data = await getUserMessageInfo(params)
    runInAction(() => {
      this.userMessageInfo = data
    })
  }

  @action
  async saveUserInfo(params: any) {
    const data = await saveUserInfo(params)
    return data
  }

  @action
  async setMessageReaded(params: any) {
    const data = await setMessageReaded(params)
    this.getUserInfo()
    return data
  }

  @action
  async removeMessage(params: any) {
    const data = await removeMessage(params)
    this.getUserInfo()
    return data
  }

  @action
  async getUserScoreInfo(params: any) {
    const data = await getUserScoreInfo(params)
    runInAction(() => {
      this.userScoreInfo = data
    })
  }

  @action
  async getUserPresentInfo(params: any) {
    const data = await getUserPresentInfo(params)
    runInAction(() => {
      this.userPresentInfo = data
    })
  }

  @action
  async getUserRewardInfo(params: any) {
    const data = await getUserRewardInfo(params)
    runInAction(() => {
      this.userRewardInfo = data
    })
  }

  /**
   * 获取CODE
   */
  @action
  async getAuthorState() {
    const data = await getAuthorState()
    runInAction(() => {
      this.oauthState = <string>data.data
    })
  }

  @action
  async WXLogin(params: any) {
    const data = await WXLogin(params)
    runInAction(() => {
      this.WXLoginInfo = data
    })
  }

  @action
  async WBLogin(params: any) {
    const data = await WBLogin(params)
    runInAction(() => {
      this.WBLoginInfo = data
    })
  }

  @action
  async QQLogin(params: any) {
    const data = await QQLogin(params)
    runInAction(() => {
      this.QQLoginInfo = data
    })
  }

  async getTeamList(params: any) {
    const data = await getTeamList(params)

    return data
  }

  @action
  async getUserTeamList(params: any) {
    const data = await getUserTeamList(params)
    runInAction(() => {
      this.userTeamInfo = data
    })
  }

  async verifyTeamName(name: string) {
    const data = await verifyTeamName({ name })

    return data
  }

  async createTeam(params: any) {
    const data = await createTeam(params)

    return data
  }

  async applyTeam(params: any) {
    const data = await applyTeam(params)

    return data
  }

  @action
  async checkUserName(name: string) {
    const data = await checkUserName({ userName: name })
    return data
  }

}
