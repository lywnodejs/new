import App from '../models/App'
import UserModel from '../models/User'
import ExampleModel from '../models/Example'
// import NoticeModel from '../models/Notice'
// import PresentModel from '../models/Present'
import HomeModel from '../models/Home'
// import DictionaryModel from '../models/Dictionary'
// import LoopHoleModel from '../models/LoopHole'
// import IRank from '../models/Ranks'
// import RewardModel from '../models/Reward'
// import TeamModal from '../models/Team'
import CarouselModel from '../models/Carousel'
import GetContentModel from '../models/GetContent'
import DisplayedApps from '../models/DisplayedApps'
import DropDown from '../models/DropDown'
import Feedback from '../models/Feedback'
import Language from '../models/Language'

export interface IStore {}

export default {
  app: new App(),
  user: new UserModel(),
  example: new ExampleModel(),
  // notice: new NoticeModel(),
  // present: new PresentModel(),
  home: new HomeModel(),
  // dictionary: new DictionaryModel(),
  // loophole: new LoopHoleModel(),
  // rank: new IRank(),
  // reward: new RewardModel(),
  // team: new TeamModal(),
  carousel: new CarouselModel(),
  getContent: new GetContentModel(),
  displayedApps: new DisplayedApps(),
  dropDown: new DropDown(),
  feedback: new Feedback(),
  language: new Language()
}
