import { observable } from 'mobx'


export interface ILanguageModel {
  lang: any
}

export default class Language implements ILanguageModel {
  @observable lang: 'zh_CN'
}
