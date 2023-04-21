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
    text: 'complaintUid',
    name: '投诉人id',
    name_class: 'String',
    bool: 'Y',
    remark: '业务字段'
  },
  {
    text: 'uidLatitude',
    name: '用户纬度id',
    name_class: 'String',
    bool: 'Y',
    remark: '用户维度id，由内容安全部提供'
  },
  {
    text: 'type',
    name: '投诉类型',
    name_class: 'String',
    bool: 'Y',
    remark: 'content：投诉类型为内容,user：投诉类型为用户'
  },
  {
    text: 'standard',
    name: '投诉标准',
    name_class: 'StringArray',
    bool: 'Y',
    remark: `时政有害、色情低俗、暴恐血腥、毒品违禁品、不实信息、垃圾广告、作弊内容、其他违规`
  },
  {
    text: 'regard',
    name: '投诉理由',
    name_class: 'String',
    bool: 'N',
    remark: '检测项'
  },
  {
    text: 'proof',
    name: '投诉证据',
    name_class: 'StringArray',
    bool: 'N',
    remark: '截图'
  },
  {
    text: 'complainedUid',
    name: '被投诉人id',
    name_class: 'String',
    bool: 'Y',
    remark: '业务字段'
  },
  {
    text: 'complainedUidLatitude',
    name: '被投诉人用户维度id',
    name_class: 'StringArray',
    bool: 'Y',
    remark: ''
  },
  {
    text: 'content',
    name: '被投诉文本内容（投诉类型是内容）',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'url',
    name: '被投诉图片链接（投诉类型是内容）',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'videoUrl',
    name: '被投诉视频链接（投诉类型是内容）',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'voiceUrl',
    name: '被投诉音频链接（投诉类型是内容）',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'publishTime',
    name: '被投诉内容发布时间（投诉类型是内容）',
    name_class: 'String',
    bool: 'N',
    remark: ''
  },
  {
    text: 'bizData',
    name: '业务数据',
    name_class: 'Json',
    bool: 'Y',
    remark: '业务字段，为了方便扩展，格式为json，可以添加多个自定义字段，安全部内部解析,解析后的业务字段支持加入到人工审核回调参数'
  },
  {
    text: 'contentData',
    name: '内容相关的业务数据',
    name_class: 'Json',
    bool: 'N',
    remark: '投诉内容时必填，用于内容安全根据contentData查询历史数据审核状态'
  },
  {
    text: 'taskData',
    name: '申诉工单业务数据',
    name_class: 'Json',
    bool: 'Y',
    remark: '用于申诉回调给业务方的数据'
  },
];
const backDataSource = [
  {
    text: 'result',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '投诉处置结果：0：不处置 1：处置'
  },
  {
    text: 'reason',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因'
  },
  {
    text: 'code',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因对应的code'
  },
  {
    text: 'bizData',
    name: '业务数据',
    name_class: 'StringArray',
    bool: 'N',
    remark: '业务字段，为了方便扩展，格式为json，可以添加多个自定义字段，安全部内部解析,用来查询内容审核结果信息,解析后的业务字段支持加入到人工审核回调参数'
  },
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
const backColumns = [
  {
    title: t('回参字段'),
    dataIndex: 'text',
    key: 'text',
    width: 150
  },
  {
    title: t('来源'),
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
    title: t('描述'),
    dataIndex: 'remark',
    key: 'remark',
    width: 300
  },
];

interface IState {
  tabData: any,
  tabIndex: Number
}

class HelpComplain extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0,
      tabData: [
        t('调用示例'),
        t('参数详情'),
        t('回调接口参数说明'),
        t('回调接口返回结果')
      ]
    }
  }

  componentDidMount() {
    this.highlightCallBack();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tabIndex: 0,
    })
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
      <div className="project-help-interface-complain">

        <div className="project-help-interface-complain__content">
          <h3>{t('说明')}</h3>
        </div>
        <p className="project-help-interface-complain__introduce">
          {t('内容投诉：用户对违规内容进行投诉。')}<br />
          {t('用户投诉：用户对违规用户进行投诉。')}
        </p>

        <p className="project-help-interface-complain__introduce--title">
          {t('用户投诉流程图')}
          <img src={require('../../../../assets/userliuchentu.png')} alt="" />
        </p>
        <p className="project-help-interface-complain__introduce" style={{ marginBottom: '40px' }}>
          {t('1、用户发起内容投诉或用户投诉后，投诉数据通过业务方同步给内容安全部。')}<br />
          {t('2、业务方需提前处理投诉数据，并按内容安全部数据结构组装投诉数据。')}<br />
          {t('3、内容安全部会针对投诉数据进行相应的处理，需要业务方提供投诉回调接口，内容安全部人工审核后，会把处置结果通过回调接口同步回业务方')}
        </p>

        <p className="project-help-interface-complain__introduce--title">
          {t('内容安全部人工审核流程图')}
          <img style={{ margin: "20px 0 40px 20px" }} src={require('../../../../assets/liuchengtu.png')} alt="" />
        </p>

        <h3>{t('接口说明')}</h3>
        <p className="project-help-interface-complain__introduce">
          {t('接口协议：采用POST方式提交参数，编码采用UTF-8，所有参数不需要进行URLencode')}<br />
          {t('URL参考：http://ip:8000/gateway?api=api&apiVersion=1.0.0')}
        </p>

        <div className="project-help-interface-complain__tab">
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
        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }} className="project-help-interface-complain__tabContent">
          <p>{t('接口协议：采用POST方式提交参数，编码采用UTF-8，所有参数不需要进行URLencod')}</p>
          <p>{t('URL参考：http://ip:8000/gateway?api=api&apiVersion=1.0.0')}</p>

          <h3>{t('示例')}</h3>
          <pre>
            <code className="vim">
              {`单条内容识别：
###请求
curl -H "Content-type:application/json" -X POST -d '

{
"complaintUid":"123",
"uidLatitude":"2",//(需要内容安全部提供固定值，不同场景为不同的维度值)
"type":"content",
"standard":"时政有害",
"regard":"谈及领导人",
"proof":["https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=图片&hs=2&pn=1&spn=0&di=175670&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2534506313%2C1688529724&os=1097436471%2C408122739&simid=3354786982%2C133358663&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=图片&objurl=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fp7rtwg_z%26e3Bkwthj_z%26e3Bv54AzdH3Ftrw1AzdH3Fwn_89_0c_a8naaaaa8m98bm8d8nmm0cmbanmbm_3r2_z%26e3Bip4s&gsm=1&islist=&querylist="], "complainedUid":1231,
"complainedUidLatitude":"4",//需要内容安全部提供固定值，不同场景为不同的维度值)
"content":"六合彩",
"url":"https://image.baidu.com/search/detail?ct=503316480",
"videoUrl":"https://image.baidu.com/search/detail?ct=503316480",
"voiceUrl":"https://image.baidu.com/search/detail?ct=503316480",
"publishTime":"2020-09-17 12:12:12",
"bizData":{
"contentData":{"biz_type":"1","auditType":"2","id":"12423423"},//（投诉内容时必填，用于内容安全根据contentData查询历史数据审核状态，并用于内容管控时回调给业务方，如有不清楚，请联系内容安全部工程同学）
"taskData":{"id":"12423423"}//(投诉工单信息，用于回调给业务方)}
}

' -H "didi-header-rid: 6446a2315976af4756f297987eaa0002"  http://10.88.128.40:8000/sec/consec/open-api/complaint/cs_cc_vtmc
###返回：
系统或格式错误：apicode!=200

{"apiCode":200,"apiMsg":"OK"}`}
            </code>
          </pre>
        </div>

        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }} className="project-help-interface-complain__tabContent">
          <pre>
            <code>
              {`{
    "complaintUid":"123",
    "uidLatitude":"2",
    "type":"content",
    "standard":"时政有害",
    "regard":"谈及领导人",
    "proof":["https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=图片&hs=2&pn=1&spn=0&di=175670&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2534506313%2C1688529724&os=1097436471%2C408122739&simid=3354786982%2C133358663&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=图片&objurl=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fp7rtwg_z%26e3Bkwthj_z%26e3Bv54AzdH3Ftrw1AzdH3Fwn_89_0c_a8naaaaa8m98bm8d8nmm0cmbanmbm_3r2_z%26e3Bip4s&gsm=1&islist=&querylist="],
    "complainedUid":1231,
    "complainedUidLatitude":"4",
    "content":"六合彩",
    "url":"https://image.baidu.com/search/detail?ct=503316480",
    "videoUrl":"https://image.baidu.com/search/detail?ct=503316480",
    "voiceUrl":"https://image.baidu.com/search/detail?ct=503316480",
    "publishTime":"2020-09-17 12:12:12",
    "bizData":{"contentData":{"biz_type":"1","auditType":"2","id":"12423423"},"taskData":{"id":"12423423"}}
}`}
            </code>
          </pre>

          <div className="project-help-interface-complain__tabContent--table">
            <UseTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }} className="project-help-interface-complain__tabContent">

          <h3>{t('回调接口协议')}</h3>
          <p>{t('回调接口使用http协议，支持post/get方式，同时http header中的content-type支持application/x-www-from-urlencoded或者application/json 两种类型；数据直接放在body中回调；')}</p>
          <p>{t('回调接口期待业务方响应结果为json，同时业务方响应header中的content-type需要设置为application/json；期待业务方响应json格式为：{"errno":0,"msg":"成功"}')}</p>
          <p>{t('errno主要用于判断是否回调成功，失败（响应报文不包括errno或errno非0或响应为空）后会进行重试，总共会尝试三次。')}</p>
          <p>{t('建议业务方提供接受post方式的application/json的json格式接口；')}</p>
          <p>{t('可定制业务方期望回调的参数，如机器审核业务字段中包含title ，可以定制回调给业务方的参数中增加 title字段，样例如下：')}</p>
          <pre>
            <code>
              {`1，
{
    "result":0
    "reason":"时政有害",
"code": "60002",
"bizData":{"contentData":{"biz_type":"1","auditType":"2","id":"12423423"},"taskData":{"id":"12423423"}}
 
 
}`}
            </code>
          </pre>

          <div className="project-help-interface-complain__tabContent--table">
            <UseTable
              dataSource={backDataSource}
              columns={backColumns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 3 ? 'block' : 'none' }} className="project-help-interface-complain__tabContent">
          <pre>
            <code>
              {`{"errno":0,"msg":"成功"}`}
            </code>
          </pre>
          <div className="project-help-interface-complain__tabContent--table">
            <UseTable
              dataSource={[
                {
                  text: 'errno',
                  name_class: 'int',
                  bool: 'Y',
                  remark: '0表示成功，非0为失败'
                },
                {
                  text: 'msg',
                  name_class: 'String',
                  bool: 'Y',
                  remark: '接口返回提示信息'
                },
              ]}
              columns={[
                {
                  title: t('字段'),
                  dataIndex: 'text',
                  key: 'text',
                  width: 150
                },
                {
                  title: t('类型'),
                  dataIndex: 'name_class',
                  key: 'name_class',
                },
                {
                  title: t('类型'),
                  dataIndex: 'bool',
                  key: 'bool',
                },
                {
                  title: t('描述'),
                  dataIndex: 'remark',
                  key: 'remark',
                },
              ]}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default HelpComplain

