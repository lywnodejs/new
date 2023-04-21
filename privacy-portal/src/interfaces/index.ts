import { RouterStore } from 'mobx-react-router'
import { IApp } from '../models/App'
import { IUserModel } from '../models/User'
import { IExample } from '../models/Example'
// import { INoticeModel } from '../models/Notice'
// import { IPresentModel } from '../models/Present'
import { IHomeModel } from '../models/Home'
// import { IDictionary } from '../models/Dictionary'
// import { ILoopHoleModel } from '../models/LoopHole'
// import { IRank } from '../models/Ranks'
// import { IRewardModel } from '../models/Reward'
// import { ITeamModel } from '../models/Team'
import { ICarouselModel } from '../models/Carousel'
import { IGetContentModel } from '../models/GetContent'
import { IDisplayedAppsModel } from '../models/DisplayedApps'
import { IDropDownModel } from '../models/DropDown'
import { IFeedbackModel } from '../models/Feedback'
import { ILanguageModel } from '../models/Language'

// export { INotice as INotice } from '../models/Notice'
// export { IPresent as IPresent } from '../models/Present'
export { IUser as IUser } from '../models/User'
// export { ILoopHoleComment as ILoopHoleComment } from '../models/LoopHole'
// export { ILoopHole as ILoopHole } from '../models/LoopHole'

// export { IGeneralPolicy as IGeneralPolicy } from '../models/GeneralPolicy'

export interface IBase {
  router?: RouterStore
  app?: IApp
  // language?: ILanguageModel
}

export interface ILanguageModel extends IBase {
  language: ILanguageModel
}

export interface IFeedbackModel extends IBase {
  feedback?: IFeedbackModel
}

export interface IDropDownModel extends IBase {
  dropDown?: IDropDownModel
}

export interface IDisplayedAppsModel extends IBase {
  displayedApps?: IDisplayedAppsModel
}

export interface ICarouselModel extends IBase {
  carousel?: ICarouselModel
}

export interface IGetContentModel extends IBase {
  getContent?: IGetContentModel
}

export interface IUserModel extends IBase {
  user?: IUserModel
}

export interface IExample extends IBase {
  example: IExample
}

export interface IPresentModel extends IBase {
  present: IPresentModel,
  user: IUserModel
}

export interface IHomePage extends IBase {
  // notice: INoticeModel
  present: IPresentModel
  home: IHomeModel,
  user: IUserModel
}
//
// export interface INoticePage extends IBase {
//   dictionary: IDictionary
//   notice: INoticeModel
// }

// export interface ILoopholePage extends IBase {
//   dictionary: IDictionary
//   loophole: ILoopHoleModel
//   user: IUserModel
// }
//
// export interface IRankModel extends IBase {
//   rank: IRank,
//   user: IUserModel
// }
//
// export interface IRewardModel extends IBase {
//   reward: IRewardModel
// }

export interface ITeamModel extends IBase {
  team?: ITeamModel
  user?: IUserModel
}

// export interface IGeneralPolicy extends IBase {

// }
