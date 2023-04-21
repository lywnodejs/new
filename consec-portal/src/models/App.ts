import { observable } from 'mobx'
import { t } from '../utils/index'
/**
 * 维护全局状态
 */
export interface IApp {
  menus: any
}

export default class App implements IApp {
  @observable menus = [
    {
      title: t('产品能力'),
      list: [
        {
          text: t('文本审核'),
          url: '/capacity/text'
        },
        {
          text: t('图片审核'),
          url: '/capacity/img'
        },
        {
          text: t('音频审核'),
          url: '/capacity/audio'
        },
        {
          text: t('视频审核'),
          url: '/capacity/video'
        },
        {
          text: t('人工审核'),
          url: '/capacity/person'
        },
        {
          text: t('用户管控'),
          url: '/capacity/user'
        },
        {
          text: t('投诉申诉'),
          url: '/capacity/complaint'
        },
      ]
    },
    {
      title: t('解决方案'),
      list: [
        {
          text: t('PGC场景'),
          url: '/solve/PGC'
        },
        {
          text: t('UGC场景'),
          url: '/solve/UGC'
        },
        {
          text: t('IM消息'),
          url: '/solve/IM'
        },
        {
          text: t('用户信息'),
          url: '/solve/user'
        },
        {
          text: t('消息通知场景'),
          url: '/solve/shorNote'
        },
        {
          text: t('文件存储场景'),
          url: '/solve/file'
        },
      ]
    },
    {
      title: t('在线检测'),
      list: [
        {
          text: t('文本检测'),
          url: '/detection/text'
        },
        {
          text: t('图片检测'),
          url: '/detection/img'
        },
        {
          text: t('音频检测 (敬请期待)'),
          url: '',
          undone: true
        },
        {
          text: t('视频检测 (敬请期待)'),
          url: '',
          undone: true
        },
      ]
    },
    {
      title: t('帮助中心'),
      list: [
        {
          text: t('接入流程'),
          url: '/help/joinFlow'
        },
        {
          text: t('接口说明'),
          url: '/help/interface',
          children: [
            {
              text: t('机器审核'),
              url: '/help/interface/machine',
            },
            {
              text: t('人工审核结果回调'),
              url: '/help/interface/preson',
            },
            {
              text: t('用户管控'),
              url: '/help/interface/usercontrol',
            },
            {
              text: t('投诉'),
              url: '/help/interface/complain',
            },
            {
              text: t('申诉'),
              url: '/help/interface/appeal',
            }
          ]
        },
        {
          text: t('常见问题'),
          url: '/help/problem'
        }
      ]
    },
  ]

}


