import { observable, action } from 'mobx'

/**
 * 维护DSRC全局状态
 */
export interface IApp {
  language: any
  loginModal: boolean
  loginSessionId: string,
  userInfoModal: boolean, // 是否弹出修改用户信息框
  toggleLogin()
  changeLoginSessionId(loginSessionId: string)
  emptyLoginSessionId()
  toggleUserInfoModal()
  languageToEn()
  languageToZh()
}

export default class App implements IApp {
  @observable loginModal = false

  @observable language = 'zh_CN'

  @observable userInfoModal = false

  @observable loginSessionId = ''

  @action
  languageToEn() {
    this.language = 'en_US'
  }

  @action
  languageToZh() {
    this.language = 'zh_CN'
  }

  @action
  toggleLogin() {
    this.loginModal = !this.loginModal
  }

  @action
  toggleUserInfoModal() {
    this.userInfoModal = !this.userInfoModal
  }

  @action
  changeLoginSessionId(loginSessionId: string) {
    this.loginSessionId = loginSessionId
  }

  @action
  emptyLoginSessionId() {
    this.loginSessionId = ''
  }
}
