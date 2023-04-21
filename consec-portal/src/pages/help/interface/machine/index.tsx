import * as React from 'react'
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-light.css';
import vim from 'highlight.js/lib/languages/vim';
import UseTable from '@/components/Table'
import { IBase } from '@/interfaces'
import { t } from '@/utils'

hljs.registerLanguage('vim', vim);


import './style'

const dataSource = [
  {
    text: 'id',
    name: '请求ID',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'uid',
    name: '用户id',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'content',
    name: '待检测的文本内容',
    name_class: 'String',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'contents',
    name: '待检测的文本内容',
    name_class: 'StringArray',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'url',
    name: '待检测的图片链接',
    name_class: 'String',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'urls',
    name: '待检测的批量图片链接',
    name_class: 'StringArray',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'voiceUrl',
    name: '待检测的音频链接',
    name_class: 'String',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'voiceUrls',
    name: '待检测的音频链接数组',
    name_class: 'StringArray',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'videoUrl',
    name: '待检测的视频链接',
    name_class: 'String',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'videoUrls',
    name: '待检测的视频链接数组',
    name_class: 'StringArray',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'tag',
    name: '场景标记',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'oid',
    name: '订单id',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'fromId',
    name: '发送人id',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'toId',
    name: '接收人id',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段'
  },
  {
    text: 'fromIdType',
    name: '发送人类型',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段，0表示乘客，1表示司机，2表示员工'
  },
  {
    text: 'toIdType',
    name: '接收人类型',
    name_class: 'String',
    bool: 'N',
    remark: '业务字段，0表示乘客，1表示司机，2表示员工'
  },
  {
    text: 'phone',
    name: '手机号',
    name_class: 'String',
    bool: 'N',
    remark: '手机号'
  },
  {
    text: 'bizData',
    name: '业务数据',
    name_class: 'String',
    bool: 'N',
    remark: `业务字段，

    为了方便扩展，格式为json字符串，可以添加多个自定义字段（兼容动态回调地址，参数名：callbackUrl），安全部内部解析
    
    解析后的业务字段支持加入到人工审核回调参数
    格式为："{"\bizType\":\"xxxx\",\"其他业务字段\"：\“\”}"`
  },
];
const backDataSource = [
  {
    text: 'apiCode',
    name: '风险项',
    name_class: 'Int',
    bool: 'Y',
    remark: '如：code!=200 的信息的说明“服务器异常”'
  },
  {
    text: 'apiMsg',
    name: '异常状态信息',
    name_class: 'String',
    bool: 'Y',
    remark: ''
  },
  {
    text: 'backMsg',
    name: '后端提示',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'blockUrls',
    name: '批量图片识别，key为url，value为url',
    name_class: 'StringArray',
    bool: 'N',
    remark: '适用于图片批量识别'
  },
  {
    text: 'code',
    name: '返回码',
    name_class: 'int',
    bool: 'Y',
    remark: '100000: 通过，其他不通过（不同策略对应不同code，请以邮件为主）'
  },
  {
    text: 'data',
    name: 'json字符串',
    name_class: '',
    bool: '包含以下字段',
    remark: ''
  },
  {
    text: 'extendResult',
    name: 'json字符串',
    name_class: '',
    bool: '包含以下字段',
    remark: ''
  },
  {
    text: 'frontMsg',
    name: '前端提示',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'keyword',
    name: '命中的敏感词',
    name_class: 'String',
    bool: 'N',
    remark: '适用于单条文本识别的返回'
  },
  {
    text: 'keywords',
    name: '批量文本识别命中敏感词的信息，key为文本内容，value为敏感词	',
    name_class: '',
    bool: 'N',
    remark: '	适用于文本批量识别的返回'
  }
];
const columns = [
  {
    title: t('字段'),
    dataIndex: 'text',
    key: 'text',
    width: 150
  },
  {
    title: t('名称'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('类型'),
    dataIndex: 'name_class',
    key: 'name_class',
    width: 100
  },
  {
    title: t('必填'),
    dataIndex: 'bool',
    key: 'bool',
  },
  {
    title: t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    width: 300
  },
];

interface IState {
  tabData: any,
  tabIndex: Number
}

class HelpMachine extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0,
      tabData: [
        t('调用示例'),
        t('参数详情'),
        t('调用返回详情示例')
      ]
    }
  }

  componentDidMount() {
    this.highlightCallBack();

  }

  // tab切换点击
  tabClick = (index) => {
    this.setState({
      tabIndex: index,
    })
  }
  highlightCallBack = () => {

    let ele: any = document.querySelectorAll("code")

    for (let i = 0; i < ele.length; i++) {
      try { hljs.highlightBlock(ele[i]); }
      catch (e) { console.log(e); }
    }
  };

  render() {
    const { tabData, tabIndex } = this.state;
    return (
      <div className="project-help-interface-machine">

        <div className="project-help-interface-machine__content">
          <h3>{t('接口说明')}</h3>
        </div>
        <p className="project-help-interface-machine__introduce">
          {t('敏感词过滤接口，词库支持可配置。')}
        </p>

        <div className="project-help-interface-machine__tab">
          {
            tabData.map((item, index) => {
              return (
                <span
                  onClick={() => this.tabClick(index)}
                  className={tabIndex === index ? 'interface-tab--active' : ''}
                >
                  {item}
                </span>
              )
            })
          }
        </div>

        {/* 下侧内容 */}
        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }} className="project-help-interface-machine__tabContent">
          <p>{t('接口协议：采用POST方式提交参数，编码采用UTF-8，所有参数不需要进行URLencod')}</p>
          <p>{t('URL参考：http://ip:8000/gateway?api=api&apiVersion=1.0.0')}</p>

          <h3>{t('测试接口样例')}</h3>
          <code>
            {`curl -H "Content-type:application/json" -X POST -d '{"data":{"content":"六合彩"}}' -H "didi-header-rid: 6446a2315976af4756f297987eaa0002" http://10.179.147.105:8000/sec/risk-gateway/common/risk_consec_match_keyword?apiVersion=1.0.0`}
          </code>

          <h3>{t('示例')}</h3>
          <pre>
            <code>
              {`单条内容识别：
###请求
curl -H "Content-type: application/json" -X POST -d '{"data":{"content":"麻婆豆腐六合彩","bizData":{"业务线数据，可选项"}}'
    "http://ip:8000/gateway?api=xxx&apiVersion=1.0.0"
###返回：
系统或格式错误：apicode!=200



{
  "apiCode":200,
  "apiMsg":"OK",
  "data":{
      "code":100001,
      "extendResult":[
          {
              "keyword":"{"六合彩"}"
          }
      ],
      "frontMsg":"",
      "backMsg":""
  }
}



批量内容识别
###请求
curl -H "Content-type: application/json" -X POST -d '{"data":{"contents":["麻婆豆腐六合彩","豆腐六合彩"],"bizData":{"业务线数据，可选项"}}'
    "http://ip:8000/gateway?api=xxx&apiVersion=1.0.0"
###返回：
系统或格式错误：apicode!=200



{"apiCode":200,"apiMsg":"OK","data":{"code":100001,"extendResult":[{"keywords":"{\"麻婆豆腐六合彩\":\"六合彩\",\"豆腐六合彩\":\"六合彩\"}"},],"frontMsg":"","backMsg":""}}
`}
            </code>
          </pre>
        </div>

        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }} className="project-help-interface-machine__tabContent">

          <h3>{t('输入示例')}</h3>
          <pre>
            <code>
              {`data={"content":"麻婆豆腐","bizData":{"业务线数据，可选项","contents":["xxxx","xxx"],"url":"xxx","urls":["xxx"]}}
###注意0："data"为接口默认参数名，"data"的值为具体业务参数`}
            </code>
          </pre>

          <h3>{t('具体业务参数')}</h3>
          <pre>
            <code>
              {`
{
  "bizData": "",
  "content": "",
  "contents": [
    ""
  ],
  "fromId": "",
  "fromIdType": "",
  "id": "",
  "nullObj": "",
  "oid": "",
  "phone": "",
  "tag": "",
  "toId": "",
  "toIdType": "",
  "uid": "",
  "url": "",
  "urls": [
    ""
  ],
  "videoUrl": "",
  "voiceUrl": ""
}
              `}
            </code>
          </pre>

          <div className="project-help-interface-machine__tabContent--table">
            <UseTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }} className="project-help-interface-machine__tabContent">

          <h3>{t('返回示例')}</h3>
          <pre>
            <code>
              {`系统或格式错误：apicode!=200
{"apiCode":999402,"apiMsg":"SERVICE_INVOKE_ERROR"}
正常格式：

{
  "apiCode":200,
  "apiMsg":"OK",
  "data":{
      "code":100001,
      "extendResult":[
          {
              "keyword":"六合彩"
          },
          {
              "keywords":"{"六合彩":"六合彩"}"
          },
          {
              "blockUrls":[
                  "{"http://www.xo7xo7.com/upload/vod/2018-04/152390917815.jpg":"http://www.xo7xo7.com/upload/vod/2018-04/152390917815.jpg"}",
                  "{"http://www.people.com.cn/mediafile/pic/20180317/6/9692527010864580298.jpg":"http://www.people.com.cn/mediafile/pic/20180317/6/9692527010864580298.jpg"}"
              ]
          }
      ],
      "frontMsg":"",
      "backMsg":""
  }
}`}
            </code>
          </pre>

          <h3>{t('返回code定义')}</h3>

          <div className="project-help-interface-machine__tabContent--table">
            <UseTable
              dataSource={backDataSource}
              columns={columns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 3 ? 'block' : 'none' }} className="project-help-interface-machine__tabContent">
          <img src={require('../../../../assets/postman.png')} alt="" />
        </div>
      </div>
    )
  }
}

export default HelpMachine

