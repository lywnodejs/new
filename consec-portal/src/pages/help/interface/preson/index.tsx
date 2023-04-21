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
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '唯一标识'
  },
  {
    text: 'result',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '0表示通过，1表示不通过'
  },
  {
    text: 'reason',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因，可解析为数组（每个场景的审核不通过原因可进行配置）'
  },
  {
    text: 'code',
    name: '内容安全',
    name_class: 'String',
    bool: 'Y',
    remark: '原因对应的code，可解析为数组（每个场景的审核不通过code可进行配置）'
  },
  {
    text: 'xxxx',
    name: '业务方',
    name_class: 'String',
    bool: 'N',
    remark: '可以根据业务需求回调业务字段，一般业务字段是通过机器审核接口传给内容安全人工审核系统可以有多个业务字段，字段与请求时传递字段意义一致，content为文本，url为图片。'
  },
];
const backDataSource = [
  {
    text: 'errno',
    name: '风险项',
    name_class: 'Int',
    bool: 'Y',
    remark: '0表示成功，非0为失败'
  },
  {
    text: 'msg',
    name: '异常状态信息',
    name_class: 'String',
    bool: 'Y',
    remark: '接口返回提示信息'
  }
];
const columns = [
  {
    title: t('回参字段'),
    dataIndex: 'text',
    key: 'text',
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
const backColumns = [
  {
    title: t('字段'),
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: t('类型'),
    dataIndex: 'name_class',
    key: 'name_class',
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

class HelpPerson extends React.Component<IBase, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0,
      tabData: [
        t('接口协议'),
        t('回调接口参数说明'),
        t('回调接口返回结果')
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

  //代码高亮
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
      <div className="project-help-interface-preson">

        <div className="project-help-interface-preson__content">
          <h3>{t('接口说明')}</h3>
        </div>
        <p className="project-help-interface-preson__introduce">
          {t('回调接口是由业务方开发，提供给内容安全部使用，用于把人工审核结果通过回调接口通知给业务方。')}
        </p>

        <div className="project-help-interface-preson__tab">
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
        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }} className="project-help-interface-preson__tabContent">
          <p>{t('请求地址：由业务方提供')}</p>
          <p>{t('请求方法：POST/GET')}</p>
          <p>{t('请求Header：Content-type:application/json')}</p>
          <p>{t('回调接口期待业务方响应结果为json，同时业务方响应header中的content-type需要设置为application/json；期待业务方响应json格式为：')}</p>
          <p>{t('errno主要用于判断是否回调成功，失败（响应报文不包括errno或errno非0或响应为空）后会进行重试，总共会尝试三次。')}</p>

          <p>{t('请求参数')}</p>
          <pre>
            <code>
              {`{
  "result": "0",
  "reason": "[\"正常\"]",
  "urls": "[]",
  "code": "[\"0\"]",
  "id": "testid",
  ...//可选其他业务字段
}`}
            </code>
          </pre>
          <p style={{ marginTop: '20px' }}>{t('业务方响应')}</p>
          <pre>
            <code>
              {`{
  "errno": 0,
  "msg": "成功"
}`}
            </code>
          </pre>
          <code>

          </code>
        </div>

        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }} className="project-help-interface-preson__tabContent">
          <p>{t('可定制业务方期望回调的参数，如机器审核业务字段中包含title ，可以定制回调给业务方的参数中增加 title字段，样例如下：')}</p>
          <div className="project-help-interface-preson__tabContent--table">
            <UseTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

        </div>

        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }} className="project-help-interface-preson__tabContent">
          <pre>
            <code>
              {`{"errno":0,"msg":"成功"}`}
            </code>
          </pre>

          <div className="project-help-interface-preson__tabContent--table">
            <UseTable
              dataSource={backDataSource}
              columns={backColumns}
              pagination={false}
              size='middle'
              bordered={true}
            />
          </div>

          <p style={{ marginTop: '20px' }}>{t('测试样例')}</p>
          <pre>
            <code>
              {`curl -H "Content-type:application/json" -X POST -d '{"result":"0","reason":"[\"正常\"]","urls":"[]","code":"[\"0\"]","id":"testid"}'  http://url（业务方提供）
  
  {
    "errno": 0,
    "msg": "成功"
  }`}
            </code>
          </pre>
        </div>

      </div>
    )
  }
}

export default HelpPerson

